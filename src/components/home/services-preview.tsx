"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { SERVICE_CATEGORY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@prisma/client";

interface ServicesPreviewProps {
  services: Service[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section className="py-24 bg-cream-50">
      <div className="container-aran">
        <AnimatedSection>
          <SectionHeading
            title="Nuestros Servicios"
            subtitle="Descubre todo lo que tenemos para transformar tu imagen y hacerte sentir increíble"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection key={service.id} delay={index * 0.1}>
              <div className="card-aran h-full flex flex-col">
                <div className="h-32 bg-gradient-to-br from-gold-100 via-cream-100 to-gold-50 flex items-end p-6">
                  <Badge variant="default">
                    {SERVICE_CATEGORY_LABELS[service.category] ||
                      service.category}
                  </Badge>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif font-semibold text-xl text-charcoal-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-charcoal-700/70 mb-4 line-clamp-2 flex-1">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-charcoal-700/60">
                      <Clock className="w-4 h-4" />
                      {formatDuration(service.durationMin)}
                    </div>
                    <span className="font-semibold text-lg text-gold-600">
                      {formatCurrency(Number(service.price))}
                    </span>
                  </div>

                  <Link
                    href={`/reservar?serviceId=${service.id}`}
                    className="btn-primary text-sm py-2.5 text-center w-full"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="text-center mt-12">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-gold-600 font-medium hover:text-gold-700 transition-colors"
            >
              Ver todos los servicios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
