/**
 * Canvas engine for the wash game. Plain TypeScript, no React.
 *
 * Layers (all 1280x720, drawn in this order): clean slab, dirt, etch scars,
 * soap foam. A stroke is drawn as one path into `mask`; the dirt layer is
 * rebuilt each frame as `base - mask * strength`, so overlapping a lane
 * within one stroke never compounds but a second pass does. On pointer-up
 * the result becomes the new base.
 */
import { STAINS, type StainId } from "@/data/game-stains";
import {
  TH,
  TW,
  ctx2d,
  dirtFromDiff,
  drawCover,
  loadImage,
  makeCanvas,
  multiplyGrime,
  proceduralClean,
  proceduralGrimeMap,
} from "./textures";
import { TOOLS, type Tool } from "./tools";

export type Textures = { clean: string | null; dirty: string | null; grime: string | null };

/** Visible part of the 1280x720 texture, in texture pixels. */
export type View = { vx: number; vy: number; vw: number; vh: number };

export type EngineCallbacks = {
  onStart: () => void;
  /** Per-stain share cleaned (0 to 1), sampled with the overall %. */
  onStains: (progress: Record<StainId, number>) => void;
  onView: (view: View) => void;
  /** Water on or off (for the spray sound). */
  onSpray: (active: boolean) => void;
  onDamage: (total: number) => void;
  onSample: (pct: number, seconds: number) => void;
  onComplete: (seconds: number, damage: number) => void;
  onDemoEnd: () => void;
};

type Pt = { x: number; y: number };

const FOAM_BOOST = 1.6;
const DONE_AT = 0.95;
const SAMPLE_W = 128;
const ETCH_EVERY = 260;

/** Peak mask alpha at the stroke center, from the band profile. */
function centerAlpha(tool: Tool) {
  return 1 - tool.bands.reduce((keep, [, a]) => keep * (1 - a), 1);
}

export class WashEngine {
  private dctx: CanvasRenderingContext2D;
  private clean = makeCanvas();
  private initial = makeCanvas();
  private base = makeCanvas();
  private live = makeCanvas();
  private etch = makeCanvas();
  private foam = makeCanvas();
  private mask = makeCanvas();
  private tmp = makeCanvas();
  private sampler = makeCanvas(SAMPLE_W, 72);
  /** Whole-texture sampler for per-stain progress. */
  private full = makeCanvas(SAMPLE_W, 72);
  private fullInit: Uint8ClampedArray | null = null;
  private spraying = false;

  private tool: Tool = TOOLS[0];
  private pts: Pt[] = [];
  private drawing = false;
  private strokeDirty = false;
  private foamUsed = false;
  private hover: Pt | null = null;
  private pointerType = "mouse";
  private strokeDist = 0;
  private strokeHit = false;

  private view = { k: 1, vx: 0, vy: 0, vw: TW, vh: TH };
  private initGrid: Uint8ClampedArray | null = null;
  private initSum = 1;

  private raf = 0;
  private visible = true;
  private pending = false;
  private timer = 0;
  private startedAt = 0;
  private started = false;
  private finished = false;
  private damage = 0;
  private demo: { lane: number; lanes: number; x: number; dir: 1 | -1; laneH: number } | null = null;
  private demoUsed = false;

  touchArmed = false;
  reduced = false;
  ready = false;

