"use client";

import { useCallback, useRef } from "react";
import { ChevronsLeftRight } from "lucide-react";
import type { Photo } from "@/data/site";
import { PhotoSlot } from "./PhotoSlot";

interface BeforeAfterProps {
  before: Photo;
  after: Photo;
  /** Placeholder hint shown while a photo is missing. */
  hint: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Drag-to-compare slider. The divider position lives in a CSS variable that
 * is written straight to the DOM, so dragging never re-renders React. A
 * visually hidden range input carries keyboard and screen reader support.
 */
export function BeforeAfter({
  before,
  after,
  hint,
  priority,
  sizes,
  className = "",
}: BeforeAfterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);

  const setPosition = useCallback((percent: number) => {
    const clamped = Math.min(100, Math.max(0, percent));
    frameRef.current?.style.setProperty("--pos", `${clamped}%`);
    if (inputRef.current) inputRef.current.value = String(Math.round(clamped));
  }, []);

  const positionFromPointer = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(((clientX - rect.left) / rect.width) * 100);
  };

  return (
    <div
      ref={frameRef}
      className={`relative isolate cursor-ew-resize touch-pan-y overflow-hidden select-none ${className}`}
      style={{ "--pos": "50%" } as React.CSSProperties}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        positionFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) positionFromPointer(event.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {/* After sits underneath and shows on the right. */}
      <PhotoSlot
        photo={after}
        hint={`After photo: ${hint}`}
        tone="after"
        priority={priority}
        sizes={sizes}
      />

      {/* Before sits on top, clipped to the left of the divider. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}
      >
        <PhotoSlot
          photo={before}
          hint={`Before photo: ${hint}`}
          tone="before"
          priority={priority}
          sizes={sizes}
        />
      </div>

      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        After
      </span>

      <input
        ref={inputRef}
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        aria-label="Compare before and after. Use the arrow keys to move the divider."
        className="peer sr-only"
        onChange={(event) => setPosition(Number(event.target.value))}
      />

      {/* Divider and handle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(11_29_51/0.15)]"
        style={{ left: "var(--pos)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg ring-accent peer-focus-visible:ring-4"
        style={{ left: "var(--pos)" }}
      >
        <ChevronsLeftRight className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
  );
}
