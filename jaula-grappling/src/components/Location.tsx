"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Navigation } from "lucide-react";

export default function Location() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="localizacao" className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs sm:text-sm font-semibold text-crimson-glow tracking-[0.2em] uppercase mb-4"
          >
            Localização
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
          >
            <span className="gradient-text">Venha nos</span>{" "}
            <span className="gradient-text-red">Visitar</span>
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/40"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.0!2d-43.2719!3d-22.9176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997e58a7b47d15%3A0x0!2sR.%20Bar%C3%A3o%20de%20Mesquita%2C%201107%20-%20Graja%C3%BA%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Jaula Grappling"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Address Card */}
            <div className="group p-6 rounded-2xl bg-surface border border-white/5 hover:border-crimson/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-crimson/10 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-crimson-glow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Endereço</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    R. Barão de Mesquita, 1107
                    <br />
                    Grajaú, Rio de Janeiro - RJ
                    <br />
                    CEP: 20540-002
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group p-6 rounded-2xl bg-surface border border-white/5 hover:border-crimson/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-crimson/10 flex-shrink-0">
                  <Phone className="w-5 h-5 text-crimson-glow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Telefone / WhatsApp
                  </h3>
                  <a
                    href="tel:+5521979852192"
                    className="text-sm text-muted hover:text-crimson-glow transition-colors duration-300"
                  >
                    (21) 97985-2192
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="group p-6 rounded-2xl bg-surface border border-white/5 hover:border-crimson/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-crimson/10 flex-shrink-0">
                  <Navigation className="w-5 h-5 text-crimson-glow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Funcionamento
                  </h3>
                  <div className="text-sm text-muted space-y-0.5">
                    <p>Seg a Sex: 07:00 — 21:00</p>
                    <p>Sáb: 09:00 — 12:00</p>
                    <p>Dom: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Button */}
            <a
              href="https://www.google.com/maps/dir//R.+Bar%C3%A3o+de+Mesquita,+1107+-+Graja%C3%BA,+Rio+de+Janeiro+-+RJ,+20540-002"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-crimson/20 to-crimson-dark/20 border border-crimson/20 hover:border-crimson/40 text-crimson-glow hover:text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Abrir no Google Maps</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
