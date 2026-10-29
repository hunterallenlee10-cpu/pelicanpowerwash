import type { ItemId } from "@/lib/pricing";

/**
 * Pin positions (percent of the picture's width/height) for the "tap to
 * price" house in the Instant Price section.
 *
 * - `image`: for the generated h1-house-iso render. These are starting
 *   guesses; open the site with `?hotspots=edit`, drag the pins onto the
 *   right spots and paste the copied numbers here.
 * - `fallback`: for the built-in SVG house (components/story/HouseSvg.tsx),
 *   used while the render is still a placeholder.
 */
export type HotspotId = Extract<
  ItemId,
  "siding" | "roof" | "driveway" | "walkway" | "patio" | "deck" | "fence" | "basement" | "trash"
>;
export type Hotspots = Record<HotspotId, { x: number; y: number }>;

export const hotspots: { image: Hotspots; fallback: Hotspots } = {
  // TODO(Hunter): fine-tune with ?hotspots=edit once h1-house-iso is in.
  image: {
    siding: { x: 48, y: 46 },
    roof: { x: 50, y: 26 },
    driveway: { x: 72, y: 70 },
    walkway: { x: 50, y: 74 },
    patio: { x: 18, y: 40 },
    deck: { x: 26, y: 50 },
    fence: { x: 10, y: 56 },
    basement: { x: 30, y: 62 },
    trash: { x: 86, y: 52 },
  },
  fallback: {
    siding: { x: 65, y: 41 },
    roof: { x: 55.7, y: 28.9 },
    driveway: { x: 28.4, y: 50 },
    walkway: { x: 40.5, y: 61.3 },
    patio: { x: 81.8, y: 52 },
    deck: { x: 70.7, y: 53.5 },
    fence: { x: 70.4, y: 66.2 },
    basement: { x: 62.8, y: 58.4 },
    trash: { x: 31.1, y: 34.9 },
  },
};
