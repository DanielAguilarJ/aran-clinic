export const dynamic = "force-dynamic";

import { CalendarView } from "@/components/dashboard/calendar-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendario | ARAN CLINIC",
};

export default async function CalendarioPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let serialized: any[] = [];

  try {
    const { prisma } = await import("@/lib/prisma");
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(startOfDay);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: { gte: startOfDay, lt: endOfWeek },
        status: { notIn: ["CANCELLED"] },
      },
      include: {
        user: { select: { name: true, phone: true } },
        service: { select: { name: true, durationMin: true } },
        addons: { include: { addon: { select: { name: true } } } },
      },
      orderBy: { startTime: "asc" },
    });

    serialized = appointments.map((a) => ({
      id: a.id,
      startTime: a.startTime.toISOString(),
      endTime: a.endTime.toISOString(),
      status: a.status,
      totalPrice: Number(a.totalPrice),
      userName: a.user.name,
      userPhone: a.user.phone,
      serviceName: a.service.name,
      durationMin: a.service.durationMin,
      addons: a.addons.map((ad) => ad.addon.name),
    }));
  } catch {
    // Database not available — show empty calendar
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">
        Calendario
      </h1>
      <CalendarView appointments={serialized} />
    </div>
  );
}
