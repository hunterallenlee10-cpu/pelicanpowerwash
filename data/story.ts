/**
 * Copy and timing for the hero scroll story ("The Wash"). Image keys match
 * the files in assets-inbox/ (see data/story-manifest.json).
 *
 * `start`/`end` are fractions of the whole story's scroll distance.
 * `meter` is the "% clean" the HUD counts to by the end of the chapter.
 */
export type StoryChapter = {
  id: "intro" | "driveway" | "roof" | "siding" | "final";
  start: number;
  end: number;
  eyebrow?: string;
  title: string;
  body: string;
  /** HUD label while this chapter is on screen. */
  hud: string;
  meter: number;
  side: "left" | "right";
  /** Desktop (16:9) and mobile (9:16) keyframes. */
  dirty: { wide: string; tall: string };
  clean: { wide: string; tall: string };
  /** Frame set key in the manifest (desktop scrub), if any. */
  frames?: string;
  /** Lane wipe direction: dirty clears upward or downward, lanes left-to-right or right-to-left. */
  wipe: { dir: "up" | "down"; order: "ltr" | "rtl" };
  alt: { dirty: string; clean: string };
};

export const storyChapters: StoryChapter[] = [
  {
    id: "intro",
    start: 0,
    end: 0.08,
    title: "Pressure washing for Southern Maryland.",
    body: "House washes, driveways, roofs and decks across St. Mary's, Calvert and Charles. Free written quote, reply within 24 hours.",
    hud: "Before · nothing cleaned yet",
    meter: 0,
    side: "left",
    dirty: { wide: "k4-final-dirty-16x9", tall: "k4-final-dirty-9x16" },
    clean: { wide: "k4-final-dirty-16x9", tall: "k4-final-dirty-9x16" },
    wipe: { dir: "up", order: "ltr" },
    alt: {
      dirty: "Illustration of a two-story colonial house with mildewed siding, a streaked roof and a stained driveway",
      clean: "",
    },
  },
  {
    id: "driveway",
    start: 0.08,
    end: 0.32,
    eyebrow: "01 · Driveway",
    title: "Concrete, reset.",
    body: "Rotary surface cleaner and a full rinse. Even finish edge to edge. No wand marks, no etching.",
    hud: "Driveway · surface cleaner",
    meter: 35,
    side: "left",
    dirty: { wide: "k1-driveway-dirty-16x9", tall: "k1-driveway-dirty-9x16" },
    clean: { wide: "k1-driveway-clean-16x9", tall: "k1-driveway-clean-9x16" },
    frames: "driveway",
    wipe: { dir: "up", order: "ltr" },
    alt: {
      dirty: "Illustration of a concrete driveway covered in mildew and tire tracks",
      clean: "Illustration of the same driveway clean and even",
    },
  },
  {
    id: "roof",
    start: 0.32,
    end: 0.56,
    eyebrow: "02 · Roof",
    title: "Those black streaks are alive.",
    body: "That's algae. We kill it with a soft wash. No high pressure on your shingles, ever.",
    hud: "Roof · soft wash",
    meter: 62,
    side: "right",
    dirty: { wide: "k2-roof-dirty-16x9", tall: "k2-roof-dirty-9x16" },
    clean: { wide: "k2-roof-clean-16x9", tall: "k2-roof-clean-9x16" },
    frames: "roof",
    wipe: { dir: "down", order: "ltr" },
    alt: {
      dirty: "Illustration of an asphalt shingle roof with black algae streaks",
      clean: "Illustration of the same roof clean and uniform",
    },
  },
  {
    id: "siding",
    start: 0.56,
    end: 0.8,
    eyebrow: "03 · Siding",
    title: "Green comes off. Paint stays on.",
    body: "Soft-wash chemistry does the work; a low-pressure rinse carries it away.",
    hud: "Siding · soft wash",
    meter: 86,
    side: "left",
    dirty: { wide: "k3-siding-dirty-16x9", tall: "k3-siding-dirty-9x16" },
    clean: { wide: "k3-siding-clean-16x9", tall: "k3-siding-clean-9x16" },
    frames: "siding",
    wipe: { dir: "down", order: "rtl" },
    alt: {
      dirty: "Illustration of vinyl siding coated in green algae",
      clean: "Illustration of the same siding clean",
    },
  },
  {
    id: "final",
    start: 0.8,
    end: 1,
    title: "Like move-in day.",
    body: "Driveway, roof and siding in one visit. Free touch-ups if we missed a spot.",
    hud: "Done · walkthrough",
    meter: 100,
    side: "left",
    dirty: { wide: "k4-final-dirty-16x9", tall: "k4-final-dirty-9x16" },
    clean: { wide: "k0-final-clean-16x9", tall: "k0-final-clean-9x16" },
    frames: "final",
    wipe: { dir: "up", order: "rtl" },
    alt: {
      dirty: "Illustration of the house before cleaning",
      clean: "Illustration of the same house clean at golden hour",
    },
  },
];
