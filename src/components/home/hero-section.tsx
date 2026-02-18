"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-900">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/95 via-charcoal-800/90 to-gold-900/30" />

      <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 container-aran text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gold-400 text-sm tracking-[0.3em] uppercase font-sans font-medium mb-6"
        >
          Bienvenida a
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-serif font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6"
        >
          ARAN <span className="text-gold-400">CLINIC</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-cream-200/80 font-light max-w-2xl mx-auto mb-10"
        >
          Donde la belleza se convierte en arte
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/reservar" className="btn-primary text-lg px-10 py-4">
            Reserva tu cita
          </Link>
          <Link
            href="/servicios"
            className="btn-secondary text-lg px-10 py-4 border-cream-200/30 text-cream-200 hover:bg-cream-200 hover:text-charcoal-900"
          >
            Conoce nuestros servicios
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-cream-200/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
