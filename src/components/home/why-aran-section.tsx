"use client";

import { Sparkles, Award, Star, Heart } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    icon: Sparkles,
    title: "Experiencia Premium",
    description:
      "Cada visita es una experiencia de lujo personalizada. Nos enfocamos en cada detalle para que te sientas extraordinaria.",
  },
  {
    icon: Award,
    title: "Profesionales Certificados",
    description:
      "Equipo capacitado con las últimas técnicas y tendencias internacionales en belleza y cuidado personal.",
  },
  {
    icon: Star,
    title: "Productos de Alta Gama",
    description:
      "Utilizamos solo las mejores marcas del mercado para garantizar resultados visibles y duraderos.",
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    description:
      "Nos adaptamos a tus necesidades únicas. Tu satisfacción y bienestar son nuestra prioridad.",
  },
];

export function WhyAranSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-aran">
        <AnimatedSection>
          <SectionHeading
            title="¿Por qué elegirnos?"
            subtitle="En ARAN CLINIC combinamos experiencia, productos premium y un trato cálido para que cada visita sea inolvidable"
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl hover:bg-cream-50 transition-colors">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-100 text-gold-600 mb-5">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-charcoal-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-700/70 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
