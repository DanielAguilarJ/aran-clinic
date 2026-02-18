"use client";

import { useBooking } from "@/hooks/use-booking-store";
import { formatCurrency, formatDuration, formatDate, formatTimeSlot } from "@/lib/utils";
import type { Addon } from "@prisma/client";
import type { ServiceWithAddons } from "@/lib/types";

interface BookingSummaryProps {
  service: ServiceWithAddons | null;
  allAddons: Addon[];
}

export function BookingSummary({ service, allAddons }: BookingSummaryProps) {
  const { state } = useBooking();

  const selectedAddons = allAddons.filter((a) =>
    state.selectedAddonIds.includes(a.id)
  );

  const servicePrice = service ? Number(service.price) : 0;
  const addonsPrice = selectedAddons.reduce(
    (sum, a) => sum + Number(a.price),
    0
  );
  const totalPrice = servicePrice + addonsPrice;

  const totalDuration =
    (service?.durationMin || 0) +
    selectedAddons.reduce((sum, a) => sum + a.durationMin, 0);

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="font-serif font-semibold text-lg text-charcoal-900 mb-4">
        Resumen
      </h3>

      <div className="space-y-4 text-sm">
        {service && (
          <div>
            <p className="text-charcoal-700/50 text-xs mb-1">Servicio</p>
            <p className="font-medium">{service.name}</p>
            <div className="flex justify-between text-charcoal-700/60 mt-1">
              <span>{formatDuration(service.durationMin)}</span>
              <span>{formatCurrency(servicePrice)}</span>
            </div>
          </div>
        )}

        {state.selectedDate && (
          <div>
            <p className="text-charcoal-700/50 text-xs mb-1">Fecha</p>
            <p className="font-medium capitalize">
              {formatDate(state.selectedDate)}
            </p>
          </div>
        )}

        {state.selectedTime && (
          <div>
            <p className="text-charcoal-700/50 text-xs mb-1">Hora</p>
            <p className="font-medium">
              {formatTimeSlot(state.selectedTime)}
            </p>
          </div>
        )}

        {state.clientName && (
          <div>
            <p className="text-charcoal-700/50 text-xs mb-1">Cliente</p>
            <p className="font-medium">{state.clientName}</p>
          </div>
        )}

        {selectedAddons.length > 0 && (
          <div>
            <p className="text-charcoal-700/50 text-xs mb-1">
              Complementos
            </p>
            {selectedAddons.map((addon) => (
              <div
                key={addon.id}
                className="flex justify-between text-charcoal-700/60"
              >
                <span>{addon.name}</span>
                <span>+{formatCurrency(Number(addon.price))}</span>
              </div>
            ))}
          </div>
        )}

        {service && (
          <>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-charcoal-900">Total</span>
                <span className="font-bold text-xl text-gold-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-charcoal-700/50 mt-1">
                Duración total: {formatDuration(totalDuration)}
              </p>
            </div>

            <p className="text-xs text-center text-gold-600/80 italic">
              Estás a un paso de tu transformación
            </p>
          </>
        )}

        {!service && (
          <p className="text-charcoal-700/40 text-center py-4">
            Selecciona un servicio para comenzar
          </p>
        )}
      </div>
    </div>
  );
}
