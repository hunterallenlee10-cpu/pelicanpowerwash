"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { WashEngine, type Textures } from "./wash-game/engine";
import { formatTime, gradeFor, toolById, type ToolId } from "./wash-game/tools";
import { GameFrame, Hud, Stage, TipLine, ToolPicker } from "./wash-game/ui";

const ETCH_TOAST = "That's etching, and it's permanent. Pros never use a 0° tip on concrete.";

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

type Result = { seconds: number; damage: number; grade: string; demo: boolean };

/** The "wash this driveway" game. Loaded lazily by WashGameLoader. */
export default function WashGameCanvas({ textures }: { textures: Textures }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WashEngine | null>(null);
  const toastTimer = useRef(0);
  const lastToast = useRef(0);
  const milestone = useRef(0);

  const coarse = useMedia("(pointer: coarse)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState<ToolId>("surface");
  const [pct, setPct] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [damage, setDamage] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [toast, setToast] = useState("");
  const [armed, setArmed] = useState(false);
  const [demo, setDemo] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new WashEngine(canvas, {
      onStart: () => track("game_start"),
      onDamage: (total) => {
        setDamage(total);
        navigator.vibrate?.(30);
        const now = Date.now();
        if (now - lastToast.current > 2500) {
          lastToast.current = now;
          setToast(ETCH_TOAST);
          window.clearTimeout(toastTimer.current);
          toastTimer.current = window.setTimeout(() => setToast(""), 3200);
        }
      },
      onSample: (p, secs) => {
        setPct(p);
        setSeconds(secs);
        const m = Math.min(75, Math.floor((p * 100) / 25) * 25);
        if (m > milestone.current) {
          milestone.current = m;
          setAnnounce(`${m}% clean`);
        }
      },
      onComplete: (secs, dmg) => {
        const usedDemo = engine.usedDemo;
        const grade = gradeFor(secs, dmg);
        setSeconds(secs);
        setPct((p) => Math.max(p, 0.95));
        setResult({ seconds: secs, damage: dmg, grade, demo: usedDemo });
        setDemo(false);
        setArmed(false);
        setAnnounce(`Clean. Time ${formatTime(secs)}, damage ${dmg}, grade ${grade}.`);
        if (!usedDemo) {
          track("game_complete", { seconds: Math.round(secs), damage: dmg, grade });
        }
      },
      onDemoEnd: () => setDemo(false),
    });
    engineRef.current = engine;
    let alive = true;
    engine.load(textures).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
      window.clearTimeout(toastTimer.current);
      engine.destroy();
      engineRef.current = null;
    };
  }, [textures]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.reduced = reduced;
  }, [reduced]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.touchArmed = armed;
  }, [armed]);

  useEffect(() => {
    if (!result) return;
    // The card renders twice (overlay on larger screens, below the stage on
    // phones); focus whichever copy is visible.
    const cards = document.querySelectorAll<HTMLElement>("[data-result-card]");
    [...cards].find((el) => el.offsetParent !== null)?.focus();
  }, [result]);

  const chooseTool = useCallback((id: ToolId) => {
    setTool(id);
    engineRef.current?.setTool(toolById(id));
  }, []);

  const reset = () => {
    engineRef.current?.reset();
    engineRef.current?.setTool(toolById(tool));
    milestone.current = 0;
    setPct(0);
    setSeconds(0);
    setDamage(0);
    setResult(null);
    setToast("");
    setDemo(false);
    setAnnounce("Driveway reset.");
  };

  const toggleDemo = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (demo) {
      engine.stopDemo();
      engine.setTool(toolById(tool));
      setDemo(false);
    } else {
      setTool("surface");
      engine.startDemo();
      setDemo(true);
    }
  };

  const resultCard = result ? (
    <div
      data-result-card
      tabIndex={-1}
      className="w-full max-w-md rounded-2xl bg-surface p-5 text-ink shadow-2xl outline-none sm:p-7"
    >
      <div className="flex items-center gap-4">
        <span className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-on-accent">
          {result.grade}
        </span>
        <div>
          <h3 className="font-display text-xl sm:text-2xl">
            {result.demo ? "That's how we do it." : "Driveway clean."}
          </h3>
          <p className="text-base text-ink-2">
            {formatTime(result.seconds)} · {result.damage} damage
          </p>
        </div>
      </div>
      <p className="mt-3 text-base leading-snug text-ink-2">
        {result.demo
          ? "Surface cleaner, overlapping lanes: even finish, no stripes, no etching."
          : result.damage > 0
            ? `You etched the concrete ${result.damage} time${result.damage > 1 ? "s" : ""}. On a real driveway, that stays.`
            : "No etching. That's pro-level."}
      </p>
      <p className="mt-3 text-base font-semibold">Nice. Want it done for real, with zero etching?</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href="#instant-price" className="btn btn-primary min-h-12">
          Get my price →
        </a>
        <button type="button" onClick={reset} className="btn btn-secondary min-h-12">
          Play again
        </button>
      </div>
    </div>
  ) : null;

  const showStartOverlay = coarse && !armed && !result && !demo && ready;

  return (
    <GameFrame>
      <Hud
        pct={pct}
        seconds={seconds}
        damage={damage}
        action={
          <button type="button" onClick={reset} className="btn btn-secondary min-h-12 px-4 py-2 text-sm">
            Reset
          </button>
        }
      />

      <Stage>
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full select-none"
          style={{ touchAction: armed ? "none" : "pan-y", cursor: coarse ? "auto" : "none" }}
        />
        {!ready && (
          <p className="absolute inset-0 flex items-center justify-center text-base font-semibold text-white/80">
            Pouring the driveway…
          </p>
        )}

        {showStartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy/35">
            <button type="button" onClick={() => setArmed(true)} className="btn btn-primary min-h-12">
              Tap to start washing
            </button>
          </div>
        )}

        {armed && !result && (
          <button
            type="button"
            onClick={() => setArmed(false)}
            className="btn absolute top-3 right-3 min-h-12 bg-white px-5 py-2 text-sm text-navy shadow-lg"
          >
            Done
          </button>
        )}

        {toast && (
          <p
            role="status"
            className="absolute inset-x-3 bottom-3 rounded-xl border-l-4 border-[#d92d20] bg-navy/95 px-4 py-3 text-base leading-snug font-semibold text-white shadow-lg sm:inset-x-auto sm:left-3 sm:max-w-md"
          >
            {toast}
          </p>
        )}

        {result && (
          // Phones: the slab is too short for the card, so it sits under the stage instead.
          <div className="absolute inset-0 hidden items-center justify-center bg-navy/75 p-3 backdrop-blur-sm sm:flex">
            {resultCard}
          </div>
        )}
      </Stage>
      {result && <div className="mt-3 sm:hidden">{resultCard}</div>}

      <ToolPicker value={tool} onChange={chooseTool} disabled={demo || !!result} />
      <TipLine tool={tool} />

      <div className="mt-1 flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={toggleDemo}
          disabled={!ready || !!result}
          className="btn btn-secondary min-h-12 px-5 py-2 text-sm disabled:opacity-60"
        >
          {demo ? "Stop demo" : "Auto-wash demo"}
        </button>
        <span className="text-sm text-ink-2">No mouse? The demo runs the surface cleaner for you.</span>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </GameFrame>
  );
}
