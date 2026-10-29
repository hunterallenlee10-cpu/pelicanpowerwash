import { ArrowDown, MessageSquare } from "lucide-react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { business, smsHref } from "@/data/site";
import { storyChapters, type StoryChapter } from "@/data/story";
import { srcSet, story, storyImage, type FrameSet } from "@/lib/story";
import { ScrollStoryDriver, type DriverChapter } from "./ScrollStoryDriver";

/**
 * Hero scroll story, "The Wash". All copy is server-rendered HTML (the H1
 * lives here); the client driver only sets CSS variables while you scroll.
 *
 * Three presentations from one DOM:
 * - motion (default): a sticky stage; each chapter wipes dirty -> clean,
 *   scrubbed by native scroll. Desktop uses video frames on a canvas when
 *   the manifest has them, otherwise the same lane wipe as mobile.
 * - reduced motion / no JS: stacked cards, each with a before/after slider
 *   (STATIC_CSS below).
 */
export function ScrollStory() {
  const frames: Record<string, FrameSet> = {};
  for (const ch of storyChapters) {
    const set = ch.frames ? story.frames[ch.frames] : undefined;
    if (set && set.count > 0) frames[ch.id] = set;
  }
  const mist = storyImage("e2-mist");
  const driverChapters: DriverChapter[] = storyChapters.map((ch) => ({
    id: ch.id,
    start: ch.start,
    end: ch.end,
    meter: ch.meter,
    hud: ch.hud,
    dir: ch.wipe.dir,
    order: ch.wipe.order,
  }));

  return (
    <section id="top" className="story" aria-label="How we clean a house, chapter by chapter">
      <style>{`@media (prefers-reduced-motion: reduce){${STATIC_CSS}}`}</style>
      <noscript>
        <style>{STATIC_CSS}</style>
      </noscript>
      <div className="story-track">
        <div className="story-stage">
          <div className="story-media" aria-hidden>
            {storyChapters.map((ch, i) => (
              <StoryLayer key={ch.id} chapter={ch} index={i} hasFrames={Boolean(frames[ch.id])} />
            ))}
            {mist && !mist.placeholder && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="story-mist" src={mist.sources[mist.sources.length - 1].webp} alt="" loading="lazy" decoding="async" />
            )}
          </div>

          <div className="story-hud" aria-hidden>
            <svg viewBox="0 0 64 64" className="story-ring">
              <circle cx="32" cy="32" r="27" className="story-ring-track" />
              <circle cx="32" cy="32" r="27" className="story-ring-bar" />
            </svg>
            <span className="story-hud-num">
              <span data-hud-num>0</span>
              <span className="story-hud-pct">%</span>
            </span>
            <span className="story-hud-text">
              <span className="story-hud-k">Clean</span>
              <span data-hud-label>{storyChapters[0].hud}</span>
            </span>
          </div>
          <canvas className="story-spray" aria-hidden />

          {storyChapters.map((ch, i) => (
            <StoryArticle key={ch.id} chapter={ch} first={i === 0} />
          ))}
        </div>
      </div>
      <ScrollStoryDriver chapters={driverChapters} frames={frames} />
    </section>
  );
}

