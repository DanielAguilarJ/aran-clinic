import { formatDate, formatTime } from "@/lib/utils";
import type { AppointmentFull } from "@/lib/types";

export async function sendWhatsAppNotification(
  appointment: AppointmentFull
): Promise<void> {
  // Skip if WhatsApp is not configured
  if (
    !process.env.WHATSAPP_ACCESS_TOKEN ||
    !process.env.WHATSAPP_PHONE_NUMBER_ID
  ) {
    console.log(
      "WhatsApp not configured, skipping notification"
    );
    return;
  }

  const addonsText =
    appointment.addons.length > 0
      ? appointment.addons.map((a) => a.addon.name).join(", ")
      : "Ninguno";

  const messageBody = [
    `*Nueva reservación en ARAN CLINIC*`,
    ``,
    `*Cliente:* ${appointment.user.name}`,
    `*Teléfono:* ${appointment.user.phone}`,
    `*Servicio:* ${appointment.service.name}`,
    `*Complementos:* ${addonsText}`,
    `*Fecha:* ${formatDate(appointment.startTime)}`,
    `*Hora:* ${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`,
    `*Total:* $${appointment.totalPrice} MXN`,
    ``,
    `Ver detalles: ${process.env.NEXT_PUBLIC_APP_URL}/admin/citas`,
  ].join("\n");

  try {
    const response = await fetch(
      `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_SALON_PHONE,
          type: "text",
          text: { body: messageBody },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WhatsApp notification failed:", errorText);
    }
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    // Don't throw — notification failure should not block booking
  }
}
