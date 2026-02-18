export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddonFormModal } from "@/components/dashboard/addon-form-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complementos | ARAN CLINIC",
};

export default async function ComplementosPage() {
  const addons = await prisma.addon.findMany({
    orderBy: { name: "asc" },
    include: {
      recommendedFor: {
        include: { service: { select: { name: true } } },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal-900">
          Complementos
        </h1>
        <AddonFormModal mode="create" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-charcoal-900">
                    {addon.name}
                  </h3>
                  <Badge variant={addon.isActive ? "success" : "neutral"}>
                    {addon.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <p className="text-sm text-charcoal-700/60 mb-3">
                  {addon.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gold-600">
                    {formatCurrency(Number(addon.price))}
                  </span>
                  {addon.durationMin > 0 && (
                    <span className="text-charcoal-700/50">
                      +{formatDuration(addon.durationMin)}
                    </span>
                  )}
                  <span className="text-xs bg-cream-100 text-charcoal-700/60 px-2 py-0.5 rounded-full">
                    {addon.type}
                  </span>
                </div>
                {addon.recommendedFor.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-charcoal-700/40 mb-1">
                      Recomendado en:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {addon.recommendedFor.map((r) => (
                        <span
                          key={r.id}
                          className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full"
                        >
                          {r.service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <AddonFormModal
                mode="edit"
                addon={{
                  id: addon.id,
                  name: addon.name,
                  description: addon.description,
                  price: Number(addon.price),
                  durationMin: addon.durationMin,
                  type: addon.type,
                  isActive: addon.isActive,
                }}
              />
            </div>
          </div>
        ))}

        {addons.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-12 text-center text-charcoal-700/50">
            No hay complementos registrados
          </div>
        )}
      </div>
    </div>
  );
}
