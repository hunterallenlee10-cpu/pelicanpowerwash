import { Phone } from "lucide-react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { business, heroPhotos, phoneHref } from "@/data/site";

export function Hero() {
  return (
    <section id="top" className="overflow-hidden">
      <div className="container-page grid items-center gap-10 pt-10 pb-14 md:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="rise max-w-[36rem]">
          <h1 className="font-display text-[2.6rem] leading-[1.02] text-balance text-ink sm:text-6xl lg:text-[3.9rem]">
            Pressure washing for Southern Maryland.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty text-ink-2 sm:text-xl">
            House washes, driveways, decks and storefronts in St.&nbsp;Mary's,
            Calvert and Charles counties. Free quotes, replies within{" "}
            {business.responseTime}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#quote-form" className="btn btn-primary">
              Get a free quote
            </a>
            <a href={phoneHref} className="btn btn-secondary">
              <Phone className="h-4 w-4" aria-hidden />
              Call or text {business.phone.display}
            </a>
          </div>
        </div>

        <figure className="rise [animation-delay:120ms]">
          <BeforeAfter
            before={heroPhotos.before}
            after={heroPhotos.after}
            hint="your best house wash, same angle both times"
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="aspect-[4/3] rounded-2xl shadow-[0_24px_60px_-24px_rgb(14_36_64/0.35)]"
          />
          {heroPhotos.caption && (
            <figcaption className="mt-3 text-sm text-ink-2">
              {heroPhotos.caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
