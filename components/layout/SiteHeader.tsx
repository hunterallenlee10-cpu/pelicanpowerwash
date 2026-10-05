"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { business, phoneHref, showReviewsSection } from "@/data/site";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "Our work", href: "/#work" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "Service area", href: "/#service-areas" },
  { label: "FAQ", href: "/#faq" },
].filter((item) => showReviewsSection || item.href !== "/#testimonials");

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/#top"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/pelican/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12"
            priority
          />
          <span className="font-display text-lg leading-none text-ink">
            Pelican
            <span className="block text-[0.7rem] font-bold tracking-[0.14em] text-accent-text uppercase">
              Power Wash
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-2 text-[0.95rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={phoneHref}
            className="hidden items-center gap-2 px-3 py-2 font-semibold text-ink transition-colors hover:text-accent-text xl:inline-flex"
          >
            <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />
            {business.phone.display}
          </a>
          <Link href="/#quote-form" className="btn btn-primary hidden px-5 py-2.5 sm:inline-flex">
            Get a free quote
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-canvas lg:hidden"
        >
          <ul className="container-page py-3">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-lg font-semibold text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link
                href="/#quote-form"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                Get a free quote
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
