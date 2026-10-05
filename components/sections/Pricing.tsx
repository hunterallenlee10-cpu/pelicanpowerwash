import { BadgePercent, CreditCard, ReceiptText } from "lucide-react";
import {
  discounts,
  paymentMethods,
  pricing,
  pricingPolicies,
} from "@/data/site";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div>
          <h2 className="h-section">Straight prices. Taxes included.</h2>
          <p className="lede mt-5">
            Set prices for our most common jobs. Bigger homes and commercial
            work get a free written quote.
          </p>

          <ul className="mt-10 border-b border-line">
            {pricing.map((item) => (
              <li
                key={item.name}
                className={`grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-line py-5 ${
                  item.popular ? "relative -mx-4 rounded-2xl border-transparent bg-accent-soft px-4 sm:-mx-5 sm:px-5" : ""
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-ink">
                    {item.name}
                    {item.popular && (
                      <span className="ml-3 inline-block translate-y-[-2px] rounded-full bg-accent px-2.5 py-0.5 align-middle text-xs font-semibold text-on-accent">
                        Most popular
                      </span>
                    )}
                  </h3>
                  <p className="text-ink-2">{item.detail}</p>
                </div>
                {item.options ? (
                  <dl className="text-right">
                    {item.options.map((option) => (
                      <div key={option.label} className="flex items-baseline justify-end gap-3">
                        <dt className="text-sm text-ink-2">{option.label}</dt>
                        <dd className="font-display text-xl text-ink">{option.price}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p
                    className={
                      item.price.startsWith("$")
                        ? "font-display text-2xl text-ink"
                        : "font-semibold text-accent-text"
                    }
                  >
                    {item.price.startsWith("$") ? (
                      item.price
                    ) : (
                      <a href="#quote-form" className="underline underline-offset-4">
                        {item.price}
                      </a>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <aside className="self-start rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:mt-24">
          <div className="flex gap-4">
            <BadgePercent className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden />
            <div>
              <h3 className="font-bold text-ink">Discounts</h3>
              <ul className="mt-2 space-y-1 text-ink-2">
                {discounts.map((d) => (
                  <li key={d.label}>
                    <span className="font-semibold text-ink">{d.value}</span> for {d.label.toLowerCase()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 flex gap-4 border-t border-line pt-7">
            <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden />
            <div>
              <h3 className="font-bold text-ink">Ways to pay</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <li
                    key={method}
                    className="rounded-full bg-surface-2 px-3 py-1 text-sm font-medium text-ink"
                  >
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 flex gap-4 border-t border-line pt-7">
            <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden />
            <div>
              <h3 className="font-bold text-ink">The fine print</h3>
              <ul className="mt-2 space-y-1 text-ink-2">
                {pricingPolicies.map((policy) => (
                  <li key={policy}>{policy}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
