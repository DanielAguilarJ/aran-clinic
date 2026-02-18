"use client";

import { useBooking } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { SERVICE_CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ServiceWithAddons } from "@/lib/types";

interface StepServiceProps {
  services: ServiceWithAddons[];
}

export function StepService({ services }: StepServiceProps) {
  const { state, dispatch } = useBooking();

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-2">
        Elige tu servicio
      </h2>
      <p className="text-charcoal-700/60 mb-6">
        Selecciona el servicio que deseas agendar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() =>
              dispatch({ type: "SET_SERVICE", payload: service.id })
            }
            className={cn(
              "text-left p-5 rounded-2xl border-2 transition-all duration-200",
              state.serviceId === service.id
                ? "border-gold-500 bg-gold-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gold-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <Badge variant="default" className="text-xs">
                {SERVICE_CATEGORY_LABELS[service.category] ||
                  service.category}
              </Badge>
              <span className="font-semibold text-gold-600">
                {formatCurrency(Number(service.price))}
              </span>
            </div>
            <h3 className="font-serif font-semibold text-lg text-charcoal-900 mb-1">
              {service.name}
            </h3>
            <p className="text-sm text-charcoal-700/60 mb-3 line-clamp-2">
              {service.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-700/50">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(service.durationMin)}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          disabled={!state.serviceId}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
