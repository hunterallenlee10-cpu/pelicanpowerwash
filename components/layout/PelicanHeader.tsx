"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import {
  getScrollPosition,
  smoothScrollToElement,
  debounce,
} from "@/lib/scrollUtils";

/**
 * Site navigation. Every target is a section of the one-page site, so each
 * entry is a scroll target rather than a route.
 */
const navItems = [
  { label: "Services", sectionId: "services", id: "nav-services" },
  { label: "Process & FAQ", sectionId: "process", id: "nav-process" },
  { label: "Pricing", sectionId: "pricing", id: "nav-pricing" },
  { label: "Service Areas", sectionId: "service-areas", id: "nav-areas" },
  { label: "Reviews", sectionId: "testimonials", id: "nav-reviews" },
];

export function PelicanHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(getScrollPosition() > 200);
    }, 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    smoothScrollToElement(sectionId, { focus: true });

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        mobileMenuOpen
          ? "bg-neutral-950"
          : isScrolled
            ? "bg-neutral-950 backdrop-blur-md border-b border-neutral-800"
            : "bg-neutral-950/50 backdrop-blur-sm"
      }`}
      style={
        isScrolled
          ? {
              boxShadow: `0 0 30px rgba(0, 188, 212, 0.1)`,
            }
          : {}
      }
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(event) => {
            event.preventDefault();
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.replaceState(null, "", "/");
          }}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10">
            <Image
              src="/pelican/logo.png"
              alt="Pelican Power Wash mascot and logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-white whitespace-nowrap">
            Pelican <span className="text-cyan-400">Power Wash</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.sectionId)}
              className="text-white hover:text-cyan-400 transition-colors relative group whitespace-nowrap"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-cyan-400 transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Phone + CTA - Desktop */}
        <div className="hidden sm:flex items-center gap-6">
          <a
            href="tel:2409252609"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            (240) 925-2609
          </a>

          <button
            onClick={() => handleNavClick("quote-form")}
            className="px-6 py-2 bg-cyan-500 text-neutral-950 rounded-lg font-semibold hover:bg-cyan-400 transition-colors whitespace-nowrap"
          >
            Get a Free Quote
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-cyan-400 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain bg-neutral-900 border-t border-neutral-800">
          <nav className="px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.sectionId)}
                className="w-full text-left px-4 py-3 text-white hover:bg-neutral-800 rounded-lg"
              >
                {item.label}
              </button>
            ))}

            <a
              href="tel:2409252609"
              className="flex items-center gap-2 px-4 py-3 text-white hover:bg-neutral-800 rounded-lg"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              (240) 925-2609
            </a>

            {/* Mobile CTA */}
            <button
              onClick={() => handleNavClick("quote-form")}
              className="w-full mt-4 px-4 py-3 bg-cyan-500 text-neutral-950 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
            >
              Get a Free Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
