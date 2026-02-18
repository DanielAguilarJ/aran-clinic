"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDuration, formatDate, formatTimeSlot, generateCalendarUrl } from "@/lib/utils";
import { BUSINESS } from "@/lib/constants";
import { Check, Calendar, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Addon } from "@prisma/client";
import type { ServiceWithAddons } from "@/lib/types";

interface StepConfirmationProps {
  service: ServiceWithAddons | null;
  allAddons: Addon[];
}

export function StepConfirmation({ service, allAddons }: StepConfirmationProps) {
  const { state, dispatch } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);

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

  const handleConfirm = async () => {
    if (!service || !state.selectedDate || !state.selectedTime) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: state.serviceId,
          date: state.selectedDate,
          timeSlot: state.selectedTime,
          name: state.clientName,
          phone: state.clientPhone,
          email: state.clientEmail,
          notes: state.notes,
          addonIds: state.selectedAddonIds,
        }),
      });

      if (res.status === 409) {
        setError(
          "Este horario acaba de ser reservado. Por favor regresa y selecciona otro."
        );
        return;
      }

      if (!res.ok) throw new Error("Error al crear la reservación");

      const data = await res.json();

      // Generate calendar URL
      const appt = data.appointment;
      const url = generateCalendarUrl({
        title: `Mi cita en ARAN CLINIC - ${service.name}`,
        description: `Servicio: ${service.name}\nDirección: ${BUSINESS.address}\nTeléfono: ${BUSINESS.phone}`,
        location: BUSINESS.address,
        startTime: new Date(appt.startTime),
        endTime: new Date(appt.endTime),
      });
      setCalendarUrl(url);
      setSuccess(true);
    } catch {
      setError("Ocurrió un error. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>

        <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-3">
          ¡Reservación Confirmada!
        </h2>
        <p className="text-charcoal-700/70 mb-8 max-w-md mx-auto">
          Tu cita en ARAN CLINIC ha sido agendada exitosamente. Te
          esperamos.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6 max-w-md mx-auto mb-8 text-left">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-charcoal-700/60">Servicio</span>
              <span className="text-sm font-medium">{service?.name}</span>
            </div>
            {selectedAddons.length > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-charcoal-700/60">
                  Complementos
                </span>
                <span className="text-sm font-medium">
                  {selectedAddons.map((a) => a.name).join(", ")}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-charcoal-700/60">Fecha</span>
              <span className="text-sm font-medium">
                {state.selectedDate
                  ? formatDate(state.selectedDate)
                  : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-charcoal-700/60">Hora</span>
              <span className="text-sm font-medium">
                {state.selectedTime
                  ? formatTimeSlot(state.selectedTime)
                  : ""}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold text-gold-600 text-lg">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Agregar a mi calendario
            </a>
          )}
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "RESET" })}
          >
            Agendar otra cita
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-2">
        Confirma tu reservación
      </h2>
      <p className="text-charcoal-700/60 mb-6">
        Revisa los detalles antes de confirmar
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {/* Service */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-700/50 mb-1">Servicio</p>
            <p className="font-medium">{service?.name}</p>
            <p className="text-sm text-charcoal-700/60">
              {service ? formatDuration(service.durationMin) : ""} —{" "}
              {formatCurrency(servicePrice)}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
            className="p-2 text-charcoal-700/40 hover:text-gold-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Date/Time */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-700/50 mb-1">
              Fecha y hora
            </p>
            <p className="font-medium">
              {state.selectedDate ? formatDate(state.selectedDate) : ""}
            </p>
            <p className="text-sm text-charcoal-700/60">
              {state.selectedTime
                ? formatTimeSlot(state.selectedTime)
                : ""}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
            className="p-2 text-charcoal-700/40 hover:text-gold-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Client data */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal-700/50 mb-1">
              Datos de contacto
            </p>
            <p className="font-medium">{state.clientName}</p>
            <p className="text-sm text-charcoal-700/60">
              {state.clientPhone}
              {state.clientEmail ? ` · ${state.clientEmail}` : ""}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
            className="p-2 text-charcoal-700/40 hover:text-gold-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Addons */}
        {selectedAddons.length > 0 && (
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal-700/50 mb-1">
                Complementos
              </p>
              {selectedAddons.map((addon) => (
                <p key={addon.id} className="text-sm">
                  {addon.name} — {formatCurrency(Number(addon.price))}
                </p>
              ))}
            </div>
            <button
              onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}
              className="p-2 text-charcoal-700/40 hover:text-gold-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Total */}
        <div className="p-5 bg-cream-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-charcoal-900">Total</p>
              <p className="text-xs text-charcoal-700/50">
                Duración total: {formatDuration(totalDuration)}
              </p>
            </div>
            <p className="font-bold text-2xl text-gold-600">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          Anterior
        </Button>
        <Button onClick={handleConfirm} loading={loading} size="lg">
          Confirmar Reservación
        </Button>
      </div>
    </div>
  );
}
