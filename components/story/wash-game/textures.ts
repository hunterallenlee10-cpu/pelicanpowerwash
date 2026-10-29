/**
 * Texture builders for the wash game. The clean slab is the Higgsfield
 * photo when it exists (procedural otherwise). Unless a real dirty photo
 * exists too, the grime is a procedural "grime map" multiplied over the
 * clean slab, so the concrete's own texture shows through the dirt. Stain
 * placement comes from data/game-stains.ts.
 */
import { SLAB, STAINS, type Stain } from "@/data/game-stains";

export const TW = 1280;
export const TH = 720;

/** Concrete area (the lawn strips sit above and below it). */
const SLAB_TOP = Math.round((SLAB.top / 100) * TH);
const SLAB_BOTTOM = Math.round((SLAB.bottom / 100) * TH);
const JOINT_X = Math.round((SLAB.jointX / 100) * TW);
const JOINT_Y = Math.round((SLAB.jointY / 100) * TH);

export function makeCanvas(w = TW, h = TH): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export function ctx2d(c: HTMLCanvasElement, readback = false): CanvasRenderingContext2D {
  return c.getContext("2d", readback ? { willReadFrequently: true } : undefined)!;
}

/** Small seeded PRNG so the slab looks the same on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  return img.decode().then(() => img);
}

export function drawCover(ctx: CanvasRenderingContext2D, img: CanvasImageSource & { width: number; height: number }) {
  const s = Math.max(TW / img.width, TH / img.height);
  const w = img.width * s;
  const h = img.height * s;
  ctx.drawImage(img, (TW - w) / 2, (TH - h) / 2, w, h);
}

export function proceduralClean(ctx: CanvasRenderingContext2D) {
  const r = rng(7);

  // Lawn strips
  ctx.fillStyle = "#4b7531";
  ctx.fillRect(0, 0, TW, TH);
  for (let i = 0; i < 9000; i++) {
    const x = r() * TW;
    const top = r() < 0.5;
    const y = top ? r() * SLAB_TOP : SLAB_BOTTOM + r() * (TH - SLAB_BOTTOM);
    const g = 90 + Math.floor(r() * 70);
    ctx.strokeStyle = `rgba(${40 + Math.floor(r() * 40)},${g},${30 + Math.floor(r() * 25)},0.8)`;
    ctx.lineWidth = 1 + r() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (r() - 0.5) * 6, y + (r() - 0.5) * 10);
    ctx.stroke();
  }

  // Slab with a broom finish (fine lines across the pour)
  ctx.fillStyle = "#c6c5bf";
  ctx.fillRect(0, SLAB_TOP, TW, SLAB_BOTTOM - SLAB_TOP);
  for (let y = SLAB_TOP; y < SLAB_BOTTOM; y += 1.6) {
    const dark = r() < 0.5;
    ctx.strokeStyle = dark ? `rgba(70,70,64,${0.03 + r() * 0.05})` : `rgba(255,255,250,${0.03 + r() * 0.05})`;
    ctx.lineWidth = 0.8 + r();
    ctx.beginPath();
    let yy = y;
    ctx.moveTo(0, yy);
    for (let x = 0; x <= TW; x += 80) {
      yy += (r() - 0.5) * 1.6;
      ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // Per-pixel grain and aggregate speckles on the slab
  const img = ctx.getImageData(0, SLAB_TOP, TW, SLAB_BOTTOM - SLAB_TOP);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    let n = (r() - 0.5) * 20;
    const sp = r();
    if (sp < 0.004) n -= 45;
    else if (sp > 0.997) n += 35;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n * 0.9;
  }
  ctx.putImageData(img, 0, SLAB_TOP);

  // Edge shadow where slab meets lawn
  for (const y of [SLAB_TOP, SLAB_BOTTOM]) {
    ctx.strokeStyle = "rgba(40,40,36,0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(TW, y);
    ctx.stroke();
  }

  // Control joints
  const joint = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = "rgba(62,62,58,0.85)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1 + 2.5, y1 + 2.5);
    ctx.lineTo(x2 + 2.5, y2 + 2.5);
    ctx.stroke();
  };
  joint(JOINT_X, SLAB_TOP, JOINT_X, SLAB_BOTTOM);
  joint(0, JOINT_Y, TW, JOINT_Y);
}

const px = (st: Stain) => ({ x: (st.x / 100) * TW, y: (st.y / 100) * TH, r: (st.r / 100) * TW });

/**
 * Grime map on a WHITE background, meant to be multiplied over the clean
 * slab: white leaves the concrete alone, darker/tinted pixels stain it.
 */
