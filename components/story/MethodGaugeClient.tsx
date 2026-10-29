"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { GAUGE_MAX_PSI, psiRange, surfaceSummary, type Surface } from "@/data/surfaces";

// Gauge geometry (SVG user units).
const CX = 130;
const CY = 136;
const R = 110;
const ARC = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
/** Keep very narrow ranges (the roof) visible as a band. */
const MIN_BAND = 70;

function polar(psi: number, radius: number) {
  const theta = Math.PI - (psi / GAUGE_MAX_PSI) * Math.PI;
  return { x: CX + radius * Math.cos(theta), y: CY - radius * Math.sin(theta) };
}

const TICKS = Array.from({ length: GAUGE_MAX_PSI / 250 + 1 }, (_, i) => i * 250);

export function MethodGaugeClient({
  surfaces,
  intro,
}: {
  surfaces: Surface[];
  intro: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const surface = surfaces[index];
  const [min, max] = surface.psi;
  const mid = (min + max) / 2;
  const bandStart = Math.max(0, Math.min(min, max - MIN_BAND));
  const bandLength = Math.max(max - min, MIN_BAND);
  const needleDeg = (mid / GAUGE_MAX_PSI) * 180;

  const select = (next: number, focus = false) => {
    setIndex(next);
    if (focus) chipRefs.current[next]?.focus();
    if (next !== index) track("gauge_select", { surface: surfaces[next].id });
  };

  const onKey = (event: React.KeyboardEvent, i: number) => {
    const last = surfaces.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
      <div>
        {intro}
        <p id="surface-label" className="label-mono mt-9 text-ink-2">
          Pick a surface
        </p>
        <div
          role="radiogroup"
          aria-labelledby="surface-label"
          className="mt-3 flex flex-wrap gap-2"
        >
          {surfaces.map((s, i) => {
            const checked = i === index;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(event) => onKey(event, i)}
                className={`min-h-12 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${
                  checked
                    ? "bg-accent text-on-accent"
                    : "border border-line bg-surface text-ink-2 hover:border-ink-2 hover:text-ink"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {surfaceSummary(surface)}
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:p-9">
        <div className="relative mx-auto max-w-md">
          <svg viewBox="0 0 260 150" className="w-full" aria-hidden focusable="false">
            <path d={ARC} fill="none" stroke="var(--surface-2)" strokeWidth={14} strokeLinecap="round" />
            <path
              d={ARC}
              pathLength={GAUGE_MAX_PSI}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={`${bandLength} ${GAUGE_MAX_PSI * 2}`}
              strokeDashoffset={-bandStart}
              className="transition-[stroke-dasharray,stroke-dashoffset] duration-500 ease-out"
            />
            {TICKS.map((psi) => {
              const major = psi % 1000 === 0;
              const a = polar(psi, R - 14);
              const b = polar(psi, R - (major ? 24 : 19));
              return (
                <line
                  key={psi}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--ink-2)"
                  strokeOpacity={major ? 0.9 : 0.5}
                  strokeWidth={major ? 2 : 1}
                  strokeLinecap="round"
                />
              );
            })}
            {TICKS.filter((psi) => psi % 1000 === 0).map((psi) => {
              const p = polar(psi, R - 36);
              return (
                <text
                  key={psi}
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fontFamily="var(--font-mono)"
                  fill="var(--ink-2)"
                >
                  {psi === 0 ? "0" : `${psi / 1000}k`}
                </text>
              );
            })}
            <g
              style={{
                transform: `rotate(${needleDeg}deg)`,
                transformOrigin: `${CX}px ${CY}px`,
                transformBox: "view-box",
                transition: "transform 650ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <line
                x1={CX}
                y1={CY}
                x2={CX - (R - 30)}
                y2={CY}
                stroke="var(--ink)"
                strokeWidth={4}
                strokeLinecap="round"
              />
            </g>
            <circle cx={CX} cy={CY} r={9} fill="var(--ink)" />
            <circle cx={CX} cy={CY} r={3.5} fill="var(--surface)" />
          </svg>
          {/* Big readout under the hub. */}
          <div className="mt-3 text-center" aria-hidden>
            <p className="font-display text-4xl leading-none text-ink tabular-nums sm:text-5xl">
              {psiRange(surface.psi)}
            </p>
            <p className="label-mono mt-2 text-ink-2">PSI at the surface</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <dt className="label-mono text-ink-2">Method</dt>
            <dd className="mt-1.5 text-lg font-bold text-accent-text">{surface.method}</dd>
          </div>
          <div>
            <dt className="label-mono text-ink-2">Tool</dt>
            <dd className="mt-1.5 text-lg font-semibold text-ink">{surface.tool}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="sr-only">Why this method</dt>
            <dd className="leading-relaxed text-ink-2">{surface.note}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
