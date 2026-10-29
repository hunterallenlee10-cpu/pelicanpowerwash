/**
 * Instant price engine. Pure functions, no React, unit tested in
 * lib/pricing.test.ts.
 *
 * Every dollar figure comes from `pricing` and `discounts` in data/site.ts,
 * the same data the Pricing section shows. Items with no configured price
 * come back as "Quoted within 24 hrs"; this file never invents a number.
 */
import { discounts, pricing } from "@/data/site";

export type ItemId =
  | "siding"
  | "house-full"
  | "roof"
  | "gutters"
  | "driveway"
  | "walkway"
  | "patio"
  | "deck"
  | "fence"
  | "basement"
  | "trash";

export type PriceableItem = {
  id: ItemId;
  label: string;
  /** Short label for pins and chips. */
  short: string;
  /** Matching checkbox on the quote form. */
  formService: string;
  /**
   * Whole dollars when the item has its own price, null for a custom quote.
   * Items covered by a package can still be null here: the package covers it.
   */
  price: number | null;
};

export type PackageDef = {
  id: string;
  name: string;
  price: number;
  covers: ItemId[];
};

export type PricingConfig = {
  items: PriceableItem[];
  packages: PackageDef[];
  trash: { 1: number; 2: number };
  discounts: { id: string; label: string; percent: number }[];
  /** TODO(Hunter): confirm stacking. Default: best single discount applies. */
  stackDiscounts: boolean;
};

function amountOf(id: string): number {
  const item = pricing.find((p) => p.id === id);
  if (!item || item.amount == null) {
    throw new Error(`pricing: no amount for "${id}" in data/site.ts`);
  }
  return item.amount;
}

function trashAmount(cans: 1 | 2): number {
  const item = pricing.find((p) => p.id === "trash-cans");
  const option = item?.options?.[cans - 1];
  if (!option) throw new Error("pricing: trash can options missing in data/site.ts");
  return option.amount;
}

export const ITEMS: PriceableItem[] = [
  // TODO(Hunter): set price for a front house wash on its own. Until then the
  // cheapest package that includes it (Total front of house) is quoted.
  { id: "siding", label: "House wash (front)", short: "Siding", formService: "House wash", price: null },
  // TODO(Hunter): set price
  { id: "house-full", label: "Whole house wash (all sides)", short: "Whole house", formService: "House wash", price: null },
  // TODO(Hunter): set price
  { id: "roof", label: "Roof soft wash", short: "Roof", formService: "Roof cleaning", price: null },
  // TODO(Hunter): set price
  { id: "gutters", label: "Gutters", short: "Gutters", formService: "Gutter cleaning", price: null },
  { id: "driveway", label: "Driveway", short: "Driveway", formService: "Driveway & concrete", price: null },
  { id: "walkway", label: "Front walkway", short: "Walkway", formService: "Driveway & concrete", price: null },
  { id: "patio", label: "Patio", short: "Patio", formService: "Patio, deck or fence", price: null },
  // TODO(Hunter): set price
  { id: "deck", label: "Deck", short: "Deck", formService: "Patio, deck or fence", price: null },
  // TODO(Hunter): set price
  { id: "fence", label: "Fence", short: "Fence", formService: "Patio, deck or fence", price: null },
  { id: "basement", label: "Basement walkout stairs", short: "Basement stairs", formService: "Driveway & concrete", price: amountOf("basement-stairs") },
  { id: "trash", label: "Trash can cleaning", short: "Trash cans", formService: "Trash can cleaning", price: trashAmount(1) },
];

export const PACKAGES: PackageDef[] = [
  { id: "front-concrete", name: "Front concrete only", price: amountOf("front-concrete"), covers: ["driveway", "walkway"] },
  { id: "house-concrete", name: "House concrete", price: amountOf("house-concrete"), covers: ["driveway", "walkway", "patio"] },
  // TODO(Hunter): confirm the $349 package's "patio" is the patio item here.
  { id: "total-front", name: "Total front of house", price: amountOf("total-front"), covers: ["siding", "driveway", "walkway", "patio"] },
];

