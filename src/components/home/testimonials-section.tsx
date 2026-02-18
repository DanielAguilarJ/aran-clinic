"use client";

import { Quote } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";

const testimonials = [
  {
    name: "María G.",
    text: "El mejor salón de Aguascalientes. Siempre salgo encantada con mi cabello. La atención es de primera y el ambiente es hermoso.",
  },
  {
    name: "Laura P.",
    text: "Atención de primera. El ambiente es relajante y acogedor. Mi estilista siempre sabe exactamente lo que necesito.",
  },
  {
    name: "Ana R.",
    text: "Mis uñas nunca se habían visto tan bien. El trabajo es impecable y los productos son de excelente calidad. 100% recomendado.",
  },
  {
    name: "Sofía M.",
    text: "El tratamiento facial fue increíble. Mi piel se siente renovada y luminosa. Ya agendé mi próxima cita.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-aran">
        <AnimatedSection>
          <SectionHeading
            title="Lo que dicen nuestras clientas"
            subtitle="La satisfacción de quienes nos visitan es nuestro mejor reconocimiento"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} delay={index * 0.1}>
              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 h-full flex flex-col">
                <Quote className="w-8 h-8 text-gold-400 mb-4" />
                <p className="text-charcoal-700/80 italic leading-relaxed flex-1 text-sm">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="mt-4 font-semibold text-charcoal-900 text-sm">
                  {testimonial.name}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
