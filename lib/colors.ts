import { VentureColors } from "@/types";

export const PELICAN_COLORS: VentureColors = {
  primary: "#00BCD4", // Teal/Cyan
  accent: "#009688", // Darker teal
  dark: "#0D1B24",
  light: "#FFFFFF",
  text: "#FFFFFF",
  textMuted: "#B0B0B0",
  border: "#1A3A42",
  glassBg: "rgba(0, 188, 212, 0.08)",
  glassOpacity: "0.08",
};

export const VENTURE_COLORS: Record<string, VentureColors> = {
  pelican: PELICAN_COLORS,
};
