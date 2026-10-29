#!/usr/bin/env node
/**
 * Asset pipeline for the scroll story, price builder, gauge and game.
 *
 *   npm run assets
 *
 * Reads raw downloads from `assets-inbox/` (any of jpg, jpeg, png, webp, avif,
 * mp4, mov) and writes web-ready files to `public/story/`, plus
 * `data/story-manifest.json`, which the components read.
 *
 * - Images become AVIF + WebP at the widths in SPECS, metadata stripped.
 * - Each v*.mp4 becomes a numbered WebP frame sequence for the desktop scroll
 *   scrub, plus a high-quality poster. The total frame payload is kept under
 *   FRAME_BUDGET by stepping down fps / quality.
 * - A missing required file never blocks: a labelled placeholder is written
 *   and flagged `placeholder: true` in the manifest.
 * - Idempotent: unchanged inputs are skipped (see scripts/.assets-cache.json),
 *   so re-running after dropping in new files only rebuilds what changed.
 *
 * Env overrides (used for testing): ASSETS_INBOX, ASSETS_OUT, ASSETS_MANIFEST,
 * ASSETS_CACHE, ASSETS_FORCE=1, ASSETS_ONLY=video (skip images).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const INBOX = path.resolve(ROOT, process.env.ASSETS_INBOX || "assets-inbox");
const OUT = path.resolve(ROOT, process.env.ASSETS_OUT || "public/story");
const MANIFEST = path.resolve(ROOT, process.env.ASSETS_MANIFEST || "data/story-manifest.json");
const CACHE = path.resolve(ROOT, process.env.ASSETS_CACHE || "scripts/.assets-cache.json");
const FORCE = process.env.ASSETS_FORCE === "1";
const ONLY_VIDEO = process.env.ASSETS_ONLY === "video";
/** Public URL prefix that maps to OUT. */
const URL_BASE = "/" + path.relative(path.join(ROOT, "public"), OUT).split(path.sep).join("/");

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const VIDEO_EXTS = [".mp4", ".mov", ".webm"];
const FRAME_BUDGET = 12 * 1024 * 1024;
const FRAME_WIDTH = 1280;
/** Tried in order until the frames fit FRAME_BUDGET. */
const FRAME_SETTINGS = [
  { fps: 12, quality: 65 },
  { fps: 10, quality: 65 },
  { fps: 10, quality: 60 },
  { fps: 8, quality: 58 },
  { fps: 6, quality: 55 },
];

/** Output widths and placeholder size per kind of image. */
const KINDS = {
  key16: { widths: [1920, 1280], w: 1920, h: 1080 },
  key9: { widths: [1080, 720], w: 1080, h: 1920 },
  game: { widths: [1600, 960], w: 1600, h: 900 },
  tile: { widths: [800], w: 800, h: 800 },
  illus: { widths: [1600, 960], w: 1600, h: 1200 },
  og: { widths: [1920, 1280], w: 1920, h: 1080, jpeg: 1200 },
  mist: { widths: [1920, 1280], w: 1920, h: 1080 },
};

/**
 * tone drives the placeholder colours: dirty = murky olive, clean = bay
 * navy/teal, mid = halfway, so the wipe effects still read before real
 * renders land. `optional` files get no placeholder.
 */
const SPECS = [
  ["k0-final-clean-16x9", "key16", "clean"],
  ["k4-final-dirty-16x9", "key16", "dirty"],
  ["k1-driveway-clean-16x9", "key16", "clean"],
  ["k1-driveway-dirty-16x9", "key16", "dirty"],
  ["k1-driveway-mid-16x9", "key16", "mid", { optional: true }],
  ["k2-roof-clean-16x9", "key16", "clean"],
  ["k2-roof-dirty-16x9", "key16", "dirty"],
  ["k2-roof-mid-16x9", "key16", "mid", { optional: true }],
  ["k3-siding-clean-16x9", "key16", "clean"],
  ["k3-siding-dirty-16x9", "key16", "dirty"],
  ["k3-siding-mid-16x9", "key16", "mid", { optional: true }],
  ["k0-final-clean-9x16", "key9", "clean"],
  ["k4-final-dirty-9x16", "key9", "dirty"],
  ["k1-driveway-clean-9x16", "key9", "clean"],
  ["k1-driveway-dirty-9x16", "key9", "dirty"],
  ["k2-roof-clean-9x16", "key9", "clean"],
  ["k2-roof-dirty-9x16", "key9", "dirty"],
  ["k3-siding-clean-9x16", "key9", "clean"],
  ["k3-siding-dirty-9x16", "key9", "dirty"],
  ["g1-driveway-topdown-clean", "game", "clean"],
  ["g2-driveway-topdown-dirty", "game", "dirty", { optional: true }],
  ["g3-grime-map", "game", "neutral", { optional: true }],
  ["t-siding", "tile", "neutral", { optional: true }],
  ["t-roof", "tile", "neutral", { optional: true }],
  ["t-concrete", "tile", "neutral", { optional: true }],
  ["t-deck", "tile", "neutral", { optional: true }],
  ["t-pavers", "tile", "neutral", { optional: true }],
  ["t-brick", "tile", "neutral", { optional: true }],
  ["t-fence", "tile", "neutral", { optional: true }],
  ["t-stucco", "tile", "neutral", { optional: true }],
  ["h1-house-iso", "illus", "neutral", { optional: true }],
  ["h1-house-iso-dirty", "illus", "dirty", { optional: true }],
  ["e1-og-bg", "og", "clean"],
  ["e2-mist", "mist", "black", { optional: true }],
].map(([key, kind, tone, opts = {}]) => ({ key, kind, tone, ...opts }));

