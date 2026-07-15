"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Clock } from "lucide-react";

type ScheduleEntry = {
  time: string;
  class: string;
  level: string;
};

type ScheduleData = {
  [key: string]: ScheduleEntry[];
};

const schedule: ScheduleData = {
  "Segunda": [
    { time: "07:00 - 08:30", class: "Jiu-Jitsu", level: "Todas as faixas" },
    { time: "10:00 - 11:30", class: "Grappling", level: "Iniciante" },
    { time: "18:00 - 19:30", class: "Jiu-Jitsu", level: "Avançado" },
    { time: "19:30 - 21:00", class: "Luta Livre", level: "Todas as faixas" },
  ],
  "Terça": [
    { time: "07:00 - 08:30", class: "Grappling", level: "Todas as faixas" },
    { time: "10:00 - 11:30", class: "Jiu-Jitsu", level: "Iniciante" },
    { time: "18:00 - 19:30", class: "Jiu-Jitsu", level: "Todas as faixas" },
    { time: "19:30 - 21:00", class: "Grappling", level: "Competição" },
  ],
  "Quarta": [
    { time: "07:00 - 08:30", class: "Jiu-Jitsu", level: "Todas as faixas" },
    { time: "10:00 - 11:30", class: "Grappling", level: "Iniciante" },
    { time: "18:00 - 19:30", class: "Jiu-Jitsu", level: "Avançado" },
    { time: "19:30 - 21:00", class: "Luta Livre", level: "Todas as faixas" },
  ],
  "Quinta": [
    { time: "07:00 - 08:30", class: "Grappling", level: "Todas as faixas" },
    { time: "10:00 - 11:30", class: "Jiu-Jitsu", level: "Iniciante" },
    { time: "18:00 - 19:30", class: "Jiu-Jitsu", level: "Todas as faixas" },
    { time: "19:30 - 21:00", class: "Grappling", level: "Competição" },
  ],
  "Sexta": [
    { time: "07:00 - 08:30", class: "Jiu-Jitsu", level: "Todas as faixas" },
    { time: "10:00 - 11:30", class: "Grappling", level: "Open Mat" },
    { time: "18:00 - 19:30", class: "Jiu-Jitsu", level: "Avançado" },
    { time: "19:30 - 21:00", class: "Luta Livre", level: "Todas as faixas" },
  ],
  "Sábado": [
    { time: "09:00 - 10:30", class: "Jiu-Jitsu", level: "Todas as faixas" },
    { time: "10:30 - 12:00", class: "Grappling", level: "Open Mat" },
  ],
};

const days = Object.keys(schedule);

const classColors: { [key: string]: string } = {
  "Jiu-Jitsu": "text-crimson-glow",
  "Grappling": "text-amber-400",
  "Luta Livre": "text-sky-400",
};

const classBgColors: { [key: string]: string } = {
  "Jiu-Jitsu": "bg-crimson/10 border-crimson/20",
  "Grappling": "bg-amber-500/10 border-amber-500/20",
  "Luta Livre": "bg-sky-500/10 border-sky-500/20",
};

export default function Schedule() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeDay, setActiveDay] = useState("Segunda");

  return (
    <section id="horarios" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson/4 rounded-full blur-[150px]" />

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
            Horários
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
          >
            <span className="gradient-text">Grade de</span>{" "}
            <span className="gradient-text-red">Treinos</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted text-sm sm:text-base"
          >
            Confira os horários das aulas e encontre o melhor treino para a sua
            rotina.
          </motion.p>
        </div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeDay === day
                  ? "bg-gradient-to-r from-crimson to-crimson-light text-white shadow-lg shadow-crimson/20"
                  : "bg-surface text-muted hover:text-white hover:bg-surface-hover border border-white/5"
              }`}
            >
              {day}
            </button>
          ))}
        </motion.div>

        {/* Schedule Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="space-y-3">
            {schedule[activeDay].map((entry, index) => (
              <motion.div
                key={`${activeDay}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
                className={`group flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${classBgColors[entry.class]}`}
              >
                {/* Time */}
                <div className="flex items-center gap-2 min-w-[120px] sm:min-w-[140px]">
                  <Clock className="w-4 h-4 text-muted-dark flex-shrink-0" />
                  <span className="text-sm sm:text-base font-mono font-semibold text-white">
                    {entry.time}
                  </span>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-white/10" />

                {/* Class info */}
                <div className="flex-1">
                  <p className={`text-sm sm:text-base font-bold ${classColors[entry.class]}`}>
                    {entry.class}
                  </p>
                  <p className="text-xs sm:text-sm text-muted">
                    {entry.level}
                  </p>
                </div>

                {/* Action */}
                <a
                  href={`https://wa.me/5521979852192?text=Ol%C3%A1!%20Gostaria%20de%20informações%20sobre%20a%20aula%20de%20${encodeURIComponent(entry.class)}%20das%20${encodeURIComponent(entry.time)}%20(${encodeURIComponent(activeDay)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-semibold text-muted hover:text-white border border-white/10 hover:border-white/25 rounded-lg transition-all duration-300"
                >
                  Info
                </a>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            {Object.entries(classColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color.replace("text-", "bg-")}`} />
                <span className="text-muted">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
