import { NextResponse } from "next/server";
import { appointmentCreateSchema } from "@/lib/validators";
import { MOCK_SERVICES, MOCK_ADDONS } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = appointmentCreateSchema.parse(body);

    // Find service from hardcoded catalog
    const service = MOCK_SERVICES.find((s) => s.id === validated.serviceId);
    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Find selected addons
    const selectedAddons = MOCK_ADDONS.filter((a) =>
      validated.addonIds.includes(a.id)
    );

    // Compute start and end times
    const [h, m] = validated.timeSlot.split(":").map(Number);
    const [year, month, day] = validated.date.split("-").map(Number);
    const startTime = new Date(year, month - 1, day, h, m, 0, 0);

    const addonsDuration = selectedAddons.reduce(
      (sum, a) => sum + a.durationMin,
      0
    );
    const totalDuration = service.durationMin + addonsDuration;
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + totalDuration);

    const totalPrice =
      Number(service.price) +
      selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);

    const appointment = {
      id: `appt-${Date.now()}`,
      serviceId: service.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalPrice,
      status: "CONFIRMED",
      notes: validated.notes || null,
    };

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Error al crear la reservación" },
      { status: 500 }
    );
  }
}
