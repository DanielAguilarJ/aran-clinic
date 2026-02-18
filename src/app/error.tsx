"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center px-6">
        <h1 className="font-serif text-5xl font-bold text-charcoal-900 mb-4">
          Algo salió mal
        </h1>
        <p className="text-charcoal-700/60 mb-8 max-w-md mx-auto">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary text-base py-3 px-8">
            Intentar de nuevo
          </button>
          <Link href="/" className="btn-secondary text-base py-3 px-8">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
