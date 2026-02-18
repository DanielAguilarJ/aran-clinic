import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ARAN CLINIC | Salón de Belleza Premium en Aguascalientes",
    template: "%s | ARAN CLINIC",
  },
  description:
    "Salón de belleza y clínica estética premium en Aguascalientes. Servicios de cabello, rostro, uñas, maquillaje y más. Reserva tu cita en línea.",
  keywords: [
    "salón de belleza Aguascalientes",
    "clínica estética",
    "ARAN CLINIC",
    "corte de cabello Aguascalientes",
    "tratamiento facial",
    "manicure",
    "pedicure",
    "maquillaje profesional",
    "balayage",
    "coloración",
  ],
  openGraph: {
    title: "ARAN CLINIC | Salón de Belleza Premium",
    description: "Tu belleza, nuestra pasión. Reserva en línea.",
    url: "https://aranclinic.com",
    siteName: "ARAN CLINIC",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
