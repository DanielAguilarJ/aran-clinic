import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GoogleMapEmbed } from "@/components/shared/google-map-embed";
import { BUSINESS } from "@/lib/constants";
import { Sparkles, Lightbulb, Heart, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia y filosofía de ARAN CLINIC, tu salón de belleza premium en Aguascalientes.",
};

const pillars = [
  {
    icon: Sparkles,
    title: "Excelencia",
    description:
      "Nos comprometemos con los más altos estándares de calidad en cada servicio. Cada detalle importa y cada resultado debe superar tus expectativas.",
  },
  {
    icon: Lightbulb,
    title: "Innovación",
    description:
      "Estamos a la vanguardia de las últimas técnicas y tendencias en belleza. Nuestro equipo se capacita constantemente para ofrecerte lo mejor.",
  },
  {
    icon: Heart,
    title: "Calidez",
    description:
      "Más que un salón, somos un espacio donde te sentirás como en casa. La atención personalizada y el trato humano son nuestra esencia.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="py-16">
      <div className="container-aran">
        {/* Historia */}
        <section className="mb-20">
          <SectionHeading
            title="Nuestra Historia"
            subtitle="Pasión por la belleza desde Aguascalientes para ti"
          />
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-charcoal-700/80 leading-relaxed mb-6">
              ARAN CLINIC nació con una visión clara: crear un espacio donde la
              belleza y el bienestar se fusionen en una experiencia
              incomparable. Ubicados en el corazón de Aguascalientes, nos hemos
              convertido en el destino preferido de quienes buscan un servicio
              de belleza profesional, personalizado y con resultados visibles.
            </p>
            <p className="text-charcoal-700/80 leading-relaxed mb-8">
              Nuestro equipo de profesionales certificados trabaja con pasión y
              dedicación para que cada visita sea única. Utilizamos productos de
              alta gama y técnicas innovadoras para garantizar tu satisfacción.
            </p>
            <blockquote className="font-serif text-2xl italic text-gold-600 border-l-4 border-gold-500 pl-6 text-left">
              &ldquo;Creemos que cada persona merece sentirse
              extraordinaria.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Filosofía */}
        <section className="mb-20">
          <SectionHeading
            title="Nuestra Filosofía"
            subtitle="Los pilares que guían todo lo que hacemos"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="text-center p-8 rounded-2xl bg-white shadow-md"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-100 text-gold-600 mb-6">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl text-charcoal-900 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-charcoal-700/70 leading-relaxed text-sm">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mapa */}
        <section>
          <SectionHeading
            title="Visítanos"
            subtitle="Te esperamos en nuestra ubicación"
          />
          <GoogleMapEmbed className="mb-6" />
          <div className="text-center space-y-3">
            <p className="flex items-center justify-center gap-2 text-charcoal-700">
              <MapPin className="w-5 h-5 text-gold-500" />
              {BUSINESS.address}
            </p>
            <p className="flex items-center justify-center gap-2 text-charcoal-700">
              <Phone className="w-5 h-5 text-gold-500" />
              <a
                href={`tel:+52${BUSINESS.phone.replace(/\s/g, "")}`}
                className="hover:text-gold-600 transition-colors"
              >
                {BUSINESS.phone}
              </a>
            </p>
            <a
              href={BUSINESS.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-gold-600 font-medium hover:text-gold-700 transition-colors"
            >
              Cómo llegar →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
