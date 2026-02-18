import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        service: true,
        staff: { select: { id: true, name: true } },
        addons: { include: { addon: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (
        !VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])
      ) {
        return NextResponse.json(
          { error: "Estado inválido" },
          { status: 400 }
        );
      }
      data.status = body.status;
    }

    if (body.notes !== undefined) {
      if (typeof body.notes !== "string") {
        return NextResponse.json(
          { error: "Notas debe ser texto" },
          { status: 400 }
        );
      }
      data.notes = body.notes;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        service: true,
        staff: { select: { id: true, name: true } },
        addons: { include: { addon: true } },
      },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Error al actualizar la cita" },
      { status: 500 }
    );
  }
}
