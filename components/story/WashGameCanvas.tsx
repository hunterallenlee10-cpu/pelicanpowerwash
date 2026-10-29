"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { STAINS, type StainId } from "@/data/game-stains";
import { track } from "@/lib/analytics";
import { WashEngine, type Textures, type View } from "./wash-game/engine";
import { SpraySound } from "./wash-game/sound";
import { TH, TW } from "./wash-game/textures";
import { formatTime, gradeFor, toolById, type ToolId } from "./wash-game/tools";
import { GameFrame, HudChip, Legend, STAIN_DONE, Stage, StainLabels, TipLine, ToolRow } from "./wash-game/ui";

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

type Result = { seconds: number; grade: string; demo: boolean };

const ZERO = Object.fromEntries(STAINS.map((s) => [s.id, 0])) as Record<StainId, number>;

const glassPill =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-black/60 px-4 font-mono text-[0.68rem] font-semibold tracking-[0.12em] text-white uppercase ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-black/75 disabled:opacity-50";

/** The "wash this driveway" game. Loaded lazily by WashGameLoader. */
export default function WashGameCanvas({ textures }: { textures: Textures }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WashEngine | null>(null);
  const soundRef = useRef<SpraySound | null>(null);
  const toolRef = useRef<ToolId>("surface");
  const milestone = useRef(0);
  const washed = useRef(new Set<StainId>());

  const coarse = useMedia("(pointer: coarse)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState<ToolId>("surface");
  const [pct, setPct] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState<Record<StainId, number>>(ZERO);
  const [view, setView] = useState<View>({ vx: 0, vy: 0, vw: TW, vh: TH });
  const [result, setResult] = useState<Result | null>(null);
  const [armed, setArmed] = useState(false);
  const [demo, setDemo] = useState(false);
  const [sound, setSound] = useState(false);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new WashEngine(canvas, {
      onStart: () => {
        setStarted(true);
        track("game_start");
      },
      onDamage: () => {},
      onStains: (p) => {
        setProgress(p);
        for (const st of STAINS) {
          if (p[st.id] >= STAIN_DONE && !washed.current.has(st.id)) {
            washed.current.add(st.id);
            setAnnounce(`${st.label} washed.`);
          }
        }
      },
      onView: setView,
      onSpray: (active) => soundRef.current?.set(active, toolRef.current),
      onSample: (p, secs) => {
        setStarted(true);
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
        setResult({ seconds: secs, grade, demo: usedDemo });
        setDemo(false);
        setArmed(false);
        setAnnounce(`Clean. Time ${formatTime(secs)}, grade ${grade}.`);
        if (!usedDemo) track("game_complete", { seconds: Math.round(secs), damage: dmg, grade });
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
      engine.destroy();
      engineRef.current = null;
    };
  }, [textures]);

  useEffect(() => () => soundRef.current?.destroy(), []);

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
    toolRef.current = id;
    engineRef.current?.setTool(toolById(id));
  }, []);

  const toggleSound = () => {
    if (!soundRef.current) soundRef.current = new SpraySound();
    if (sound) soundRef.current.disable();
    else soundRef.current.enable();
    setSound(!sound);
  };

  const reset = () => {
    engineRef.current?.reset();
    engineRef.current?.setTool(toolById(tool));
    milestone.current = 0;
    washed.current.clear();
    setPct(0);
    setSeconds(0);
    setStarted(false);
    setProgress(ZERO);
    setResult(null);
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
      toolRef.current = "surface";
      engine.startDemo();
      setDemo(true);
    }
  };

  const resultCard = result ? (
    <div
      data-result-card
      tabIndex={-1}
      className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 text-ink shadow-2xl outline-none sm:p-7"
    >
      <div className="flex items-center gap-4">
        <span className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl text-on-accent">
          {result.grade}
        </span>
        <div>
          <p className="eyebrow">{result.demo ? "How a pro does it" : "Driveway washed"}</p>
          <h3 className="font-display mt-1 text-xl sm:text-2xl">
            {result.demo ? "Even lanes, no stripes." : `Done in ${formatTime(result.seconds)}.`}
          </h3>
        </div>
      </div>
      <p className="mt-3 text-base leading-snug text-ink-2">
        {result.demo
          ? "A 20-inch surface cleaner, every lane overlapping the last. That's the finish you get from us."
          : tool === "surface"
            ? "You picked the right tool. Now picture doing the whole driveway, edges and all, in July."
            : "The wand gets there, but it's slow and it stripes. That's why we bring the surface cleaner."}
      </p>
      <p className="mt-3 text-base font-semibold">Want it done for real? See your price in 20 seconds.</p>
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
      <ToolRow
        value={tool}
        onChange={chooseTool}
        disabled={demo || !!result}
        sound={sound}
        onSound={toggleSound}
        action={
          started || result ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-mono text-[0.72rem] font-semibold tracking-[0.12em] text-ink-2 uppercase hover:text-ink"
            >
              Reset
            </button>
          ) : null
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
          <p className="absolute inset-0 flex items-center justify-center font-mono text-sm tracking-[0.14em] text-white/80 uppercase">
            Pouring the driveway…
          </p>
        )}

        {ready && <StainLabels view={view} progress={progress} />}
        <HudChip pct={pct} seconds={seconds} />

        <button
          type="button"
          onClick={toggleDemo}
          disabled={!ready || !!result}
          className={`${glassPill} absolute top-3 right-3 z-20`}
        >
          <span aria-hidden>{demo ? "■" : "▶"}</span>
          {demo ? "Stop demo" : "Watch a pro do it"}
        </button>

        {showStartOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
            <button type="button" onClick={() => setArmed(true)} className="btn btn-primary min-h-12">
              Tap to start washing
            </button>
          </div>
        )}

        {armed && !result && (
          <button
            type="button"
            onClick={() => setArmed(false)}
            className="btn absolute right-3 bottom-3 z-20 min-h-12 bg-white px-5 py-2 text-sm text-[#07090c] shadow-lg"
          >
            Done
          </button>
        )}

        {result && (
          // Phones: the slab is too short for the card, so it sits under the stage instead.
          <div className="absolute inset-0 z-30 hidden items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:flex">
            {resultCard}
          </div>
        )}
      </Stage>
      {result && <div className="mt-3 sm:hidden">{resultCard}</div>}

      <TipLine tool={tool} />
      <Legend progress={progress} />

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </GameFrame>
  );
}
