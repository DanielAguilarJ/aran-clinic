export const BUSINESS = {
  name: "ARAN CLINIC",
  phone: "449 434 6003",
  whatsappLink: "https://wa.me/5214494346003",
  whatsappNumber: "5214494346003",
  address: "Av. Eugenio Garza Sada 224, Ejido Los Pocitos, C.P. 20328, Aguascalientes, Ags.",
  shortAddress: "Av. Eugenio Garza Sada 224, Aguascalientes",
  lat: 21.92008826,
  lng: -102.3353936,
  mapUrl: "https://www.google.com/maps?q=21.92008826,-102.33539360",
  email: "contacto@aranclinic.com",
  timezone: "America/Mexico_City",
} as const;

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Reservar", href: "/reservar" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  CABELLO: "Cabello",
  ROSTRO: "Rostro",
  UNAS: "Uñas",
  CUERPO: "Cuerpo",
  MAQUILLAJE: "Maquillaje",
  DEPILACION: "Depilación",
  TRATAMIENTOS: "Tratamientos Especiales",
};

export const BOOKING_STEPS = [
  { id: 1, label: "Servicio", description: "Elige tu servicio" },
  { id: 2, label: "Fecha y hora", description: "Selecciona disponibilidad" },
  { id: 3, label: "Tus datos", description: "Información de contacto" },
  { id: 4, label: "Complementos", description: "Personaliza tu experiencia" },
  { id: 5, label: "Confirmación", description: "Revisa y confirma" },
] as const;

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No se presentó",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-orange-100 text-orange-800",
};
