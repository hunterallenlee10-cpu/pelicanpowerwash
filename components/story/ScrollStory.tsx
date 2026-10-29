import { ArrowDown, MessageSquare } from "lucide-react";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { business, smsHref } from "@/data/site";
import type { Story, StoryBeat, StoryChapter } from "@/data/story";
import { srcSet, story as manifest, storyImage, type FrameSet } from "@/lib/story";
import { ScrollStoryDriver, type DriverChapter } from "./ScrollStoryDriver";

/** Scroll distance per unit of chapter weight. */
const VH_PER_WEIGHT = { phone: 70, desktop: 95 };

/**
 * One scroll story: a full-screen sticky stage that cleans each chapter from
 * dirty to clean as you scroll. All copy is server-rendered HTML; the client
 * driver only sets CSS variables. Native scroll, no hijacking.
 *
 * - Desktop scrubs video frames on a canvas when the manifest has them,
 *   otherwise wipes between the stills.
 * - Phones use a CSS lane wipe between 9:16 stills.
 * - Reduced motion / no JS: stacked cards with before/after sliders.
 */
/** Chapter start/end as fractions of the story, from their weights. */
function timeChapters(chapters: StoryChapter[]) {
  const total = chapters.reduce((s, c) => s + c.weight, 0);
  const ends = chapters.map((_, i) => chapters.slice(0, i + 1).reduce((s, c) => s + c.weight, 0) / total);
  return { total, timed: chapters.map((c, i) => ({ ...c, start: i ? ends[i - 1] : 0, end: ends[i] })) };
}

