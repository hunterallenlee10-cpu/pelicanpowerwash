"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, MessageSquare, Plus } from "lucide-react";
import { business } from "@/data/site";
import { track } from "@/lib/analytics";
import {
  HOME_SIZES,
  ITEMS,
  formServicesFor,
  formatMoney,
  parseSelection,
  priceSelection,
  quoteToText,
  selectionNotes,
  serializeSelection,
  type HomeSize,
  type ItemId,
  type Selection,
} from "@/lib/pricing";
import { PREFILL_EVENT, setPriceState, type PrefillDetail } from "@/lib/price-store";

const chipBase =
  "inline-flex min-h-12 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-semibold transition-colors";
const chipOn = "border-accent bg-accent text-on-accent";
const chipOff = "border-line bg-surface text-ink hover:border-ink-2";

export function InstantPriceClient({ intro }: { intro: React.ReactNode }) {
  const [sel, setSel] = useState<Selection>({ items: [] });
  const touched = useRef(false);
  const quote = useMemo(() => priceSelection(sel), [sel]);

  // Restore a shared selection from ?items= after hydration.
  useEffect(() => {
    const restored = parseSelection(new URLSearchParams(window.location.search).get("items"));
    if (restored.items.length || restored.military || restored.senior || restored.home || restored.heavy) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
      setSel(restored);
    }
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

  const update = (fn: (prev: Selection) => Selection) => {
    touched.current = true;
    setSel(fn);
  };
  const toggle = (id: ItemId) =>
    update((prev) => {
      const on = !prev.items.includes(id);
      track("price_item_toggle", { item: id, on });
      return { ...prev, items: on ? [...prev.items, id] : prev.items.filter((i) => i !== id) };
    });
  const setHome = (home: HomeSize) => update((prev) => ({ ...prev, home: prev.home === home ? undefined : home }));

  const notes = selectionNotes(sel);
  const summary = [quoteToText(quote), notes].filter(Boolean).join("\n");
  const smsBody = summary ? `Hi Pelican, I'd like this quote:\n${summary}` : "Hi Pelican, I'd like a quote.";
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

  const badges: string[] = quote.packages.map((p) => `${p.name} package`);
  if (quote.discount) badges.push(`${quote.discount.label} ${quote.discount.percent}% applied`);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
      <div>
        {intro}

        <p id="ip-home" className="label-mono mt-9 text-ink-2">
          Your home
        </p>
        <div role="radiogroup" aria-labelledby="ip-home" className="mt-3 flex flex-wrap gap-2">
          {HOME_SIZES.map((h) => {
            const on = sel.home === h.id;
            return (
              <button
                key={h.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setHome(h.id)}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {h.label}
              </button>
            );
          })}
        </div>

        <p id="ip-items" className="label-mono mt-7 text-ink-2">
          What should we wash?
        </p>
        <div role="group" aria-labelledby="ip-items" className="mt-3 flex flex-wrap gap-2">
          {ITEMS.map((item) => {
            const on = sel.items.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(item.id)}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {on ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                {item.label}
              </button>
            );
          })}
        </div>

        {sel.items.includes("trash") && (
          <div className="mt-4 flex items-center gap-3">
            <span id="ip-cans" className="label-mono text-ink-2">
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
                    onClick={() => update((prev) => ({ ...prev, trashCans: n }))}
                    className={`min-h-10 rounded-full px-4 text-sm font-semibold ${on ? "bg-accent text-on-accent" : "text-ink-2"}`}
                  >
                    {n} can{n > 1 ? "s" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="label-mono mt-7 text-ink-2">Discounts · 10%, best one applies</p>
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
                onClick={() => update((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {on && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
                {label}
              </button>
            );
          })}
        </div>

        <label className="mt-7 flex min-h-12 cursor-pointer items-center gap-3 text-ink">
          <input
            type="checkbox"
            checked={Boolean(sel.heavy)}
            onChange={() => update((prev) => ({ ...prev, heavy: !prev.heavy }))}
            className="h-5 w-5 shrink-0 rounded border-line accent-[var(--accent)]"
          />
          Heavy green or black growth (shady or wooded lot)
        </label>
      </div>

      {/* Estimate card */}
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:p-8 lg:sticky lg:top-28">
        <p className="label-mono text-ink-2">Your estimate</p>
        <p aria-live="polite" aria-atomic className="mt-3">
          {quote.hasPrice ? (
            <span className="font-display text-5xl leading-none text-ink tabular-nums sm:text-6xl">
              {formatMoney(quote.total)}
            </span>
          ) : (
            <span className="font-display text-3xl leading-tight text-ink">
              {quote.empty ? "Pick what to wash" : "Quoted within 24 hrs"}
            </span>
          )}
        </p>

        {badges.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <li key={b} className="label-mono rounded-full bg-accent-soft px-3 py-1 text-accent-text">
                {b}
              </li>
            ))}
          </ul>
        )}

        {!quote.empty && (
          <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
            {quote.packages.map((p) => (
              <li key={p.id} className="flex justify-between gap-4">
                <span className="text-ink-2">{p.name}</span>
                <span className="font-semibold text-ink">{formatMoney(p.price)}</span>
              </li>
            ))}
            {quote.lineItems.map((l) => (
              <li key={l.id} className="flex justify-between gap-4">
                <span className="text-ink-2">{l.label}</span>
                <span className="font-semibold text-ink">{formatMoney(l.price)}</span>
              </li>
            ))}
            {quote.discount && (
              <li className="flex justify-between gap-4">
                <span className="text-ink-2">{quote.discount.label} discount</span>
                <span className="font-semibold text-ink">-{formatMoney(quote.discount.amount)}</span>
              </li>
            )}
            {quote.custom.length > 0 && (
              <li className="text-accent-text">
                + {quote.custom.map((c) => c.label.toLowerCase()).join(", ")} quoted within 24 hrs
              </li>
            )}
            {quote.addonAlone && <li className="text-ink-2">Basement stairs is an add-on. Pair it with any other service.</li>}
          </ul>
        )}

        <p className="mt-5 text-sm leading-relaxed text-ink-2">
          Set prices for a typical home, taxes included. Bigger homes and heavy growth get a free written quote.
        </p>

        <button type="button" onClick={lockIn} className="btn btn-primary mt-6 w-full">
          Lock in a free estimate
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
        <a
          href={smsLink}
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 font-semibold text-ink-2 underline-offset-4 hover:text-ink hover:underline"
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          Text me this quote
        </a>
      </div>
    </div>
  );
}
