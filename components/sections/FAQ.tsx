import { Plus } from "lucide-react";
import { business, faqs, smsHref } from "@/data/site";

export function FAQ() {
  return (
    <section id="faq" className="border-t border-line bg-surface py-20 md:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="h-section">Questions we get a lot.</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-2">
            Something else on your mind?{" "}
            <a href={smsHref} className="font-semibold text-accent-text underline underline-offset-4">
              Text {business.phone.display}
            </a>
            .
          </p>
        </div>

        <div className="border-b border-line">
          {faqs.map((faq) => (
            <details key={faq.q} className="group border-t border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {faq.q}
                <Plus
                  className="h-5 w-5 shrink-0 text-accent-text transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="max-w-[62ch] pb-6 leading-relaxed text-ink-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
