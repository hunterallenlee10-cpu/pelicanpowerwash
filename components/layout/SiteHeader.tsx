"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { business, phoneHref, showReviewsSection } from "@/data/site";

const navItems = [
  { label: "Try the wand", href: "/#try-the-wand" },
  { label: "House & roof", href: "/#house-and-roof" },
  { label: "Before / after", href: "/#work" },
  { label: "Instant quote", href: "/#instant-price" },
  { label: "Packages", href: "/#pricing" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
].filter((item) => showReviewsSection || item.href !== "/#testimonials");

/**
 * Floating nav. See-through over the full-screen photos, with a soft dark
 * fade behind it so the links stay readable on any picture.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        open ? "bg-canvas" : scrolled ? "bg-canvas/55 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link href="/#top" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/pelican/logo-96.webp"
            alt=""
            width={48}
            height={48}
            className="h-11 w-11"
            priority
          />
          <span className="font-display text-lg leading-none text-white">
            Pelican
            <span className="label-mono mt-0.5 block text-[0.6rem] text-accent-text">Power Wash</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label-mono rounded-full px-3 py-2 text-white/75 transition-colors hover:text-white"
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
            className="label-mono hidden items-center gap-2 px-3 py-2 text-white/80 transition-colors hover:text-white 2xl:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            {business.phone.display}
          </a>
          <Link
            href="/#quote-form"
            className="label-mono hidden min-h-11 items-center rounded-full border border-white/40 px-4 text-white transition-colors hover:border-white sm:inline-flex"
          >
            Free quote
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
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
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-canvas xl:hidden"
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
              <Link href="/#quote-form" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                Get a free quote
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
