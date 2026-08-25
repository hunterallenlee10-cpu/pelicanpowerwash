"use client";

import { Venture } from "@/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { smoothScrollToElement } from "@/lib/scrollUtils";

interface PelicanServicesSectionProps {
  venture: Venture;
}

const serviceCategories = [
  {
    name: "Residential Services",
    id: "residential",
    services: [
      {
        name: "House Wash",
        description: "Professional exterior siding cleaning with soft-wash methods to safely remove dirt, algae, and mold without damaging surfaces.",
        methods: "Soft-wash equipment, professional solutions, pretreatment"
      },
      {
        name: "Driveway Cleaning",
        description: "Remove oil stains, tire marks, and accumulated grime from concrete driveways with professional-grade pressure washing.",
        methods: "Electric/gas pressure washer, surface cleaner, downstream injector"
      },
      {
        name: "Concrete Cleaning",
        description: "Deep cleaning for patios, sidewalks, and any concrete surface. We can remove anything and everything from any surface.",
        methods: "Pressure washer, surface cleaner, specialized solutions"
      },
      {
        name: "Sidewalk & Walkway Cleaning",
        description: "Professional cleaning of walkways to improve curb appeal and remove hazardous algae and mold growth.",
        methods: "Pressure washer, surface cleaner, environmentally safe solutions"
      },
      {
        name: "Patio Cleaning",
        description: "Restore your outdoor living spaces by removing stains, dirt, and weathering from pavers, stone, and concrete patios.",
        methods: "Pressure washer, surface cleaner, specialty equipment for paver care"
      },
      {
        name: "Deck Cleaning",
        description: "Professional deck restoration to remove dirt, algae, and weathered finishes while preserving wood integrity.",
        methods: "Soft-wash equipment, safe wood-cleaning solutions, gentle pressure"
      },
      {
        name: "Fence Cleaning",
        description: "Clean vinyl, wood, and metal fences to restore their appearance and extend their lifespan.",
        methods: "Soft-wash equipment, specialized solutions, siding-safe methods"
      },
      {
        name: "Exterior Package",
        description: "Comprehensive cleaning combining house wash, driveway, and patio for a complete home refresh.",
        methods: "Multi-equipment approach, professional solutions, full property treatment"
      }
    ]
  },
  {
    name: "Commercial Services",
    id: "commercial",
    services: [
      {
        name: "Storefront Cleaning",
        description: "Professional cleaning of retail storefronts, windows, and entrances to create an inviting customer experience.",
        methods: "Pressure washer, window-safe techniques, professional solutions"
      },
      {
        name: "Parking Lot Cleaning",
        description: "Large-scale parking lot cleaning to remove oil stains, dirt, and debris from asphalt surfaces.",
        methods: "Surface cleaner, pressure washer, industrial-grade solutions"
      },
      {
        name: "Dumpster Pad Cleaning",
        description: "Professional cleaning of waste management areas to prevent pest attraction and maintain facility standards.",
        methods: "Pressure washer, specialized sanitizing solutions"
      },
      {
        name: "Fleet Washing",
        description: "Commercial vehicle fleet cleaning services for trucks, vans, and commercial vehicles.",
        methods: "Equipment wash system, industrial solutions, high-capacity pressure"
      },
      {
        name: "Post-Construction Cleaning",
        description: "Heavy-duty post-construction cleaning to remove debris, dust, and construction residue from properties.",
        methods: "Pressure washer, specialized equipment, industrial-grade cleaning"
      }
    ]
  },
  {
    name: "Specialty Services",
    id: "specialty",
    services: [
      {
        name: "Gutter Cleaning",
        description: "Professional gutter cleaning and maintenance to prevent water damage and maintain proper drainage.",
        methods: "Specialized gutter equipment, pressure washer, professional hand-cleaning"
      },
      {
        name: "Pool Deck Cleaning",
        description: "Safe cleaning of pool decks and surrounding areas with methods that won't damage pool equipment or surfaces.",
        methods: "Pressure washer, surface cleaner, pool-safe solutions"
      },
      {
        name: "Paver Cleaning & Sealing",
        description: "Professional cleaning and optional sealing of pavers to enhance appearance and protect against stains.",
        methods: "Specialized paver equipment, soft-wash methods, protective sealants"
      },
      {
        name: "Brick & Stone Cleaning",
        description: "Careful cleaning of brick and stone surfaces to restore their natural beauty without damage.",
        methods: "Soft-wash equipment, specialized stone-safe solutions, pressure adjustment"
      },
      {
        name: "Vinyl & Plastic Surface Cleaning",
        description: "Safe, effective cleaning of vinyl siding, plastic trim, and other sensitive surfaces.",
        methods: "Soft-wash equipment, siding-safe methods, gentle pressure settings"
      },
      {
        name: "Stucco & Exterior Paint Cleaning",
        description: "Professional cleaning of stucco and painted surfaces that removes dirt without affecting the finish.",
        methods: "Soft-wash equipment, pressure control, surface-safe solutions"
      },
      {
        name: "Rust & Oil Stain Removal",
        description: "Specialized treatment and removal of rust stains and oil marks from various surfaces.",
        methods: "Specialized rust removal solutions, pressure washer, surface-specific techniques"
      },
      {
        name: "Graffiti Removal",
        description: "Professional removal of graffiti from walls, fences, and other surfaces using safe, effective methods.",
        methods: "Specialized graffiti removal solutions, pressure control, surface protection"
      },
      {
        name: "Equipment & Machinery Cleaning",
        description: "Industrial equipment and machinery cleaning for maintenance and operational efficiency.",
        methods: "Equipment wash system, industrial solutions, specialized pressure settings"
      },
      {
        name: "Roof Cleaning",
        description: "Safe professional roof cleaning to remove algae, moss, and dirt while preserving roof integrity.",
        methods: "Soft-wash equipment, roof-safe solutions, specialized pressure control"
      }
    ]
  }
];

function ServiceCategory({ category }: { category: typeof serviceCategories[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 bg-neutral-900 hover:bg-neutral-800/50 transition-colors group/header"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-semibold flex-shrink-0 group-hover/header:bg-cyan-400/20 transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "" : "-rotate-90"
            }`}
          />
          {isOpen ? "Collapse" : "Expand"}
        </span>
        <h3 className="text-xl font-bold text-white text-left">
          {category.name}
        </h3>
        <span className="ml-auto text-sm text-neutral-500 flex-shrink-0 hidden sm:inline">
          {category.services.length} services
        </span>
      </button>

      {/* Services List */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-950">
          {category.services.map((service, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group"
            >
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {service.name}
              </h4>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="text-xs text-cyan-400/70 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cyan-400/10 rounded">
                  {service.methods}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PelicanServicesSection({ venture }: PelicanServicesSectionProps) {
  return (
    <section
      id="services"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background Accent */}
      <div
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: venture.colors.primary }}
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-cyan-500/10 border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">
              Our Services
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Professional Cleaning Solutions
          </h2>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            We can remove anything and everything. From residential homes to large commercial properties, 
            we have the expertise and equipment to handle any exterior cleaning challenge with quick, professional service.
          </p>
        </div>

        {/* Service Categories */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {serviceCategories.map((category) => (
            <ServiceCategory key={category.id} category={category} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-400 mb-6">
            Don't see your service listed? We offer custom solutions for specialized projects.
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
