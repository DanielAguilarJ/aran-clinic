/**
 * Hardcoded catalog of services and addons for ARAN CLINIC.
 * Used when no database is connected.
 */
import type { ServiceWithAddons } from "./types";
import type { Addon } from "@prisma/client";

const NOW = new Date("2024-01-01T00:00:00.000Z");

// ---------------------------------------------------------------------------
// Addons
// ---------------------------------------------------------------------------

const RAW_ADDONS = [
  {
    id: "addon-1",
    name: "Mascarilla Capilar Nutritiva",
    description:
      "Mascarilla de keratina y proteínas que nutre, repara puntas y devuelve el brillo al cabello dañado.",
    price: 200,
    durationMin: 20,
    type: "resultado",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "addon-2",
    name: "Tratamiento de Puntas Reconstructor",
    description:
      "Sellado de puntas con aceite de argán y proteínas. Elimina el frizz y sella la cutícula.",
    price: 180,
    durationMin: 15,
    type: "resultado",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "addon-3",
    name: "Diseño y Perfilado de Cejas",
    description:
      "Damos forma perfecta a tus cejas con hilo o pinzas, resaltando la estructura natural de tu rostro.",
    price: 180,
    durationMin: 20,
    type: "resultado",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "addon-4",
    name: "Hidratación Profunda Facial",
    description:
      "Sérum de ácido hialurónico más mascarilla oclusiva. Rellena arrugas finas y deja la piel suave.",
    price: 280,
    durationMin: 20,
    type: "resultado",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "addon-5",
    name: "Esmaltado Semipermanente",
    description:
      "Esmalte semipermanente curado con lámpara UV. Dura hasta 3 semanas sin descascararse.",
    price: 250,
    durationMin: 20,
    type: "confort",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "addon-6",
    name: "Vitamina C Sérum Facial",
    description:
      "Aplicación de sérum con vitamina C estabilizada para iluminar el tono y reducir manchas.",
    price: 200,
    durationMin: 10,
    type: "resultado",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "addon-7",
    name: "Arreglo Express de Barba",
    description:
      "Definición y contorno de barba con navaja y aceite hidratante. Acabado impecable.",
    price: 150,
    durationMin: 15,
    type: "confort",
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const MOCK_ADDONS = RAW_ADDONS as unknown as Addon[];

// ---------------------------------------------------------------------------
// Helper to build recommendedAddons shape
// ---------------------------------------------------------------------------
type RecommendedRef = { id: string; priority: number; urgencyText: string | null };

function rec(id: string, priority: number, urgencyText: string | null = null): RecommendedRef {
  return { id, priority, urgencyText };
}

function buildRecommended(refs: RecommendedRef[]) {
  return refs.map((r) => {
    const addon = RAW_ADDONS.find((a) => a.id === r.id)!;
    return { addon, priority: r.priority, urgencyText: r.urgencyText };
  });
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const RAW_SERVICES: ServiceWithAddons[] = [
  // ── CABELLO ──────────────────────────────────────
  {
    id: "svc-1",
    name: "Corte de Cabello",
    slug: "corte-de-cabello",
    description:
      "Corte personalizado según la forma de tu rostro y estilo de vida. Incluye lavado, secado y terminado.",
    benefits: ["Estilo personalizado", "Incluye lavado y secado", "Asesoría de imagen"],
    category: "CABELLO" as never,
    durationMin: 45,
    price: 280 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 1,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-1", 2, "El 80% de nuestras clientas lo agregan"),
      rec("addon-2", 1),
    ]),
  },
  {
    id: "svc-2",
    name: "Tinte y Coloración",
    slug: "tinte-y-coloracion",
    description:
      "Coloración profesional con tintes ammonia-free de última generación. Cubre canas al 100% y potencia el brillo.",
    benefits: ["Sin amoniaco", "Cobertura total de canas", "Mayor luminosidad"],
    category: "CABELLO" as never,
    durationMin: 120,
    price: 900 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 2,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-1", 2, "Protege y nutre el cabello recién teñido"),
      rec("addon-2", 1),
    ]),
  },
  {
    id: "svc-3",
    name: "Keratina Brasileña",
    slug: "keratina-brasilena",
    description:
      "Tratamiento alisador progresivo que elimina el frizz hasta por 4 meses. Cabellos suaves, brillantes y manejables.",
    benefits: ["Elimina el frizz hasta 4 meses", "Reduce el tiempo de secado", "Brillo intenso"],
    category: "CABELLO" as never,
    durationMin: 150,
    price: 1400 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 3,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-1", 2, "Potencia el efecto alisador y nutre en profundidad"),
    ]),
  },
  {
    id: "svc-4",
    name: "Brushing y Peinado",
    slug: "brushing-y-peinado",
    description:
      "Lavado, secado profesional y peinado para cualquier ocasión. Acabado liso, ondas o volumen según tu preferencia.",
    benefits: ["Acabado duradero", "Hidratación con calor", "Listo para cualquier evento"],
    category: "CABELLO" as never,
    durationMin: 45,
    price: 350 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 4,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-1", 1),
    ]),
  },
  // ── ROSTRO ───────────────────────────────────────
  {
    id: "svc-5",
    name: "Limpieza Facial Profunda",
    slug: "limpieza-facial-profunda",
    description:
      "Limpieza de poros con vapor, extracción de comedones y mascarilla calmante. Piel limpia, oxigenada y renovada.",
    benefits: ["Poros desobstruidos", "Piel oxigenada", "Reduce puntos negros"],
    category: "ROSTRO" as never,
    durationMin: 60,
    price: 650 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 5,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-4", 2, "El paso final para un rostro verdaderamente radiante"),
      rec("addon-6", 1),
    ]),
  },
  {
    id: "svc-6",
    name: "Tratamiento Hidratante Facial",
    slug: "tratamiento-hidratante-facial",
    description:
      "Hidratación intensiva con ácido hialurónico y vitaminas. Ideal para piel seca, deshidratada o con signos de fatiga.",
    benefits: ["Hidratación 72 h", "Efecto plumping", "Mejora la textura"],
    category: "ROSTRO" as never,
    durationMin: 50,
    price: 550 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 6,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-6", 2),
      rec("addon-4", 1),
    ]),
  },
  {
    id: "svc-7",
    name: "Lifting Facial Antiedad",
    slug: "lifting-facial-antiedad",
    description:
      "Tratamiento tensor con corrientes microgalvánicas, masaje linfático y sérum antiedad. Efecto lifting visible desde la primera sesión.",
    benefits: ["Efecto tensor inmediato", "Reduce arrugas de expresión", "Estimula el colágeno"],
    category: "ROSTRO" as never,
    durationMin: 90,
    price: 950 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 7,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-6", 2, "Multiplica los resultados antiedad"),
      rec("addon-4", 1),
    ]),
  },
  // ── UÑAS ─────────────────────────────────────────
  {
    id: "svc-8",
    name: "Manicure Clásico",
    slug: "manicure-clasico",
    description:
      "Limado, cuticulas, exfoliación de manos e hidratación con masaje. Incluye esmalte tradicional de tu elección.",
    benefits: ["Manos suaves e hidratadas", "Más de 100 colores disponibles", "Duración 5–7 días"],
    category: "UNAS" as never,
    durationMin: 45,
    price: 200 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 8,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-5", 2, "Dura 3× más que el esmalte normal"),
      rec("addon-3", 1),
    ]),
  },
  {
    id: "svc-9",
    name: "Pedicure Clásico",
    slug: "pedicure-clasico",
    description:
      "Baño de pies relajante, limado, cutículas, exfoliación y masaje de pies. Hidratación profunda e includes esmalte.",
    benefits: ["Relajación total", "Piel suave en talones", "Uñas bien formadas"],
    category: "UNAS" as never,
    durationMin: 60,
    price: 280 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 9,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-5", 2, "El acabado perfecto para tus pies"),
    ]),
  },
  {
    id: "svc-10",
    name: "Uñas en Gel o Acrílico",
    slug: "unas-gel-acrilico",
    description:
      "Construcción de uñas en gel UV o acrílico con la forma y longitud que prefieras. Acabado profesional y duradero.",
    benefits: ["Duración hasta 3 semanas", "Diseños personalizados", "Resistentes y flexibles"],
    category: "UNAS" as never,
    durationMin: 90,
    price: 500 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 10,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: [],
  },
  // ── MAQUILLAJE ───────────────────────────────────
  {
    id: "svc-11",
    name: "Maquillaje Social",
    slug: "maquillaje-social",
    description:
      "Maquillaje profesional para eventos, graduaciones, XV años o cualquier ocasión especial. Larga duración garantizada.",
    benefits: ["Duración 8–12 horas", "Productos profesionales", "Asesoría de color personalizada"],
    category: "MAQUILLAJE" as never,
    durationMin: 60,
    price: 650 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 11,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-3", 2, "El marco perfecto para realzar tu maquillaje"),
    ]),
  },
  {
    id: "svc-12",
    name: "Maquillaje de Novia",
    slug: "maquillaje-novia",
    description:
      "Maquillaje nupcial con prueba previa incluida. Airbrush o convencional, resistente al agua y a las emociones del gran día.",
    benefits: ["Prueba previa incluida", "Resistente al agua", "Fotos perfectas todo el día"],
    category: "MAQUILLAJE" as never,
    durationMin: 120,
    price: 1600 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 12,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-3", 2, "Cejas perfectas para el gran día"),
    ]),
  },
  // ── DEPILACIÓN ───────────────────────────────────
  {
    id: "svc-13",
    name: "Depilación con Hilo (Cejas)",
    slug: "depilacion-hilo-cejas",
    description:
      "Técnica milenaria con hilo de algodón para un perfilado preciso sin irritación. Resultado limpio y duradero.",
    benefits: ["Sin irritación", "Precisión milimétrica", "Duración 3–4 semanas"],
    category: "DEPILACION" as never,
    durationMin: 20,
    price: 160 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 13,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: [],
  },
  {
    id: "svc-14",
    name: "Depilación Láser (Área Pequeña)",
    slug: "depilacion-laser-area-pequena",
    description:
      "Depilación definitiva con tecnología láser Alexandrite. Sesión en área pequeña (axila, bikini o labio superior).",
    benefits: ["Reducción permanente", "Sin dolor residual", "Piel suave desde la 1.ª sesión"],
    category: "DEPILACION" as never,
    durationMin: 30,
    price: 850 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 14,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: [],
  },
  // ── TRATAMIENTOS ─────────────────────────────────
  {
    id: "svc-15",
    name: "Masaje Facial con Lifting",
    slug: "masaje-facial-lifting",
    description:
      "Masaje Kobido japonés combinado con técnicas de drenaje linfático. Reduce la tensión facial y moldea el contorno.",
    benefits: ["Contorno definido", "Efecto drenante", "Relajación profunda"],
    category: "TRATAMIENTOS" as never,
    durationMin: 60,
    price: 780 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 15,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-4", 2),
      rec("addon-6", 1),
    ]),
  },
  {
    id: "svc-16",
    name: "Dermapen Facial",
    slug: "dermapen-facial",
    description:
      "Microagujas de 0.5–2.5 mm que estimulan la producción de colágeno. Reduce acné, manchas, poros abiertos y arrugas finas.",
    benefits: ["Estimula el colágeno", "Reduce cicatrices de acné", "Mejora manchas y poros"],
    category: "TRATAMIENTOS" as never,
    durationMin: 90,
    price: 1200 as never,
    imageUrl: null,
    isActive: true,
    sortOrder: 16,
    createdAt: NOW,
    updatedAt: NOW,
    recommendedAddons: buildRecommended([
      rec("addon-4", 2, "Potencia la regeneración celular post-dermapen"),
      rec("addon-6", 1),
    ]),
  },
] as unknown as ServiceWithAddons[];

export const MOCK_SERVICES: ServiceWithAddons[] = RAW_SERVICES;
