/**
 * Surfaces for the method gauge ("The right method for every surface.").
 *
 * PSI ranges are industry-typical starting values, NOT yet confirmed by the
 * Pelican crew. TODO(Hunter): have the crew check each range, method and line
 * of copy, then flip `confirmed` to true. The flag is for tracking only; the
 * UI shows the same thing either way.
 */
export type SurfaceMethod = "Soft wash" | "Pressure wash" | "Surface cleaner" | "Low-pressure wash";

export type Surface = {
  id: string;
  name: string;
  method: SurfaceMethod;
  /** Working range in PSI, [min, max]. */
  psi: [number, number];
  /** Key in data/story-manifest.json for the diagonal dirty/clean tile. */
  tile: string;
  why: string;
  /** What goes wrong when it's done wrong. */
  wrong: string;
  /** Colours for the CSS stand-in while the tile is a placeholder. */
  swatch: { dirty: string; clean: string };
  confirmed: boolean;
};

export const surfaces: Surface[] = [
  {
    id: "vinyl-siding",
    name: "Vinyl siding",
    method: "Soft wash",
    psi: [100, 500],
    tile: "t-siding",
    why: "The cleaning solution kills the algae and mildew, so the rinse only has to carry it away.",
    wrong: "High pressure forces water behind the panels, cracks them and can knock them loose.",
    swatch: { dirty: "#6f7a52", clean: "#d9dee2" },
    confirmed: false,
  },
  {
    id: "roof",
    name: "Roof",
    method: "Soft wash",
    psi: [0, 150],
    tile: "t-roof",
    why: "Black streaks are living algae. A soft-wash mix kills it at the root with a low-pressure rinse.",
    wrong: "Pressure strips the protective granules off shingles, shortens their life and can void the warranty.",
    swatch: { dirty: "#2a2c27", clean: "#4a4f57" },
    confirmed: false,
  },
  {
    id: "concrete",
    name: "Concrete driveway",
    method: "Surface cleaner",
    psi: [2500, 3500],
    tile: "t-concrete",
    why: "Concrete can take real pressure. A spinning surface cleaner spreads it evenly for a uniform finish.",
    wrong: "A wand held too close etches permanent lines and zebra stripes into the slab.",
    swatch: { dirty: "#55554f", clean: "#c9c9c4" },
    confirmed: false,
  },
  {
    id: "wood-deck",
    name: "Wood deck",
    method: "Low-pressure wash",
    psi: [500, 1200],
    tile: "t-deck",
    why: "Wood is soft. A cleaner loosens the gray and mildew so a gentle rinse can lift it.",
    wrong: "Too much pressure furs and splinters the grain, leaving rough boards that need sanding.",
    swatch: { dirty: "#7b7b72", clean: "#b98a5a" },
    confirmed: false,
  },
  {
    id: "pavers",
    name: "Pavers",
    method: "Pressure wash",
    psi: [1500, 2500],
    tile: "t-pavers",
    why: "Moderate pressure lifts stains and weeds, then the joints get re-sanded to lock the pavers in.",
    wrong: "Blasting the joints washes out the sand, so pavers shift and weeds come right back.",
    swatch: { dirty: "#6b6150", clean: "#cdb994" },
    confirmed: false,
  },
  {
    id: "brick",
    name: "Brick",
    method: "Soft wash",
    psi: [500, 1500],
    tile: "t-brick",
    why: "A soft wash breaks down algae and efflorescence, then a low-pressure rinse protects the mortar.",
    wrong: "High pressure erodes mortar joints and chips the brick face, letting water in.",
    swatch: { dirty: "#5d5a3e", clean: "#a5523d" },
    confirmed: false,
  },
  {
    id: "fence",
    name: "Fence",
    method: "Low-pressure wash",
    psi: [500, 1200],
    tile: "t-fence",
    why: "Vinyl and wood fences clean up with a cleaner and a gentle rinse, board by board.",
    wrong: "Too much pressure gouges wood and can crack or scar vinyl panels.",
    swatch: { dirty: "#8a8f6c", clean: "#f1f2ee" },
    confirmed: false,
  },
  {
    id: "stucco",
    name: "Stucco",
    method: "Soft wash",
    psi: [100, 500],
    tile: "t-stucco",
    why: "Stucco is porous. A soft wash cleans the pores without forcing water into the wall.",
    wrong: "Pressure cracks stucco and drives water behind it, where it causes hidden rot and mold.",
    swatch: { dirty: "#6e6a55", clean: "#ece6d8" },
    confirmed: false,
  },
];

export const GAUGE_MAX_PSI = 4000;

const fmt = (n: number) => n.toLocaleString("en-US");

/** "100–500 PSI" or "Up to 150 PSI". */
export function psiLabel([min, max]: [number, number]): string {
  return min === 0 ? `Up to ${fmt(max)} PSI` : `${fmt(min)}–${fmt(max)} PSI`;
}

/** Screen reader text, e.g. "Vinyl siding: soft wash, 100 to 500 PSI." */
export function surfaceSummary(s: Surface): string {
  const [min, max] = s.psi;
  const range = min === 0 ? `up to ${fmt(max)} PSI` : `${fmt(min)} to ${fmt(max)} PSI`;
  return `${s.name}: ${s.method.toLowerCase()}, ${range}.`;
}
