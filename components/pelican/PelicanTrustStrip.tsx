"use client";

import { Venture } from "@/types";

interface PelicanTrustStripProps {
  venture: Venture;
}

const trustBadges = [
  "Locally Owned",
  "Southern Maryland Based",
  "Free Estimates",
  "Satisfaction Guarantee",
  "Professional Equipment",
];

export function PelicanTrustStrip({ venture }: PelicanTrustStripProps) {
  return (
    <section className="py-8 md:py-12 bg-neutral-900 border-y border-neutral-800">
      <div className="section-container">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-neutral-300 font-medium text-sm md:text-base">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
