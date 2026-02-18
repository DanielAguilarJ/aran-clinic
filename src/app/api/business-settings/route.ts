import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { businessHoursSchema } from "@/lib/validators";
import { z } from "zod/v4";

const businessSettingsSchema = z.object({
  slotIntervalMin: z.coerce.number().min(5).max(120).optional(),
  bookingLeadMin: z.coerce.number().min(0).max(1440).optional(),
  maxAdvanceDays: z.coerce.number().min(1).max(365).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const [settings, hours] = await Promise.all([
    prisma.businessSettings.findFirst(),
    prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    }),
  ]);

  return NextResponse.json({ settings, hours });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();

    if (body.hours) {
      const hoursData = z.array(businessHoursSchema).parse(body.hours);

      await prisma.$transaction(
        hoursData.map((h) =>
          prisma.businessHours.upsert({
            where: { dayOfWeek: h.dayOfWeek },
            update: {
              openTime: h.openTime,
              closeTime: h.closeTime,
              isClosed: h.isClosed,
            },
            create: {
              dayOfWeek: h.dayOfWeek,
              openTime: h.openTime,
              closeTime: h.closeTime,
              isClosed: h.isClosed,
            },
          })
        )
      );
    }

    if (body.settings) {
      const settingsData = businessSettingsSchema.parse(body.settings);

      await prisma.businessSettings.upsert({
        where: { id: "default" },
        update: {
          ...(settingsData.slotIntervalMin !== undefined && {
            slotIntervalMin: settingsData.slotIntervalMin,
          }),
          ...(settingsData.bookingLeadMin !== undefined && {
            bookingLeadMin: settingsData.bookingLeadMin,
          }),
          ...(settingsData.maxAdvanceDays !== undefined && {
            maxAdvanceDays: settingsData.maxAdvanceDays,
          }),
        },
        create: {
          id: "default",
          latitude: 21.92008826,
          longitude: -102.3353936,
          slotIntervalMin: settingsData.slotIntervalMin ?? 30,
          bookingLeadMin: settingsData.bookingLeadMin ?? 60,
          maxAdvanceDays: settingsData.maxAdvanceDays ?? 30,
        },
      });
    }

    const [settings, hours] = await Promise.all([
      prisma.businessSettings.findFirst(),
      prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
    ]);

    return NextResponse.json({ settings, hours });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}
