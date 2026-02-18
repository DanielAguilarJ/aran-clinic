export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/hero-section";
import { WhyAranSection } from "@/components/home/why-aran-section";
import { ServicesPreview } from "@/components/home/services-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";
import { BUSINESS } from "@/lib/constants";

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "ARAN CLINIC",
    description:
      "Salón de belleza y clínica estética premium en Aguascalientes.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Eugenio Garza Sada 224",
      addressLocality: "Aguascalientes",
      addressRegion: "Aguascalientes",
      postalCode: "20328",
      addressCountry: "MX",
    },
    telephone: "+524494346003",
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.lat,
      longitude: BUSINESS.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "15:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <WhyAranSection />
      <ServicesPreview services={services} />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
