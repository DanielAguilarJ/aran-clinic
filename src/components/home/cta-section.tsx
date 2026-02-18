"use client";

import Link from "next/link";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { BUSINESS } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="py-24 bg-charcoal-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-3xl" />

      <div className="container-aran relative z-10 text-center">
        <AnimatedSection>
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-white mb-6">
            Tu transformación comienza{" "}
            <span className="text-gold-400">hoy</span>
          </h2>
          <p className="text-lg text-cream-200/70 max-w-2xl mx-auto mb-4">
            Agenda tu cita ahora y vive la experiencia ARAN CLINIC. Cupo
            limitado — reserva tu horario antes de que se agote.
          </p>
          <p className="text-sm text-gold-400/80 mb-10">
            Promo destacada del mes disponible para reservas en línea
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reservar"
              className="btn-primary text-lg px-10 py-4 flex items-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              Reservar ahora
            </Link>
            <a
              href={BUSINESS.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream-200/70 hover:text-green-400 transition-colors font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              O escríbenos por WhatsApp
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