export const DEFAULT_CONFIG: PricingConfig = {
  items: ITEMS,
  packages: PACKAGES,
  trash: { 1: trashAmount(1), 2: trashAmount(2) },
  discounts: discounts.map((d) => ({ id: d.id, label: d.label, percent: d.percent })),
  stackDiscounts: false,
};

/** Informational only: Pelican has no size-based prices. Goes to the quote. */
export const HOME_SIZES = [
  { id: "townhome", label: "Townhome" },
  { id: "rambler", label: "Rambler" },
  { id: "2-story", label: "2-story" },
  { id: "large", label: "Large or 3-story" },
] as const;
export type HomeSize = (typeof HOME_SIZES)[number]["id"];

export type Selection = {
  items: ItemId[];
  trashCans?: 1 | 2;
  military?: boolean;
  senior?: boolean;
  home?: HomeSize;
  /** Heavy green or black growth (shady or wooded lot). Informational. */
  heavy?: boolean;
};

export type Quote = {
  packages: (PackageDef & { bonus: ItemId[] })[];
  lineItems: { id: ItemId; label: string; price: number }[];
  /** Selected items with no configured price. */
  custom: { id: ItemId; label: string }[];
  subtotal: number;
  discount: { label: string; percent: number; amount: number } | null;
  total: number;
  /** True when there is at least one priced line. */
  hasPrice: boolean;
  /** Basement stairs is sold as an add-on; true when it's the only paid line. */
  addonAlone: boolean;
  empty: boolean;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Cheapest set of packages that covers every package-coverable item in
 * `wanted`. Brute force: there are only a handful of packages.
 */
function cheapestCover(wanted: ItemId[], packages: PackageDef[]) {
  let best: { cost: number; picks: PackageDef[] } | null = null;
  const n = packages.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    const picks = packages.filter((_, i) => mask & (1 << i));
    const covered = new Set(picks.flatMap((p) => p.covers));
    if (!wanted.every((id) => covered.has(id))) continue;
    const cost = picks.reduce((sum, p) => sum + p.price, 0);
    // Tie-break on fewer packages, so one package wins over an equal pair.
    if (!best || cost < best.cost || (cost === best.cost && picks.length < best.picks.length)) {
      best = { cost, picks };
    }
  }
  return best;
}

export function priceSelection(selection: Selection, config: PricingConfig = DEFAULT_CONFIG): Quote {
  const chosen = config.items.filter((item) => selection.items.includes(item.id));
  const coverable = new Set(config.packages.flatMap((p) => p.covers));

  // Package-covered items with no price of their own go through the cover;
  // an item with its own price is billed directly.
  const viaPackage = chosen.filter((i) => i.price == null && coverable.has(i.id)).map((i) => i.id);
  const cover = viaPackage.length ? cheapestCover(viaPackage, config.packages) : { cost: 0, picks: [] };
  const coveredIds = new Set(cover?.picks.flatMap((p) => p.covers) ?? []);

  const packages = (cover?.picks ?? []).map((p) => ({
    ...p,
    bonus: p.covers.filter((id) => !selection.items.includes(id)),
  }));

  const lineItems: Quote["lineItems"] = [];
  const custom: Quote["custom"] = [];
  for (const item of chosen) {
    if (coveredIds.has(item.id) && item.price == null) continue;
    if (item.id === "trash") {
      const cans = selection.trashCans === 2 ? 2 : 1;
      lineItems.push({
        id: item.id,
        label: `${item.label} (${cans} can${cans > 1 ? "s" : ""})`,
        price: config.trash[cans],
      });
    } else if (item.price != null) {
      lineItems.push({ id: item.id, label: item.label, price: item.price });
    } else {
      custom.push({ id: item.id, label: item.label });
    }
  }

  const subtotal = packages.reduce((s, p) => s + p.price, 0) + lineItems.reduce((s, l) => s + l.price, 0);

  const eligible = config.discounts.filter(
    (d) => (d.id === "military" && selection.military) || (d.id === "senior" && selection.senior)
  );
  let discount: Quote["discount"] = null;
  if (eligible.length && subtotal > 0) {
    if (config.stackDiscounts) {
      const percent = eligible.reduce((s, d) => s + d.percent, 0);
      discount = {
        label: eligible.map((d) => d.label).join(" + "),
        percent,
        amount: round2((subtotal * percent) / 100),
      };
    } else {
      const best = eligible.reduce((a, b) => (b.percent > a.percent ? b : a));
      discount = { label: best.label, percent: best.percent, amount: round2((subtotal * best.percent) / 100) };
    }
  }

  const total = round2(subtotal - (discount?.amount ?? 0));
  const paidLines = packages.length + lineItems.length;
  return {
    packages,
    lineItems,
    custom,
    subtotal,
    discount,
    total,
    hasPrice: paidLines > 0,
    addonAlone: paidLines === 1 && lineItems[0]?.id === "basement",
    empty: chosen.length === 0,
  };
}

