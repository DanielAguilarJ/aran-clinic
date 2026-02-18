"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ContactFormInput } from "@/lib/validators";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>();

  const onSubmit = async (data: ContactFormInput) => {
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
      reset();
    } catch {
      // fail silently for now
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center">
        <p className="text-green-800 font-medium text-lg mb-2">
          ¡Mensaje enviado!
        </p>
        <p className="text-green-700/70">
          Nos comunicaremos contigo pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nombre completo"
        placeholder="Tu nombre"
        error={errors.name?.message}
        {...register("name", { required: "El nombre es requerido", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
      />
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
        error={errors.email?.message}
        {...register("email", { required: "El correo es requerido", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" } })}
      />
      <Input
        label="Teléfono"
        type="tel"
        placeholder="Ej: 4491234567"
        error={errors.phone?.message}
        {...register("phone", { required: "El teléfono es requerido", pattern: { value: /^\d{10}$/, message: "Ingresa 10 dígitos" } })}
      />
      <Textarea
        label="Mensaje"
        placeholder="¿En qué podemos ayudarte?"
        error={errors.message?.message}
        {...register("message", { required: "El mensaje es requerido", minLength: { value: 10, message: "Mínimo 10 caracteres" } })}
      />
      <Button type="submit" loading={loading} className="w-full">
        Enviar mensaje
      </Button>
    </form>
  );
}
