"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BookingProvider, useBooking } from "@/hooks/use-booking-store";
import { Stepper } from "@/components/ui/stepper";
import { StepService } from "./step-service";
import { StepDatetime } from "./step-datetime";
import { StepClientData } from "./step-client-data";
import { StepAddons } from "./step-addons";
import { StepConfirmation } from "./step-confirmation";
import { BookingSummary } from "./booking-summary";
import { BOOKING_STEPS } from "@/lib/constants";
import type { Service, Addon } from "@prisma/client";
import type { ServiceWithAddons } from "@/lib/types";

interface BookingWizardContentProps {
  services: ServiceWithAddons[];
  addons: Addon[];
}

function WizardContent({ services, addons }: BookingWizardContentProps) {
  const { state, dispatch } = useBooking();
  const searchParams = useSearchParams();

  // Pre-select service from URL
  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    if (serviceId && !state.serviceId) {
      dispatch({ type: "SET_SERVICE", payload: serviceId });
    }
  }, [searchParams, dispatch, state.serviceId]);

  const selectedService = services.find((s) => s.id === state.serviceId);

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <StepService services={services} />;
      case 2:
        return <StepDatetime />;
      case 3:
        return <StepClientData />;
      case 4:
        return (
          <StepAddons service={selectedService || null} allAddons={addons} />
        );
      case 5:
        return (
          <StepConfirmation
            service={selectedService || null}
            allAddons={addons}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-aran py-12">
      <h1 className="text-4xl font-serif font-bold text-center mb-2">
        Reserva tu Cita
      </h1>
      <p className="text-center text-charcoal-700/70 mb-8">
        Tu experiencia premium comienza aquí
      </p>
      <Stepper steps={BOOKING_STEPS} currentStep={state.step} />
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">{renderStep()}</div>
        <div className="hidden lg:block">
          <BookingSummary
            service={selectedService || null}
            allAddons={addons}
          />
        </div>
      </div>
    </div>
  );
}

interface BookingWizardProps {
  services: ServiceWithAddons[];
  addons: Addon[];
}

export function BookingWizard({ services, addons }: BookingWizardProps) {
  return (
    <BookingProvider>
      <WizardContent services={services} addons={addons} />
    </BookingProvider>
  );
}
