/**
 * Texture builders for the wash game. When the Higgsfield textures are still
 * placeholders, the slab is drawn procedurally so the game works today.
 */
export const TW = 1280;
export const TH = 720;

/** Concrete area (the lawn strips sit above and below it). */
const SLAB_TOP = 70;
const SLAB_BOTTOM = 650;
const JOINT_X = 640;
const JOINT_Y = 360;

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

/** Grime on a transparent layer, only over the slab. */
export function proceduralDirt(ctx: CanvasRenderingContext2D) {
  const r = rng(42);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, SLAB_TOP - 4, TW, SLAB_BOTTOM - SLAB_TOP + 8);
  ctx.clip();

  // Mildew film over the whole slab
  ctx.fillStyle = "rgba(62,64,48,0.55)";
  ctx.fillRect(0, 0, TW, TH);

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

  // Mottled darker patches
  for (let i = 0; i < 150; i++) {
    blob(r() * TW, SLAB_TOP + r() * (SLAB_BOTTOM - SLAB_TOP), 40 + r() * 150, `rgba(38,42,30,${(0.12 + r() * 0.25).toFixed(2)})`);
  }

  // Two tire-track bands running the length of the slab
  for (const cy of [235, 480]) {
    const g = ctx.createLinearGradient(0, cy - 55, 0, cy + 55);
    g.addColorStop(0, "rgba(24,24,22,0)");
    g.addColorStop(0.5, "rgba(24,24,22,0.5)");
    g.addColorStop(1, "rgba(24,24,22,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, cy - 55, TW, 110);
    ctx.strokeStyle = "rgba(15,15,14,0.18)";
    ctx.lineWidth = 3;
    for (let x = 0; x < TW; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, cy - 26);
      ctx.lineTo(x + 6, cy + 26);
      ctx.stroke();
    }
  }

  // Leaf-tannin stains in three clusters
  for (const [cx, cy] of [
    [220, 140],
    [760, 600],
    [1130, 160],
  ]) {
    for (let i = 0; i < 22; i++) {
      blob(
        cx + (r() - 0.5) * 260,
        cy + (r() - 0.5) * 120,
        10 + r() * 16,
        `rgba(132,72,26,${(0.35 + r() * 0.3).toFixed(2)})`,
        1,
        0.45,
        r() * Math.PI
      );
    }
  }

  // Oil spot near the garage end
  for (let i = 0; i < 7; i++) {
    blob(1020 + (r() - 0.5) * 50, 420 + (r() - 0.5) * 40, 35 + r() * 30, "rgba(16,14,12,0.6)", 1.3, 0.85, r());
  }

  // Algae in the joints and along the lawn edges
  ctx.shadowColor = "rgba(70,115,35,0.9)";
  ctx.shadowBlur = 14;
  ctx.strokeStyle = "rgba(74,114,38,0.8)";
  ctx.lineCap = "round";
  const algae = (x1: number, y1: number, x2: number, y2: number, w: number) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const steps = 24;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      ctx.lineTo(x1 + (x2 - x1) * t + (r() - 0.5) * 6, y1 + (y2 - y1) * t + (r() - 0.5) * 6);
    }
    ctx.stroke();
  };
  algae(JOINT_X, SLAB_TOP, JOINT_X, SLAB_BOTTOM, 12);
  algae(0, JOINT_Y, TW, JOINT_Y, 12);
  algae(0, SLAB_TOP + 4, TW, SLAB_TOP + 4, 22);
  algae(0, SLAB_BOTTOM - 4, TW, SLAB_BOTTOM - 4, 22);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Break up the film so it reads as grime, not a flat tint
  const img = ctx.getImageData(0, 0, TW, TH);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) {
    if (!d[i]) continue;
    d[i] = Math.min(255, d[i] * (0.82 + r() * 0.36));
  }
  ctx.putImageData(img, 0, 0);
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
    b[i + 3] = diff < 6 ? 0 : Math.min(255, diff * 4);
  }
  octx.putImageData(img, 0, 0);
}
