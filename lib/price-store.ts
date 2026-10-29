"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny shared store so the quote bar can show the live total from the
 * instant price builder without a context provider around the page.
 */
type PriceState = { total: number; hasPrice: boolean; count: number };

let state: PriceState = { total: 0, hasPrice: false, count: 0 };
const listeners = new Set<() => void>();

export function setPriceState(next: PriceState) {
  if (next.total === state.total && next.hasPrice === state.hasPrice && next.count === state.count) return;
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const serverState: PriceState = { total: 0, hasPrice: false, count: 0 };

export function usePriceState() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

/** Event the quote form listens for to pre-fill itself. */
export const PREFILL_EVENT = "pelican:prefill-quote";
export type PrefillDetail = { services: string[]; description: string };
