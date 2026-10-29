/**
 * Stains on the "Wash this driveway" slab. One list drives the procedural
 * grime, the labels pinned on the slab and the legend cards under it.
 *
 * Positions are percent of the 16:9 game texture (g1-driveway-topdown-clean):
 * `x` across, `y` down, `r` radius as percent of the texture width. Tune them
 * here if a new texture puts the joints somewhere else.
 */
export type StainId = "mildew" | "weeds" | "oil" | "tracks" | "rust";

export type Stain = {
  id: StainId;
  label: string;
  /** One honest line for the legend card. */
  note: string;
  x: number;
  y: number;
  r: number;
  /** Dot color on the label and legend card. */
  dot: string;
};

/** Concrete area and control joints, percent of the texture. */
export const SLAB = { top: 5, bottom: 95, jointX: 50, jointY: 48 };

export const STAINS: Stain[] = [
  {
    id: "mildew",
    label: "Black mildew",
    note: "Shade and Southern Maryland humidity. Pre-treat kills it at the root.",
    x: 21,
    y: 27,
    r: 14,
    dot: "#7f9a52",
  },
  {
    id: "weeds",
    label: "Weeds in joints",
    note: "Blasted out so the joints read clean again.",
    x: 50,
    y: 48,
    r: 7,
    dot: "#4fbf5a",
  },
  {
    id: "oil",
    label: "Oil drip",
    note: "Degreaser first. We lighten it a lot; old oil can leave a shadow.",
    x: 73,
    y: 63,
    r: 7,
    dot: "#c9c9c9",
  },
  {
    id: "tracks",
    label: "Tire tracks",
    note: "Rubber and road film baked in. The surface cleaner lifts it.",
    x: 27,
    y: 73,
    r: 11,
    dot: "#8f9aa5",
  },
  {
    id: "rust",
    label: "Rust stain",
    note: "Iron from well water or fertilizer. Needs a rust remover, not more pressure.",
    x: 89,
    y: 28,
    r: 9,
    dot: "#d9783a",
  },
];
