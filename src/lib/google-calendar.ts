import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { BUSINESS } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/utils";
import type { AppointmentFull } from "@/lib/types";

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return client;
}

export async function createCalendarEvent(
  appointment: AppointmentFull
): Promise<string | null> {
  // Skip if Google Calendar is not configured
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_REFRESH_TOKEN
  ) {
    console.log(
      "Google Calendar not configured, skipping event creation"
    );
    return null;
  }

  try {
    const auth = getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    const addonsText =
      appointment.addons.length > 0
        ? appointment.addons.map((a: { addon: { name: string } }) => a.addon.name).join(", ")
        : "Ninguno";

    const description = [
      `Cliente: ${appointment.user.name}`,
      `Teléfono: ${appointment.user.phone}`,
      appointment.user.email ? `Email: ${appointment.user.email}` : null,
      ``,
      `Servicio: ${appointment.service.name}`,
      `Complementos: ${addonsText}`,
      appointment.notes ? `Notas: ${appointment.notes}` : null,
      `Total: $${appointment.totalPrice} MXN`,
      ``,
      `Ver en dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/admin/citas`,
    ]
      .filter(Boolean)
      .join("\n");

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: {
        summary: `${appointment.service.name} - ${appointment.user.name}`,
        description,
        location: BUSINESS.address,
        start: {
          dateTime: appointment.startTime.toISOString(),
          timeZone: BUSINESS.timezone,
        },
        end: {
          dateTime: appointment.endTime.toISOString(),
          timeZone: BUSINESS.timezone,
        },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 30 }],
        },
      },
    });

    const eventId = event.data.id;

    if (eventId) {
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { googleCalendarEventId: eventId },
      });
    }

    return eventId || null;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return null;
  }
}

export function generateAddToCalendarUrl(appointment: {
  service: { name: string };
  startTime: Date;
  endTime: Date;
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const title = encodeURIComponent(
    `Mi cita en ARAN CLINIC - ${appointment.service.name}`
  );
  const details = encodeURIComponent(
    `Servicio: ${appointment.service.name}\nDirección: ${BUSINESS.address}\nTeléfono: ${BUSINESS.phone}`
  );
  const location = encodeURIComponent(BUSINESS.address);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(appointment.startTime)}/${fmt(appointment.endTime)}&details=${details}&location=${location}`;
}
