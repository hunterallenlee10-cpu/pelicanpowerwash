import { hotspots } from "@/data/hotspots";
import { pricingPolicies } from "@/data/site";
import { srcSet, storyImage } from "@/lib/story";
import { HouseSvg } from "./HouseSvg";
import { InstantPriceClient, type HousePicture } from "./InstantPriceClient";

function toPicture(key: string): HousePicture | null {
  const img = storyImage(key);
  if (!img || img.placeholder) return null;
  return { avif: srcSet(img, "avif"), webp: srcSet(img, "webp"), src: img.src, width: img.width, height: img.height };
}

/**
 * "Price your place in 20 seconds." Sits right after the hero. Uses the
 * generated house render when it exists, otherwise the built-in SVG house.
 */
export function InstantPrice() {
  const picture = toPicture("h1-house-iso");
  const dirty = picture ? toPicture("h1-house-iso-dirty") : null;

  return (
    <section id="instant-price" className="border-b border-line bg-surface-2/60 py-16 md:py-24">
      <div className="container-page">
        <h2 className="h-section max-w-3xl">Price your place in 20 seconds.</h2>
        <p className="lede mt-4">
          Tap what you want cleaned. Taxes included. Real prices, no "starting at" games.
        </p>
        <InstantPriceClient
          picture={picture}
          dirtyPicture={dirty}
          hotspots={picture ? hotspots.image : hotspots.fallback}
          policies={pricingPolicies}
        >
          {picture ? null : <HouseSvg />}
        </InstantPriceClient>
      </div>
    </section>
  );
}
