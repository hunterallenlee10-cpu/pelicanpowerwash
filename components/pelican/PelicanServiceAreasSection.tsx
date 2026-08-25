"use client";

import { Venture } from "@/types";
import { smoothScrollToElement } from "@/lib/scrollUtils";
import { PelicanServiceAreaMap } from "./PelicanServiceAreaMap";

interface PelicanServiceAreasSectionProps {
  venture: Venture;
}

export function PelicanServiceAreasSection({
  venture,
}: PelicanServiceAreasSectionProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div
        className="absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: venture.colors.primary }}
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-cyan-500/10 border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">
              Service Coverage
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Serving St. Mary's County & Surrounding Areas
          </h2>
          <p className="text-lg text-neutral-400">
            We focus on St. Mary's County with service available throughout Southern Maryland. 
            Contact us to confirm service availability for your location.
          </p>
        </div>

        {/* Service Area Map */}
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 md:p-8">
            <PelicanServiceAreaMap />

            {/* Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-sm bg-cyan-400/40 border border-cyan-400 flex-shrink-0" />
                <span className="text-sm text-neutral-300">
                  St. Mary's County — Primary Service Area
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-sm bg-cyan-400/15 border border-cyan-400/50 flex-shrink-0" />
                <span className="text-sm text-neutral-300">
                  Calvert & Charles — Surrounding Coverage
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <p className="text-neutral-300 mb-6">
            Not sure if we service your area? Contact us directly—we may be able to accommodate your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:2409252609"
              className="px-8 py-4 bg-cyan-400 text-neutral-950 rounded-lg font-bold hover:bg-cyan-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Call or Text: (240) 925-2609
            </a>
            <button
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-lg font-bold hover:bg-cyan-400/10 transition-all duration-200"
              onClick={() => {
                smoothScrollToElement("quote-form");
              }}
            >
              Get a Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
