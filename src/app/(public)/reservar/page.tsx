export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Reservar Cita",
  description:
    "Reserva tu cita en ARAN CLINIC. Proceso rápido y sencillo en 5 pasos.",
};

export default async function ReservarPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let services: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let addons: any[] = [];
  try {
    [services, addons] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          recommendedAddons: {
            include: { addon: true },
            orderBy: { priority: "desc" },
          },
        },
      }),
      prisma.addon.findMany({
        where: { isActive: true },
      }),
    ]);
  } catch {
    // Database not available, render booking page with empty data
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <BookingWizard services={services} addons={addons} />
    </Suspense>
  );
}
