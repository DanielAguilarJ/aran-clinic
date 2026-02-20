export const dynamic = "force-dynamic";

import { MOCK_SERVICES } from "@/lib/mock-data";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { SERVICE_CATEGORY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { ServiceFormModal } from "@/components/dashboard/service-form-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios | ARAN CLINIC",
};

export default async function ServiciosPage() {
  const services = MOCK_SERVICES;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal-900">
          Servicios
        </h1>
        <ServiceFormModal mode="create" />
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-charcoal-900">
                    {service.name}
                  </h3>
                  <Badge variant={service.isActive ? "success" : "neutral"}>
                    {service.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge variant="default">
                    {SERVICE_CATEGORY_LABELS[service.category as string] ??
                      service.category}
                  </Badge>
                </div>
                <p className="text-sm text-charcoal-700/60 mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-charcoal-700/60">
                    {formatDuration(service.durationMin)}
                  </span>
                  <span className="font-semibold text-gold-600">
                    {formatCurrency(Number(service.price))}
                  </span>
                  <span className="text-charcoal-700/40">
                    Orden: {service.sortOrder}
                  </span>
                </div>
                {service.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {service.benefits.map((b: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-cream-100 text-charcoal-700/70 px-2 py-0.5 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
                {service.recommendedAddons.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-charcoal-700/40 mb-1">
                      Complementos recomendados:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.recommendedAddons.map((ra: { addon: { id: string; name: string } }) => (
                        <span
                          key={ra.addon.id}
                          className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full"
                        >
                          {ra.addon.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ServiceFormModal
                mode="edit"
                service={{
                  id: service.id,
                  name: service.name,
                  slug: service.slug,
                  description: service.description,
                  category: service.category as never,
                  durationMin: service.durationMin,
                  price: Number(service.price),
                  benefits: service.benefits,
                  isActive: service.isActive,
                  sortOrder: service.sortOrder,
                }}
              />
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-charcoal-700/50">
            No hay servicios registrados
          </div>
        )}
      </div>
    </div>
  );
}