/** "$349" or "$314.10". */
export function formatMoney(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

const ITEM_IDS = new Set<string>(ITEMS.map((i) => i.id));

/** `?items=siding,driveway,trash2,military` <-> Selection */
export function parseSelection(param: string | null | undefined): Selection {
  const sel: Selection = { items: [] };
  if (!param) return sel;
  for (const raw of param.split(",")) {
    const token = raw.trim().toLowerCase();
    if (token === "military") sel.military = true;
    else if (token === "senior") sel.senior = true;
    else if (token === "heavy") sel.heavy = true;
    else if (token.startsWith("home-") && HOME_SIZES.some((h) => h.id === token.slice(5))) {
      sel.home = token.slice(5) as HomeSize;
    }
    else if (token === "trash2") {
      if (!sel.items.includes("trash")) sel.items.push("trash");
      sel.trashCans = 2;
    } else if (ITEM_IDS.has(token) && !sel.items.includes(token as ItemId)) {
      sel.items.push(token as ItemId);
    }
  }
  return sel;
}

export function serializeSelection(sel: Selection): string {
  const tokens: string[] = sel.items.map((id) => (id === "trash" && sel.trashCans === 2 ? "trash2" : id));
  if (sel.military) tokens.push("military");
  if (sel.senior) tokens.push("senior");
  if (sel.home) tokens.push(`home-${sel.home}`);
  if (sel.heavy) tokens.push("heavy");
  return tokens.join(",");
}

const itemLabel = (id: ItemId) => ITEMS.find((i) => i.id === id)?.label ?? id;

/** Plain text summary for the SMS body and the quote form. */
export function quoteToText(quote: Quote): string {
  if (quote.empty) return "";
  const lines: string[] = [];
  for (const p of quote.packages) {
    lines.push(`${p.name}: ${formatMoney(p.price)}`);
  }
  for (const l of quote.lineItems) lines.push(`${l.label}: ${formatMoney(l.price)}`);
  if (quote.discount) lines.push(`${quote.discount.label} discount: -${formatMoney(quote.discount.amount)}`);
  if (quote.hasPrice) lines.push(`Total (taxes included): ${formatMoney(quote.total)}`);
  if (quote.custom.length) {
    lines.push(`Needs a quote: ${quote.custom.map((c) => c.label).join(", ")}`);
  }
  return lines.join("\n");
}

/** Extra lines for the quote form / SMS: home type and heavy growth. */
export function selectionNotes(sel: Selection): string {
  const lines: string[] = [];
  const home = HOME_SIZES.find((h) => h.id === sel.home);
  if (home) lines.push(`Home: ${home.label}`);
  if (sel.heavy) lines.push("Heavy green or black growth (shady or wooded lot)");
  return lines.join("\n");
}

/** Quote form checkboxes that match a selection. */
export function formServicesFor(sel: Selection): string[] {
  const out: string[] = [];
  for (const id of sel.items) {
    const svc = ITEMS.find((i) => i.id === id)?.formService;
    if (svc && !out.includes(svc)) out.push(svc);
  }
  return out;
}

export { itemLabel };
