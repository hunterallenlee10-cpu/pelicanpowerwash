import { Venture } from "@/types";
import { VENTURE_COLORS } from "@/lib/colors";

export const ventures: Venture[] = [
  {
    id: "pelican",
    name: "Pelican Power Wash",
    tagline: "Professional Exterior Cleaning That Gets Results",
    logo: "/logos/pelican-logo.png",
    logoAlt: "Pelican Power Wash mascot and logo",
    description:
      "Pelican Power Wash delivers dependable residential and commercial exterior cleaning designed to restore curb appeal and protect your property. Using professional-grade equipment and surface-safe cleaning methods, we remove dirt, mold, mildew, and buildup with precision. From homes and driveways to decks, fences, and commercial properties, we provide reliable service and results you can feel confident about.",
    ctaPrimary: "Get a Free Quote",
    ctaSecondary: "View Services",
    heroSubtitle: "Make Your Property Shine. Power Washing That Gets Results.",
    heroDescription:
      "Professional exterior cleaning that safely removes buildup, restores your property's appearance, and delivers lasting curb appeal for residential and commercial clients.",
    colors: VENTURE_COLORS.pelican,
  },
];

export function getVentureById(id: string): Venture | undefined {
  return ventures.find((venture) => venture.id === id);
}

export function getVentureByName(name: string): Venture | undefined {
  return ventures.find(
    (venture) => venture.name.toLowerCase() === name.toLowerCase()
  );
}
