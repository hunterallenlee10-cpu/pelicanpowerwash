import { describe, expect, it } from "vitest";
import { pricing } from "@/data/site";
import {
  formServicesFor,
  formatMoney,
  parseSelection,
  selectionNotes,
  priceSelection,
  quoteToText,
  serializeSelection,
} from "./pricing";

const names = (q: ReturnType<typeof priceSelection>) => q.packages.map((p) => p.id).sort();

describe("priceSelection", () => {
  it("is empty with nothing selected", () => {
    const q = priceSelection({ items: [] });
    expect(q.empty).toBe(true);
    expect(q.total).toBe(0);
    expect(q.hasPrice).toBe(false);
  });

  it("prices front concrete (driveway + walkway) at $149", () => {
    const q = priceSelection({ items: ["driveway", "walkway"] });
    expect(names(q)).toEqual(["front-concrete"]);
    expect(q.total).toBe(149);
  });

  it("covers a lone driveway with the cheapest package and lists the bonus", () => {
    const q = priceSelection({ items: ["driveway"] });
    expect(names(q)).toEqual(["front-concrete"]);
    expect(q.packages[0].bonus).toEqual(["walkway"]);
    expect(q.total).toBe(149);
  });

  it("uses House concrete ($275) for front + back concrete", () => {
    const q = priceSelection({ items: ["driveway", "walkway", "patio"] });
    expect(names(q)).toEqual(["house-concrete"]);
    expect(q.total).toBe(275);
  });

  it("uses Total front of house ($349) once siding is in", () => {
    const q = priceSelection({ items: ["siding", "driveway", "walkway", "patio"] });
    expect(names(q)).toEqual(["total-front"]);
    expect(q.total).toBe(349);
  });

  it("adds basement stairs ($149) and two trash cans ($30) as line items", () => {
    const q = priceSelection({ items: ["driveway", "basement", "trash"], trashCans: 2 });
    expect(q.total).toBe(149 + 149 + 30);
    expect(q.lineItems.map((l) => l.price)).toEqual([149, 30]);
  });

  it("prices one trash can at $20 and flags nothing as an add-on", () => {
    const q = priceSelection({ items: ["trash"] });
    expect(q.total).toBe(20);
    expect(q.addonAlone).toBe(false);
  });

  it("flags basement stairs alone as an add-on", () => {
    const q = priceSelection({ items: ["basement"] });
    expect(q.total).toBe(149);
    expect(q.addonAlone).toBe(true);
  });

  it("never invents a price for roof, deck, fence, gutters or whole house", () => {
    const q = priceSelection({ items: ["roof", "deck", "fence", "gutters", "house-full"] });
    expect(q.hasPrice).toBe(false);
    expect(q.total).toBe(0);
    expect(q.custom.map((c) => c.id).sort()).toEqual(["deck", "fence", "gutters", "house-full", "roof"]);
  });

  it("mixes priced and custom items", () => {
    const q = priceSelection({ items: ["driveway", "walkway", "roof"] });
    expect(q.total).toBe(149);
    expect(q.custom.map((c) => c.id)).toEqual(["roof"]);
  });

  it("applies 10% military", () => {
    const q = priceSelection({ items: ["siding", "driveway", "walkway", "patio"], military: true });
    expect(q.discount?.amount).toBe(34.9);
    expect(q.total).toBe(314.1);
  });

  it("does not stack military and senior by default", () => {
    const q = priceSelection({ items: ["driveway"], military: true, senior: true });
    expect(q.discount?.percent).toBe(10);
    expect(q.total).toBe(134.1);
  });

  it("stacks when configured", async () => {
    const { DEFAULT_CONFIG } = await import("./pricing");
    const q = priceSelection(
      { items: ["driveway"], military: true, senior: true },
      { ...DEFAULT_CONFIG, stackDiscounts: true }
    );
    expect(q.discount?.percent).toBe(20);
    expect(q.total).toBe(119.2);
  });

  it("does not discount a custom-only selection", () => {
    const q = priceSelection({ items: ["roof"], senior: true });
    expect(q.discount).toBeNull();
  });
});

describe("helpers", () => {
  it("round-trips the ?items= param", () => {
    const sel = parseSelection("siding,driveway,trash2,military,bogus");
    expect(sel).toEqual({ items: ["siding", "driveway", "trash"], trashCans: 2, military: true });
    expect(serializeSelection(sel)).toBe("siding,driveway,trash2,military");
  });

  it("round-trips home size and heavy growth", () => {
    const sel = parseSelection("driveway,home-2-story,heavy,home-bogus");
    expect(sel).toEqual({ items: ["driveway"], home: "2-story", heavy: true });
    expect(serializeSelection(sel)).toBe("driveway,home-2-story,heavy");
    expect(selectionNotes(sel)).toBe("Home: 2-story\nHeavy green or black growth (shady or wooded lot)");
  });

  it("formats money", () => {
    expect(formatMoney(349)).toBe("$349");
    expect(formatMoney(314.1)).toBe("$314.10");
  });

  it("writes a text summary", () => {
    const text = quoteToText(priceSelection({ items: ["driveway", "walkway", "roof"], senior: true }));
    expect(text).toContain("Front concrete only: $149");
    expect(text).toContain("Seniors 65+ discount: -$14.90");
    expect(text).toContain("Total (taxes included): $134.10");
    expect(text).toContain("Needs a quote: Roof soft wash");
  });

  it("maps to quote form services without duplicates", () => {
    expect(formServicesFor({ items: ["driveway", "walkway", "deck", "roof"] })).toEqual([
      "Driveway & concrete",
      "Patio, deck or fence",
      "Roof cleaning",
    ]);
  });

  it("keeps display prices in sync with amounts", () => {
    for (const p of pricing) {
      if (p.amount != null) expect(p.price).toBe(`$${p.amount}`);
      for (const o of p.options ?? []) expect(o.price).toBe(`$${o.amount}`);
    }
  });
});
