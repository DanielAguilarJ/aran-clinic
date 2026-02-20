export const dynamic = "force-dynamic";

import { HoursForm } from "@/components/dashboard/hours-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horarios | ARAN CLINIC",
};

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default async function HorariosPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let hours: any[] = [];
  let settings = null;

  try {
    const { prisma } = await import("@/lib/prisma");
    [hours, settings] = await Promise.all([
      prisma.businessHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
      prisma.businessSettings.findFirst(),
    ]);
  } catch {
    // Database not available — use defaults
  }

  const allDays = Array.from({ length: 7 }, (_, i) => {
    const existing = hours.find((h) => h.dayOfWeek === i);
    return {
      dayOfWeek: i,
      dayName: DAY_NAMES[i],
      openTime: existing?.openTime ?? "09:00",
      closeTime: existing?.closeTime ?? "19:00",
      isClosed: existing?.isClosed ?? (i === 0),
    };
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">
        Horarios de atención
      </h1>

      <HoursForm
        initialHours={allDays}
        initialSettings={{
          slotIntervalMin: settings?.slotIntervalMin ?? 30,
          bookingLeadMin: settings?.bookingLeadMin ?? 60,
          maxAdvanceDays: settings?.maxAdvanceDays ?? 30,
        }}
      />
    </div>
  );
}
