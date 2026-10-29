import { gallery } from "@/data/site";
import { storyImage } from "@/lib/story";
import { WorkClient, type WorkItem } from "./WorkClient";

/**
 * Before and after. The first pair is the story house (an AI render, so it
 * is labelled as an illustration); the rest are the stand-in example photos
 * from data/site.ts until Pelican's own job photos are in.
 */
export function Work() {
  const dirty = storyImage("k4-final-dirty-16x9");
  const clean = storyImage("k0-final-clean-16x9");
  const items: WorkItem[] = [];
  if (dirty && clean && !dirty.placeholder && !clean.placeholder) {
    items.push({
      title: "Whole house",
      before: {
        src: dirty.sources[0].webp,
        alt: "Illustration of a farmhouse with green siding, a streaked roof and a stained driveway",
      },
      after: {
        src: clean.sources[0].webp,
        alt: "Illustration of the same farmhouse after one visit: clean siding, roof and driveway",
      },
      note: "Illustration of one visit. Pelican job photos coming soon.",
    });
  }
  for (const g of gallery) {
    items.push({ ...g, note: "Example before-and-after photo. Pelican job photos coming soon." });
  }
  return <WorkClient items={items} />;
}
