import { NextResponse } from "next/server";
import type { TimeSlot } from "@/lib/types";

function formatLabel(h: number, m: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, "0")} ${period}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!dateStr || !serviceId) {
    return NextResponse.json(
      { error: "Parámetros date y serviceId son requeridos" },
      { status: 400 }
    );
  }

  // Parse date parts to avoid UTC offset shifting the day
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

  // Sunday → no slots
  if (dayOfWeek === 0) {
    return NextResponse.json({ slots: [], date: dateStr });
  }

  // Saturday: 9:00–13:30  |  Mon–Fri: 9:00–18:30
  const endHour = dayOfWeek === 6 ? 14 : 19;

  const slots: TimeSlot[] = [];
  for (let h = 9; h < endHour; h++) {
    for (const m of [0, 30]) {
      const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      slots.push({ time, available: true, label: formatLabel(h, m) });
    }
  }

  return NextResponse.json({ slots, date: dateStr });
}
