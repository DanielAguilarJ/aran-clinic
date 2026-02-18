"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { SERVICE_CATEGORY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@prisma/client";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="card-aran h-full flex flex-col">
      <div className="h-36 bg-gradient-to-br from-gold-100 via-cream-100 to-gold-50 flex items-end p-6">
        <Badge variant="default">
          {SERVICE_CATEGORY_LABELS[service.category] || service.category}
        </Badge>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-serif font-semibold text-xl text-charcoal-900 mb-2">
          {service.name}
        </h3>
        <p className="text-sm text-charcoal-700/70 mb-4 flex-1">
          {service.description}
        </p>

        {service.benefits.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {service.benefits.slice(0, 3).map((benefit) => (
              <li
                key={benefit}
                className="text-xs text-charcoal-700/60 flex items-start gap-2"
              >
                <span className="text-gold-500 mt-0.5">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-charcoal-700/60">
            <Clock className="w-4 h-4" />
            {formatDuration(service.durationMin)}
          </div>
          <span className="font-semibold text-xl text-gold-600">
            {formatCurrency(Number(service.price))}
          </span>
        </div>

        <Link
          href={`/reservar?serviceId=${service.id}`}
          className="btn-primary text-sm py-2.5 text-center w-full"
        >
          Reservar este servicio
        </Link>
      </div>
    </div>
  );
}
