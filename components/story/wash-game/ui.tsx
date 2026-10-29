import { TOOLS, formatTime, toolById, type ToolId } from "./tools";

/*
 * Presentational pieces shared by the live game and its loading skeleton, so
 * both render the same box sizes and the swap causes no layout shift.
 */

export function GameFrame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-line bg-canvas p-3 sm:p-4">{children}</div>;
}

export function Hud({
  pct,
  seconds,
  damage,
  action,
}: {
  pct: number;
  seconds: number;
  damage: number;
  /** The Reset button (or its inert stand-in in the skeleton). */
  action: React.ReactNode;
}) {
  const shown = Math.floor(pct * 100);
  return (
    <div>
      <div className="flex min-h-12 flex-wrap items-center gap-x-5 gap-y-1">
        <div aria-hidden className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Stat label="Clean" value={`${shown}%`} />
          <Stat label="Time" value={formatTime(seconds)} />
          <Stat label="Damage" value={String(damage)} danger={damage > 0} />
        </div>
        <div className="ml-auto">{action}</div>
      </div>
      <div aria-hidden className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-200"
          style={{ width: `${shown}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <p className="flex items-baseline gap-1.5">
      <span className="text-sm font-semibold tracking-wide text-ink-2 uppercase">{label}</span>
      <span className={`font-display text-xl tabular-nums ${danger ? "text-danger" : "text-ink"}`}>
        {value}
      </span>
    </p>
  );
}

export function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-[#4d5341] sm:aspect-[16/9]">
      {children}
    </div>
  );
}

export function ToolPicker({
  value,
  onChange,
  disabled,
}: {
  value: ToolId;
  onChange?: (id: ToolId) => void;
  disabled?: boolean;
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
    const i = TOOLS.findIndex((t) => t.id === value);
    const next = TOOLS[(i + dir + TOOLS.length) % TOOLS.length];
    onChange(next.id);
    const group = event.currentTarget;
    requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-tool="${next.id}"]`)?.focus());
  };

  return (
    <div
      role="radiogroup"
      aria-label="Nozzle tip"
      onKeyDown={move}
      className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6"
    >
      {TOOLS.map((tool) => {
        const checked = tool.id === value;
        return (
          <button
            key={tool.id}
            type="button"
            role="radio"
            aria-checked={checked}
            data-tool={tool.id}
            tabIndex={checked ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange?.(tool.id)}
            className={`relative flex min-h-14 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-sm leading-tight font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 ${
              checked
                ? "border-accent bg-accent-soft text-ink ring-2 ring-accent"
                : "border-line bg-surface text-ink-2 hover:text-ink"
            }`}
          >
            <span
              aria-hidden
              className={`h-4 w-4 shrink-0 rounded-full ${tool.id === "white" ? "ring-1 ring-ink-2/60" : ""} ${
                tool.id === "soap" ? "ring-1 ring-white/40" : ""
              }`}
              style={{ background: tool.color }}
            />
            <span>
              {tool.name}
              {tool.pick && (
                <span className="block text-xs font-bold tracking-wide text-accent-text uppercase">
                  Our pick
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function TipLine({ tool }: { tool: ToolId }) {
  return <p className="mt-3 min-h-12 text-base leading-snug text-ink-2">{toolById(tool).tip}</p>;
}
