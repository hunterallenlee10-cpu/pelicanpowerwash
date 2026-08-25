"use client";

import { Venture } from "@/types";
import { Zap, Gauge, Droplets, Shield } from "lucide-react";

interface PelicanEquipmentSectionProps {
  venture: Venture;
}

const equipment = [
  {
    id: 1,
    title: "Industrial-Grade Pressure Washers",
    description:
      "4000+ PSI equipment for maximum cleaning power on tough surfaces.",
    icon: Zap,
    specs: "Up to 4500 PSI",
  },
  {
    id: 2,
    title: "Variable Pressure Systems",
    description:
      "Adjustable pressure levels to safely clean delicate surfaces without damage.",
    icon: Gauge,
    specs: "500 - 4500 PSI",
  },
  {
    id: 3,
    title: "Eco-Friendly Solutions",
    description:
      "Biodegradable cleaning agents that are safe for the environment and families.",
    icon: Droplets,
    specs: "100% Eco-Friendly",
  },
  {
    id: 4,
    title: "Safety Equipment",
    description:
      "Full protective gear and safety protocols for all technicians on every job.",
    icon: Shield,
    specs: "OSHA Compliant",
  },
];

export function PelicanEquipmentSection({
  venture,
}: PelicanEquipmentSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-neutral-950 to-blue-950/10 relative overflow-hidden">
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
              Our Equipment
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Professional-Grade Tools
          </h2>
          <p className="text-lg text-neutral-400">
            We invest in the best equipment and technology to deliver superior
            results on every project.
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {equipment.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 text-xs font-bold text-cyan-400 bg-cyan-400/10 rounded-full">
                      {item.specs}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
