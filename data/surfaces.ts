/**
 * Surfaces for the method gauge ("The right method for every surface.").
 *
 * PSI ranges, methods and tools are industry-typical starting values, NOT yet
 * confirmed by the Pelican crew. TODO(Hunter): have the crew check each range,
 * method, tool and line of copy, then flip `confirmed` to true. The flag is for
 * tracking only; the UI shows the same thing either way.
 */
export type Surface = {
  id: string;
  name: string;
  /** Short method line shown in accent, e.g. "Soft wash + hand". */
  method: string;
  /** Main tools, e.g. "Downstream injector, soft brush". */
  tool: string;
  /** Working range at the surface in PSI, [min, max]. */
  psi: [number, number];
  /** Why this method, and what goes wrong when it's done wrong. One paragraph. */
  note: string;
  confirmed: boolean;
};

export const surfaces: Surface[] = [
  {
    id: "vinyl-siding",
    name: "Siding",
    method: "Soft wash",
    tool: "Downstream injector, wide fan tip",
    psi: [100, 500],
    note: "The cleaning mix kills the algae and mildew, so the rinse only has to carry it away. High pressure forces water behind the panels and can crack or knock them loose.",
    confirmed: false,
  },
  {
    id: "roof",
    name: "Roof",
    method: "Soft wash only",
    tool: "Low-pressure sprayer, roof-safe mix",
    psi: [0, 150],
    note: "Black streaks are living algae. A soft-wash mix kills it at the root. Pressure strips the protective granules off shingles and shortens their life.",
    confirmed: false,
  },
  {
    id: "concrete",
    name: "Driveway",
    method: "Surface cleaner",
    tool: "20-inch rotary surface cleaner",
    psi: [2500, 3500],
    note: "Concrete can take real pressure. A spinning surface cleaner spreads it evenly for one uniform finish. A wand held too close etches permanent lines and zebra stripes.",
    confirmed: false,
  },
  {
    id: "wood-deck",
    name: "Deck",
    method: "Low pressure + cleaner",
    tool: "Wood-safe cleaner, 40° tip",
    psi: [500, 1200],
    note: "Wood is soft. A cleaner loosens the gray and mildew so a gentle rinse can lift it. Too much pressure furs and splinters the grain.",
    confirmed: false,
  },
  {
    id: "gutters",
    name: "Gutters",
    method: "Soft wash + hand",
    tool: "Gutter brightener, soft brush",
    psi: [100, 300],
    note: "The black tiger stripes on gutter faces are baked-on grime. They need a dedicated brightener and a brush, then a gentle rinse.",
    confirmed: false,
  },
  {
    id: "pavers",
    name: "Pavers",
    method: "Pressure wash + re-sand",
    tool: "Surface cleaner, joint sand",
    psi: [1500, 2500],
    note: "Moderate pressure lifts stains and weeds, then the joints get re-sanded. Blasting the joints washes out the sand, so pavers shift and weeds come right back.",
    confirmed: false,
  },
  {
    id: "brick",
    name: "Brick",
    method: "Soft wash + rinse",
    tool: "Masonry-safe mix, 25° tip",
    psi: [500, 1500],
    note: "A soft wash breaks down algae and efflorescence, then a low-pressure rinse protects the mortar. High pressure erodes the joints and chips the brick face.",
    confirmed: false,
  },
  {
    id: "fence",
    name: "Fence",
    method: "Low pressure + cleaner",
    tool: "Soft-wash mix, 40° tip",
    psi: [500, 1200],
    note: "Vinyl and wood fences clean up with a cleaner and a gentle rinse, board by board. Too much pressure gouges wood and scars vinyl.",
    confirmed: false,
  },
  {
    id: "stucco",
    name: "Stucco",
    method: "Soft wash",
    tool: "Downstream injector, wide fan tip",
    psi: [100, 500],
    note: "Stucco is porous. A soft wash cleans the pores without forcing water into the wall, where it causes hidden cracks and rot.",
    confirmed: false,
  },
];

export const GAUGE_MAX_PSI = 4000;

const fmt = (n: number) => n.toLocaleString("en-US");

/** "100–500" or "0–150" for the big gauge readout. */
export function psiRange([min, max]: [number, number]): string {
  return `${fmt(min)}–${fmt(max)}`;
}

/** "100–500 PSI" or "Up to 150 PSI". */
export function psiLabel([min, max]: [number, number]): string {
  return min === 0 ? `Up to ${fmt(max)} PSI` : `${fmt(min)}–${fmt(max)} PSI`;
}

/** Screen reader text, e.g. "Siding: soft wash, 100 to 500 PSI." */
export function surfaceSummary(s: Surface): string {
  const [min, max] = s.psi;
  const range = min === 0 ? `up to ${fmt(max)} PSI` : `${fmt(min)} to ${fmt(max)} PSI`;
  return `${s.name}: ${s.method.toLowerCase()}, ${range}. Tools: ${s.tool.toLowerCase()}.`;
}