  private io: IntersectionObserver;
  private ro: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    private cb: EngineCallbacks
  ) {
    this.dctx = ctx2d(canvas);
    canvas.addEventListener("pointerdown", this.onDown);
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerup", this.onUp);
    canvas.addEventListener("pointercancel", this.onUp);
    canvas.addEventListener("pointerleave", this.onLeave);
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible && this.pending) this.request();
    });
    this.io.observe(canvas);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
  }

  async load(t: Textures) {
    const get = (u: string | null) => (u ? loadImage(u).catch(() => null) : Promise.resolve(null));
    const [ci, di, gi] = await Promise.all([get(t.clean), get(t.dirty), get(t.grime)]);
    const cctx = ctx2d(this.clean, true);
    if (ci) drawCover(cctx, ci);
    else proceduralClean(cctx);

    if (ci && di) {
      dirtFromDiff(this.clean, di, this.initial);
    } else {
      // Grime map (the Higgsfield one, or ours) multiplied over the clean
      // slab, so the concrete's texture shows through the dirt.
      const grime = makeCanvas();
      const gctx = ctx2d(grime, true);
      if (gi) {
        gctx.fillStyle = "#fff";
        gctx.fillRect(0, 0, TW, TH);
        drawCover(gctx, gi);
      } else {
        proceduralGrimeMap(gctx);
      }
      const dirty = makeCanvas();
      multiplyGrime(this.clean, grime, dirty);
      dirtFromDiff(this.clean, dirty, this.initial);
    }
    this.copy(this.initial, this.base);
    this.fullInit = this.fullGrid(this.initial);
    this.ready = true;
    this.resize();
  }

  setTool(tool: Tool) {
    if (this.drawing) this.commit();
    this.tool = tool;
    this.request();
  }

  /** Back to a fully dirty slab. */
  reset() {
    this.demo = null;
    this.drawing = false;
    this.pts = [];
    this.copy(this.initial, this.base);
    for (const c of [this.etch, this.foam, this.mask]) ctx2d(c).clearRect(0, 0, TW, TH);
    this.foamUsed = false;
    this.started = false;
    this.finished = false;
    this.damage = 0;
    this.demoUsed = false;
    window.clearInterval(this.timer);
    this.timer = 0;
    this.measureStains();
    this.request();
  }

  get usedDemo() {
    return this.demoUsed;
  }

  /** Surface cleaner in overlapping lanes across the visible slab. */
  startDemo() {
    if (!this.ready || this.finished) return;
    if (this.drawing) this.commit();
    this.tool = TOOLS[0];
    const laneH = this.tool.width * 0.8;
    this.demo = {
      lane: 0,
      lanes: Math.ceil(this.view.vh / laneH),
      x: this.view.vx - 20,
      dir: 1,
      laneH,
    };
    this.demoUsed = true;
    this.begin();
    this.request();
  }

  stopDemo() {
    if (!this.demo) return;
    this.demo = null;
    if (this.drawing) this.commit();
    this.cb.onDemoEnd();
    this.request();
  }

  destroy() {
    if (this.spraying) this.cb.onSpray(false);
    cancelAnimationFrame(this.raf);
    window.clearInterval(this.timer);
    this.io.disconnect();
    this.ro.disconnect();
    const c = this.canvas;
    c.removeEventListener("pointerdown", this.onDown);
    c.removeEventListener("pointermove", this.onMove);
    c.removeEventListener("pointerup", this.onUp);
    c.removeEventListener("pointercancel", this.onUp);
    c.removeEventListener("pointerleave", this.onLeave);
  }

  // ---------------------------------------------------------------- input

  private toTex(e: PointerEvent): Pt {
    const r = this.canvas.getBoundingClientRect();
    const { vx, vy, vw, vh } = this.view;
    return {
      x: vx + ((e.clientX - r.left) / r.width) * vw,
      y: vy + ((e.clientY - r.top) / r.height) * vh,
    };
  }

  private canDraw(e: PointerEvent) {
    if (!this.ready || this.finished || this.demo) return false;
    return e.pointerType !== "touch" || this.touchArmed;
  }

  private onDown = (e: PointerEvent) => {
    this.pointerType = e.pointerType;
    if (!this.canDraw(e)) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const p = this.toTex(e);
    this.hover = p;
    this.begin();
    this.pts = [p];
    if (this.tool.soap) this.stampFoam(p, p);
    if (this.tool.etch) this.etchSegment(p, p);
    this.strokeDirty = true;
    this.request();
  };

  private onMove = (e: PointerEvent) => {
    this.pointerType = e.pointerType;
    const p = this.toTex(e);
    this.hover = p;
    if (this.drawing && !this.demo) this.extend(p);
    this.request();
  };

  private onUp = () => {
    if (this.drawing && !this.demo) {
      this.commit();
      this.measure();
    }
    this.request();
  };

  private onLeave = () => {
    if (!this.drawing) this.hover = null;
    this.request();
  };

  private begin() {
    if (!this.started) {
      this.started = true;
      this.startedAt = performance.now();
      if (!this.demo) this.cb.onStart();
      this.timer = window.setInterval(() => this.measure(), 250);
    }
    this.drawing = true;
    this.strokeDist = 0;
    this.strokeHit = false;
  }

  private extend(p: Pt) {
    const last = this.pts[this.pts.length - 1];
    if (last && Math.hypot(p.x - last.x, p.y - last.y) < 1.5) return;
    this.pts.push(p);
    if (this.tool.soap && last) this.stampFoam(last, p);
    if (this.tool.etch && last) this.etchSegment(last, p);
    this.strokeDirty = true;
    // Very long strokes are split so the per-frame path stays short.
    if (this.pts.length > 600) {
      this.commit();
      this.drawing = true;
      this.pts = [p];
    }
  }

  // ---------------------------------------------------------------- strokes

  private stampFoam(a: Pt, b: Pt) {
    const f = ctx2d(this.foam);
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.ceil(dist / 18));
    const rad = this.tool.width / 2;
    for (let i = 0; i <= steps; i++) {
      const x = a.x + ((b.x - a.x) * i) / steps;
      const y = a.y + ((b.y - a.y) * i) / steps;
      const g = f.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, "rgba(255,255,255,0.22)");
      g.addColorStop(0.7, "rgba(245,250,255,0.14)");
      g.addColorStop(1, "rgba(245,250,255,0)");
      f.fillStyle = g;
      f.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      f.strokeStyle = "rgba(255,255,255,0.55)";
      f.lineWidth = 1.2;
      for (let j = 0; j < 3; j++) {
        const bx = x + (Math.random() - 0.5) * rad * 1.5;
        const by = y + (Math.random() - 0.5) * rad * 1.5;
        f.beginPath();
        f.arc(bx, by, 2 + Math.random() * 5, 0, Math.PI * 2);
        f.stroke();
      }
    }
    this.foamUsed = true;
  }

  private etchSegment(a: Pt, b: Pt) {
    const e = ctx2d(this.etch);
    e.lineCap = "round";
    e.strokeStyle = "rgba(238,234,222,0.6)";
    e.lineWidth = 7;
    e.beginPath();
    e.moveTo(a.x, a.y);
    e.lineTo(b.x + 0.1, b.y);
    e.stroke();
    e.strokeStyle = "rgba(255,255,250,0.5)";
    e.lineWidth = 2;
    e.beginPath();
    e.moveTo(a.x + (Math.random() - 0.5) * 2, a.y + (Math.random() - 0.5) * 2);
    e.lineTo(b.x + 0.1, b.y);
    e.stroke();

    const d = Math.hypot(b.x - a.x, b.y - a.y);
    const before = this.strokeDist;
    this.strokeDist += d;
    if (!this.strokeHit || Math.floor(this.strokeDist / ETCH_EVERY) > Math.floor(before / ETCH_EVERY)) {
      this.strokeHit = true;
      this.damage++;
      this.cb.onDamage(this.damage);
    }
  }

  private buildMask() {
    const m = ctx2d(this.mask);
    m.clearRect(0, 0, TW, TH);
    if (!this.pts.length) return;
    m.lineCap = "round";
    m.lineJoin = "round";
    m.strokeStyle = "#000";
    const [p0] = this.pts;
    for (const [frac, alpha] of this.tool.bands) {
      m.globalAlpha = alpha;
      m.lineWidth = this.tool.width * frac;
      // One path per band: overlap inside a stroke is covered once.
      m.beginPath();
      m.moveTo(p0.x, p0.y);
      if (this.pts.length === 1) m.lineTo(p0.x + 0.1, p0.y);
      for (let i = 1; i < this.pts.length; i++) m.lineTo(this.pts[i].x, this.pts[i].y);
      m.stroke();
    }
    m.globalAlpha = 1;
  }

  private recomputeLive() {
    const l = ctx2d(this.live);
    l.globalCompositeOperation = "copy";
    l.globalAlpha = 1;
    l.drawImage(this.base, 0, 0);
    const s = Math.min(1, this.tool.strength / centerAlpha(this.tool));
    l.globalCompositeOperation = "destination-out";
    l.globalAlpha = s;
    l.drawImage(this.mask, 0, 0);
    if (this.foamUsed && s < 1) {
      // Second pass only where there's foam, sized so foamed grime comes
      // off 1.6x faster at the stroke center.
      const t = ctx2d(this.tmp);
      t.globalCompositeOperation = "copy";
      t.drawImage(this.mask, 0, 0);
      t.globalCompositeOperation = "destination-in";
      t.drawImage(this.foam, 0, 0);
      l.globalAlpha = Math.min(1, ((FOAM_BOOST - 1) * s) / (1 - s));
      l.drawImage(this.tmp, 0, 0);
    }
    l.globalAlpha = 1;
    l.globalCompositeOperation = "source-over";
  }

  private commit() {
    if (!this.tool.soap && this.pts.length) {
      if (this.strokeDirty) {
        this.buildMask();
        this.recomputeLive();
      }
      [this.base, this.live] = [this.live, this.base];
      if (this.foamUsed) {
        // Water rinses the soap off.
        const f = ctx2d(this.foam);
        f.globalCompositeOperation = "destination-out";
        f.globalAlpha = 0.4 + 0.5 * this.tool.strength;
        f.drawImage(this.mask, 0, 0);
        f.globalAlpha = 1;
        f.globalCompositeOperation = "source-over";
      }
      ctx2d(this.mask).clearRect(0, 0, TW, TH);
    }
    this.pts = [];
    this.drawing = false;
    this.strokeDirty = false;
  }

  private copy(from: HTMLCanvasElement, to: HTMLCanvasElement) {
    const c = ctx2d(to);
    c.globalCompositeOperation = "copy";
    c.drawImage(from, 0, 0);
    c.globalCompositeOperation = "source-over";
  }

  // ---------------------------------------------------------------- measure

  private grid(src: HTMLCanvasElement): Uint8ClampedArray {
    const s = ctx2d(this.sampler, true);
    s.clearRect(0, 0, this.sampler.width, this.sampler.height);
    s.imageSmoothingEnabled = true;
    s.imageSmoothingQuality = "high";
    const { vx, vy, vw, vh } = this.view;
    s.drawImage(src, vx, vy, vw, vh, 0, 0, this.sampler.width, this.sampler.height);
    return s.getImageData(0, 0, this.sampler.width, this.sampler.height).data;
  }

  private measure() {
    if (!this.ready || !this.started || this.finished || !this.initGrid) return;
    const cur = this.grid(this.drawing ? this.live : this.base);
    const init = this.initGrid;
    let sum = 0;
    for (let i = 3; i < cur.length; i += 4) if (init[i] > 8) sum += Math.min(cur[i], init[i]);
    const pct = Math.max(0, Math.min(1, 1 - sum / this.initSum));
    const secs = (performance.now() - this.startedAt) / 1000;
    this.cb.onSample(pct, secs);
    this.measureStains();
    if (pct >= DONE_AT && !this.drawing) {
      this.finished = true;
      this.demo = null;
      this.hover = null;
      window.clearInterval(this.timer);
      this.timer = 0;
      this.cb.onComplete(secs, this.damage);
      this.request();
    }
  }

  private fullGrid(src: HTMLCanvasElement): Uint8ClampedArray {
    const s = ctx2d(this.full, true);
    s.clearRect(0, 0, this.full.width, this.full.height);
    s.imageSmoothingEnabled = true;
    s.imageSmoothingQuality = "high";
    s.drawImage(src, 0, 0, TW, TH, 0, 0, this.full.width, this.full.height);
    return s.getImageData(0, 0, this.full.width, this.full.height).data;
  }

  private measureStains() {
    if (!this.fullInit) return;
    const cur = this.fullGrid(this.drawing ? this.live : this.base);
    const W = this.full.width;
    const H = this.full.height;
    const out = {} as Record<StainId, number>;
    for (const st of STAINS) {
      const cx = (st.x / 100) * W;
      const cy = (st.y / 100) * H;
      const rad = (st.r / 100) * W;
      let a = 0;
      let b = 0;
      for (let y = Math.max(0, Math.floor(cy - rad)); y < Math.min(H, Math.ceil(cy + rad)); y++) {
        for (let x = Math.max(0, Math.floor(cx - rad)); x < Math.min(W, Math.ceil(cx + rad)); x++) {
          if ((x - cx) ** 2 + (y - cy) ** 2 > rad * rad) continue;
          const i = (y * W + x) * 4 + 3;
          a += this.fullInit[i];
          b += Math.min(cur[i], this.fullInit[i]);
        }
      }
      out[st.id] = a > 0 ? 1 - b / a : 1;
    }
    this.cb.onStains(out);
  }

  // ---------------------------------------------------------------- render

  private resize() {
    const cssW = this.canvas.clientWidth;
    const cssH = this.canvas.clientHeight;
    if (!cssW || !cssH) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    // Cover-fit: on narrow screens the slab is cropped at the sides.
    const scale = Math.max(cssW / TW, cssH / TH);
    const vw = cssW / scale;
    const vh = cssH / scale;
    this.view = { k: scale * dpr, vx: (TW - vw) / 2, vy: (TH - vh) / 2, vw, vh };
    this.cb.onView({ vx: this.view.vx, vy: this.view.vy, vw, vh });
    if (this.ready) {
      this.sampler.height = Math.max(1, Math.round((SAMPLE_W * vh) / vw));
      this.initGrid = this.grid(this.initial);
      let sum = 0;
      for (let i = 3; i < this.initGrid.length; i += 4) if (this.initGrid[i] > 8) sum += this.initGrid[i];
      this.initSum = Math.max(1, sum);
    }
    this.request(true);
  }

  private request(force = false) {
    if (!this.visible && !force) {
      this.pending = true;
      return;
    }
    this.pending = false;
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  private frame = () => {
    this.raf = 0;
    if (this.demo) this.stepDemo();
    if (this.strokeDirty && this.drawing && !this.tool.soap) {
      this.buildMask();
      this.recomputeLive();
      this.strokeDirty = false;
    }
    this.draw();
    const spraying = !this.finished && !this.tool.soap && (this.drawing || !!this.demo);
    if (spraying !== this.spraying) {
      this.spraying = spraying;
      this.cb.onSpray(spraying);
    }
    if (this.demo) this.request();
  };

  private stepDemo() {
    const d = this.demo!;
    const { vx, vy, vw } = this.view;
    const step = this.reduced ? 340 : 24;
    const y = vy + d.laneH * (d.lane + 0.5);
    d.x += step * d.dir;
    const end = d.dir === 1 ? vx + vw + 20 : vx - 20;
    const past = d.dir === 1 ? d.x >= end : d.x <= end;
    const p = { x: past ? end : d.x, y };
    this.hover = p;
    if (!this.pts.length) {
      this.pts = [{ x: d.dir === 1 ? vx - 20 : vx + vw + 20, y }];
      this.drawing = true;
    }
    this.pts.push(p);
    this.strokeDirty = true;
    if (past) {
      this.commit();
      d.lane++;
      d.dir = d.dir === 1 ? -1 : 1;
      d.x = d.dir === 1 ? vx - 20 : vx + vw + 20;
      if (d.lane >= d.lanes) {
        this.demo = null;
        this.hover = null;
        this.measure();
        this.cb.onDemoEnd();
      }
    }
  }

  private draw() {
    const d = this.dctx;
    d.setTransform(1, 0, 0, 1, 0, 0);
    d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.ready) return;
    const { k, vx, vy } = this.view;
    d.setTransform(k, 0, 0, k, -vx * k, -vy * k);
    d.drawImage(this.clean, 0, 0);
    d.drawImage(this.drawing && !this.tool.soap ? this.live : this.base, 0, 0);
    d.drawImage(this.etch, 0, 0);
    if (this.foamUsed) {
      d.globalAlpha = 0.9;
      d.drawImage(this.foam, 0, 0);
      d.globalAlpha = 1;
    }

    const h = this.hover;
    if (!h || this.finished) return;
    const showCursor = this.demo || this.drawing || this.pointerType === "mouse" || this.pointerType === "pen";
    if (!showCursor) return;
    const rad = this.tool.width / 2;
    if (this.tool.id === "surface") {
      // The surface cleaner: a round steel hood with a hub.
      const g = d.createRadialGradient(h.x - rad * 0.3, h.y - rad * 0.35, rad * 0.1, h.x, h.y, rad);
      g.addColorStop(0, "rgba(250,252,253,0.95)");
      g.addColorStop(0.55, "rgba(196,204,211,0.92)");
      g.addColorStop(1, "rgba(120,130,140,0.92)");
      d.fillStyle = g;
      d.beginPath();
      d.arc(h.x, h.y, rad * 0.92, 0, Math.PI * 2);
      d.fill();
      d.lineWidth = 3 / k;
      d.strokeStyle = "rgba(40,46,52,0.7)";
      d.stroke();
      d.fillStyle = "rgba(60,66,72,0.9)";
      d.beginPath();
      d.arc(h.x, h.y, rad * 0.16, 0, Math.PI * 2);
      d.fill();
      // Handle running off toward the operator.
      d.strokeStyle = "rgba(30,34,38,0.85)";
      d.lineWidth = 6 / k + 2;
      d.beginPath();
      d.moveTo(h.x, h.y);
      d.lineTo(h.x - rad * 0.2, h.y + rad * 2.2);
      d.stroke();
    } else {
      d.lineWidth = 3 / k;
      d.strokeStyle = "rgba(11,29,51,0.55)";
      d.beginPath();
      d.arc(h.x, h.y, Math.max(rad, 6), 0, Math.PI * 2);
      d.stroke();
      d.lineWidth = 1.5 / k;
      d.strokeStyle = "#ffffff";
      d.stroke();
      d.fillStyle = this.tool.color;
      d.beginPath();
      d.arc(h.x, h.y, 4 / k + 2, 0, Math.PI * 2);
      d.fill();
    }
    // A little spray while the trigger is held
    if (this.drawing && !this.reduced && !this.tool.soap) {
      d.fillStyle = "rgba(235,248,255,0.75)";
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * rad * 1.1;
        d.fillRect(h.x + Math.cos(a) * r, h.y + Math.sin(a) * r, 2.5 / k + 1, 2.5 / k + 1);
      }
    }
  }
}
