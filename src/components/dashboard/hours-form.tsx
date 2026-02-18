"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DayHours {
  dayOfWeek: number;
  dayName: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface BookingSettings {
  slotIntervalMin: number;
  bookingLeadMin: number;
  maxAdvanceDays: number;
}

interface HoursFormProps {
  initialHours: DayHours[];
  initialSettings: BookingSettings;
}

export function HoursForm({ initialHours, initialSettings }: HoursFormProps) {
  const router = useRouter();
  const [hours, setHours] = useState(initialHours);
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateDay = (
    dayOfWeek: number,
    field: keyof DayHours,
    value: string | boolean
  ) => {
    setHours((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d
      )
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/business-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hours: hours.map(({ dayOfWeek, openTime, closeTime, isClosed }) => ({
            dayOfWeek,
            openTime,
            closeTime,
            isClosed,
          })),
          settings,
        }),
      });

      if (!res.ok) throw new Error();

      setSaved(true);
      router.refresh();
    } catch {
      setError("Error al guardar los horarios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hours Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-charcoal-900">
            Horarios por día
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {hours.map((day) => (
            <div
              key={day.dayOfWeek}
              className="p-5 flex items-center gap-6 flex-wrap"
            >
              <div className="w-28 shrink-0">
                <p className="font-medium text-charcoal-900">{day.dayName}</p>
              </div>

              <label className="flex items-center gap-2 shrink-0">
                <input
                  type="checkbox"
                  checked={day.isClosed}
                  onChange={(e) =>
                    updateDay(day.dayOfWeek, "isClosed", e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-charcoal-700">Cerrado</span>
              </label>

              {!day.isClosed && (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={day.openTime}
                    onChange={(e) =>
                      updateDay(day.dayOfWeek, "openTime", e.target.value)
                    }
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  />
                  <span className="text-charcoal-700/40">a</span>
                  <input
                    type="time"
                    value={day.closeTime}
                    onChange={(e) =>
                      updateDay(day.dayOfWeek, "closeTime", e.target.value)
                    }
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-charcoal-900">
            Configuración de reservas
          </h2>
        </div>
        <div className="p-5 grid gap-5 sm:grid-cols-3 max-w-2xl">
          <Input
            label="Intervalo de slots (min)"
            type="number"
            value={settings.slotIntervalMin}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                slotIntervalMin: parseInt(e.target.value) || 30,
              }))
            }
          />
          <Input
            label="Anticipación mínima (min)"
            type="number"
            value={settings.bookingLeadMin}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                bookingLeadMin: parseInt(e.target.value) || 60,
              }))
            }
          />
          <Input
            label="Máx. días anticipación"
            type="number"
            value={settings.maxAdvanceDays}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                maxAdvanceDays: parseInt(e.target.value) || 30,
              }))
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} loading={loading}>
          Guardar cambios
        </Button>
        {saved && (
          <p className="text-sm text-green-600 font-medium">
            Cambios guardados correctamente
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
