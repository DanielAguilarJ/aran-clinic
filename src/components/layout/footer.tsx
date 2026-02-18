import Link from "next/link";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-cream-100">
      <div className="container-aran py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* -- Brand column -- */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              {BUSINESS.name}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-cream-200/70">
              Tu belleza, nuestra pasión. Ofrecemos servicios premium de belleza
              y estética en un ambiente exclusivo.
            </p>
          </div>

          {/* -- Navigation column -- */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white">
              Navegación
            </h4>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-200/70 transition-colors hover:text-gold-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* -- Contact column -- */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-200/70">
              <li>
                <a
                  href={`tel:+52${BUSINESS.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold-primary"
                >
                  Tel: {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="transition-colors hover:text-gold-primary"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-primary"
                >
                  {BUSINESS.shortAddress}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* -- Bottom copyright bar -- */}
      <div className="border-t border-white/10">
        <div className="container-aran flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream-200/50 sm:flex-row">
          <p>&copy; {year} {BUSINESS.name}. Todos los derechos reservados.</p>
          <p>
            Hecho con dedicación en Aguascalientes
          </p>
        </div>
      </div>
    </footer>
  );
}