function StoryPicture({
  wide,
  tall,
  alt,
  priority,
  className = "story-pic",
}: {
  wide: string;
  tall: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const w = storyImage(wide);
  const t = storyImage(tall);
  if (!w || !t) return null;
  return (
    <picture className={className}>
      <source media="(min-width: 1024px)" type="image/avif" srcSet={srcSet(w, "avif")} sizes="100vw" />
      <source media="(min-width: 1024px)" type="image/webp" srcSet={srcSet(w, "webp")} sizes="100vw" />
      <source type="image/avif" srcSet={srcSet(t, "avif")} sizes="100vw" />
      <source type="image/webp" srcSet={srcSet(t, "webp")} sizes="100vw" />
      <img
        src={t.src}
        alt={alt}
        width={t.width}
        height={t.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}

/** Stair-step outline of the dirt still left after the lane passes. */
function lanePolygon(dir: "up" | "down", order: "ltr" | "rtl") {
  const lanes = 6;
  const s = (k: number) => {
    const slot = order === "ltr" ? k : lanes - 1 - k;
    return `clamp(0, calc(var(--w, 0) * ${lanes} - ${slot}), 1)`;
  };
  const x = (k: number) => `${((k / lanes) * 100).toFixed(3)}%`;
  const pts: string[] = [];
  if (dir === "up") {
    // Dirt stays at the top; each lane clears from the bottom up.
    pts.push("0 0", "100% 0");
    for (let k = lanes - 1; k >= 0; k--) {
      const y = `calc((1 - ${s(k)}) * 100%)`;
      pts.push(`${x(k + 1)} ${y}`, `${x(k)} ${y}`);
    }
  } else {
    // Dirt stays at the bottom; each lane clears from the top down.
    pts.push("0 100%", "100% 100%");
    for (let k = lanes - 1; k >= 0; k--) {
      const y = `calc(${s(k)} * 100%)`;
      pts.push(`${x(k + 1)} ${y}`, `${x(k)} ${y}`);
    }
  }
  return `polygon(${pts.join(", ")})`;
}

function StoryLayer({ chapter, index, hasFrames }: { chapter: StoryChapter; index: number; hasFrames: boolean }) {
  const intro = chapter.id === "intro";
  return (
    <div
      className="story-layer"
      data-layer={chapter.id}
      data-near={index <= 1 ? "" : undefined}
      data-show={index === 0 ? "" : undefined}
      style={{ "--z": index } as React.CSSProperties}
    >
      {!intro && <StoryPicture wide={chapter.clean.wide} tall={chapter.clean.tall} alt="" />}
      <div className="story-dirty" style={intro ? undefined : { clipPath: lanePolygon(chapter.wipe.dir, chapter.wipe.order) }}>
        <StoryPicture wide={chapter.dirty.wide} tall={chapter.dirty.tall} alt="" priority={intro} />
      </div>
      {!intro && <span className="story-edge" />}
      {hasFrames && <canvas className="story-canvas" data-canvas-for={chapter.id} />}
    </div>
  );
}

function StoryArticle({ chapter, first }: { chapter: StoryChapter; first: boolean }) {
  const final = chapter.id === "final";
  const Heading = first ? "h1" : "h2";
  const dirtyImg = storyImage(chapter.dirty.wide);
  const cleanImg = storyImage(chapter.clean.wide);
  const pick = (img: typeof dirtyImg) => img?.sources[img.sources.length - 1]?.webp ?? "";

  return (
    <article
      className="story-ch"
      data-ch={chapter.id}
      data-side={chapter.side}
      data-on={first ? "" : undefined}
      style={{ "--o": first ? 1 : 0 } as React.CSSProperties}
    >
      {/* Only shown in the reduced-motion / no-JS layout. */}
      <div className="story-ch-media">
        {first ? (
          <div className="story-ch-frame">
            <StoryPicture wide={chapter.dirty.wide} tall={chapter.dirty.wide} alt={chapter.alt.dirty} />
          </div>
        ) : (
          <BeforeAfter
            before={{ src: pick(dirtyImg), alt: chapter.alt.dirty }}
            after={{ src: pick(cleanImg), alt: chapter.alt.clean }}
            hint={chapter.title}
            label={`Compare before and after: ${chapter.eyebrow ?? chapter.title}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-video rounded-2xl"
          />
        )}
      </div>

      <div className="story-copy">
        {chapter.eyebrow && <p className="story-eyebrow">{chapter.eyebrow}</p>}
        <Heading className={first ? "story-h1" : "story-h2"}>{chapter.title}</Heading>
        <p className="story-body">{chapter.body}</p>

        {(first || final) && (
          <div className="story-ctas">
            <a href="#instant-price" className="btn btn-primary" data-cta="price">
              Get my price
            </a>
            <a href={smsHref} className="btn story-btn-ghost" data-cta="text">
              <MessageSquare className="h-4 w-4" aria-hidden />
              {first ? `Text ${business.phone.display}` : "Text us"}
            </a>
          </div>
        )}
        {first && (
          <a href="#instant-price" className="story-skip" data-cta="skip">
            Skip the show <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
        )}
        {final && (
          <p className="story-caption">
            Illustrative renders.{" "}
            <a href="#work" className="underline underline-offset-4">
              See before-and-after photos below
            </a>{" "}
            <span aria-hidden>↓</span>
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Stacked-card layout for reduced motion and no-JS visitors. Kept as a string
 * so the same rules can sit in a media query and in a <noscript>.
 */
const STATIC_CSS = `
.story-track{height:auto}
.story-stage{position:relative;top:auto;height:auto;overflow:visible;padding:3rem 0 1rem}
.story-media,.story-hud,.story-spray{display:none}
.story-ch{position:relative;inset:auto;opacity:1;pointer-events:auto;display:grid;gap:1.5rem;align-items:center;max-width:80rem;margin:0 auto;padding:1.5rem 1rem 2.5rem}
.story-ch::before{display:none}
.story-ch-media{display:block}
.story-copy{transform:none;max-width:40rem;padding:0}
@media (min-width:1024px){.story-ch{grid-template-columns:1.1fr 1fr;gap:3rem;padding:2rem 2rem 3rem}}
`;
