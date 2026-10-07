import { Check, Star } from "lucide-react";
import { business, guarantees } from "@/data/site";

/** Plain facts directly under the hero: rating (when set) and guarantees. */
export function TrustBar() {
  const rating = business.googleRating;

  return (
    <section aria-label="Why customers choose us" className="border-y border-line bg-surface">
      <div className="container-page flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:gap-10">
        {rating && (
          <a
            href={business.reviewsUrl || "#testimonials"}
            className="flex shrink-0 items-center gap-3"
          >
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#f5a524] text-[#f5a524]" />
              ))}
            </span>
            <span className="font-semibold text-ink">
              {rating.rating.toFixed(1)} on Google
              <span className="font-normal text-ink-2"> from {rating.count} reviews</span>
            </span>
          </a>
        )}

        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-y-2">
          {guarantees.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[0.95rem] font-medium text-ink">
              <Check className="h-4 w-4 shrink-0 text-accent-text" strokeWidth={2.5} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
