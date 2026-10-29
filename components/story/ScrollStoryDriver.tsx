"use client";

import { useEffect } from "react";
import { track, trackOnce } from "@/lib/analytics";
import { frameUrl, type FrameSet } from "@/lib/story";

export type DriverChapter = {
  id: string;
  start: number;
  end: number;
  /** A still has no wipe (the hero's "before"). */
  still: boolean;
  score: [number, number];
  step: string;
  dir: "up" | "down";
  order: "ltr" | "rtl";
  /** [from, to] of each copy beat, as fractions of the chapter. */
  beats: [number, number][];
};

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Overlap between chapters for the water-sheet transition. */
const OVERLAP = 0.05;
const LANES = 6;
const RING = 2 * Math.PI * 27;

/**
 * Drives one server-rendered story section: reads native scroll, writes CSS
 * variables. No scroll hijacking. Does nothing under reduced motion (the CSS
 * switches to stacked cards).
 */
export function ScrollStoryDriver({
  sectionId,
  chapters,
  frames,
}: {
  sectionId: string;
  chapters: DriverChapter[];
  frames: Record<string, FrameSet>;
}) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const isHero = sectionId === "top";

    const trackEl = section.querySelector<HTMLElement>(".story-track")!;
    const stage = section.querySelector<HTMLElement>(".story-stage")!;
    const layers = chapters.map((c) => section.querySelector<HTMLElement>(`[data-layer="${c.id}"]`)!);
    const edges = layers.map((l) => l.querySelector<HTMLElement>(".story-edge"));
    const articles = chapters.map((c) =>
      Array.from(section.querySelectorAll<HTMLElement>(`article[data-ch="${c.id}"]`))
    );
    const ringBar = section.querySelector<SVGCircleElement>(".story-ring-bar");
    const hudNum = section.querySelector<HTMLElement>("[data-hud-num]");
    const hudStep = section.querySelector<HTMLElement>("[data-hud-step]");

    // ---- frames (desktop scrub) -------------------------------------------
    type Seq = {
      set: FrameSet;
      imgs: (HTMLImageElement | null)[];
      started: boolean;
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D | null;
      drawn: number;
      live: boolean;
      layer: HTMLElement;
    };
    const seqs: Record<string, Seq> = {};
    chapters.forEach((c, i) => {
      const set = frames[c.id];
      const canvas = section.querySelector<HTMLCanvasElement>(`canvas[data-canvas-for="${c.id}"]`);
      if (set && canvas) {
        seqs[c.id] = {
          set,
          imgs: new Array(set.count).fill(null),
          started: false,
          canvas,
          ctx: canvas.getContext("2d"),
          drawn: -1,
          live: false,
          layer: layers[i],
        };
      }
    });
    const framesOn = () => desktop.matches && Object.keys(seqs).length > 0;

    let inflight = 0;
    const queue: (() => void)[] = [];
    const pump = () => {
      while (inflight < 6 && queue.length) queue.shift()!();
    };
    const loadSeq = (id: string) => {
      const seq = seqs[id];
      if (!seq || seq.started || !framesOn()) return;
      seq.started = true;
      // Every 4th frame first so scrubbing works early, then fill in.
      const order: number[] = [];
      for (let i = 0; i < seq.set.count; i += 4) order.push(i);
      for (let i = 0; i < seq.set.count; i++) if (i % 4) order.push(i);
      for (const i of order) {
        queue.push(() => {
          inflight++;
          const img = new Image();
          img.decoding = "async";
          img.src = frameUrl(seq.set, i);
          img
            .decode()
            .then(() => {
              seq.imgs[i] = img;
              if (!seq.live) {
                seq.live = true;
                seq.layer.dataset.canvas = "";
              }
              seq.drawn = -1;
              kick();
            })
            .catch(() => {})
            .finally(() => {
              inflight--;
              pump();
            });
        });
      }
      pump();
    };
    const nearestFrame = (seq: Seq, i: number) => {
      for (let d = 0; d < seq.imgs.length; d++) {
        if (seq.imgs[i - d]) return i - d;
        if (seq.imgs[i + d]) return i + d;
      }
      return -1;
    };
    /**
     * Draws the frame for progress t. Frames are sparse (the budget keeps
     * them around 6-12 fps), so the two neighbours are cross-faded, which
     * keeps scrubbing smooth instead of steppy.
     */
    const drawFrame = (seq: Seq, t: number) => {
      if (!seq.ctx || !seq.live) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(stage.clientWidth * dpr);
      const h = Math.round(stage.clientHeight * dpr);
      if (seq.canvas.width !== w || seq.canvas.height !== h) {
        seq.canvas.width = w;
        seq.canvas.height = h;
        seq.drawn = -1;
      }
      const exact = t * (seq.set.count - 1);
      const key = Math.round(exact * 20) / 20;
      if (key === seq.drawn) return;
      const a = nearestFrame(seq, Math.floor(exact));
      if (a < 0) return;
      const b = Math.ceil(exact);
      const frac = exact - Math.floor(exact);
      const paint = (img: HTMLImageElement, alpha: number) => {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        seq.ctx!.globalAlpha = alpha;
        seq.ctx!.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      };
      paint(seq.imgs[a]!, 1);
      if (b !== a && seq.imgs[b] && frac > 0.02) paint(seq.imgs[b]!, frac);
      seq.ctx.globalAlpha = 1;
      seq.drawn = key;
    };

    // ---- scroll -> progress ----------------------------------------------
    let target = 0;
    let cur = -1;
    let scoreShown = chapters[0].score[0];
    let lastStep = "";
    let raf = 0;
    let snap = false;

    const measure = () => {
      const r = trackEl.getBoundingClientRect();
      const total = r.height - stage.clientHeight;
      target = total > 0 ? clamp(-r.top / total) : 0;
    };

    const render = (p: number) => {
      let current = 0;
      chapters.forEach((c, i) => {
        if (p >= c.start) current = i;
      });

      chapters.forEach((c, i) => {
        const layer = layers[i];
        const next = chapters[i + 1];
        const cp = clamp((p - c.start) / (c.end - c.start));
        const w = c.still ? 0 : smooth(0.08, 0.9, cp);
        const begin = i === 0 ? -1 : c.start - OVERLAP / 2;
        const until = next ? next.start + OVERLAP / 2 : 2;
        const show = p >= begin && p < until;
        const near = p >= c.start - 0.25 && p < c.end + 0.05;

        layer.toggleAttribute("data-near", near || show);
        layer.toggleAttribute("data-show", show);
        if (show) {
          const t = i === 0 ? 1 : clamp((p - begin) / OVERLAP);
          layer.toggleAttribute("data-tr", t < 1);
          layer.style.setProperty("--t", t.toFixed(4));
          layer.style.setProperty("--w", w.toFixed(4));

          const edge = edges[i];
          if (edge) {
            const k = Math.min(LANES - 1, Math.floor(w * LANES));
            const s = clamp(w * LANES - k);
            const slot = c.order === "ltr" ? k : LANES - 1 - k;
            edge.style.setProperty("--ex", `${(slot / LANES) * 100}%`);
            edge.style.setProperty("--ey", `${(c.dir === "up" ? 1 - s : s) * 100}%`);
            edge.style.setProperty("--eo", w > 0.002 && w < 0.998 ? "1" : "0");
          }

          const seq = seqs[c.id];
          if (seq && framesOn()) drawFrame(seq, c.id === "final" ? cp : smooth(0.04, 0.96, cp));
        }

        // Fetch the next chapter's frames once this one is a third done.
        if (cp > 0.33 && next) loadSeq(next.id);

        // Copy beats: fade in over the first quarter of the beat, out over the last fifth.
        articles[i].forEach((art, bi) => {
          const [from, to] = c.beats[bi];
          const span = Math.max(0.05, to - from);
          const lastBeat = !next && bi === c.beats.length - 1;
          const heroFirst = isHero && i === 0 && bi === 0;
          const fin = heroFirst ? 1 : smooth(from, from + span * 0.25, cp);
          const fout = lastBeat ? 1 : 1 - smooth(to - span * 0.2, to, cp);
          const live = heroFirst ? p < c.end : cp > 0 && cp < 1;
          const o = live || lastBeat ? fin * fout : 0;
          art.style.setProperty("--o", o.toFixed(3));
          art.toggleAttribute("data-on", o > 0.5);
        });
      });

      // Curb appeal score.
      const c = chapters[current];
      const cp = clamp((p - c.start) / (c.end - c.start));
      const w = c.still ? 0 : smooth(0.08, 0.9, cp);
      const scoreTarget = c.score[0] + (c.score[1] - c.score[0]) * w;
      scoreShown += (scoreTarget - scoreShown) * 0.2;
      if (Math.abs(scoreTarget - scoreShown) < 0.2) scoreShown = scoreTarget;
      if (hudNum) hudNum.textContent = String(Math.round(scoreShown));
      if (ringBar) ringBar.style.strokeDashoffset = String(RING * (1 - scoreShown / 100));
      if (hudStep && c.step !== lastStep) {
        hudStep.textContent = c.step;
        lastStep = c.step;
      }

      if (!isHero && p > 0.97) trackOnce("story_complete");
      return Math.abs(scoreTarget - scoreShown) > 0.01;
    };

    const tick = () => {
      raf = 0;
      const lerp = desktop.matches && !snap ? 0.16 : 1;
      snap = false;
      cur = cur < 0 ? target : cur + (target - cur) * lerp;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      const moving = render(cur);
      if (cur !== target || moving) kick();
    };
    function kick() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    // Only run while the section is near the viewport.
    let nearView = true;
    const onScroll = () => {
      if (!nearView) return;
      measure();
      kick();
    };
    const onResize = () => {
      for (const s of Object.values(seqs)) s.drawn = -1;
      measure();
      kick();
    };
    const viewIO = new IntersectionObserver(
      ([entry]) => {
        nearView = entry.isIntersecting;
        if (nearView) onResize();
      },
      { rootMargin: "100% 0px" }
    );
    viewIO.observe(section);

    measure();
    kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Hero frames load after the page; later stories start when they get close.
    const firstMoving = chapters.find((c) => !c.still);
    const startFrames = () => firstMoving && loadSeq(firstMoving.id);
    let loadIO: IntersectionObserver | null = null;
    if (isHero) {
      if (document.readyState === "complete") startFrames();
      else window.addEventListener("load", startFrames, { once: true });
    } else {
      loadIO = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startFrames();
            loadIO?.disconnect();
          }
        },
        { rootMargin: "150% 0px" }
      );
      loadIO.observe(section);
    }
    const onDesktop = () => {
      if (desktop.matches && isHero) startFrames();
      onResize();
    };
    desktop.addEventListener("change", onDesktop);

    // Keyboard users: focusing a beat's link scrolls that beat into view.
    const onFocus = (e: FocusEvent) => {
      const art = (e.target as HTMLElement).closest<HTMLElement>("article[data-ch]");
      if (!art || art.hasAttribute("data-on")) return;
      const ci = chapters.findIndex((c) => c.id === art.dataset.ch);
      if (ci < 0) return;
      const c = chapters[ci];
      const [from, to] = c.beats[Number(art.dataset.beat) || 0];
      const r = trackEl.getBoundingClientRect();
      const total = r.height - stage.clientHeight;
      const mid = c.start + (c.end - c.start) * (from + (to - from) * 0.6);
      window.scrollTo({ top: window.scrollY + r.top + total * mid, behavior: "instant" });
      measure();
      snap = true;
      kick();
    };
    section.addEventListener("focusin", onFocus);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-cta]");
      if (a?.dataset.cta === "skip") track("skip_show");
    };
    section.addEventListener("click", onClick);

    // ---- cursor spray (desktop, fine pointer only) -------------------------
    const spray = section.querySelector<HTMLCanvasElement>(".story-spray");
    const sprayCtx = spray?.getContext("2d") ?? null;
    type P = { x: number; y: number; vx: number; vy: number; life: number; r: number };
    const parts: P[] = [];
    let sprayRaf = 0;
    let stageVisible = true;
    const sprayTick = () => {
      sprayRaf = 0;
      if (!spray || !sprayCtx) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = stage.clientWidth * dpr;
      const h = stage.clientHeight * dpr;
      if (spray.width !== w || spray.height !== h) {
        spray.width = w;
        spray.height = h;
      }
      sprayCtx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i];
        q.x += q.vx;
        q.y += q.vy;
        q.vy += 0.04;
        q.life -= 0.022;
        if (q.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        sprayCtx.beginPath();
        sprayCtx.fillStyle = `rgba(220, 246, 252, ${(q.life * 0.55).toFixed(3)})`;
        sprayCtx.arc(q.x * dpr, q.y * dpr, q.r * dpr, 0, Math.PI * 2);
        sprayCtx.fill();
      }
      if (parts.length && stageVisible) sprayRaf = requestAnimationFrame(sprayTick);
    };
    const onMove = (e: PointerEvent) => {
      if (!finePointer.matches || e.pointerType !== "mouse" || !stageVisible) return;
      const r = stage.getBoundingClientRect();
      for (let n = 0; n < 2 && parts.length < 40; n++) {
        parts.push({
          x: e.clientX - r.left,
          y: e.clientY - r.top,
          vx: (Math.random() - 0.5) * 1.6,
          vy: Math.random() * 0.8 + 0.2,
          life: 1,
          r: Math.random() * 1.8 + 0.6,
        });
      }
      if (!sprayRaf) sprayRaf = requestAnimationFrame(sprayTick);
    };
    stage.addEventListener("pointermove", onMove);
    const stageIO = new IntersectionObserver(([entry]) => {
      stageVisible = entry.isIntersecting;
    });
    stageIO.observe(stage);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", startFrames);
      desktop.removeEventListener("change", onDesktop);
      section.removeEventListener("focusin", onFocus);
      section.removeEventListener("click", onClick);
      stage.removeEventListener("pointermove", onMove);
      stageIO.disconnect();
      viewIO.disconnect();
      loadIO?.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sprayRaf);
      queue.length = 0;
    };
  }, [sectionId, chapters, frames]);

  return null;
}
