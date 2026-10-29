"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Textures } from "./wash-game/engine";
import { GameFrame, Hud, Stage, TipLine, ToolPicker } from "./wash-game/ui";

/** Same boxes as the live game, so swapping it in causes no layout shift. */
function GameSkeleton() {
  return (
    <GameFrame>
      <Hud
        pct={0}
        seconds={0}
        damage={0}
        action={
          <span aria-hidden className="btn btn-secondary min-h-12 px-4 py-2 text-sm text-ink-2">
            Reset
          </span>
        }
      />
      <Stage>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(#4b7531 0 9.7%, transparent 9.7% 90.3%, #4b7531 90.3%), radial-gradient(circle at 30% 40%, #5b5f4c, #3f4434)",
          }}
        />
      </Stage>
      <ToolPicker value="surface" disabled />
      <TipLine tool="surface" />
      <div className="mt-1 flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2">
        <span aria-hidden className="btn btn-secondary min-h-12 px-5 py-2 text-sm text-ink-2">
          Auto-wash demo
        </span>
        <span className="text-sm text-ink-2">No mouse? The demo runs the surface cleaner for you.</span>
      </div>
    </GameFrame>
  );
}

const WashGameCanvas = dynamic(() => import("./WashGameCanvas"), {
  ssr: false,
  loading: () => <GameSkeleton />,
});

/** Mounts the game only when the section gets close to the viewport. */
export function WashGameLoader({ textures }: { textures: Textures }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{near ? <WashGameCanvas textures={textures} /> : <GameSkeleton />}</div>;
}
