export interface Venture {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  logoAlt: string;
  description: string;
  ctaPrimary: string;
  /**
   * Destination for the primary CTA. When set, the button becomes a link to
   * this route; when omitted it falls back to scrolling to the quote form.
   */
  ctaPrimaryHref?: string;
  ctaSecondary: string;
  colors: VentureColors;
  heroSubtitle: string;
  heroDescription: string;
}

export interface VentureColors {
  primary: string;
  accent: string;
  dark: string;
  light: string;
  text: string;
  textMuted: string;
  border: string;
  glassBg: string;
  glassOpacity: string;
}
