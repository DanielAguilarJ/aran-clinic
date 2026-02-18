"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";

interface AppointmentFiltersProps {
  currentStatus: string;
  currentDate: string;
  currentQuery: string;
}

export function AppointmentFilters({
  currentStatus,
  currentDate,
  currentQuery,
}: AppointmentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/citas?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentStatus}
        onChange={(e) => updateFilter("status", e.target.value === "ALL" ? "" : e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
      >
        <option value="ALL">Todos los estados</option>
        {Object.entries(APPOINTMENT_STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={currentDate}
        onChange={(e) => updateFilter("date", e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
      />

      <input
        type="text"
        placeholder="Buscar por nombre o teléfono..."
        defaultValue={currentQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateFilter("q", (e.target as HTMLInputElement).value);
          }
        }}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 min-w-[250px]"
      />

      {(currentStatus !== "ALL" || currentDate || currentQuery) && (
        <button
          onClick={() => router.push("/admin/citas")}
          className="text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors px-3"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
