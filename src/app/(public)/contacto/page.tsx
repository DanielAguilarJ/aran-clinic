import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GoogleMapEmbed } from "@/components/shared/google-map-embed";
import { ContactForm } from "@/components/contact/contact-form";
import { BUSINESS } from "@/lib/constants";
import { Phone, MapPin, Mail, MessageCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos en ARAN CLINIC. Estamos para atenderte en Aguascalientes. Llámanos, escríbenos por WhatsApp o visítanos.",
};

export default function ContactoPage() {
  return (
    <div className="py-16">
      <div className="container-aran">
        <SectionHeading
          title="Contáctanos"
          subtitle="Estamos para atenderte. Escríbenos y te responderemos lo antes posible."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-6">
              Envíanos un mensaje
            </h3>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-6">
              Información de contacto
            </h3>
            <div className="space-y-6 mb-8">
              <a
                href={`tel:+52${BUSINESS.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-700/60">Teléfono</p>
                  <p className="font-medium text-charcoal-900">
                    {BUSINESS.phone}
                  </p>
                </div>
              </a>

              <a
                href={BUSINESS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-700/60">WhatsApp</p>
                  <p className="font-medium text-charcoal-900">
                    Escríbenos por WhatsApp
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-700/60">
                    Correo electrónico
                  </p>
                  <p className="font-medium text-charcoal-900">
                    {BUSINESS.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-700/60">Dirección</p>
                  <p className="font-medium text-charcoal-900">
                    {BUSINESS.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-sm text-charcoal-700/60">Horario</p>
                  <p className="font-medium text-charcoal-900">
                    Lunes a Viernes: 9:00 AM - 7:00 PM
                  </p>
                  <p className="font-medium text-charcoal-900">
                    Sábado: 9:00 AM - 3:00 PM
                  </p>
                </div>
              </div>
            </div>

            <GoogleMapEmbed height={250} />
          </div>
        </div>
      </div>
    </div>
  );
}
