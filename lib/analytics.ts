import { track as vercelTrack } from "@vercel/analytics";

/**
 * Funnel events. Wired once here so every call site uses the same names.
 * Props must never carry personal data (no names, phones, addresses).
 */
export type EventName =
  | "story_complete"
  | "skip_show"
  | "price_item_toggle"
  | "price_lock_in"
  | "quote_text_click"
  | "game_start"
  | "game_complete"
  | "gauge_select";

type Props = Record<string, string | number | boolean | null>;

const fired = new Set<string>();

export function track(name: EventName, props?: Props) {
  try {
    vercelTrack(name, props);
  } catch {
    // Analytics must never break the page.
  }
}

/** Fire an event at most once per page view. */
export function trackOnce(name: EventName, props?: Props) {
  if (fired.has(name)) return;
  fired.add(name);
  track(name, props);
}
