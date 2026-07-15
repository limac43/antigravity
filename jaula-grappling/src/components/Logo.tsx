/**
 * Logo component matching the Jaula Grappling brand identity.
 * Reproduces the visual hierarchy from the official logo:
 * - "JAULA" in large bold white
 * - "GRAPPLING" in spaced letters below
 * - Tagline with modalities
 */

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  showHandle?: boolean;
};

export default function Logo({ size = "md", showTagline = false, showHandle = false }: LogoProps) {
  const sizes = {
    sm: {
      jaula: "text-xl sm:text-2xl",
      grappling: "text-[9px] sm:text-[10px] tracking-[0.35em]",
      handle: "text-[7px] sm:text-[8px]",
      tagline: "text-[6px] sm:text-[7px]",
      gap: "gap-0",
    },
    md: {
      jaula: "text-2xl sm:text-3xl",
      grappling: "text-[10px] sm:text-xs tracking-[0.35em]",
      handle: "text-[8px] sm:text-[9px]",
      tagline: "text-[7px] sm:text-[8px]",
      gap: "gap-0.5",
    },
    lg: {
      jaula: "text-5xl sm:text-6xl md:text-7xl",
      grappling: "text-sm sm:text-base md:text-lg tracking-[0.4em]",
      handle: "text-xs sm:text-sm",
      tagline: "text-[9px] sm:text-[10px]",
      gap: "gap-1",
    },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${s.gap} leading-none select-none`}>
      {/* JAULA */}
      <span
        className={`${s.jaula} font-black text-white tracking-[0.15em] uppercase`}
        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" }}
      >
        JAULA
      </span>

      {/* GRAPPLING */}
      <span
        className={`${s.grappling} font-semibold text-white/90 uppercase`}
      >
        GRAPPLING
      </span>

      {/* @handle */}
      {showHandle && (
        <span className={`${s.handle} font-medium text-white/50 uppercase tracking-[0.25em] mt-1`}>
          @JAULAGRAPPLING
        </span>
      )}

      {/* Tagline: JIU-JITSU • LUTA LIVRE • WRESTLING + 🇧🇷 */}
      {showTagline && (
        <div className={`flex items-center gap-2 mt-1.5`}>
          <span className={`${s.tagline} font-bold text-white/40 uppercase tracking-[0.2em]`}>
            JIU-JITSU
          </span>
          <span className={`${s.tagline} text-crimson-glow`}>•</span>
          <span className={`${s.tagline} font-bold text-white/40 uppercase tracking-[0.2em]`}>
            LUTA LIVRE
          </span>
          <span className={`${s.tagline} text-crimson-glow`}>•</span>
          <span className={`${s.tagline} font-bold text-white/40 uppercase tracking-[0.2em]`}>
            WRESTLING
          </span>
          {/* Brazilian flag mini */}
          <span className={`${s.tagline} ml-0.5`}>🇧🇷</span>
        </div>
      )}
    </div>
  );
}
