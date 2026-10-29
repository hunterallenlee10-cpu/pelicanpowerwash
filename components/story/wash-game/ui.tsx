import { STAINS, type StainId } from "@/data/game-stains";
import type { View } from "./engine";
import { TH, TW } from "./textures";
import { VISIBLE_TOOLS, formatTime, toolById, type ToolId } from "./tools";

/*
 * Presentational pieces shared by the live game and its loading skeleton, so
 * both render the same box sizes and the swap causes no layout shift.
 */

/** A stain counts as washed once this share of it is gone. */
export const STAIN_DONE = 0.8;

export function GameFrame({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

const pill =
  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export function ToolRow({
  value,
  onChange,
  disabled,
  sound,
  onSound,
  action,
}: {
  value: ToolId;
  onChange?: (id: ToolId) => void;
  disabled?: boolean;
  sound: boolean;
  onSound?: () => void;
  /** Reset (or its inert stand-in in the skeleton). */
  action?: React.ReactNode;
}) {
  const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onChange) return;
    const dir =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    event.preventDefault();
    const i = VISIBLE_TOOLS.indexOf(value);
    const next = VISIBLE_TOOLS[(i + dir + VISIBLE_TOOLS.length) % VISIBLE_TOOLS.length];
    onChange(next);
    const group = event.currentTarget;
    requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-tool="${next}"]`)?.focus());
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div role="radiogroup" aria-label="Cleaning tool" onKeyDown={move} className="flex flex-wrap gap-2">
        {VISIBLE_TOOLS.map((id) => {
          const checked = id === value;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={checked}
              data-tool={id}
              tabIndex={checked ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange?.(id)}
              className={`${pill} ${
                checked
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line bg-surface text-ink-2 hover:border-ink-2 hover:text-ink"
              }`}
            >
              {toolById(id).name}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        aria-pressed={sound}
        onClick={onSound}
        disabled={!onSound}
        className={`${pill} ${sound ? "border-ink text-ink" : "border-line bg-surface text-ink-2 hover:text-ink"}`}
      >
        <span aria-hidden className={`h-2 w-2 rounded-full ${sound ? "bg-accent" : "bg-ink-2/50"}`} />
        Sound {sound ? "on" : "off"}
      </button>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

export function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-[#55574c] ring-1 ring-white/10 sm:aspect-[16/9]">
      {children}
    </div>
  );
}

/** Mono "CLEAN | TIME" readout pinned to the slab's top-left corner. */
export function HudChip({ pct, seconds }: { pct: number; seconds: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-3 left-3 z-10 flex items-stretch gap-3 rounded-lg bg-black/60 px-3 py-1.5 font-mono text-white ring-1 ring-white/15 backdrop-blur-sm"
    >
      <span className="flex flex-col leading-none">
        <span className="text-[0.6rem] tracking-[0.16em] text-white/60 uppercase">Clean</span>
        <span className="mt-1 text-lg font-semibold tabular-nums">{Math.floor(pct * 100)}%</span>
      </span>
      <span className="w-px bg-white/20" />
      <span className="flex flex-col leading-none">
        <span className="text-[0.6rem] tracking-[0.16em] text-white/60 uppercase">Time</span>
        <span className="mt-1 text-lg font-semibold tabular-nums">{formatTime(seconds)}</span>
      </span>
    </div>
  );
}

/** Small mono labels pinned on the stains; each fades once it's washed. */
export function StainLabels({ view, progress }: { view: View; progress: Record<StainId, number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {STAINS.map((st) => {
        const left = (((st.x / 100) * TW - view.vx) / view.vw) * 100;
        const top = (((st.y / 100) * TH - view.vy) / view.vh) * 100;
        if (left < 2 || left > 98 || top < 2 || top > 98) return null;
        const done = (progress[st.id] ?? 0) >= STAIN_DONE;
        return (
          <span
            key={st.id}
            className="absolute flex -translate-x-[6px] -translate-y-1/2 items-center gap-1.5 transition-opacity duration-500"
            style={{ left: `${left}%`, top: `${top}%`, opacity: done ? 0 : 1 }}
          >
            <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-black/50" style={{ background: st.dot }} />
            <span className="rounded bg-black/65 px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold tracking-[0.12em] whitespace-nowrap text-white uppercase backdrop-blur-sm sm:text-[0.65rem]">
              {st.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** What each stain is and how it really comes off. */
export function Legend({ progress }: { progress?: Record<StainId, number> }) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {STAINS.map((st) => {
        const done = (progress?.[st.id] ?? 0) >= STAIN_DONE;
        return (
          <li
            key={st.id}
            className={`rounded-xl border p-3 transition-colors duration-300 ${
              done ? "border-accent/70 bg-accent-soft" : "border-line bg-surface"
            }`}
          >
            <p className="flex items-center gap-2 font-mono text-[0.7rem] font-semibold tracking-[0.14em] text-ink uppercase">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: st.dot }} />
              {st.label}
              {done && <span className="ml-auto text-accent-text">Washed</span>}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-ink-2">{st.note}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function TipLine({ tool }: { tool: ToolId }) {
  return <p className="mt-3 min-h-12 text-base leading-snug text-ink-2">{toolById(tool).tip}</p>;
}
