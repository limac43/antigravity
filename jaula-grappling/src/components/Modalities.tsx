"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const modalidades = [
  {
    title: "Jiu-Jitsu",
    tag: "Arte Suave",
    description:
      "A arte suave brasileira. Domine o combate no solo com técnicas de imobilização, chaves e estrangulamentos. Do iniciante ao faixa preta.",
    highlight: true,
  },
  {
    title: "Grappling",
    tag: "No-Gi",
    description:
      "Luta agarrada sem kimono (No-Gi). Desenvolva um jogo versátil e dinâmico com técnicas de submission wrestling e controle corporal.",
    highlight: false,
  },
  {
    title: "Luta Livre",
    tag: "Esportiva",
    description:
      "A arte marcial brasileira de combate no solo. Técnicas eficientes de finalização e defesa pessoal com tradição e história.",
    highlight: false,
  },
  {
    title: "Wrestling",
    tag: "Olímpico",
    description:
      "A base da luta olímpica. Domine quedas, projeções e controle em pé para complementar seu jogo no solo com explosão e força.",
    highlight: false,
  },
];

export default function Modalities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="modalidades" className="relative py-24 md:py-32 overflow-hidden">
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
            Modalidades
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
          >
            <span className="gradient-text">Escolha sua</span>{" "}
            <span className="gradient-text-red">Modalidade</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {modalidades.map((mod, index) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                mod.highlight
                  ? "border-2 border-crimson/40"
                  : "border border-white/5"
              }`}
            >
              {/* Card gradient background */}
              <div
                className={`absolute inset-0 ${
                  mod.highlight
                    ? "bg-gradient-to-b from-crimson/15 via-surface to-surface"
                    : "bg-surface"
                }`}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-crimson/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 p-8 md:p-10">
                {/* Tag */}
                <span
                  className={`inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6 ${
                    mod.highlight
                      ? "bg-crimson/20 text-crimson-glow"
                      : "bg-white/5 text-muted"
                  }`}
                >
                  {mod.tag}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                  {mod.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
                  {mod.description}
                </p>

                {/* CTA */}
                <a
                  href="https://wa.me/5521979852192?text=Ol%C3%A1!%20Tenho%20interesse%20na%20modalidade%20de%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
                    mod.highlight
                      ? "text-crimson-glow hover:text-white"
                      : "text-muted hover:text-white"
                  }`}
                >
                  Quero começar
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>

              {/* Popular badge */}
              {mod.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-crimson text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Popular
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
