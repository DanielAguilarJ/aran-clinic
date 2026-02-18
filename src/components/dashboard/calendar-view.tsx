"use client";

import { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CalendarAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  userName: string;
  userPhone: string;
  serviceName: string;
  durationMin: number;
  addons: string[];
}

interface CalendarViewProps {
  appointments: CalendarAppointment[];
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export function CalendarView({ appointments }: CalendarViewProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selected, setSelected] = useState<CalendarAppointment | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getApptStyle = (appt: CalendarAppointment) => {
    const start = parseISO(appt.startTime);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const top = (startHour - 8) * 64; // 64px per hour
    const height = (appt.durationMin / 60) * 64;
    return { top: `${top}px`, height: `${Math.max(height, 32)}px` };
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 border-green-300 text-green-800";
      case "PENDING":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "COMPLETED":
        return "bg-gray-100 border-gray-300 text-gray-700";
      case "NO_SHOW":
        return "bg-orange-100 border-orange-300 text-orange-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header with week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekStart((prev) => addDays(prev, -7))}
          className="p-2 rounded-lg hover:bg-cream-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-charcoal-700" />
        </button>
        <h2 className="font-medium text-charcoal-900">
          {format(weekStart, "d MMM", { locale: es })} —{" "}
          {format(addDays(weekStart, 6), "d MMM yyyy", { locale: es })}
        </h2>
        <button
          onClick={() => setWeekStart((prev) => addDays(prev, 7))}
          className="p-2 rounded-lg hover:bg-cream-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-charcoal-700" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex">
          {/* Time column */}
          <div className="w-16 shrink-0 border-r border-gray-100">
            <div className="h-12 border-b border-gray-100" />
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-50 flex items-start justify-center pt-1"
              >
                <span className="text-xs text-charcoal-700/40">
                  {hour.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex-1 grid grid-cols-7">
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayAppointments = appointments.filter((a) =>
                isSameDay(parseISO(a.startTime), day)
              );

              return (
                <div
                  key={day.toISOString()}
                  className="border-r border-gray-100 last:border-r-0"
                >
                  {/* Day header */}
                  <div
                    className={cn(
                      "h-12 flex flex-col items-center justify-center border-b border-gray-100 text-xs",
                      isToday && "bg-gold-50"
                    )}
                  >
                    <span className="text-charcoal-700/50 uppercase">
                      {format(day, "EEE", { locale: es })}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        isToday
                          ? "text-gold-600"
                          : "text-charcoal-900"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Time grid */}
                  <div className="relative">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 border-b border-gray-50"
                      />
                    ))}
                    {/* Appointments */}
                    {dayAppointments.map((appt) => {
                      const style = getApptStyle(appt);
                      return (
                        <button
                          key={appt.id}
                          onClick={() => setSelected(appt)}
                          style={style}
                          className={cn(
                            "absolute left-0.5 right-0.5 rounded-lg border px-1.5 py-1 text-left overflow-hidden cursor-pointer transition-opacity hover:opacity-90",
                            statusColor(appt.status)
                          )}
                        >
                          <p className="text-[10px] font-semibold truncate">
                            {appt.userName}
                          </p>
                          <p className="text-[10px] truncate opacity-70">
                            {appt.serviceName}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-4">
              Detalle de cita
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-700/60">Cliente</span>
                <span className="font-medium">{selected.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700/60">Teléfono</span>
                <span>{selected.userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700/60">Servicio</span>
                <span className="font-medium">{selected.serviceName}</span>
              </div>
              {selected.addons.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-charcoal-700/60">Complementos</span>
                  <span>{selected.addons.join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-charcoal-700/60">Hora</span>
                <span>
                  {format(parseISO(selected.startTime), "HH:mm")} —{" "}
                  {format(parseISO(selected.endTime), "HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-700/60">Estado</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full", APPOINTMENT_STATUS_COLORS[selected.status])}>
                  {APPOINTMENT_STATUS_LABELS[selected.status] ?? selected.status}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Total</span>
                <span className="font-bold text-gold-600">
                  {formatCurrency(selected.totalPrice)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-charcoal-700 hover:bg-cream-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
