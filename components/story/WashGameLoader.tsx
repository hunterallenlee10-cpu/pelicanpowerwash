"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Textures } from "./wash-game/engine";
import { GameFrame, HudChip, Legend, Stage, TipLine, ToolRow } from "./wash-game/ui";

/** Same boxes as the live game, so swapping it in causes no layout shift. */
function GameSkeleton({ poster }: { poster: string | null }) {
  return (
    <GameFrame>
      <ToolRow value="surface" disabled sound={false} />
      <Stage>
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: poster
              ? `url(${poster})`
              : "linear-gradient(#4b7531 0 5%, transparent 5% 95%, #4b7531 95%), radial-gradient(circle at 30% 40%, #5b5f4c, #3f4434)",
          }}
        />
        <HudChip pct={0} seconds={0} />
      </Stage>
      <TipLine tool="surface" />
      <Legend />
    </GameFrame>
  );
}

const WashGameCanvas = dynamic(() => import("./WashGameCanvas"), {
  ssr: false,
  loading: () => <GameSkeleton poster={null} />,
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

  return <div ref={ref}>{near ? <WashGameCanvas textures={textures} /> : <GameSkeleton poster={null} />}</div>;
}
