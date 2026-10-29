"use client";

import { useCallback, useEffect, useRef } from "react";
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
  /** Accessible name for the slider. */
  label?: string;
  /**
   * Nudge the handle once (50% → 62% → 50%) the first time the slider is at
   * least half in view, as a hint that it moves. Skipped under reduced motion
   * and once the visitor has touched it.
   */
  nudge?: boolean;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Drag-to-compare slider. The divider position lives in a CSS variable that
 * is written straight to the DOM, so dragging never re-renders React. The
 * frame itself is the focusable `role="slider"`, driven by pointer, touch and
 * keyboard (arrows 5%, Page Up/Down 10%, Home/End).
 */
export function BeforeAfter({
  before,
  after,
  hint,
  priority,
  sizes,
  className = "",
  label = "Compare before and after",
  nudge = false,
}: BeforeAfterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const pos = useRef(50);
  const dragging = useRef(false);
  const touched = useRef(false);

  const setPosition = useCallback((percent: number) => {
    const value = clamp(percent);
    pos.current = value;
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--pos", `${value}%`);
    const rounded = Math.round(value);
    frame.setAttribute("aria-valuenow", String(rounded));
    frame.setAttribute("aria-valuetext", `${rounded}% before shown`);
  }, []);

  const positionFromPointer = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(((clientX - rect.left) / rect.width) * 100);
  };

  // One-time nudge hint.
  useEffect(() => {
    const frame = frameRef.current;
    if (!nudge || !frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        if (touched.current) return;
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / duration);
          // Ease in-out on a half sine: 50 → 62 → 50.
          setPosition(50 + 12 * Math.sin(Math.PI * (0.5 - 0.5 * Math.cos(Math.PI * t))));
          if (t < 1) raf = requestAnimationFrame(tick);
          else setPosition(50);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [nudge, setPosition]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10,
    };
    let next: number | null = null;
    if (event.key in steps) next = pos.current + steps[event.key];
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    if (next === null) return;
    event.preventDefault();
    touched.current = true;
    setPosition(next);
  };

  return (
    <div
      ref={frameRef}
      role="slider"
      tabIndex={0}
      aria-label={`${label}. Use the arrow keys to move the divider.`}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={50}
      aria-valuetext="50% before shown"
      className={`group relative isolate cursor-ew-resize touch-pan-y overflow-hidden select-none focus-visible:outline-offset-4 ${className}`}
      style={{ "--pos": "50%" } as React.CSSProperties}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        dragging.current = true;
        touched.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        positionFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) positionFromPointer(event.clientX);
      }}
      // Without this, a mouse drag on a photo starts the browser's native
      // image drag, which cancels the pointer stream after a few pixels.
      onDragStart={(event) => event.preventDefault()}
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

      <span
        aria-hidden
        className="pointer-events-none absolute top-3 left-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
      >
        Before
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
      >
        After
      </span>

      {/* Divider and handle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(11_29_51/0.15)]"
        style={{ left: "var(--pos)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg ring-accent group-focus-visible:ring-4"
        style={{ left: "var(--pos)" }}
      >
        <ChevronsLeftRight className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
  );
}
