import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { addonSchema } from "@/lib/validators";

export async function GET() {
  const addons = await prisma.addon.findMany({
    orderBy: { name: "asc" },
    include: {
      recommendedFor: {
        include: { service: true },
      },
    },
  });
  return NextResponse.json(addons);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const data = addonSchema.parse(body);

    const addon = await prisma.addon.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        durationMin: data.durationMin,
        type: data.type,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(addon, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error al crear complemento" },
      { status: 500 }
    );
  }
}
