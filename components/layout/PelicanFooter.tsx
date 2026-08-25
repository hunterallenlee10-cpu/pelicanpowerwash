"use client";

import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { smoothScrollToElement } from "@/lib/scrollUtils";

const quickLinks = [
  { label: "Services", sectionId: "services" },
  { label: "Process & FAQ", sectionId: "process" },
  { label: "Pricing", sectionId: "pricing" },
  { label: "Service Areas", sectionId: "service-areas" },
  { label: "Reviews", sectionId: "testimonials" },
  { label: "Get a Free Quote", sectionId: "quote-form" },
];

const serviceList = [
  "House Washing",
  "Driveway & Concrete Cleaning",
  "Roof Cleaning",
  "Deck & Fence Restoration",
  "Commercial Properties",
];

export function PelicanFooter() {
  const handleLinkClick = (sectionId: string) => {
    smoothScrollToElement(sectionId, { focus: true });

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/pelican/logo.png"
                  alt="Pelican Power Wash mascot and logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Pelican Power Wash
                </h3>
                <p className="text-xs text-cyan-400">
                  Professional Exterior Cleaning
                </p>
              </div>
            </div>
            <p className="text-neutral-400 text-sm">
              Professional power washing and exterior cleaning for residential
              and commercial properties. Restore your curb appeal with results
              you can feel confident about.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.sectionId}>
                  <button
                    onClick={() => handleLinkClick(link.sectionId)}
                    className="text-neutral-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2 mb-6">
              {serviceList.map((service) => (
                <li key={service} className="text-neutral-400 text-sm">
                  {service}
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:2409252609"
                  className="inline-flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  (240) 925-2609
                </a>
              </li>
              <li>
                <a
                  href="mailto:ceo@leeenterprisesunlimited.com"
                  className="inline-flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  ceo@leeenterprisesunlimited.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Pelican Power Wash. All rights
              reserved.
            </p>
            <p className="text-neutral-500 text-sm">
              A Lee Enterprises Unlimited venture
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
