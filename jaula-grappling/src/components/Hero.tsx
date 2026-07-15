"use client";

import { motion } from "framer-motion";
import { ChevronDown, Flame } from "lucide-react";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a]" />

        {/* Subtle red glow top-right */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-crimson/8 rounded-full blur-[120px]" />

        {/* Subtle red glow bottom-left */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-crimson-dark/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-crimson/30 bg-crimson/10 mb-8"
        >
          <Flame className="w-4 h-4 text-crimson-glow" />
          <span className="text-xs sm:text-sm font-medium text-crimson-glow tracking-wide uppercase">
            #coracaodeleao 🦁 Formando Campeões
          </span>
        </motion.div>

        {/* Logo - Large centered brand mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-6"
        >
          <Logo size="lg" showTagline showHandle />
        </motion.div>

        {/* Motto */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mb-2"
        >
          <span className="inline-block text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider gradient-text-red">
            Jaula no topo! 🔥
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Referência em <strong className="text-white">Jiu-Jitsu</strong>,{" "}
          <strong className="text-white">Luta Livre</strong> e{" "}
          <strong className="text-white">Wrestling</strong> no Rio de Janeiro.
          <br className="hidden sm:block" />
          Supere seus limites. Encontre sua força interior.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/5521979852192?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20aula%20experimental%20na%20Jaula%20Grappling."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-crimson to-crimson-light text-white font-bold rounded-xl text-base sm:text-lg hover:from-crimson-light hover:to-crimson-glow transition-all duration-300 hover:scale-105 pulse-glow"
          >
            <span>Agende sua Aula Experimental</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          <a
            href="#horarios"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-muted hover:text-white hover:border-white/25 hover:bg-white/5 font-medium rounded-xl text-base sm:text-lg transition-all duration-300"
          >
            Ver Horários
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16 md:mt-20 grid grid-cols-3 gap-6 md:gap-12 max-w-lg mx-auto"
        >
          {[
            { value: "5.0 ★", label: "Google Reviews" },
            { value: "4.8K+", label: "Seguidores" },
            { value: "520+", label: "Posts no Instagram" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text-red">
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-muted-dark">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-muted-dark" />
        </motion.div>
      </motion.div>
    </section>
  );
}
