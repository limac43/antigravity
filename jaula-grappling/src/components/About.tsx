"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Heart, Users, Shield, Star, MapPin } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Competição",
    description:
      "Atletas da Jaula Grappling competem ativamente no circuito da CBJJO, conquistando medalhas em campeonatos estaduais e mundiais de Jiu-Jitsu com e sem quimono.",
  },
  {
    icon: Heart,
    title: "Saúde & Bem-Estar",
    description:
      "Treinos que melhoram o condicionamento físico, flexibilidade e proporcionam equilíbrio mental. Para todas as idades e objetivos.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description:
      "Com mais de 4.8 mil seguidores e uma comunidade engajada, somos uma família unida pela paixão pelo grappling. #coracaodeleao",
  },
  {
    icon: Shield,
    title: "Defesa Pessoal",
    description:
      "Aprenda técnicas eficientes de defesa pessoal baseadas em combate real, com a tradição da Luta Livre e a eficácia do Jiu-Jitsu.",
  },
];

const timeline = [
  {
    year: "Início",
    title: "Rio Fighters",
    description:
      "A história começou como Rio Fighters, uma academia de artes marciais no coração do Grajaú, Rio de Janeiro, que se dedicava a formar lutadores completos com base no Jiu-Jitsu e na Luta Livre.",
  },
  {
    year: "Evolução",
    title: "Nasce a Jaula Grappling",
    description:
      "Com a evolução do projeto e a consolidação de uma identidade própria, a academia se reinventou e nasceu a Jaula Grappling — referência em grappling na Zona Norte do Rio de Janeiro, mantendo o mesmo endereço e a mesma paixão.",
  },
  {
    year: "Hoje",
    title: "Jaula no Topo!",
    description:
      "Hoje, a Jaula Grappling é uma equipe registrada e ativa no cenário competitivo, com participações em campeonatos organizados pela CBJJO (Confederação Brasileira de Jiu-Jitsu Olímpico), formando campeões em categorias de base e adultas.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson/3 rounded-full blur-[150px]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs sm:text-sm font-semibold text-crimson-glow tracking-[0.2em] uppercase mb-4"
          >
            Nossa História
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
          >
            <span className="gradient-text">Da Rio Fighters à</span>
            <br />
            <span className="gradient-text-red">Jaula Grappling</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-muted max-w-3xl mx-auto leading-relaxed"
          >
            A <strong className="text-white">Jaula Grappling</strong>, antiga{" "}
            <strong className="text-white">Rio Fighters</strong>, é referência
            em grappling na Zona Norte do Rio de Janeiro. Localizada na{" "}
            <span className="inline-flex items-center gap-1 text-white">
              <MapPin className="w-3.5 h-3.5 text-crimson-glow" />
              R. Barão de Mesquita, 1107 — Grajaú
            </span>
            , a academia carrega o lema{" "}
            <strong className="text-crimson-glow">&quot;Jaula no topo!&quot;</strong>{" "}
            e a hashtag <span className="text-crimson-glow">#coracaodeleao</span> 🦁
            como símbolos da sua garra e determinação.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="mb-20 md:mb-24">
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-crimson/50 via-crimson/20 to-transparent" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className={`relative flex items-start gap-6 md:gap-8 mb-10 last:mb-0 ${
                  index % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-crimson border-2 border-crimson-glow shadow-lg shadow-crimson/40 z-10 mt-2" />

                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <span className="inline-block text-xs font-bold text-crimson-glow uppercase tracking-wider mb-1">
                    {item.year}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Highlights bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-16 md:mb-20"
        >
          {[
            { icon: Star, text: "5.0 no Google (24 avaliações)" },
            { icon: Users, text: "4.8K+ seguidores no Instagram" },
            { icon: Trophy, text: "Atletas federados na CBJJO" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-white/5 text-sm text-muted"
            >
              <item.icon className="w-4 h-4 text-crimson-glow flex-shrink-0" />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="group relative p-6 md:p-8 rounded-2xl bg-surface border border-white/5 hover:border-crimson/20 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-crimson/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-crimson/10 mb-5 group-hover:bg-crimson/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-crimson-glow" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