export function proceduralGrimeMap(ctx: CanvasRenderingContext2D) {
  const r = rng(42);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, TW, TH);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, SLAB_TOP - 2, TW, SLAB_BOTTOM - SLAB_TOP + 4);
  ctx.clip();

  const blob = (x: number, y: number, rad: number, color: string, sx = 1, sy = 1, rot = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(sx, sy);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
    g.addColorStop(0, color);
    g.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
    ctx.fillStyle = g;
    ctx.fillRect(-rad, -rad, rad * 2, rad * 2);
    ctx.restore();
  };

  // Overall mildew film: a gray-olive cast, uneven at several scales.
  ctx.fillStyle = "rgb(178,176,160)";
  ctx.fillRect(0, 0, TW, TH);
  for (let i = 0; i < 220; i++) {
    blob(r() * TW, SLAB_TOP + r() * (SLAB_BOTTOM - SLAB_TOP), 30 + r() * 170, `rgba(92,96,72,${(0.08 + r() * 0.2).toFixed(2)})`, 1, 0.6 + r() * 0.8, r() * Math.PI);
  }
  for (let i = 0; i < 90; i++) {
    blob(r() * TW, SLAB_TOP + r() * (SLAB_BOTTOM - SLAB_TOP), 40 + r() * 120, `rgba(236,234,224,${(0.1 + r() * 0.25).toFixed(2)})`);
  }
  // Darker where water sits: along both lawn edges.
  for (const [y0, y1] of [
    [SLAB_TOP, SLAB_TOP + 70],
    [SLAB_BOTTOM, SLAB_BOTTOM - 70],
  ]) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, "rgba(70,84,44,0.55)");
    g.addColorStop(1, "rgba(70,84,44,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, Math.min(y0, y1), TW, Math.abs(y1 - y0));
  }

  for (const st of STAINS) {
    const { x, y, r: rad } = px(st);
    if (st.id === "mildew") {
      // Black mildew: dense, blotchy, darkest in the middle.
      blob(x, y, rad * 1.2, "rgba(48,52,36,0.45)", 1.2, 0.8);
      for (let i = 0; i < 120; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * rad;
        blob(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, 10 + r() * rad * 0.4, `rgba(22,26,16,${(0.25 + r() * 0.35).toFixed(2)})`, 1, 0.7, r() * Math.PI);
      }
    } else if (st.id === "oil") {
      for (let i = 0; i < 9; i++) {
        blob(x + (r() - 0.5) * rad * 0.7, y + (r() - 0.5) * rad * 0.5, rad * (0.35 + r() * 0.45), "rgba(18,16,14,0.55)", 1.35, 0.85, r());
      }
      blob(x, y, rad * 1.5, "rgba(60,52,44,0.25)", 1.4, 0.9);
    } else if (st.id === "tracks") {
      // Two tire bands running the length of the slab.
      for (const off of [-0.55, 0.55]) {
        const cy = y + off * rad;
        const band = rad * 0.42;
        const g = ctx.createLinearGradient(0, cy - band, 0, cy + band);
        g.addColorStop(0, "rgba(30,30,28,0)");
        g.addColorStop(0.5, "rgba(30,30,28,0.5)");
        g.addColorStop(1, "rgba(30,30,28,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, cy - band, TW, band * 2);
        // Faint, uneven tread marks and darker patches where tires stop.
        for (let tx = 0; tx < TW; tx += 9 + r() * 10) {
          ctx.strokeStyle = `rgba(20,20,18,${(0.03 + r() * 0.07).toFixed(2)})`;
          ctx.lineWidth = 2 + r() * 2;
          ctx.beginPath();
          ctx.moveTo(tx, cy - band * (0.3 + r() * 0.3));
          ctx.lineTo(tx + 4 + r() * 3, cy + band * (0.3 + r() * 0.3));
          ctx.stroke();
        }
        for (let i = 0; i < 6; i++) {
          blob(r() * TW, cy + (r() - 0.5) * band, band * (0.8 + r()), "rgba(26,26,24,0.25)", 2.5, 0.6);
        }
      }
    } else if (st.id === "rust") {
      // A fan of orange-brown spray from a sprinkler at the slab's edge.
      ctx.filter = "blur(2px)";
      const ox = x + rad * 0.8;
      blob(ox - rad * 0.5, y, rad * 1.1, "rgba(184,96,36,0.35)", 1.1, 0.9);
      for (let i = 0; i < 140; i++) {
        const a = Math.PI + (r() - 0.5) * 1.6;
        const d = Math.pow(r(), 0.7) * rad * 1.5;
        blob(ox + Math.cos(a) * d, y + Math.sin(a) * d, 4 + r() * 14, `rgba(${140 + Math.floor(r() * 35)},${72 + Math.floor(r() * 25)},34,${(0.25 + r() * 0.35).toFixed(2)})`);
      }
      ctx.filter = "none";
    }
  }

  // Algae and weeds along the control joints and lawn edges.
  const weeds = STAINS.find((st) => st.id === "weeds");
  ctx.lineCap = "round";
  const algae = (x1: number, y1: number, x2: number, y2: number, w: number, a: number) => {
    ctx.strokeStyle = `rgba(66,104,34,${a})`;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      ctx.lineTo(x1 + (x2 - x1) * t + (r() - 0.5) * 5, y1 + (y2 - y1) * t + (r() - 0.5) * 5);
    }
    ctx.stroke();
  };
  ctx.filter = "blur(3px)";
  algae(JOINT_X, SLAB_TOP, JOINT_X, SLAB_BOTTOM, 11, 0.7);
  algae(0, JOINT_Y, TW, JOINT_Y, 11, 0.7);
  algae(0, SLAB_TOP + 5, TW, SLAB_TOP + 5, 18, 0.5);
  algae(0, SLAB_BOTTOM - 5, TW, SLAB_BOTTOM - 5, 18, 0.5);
  ctx.filter = "none";
  if (weeds) {
    // Weed tufts where the joints cross.
    ctx.filter = "blur(0.8px)";
    const { x, y, r: rad } = px(weeds);
    blob(x, y, rad * 0.9, "rgba(70,110,40,0.35)", 1, 1);
    for (let i = 0; i < 160; i++) {
      const alongX = r() < 0.5;
      const t = (r() - 0.5) * rad * 2.4;
      const bx = alongX ? x + t : JOINT_X + (r() - 0.5) * 8;
      const by = alongX ? JOINT_Y + (r() - 0.5) * 8 : y + t;
      ctx.strokeStyle = `rgba(${45 + Math.floor(r() * 25)},${78 + Math.floor(r() * 35)},${28 + Math.floor(r() * 15)},0.75)`;
      ctx.lineWidth = 2 + r() * 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + (r() - 0.5) * 26, by + (r() - 0.5) * 26);
      ctx.stroke();
    }
    ctx.filter = "none";
  }
  ctx.restore();

  // Fine grain so the stains don't read as smooth airbrush.
  const img = ctx.getImageData(0, SLAB_TOP, TW, SLAB_BOTTOM - SLAB_TOP);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = 0.88 + r() * 0.24;
    d[i] = Math.min(255, d[i] * n);
    d[i + 1] = Math.min(255, d[i + 1] * n);
    d[i + 2] = Math.min(255, d[i + 2] * n);
  }
  ctx.putImageData(img, 0, SLAB_TOP);
}

