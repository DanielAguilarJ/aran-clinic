import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { addonSchema } from "@/lib/validators";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const addon = await prisma.addon.findUnique({
    where: { id },
    include: {
      recommendedFor: {
        include: { service: true },
      },
    },
  });

  if (!addon) {
    return NextResponse.json(
      { error: "Complemento no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(addon);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await req.json();
    const data = addonSchema.parse(body);

    const addon = await prisma.addon.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMin: data.durationMin,
        type: data.type,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(addon);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error al actualizar complemento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await prisma.addon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Foreign key constraint")
    ) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar el complemento porque tiene citas asociadas",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Error al eliminar complemento" },
      { status: 500 }
    );
  }
}
