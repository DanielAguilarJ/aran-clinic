"use client";

import { useBooking } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Sparkles, Clock, Zap, Coffee } from "lucide-react";
import type { Addon } from "@prisma/client";
import type { ServiceWithAddons } from "@/lib/types";

interface StepAddonsProps {
  service: ServiceWithAddons | null;
  allAddons: Addon[];
}

const typeIcons: Record<string, typeof Sparkles> = {
  resultado: Sparkles,
  confort: Coffee,
  urgencia: Zap,
};

export function StepAddons({ service, allAddons }: StepAddonsProps) {
  const { state, dispatch } = useBooking();

  // Get recommended addons for this service first
  const recommendedIds =
    service?.recommendedAddons.map((r: { addon: { id: string } }) => r.addon.id) || [];
  const recommended =
    service?.recommendedAddons.map((r: { addon: Addon; urgencyText: string | null; priority: number }) => ({
      ...r.addon,
      urgencyText: r.urgencyText,
      priority: r.priority,
    })) || [];

  const otherAddons = allAddons.filter(
    (a) => !recommendedIds.includes(a.id) && a.isActive
  );

  const allDisplayAddons = [
    ...recommended.sort((a: { priority: number }, b: { priority: number }) => b.priority - a.priority),
    ...otherAddons.map((a: Addon) => ({
      ...a,
      urgencyText: null as string | null,
      priority: 0,
    })),
  ];

  const selectedTotal = allAddons
    .filter((a) => state.selectedAddonIds.includes(a.id))
    .reduce((sum, a) => sum + Number(a.price), 0);

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-2">
        Complementa tu experiencia
      </h2>
      <p className="text-charcoal-700/60 mb-6">
        Nuestras clientas también eligieron estos complementos
      </p>

      <div className="space-y-3">
        {allDisplayAddons.map((addon) => {
          const isSelected = state.selectedAddonIds.includes(addon.id);
          const Icon = typeIcons[addon.type] || Sparkles;

          return (
            <button
              key={addon.id}
              onClick={() =>
                dispatch({ type: "TOGGLE_ADDON", payload: addon.id })
              }
              className={cn(
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200",
                isSelected
                  ? "border-gold-500 bg-gold-50"
                  : "border-gray-200 bg-white hover:border-gold-300"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-gold-500" />
                    <h3 className="font-semibold text-charcoal-900">
                      {addon.name}
                    </h3>
                  </div>
                  <p className="text-sm text-charcoal-700/60 mb-2">
                    {addon.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gold-600">
                      +{formatCurrency(Number(addon.price))}
                    </span>
                    {addon.durationMin > 0 && (
                      <span className="flex items-center gap-1 text-xs text-charcoal-700/50">
                        <Clock className="w-3 h-3" />+
                        {formatDuration(addon.durationMin)}
                      </span>
                    )}
                  </div>
                  {addon.urgencyText && (
                    <p className="mt-2 text-xs text-gold-600 font-medium bg-gold-100 inline-block px-2 py-1 rounded-full">
                      {addon.urgencyText}
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors",
                    isSelected
                      ? "bg-gold-500 border-gold-500"
                      : "border-gray-300"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTotal > 0 && (
        <div className="mt-6 p-4 bg-gold-50 rounded-xl text-center">
          <p className="text-sm text-charcoal-700/70">
            Complementos seleccionados:{" "}
            <span className="font-semibold text-gold-600">
              +{formatCurrency(selectedTotal)}
            </span>
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors"
          >
            Saltar este paso
          </button>
          <Button onClick={() => dispatch({ type: "NEXT_STEP" })}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
