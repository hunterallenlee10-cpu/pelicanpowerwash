"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { GAUGE_MAX_PSI, psiLabel, surfaceSummary, type Surface } from "@/data/surfaces";

export type TileImage = {
  avif: string;
  webp: string;
  src: string;
  width: number;
  height: number;
};

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
  tiles,
  intro,
}: {
  surfaces: Surface[];
  tiles: Record<string, TileImage | null>;
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
  const tile = tiles[surface.id];

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
    <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
      <div>
        {intro}
        <p id="surface-label" className="mt-10 text-sm font-semibold text-ink-2">
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
                    ? "bg-ink text-canvas"
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

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
        <div className="relative mx-auto max-w-md">
          <svg viewBox="0 0 260 150" className="w-full" aria-hidden focusable="false">
            <path d={ARC} fill="none" stroke="var(--line)" strokeWidth={16} strokeLinecap="round" />
            <path
              d={ARC}
              pathLength={GAUGE_MAX_PSI}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={16}
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
                  strokeWidth={major ? 2 : 1}
                  strokeLinecap="round"
                />
              );
            })}
            {TICKS.filter((psi) => psi % 1000 === 0).map((psi) => {
              const p = polar(psi, R - 38);
              return (
                <text
                  key={psi}
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
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
          <p className="mt-1 text-center text-xs font-semibold tracking-[0.14em] text-ink-2 uppercase">
            PSI
          </p>
        </div>

        <div className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-[8rem_1fr]">
          <div className="relative aspect-square w-32 overflow-hidden rounded-xl sm:w-full">
            {tile ? (
              <picture>
                <source type="image/avif" srcSet={tile.avif} sizes="128px" />
                <img
                  src={tile.src}
                  srcSet={tile.webp}
                  sizes="128px"
                  width={tile.width}
                  height={tile.height}
                  loading="lazy"
                  decoding="async"
                  alt={`${surface.name}, half dirty and half cleaned`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            ) : (
              <div
                role="img"
                aria-label={`${surface.name}, half dirty and half cleaned`}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${surface.swatch.dirty} 0 50%, ${surface.swatch.clean} 50% 100%)`,
                }}
              />
            )}
          </div>

          <dl className="space-y-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="sr-only">Method</dt>
              <dd className="font-display text-2xl text-ink">{surface.method}</dd>
              <dt className="sr-only">Pressure</dt>
              <dd className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-text">
                {psiLabel(surface.psi)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">Why</dt>
              <dd className="mt-0.5 leading-relaxed text-ink-2">{surface.why}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-ink">When it's done wrong</dt>
              <dd className="mt-0.5 leading-relaxed text-ink-2">{surface.wrong}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
