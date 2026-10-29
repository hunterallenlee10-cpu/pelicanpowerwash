"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { business, phoneHref, smsHref } from "@/data/site";
import { track } from "@/lib/analytics";
import { formatMoney } from "@/lib/pricing";
import { usePriceState } from "@/lib/price-store";

/**
 * Quote CTA that stays in reach at every scroll position: a thumb bar on
 * phones, a floating pill on larger screens. Shows once the hero story is
 * 30% through (or right away on pages without it) and steps aside while the
 * quote form itself is on screen. Picks up the live Instant Price total.
 */
export function QuoteBar() {
  const [pastHero, setPastHero] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const price = usePriceState();

  useEffect(() => {
    const hero = document.getElementById("top");
    let raf = 0;
    const check = () => {
      raf = 0;
      if (!hero || !hero.classList.contains("story")) {
        setPastHero(true);
        return;
      }
      const r = hero.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight);
      setPastHero(-r.top / total > 0.3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const form = document.getElementById("quote-form");
    const io = form
      ? new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.15 })
      : null;
    if (form) io!.observe(form);

    // Every text-us link on the site reports one funnel event.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='sms:']");
      if (!a) return;
      const where = a.closest("section[id]")?.id ?? (a.closest("[data-quote-bar]") ? "quote-bar" : "page");
      track("quote_text_click", { where });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick);
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const visible = pastHero && !formInView;
  const priceLabel = price.hasPrice ? `Your price: ${formatMoney(price.total)}` : "Get my price";

  return (
    <div
      data-quote-bar
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out md:inset-x-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 ${
        visible ? "translate-y-0" : "translate-y-[130%]"
      }`}
    >
      {/* Phones: thumb bar */}
      <div className="border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-[48px_1fr_1.35fr] gap-2 px-3 py-2.5">
          <a href={phoneHref} aria-label={`Call ${business.phone.display}`} className="btn btn-secondary h-12 p-0">
            <Phone className="h-5 w-5" aria-hidden />
          </a>
          <a href={smsHref} className="btn btn-secondary h-12 px-3 text-[0.95rem]">
            <MessageSquare className="h-4 w-4" aria-hidden />
            Text us
          </a>
          <Link href="/#instant-price" className="btn btn-primary h-12 px-3 text-[0.95rem]">
            {priceLabel}
            {price.hasPrice && <ArrowRight className="h-4 w-4" aria-hidden />}
          </Link>
        </div>
      </div>

      {/* Tablets and up: floating pill */}
      <div className="hidden items-center gap-4 rounded-full border border-line bg-surface/95 py-2 pr-2 pl-6 shadow-[0_18px_50px_-18px_rgb(14_36_64/0.45)] backdrop-blur-md md:flex">
        <p className="text-[0.95rem] font-medium whitespace-nowrap text-ink">
          Free written quote <span className="text-ink-2">·</span> reply within {business.responseTime}
        </p>
        <Link href="/#instant-price" className="btn btn-primary min-h-12 px-5 py-2.5">
          {priceLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
