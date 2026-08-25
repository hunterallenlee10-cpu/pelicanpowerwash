"use client";

/*
 * Fixed full-viewport animated background for the Pelican Power Wash page.
 * Sits at z-0 behind the page content, which is lifted above it with
 * `relative z-10` wrappers in the page layout. Three translucent
 * wave layers slide past each other along the bottom of the viewport at
 * different speeds, with two faint light beams drifting above them. Pure CSS
 * animations, no dependencies; motion pauses for prefers-reduced-motion.
 */

const WAVE_1 =
  "M0 150 C 90 90, 270 210, 360 150 C 450 90, 630 210, 720 150 C 810 90, 990 210, 1080 150 C 1170 90, 1350 210, 1440 150 C 1530 90, 1710 210, 1800 150 C 1890 90, 2070 210, 2160 150 C 2250 90, 2430 210, 2520 150 C 2610 90, 2790 210, 2880 150 L2880 400 L0 400 Z";

const WAVE_2 =
  "M0 210 C 90 165, 270 255, 360 210 C 450 165, 630 255, 720 210 C 810 165, 990 255, 1080 210 C 1170 165, 1350 255, 1440 210 C 1530 165, 1710 255, 1800 210 C 1890 165, 2070 255, 2160 210 C 2250 165, 2430 255, 2520 210 C 2610 165, 2790 255, 2880 210 L2880 400 L0 400 Z";

const WAVE_3 =
  "M0 270 C 90 240, 270 300, 360 270 C 450 240, 630 300, 720 270 C 810 240, 990 300, 1080 270 C 1170 240, 1350 300, 1440 270 C 1530 240, 1710 300, 1800 270 C 1890 240, 2070 300, 2160 270 C 2250 240, 2430 300, 2520 270 C 2610 240, 2790 300, 2880 270 L2880 400 L0 400 Z";

export function PelicanAnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pelican-bg fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <style>{`
        .pelican-bg {
          background: radial-gradient(ellipse at 50% 0%, #082530 0%, #0a0a0a 60%);
        }
        .pelican-bg-beam {
          position: absolute;
          top: -20%;
          width: 340px;
          height: 140%;
          filter: blur(60px);
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.06), transparent);
          animation: pelican-bg-beam 16s ease-in-out infinite alternate;
          will-change: transform;
        }
        .pelican-bg-waves {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 240px;
        }
        @media (min-width: 768px) {
          .pelican-bg-waves { height: 320px; }
        }
        .pelican-bg-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          will-change: transform;
          animation: pelican-bg-slide linear infinite;
        }
        @keyframes pelican-bg-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pelican-bg-beam {
          from { transform: rotate(18deg) translateX(-140px); }
          to { transform: rotate(18deg) translateX(140px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pelican-bg-wave, .pelican-bg-beam { animation: none; }
        }
      `}</style>

      {/* Drifting light beams */}
      <div className="pelican-bg-beam" style={{ left: "15%" }} />
      <div className="pelican-bg-beam" style={{ left: "60%", animationDelay: "-8s" }} />

      {/* Layered waves along the bottom of the viewport */}
      <div className="pelican-bg-waves">
        <svg
          className="pelican-bg-wave"
          style={{ animationDuration: "22s", opacity: 0.35 }}
          viewBox="0 0 2880 400"
          preserveAspectRatio="none"
        >
          <path d={WAVE_1} fill="rgba(6,182,212,0.10)" />
        </svg>
        <svg
          className="pelican-bg-wave"
          style={{ animationDuration: "14s", animationDirection: "reverse", opacity: 0.5 }}
          viewBox="0 0 2880 400"
          preserveAspectRatio="none"
        >
          <path d={WAVE_2} fill="rgba(34,211,238,0.10)" />
        </svg>
        <svg
          className="pelican-bg-wave"
          style={{ animationDuration: "9s", opacity: 0.7 }}
          viewBox="0 0 2880 400"
          preserveAspectRatio="none"
        >
          <path d={WAVE_3} fill="rgba(34,211,238,0.14)" />
        </svg>
      </div>
    </div>
  );
}
