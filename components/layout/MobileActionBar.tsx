import Link from "next/link";
import { MessageSquare, Phone } from "lucide-react";
import { phoneHref, smsHref } from "@/data/site";

/**
 * Thumb-reach contact bar pinned to the bottom of small screens. The footer
 * reserves matching bottom padding on mobile so the bar never covers it.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 px-3 py-2.5">
        <a href={phoneHref} className="btn btn-secondary px-3 py-3 text-sm">
          <Phone className="h-4 w-4" aria-hidden />
          Call
        </a>
        <a href={smsHref} className="btn btn-secondary px-3 py-3 text-sm">
          <MessageSquare className="h-4 w-4" aria-hidden />
          Text
        </a>
        <Link href="/#quote-form" className="btn btn-primary px-3 py-3 text-sm">
          Get a free quote
        </Link>
      </div>
    </div>
  );
}
