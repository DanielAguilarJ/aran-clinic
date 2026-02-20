export const dynamic = "force-dynamic";

import { formatCurrency, formatDate, formatTimeSlot } from "@/lib/utils";
import {
  APPOINTMENT_STATUS_LABELS,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { AppointmentActions } from "@/components/dashboard/appointment-actions";
import { AppointmentFilters } from "@/components/dashboard/appointment-filters";
import type { Metadata } from "next";
import type { AppointmentStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Citas | ARAN CLINIC",
};

interface CitasPageProps {
  searchParams: Promise<{
    status?: string;
    date?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function CitasPage({ searchParams }: CitasPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const perPage = 20;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appointments: any[] = [];
  let total = 0;

  try {
    const { prisma } = await import("@/lib/prisma");

    const where: Record<string, unknown> = {};

    if (params.status && params.status !== "ALL") {
      where.status = params.status as AppointmentStatus;
    }

    if (params.date) {
      const d = new Date(params.date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      where.startTime = { gte: d, lt: next };
    }

    if (params.q) {
      where.user = {
        OR: [
          { name: { contains: params.q, mode: "insensitive" } },
          { phone: { contains: params.q } },
        ],
      };
    }

    [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
          service: true,
          staff: { select: { id: true, name: true } },
          addons: { include: { addon: true } },
        },
        orderBy: { startTime: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.appointment.count({ where }),
    ]);
  } catch {
    // Database not available — show empty state
  }

  const totalPages = Math.ceil(total / perPage);

  const badgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success" as const;
      case "PENDING":
        return "warning" as const;
      case "IN_PROGRESS":
        return "info" as const;
      case "COMPLETED":
        return "neutral" as const;
      case "CANCELLED":
        return "error" as const;
      case "NO_SHOW":
        return "warning" as const;
      default:
        return "neutral" as const;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal-900">
          Citas
        </h1>
        <p className="text-sm text-charcoal-700/50">{total} citas encontradas</p>
      </div>

      <AppointmentFilters
        currentStatus={params.status || "ALL"}
        currentDate={params.date || ""}
        currentQuery={params.q || ""}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-charcoal-700/50">
            No se encontraron citas con los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-cream-50/50">
                  <th className="text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider px-5 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider px-5 py-3">
                    Servicio
                  </th>
                  <th className="text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider px-5 py-3">
                    Fecha / Hora
                  </th>
                  <th className="text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider px-5 py-3">
                    Total
                  </th>
                  <th className="text-left text-xs font-medium text-charcoal-700/60 uppercase tracking-wider px-5 py-3">
                    Estado
                  </th>
                  <th className="text-right text-xs font-medium text-charcoal-700/60 uppercase tracking-wider px-5 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="hover:bg-cream-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-sm text-charcoal-900">
                        {appt.user.name}
                      </p>
                      <p className="text-xs text-charcoal-700/50">
                        {appt.user.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-charcoal-900">
                        {appt.service.name}
                      </p>
                      {appt.addons.length > 0 && (
                        <p className="text-xs text-charcoal-700/50">
                          +{appt.addons.map((a: { addon: { name: string } }) => a.addon.name).join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-charcoal-900">
                        {formatDate(
                          appt.startTime.toISOString().split("T")[0]
                        )}
                      </p>
                      <p className="text-xs text-charcoal-700/50">
                        {formatTimeSlot(
                          appt.startTime.toTimeString().slice(0, 5)
                        )}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gold-600">
                        {formatCurrency(Number(appt.totalPrice))}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={badgeVariant(appt.status)}>
                        {APPOINTMENT_STATUS_LABELS[appt.status] ?? appt.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <AppointmentActions
                        id={appt.id}
                        currentStatus={appt.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-charcoal-700/50">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/citas?page=${page - 1}${params.status ? `&status=${params.status}` : ""}${params.date ? `&date=${params.date}` : ""}${params.q ? `&q=${params.q}` : ""}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-cream-50 transition-colors"
                >
                  Anterior
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/admin/citas?page=${page + 1}${params.status ? `&status=${params.status}` : ""}${params.date ? `&date=${params.date}` : ""}${params.q ? `&q=${params.q}` : ""}`}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-cream-50 transition-colors"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