const VIDEOS = [
  { key: "v1-driveway-16x9", chapter: "driveway" },
  { key: "v2-roof-16x9", chapter: "roof" },
  { key: "v3-siding-16x9", chapter: "siding" },
  { key: "v4-final-16x9", chapter: "final" },
];

const TONES = {
  dirty: ["#4a5236", "#1e2517", "#c9d1a8"],
  clean: ["#0e4a5a", "#0b1d33", "#bfeff5"],
  mid: ["#2c4c47", "#132226", "#cfe3da"],
  neutral: ["#1a3556", "#0a1626", "#cfe0f0"],
  black: ["#000000", "#000000", "#000000"],
};

// ---------------------------------------------------------------------------

const log = (...args) => console.log("[assets]", ...args);
const rel = (p) => path.relative(ROOT, p);

async function findInput(key, exts) {
  if (!existsSync(INBOX)) return null;
  const names = await fs.readdir(INBOX);
  for (const ext of exts) {
    const hit = names.find((n) => n.toLowerCase() === `${key}${ext}`);
    if (hit) return path.join(INBOX, hit);
  }
  return null;
}

async function signature(file) {
  const st = await fs.stat(file);
  return `${path.basename(file)}:${st.size}:${Math.round(st.mtimeMs)}`;
}

function placeholderSvg({ w, h, tone, label }) {
  const [a, b, ink] = TONES[tone] || TONES.neutral;
  if (tone === "black") {
    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#000"/></svg>`);
  }
  const fs1 = Math.round(Math.min(w, h) * 0.035);
  const fs2 = Math.round(fs1 * 0.62);
  const stripes = tone === "dirty" ? 0.1 : 0.06;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width="24" height="48" fill="#fff" fill-opacity="${stripes}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#p)"/>
  <g font-family="Inter, DejaVu Sans, sans-serif" fill="${ink}" text-anchor="end">
    <text x="${w - fs1}" y="${h - fs1 * 2.2}" font-size="${fs2}" font-weight="700" letter-spacing="3" fill-opacity="0.7">PLACEHOLDER · ${tone.toUpperCase()}</text>
    <text x="${w - fs1}" y="${h - fs1}" font-size="${fs1}" font-weight="600">${label}</text>
  </g>
</svg>`);
}

async function writeVariants(input, spec, outDir) {
  const kind = KINDS[spec.kind];
  const sources = [];
  let width = 0;
  let height = 0;
  for (const w of kind.widths) {
    const base = sharp(input, { failOn: "none" }).rotate().resize({ width: w, withoutEnlargement: true });
    const avifPath = path.join(outDir, `${spec.key}-${w}.avif`);
    const webpPath = path.join(outDir, `${spec.key}-${w}.webp`);
    const info = await base.clone().webp({ quality: 74, effort: 5 }).toFile(webpPath);
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(avifPath);
    if (!width) {
      width = info.width;
      height = info.height;
    }
    sources.push({
      w: info.width,
      avif: `${URL_BASE}/img/${path.basename(avifPath)}`,
      webp: `${URL_BASE}/img/${path.basename(webpPath)}`,
    });
  }
  let jpeg;
  if (kind.jpeg) {
    // Satori (the OG image renderer) can't read WebP/AVIF, so the OG
    // background also ships as a JPEG.
    const jpegPath = path.join(outDir, `${spec.key}-${kind.jpeg}.jpg`);
    await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: kind.jpeg, height: Math.round((kind.jpeg * 630) / 1200), fit: "cover", position: "right" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(jpegPath);
    jpeg = `${URL_BASE}/img/${path.basename(jpegPath)}`;
  }
  return { width, height, sources, src: sources[0].webp, ...(jpeg ? { jpeg } : {}) };
}

// ---------------------------------------------------------------------------

function findFfmpeg() {
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.status === 0) return "ffmpeg";
  try {
    // Optional fallback: `pnpm add -D ffmpeg-static`.
    const mod = execFileSync(process.execPath, ["-e", "process.stdout.write(require('ffmpeg-static')||'')"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    if (mod) return mod;
  } catch {}
  return null;
}

async function dirBytes(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const name of await fs.readdir(dir)) total += (await fs.stat(path.join(dir, name))).size;
  return total;
}

/** Extract raw PNG frames for one clip at a given fps into a temp dir. */
function extractFrames(ffmpeg, input, fps, tmpDir) {
  const res = spawnSync(
    ffmpeg,
    ["-loglevel", "error", "-y", "-i", input, "-vf", `fps=${fps},scale=${FRAME_WIDTH}:-2:flags=lanczos`, path.join(tmpDir, "%04d.png")],
    { stdio: "inherit" }
  );
  if (res.status !== 0) throw new Error(`ffmpeg failed on ${input}`);
}

async function encodeFrames(tmpDir, outDir, quality) {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  const pngs = (await fs.readdir(tmpDir)).filter((n) => n.endsWith(".png")).sort();
  let w = 0;
  let h = 0;
  for (const name of pngs) {
    const info = await sharp(path.join(tmpDir, name))
      .webp({ quality, effort: 4 })
      .toFile(path.join(outDir, name.replace(/\.png$/, ".webp")));
    w = info.width;
    h = info.height;
  }
  return { count: pngs.length, width: w, height: h, bytes: await dirBytes(outDir) };
}

async function processVideos(cache, manifest) {
  const ffmpeg = findFfmpeg();
  const found = [];
  for (const v of VIDEOS) {
    const input = await findInput(v.key, VIDEO_EXTS);
    if (input) found.push({ ...v, input, sig: await signature(input) });
    else manifest.missing.push(`${v.key}.mp4`);
  }
  for (const v of VIDEOS) {
    manifest.frames[v.chapter] = { count: 0, fps: 0, width: 0, height: 0, bytes: 0, base: "", poster: null };
  }
  if (!found.length) {
    // Raw clips are large and kept out of git. If frames were extracted
    // before, keep them rather than falling back to the still wipe.
    const kept = cache.videos?.result;
    if (kept && Object.values(kept.frames).every((f) => existsSync(path.join(OUT, "frames", f.base.split("/").filter(Boolean).pop())))) {
      Object.assign(manifest.frames, kept.frames);
      manifest.budget = kept.budget;
      manifest.missing = manifest.missing.filter((m) => !m.endsWith(".mp4"));
      log("no clips in inbox; keeping the frames extracted earlier");
      return;
    }
    await fs.rm(path.join(OUT, "frames"), { recursive: true, force: true });
    await fs.rm(path.join(OUT, "posters"), { recursive: true, force: true });
    log("no videos in inbox; desktop story uses the still-image wipe");
    return;
  }
  if (!ffmpeg) {
    log("WARNING: ffmpeg not found (install it or `pnpm add -D ffmpeg-static`); skipping video frames");
    for (const v of found) manifest.missing.push(`${v.key}.mp4 (ffmpeg missing)`);
    return;
  }

  const sigKey = found.map((v) => v.sig).join("|");
  const prev = cache.videos;
  const framesRoot = path.join(OUT, "frames");
  const postersRoot = path.join(OUT, "posters");
  // Remove chapters whose clip was removed from the inbox.
  for (const v of VIDEOS) {
    if (!found.some((f) => f.chapter === v.chapter)) {
      await fs.rm(path.join(framesRoot, v.chapter), { recursive: true, force: true });
    }
  }
  if (!FORCE && prev && prev.sig === sigKey && prev.result) {
    log("video frames up to date");
    Object.assign(manifest.frames, prev.result.frames);
    manifest.budget = prev.result.budget;
    return;
  }

  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pelican-frames-"));
  await fs.mkdir(postersRoot, { recursive: true });
  try {
    let chosen = null;
    const extractedAt = {};
    for (const setting of FRAME_SETTINGS) {
      let total = 0;
      const results = {};
      for (const v of found) {
        const tmp = path.join(tmpRoot, `${v.chapter}-${setting.fps}`);
        if (!extractedAt[tmp]) {
          await fs.mkdir(tmp, { recursive: true });
          extractFrames(ffmpeg, v.input, setting.fps, tmp);
          extractedAt[tmp] = true;
        }
        const res = await encodeFrames(tmp, path.join(framesRoot, v.chapter), setting.quality);
        results[v.chapter] = { ...res, fps: setting.fps, tmp };
        total += res.bytes;
      }
      log(`frames @ ${setting.fps}fps q${setting.quality}: ${(total / 1048576).toFixed(2)} MB`);
      chosen = { setting, results, total };
      if (total <= FRAME_BUDGET) break;
    }
    if (chosen.total > FRAME_BUDGET) log("WARNING: frames still over budget at the lowest setting");

    for (const v of found) {
      const r = chosen.results[v.chapter];
      // Poster: first frame, full source resolution, high quality.
      const posterBase = path.join(postersRoot, v.chapter);
      const first = path.join(tmpRoot, `${v.chapter}-poster.png`);
      spawnSync(ffmpeg, ["-loglevel", "error", "-y", "-i", v.input, "-frames:v", "1", first], { stdio: "inherit" });
      const pInfo = await sharp(first).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`${posterBase}.webp`);
      await sharp(first).resize({ width: 1920, withoutEnlargement: true }).avif({ quality: 60 }).toFile(`${posterBase}.avif`);
      manifest.frames[v.chapter] = {
        count: r.count,
        fps: r.fps,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        base: `${URL_BASE}/frames/${v.chapter}/`,
        poster: {
          width: pInfo.width,
          height: pInfo.height,
          avif: `${URL_BASE}/posters/${v.chapter}.avif`,
          webp: `${URL_BASE}/posters/${v.chapter}.webp`,
        },
      };
    }
    manifest.budget = {
      frameBytes: chosen.total,
      limitBytes: FRAME_BUDGET,
      fps: chosen.setting.fps,
      quality: chosen.setting.quality,
    };
    cache.videos = { sig: sigKey, result: { frames: Object.fromEntries(found.map((v) => [v.chapter, manifest.frames[v.chapter]])), budget: manifest.budget } };
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const imgDir = path.join(OUT, "img");
  await fs.mkdir(imgDir, { recursive: true });
  const cache = existsSync(CACHE) ? JSON.parse(await fs.readFile(CACHE, "utf8")) : {};
  cache.images ||= {};

  const manifest = {
    note: "Generated by scripts/process-assets.mjs. Do not edit by hand.",
    images: {},
    frames: {},
    budget: { frameBytes: 0, limitBytes: FRAME_BUDGET, fps: 0, quality: 0 },
    placeholders: [],
    missing: [],
  };

  let built = 0;
  for (const spec of ONLY_VIDEO ? [] : SPECS) {
    const input = await findInput(spec.key, IMAGE_EXTS);
    const kind = KINDS[spec.kind];
    if (!input && spec.optional) {
      if (cache.images[spec.key]) {
        for (const w of kind.widths) {
          await fs.rm(path.join(imgDir, `${spec.key}-${w}.avif`), { force: true });
          await fs.rm(path.join(imgDir, `${spec.key}-${w}.webp`), { force: true });
        }
        delete cache.images[spec.key];
      }
      continue;
    }
    const sig = input ? await signature(input) : `placeholder:${spec.tone}:v2`;
    const cached = cache.images[spec.key];
    const outputsExist = kind.widths.every((w) => existsSync(path.join(imgDir, `${spec.key}-${w}.webp`)));
    let entry;
    if (!FORCE && cached && cached.sig === sig && outputsExist) {
      entry = cached.entry;
    } else {
      const source = input
        ? input
        : await sharp(placeholderSvg({ w: kind.w, h: kind.h, tone: spec.tone, label: `${spec.key}.jpg` }))
            .png()
            .toBuffer();
      entry = await writeVariants(source, spec, imgDir);
      entry.placeholder = !input;
      cache.images[spec.key] = { sig, entry };
      built++;
      log(`${input ? "built" : "placeholder"} ${spec.key}`);
    }
    manifest.images[spec.key] = entry;
    if (entry.placeholder) {
      manifest.placeholders.push(`${spec.key}.jpg`);
      manifest.missing.push(`${spec.key}.jpg`);
    }
  }

  await processVideos(cache, manifest);

  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  await fs.mkdir(path.dirname(CACHE), { recursive: true });
  await fs.writeFile(CACHE, JSON.stringify(cache, null, 2) + "\n");

  const imgBytes = await dirBytes(imgDir);
  log(`images: ${built} rebuilt, ${Object.keys(manifest.images).length} total, ${(imgBytes / 1048576).toFixed(2)} MB on disk`);
  log(`frames: ${(manifest.budget.frameBytes / 1048576).toFixed(2)} MB of ${(FRAME_BUDGET / 1048576).toFixed(0)} MB budget`);
  if (manifest.missing.length) {
    log(`${manifest.missing.length} missing (placeholders or skipped):`);
    for (const m of manifest.missing) console.log("   -", m);
  }
  log(`manifest -> ${rel(MANIFEST)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
