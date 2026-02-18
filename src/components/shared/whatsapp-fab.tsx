"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function WhatsAppFab() {
  return (
    <motion.a
      href={BUSINESS.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contáctanos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </motion.a>
  );
}
