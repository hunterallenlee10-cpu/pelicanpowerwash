import Image from "next/image";
import { Camera } from "lucide-react";
import { SHOW_CONTENT_SLOTS, type Photo } from "@/data/site";

type Tone = "neutral" | "before" | "after";

interface PhotoSlotProps {
  photo: Photo;
  /** What belongs here, shown on the placeholder while the photo is missing. */
  hint: string;
  tone?: Tone;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

// Before and after placeholders share one frame in the slider, so each keeps
// its label on its own side of the divider.
const toneLayout: Record<Tone, string> = {
  neutral: "justify-center",
  before: "justify-start pl-[6%]",
  after: "justify-end pr-[6%]",
};

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2",
  // Murky green-grey for "before", clean teal for "after", so the slider
  // still demonstrates the idea before real photos are added.
  before: "bg-[#c9cdb8] text-[#4a4f3a] dark:bg-[#2b3326] dark:text-[#b9c2a5]",
  after: "bg-accent-soft text-accent-text",
};

/**
 * A photo, or a placeholder frame sized for one. Fills its parent, so the
 * parent sets the aspect ratio and corner radius.
 */
export function PhotoSlot({
  photo,
  hint,
  tone = "neutral",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className = "",
}: PhotoSlotProps) {
  if (photo.src) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={SHOW_CONTENT_SLOTS ? `Photo placeholder: ${hint}` : photo.alt}
      className={`absolute inset-0 flex items-center ${toneLayout[tone]} ${toneClass[tone]} ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgb(255 255 255 / 0.07) 14px 28px)",
      }}
    >
      {SHOW_CONTENT_SLOTS ? (
        <div
          className={`flex flex-col items-center gap-2 text-center ${
            tone === "neutral" ? "max-w-[18rem] px-6" : "max-w-[38%]"
          }`}
        >
          <Camera className="h-6 w-6 opacity-70" strokeWidth={1.75} aria-hidden />
          <p className="text-sm leading-snug font-semibold">{hint}</p>
        </div>
      ) : (
        <Image
          src="/pelican/logo.png"
          alt=""
          width={160}
          height={160}
          className="w-1/4 max-w-40 opacity-25"
        />
      )}
    </div>
  );
}
