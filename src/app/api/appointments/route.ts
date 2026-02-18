import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { appointmentCreateSchema } from "@/lib/validators";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (status) {
      if (
        !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
      ) {
        return NextResponse.json(
          { error: "Estado inválido" },
          { status: 400 }
        );
      }
      where.status = status;
    }
    if (from || to) {
      where.startTime = {};
      if (from)
        (where.startTime as Record<string, unknown>).gte = new Date(from);
      if (to)
        (where.startTime as Record<string, unknown>).lte = new Date(to);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        service: true,
        staff: { select: { id: true, name: true } },
        addons: { include: { addon: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = appointmentCreateSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { id: validated.serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Build start time from date + timeSlot
    const [h, m] = validated.timeSlot.split(":").map(Number);
    const startTime = new Date(validated.date);
    startTime.setHours(h, m, 0, 0);

    // Serializable transaction for anti-double-booking
    const appointment = await prisma.$transaction(
      async (tx) => {
        // 1. Fetch addons inside transaction for consistency
        const addons =
          validated.addonIds.length > 0
            ? await tx.addon.findMany({
                where: { id: { in: validated.addonIds } },
              })
            : [];

        const addonsDuration = addons.reduce(
          (sum, a) => sum + a.durationMin,
          0
        );

        // 2. Compute end time with consistent addon data
        const totalDuration = service.durationMin + addonsDuration;
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + totalDuration);

        // 3. Check for conflicts
        const conflicting = await tx.appointment.findFirst({
          where: {
            status: { notIn: ["CANCELLED", "NO_SHOW"] },
            startTime: { lt: endTime },
            endTime: { gt: startTime },
            ...(validated.staffId ? { staffId: validated.staffId } : {}),
          },
        });

        if (conflicting) {
          throw new Error("SLOT_UNAVAILABLE");
        }

        // 4. Find or create user
        const user = await tx.user.upsert({
          where: { phone: validated.phone },
          update: {
            name: validated.name,
            ...(validated.email ? { email: validated.email } : {}),
          },
          create: {
            name: validated.name,
            phone: validated.phone,
            email: validated.email || null,
          },
        });

        // 5. Calculate price
        const totalPrice =
          Number(service.price) +
          addons.reduce((sum, a) => sum + Number(a.price), 0);

        // 6. Create appointment
        const appt = await tx.appointment.create({
          data: {
            userId: user.id,
            serviceId: service.id,
            staffId: validated.staffId || null,
            startTime,
            endTime,
            totalPrice,
            notes: validated.notes || null,
            addons: {
              create: addons.map((a) => ({
                addonId: a.id,
                price: a.price,
              })),
            },
          },
          include: {
            service: true,
            addons: { include: { addon: true } },
            user: {
              select: { id: true, name: true, phone: true, email: true },
            },
            staff: { select: { id: true, name: true } },
          },
        });

        return appt;
      },
      {
        isolationLevel: "Serializable",
      }
    );

    // Post-transaction side effects (non-blocking)
    Promise.allSettled([
      createCalendarEvent(appointment).catch((e) =>
        console.error("Google Calendar error:", e)
      ),
      sendWhatsAppNotification(appointment).catch((e) =>
        console.error("WhatsApp error:", e)
      ),
    ]);

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        {
          error:
            "Lo sentimos, este horario acaba de ser reservado. Por favor selecciona otro.",
          code: "SLOT_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Error al crear la reservación" },
      { status: 500 }
    );
  }
}
