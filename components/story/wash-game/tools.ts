/**
 * Nozzle tips for the wash game. Colors follow the industry-standard tip
 * colors. `bands` describe the spray profile across the stroke width as
 * [fraction of width, alpha]; a soft profile on a weak tip is what leaves
 * "zebra stripes" when lanes don't overlap.
 */
export type ToolId = "surface" | "green" | "yellow" | "red" | "white" | "soap";

export type Tool = {
  id: ToolId;
  name: string;
  /** Nozzle color for the chip. */
  color: string;
  /** Stroke width in texture pixels (texture is 1280 wide). */
  width: number;
  /** Share of grime removed at the center of one pass (0 to 1). */
  strength: number;
  bands: [number, number][];
  tip: string;
  pick?: boolean;
  etch?: boolean;
  soap?: boolean;
};

export const TOOLS: Tool[] = [
  {
    id: "surface",
    name: "Surface cleaner",
    color: "#0a7585",
    width: 150,
    strength: 1,
    bands: [[1, 1]],
    tip: "Our pick. A spinning bar under a hood: one even pass, no stripes, no marks.",
    pick: true,
  },
  {
    id: "green",
    name: "Green 25°",
    color: "#2e9d4f",
    width: 70,
    strength: 0.45,
    bands: [
      [1, 0.25],
      [0.6, 0.45],
      [0.25, 0.6],
    ],
    tip: "Takes about two passes. Skip the overlap and you get zebra stripes.",
  },
  {
    id: "yellow",
    name: "Yellow 15°",
    color: "#f2c200",
    width: 34,
    strength: 0.7,
    bands: [
      [1, 0.4],
      [0.5, 0.7],
    ],
    tip: "Stronger and narrower. Easy to leave wand marks.",
  },
  {
    id: "red",
    name: "Red 0°",
    color: "#d92d20",
    width: 9,
    strength: 1,
    bands: [[1, 1]],
    tip: "A pinpoint jet. It cleans, and it carves lines into your concrete.",
    etch: true,
  },
  {
    id: "white",
    name: "White 40°",
    color: "#ffffff",
    width: 120,
    strength: 0.25,
    bands: [
      [1, 0.35],
      [0.5, 0.5],
    ],
    tip: "Gentle and wide. Fine for rinsing, slow on real grime.",
  },
  {
    id: "soap",
    name: "Black · soap",
    color: "#151515",
    width: 130,
    strength: 0,
    bands: [[1, 1]],
    tip: "Pre-treat first. Soaped areas clean 1.6× faster with any tip.",
    soap: true,
  },
];

export function toolById(id: ToolId): Tool {
  return TOOLS.find((t) => t.id === id) ?? TOOLS[0];
}

export function gradeFor(seconds: number, damage: number): string {
  if (damage === 0) return seconds <= 45 ? "A+" : "A";
  if (damage <= 2) return "B";
  if (damage <= 5) return "C";
  return "D";
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
