"use client";

import { useForm } from "react-hook-form";
import { useBooking } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClientForm {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export function StepClientData() {
  const { state, dispatch } = useBooking();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ClientForm>({
    defaultValues: {
      name: state.clientName,
      phone: state.clientPhone,
      email: state.clientEmail,
      notes: state.notes,
    },
    mode: "onChange",
  });

  const onSubmit = (data: ClientForm) => {
    dispatch({ type: "SET_CLIENT_DATA", payload: data });
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-2">
        Tus datos de contacto
      </h2>
      <p className="text-charcoal-700/60 mb-6">
        Necesitamos tu información para confirmar la cita
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
        <Input
          label="Nombre completo *"
          placeholder="Tu nombre completo"
          error={errors.name?.message}
          {...register("name", {
            required: "El nombre es requerido",
            minLength: {
              value: 2,
              message: "Mínimo 2 caracteres",
            },
          })}
        />

        <Input
          label="Teléfono (10 dígitos) *"
          type="tel"
          placeholder="Ej: 4491234567"
          error={errors.phone?.message}
          {...register("phone", {
            required: "El teléfono es requerido",
            pattern: {
              value: /^\d{10}$/,
              message: "Ingresa un número de 10 dígitos",
            },
          })}
        />

        <Input
          label="Correo electrónico (opcional)"
          type="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register("email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Correo inválido",
            },
          })}
        />

        <Textarea
          label="Notas o peticiones especiales (opcional)"
          placeholder="¿Tienes alguna preferencia o solicitud especial?"
          {...register("notes")}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch({ type: "PREV_STEP" })}
          >
            Anterior
          </Button>
          <Button type="submit" disabled={!isValid}>
            Siguiente
          </Button>
        </div>
      </form>
    </div>
  );
}
