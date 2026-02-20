export const dynamic = "force-dynamic";

import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { formatCurrency, formatDate, formatTimeSlot } from "@/lib/utils";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from "@/lib/constants";
import { CalendarDays, DollarSign, Scissors, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | ARAN CLINIC",
};

export default async function AdminDashboardPage() {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  let weeklyAppointments = 0;
  let monthlyRevenue = 0;
  let topServiceName = "—";
  let topServiceCount = 0;
  let topAddonName = "—";
  let topAddonCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let upcomingAppointments: any[] = [];

  try {
    const { prisma } = await import("@/lib/prisma");
    const [
      weeklyCount,
      monthlyRevenueResult,
      topServiceResult,
      topAddonResult,
      upcoming,
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          startTime: { gte: weekStart, lte: weekEnd },
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      }),
      prisma.appointment.aggregate({
        _sum: { totalPrice: true },
        where: {
          startTime: { gte: monthStart, lte: monthEnd },
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
      }),
      prisma.appointment.groupBy({
        by: ["serviceId"],
        _count: { id: true },
        where: {
          startTime: { gte: monthStart, lte: monthEnd },
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
      prisma.appointmentAddon.groupBy({
        by: ["addonId"],
        _count: { id: true },
        where: {
          appointment: {
            startTime: { gte: monthStart, lte: monthEnd },
            status: { notIn: ["CANCELLED", "NO_SHOW"] },
          },
        },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
      prisma.appointment.findMany({
        where: {
          startTime: { gte: now },
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
        },
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
          service: true,
          staff: { select: { id: true, name: true } },
          addons: { include: { addon: true } },
        },
        orderBy: { startTime: "asc" },
        take: 10,
      }),
    ]);

    weeklyAppointments = weeklyCount;
    monthlyRevenue = Number(monthlyRevenueResult._sum.totalPrice ?? 0);
    upcomingAppointments = upcoming;

    if (topServiceResult.length > 0) {
      const svc = await prisma.service.findUnique({
        where: { id: topServiceResult[0].serviceId },
        select: { name: true },
      });
      if (svc) {
        topServiceName = svc.name;
        topServiceCount = topServiceResult[0]._count.id;
      }
    }

    if (topAddonResult.length > 0) {
      const adn = await prisma.addon.findUnique({
        where: { id: topAddonResult[0].addonId },
        select: { name: true },
      });
      if (adn) {
        topAddonName = adn.name;
        topAddonCount = topAddonResult[0]._count.id;
      }
    }
  } catch {
    // Database not available — show empty state
  }

  const metrics = [
    {
      label: "Citas esta semana",
      value: weeklyAppointments.toString(),
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Ingresos del mes",
      value: formatCurrency(monthlyRevenue),
      icon: DollarSign,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Servicio top",
      value: topServiceName,
      subtitle: topServiceCount > 0 ? `${topServiceCount} citas` : undefined,
      icon: Scissors,
      color: "text-gold-600 bg-gold-50",
    },
    {
      label: "Complemento top",
      value: topAddonName,
      subtitle: topAddonCount > 0 ? `${topAddonCount} veces` : undefined,
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-6">
        Dashboard
      </h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm text-charcoal-700/60">{m.label}</span>
              </div>
              <p className="text-2xl font-bold text-charcoal-900">{m.value}</p>
              {m.subtitle && (
                <p className="text-xs text-charcoal-700/50 mt-1">
                  {m.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-charcoal-900">
            Próximas citas
          </h2>
        </div>
        {upcomingAppointments.length === 0 ? (
          <div className="p-8 text-center text-charcoal-700/50">
            No hay citas próximas
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-5 flex items-center justify-between hover:bg-cream-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-charcoal-900 truncate">
                      {appt.user.name}
                    </p>
                    <Badge
                      variant={
                        appt.status === "CONFIRMED"
                          ? "success"
                          : appt.status === "PENDING"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {APPOINTMENT_STATUS_LABELS[appt.status] ?? appt.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-charcoal-700/60">
                    {appt.service.name}
                    {appt.addons.length > 0 &&
                      ` + ${appt.addons.map((a: { addon: { name: string } }) => a.addon.name).join(", ")}`}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-medium text-charcoal-900">
                    {formatDate(appt.startTime.toISOString().split("T")[0])}
                  </p>
                  <p className="text-sm text-charcoal-700/60">
                    {formatTimeSlot(
                      appt.startTime.toTimeString().slice(0, 5)
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gold-600 mt-1">
                    {formatCurrency(Number(appt.totalPrice))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
