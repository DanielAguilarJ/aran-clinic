import { z } from "zod/v4";

export const clientDataSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Ingresa un número de teléfono de 10 dígitos"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional().default(""),
});

export const appointmentCreateSchema = z.object({
  serviceId: z.string().min(1, "Selecciona un servicio"),
  staffId: z.string().optional(),
  date: z.string().min(1, "Selecciona una fecha"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "Selecciona un horario"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().regex(/^\d{10}$/, "Número de teléfono inválido"),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional().default(""),
  addonIds: z.array(z.string()).default([]),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  slug: z.string().min(2, "El slug es requerido"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  category: z.enum([
    "CABELLO",
    "ROSTRO",
    "UNAS",
    "CUERPO",
    "MAQUILLAJE",
    "DEPILACION",
    "TRATAMIENTOS",
  ]),
  durationMin: z.coerce.number().min(15, "La duración mínima es 15 minutos"),
  price: z.coerce.number().min(0, "El precio debe ser positivo"),
  benefits: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export const addonSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  description: z.string().min(5, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser positivo"),
  durationMin: z.coerce.number().min(0).default(0),
  type: z.string().default("resultado"),
  isActive: z.boolean().default(true),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().regex(/^\d{10}$/, "Número de teléfono inválido"),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export const businessHoursSchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
  isClosed: z.boolean(),
});

export type ClientDataInput = z.infer<typeof clientDataSchema>;
export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type AddonInput = z.infer<typeof addonSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
