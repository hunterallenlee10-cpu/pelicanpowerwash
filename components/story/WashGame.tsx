import { storyImage } from "@/lib/story";
import { WashGameLoader } from "./WashGameLoader";

/** Real texture URL, or null while the asset is still a placeholder. */
function texture(key: string): string | null {
  const img = storyImage(key);
  return img && !img.placeholder ? img.src : null;
}

/**
 * "Wash this driveway" game. Copy is server-rendered; the canvas loads
 * client-side only when the section nears the viewport.
 */
export function WashGame() {
  const textures = {
    clean: texture("g1-driveway-topdown-clean"),
    dirty: texture("g2-driveway-topdown-dirty"),
    grime: texture("g3-grime-map"),
  };

  return (
    <section id="try-the-wand" aria-labelledby="try-the-wand-title" className="border-y border-line bg-canvas py-20 md:py-28">
      <div className="container-page">
        <p className="eyebrow">Try the wand</p>
        <h2 id="try-the-wand-title" className="h-section mt-4 max-w-3xl">
          Wash this driveway<span className="text-accent">.</span>
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-2">
          Press and hold to spray. Use the 20-inch surface cleaner for even lanes, or grab the 25° wand and
          see how hard it is to keep it even.
        </p>
        <a
          href="#instant-price"
          className="mt-3 inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4"
        >
          Not a gamer? Skip to pricing ↓
        </a>

        <p id="wash-game-desc" className="sr-only">
          Interactive illustration of a dirty concrete driveway seen from above, with black mildew, weeds
          in the joints, an oil drip, tire tracks and a rust stain. Drag across it to wash it with the
          selected tool. Keyboard users can choose a tool with the arrow keys and press Watch a pro do it
          to see the surface cleaner wash it lane by lane.
        </p>

        <div className="mt-8">
          <WashGameLoader textures={textures} />
        </div>

        <p className="mt-4 text-sm text-ink-2">An illustration, not a real job.</p>
      </div>
    </section>
  );
}
