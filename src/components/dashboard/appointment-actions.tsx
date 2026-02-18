"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/constants";

interface AppointmentActionsProps {
  id: string;
  currentStatus: string;
}

export function AppointmentActions({ id, currentStatus }: AppointmentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const availableTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
    IN_PROGRESS: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
  };

  const transitions = availableTransitions[currentStatus] || [];

  if (transitions.length === 0) return null;

  return (
    <select
      disabled={loading}
      value=""
      onChange={(e) => {
        if (e.target.value) handleStatusChange(e.target.value);
      }}
      className="text-sm rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-gold-500/30 disabled:opacity-50"
    >
      <option value="">Cambiar estado</option>
      {transitions.map((status) => (
        <option key={status} value={status}>
          {APPOINTMENT_STATUS_LABELS[status] ?? status}
        </option>
      ))}
    </select>
  );
}
