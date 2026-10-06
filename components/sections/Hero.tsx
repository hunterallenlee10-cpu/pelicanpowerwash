import { MapPin, Phone } from "lucide-react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { business, heroPhoto, heroPhotos, phoneHref } from "@/data/site";

export function Hero() {
  // The slider takes over once a real before and after pair is filled in.
  const hasPair = Boolean(heroPhotos.before.src && heroPhotos.after.src);

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
          {hasPair || !heroPhoto.src ? (
            <BeforeAfter
              before={heroPhotos.before}
              after={heroPhotos.after}
              hint="your best house wash, same angle both times"
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="aspect-[4/3] rounded-2xl shadow-[0_24px_60px_-24px_rgb(14_36_64/0.35)]"
            />
          ) : (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgb(14_36_64/0.35)]">
              <PhotoSlot
                photo={heroPhoto}
                hint="Your best finished house"
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
              <p className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-[0.8rem] font-semibold whitespace-nowrap text-white backdrop-blur-sm sm:bottom-4 sm:left-4 sm:gap-2 sm:px-3.5 sm:text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-[#9fd9e2]" aria-hidden />
                <span>
                  <span className="hidden sm:inline">Serving </span>St.&nbsp;Mary's,
                  Calvert and Charles counties
                </span>
              </p>
            </div>
          )}
          {hasPair && heroPhotos.caption && (
            <figcaption className="mt-3 text-sm text-ink-2">
              {heroPhotos.caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
