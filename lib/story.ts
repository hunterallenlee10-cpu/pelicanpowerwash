import manifest from "@/data/story-manifest.json";

/**
 * Typed access to data/story-manifest.json, written by
 * scripts/process-assets.mjs. Server components read it and pass only what a
 * client component needs as props.
 */
export type StoryImage = {
  width: number;
  height: number;
  sources: { w: number; avif: string; webp: string }[];
  src: string;
  jpeg?: string;
  placeholder: boolean;
};

export type FrameSet = {
  count: number;
  fps: number;
  width: number;
  height: number;
  bytes: number;
  /** Folder URL, frames are `${base}0001.webp`. */
  base: string;
  poster: { width: number; height: number; avif: string; webp: string } | null;
};

type Manifest = {
  images: Record<string, StoryImage>;
  frames: Record<string, FrameSet>;
  budget: { frameBytes: number; limitBytes: number; fps: number; quality: number };
  placeholders: string[];
  missing: string[];
};

export const story = manifest as unknown as Manifest;

export function storyImage(key: string): StoryImage | null {
  return story.images[key] ?? null;
}

/** `srcset` for one format, widest first in the manifest. */
export function srcSet(img: StoryImage, format: "avif" | "webp"): string {
  return img.sources.map((s) => `${s[format]} ${s.w}w`).join(", ");
}

export function frameUrl(set: FrameSet, index: number): string {
  return `${set.base}${String(index + 1).padStart(4, "0")}.webp`;
}
