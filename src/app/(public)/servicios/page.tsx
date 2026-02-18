export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/services/service-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICE_CATEGORY_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Descubre todos los servicios de belleza y estética que ARAN CLINIC tiene para ti. Cabello, rostro, uñas, maquillaje y más.",
};

export default async function ServiciosPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const grouped = services.reduce(
    (acc, service) => {
      const cat = service.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(service);
      return acc;
    },
    {} as Record<string, typeof services>
  );

  return (
    <div className="py-16">
      <div className="container-aran">
        <SectionHeading
          title="Nuestros Servicios"
          subtitle="Descubre todo lo que tenemos para transformar tu imagen"
        />

        {Object.entries(grouped).map(([category, categoryServices]) => (
          <div key={category} className="mb-16">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-900 mb-8 border-l-4 border-gold-500 pl-4">
              {SERVICE_CATEGORY_LABELS[category] || category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
