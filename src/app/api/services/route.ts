import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serviceSchema } from "@/lib/validators";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      recommendedAddons: {
        include: { addon: true },
      },
    },
  });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category,
        durationMin: data.durationMin,
        price: data.price,
        benefits: data.benefits,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}
