"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Zap } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-crimson/6 rounded-full blur-[120px]" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-crimson/20 via-surface to-surface" />
          <div className="absolute inset-0 border border-crimson/20 rounded-3xl" />

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-crimson/30 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-crimson/30 rounded-br-3xl" />

          <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20 text-center">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-crimson/15 mb-8"
            >
              <Zap className="w-8 h-8 text-crimson-glow" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4"
            >
              <span className="gradient-text">Pronto para a</span>
              <br />
              <span className="gradient-text-red">Primeira Aula?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Agende agora sua <strong className="text-white">aula experimental gratuita</strong> e
              descubra por que somos referência no Rio de Janeiro. O tatame te espera.
            </motion.p>

            {/* WhatsApp Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <a
                href="https://wa.me/5521979852192?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20aula%20experimental%20na%20Jaula%20Grappling."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-base sm:text-lg rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Falar pelo WhatsApp</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </motion.div>

            {/* Trust note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6 text-xs text-muted-dark"
            >
              Resposta rápida • Sem compromisso • Venha conhecer!
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
