import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center px-6">
        <h1 className="font-serif text-7xl font-bold text-gold-primary mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-3">
          Página no encontrada
        </h2>
        <p className="text-charcoal-700/60 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary text-base py-3 px-8">
            Ir al inicio
          </Link>
          <Link href="/reservar" className="btn-secondary text-base py-3 px-8">
            Reservar cita
          </Link>
        </div>
      </div>
    </div>
  );
}
