import { InstantPriceClient } from "./InstantPriceClient";

/**
 * "Price your place in 20 seconds." Chips on the left, a live estimate card
 * on the right. Every number comes from data/site.ts via lib/pricing.ts.
 */
export function InstantPrice() {
  return (
    <section id="instant-price" className="border-y border-line bg-surface/40 py-20 md:py-28">
      <div className="container-page">
        <InstantPriceClient
          intro={
            <>
              <p className="eyebrow">Instant quote</p>
              <h2 className="h-section mt-4 max-w-xl">Price your place in 20 seconds.</h2>
              <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ink-2">
                Tap what you want cleaned. Taxes included. Real prices, no "starting at" games.
              </p>
            </>
          }
        />
      </div>
    </section>
  );
}
