import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");
    const staffId = searchParams.get("staffId") || undefined;

    if (!dateStr || !serviceId) {
      return NextResponse.json(
        { error: "Parámetros date y serviceId son requeridos" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Fecha inválida" },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots(
      date,
      service.durationMin,
      staffId
    );

    return NextResponse.json({
      slots,
      date: dateStr,
      serviceDuration: service.durationMin,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
