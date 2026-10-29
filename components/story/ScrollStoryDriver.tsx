"use client";

import { useEffect } from "react";
import { track, trackOnce } from "@/lib/analytics";
import { frameUrl, type FrameSet } from "@/lib/story";

export type DriverChapter = {
  id: string;
  start: number;
  end: number;
  meter: number;
  hud: string;
  dir: "up" | "down";
  order: "ltr" | "rtl";
};

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Overlap between chapters for the water-sheet transition. */
const OVERLAP = 0.06;
const LANES = 6;
const RING = 2 * Math.PI * 27;

/**
 * Drives the server-rendered story: reads native scroll, writes CSS
 * variables. No scroll hijacking. Does nothing under reduced motion (the CSS
 * switches to stacked cards).
 */
export function ScrollStoryDriver({ chapters, frames }: { chapters: DriverChapter[]; frames: Record<string, FrameSet> }) {
  useEffect(() => {
    const section = document.getElementById("top");
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const trackEl = section.querySelector<HTMLElement>(".story-track")!;
    const stage = section.querySelector<HTMLElement>(".story-stage")!;
    const layers = chapters.map((c) => section.querySelector<HTMLElement>(`[data-layer="${c.id}"]`)!);
    const edges = layers.map((l) => l.querySelector<HTMLElement>(".story-edge"));
    const articles = chapters.map((c) => section.querySelector<HTMLElement>(`article[data-ch="${c.id}"]`)!);
    const ringBar = section.querySelector<SVGCircleElement>(".story-ring-bar");
    const hudNum = section.querySelector<HTMLElement>("[data-hud-num]");
    const hudLabel = section.querySelector<HTMLElement>("[data-hud-label]");
    const mist = section.querySelector<HTMLElement>(".story-mist");

    // ---- frames (desktop scrub) -------------------------------------------
    type Seq = {
      set: FrameSet;
      imgs: (HTMLImageElement | null)[];
      started: boolean;
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D | null;
      drawn: number;
      live: boolean;
    };
    const seqs: Record<string, Seq> = {};
    for (const c of chapters) {
      const set = frames[c.id];
      const canvas = section.querySelector<HTMLCanvasElement>(`canvas[data-canvas-for="${c.id}"]`);
      if (set && canvas) {
        seqs[c.id] = { set, imgs: new Array(set.count).fill(null), started: false, canvas, ctx: canvas.getContext("2d"), drawn: -1, live: false };
      }
    }
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
      // Load every 4th frame first so scrubbing works early, then fill in.
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
                layers[chapters.findIndex((c) => c.id === id)].dataset.canvas = "";
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
    const sizeCanvas = (seq: Seq) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(stage.clientWidth * dpr);
      const h = Math.round(stage.clientHeight * dpr);
      if (seq.canvas.width !== w || seq.canvas.height !== h) {
        seq.canvas.width = w;
        seq.canvas.height = h;
        seq.drawn = -1;
      }
    };
    const drawFrame = (seq: Seq, t: number) => {
      if (!seq.ctx || !seq.live) return;
      sizeCanvas(seq);
      const want = Math.round(t * (seq.set.count - 1));
      const idx = nearestFrame(seq, want);
      if (idx < 0 || idx === seq.drawn) return;
      const img = seq.imgs[idx]!;
      const cw = seq.canvas.width;
      const ch = seq.canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      seq.ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      seq.drawn = idx;
    };

    // ---- scroll -> progress ----------------------------------------------
    let target = 0;
    let cur = -1;
    let meterShown = 0;
    let lastLabel = "";
    let raf = 0;
    /** Skip the easing for one jump (keyboard focus), so focused copy is visible at once. */
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
        const w = i === 0 ? 0 : smooth(0.1, 0.85, cp);
        const begin = i === 0 ? -1 : c.start - OVERLAP / 2;
        const until = next ? next.start + OVERLAP / 2 : 2;
        const show = p >= begin && p < until;
        const near = p >= c.start - 0.2 && p < c.end + 0.05;

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
          if (seq && framesOn()) drawFrame(seq, c.id === "final" ? cp : smooth(0.05, 0.95, cp));
        }

        // Fetch the next chapter's frames once this one is half done.
        if (cp > 0.5 && next) loadSeq(next.id);

        // Overlay copy: in over 15-40% of the chapter, out over 85-100%.
        let o: number;
        if (i === 0) o = 1 - smooth(0.35, 0.9, cp);
        else {
          const fin = smooth(0.15, 0.4, cp);
          const fout = next ? 1 - smooth(0.85, 1, cp) : 1;
          o = fin * fout;
        }
        const art = articles[i];
        art.style.setProperty("--o", o.toFixed(3));
        art.toggleAttribute("data-on", o > 0.5);
      });

      if (mist) {
        // Mist puffs up during each chapter change.
        let m = 0;
        for (const c of chapters.slice(1)) {
          const d = Math.abs(p - c.start) / (OVERLAP / 2);
          if (d < 1) m = Math.max(m, Math.sin((1 - d) * (Math.PI / 2)));
        }
        mist.style.opacity = (m * 0.35).toFixed(3);
      }

      // Clean meter.
      const c = chapters[current];
      const prev = current > 0 ? chapters[current - 1].meter : 0;
      const cp = clamp((p - c.start) / (c.end - c.start));
      const w = current === 0 ? 0 : smooth(0.1, 0.85, cp);
      const meterTarget = prev + (c.meter - prev) * w;
      meterShown += (meterTarget - meterShown) * 0.18;
      if (Math.abs(meterTarget - meterShown) < 0.2) meterShown = meterTarget;
      if (hudNum) hudNum.textContent = String(Math.round(meterShown));
      if (ringBar) ringBar.style.strokeDashoffset = String(RING * (1 - meterShown / 100));
      if (hudLabel && c.hud !== lastLabel) {
        hudLabel.textContent = c.hud;
        lastLabel = c.hud;
      }

      if (p > 0.97) trackOnce("story_complete");
      return Math.abs(meterTarget - meterShown) > 0.01;
    };

    const tick = () => {
      raf = 0;
      const lerp = desktop.matches && !snap ? 0.15 : 1;
      snap = false;
      cur = cur < 0 ? target : cur + (target - cur) * lerp;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      const meterMoving = render(cur);
      if (cur !== target || meterMoving) kick();
    };
    function kick() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const onScroll = () => {
      measure();
      kick();
    };
    const onResize = () => {
      for (const s of Object.values(seqs)) s.drawn = -1;
      onScroll();
    };

    measure();
    kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Start the first chapter's frames after the page has loaded.
    const startFrames = () => loadSeq(chapters[1].id);
    if (document.readyState === "complete") startFrames();
    else window.addEventListener("load", startFrames, { once: true });
    const onDesktop = () => {
      if (desktop.matches) startFrames();
      onResize();
    };
    desktop.addEventListener("change", onDesktop);

    // Keyboard users: focusing a chapter's link scrolls that chapter in.
    const onFocus = (e: FocusEvent) => {
      const art = (e.target as HTMLElement).closest<HTMLElement>("article[data-ch]");
      if (!art) return;
      const i = articles.indexOf(art);
      if (i < 0 || art.hasAttribute("data-on")) return;
      const c = chapters[i];
      const r = trackEl.getBoundingClientRect();
      const total = r.height - stage.clientHeight;
      const mid = c.start + (c.end - c.start) * (i === chapters.length - 1 ? 0.9 : 0.6);
      window.scrollTo({ top: window.scrollY + r.top + total * mid, behavior: "instant" });
      measure();
      snap = true;
      kick();
    };
    section.addEventListener("focusin", onFocus);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-cta]");
      if (!a) return;
      if (a.dataset.cta === "skip") track("skip_show");
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
    const io = new IntersectionObserver(([entry]) => {
      stageVisible = entry.isIntersecting;
    });
    io.observe(stage);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", startFrames);
      desktop.removeEventListener("change", onDesktop);
      section.removeEventListener("focusin", onFocus);
      section.removeEventListener("click", onClick);
      stage.removeEventListener("pointermove", onMove);
      io.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sprayRaf);
      queue.length = 0;
    };
  }, [chapters, frames]);

  return null;
}
