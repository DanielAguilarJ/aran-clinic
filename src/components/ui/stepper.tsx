"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  description: string;
}

interface StepperProps {
  steps: readonly Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                  currentStep > step.id
                    ? "bg-gold-500 text-white"
                    : currentStep === step.id
                      ? "bg-gold-500 text-white ring-4 ring-gold-100"
                      : "bg-gray-200 text-gray-500"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  currentStep >= step.id
                    ? "text-gold-700"
                    : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-20 h-0.5 mx-2 transition-colors duration-300",
                  currentStep > step.id ? "bg-gold-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gold-700">
            Paso {currentStep} de {steps.length}
          </span>
          <span className="text-sm text-charcoal-700/70">
            {steps.find((s) => s.id === currentStep)?.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gold-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
