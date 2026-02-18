import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Business Settings
  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "ARAN CLINIC",
      phone: "449 434 6003",
      address:
        "Av. Eugenio Garza Sada 224, Ejido Los Pocitos, C.P. 20328, Aguascalientes, Ags.",
      latitude: 21.92008826,
      longitude: -102.3353936,
      timezone: "America/Mexico_City",
      slotIntervalMin: 30,
      bookingLeadMin: 60,
      maxAdvanceDays: 30,
    },
  });

  // Business Hours (Mon-Sat 9:00-19:00, Sunday closed)
  const hours = [
    { dayOfWeek: 0, openTime: "09:00", closeTime: "19:00", isClosed: true },
    { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isClosed: false },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "19:00", isClosed: false },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "19:00", isClosed: false },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "19:00", isClosed: false },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "19:00", isClosed: false },
    { dayOfWeek: 6, openTime: "09:00", closeTime: "15:00", isClosed: false },
  ];

  for (const h of hours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: h,
      create: h,
    });
  }

  // Admin user (password: admin123)
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { phone: "4494346003" },
    update: {},
    create: {
      name: "Administrador ARAN",
      phone: "4494346003",
      email: "admin@aranclinic.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Staff
  const staff = await prisma.staff.upsert({
    where: { id: "staff-principal" },
    update: {},
    create: {
      id: "staff-principal",
      name: "Estilista Principal",
      role: "Estilista Senior",
      isActive: true,
    },
  });

  // Services
  const services = [
    {
      id: "srv-corte",
      name: "Corte de Cabello",
      slug: "corte-de-cabello",
      description:
        "Corte profesional personalizado que realza tu estilo. Incluye lavado, corte de precisión y secado con técnica profesional.",
      benefits: [
        "Consulta de estilo personalizada",
        "Lavado con productos premium",
        "Corte de precisión",
        "Secado y peinado final",
      ],
      category: "CABELLO" as const,
      durationMin: 45,
      price: 350,
      sortOrder: 1,
    },
    {
      id: "srv-tinte",
      name: "Coloración Profesional",
      slug: "coloracion-profesional",
      description:
        "Transformación de color con las mejores marcas del mercado. Color vibrante, duradero y que cuida la salud de tu cabello.",
      benefits: [
        "Diagnóstico capilar previo",
        "Productos de alta gama",
        "Color uniforme y duradero",
        "Tratamiento post-color incluido",
      ],
      category: "CABELLO" as const,
      durationMin: 120,
      price: 850,
      sortOrder: 2,
    },
    {
      id: "srv-balayage",
      name: "Balayage / Mechas",
      slug: "balayage-mechas",
      description:
        "Técnica de iluminación natural que aporta dimensión y movimiento a tu cabello con un acabado sofisticado.",
      benefits: [
        "Efecto natural y luminoso",
        "Técnica a mano alzada",
        "Mantenimiento sencillo",
        "Transiciones suaves de color",
      ],
      category: "CABELLO" as const,
      durationMin: 180,
      price: 1500,
      sortOrder: 3,
    },
    {
      id: "srv-facial",
      name: "Facial Express Premium",
      slug: "facial-express-premium",
      description:
        "Tratamiento facial rejuvenecedor con productos de alta cosmética que devuelve la luminosidad y firmeza a tu piel.",
      benefits: [
        "Limpieza profunda",
        "Exfoliación enzimática",
        "Mascarilla hidratante",
        "Masaje facial relajante",
      ],
      category: "ROSTRO" as const,
      durationMin: 60,
      price: 650,
      sortOrder: 4,
    },
    {
      id: "srv-manicure",
      name: "Manicure de Lujo",
      slug: "manicure-de-lujo",
      description:
        "Cuidado completo de tus manos con técnicas profesionales y los mejores productos para uñas impecables.",
      benefits: [
        "Limado y moldeado perfecto",
        "Tratamiento de cutículas",
        "Hidratación de manos",
        "Esmaltado de larga duración",
      ],
      category: "UNAS" as const,
      durationMin: 45,
      price: 300,
      sortOrder: 5,
    },
    {
      id: "srv-pedicure",
      name: "Pedicure Spa",
      slug: "pedicure-spa",
      description:
        "Sesión completa de cuidado para pies con baño relajante, exfoliación y tratamiento hidratante.",
      benefits: [
        "Baño relajante con sales",
        "Exfoliación y suavizado",
        "Masaje de pies",
        "Esmaltado profesional",
      ],
      category: "UNAS" as const,
      durationMin: 60,
      price: 400,
      sortOrder: 6,
    },
    {
      id: "srv-maquillaje",
      name: "Maquillaje Profesional",
      slug: "maquillaje-profesional",
      description:
        "Maquillaje de alta definición para eventos especiales, sesiones fotográficas o simplemente para verte espectacular.",
      benefits: [
        "Análisis de tono de piel",
        "Productos de alta gama",
        "Larga duración garantizada",
        "Look personalizado",
      ],
      category: "MAQUILLAJE" as const,
      durationMin: 60,
      price: 750,
      sortOrder: 7,
    },
    {
      id: "srv-tratamiento-capilar",
      name: "Tratamiento Capilar Profundo",
      slug: "tratamiento-capilar-profundo",
      description:
        "Restauración intensiva del cabello dañado con keratina y nutrientes que devuelven suavidad, brillo y fuerza.",
      benefits: [
        "Diagnóstico del estado capilar",
        "Keratina de alta calidad",
        "Nutrición profunda",
        "Resultados desde la primera sesión",
      ],
      category: "TRATAMIENTOS" as const,
      durationMin: 90,
      price: 900,
      sortOrder: 8,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  // Addons
  const addons = [
    {
      id: "addon-mascarilla-oro",
      name: "Mascarilla de Oro 24K",
      description:
        "Tratamiento facial de lujo con partículas de oro que iluminan y rejuvenecen la piel al instante.",
      price: 250,
      durationMin: 15,
      type: "resultado",
    },
    {
      id: "addon-tratamiento-capilar",
      name: "Boost Capilar Express",
      description:
        "Tratamiento rápido de hidratación profunda para cabello. Ideal como complemento a cualquier servicio de cabello.",
      price: 200,
      durationMin: 15,
      type: "resultado",
    },
    {
      id: "addon-masaje-cuello",
      name: "Masaje Relajante de Cuello",
      description:
        "Masaje profesional de 10 minutos en cuello y hombros para una experiencia de relajación completa.",
      price: 150,
      durationMin: 10,
      type: "confort",
    },
    {
      id: "addon-esmaltado-gel",
      name: "Upgrade Esmaltado Gel",
      description:
        "Cambia tu esmaltado tradicional por gel semipermanente de larga duración. Brillo impecable por semanas.",
      price: 180,
      durationMin: 10,
      type: "resultado",
    },
    {
      id: "addon-express-priority",
      name: "Servicio Express Prioritario",
      description:
        "Atención prioritaria sin tiempos de espera. Ideal si tienes un evento importante en las próximas horas.",
      price: 200,
      durationMin: 0,
      type: "urgencia",
    },
    {
      id: "addon-bebida-premium",
      name: "Bebida Premium de Cortesía",
      description:
        "Disfruta un café de especialidad, té orgánico o agua mineralizada durante tu servicio.",
      price: 80,
      durationMin: 0,
      type: "confort",
    },
  ];

  for (const a of addons) {
    await prisma.addon.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }

  // Service-Addon Recommendations
  const recommendations = [
    {
      serviceId: "srv-corte",
      addonId: "addon-tratamiento-capilar",
      priority: 10,
      urgencyText: "El más solicitado con este servicio",
    },
    {
      serviceId: "srv-corte",
      addonId: "addon-masaje-cuello",
      priority: 5,
      urgencyText: null,
    },
    {
      serviceId: "srv-tinte",
      addonId: "addon-tratamiento-capilar",
      priority: 10,
      urgencyText: "Recomendado para proteger tu color",
    },
    {
      serviceId: "srv-balayage",
      addonId: "addon-tratamiento-capilar",
      priority: 10,
      urgencyText: "Esencial para mantener tu balayage perfecto",
    },
    {
      serviceId: "srv-facial",
      addonId: "addon-mascarilla-oro",
      priority: 10,
      urgencyText: "Solo 3 disponibles hoy",
    },
    {
      serviceId: "srv-facial",
      addonId: "addon-masaje-cuello",
      priority: 5,
      urgencyText: "Nuestras clientas lo aman",
    },
    {
      serviceId: "srv-manicure",
      addonId: "addon-esmaltado-gel",
      priority: 10,
      urgencyText: "Dura hasta 3 semanas más",
    },
    {
      serviceId: "srv-pedicure",
      addonId: "addon-esmaltado-gel",
      priority: 10,
      urgencyText: "Ideal para esta temporada",
    },
    {
      serviceId: "srv-maquillaje",
      addonId: "addon-express-priority",
      priority: 10,
      urgencyText: "Ideal si tienes un evento pronto",
    },
    {
      serviceId: "srv-maquillaje",
      addonId: "addon-mascarilla-oro",
      priority: 5,
      urgencyText: "Prepara tu piel antes del maquillaje",
    },
  ];

  for (const r of recommendations) {
    await prisma.serviceAddonRecommendation.upsert({
      where: {
        serviceId_addonId: {
          serviceId: r.serviceId,
          addonId: r.addonId,
        },
      },
      update: r,
      create: r,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
