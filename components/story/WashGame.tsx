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
    <section id="try-the-wand" aria-labelledby="try-the-wand-title" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <h2 id="try-the-wand-title" className="h-section max-w-3xl">
          Think it's easy? Wash this driveway.
        </h2>
        <p className="lede mt-5">
          Pick a tip and drag across the slab. The surface cleaner is what we use.
          Try the red 0° tip to see why we never put it on concrete.
        </p>
        <a
          href="#instant-price"
          className="mt-4 inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4"
        >
          Not a gamer? Skip to pricing ↓
        </a>

        <p id="wash-game-desc" className="sr-only">
          Interactive illustration of a dirty concrete driveway seen from above.
          Drag across it to wash it with the selected nozzle tip. Keyboard users
          can choose a tip with the arrow keys and press the Auto-wash demo
          button to watch the surface cleaner clean it lane by lane.
        </p>

        <div className="mt-8">
          <WashGameLoader textures={textures} />
        </div>

        <p className="mt-4 text-sm text-ink-2">
          An illustration, not a real job. Etching here is pretend; on your
          driveway it's permanent.
        </p>
      </div>
    </section>
  );
}
