"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, MessageSquare, Plus } from "lucide-react";
import type { HotspotId, Hotspots } from "@/data/hotspots";
import { business } from "@/data/site";
import { track } from "@/lib/analytics";
import {
  ITEMS,
  formServicesFor,
  formatMoney,
  itemLabel,
  parseSelection,
  priceSelection,
  quoteToText,
  serializeSelection,
  type ItemId,
  type Selection,
} from "@/lib/pricing";
import { PREFILL_EVENT, setPriceState, type PrefillDetail } from "@/lib/price-store";

export type HousePicture = { avif: string; webp: string; src: string; width: number; height: number };

type Props = {
  picture: HousePicture | null;
  dirtyPicture: HousePicture | null;
  hotspots: Hotspots;
  policies: string[];
  /** The fallback SVG house, rendered on the server. */
  children?: React.ReactNode;
};

const PIN_IDS = Object.keys({
  siding: 1,
  roof: 1,
  driveway: 1,
  walkway: 1,
  patio: 1,
  deck: 1,
  fence: 1,
  basement: 1,
  trash: 1,
}) as HotspotId[];

export function InstantPriceClient({ picture, dirtyPicture, hotspots, policies, children }: Props) {
  const [sel, setSel] = useState<Selection>({ items: [] });
  const [editing, setEditing] = useState(false);
  const [pins, setPins] = useState<Hotspots>(hotspots);
  const touched = useRef(false);
  const quote = useMemo(() => priceSelection(sel), [sel]);

  // Restore a shared selection from ?items= and check for the pin editor.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restored = parseSelection(params.get("items"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
    if (restored.items.length || restored.military || restored.senior) setSel(restored);
    if (params.get("hotspots") === "edit") setEditing(true);
  }, []);

  useEffect(() => {
    setPriceState({ total: quote.total, hasPrice: quote.hasPrice, count: sel.items.length });
    if (!touched.current) return;
    const url = new URL(window.location.href);
    const value = serializeSelection(sel);
    if (value) url.searchParams.set("items", value);
    else url.searchParams.delete("items");
    window.history.replaceState(window.history.state, "", url);
  }, [quote, sel]);

  const toggle = (id: ItemId) => {
    touched.current = true;
    setSel((prev) => {
      const on = !prev.items.includes(id);
      track("price_item_toggle", { item: id, on });
      return { ...prev, items: on ? [...prev.items, id] : prev.items.filter((i) => i !== id) };
    });
  };
  const setFlag = (key: "military" | "senior") => {
    touched.current = true;
    setSel((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const setCans = (n: 1 | 2) => {
    touched.current = true;
    setSel((prev) => ({ ...prev, trashCans: n }));
  };

  const summary = quoteToText(quote);
  const smsBody = summary
    ? `Hi Pelican, I'd like this quote:\n${summary}`
    : "Hi Pelican, I'd like a quote.";
  const smsLink = `sms:${business.phone.e164}?&body=${encodeURIComponent(smsBody)}`;

  const lockIn = () => {
    const detail: PrefillDetail = {
      services: formServicesFor(sel),
      description: summary ? `From the instant price builder:\n${summary}` : "",
    };
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail }));
    track("price_lock_in", { items: sel.items.length, total: quote.total });
    document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("fullName")?.focus({ preventScroll: true }), 600);
  };

  // Areas the house picture should show as washed.
  const washed = new Set<string>(sel.items);
  if (washed.has("house-full")) washed.add("siding");

  const selectedPins = PIN_IDS.filter((id) => sel.items.includes(id));
  const mask = selectedPins
    .map((id) => `radial-gradient(circle at ${pins[id].x}% ${pins[id].y}%, transparent 0 8%, #000 14%)`)
    .join(", ");

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* House with pins */}
      <figure className="self-start">
        <div
          className="relative overflow-hidden rounded-2xl bg-[#0a1626] shadow-[0_24px_60px_-28px_rgb(14_36_64/0.5)]"
          data-sel={[...washed].join(" ")}
        >
          {picture ? (
            <>
              <picture>
                <source type="image/avif" srcSet={picture.avif} sizes="(min-width: 1024px) 55vw, 100vw" />
                <source type="image/webp" srcSet={picture.webp} sizes="(min-width: 1024px) 55vw, 100vw" />
                <img
                  src={picture.src}
                  width={picture.width}
                  height={picture.height}
                  alt="Illustration of a two-story house with a driveway, walkway, back patio, deck and fence"
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </picture>
              {dirtyPicture && (
                <picture
                  className="absolute inset-0"
                  style={
                    mask
                      ? ({
                          maskImage: mask,
                          WebkitMaskImage: mask,
                          maskComposite: "intersect",
                          WebkitMaskComposite: "source-in",
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <source type="image/avif" srcSet={dirtyPicture.avif} sizes="(min-width: 1024px) 55vw, 100vw" />
                  <source type="image/webp" srcSet={dirtyPicture.webp} sizes="(min-width: 1024px) 55vw, 100vw" />
                  <img src={dirtyPicture.src} alt="" loading="lazy" decoding="async" className="block h-full w-full" />
                </picture>
              )}
            </>
          ) : (
            <div role="img" aria-label="Illustration of a two-story house with a driveway, walkway, back patio, deck and fence">
              {children}
            </div>
          )}

          {PIN_IDS.map((id) => {
            const on = sel.items.includes(id);
            const item = ITEMS.find((i) => i.id === id)!;
            return (
              <button
                key={id}
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={editing ? undefined : () => toggle(id)}
                onPointerDown={editing ? (e) => startDrag(e, id, setPins) : undefined}
                className={`hs-pin group ${on ? "is-on" : ""} ${editing ? "cursor-move" : ""}`}
                style={{ left: `${pins[id].x}%`, top: `${pins[id].y}%` }}
              >
                <span className="hs-dot">
                  {on ? <Check className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" strokeWidth={3} />}
                </span>
                <span className="hs-chip">
                  {item.short}
                  {editing && ` ${pins[id].x}, ${pins[id].y}`}
                </span>
              </button>
            );
          })}
        </div>
        <figcaption className="mt-3 text-sm text-ink-2">
          Illustration. Tap a spot on the house, or use the list. Set prices are for typical homes; bigger homes get a
          free written quote.
        </figcaption>
        {editing && <PinEditor pins={pins} />}
      </figure>

      {/* The real control: chips, toggles and the summary */}
      <div>
        <p id="ip-items-label" className="text-sm font-semibold text-ink-2">
          What should we clean?
        </p>
        <div role="group" aria-labelledby="ip-items-label" className="mt-3 flex flex-wrap gap-2">
          {ITEMS.map((item) => {
            const on = sel.items.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(item.id)}
                className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-semibold transition-colors ${
                  on
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line bg-surface text-ink hover:border-ink-2"
                }`}
              >
                {on ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                {item.label}
              </button>
            );
          })}
        </div>

        {sel.items.includes("trash") && (
          <div className="mt-4 flex items-center gap-3">
            <span id="ip-cans" className="text-sm font-semibold text-ink-2">
              Trash cans
            </span>
            <div role="radiogroup" aria-labelledby="ip-cans" className="inline-flex rounded-full border border-line bg-surface p-1">
              {([1, 2] as const).map((n) => {
                const on = (sel.trashCans ?? 1) === n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setCans(n)}
                    className={`min-h-10 rounded-full px-4 text-sm font-semibold ${on ? "bg-ink text-canvas" : "text-ink-2"}`}
                  >
                    {n} can{n > 1 ? "s" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-6 text-sm font-semibold text-ink-2">Discounts (10% off, best one applies)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["military", "Military"],
              ["senior", "Senior 65+"],
            ] as const
          ).map(([key, label]) => {
            const on = Boolean(sel[key]);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setFlag(key)}
                className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-semibold transition-colors ${
                  on ? "border-ink bg-ink text-canvas" : "border-line bg-surface text-ink hover:border-ink-2"
                }`}
              >
                {on && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
                {label}
              </button>
            );
          })}
        </div>

        <QuoteSummary quote={quote} />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={lockIn} className="btn btn-primary">
            {quote.hasPrice ? "Lock in this price" : "Request my quote"}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
          <a href={smsLink} className="btn btn-secondary">
            <MessageSquare className="h-4 w-4" aria-hidden />
            Text me this quote
          </a>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
          {policies.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function QuoteSummary({ quote }: { quote: ReturnType<typeof priceSelection> }) {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      {quote.empty ? (
        <p className="text-ink-2">Pick anything above (or tap the house) and your price shows up here.</p>
      ) : (
        <ul className="space-y-3">
          {quote.packages.map((p) => (
            <li key={p.id} className="flex items-baseline justify-between gap-4">
              <span>
                <span className="font-semibold text-ink">{p.name}</span>
                <span className="block text-sm text-ink-2">
                  Covers {p.covers.map((id) => itemLabel(id).toLowerCase()).join(", ")}
                  {p.bonus.length > 0 && ` (${p.bonus.map((id) => itemLabel(id).toLowerCase()).join(", ")} included)`}
                </span>
              </span>
              <span className="font-display text-lg text-ink">{formatMoney(p.price)}</span>
            </li>
          ))}
          {quote.lineItems.map((l) => (
            <li key={l.id} className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-ink">{l.label}</span>
              <span className="font-display text-lg text-ink">{formatMoney(l.price)}</span>
            </li>
          ))}
          {quote.custom.map((c) => (
            <li key={c.id} className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-ink">{c.label}</span>
              <span className="text-sm font-semibold whitespace-nowrap text-accent-text">Quoted within 24 hrs</span>
            </li>
          ))}
          {quote.discount && (
            <li className="flex items-baseline justify-between gap-4 text-ink-2">
              <span>{quote.discount.label} discount ({quote.discount.percent}%)</span>
              <span className="font-semibold">-{formatMoney(quote.discount.amount)}</span>
            </li>
          )}
        </ul>
      )}
      {quote.addonAlone && (
        <p className="mt-3 text-sm text-ink-2">Basement stairs is an add-on. Pair it with any other service.</p>
      )}
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <span className="text-sm font-semibold text-ink-2">
          Total
          <span className="block font-normal">taxes included</span>
        </span>
        <span aria-live="polite" aria-atomic className="text-right">
          {quote.hasPrice ? (
            <>
              <span className="font-display text-4xl text-ink">{formatMoney(quote.total)}</span>
              {quote.custom.length > 0 && (
                <span className="block text-sm text-ink-2">+ the rest quoted within 24 hrs</span>
              )}
            </>
          ) : (
            <span className="font-semibold text-ink-2">{quote.empty ? "$0" : "Quoted within 24 hrs"}</span>
          )}
        </span>
      </div>
    </div>
  );
}

/** Dev-only pin editor (`?hotspots=edit`): drag pins, copy the numbers. */
function startDrag(
  e: React.PointerEvent<HTMLButtonElement>,
  id: HotspotId,
  setPins: React.Dispatch<React.SetStateAction<Hotspots>>
) {
  const box = e.currentTarget.parentElement!.getBoundingClientRect();
  const el = e.currentTarget;
  el.setPointerCapture(e.pointerId);
  const move = (ev: PointerEvent) => {
    const x = Math.round(((ev.clientX - box.left) / box.width) * 1000) / 10;
    const y = Math.round(((ev.clientY - box.top) / box.height) * 1000) / 10;
    setPins((prev) => ({ ...prev, [id]: { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) } }));
  };
  const up = () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerup", up);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerup", up);
}

function PinEditor({ pins }: { pins: Hotspots }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(pins, null, 2);
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-accent bg-surface p-4">
      <p className="text-sm font-semibold text-ink">Pin editor: drag the pins, then paste this into data/hotspots.ts</p>
      <pre className="mt-2 max-h-60 overflow-auto rounded-xl bg-surface-2 p-3 text-xs text-ink">{json}</pre>
      <button
        type="button"
        className="btn btn-secondary mt-3"
        onClick={() => {
          navigator.clipboard?.writeText(json).then(() => setCopied(true));
        }}
      >
        {copied ? "Copied" : "Copy coordinates"}
      </button>
    </div>
  );
}
