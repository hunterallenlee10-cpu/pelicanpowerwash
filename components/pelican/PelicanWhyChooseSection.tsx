"use client";

import { Venture } from "@/types";
import { Check, Award, Shield, Users } from "lucide-react";
import { smoothScrollToElement } from "@/lib/scrollUtils";

interface PelicanWhyChooseSectionProps {
  venture: Venture;
}

const reasons = [
  {
    id: 1,
    title: "Faster Communication",
    description:
      "24-hour response guarantee on all inquiries. Fastest response via text message.",
    icon: Award,
  },
  {
    id: 2,
    title: "Satisfaction Guaranteed",
    description:
      "100% satisfaction guarantee. Free touch-ups if we missed any area on your property.",
    icon: Shield,
  },
  {
    id: 3,
    title: "Locally Owned & Operated",
    description:
      "Southern Maryland-based business focused on serving our community with pride and excellence.",
    icon: Check,
  },
  {
    id: 4,
    title: "No Hidden Fees",
    description:
      "Transparent pricing with all costs included upfront. Professional quotes with no surprises.",
    icon: Users,
  },
];

export function PelicanWhyChooseSection({
  venture,
}: PelicanWhyChooseSectionProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: venture.colors.primary }}
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-cyan-500/10 border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">
              Why Choose Us
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Why Choose Pelican Power Wash
          </h2>
          <p className="text-lg text-neutral-400">
            Fast response, guaranteed satisfaction, locally owned expertise, and transparent pricing that sets us apart.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.id}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-400 mb-6">
            Ready to transform your property? Get your free quote today.
          </p>
          <button
            className="px-8 py-4 bg-cyan-400 text-neutral-950 rounded-lg font-bold hover:bg-cyan-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={() => {
              smoothScrollToElement("quote-form");
            }}
          >
            Request a Free Quote
          </button>
        </div>
      </div>
    </section>
  );
}
