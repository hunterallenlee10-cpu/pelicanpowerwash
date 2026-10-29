"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { business, phoneHref, pricing, smsHref } from "@/data/site";
import { track } from "@/lib/analytics";
import { formatMoney } from "@/lib/pricing";
import { usePriceState } from "@/lib/price-store";

/**
 * Bottom bar that keeps a quote button in reach at every scroll position: a
 * thumb bar on phones, a slim trust bar on larger screens. Steps aside while
 * the quote form itself is on screen and picks up the live Instant Price
 * total.
 */
export function QuoteBar() {
  const [formInView, setFormInView] = useState(false);
  const price = usePriceState();

  useEffect(() => {
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
      document.removeEventListener("click", onClick);
      io?.disconnect();
    };
  }, []);

  const visible = !formInView;
  const priceLabel = price.hasPrice ? `Your price: ${formatMoney(price.total)}` : "Get my price";
  const fromPrice = Math.min(...pricing.filter((p) => p.amount && p.amount >= 100).map((p) => p.amount!));

  return (
    <div
      data-quote-bar
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out md:inset-x-auto md:bottom-4 md:left-1/2 md:w-[min(64rem,calc(100vw-2rem))] md:-translate-x-1/2 ${
        visible ? "translate-y-0" : "translate-y-[140%]"
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

      {/* Tablets and up: slim trust bar */}
      <div className="hidden items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0b0e12]/90 py-2 pr-2 pl-5 shadow-[0_18px_50px_-18px_rgb(0_0_0/0.8)] backdrop-blur-md md:flex">
        <p className="label-mono truncate text-white/70">
          Free written quotes <span className="text-white/30">·</span> Locally owned
          <span className="hidden lg:inline">
            {" "}
            <span className="text-white/30">·</span> Reply in {business.responseTime}
          </span>
          <span className="ml-3 text-white">Packages from ${fromPrice}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <a href={smsHref} className="label-mono hidden px-3 py-2 text-white/80 hover:text-white 2xl:inline-flex">
            Text {business.phone.display}
          </a>
          <Link href={price.hasPrice ? "/#instant-price" : "/#quote-form"} className="btn btn-primary min-h-11 px-5 py-2">
            {price.hasPrice ? priceLabel : "Free quote"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
