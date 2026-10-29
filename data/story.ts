/**
 * Copy and timing for the two scroll stories ("watch us clean it").
 *
 * Story 1 (the hero) is the driveway; story 2 is the roof, the siding and
 * the reveal. The "Try the wand" game sits between them.
 *
 * Image keys match the files in assets-inbox/ (see data/story-manifest.json).
 * `weight` sets how much scroll a chapter gets; `beats` are the lines of copy
 * that show in turn while a chapter plays, timed as fractions of the chapter.
 * The HUD's curb appeal score climbs from `score[0]` to `score[1]`.
 */
export type StoryBeat = {
  from: number;
  to: number;
  side: "left" | "right";
  eyebrow?: string;
  title: string;
  body: string;
  /** Buttons under the copy. */
  ctas?: "hero" | "final" | { label: string; href: string };
};

export type StoryChapter = {
  id: string;
  weight: number;
  /** Desktop (16:9) and mobile (9:16) keyframes. */
  dirty: { wide: string; tall: string };
  clean: { wide: string; tall: string };
  /** Frame set key in the manifest (desktop scrub), if any. */
  frames?: string;
  /** Lane wipe on phones: dirt clears upward or downward, lanes left-to-right or right-to-left. */
  wipe: { dir: "up" | "down"; order: "ltr" | "rtl" };
  /** No wipe: the chapter is a still (the hero's "before"). */
  still?: boolean;
  hud: { score: [number, number]; step: string };
  alt: { dirty: string; clean: string };
  beats: StoryBeat[];
};

export type Story = {
  id: string;
  label: string;
  chapters: StoryChapter[];
};

const house = {
  dirty: { wide: "k4-final-dirty-16x9", tall: "k4-final-dirty-9x16" },
  clean: { wide: "k0-final-clean-16x9", tall: "k0-final-clean-9x16" },
};

export const driveStory: Story = {
  id: "top",
  label: "How we clean a driveway",
  chapters: [
    {
      id: "intro",
      weight: 0.7,
      ...house,
      clean: house.dirty,
      still: true,
      wipe: { dir: "up", order: "ltr" },
      hud: { score: [38, 38], step: "1/5 · Before" },
      alt: {
        dirty:
          "Illustration of a two-story farmhouse with green siding, a streaked roof and a stained driveway, a pressure-washing trailer at the curb",
        clean: "",
      },
      beats: [
        {
          from: 0,
          to: 0.75,
          side: "left",
          eyebrow: "St. Mary's · Calvert · Charles",
          title: "Pressure washing for Southern Maryland.",
          body: "This house hasn't been washed in years. Keep scrolling and watch the driveway, the roof and the siding come clean. Then grab the wand and try it yourself.",
          ctas: "hero",
        },
      ],
    },
    {
      id: "driveway",
      weight: 2.2,
      dirty: { wide: "k1-driveway-dirty-16x9", tall: "k1-driveway-dirty-9x16" },
      clean: { wide: "k1-driveway-clean-16x9", tall: "k1-driveway-clean-9x16" },
      frames: "driveway",
      wipe: { dir: "up", order: "ltr" },
      hud: { score: [38, 68], step: "2/5 · Driveway" },
      alt: {
        dirty: "Illustration of a concrete driveway covered in mildew, tire tracks, oil and rust stains",
        clean: "Illustration of the same driveway clean and even",
      },
      beats: [
        {
          from: 0,
          to: 0.32,
          side: "right",
          eyebrow: "Step 1 · Pre-treat",
          title: "Pre-treat first. Pressure second.",
          body: "Mildew and algae get a cleaner that kills them at the root, so the rinse finishes the job instead of fighting it.",
        },
        {
          from: 0.34,
          to: 0.66,
          side: "left",
          eyebrow: "Step 2 · Surface cleaner",
          title: "Even lanes. Zero stripes.",
          body: "A rotary surface cleaner holds the spray at one height, so every pass comes out the same. Lanes overlap and the edges get finished by hand.",
        },
        {
          from: 0.7,
          to: 1,
          side: "right",
          eyebrow: "Driveway · Done",
          title: "Fresh-pour gray again.",
          body: "No wand marks, no etching. Just the driveway you remember.",
          ctas: { label: "Price my driveway", href: "#instant-price" },
        },
      ],
    },
  ],
};

export const houseStory: Story = {
  id: "house-and-roof",
  label: "How we clean a roof and siding",
  chapters: [
    {
      id: "roof",
      weight: 2,
      dirty: { wide: "k2-roof-dirty-16x9", tall: "k2-roof-dirty-9x16" },
      clean: { wide: "k2-roof-clean-16x9", tall: "k2-roof-clean-9x16" },
      frames: "roof",
      wipe: { dir: "down", order: "ltr" },
      hud: { score: [68, 80], step: "3/5 · Roof" },
      alt: {
        dirty: "Illustration of an asphalt shingle roof with black algae streaks and moss",
        clean: "Illustration of the same roof clean and uniform",
      },
      beats: [
        {
          from: 0,
          to: 0.46,
          side: "left",
          eyebrow: "Roof · Never pressure washed",
          title: "That black on your roof is alive.",
          body: "Those streaks are algae living on your shingles. We kill it with a low-pressure soft wash. A pressure wand never touches a roof.",
        },
        {
          from: 0.54,
          to: 1,
          side: "right",
          eyebrow: "Roof · Done",
          title: "Algae gone. Granules stay.",
          body: "The algae dies on contact and the last streaks rinse away with the next rain. Nothing gets blasted off your shingles.",
        },
      ],
    },
    {
      id: "siding",
      weight: 2.2,
      dirty: { wide: "k3-siding-dirty-16x9", tall: "k3-siding-dirty-9x16" },
      clean: { wide: "k3-siding-clean-16x9", tall: "k3-siding-clean-9x16" },
      frames: "siding",
      wipe: { dir: "down", order: "ltr" },
      hud: { score: [80, 90], step: "4/5 · Siding" },
      alt: {
        dirty: "Illustration of vinyl siding coated in green algae",
        clean: "Illustration of the same siding clean",
      },
      beats: [
        {
          from: 0,
          to: 0.32,
          side: "left",
          eyebrow: "Siding",
          title: "North wall gone green?",
          body: "That's algae and mildew from Southern Maryland humidity. Scrubbing won't kill it. The right soft-wash mix will.",
        },
        {
          from: 0.34,
          to: 0.66,
          side: "right",
          eyebrow: "Soft wash",
          title: "Gentle on vinyl. Tough on green.",
          body: "Pre-soak, then a low-pressure rinse from the top down. No water forced up behind your siding.",
        },
        {
          from: 0.7,
          to: 1,
          side: "left",
          eyebrow: "Siding · Done",
          title: "Back to the color you picked.",
          body: "Bright vinyl, clean trim, plants rinsed and untouched.",
        },
      ],
    },
    {
      id: "final",
      weight: 1.6,
      ...house,
      frames: "final",
      wipe: { dir: "up", order: "rtl" },
      hud: { score: [90, 98], step: "5/5 · All done" },
      alt: {
        dirty: "Illustration of the house before cleaning",
        clean: "Illustration of the same house clean at golden hour",
      },
      beats: [
        {
          from: 0.12,
          to: 1,
          side: "left",
          eyebrow: "5/5 · All done",
          title: "Looks like move-in day.",
          body: "Driveway, roof and siding in one visit. Missed a spot? We come back and fix it free.",
          ctas: "final",
        },
      ],
    },
  ],
};
