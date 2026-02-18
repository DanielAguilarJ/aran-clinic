"use client";

import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatTimeSlot } from "@/lib/utils";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import type { TimeSlot } from "@/lib/types";

export function StepDatetime() {
  const { state, dispatch } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  // Fetch slots when date changes
  useEffect(() => {
    if (!state.selectedDate || !state.serviceId) return;

    setLoading(true);
    fetch(
      `/api/appointments/availability?date=${state.selectedDate}&serviceId=${state.serviceId}`
    )
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [state.selectedDate, state.serviceId]);

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    dispatch({ type: "SET_DATE", payload: dateStr });
  };

  const isDisabled = (date: Date) => {
    return (
      isBefore(date, today) ||
      date > maxDate ||
      date.getDay() === 0 // Sunday
    );
  };

  const morningSlots = slots.filter((s) => {
    const h = parseInt(s.time.split(":")[0]);
    return h < 12;
  });
  const afternoonSlots = slots.filter((s) => {
    const h = parseInt(s.time.split(":")[0]);
    return h >= 12;
  });

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-2">
        Selecciona fecha y hora
      </h2>
      <p className="text-charcoal-700/60 mb-6">
        Elige el día y horario que prefieras
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-semibold text-lg capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((name) => (
              <div
                key={name}
                className="text-center text-xs font-medium text-charcoal-700/50 py-2"
              >
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const selected = state.selectedDate === dateStr;
              const disabled = isDisabled(day) || !isSameMonth(day, monthStart);
              const isToday = isSameDay(day, today);

              return (
                <button
                  key={i}
                  onClick={() => !disabled && handleDateClick(day)}
                  disabled={disabled}
                  className={cn(
                    "h-10 rounded-lg text-sm transition-all",
                    disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gold-100 cursor-pointer",
                    selected && "bg-gold-500 text-white hover:bg-gold-600",
                    isToday && !selected && "ring-2 ring-gold-300",
                    !isSameMonth(day, monthStart) && "opacity-0"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div>
          {!state.selectedDate ? (
            <div className="h-full flex items-center justify-center text-charcoal-700/50">
              <p>Selecciona una fecha para ver los horarios disponibles</p>
            </div>
          ) : loading ? (
            <div className="h-full flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : slots.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <p className="text-charcoal-700/70 mb-2">
                  No hay horarios disponibles para esta fecha.
                </p>
                <p className="text-sm text-charcoal-700/50">
                  Por favor selecciona otra fecha.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {morningSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-charcoal-700/60 mb-3">
                    Mañana
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {morningSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() =>
                          dispatch({
                            type: "SET_TIME",
                            payload: slot.time,
                          })
                        }
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-sm font-medium transition-all",
                          !slot.available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : state.selectedTime === slot.time
                              ? "bg-gold-500 text-white shadow-md"
                              : "bg-white border border-gray-200 text-charcoal-700 hover:border-gold-400"
                        )}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {afternoonSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-charcoal-700/60 mb-3">
                    Tarde
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {afternoonSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() =>
                          dispatch({
                            type: "SET_TIME",
                            payload: slot.time,
                          })
                        }
                        className={cn(
                          "py-2.5 px-3 rounded-xl text-sm font-medium transition-all",
                          !slot.available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : state.selectedTime === slot.time
                              ? "bg-gold-500 text-white shadow-md"
                              : "bg-white border border-gray-200 text-charcoal-700 hover:border-gold-400"
                        )}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          Anterior
        </Button>
        <Button
          disabled={!state.selectedDate || !state.selectedTime}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
