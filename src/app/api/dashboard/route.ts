import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    weeklyAppointments,
    monthlyRevenueResult,
    topServiceResult,
    topAddonResult,
    upcomingAppointments,
  ] = await Promise.all([
    // Weekly appointment count
    prisma.appointment.count({
      where: {
        startTime: { gte: weekStart, lte: weekEnd },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    }),
    // Monthly revenue
    prisma.appointment.aggregate({
      _sum: { totalPrice: true },
      where: {
        startTime: { gte: monthStart, lte: monthEnd },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    }),
    // Top service this month
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
    // Top addon this month
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
    // Upcoming appointments (next 10)
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

  // Resolve top service name
  let topService = null;
  if (topServiceResult.length > 0) {
    const svc = await prisma.service.findUnique({
      where: { id: topServiceResult[0].serviceId },
      select: { name: true },
    });
    topService = svc
      ? { name: svc.name, count: topServiceResult[0]._count.id }
      : null;
  }

  // Resolve top addon name
  let topAddon = null;
  if (topAddonResult.length > 0) {
    const adn = await prisma.addon.findUnique({
      where: { id: topAddonResult[0].addonId },
      select: { name: true },
    });
    topAddon = adn
      ? { name: adn.name, count: topAddonResult[0]._count.id }
      : null;
  }

  return NextResponse.json({
    metrics: {
      weeklyAppointments,
      monthlyRevenue: Number(monthlyRevenueResult._sum.totalPrice ?? 0),
      topService,
      topAddon,
    },
    upcomingAppointments,
  });
}
