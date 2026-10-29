"use client";

import { useRef, useState } from "react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { business, gallery } from "@/data/site";

/**
 * Before and after gallery: one large slider with a tab per pair.
 *
 * Honesty note: the pairs in data/site.ts are stand-ins (Creative Commons
 * photos from other crews and AI-generated images, see public/photos/README.md),
 * so the copy calls them examples, not Pelican jobs. Swap the note once real
 * job photos are in. AI story renders never go in this gallery.
 */
export function Work() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const instagram = business.socials.instagram || business.socials.facebook;
  const item = gallery[active];

  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    const last = gallery.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="work" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <h2 className="h-section max-w-3xl">Drag the slider. See the difference.</h2>
        <p className="lede mt-5">
          What a proper wash does for siding, concrete, decks and fences.
        </p>

        <div
          role="tablist"
          aria-label="Before and after examples"
          className="mt-10 flex gap-2 overflow-x-auto pb-1"
        >
          {gallery.map((pair, index) => {
            const selected = index === active;
            return (
              <button
                key={pair.title}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`work-tab-${index}`}
                aria-selected={selected}
                aria-controls="work-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => onTabKey(event, index)}
                className={`min-h-12 shrink-0 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${
                  selected
                    ? "bg-ink text-canvas"
                    : "border border-line bg-surface text-ink-2 hover:text-ink"
                }`}
              >
                {pair.title}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="work-panel"
          aria-labelledby={`work-tab-${active}`}
          className="-mx-4 mt-6 sm:mx-0"
        >
          <BeforeAfter
            key={item.title}
            before={item.before}
            after={item.after}
            hint={item.title.toLowerCase()}
            label={`${item.title}: compare before and after`}
            nudge={active === 0}
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="aspect-[3/2] sm:rounded-2xl md:aspect-[16/9]"
          />
          <p className="mt-4 px-4 font-semibold text-ink sm:px-0">
            {item.title}
            {item.location && (
              <span className="font-normal text-ink-2"> in {item.location}</span>
            )}
          </p>
          <p className="mt-1 px-4 text-sm text-ink-2 sm:px-0">
            Example before-and-after photos. Pelican job photos coming soon.
          </p>
        </div>

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-12"
          >
            See more jobs on social media
          </a>
        )}
      </div>
    </section>
  );
}
