import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactFormSchema.parse(body);

    // For now, just log the contact form submission
    console.log("Contact form submission:", validated);

    return NextResponse.json(
      { message: "Mensaje recibido exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos. Revisa los campos del formulario." },
        { status: 400 }
      );
    }
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}
