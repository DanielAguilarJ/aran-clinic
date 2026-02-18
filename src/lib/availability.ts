import { prisma } from "@/lib/prisma";
import { formatTimeSlot } from "@/lib/utils";
import type { TimeSlot } from "@/lib/types";

export async function getAvailableSlots(
  date: Date,
  serviceDurationMin: number,
  staffId?: string
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay();

  // Get business hours for this day
  const hours = await prisma.businessHours.findUnique({
    where: { dayOfWeek },
  });

  if (!hours || hours.isClosed) return [];

  // Get business settings
  const settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  const slotInterval = settings?.slotIntervalMin ?? 30;
  const bookingLead = settings?.bookingLeadMin ?? 60;

  // Parse open/close times
  const [openH, openM] = hours.openTime.split(":").map(Number);
  const [closeH, closeM] = hours.closeTime.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  // Generate candidate slots
  const candidates: string[] = [];
  for (
    let m = openMinutes;
    m + serviceDurationMin <= closeMinutes;
    m += slotInterval
  ) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    candidates.push(
      `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
    );
  }

  // Get existing appointments for this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.appointment.findMany({
    where: {
      startTime: { lt: endOfDay },
      endTime: { gt: startOfDay },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      ...(staffId ? { staffId } : {}),
    },
    select: { startTime: true, endTime: true },
  });

  // Current time + lead time
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + bookingLead * 60 * 1000);

  // Check each candidate
  const slots: TimeSlot[] = candidates.map((time) => {
    const [h, m] = time.split(":").map(Number);

    const slotStart = new Date(date);
    slotStart.setHours(h, m, 0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + serviceDurationMin);

    // Check if slot is in the past
    if (slotStart < minBookingTime) {
      return { time, available: false, label: formatTimeSlot(time) };
    }

    // Check for overlapping appointments
    const hasConflict = existing.some((appt) => {
      return slotStart < appt.endTime && slotEnd > appt.startTime;
    });

    return {
      time,
      available: !hasConflict,
      label: formatTimeSlot(time),
    };
  });

  return slots;
}

export async function checkSlotAvailability(
  startTime: Date,
  endTime: Date,
  staffId?: string
): Promise<boolean> {
  const count = await prisma.appointment.count({
    where: {
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      ...(staffId ? { staffId } : {}),
    },
  });

  return count === 0;
}
