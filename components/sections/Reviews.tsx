import { Quote } from "lucide-react";
import {
  SHOW_CONTENT_SLOTS,
  business,
  reviews,
  showReviewsSection,
} from "@/data/site";

export function Reviews() {
  if (!showReviewsSection) return null;

  const hasReviews = reviews.length > 0;

  return (
    <section id="testimonials" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <h2 className="h-section max-w-3xl">What neighbors say.</h2>

        {hasReviews ? (
          <ul className="mt-12 columns-1 gap-6 md:columns-2 lg:columns-3">
            {reviews.map((review) => (
              <li
                key={`${review.name}-${review.quote.slice(0, 12)}`}
                className="mb-6 break-inside-avoid rounded-2xl border border-line bg-canvas p-7"
              >
                <Quote className="h-6 w-6 text-accent-text" aria-hidden />
                <blockquote className="mt-4 text-lg leading-relaxed text-ink">
                  “{review.quote}”
                </blockquote>
                <p className="mt-5 text-sm">
                  <span className="font-semibold text-ink">{review.name}</span>
                  <span className="text-ink-2">
                    {review.town && `, ${review.town}`}
                    {review.service && `. ${review.service}`}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          SHOW_CONTENT_SLOTS && (
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {["House wash customer", "Driveway or patio customer", "Commercial customer"].map(
                (who) => (
                  <li
                    key={who}
                    className="rounded-2xl border border-dashed border-line p-7 text-ink-2"
                  >
                    <Quote className="h-6 w-6 opacity-60" aria-hidden />
                    <p className="mt-4 font-semibold text-ink">Real review slot</p>
                    <p className="mt-2 text-sm leading-relaxed">
                      Paste a review from a {who.toLowerCase()}, word for word, with
                      their first name, last initial and town. Add it to reviews
                      in data/site.ts.
                    </p>
                  </li>
                )
              )}
            </ul>
          )
        )}

        {(business.reviewsUrl || business.leaveReviewUrl) && (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {business.reviewsUrl && (
              <a
                href={business.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Read all reviews on Google
              </a>
            )}
            {business.leaveReviewUrl && (
              <a
                href={business.leaveReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Leave us a review
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