/** Clean slab with the grime map multiplied over it: the full dirty look. */
export function multiplyGrime(clean: HTMLCanvasElement, grime: CanvasImageSource, out: HTMLCanvasElement) {
  const o = ctx2d(out, true);
  o.globalCompositeOperation = "copy";
  o.drawImage(clean, 0, 0);
  o.globalCompositeOperation = "multiply";
  o.drawImage(grime, 0, 0, TW, TH);
  o.globalCompositeOperation = "source-over";
}

/**
 * Build a dirt layer from a full dirty photo: keep the dirty pixels, with
 * alpha proportional to how different they are from the clean slab, so areas
 * that were never dirty don't need washing.
 */
export function dirtFromDiff(clean: HTMLCanvasElement, dirtySrc: CanvasImageSource & { width: number; height: number }, out: HTMLCanvasElement) {
  const octx = ctx2d(out, true);
  octx.clearRect(0, 0, TW, TH);
  drawCover(octx, dirtySrc);
  const a = ctx2d(clean, true).getImageData(0, 0, TW, TH).data;
  const img = octx.getImageData(0, 0, TW, TH);
  const b = img.data;
  for (let i = 0; i < b.length; i += 4) {
    const diff = (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 3;
    // Near-opaque wherever it really differs, so the composite reproduces the
    // dirty photo instead of a faded copy of it.
    b[i + 3] = diff < 4 ? 0 : Math.min(255, (diff - 4) * 24);
  }
  octx.putImageData(img, 0, 0);
}
