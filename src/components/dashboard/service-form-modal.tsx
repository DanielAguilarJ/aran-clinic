"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_CATEGORY_LABELS } from "@/lib/constants";
import { Plus, Edit2, X } from "lucide-react";

interface ServiceFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  durationMin: number;
  price: number;
  benefits: string;
  isActive: boolean;
  sortOrder: number;
}

interface ServiceFormModalProps {
  mode: "create" | "edit";
  service?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    durationMin: number;
    price: number;
    benefits: string[];
    isActive: boolean;
    sortOrder: number;
  };
}

export function ServiceFormModal({ mode, service }: ServiceFormModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: service
      ? {
          ...service,
          benefits: service.benefits.join("\n"),
        }
      : {
          name: "",
          slug: "",
          description: "",
          category: "CABELLO",
          durationMin: 60,
          price: 0,
          benefits: "",
          isActive: true,
          sortOrder: 0,
        },
  });

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    setError("");

    const payload = {
      ...data,
      benefits: data.benefits
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean),
    };

    try {
      const url =
        mode === "create"
          ? "/api/services"
          : `/api/services/${service!.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      setOpen(false);
      reset();
      router.refresh();
    } catch {
      setError("Error al guardar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service || !confirm("¿Estás seguro de eliminar este servicio?"))
      return;
    setLoading(true);
    try {
      await fetch(`/api/services/${service.id}`, { method: "DELETE" });
      setOpen(false);
      router.refresh();
    } catch {
      setError("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          mode === "create"
            ? "btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
            : "p-2 text-charcoal-700/40 hover:text-gold-600 transition-colors"
        }
      >
        {mode === "create" ? (
          <>
            <Plus className="h-4 w-4" /> Nuevo servicio
          </>
        ) : (
          <Edit2 className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                {mode === "create" ? "Nuevo servicio" : "Editar servicio"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-charcoal-700/50" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nombre"
                error={errors.name?.message}
                {...register("name", { required: "Requerido" })}
              />
              <Input
                label="Slug (URL)"
                error={errors.slug?.message}
                {...register("slug", { required: "Requerido" })}
              />
              <Textarea
                label="Descripción"
                error={errors.description?.message}
                {...register("description", {
                  required: "Requerido",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                })}
              />

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                  Categoría
                </label>
                <select
                  {...register("category")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                >
                  {Object.entries(SERVICE_CATEGORY_LABELS).map(
                    ([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duración (min)"
                  type="number"
                  error={errors.durationMin?.message}
                  {...register("durationMin", {
                    required: "Requerido",
                    valueAsNumber: true,
                    min: { value: 15, message: "Mínimo 15" },
                  })}
                />
                <Input
                  label="Precio (MXN)"
                  type="number"
                  step="0.01"
                  error={errors.price?.message}
                  {...register("price", {
                    required: "Requerido",
                    valueAsNumber: true,
                    min: { value: 0, message: "Mínimo 0" },
                  })}
                />
              </div>

              <Input
                label="Orden"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />

              <Textarea
                label="Beneficios (uno por línea)"
                {...register("benefits")}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-charcoal-700"
                >
                  Servicio activo
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={loading}
                  >
                    Eliminar
                  </Button>
                )}
                <div
                  className={`flex gap-3 ${mode === "create" ? "ml-auto" : ""}`}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" loading={loading}>
                    {mode === "create" ? "Crear" : "Guardar"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