export function ScrollStory({ story, heading }: { story: Story; heading: "h1" | "h2" }) {
  const { total, timed } = timeChapters(story.chapters);

  const frames: Record<string, FrameSet> = {};
  for (const ch of story.chapters) {
    const set = ch.frames ? manifest.frames[ch.frames] : undefined;
    if (set && set.count > 0) frames[ch.id] = set;
  }

  const driverChapters: DriverChapter[] = timed.map((c) => ({
    id: c.id,
    start: c.start,
    end: c.end,
    still: Boolean(c.still),
    score: c.hud.score,
    step: c.hud.step,
    dir: c.wipe.dir,
    order: c.wipe.order,
    beats: c.beats.map((b) => [b.from, b.to] as [number, number]),
  }));

  const first = timed[0];

  return (
    <section
      id={story.id}
      className="story"
      aria-label={story.label}
      style={
        {
          "--story-h-phone": `${Math.round(total * VH_PER_WEIGHT.phone + 100)}svh`,
          "--story-h-desk": `${Math.round(total * VH_PER_WEIGHT.desktop + 100)}vh`,
        } as React.CSSProperties
      }
    >
      <style>{`@media (prefers-reduced-motion: reduce){${STATIC_CSS}}`}</style>
      <noscript>
        <style>{STATIC_CSS}</style>
      </noscript>
      <div className="story-track">
        <div className="story-stage">
          <div className="story-media" aria-hidden>
            {timed.map((ch, i) => (
              <StoryLayer
                key={ch.id}
                chapter={ch}
                index={i}
                hasFrames={Boolean(frames[ch.id])}
                eager={i === 0 && heading === "h1"}
              />
            ))}
          </div>
          <div className="story-shade" aria-hidden />

          <div className="story-hud" aria-hidden>
            <svg viewBox="0 0 64 64" className="story-ring">
              <circle cx="32" cy="32" r="27" className="story-ring-track" />
              <circle cx="32" cy="32" r="27" className="story-ring-bar" />
            </svg>
            <span className="story-hud-text">
              <span className="story-hud-k">Curb appeal</span>
              <span className="story-hud-num">
                <span data-hud-num>{first.hud.score[0]}</span>
                <span className="story-hud-of">/100</span>
              </span>
              <span className="story-hud-step" data-hud-step>
                {first.hud.step}
              </span>
            </span>
          </div>
          <canvas className="story-spray" aria-hidden />

          {timed.map((ch, ci) => (
            <div key={ch.id} className="story-chapter" data-chapter={ch.id}>
              {/* Only shown in the reduced-motion / no-JS layout. */}
              <StaticMedia chapter={ch} />
              {ch.beats.map((beat, bi) => {
                const visibleAtLoad = ci === 0 && bi === 0;
                const Heading = heading === "h1" && visibleAtLoad ? "h1" : "h2";
                return (
                  <StoryArticle
                    key={bi}
                    beat={beat}
                    chapterId={ch.id}
                    index={bi}
                    Heading={Heading}
                    hero={heading === "h1" && visibleAtLoad}
                    visible={visibleAtLoad}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <ScrollStoryDriver sectionId={story.id} chapters={driverChapters} frames={frames} />
    </section>
  );
}

function StoryPicture({
  wide,
  tall,
  alt,
  eager,
  className = "story-pic",
}: {
  wide: string;
  tall: string;
  alt: string;
  eager?: boolean;
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
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
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
    pts.push("0 0", "100% 0");
    for (let k = lanes - 1; k >= 0; k--) {
      const y = `calc((1 - ${s(k)}) * 100%)`;
      pts.push(`${x(k + 1)} ${y}`, `${x(k)} ${y}`);
    }
  } else {
    pts.push("0 100%", "100% 100%");
    for (let k = lanes - 1; k >= 0; k--) {
      const y = `calc(${s(k)} * 100%)`;
      pts.push(`${x(k + 1)} ${y}`, `${x(k)} ${y}`);
    }
  }
  return `polygon(${pts.join(", ")})`;
}

function StoryLayer({
  chapter,
  index,
  hasFrames,
  eager,
}: {
  chapter: StoryChapter;
  index: number;
  hasFrames: boolean;
  eager: boolean;
}) {
  return (
    <div
      className="story-layer"
      data-layer={chapter.id}
      data-near={index <= 1 ? "" : undefined}
      data-show={index === 0 ? "" : undefined}
      style={{ "--z": index } as React.CSSProperties}
    >
      {!chapter.still && <StoryPicture wide={chapter.clean.wide} tall={chapter.clean.tall} alt="" />}
      <div
        className="story-dirty"
        style={chapter.still ? undefined : { clipPath: lanePolygon(chapter.wipe.dir, chapter.wipe.order) }}
      >
        <StoryPicture wide={chapter.dirty.wide} tall={chapter.dirty.tall} alt="" eager={eager} />
      </div>
      {!chapter.still && <span className="story-edge" />}
      {hasFrames && <canvas className="story-canvas" data-canvas-for={chapter.id} />}
    </div>
  );
}

function StaticMedia({ chapter }: { chapter: StoryChapter }) {
  const dirty = storyImage(chapter.dirty.wide);
  const clean = storyImage(chapter.clean.wide);
  const pick = (img: typeof dirty) => img?.sources[img.sources.length - 1]?.webp ?? "";
  return (
    <div className="story-ch-media">
      {chapter.still ? (
        <div className="story-ch-frame">
          <StoryPicture wide={chapter.dirty.wide} tall={chapter.dirty.wide} alt={chapter.alt.dirty} />
        </div>
      ) : (
        <BeforeAfter
          before={{ src: pick(dirty), alt: chapter.alt.dirty }}
          after={{ src: pick(clean), alt: chapter.alt.clean }}
          hint={chapter.beats[0]?.title ?? chapter.id}
          label={`Compare before and after: ${chapter.hud.step}`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-video rounded-2xl"
        />
      )}
    </div>
  );
}

function StoryArticle({
  beat,
  chapterId,
  index,
  Heading,
  hero,
  visible,
}: {
  beat: StoryBeat;
  chapterId: string;
  index: number;
  Heading: "h1" | "h2";
  hero: boolean;
  visible: boolean;
}) {
  const ctas = beat.ctas;
  return (
    <article
      className="story-ch"
      data-ch={chapterId}
      data-beat={index}
      data-side={beat.side}
      data-hero={hero ? "" : undefined}
      data-on={visible ? "" : undefined}
      style={{ "--o": visible ? 1 : 0 } as React.CSSProperties}
    >
      <div className="story-copy">
        {beat.eyebrow && <p className="story-eyebrow">{beat.eyebrow}</p>}
        <Heading className={hero ? "story-h1" : "story-h2"}>
          {hero ? <HeroTitle title={beat.title} /> : beat.title}
        </Heading>
        <p className="story-body">{beat.body}</p>

        {(ctas === "hero" || ctas === "final") && (
          <div className="story-ctas">
            <a href="#instant-price" className="btn btn-primary" data-cta="price">
              Get my price
            </a>
            <a href={smsHref} className="btn story-btn-ghost" data-cta="text">
              <MessageSquare className="h-4 w-4" aria-hidden />
              {ctas === "hero" ? `Text ${business.phone.display}` : "Text us"}
            </a>
          </div>
        )}
        {ctas && typeof ctas === "object" && (
          <div className="story-ctas">
            <a href={ctas.href} className="btn btn-primary">
              {ctas.label}
            </a>
          </div>
        )}
        {ctas === "hero" && (
          <p className="story-skip-row">
            <a href="#try-the-wand" className="story-skip" data-cta="wand">
              Try the wand yourself
            </a>
            <span aria-hidden>·</span>
            <a href="#instant-price" className="story-skip" data-cta="skip">
              Skip to my price <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </p>
        )}
        {ctas === "final" && (
          <p className="story-caption">
            Illustrative renders.{" "}
            <a href="#work" className="underline underline-offset-4">
              See the before and after
            </a>{" "}
            <span aria-hidden>↓</span>
          </p>
        )}
      </div>
    </article>
  );
}

/** Last two words of the H1 get the accent, like a highlighter. */
function HeroTitle({ title }: { title: string }) {
  const words = title.split(" ");
  const tail = words.splice(-2).join(" ");
  return (
    <>
      {words.join(" ")} <span className="story-accent">{tail}</span>
    </>
  );
}

/**
 * Stacked-card layout for reduced motion and no-JS visitors. Kept as a string
 * so the same rules can sit in a media query and in a <noscript>.
 */
const STATIC_CSS = `
.story-track{height:auto!important}
.story-stage{position:relative;top:auto;height:auto;overflow:visible;padding:6rem 0 2rem}
.story-media,.story-hud,.story-spray,.story-shade{display:none}
.story-chapter{display:grid;gap:1.25rem;max-width:80rem;margin:0 auto;padding:1.5rem 1rem 2.5rem}
.story-ch{position:relative;inset:auto;opacity:1!important;pointer-events:auto;display:block;padding:0!important}
.story-ch::before{display:none}
.story-ch-media{display:block}
.story-copy{transform:none!important;max-width:40rem;padding:0}
@media (min-width:1024px){.story-chapter{grid-template-columns:1.1fr 1fr;gap:1.5rem 3rem;padding:2rem 2rem 3rem}.story-ch-media{grid-row:span 4}}
`;
