"use client";

import { Venture } from "@/types";
import { smoothScrollToElement } from "@/lib/scrollUtils";

interface PelicanProcessSectionProps {
  venture: Venture;
}

const steps = [
  {
    id: 1,
    title: "Consultation & Assessment",
    description:
      "We evaluate your property and discuss your needs to create a customized cleaning plan.",
  },
  {
    id: 2,
    title: "Site Preparation",
    description:
      "We prepare the area, protect landscaping and sensitive areas before starting work.",
  },
  {
    id: 3,
    title: "Professional Cleaning",
    description:
      "Our technicians use the right equipment and technique for your specific surfaces.",
  },
  {
    id: 4,
    title: "Final Inspection",
    description:
      "We thoroughly inspect the work and make any touch-ups to ensure perfection.",
  },
  {
    id: 5,
    title: "Follow-Up Service",
    description:
      "We offer maintenance plans and follow-up services to keep your property looking great.",
  },
];

export function PelicanProcessSection({
  venture,
}: PelicanProcessSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-neutral-950 relative overflow-hidden">
      {/* Background Accent */}
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: venture.colors.primary }}
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-cyan-500/10 border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">
              Our Process
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            How We Work
          </h2>
          <p className="text-lg text-neutral-400">
            Our proven 5-step process ensures exceptional results and complete
            customer satisfaction on every project.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-6 items-start">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-neutral-950">
                    <span className="text-lg font-bold">{step.id}</span>
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-grow pt-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-neutral-400">{step.description}</p>
                </div>

                {/* Connector Line */}
                {step.id < steps.length && (
                  <div className="absolute left-[23px] top-[80px] w-0.5 h-20 bg-gradient-to-b from-cyan-400/50 to-cyan-400/0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            className="px-8 py-4 bg-cyan-400 text-neutral-950 rounded-lg font-bold hover:bg-cyan-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={() => {
              smoothScrollToElement("quote-form");
            }}
          >
            Schedule Your Service
          </button>
        </div>
      </div>
    </section>
  );
}
