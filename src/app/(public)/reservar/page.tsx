import type { Metadata } from "next";
import { Suspense } from "react";
import { MOCK_SERVICES, MOCK_ADDONS } from "@/lib/mock-data";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Reservar Cita",
  description:
    "Reserva tu cita en ARAN CLINIC. Proceso rápido y sencillo en 5 pasos.",
};

export default async function ReservarPage() {
  const services = MOCK_SERVICES;
  const addons = MOCK_ADDONS;

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
