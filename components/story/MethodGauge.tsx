import { surfaces } from "@/data/surfaces";
import { srcSet, storyImage } from "@/lib/story";
import { MethodGaugeClient, type TileImage } from "./MethodGaugeClient";

/**
 * "The right method for every surface." Pick a surface, the gauge swings to
 * the pressure we use on it. Heading and copy are server-rendered; only the
 * chips, gauge and card are interactive.
 */
export function MethodGauge() {
  const tiles: Record<string, TileImage | null> = {};
  for (const s of surfaces) {
    const img = storyImage(s.tile);
    tiles[s.id] =
      img && !img.placeholder
        ? {
            avif: srcSet(img, "avif"),
            webp: srcSet(img, "webp"),
            src: img.src,
            width: img.width,
            height: img.height,
          }
        : null;
  }

  return (
    <section id="methods" className="border-y border-line bg-surface-2/60 py-20 md:py-28">
      <div className="container-page">
        <MethodGaugeClient
          surfaces={surfaces}
          tiles={tiles}
          intro={
            <>
              <h2 className="h-section max-w-3xl">The right method for every surface.</h2>
              <p className="lede mt-5">
                Soft wash for siding, roofs and wood. Pressure for concrete. You get a
                clean result without stripped paint or etched driveways.
              </p>
            </>
          }
        />
      </div>
    </section>
  );
}
