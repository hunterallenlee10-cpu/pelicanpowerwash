"use client";

import { Venture } from "@/types";
import { Check } from "lucide-react";
import { smoothScrollToElement } from "@/lib/scrollUtils";

interface PelicanPricingSectionProps {
  venture: Venture;
}

const pricingPackages = [
  {
    id: 1,
    name: "Trash Can Cleaning",
    description: "Professional cleaning and treatment of trash cans",
    pricing: [
      { quantity: "1 Can", price: "$20" },
      { quantity: "2 Cans", price: "$30" }
    ],
    highlighted: false,
  },
  {
    id: 2,
    name: "Front Concrete Only",
    description: "Driveway and front patio cleaning",
    price: "$149",
    highlighted: false,
  },
  {
    id: 3,
    name: "Total Front of House",
    description: "House wash + front concrete + patio",
    price: "$349",
    highlighted: true,
  },
  {
    id: 4,
    name: "House Concrete",
    description: "Front, back, and stairs cleaning",
    price: "$275",
    highlighted: false,
  },
  {
    id: 5,
    name: "Basement Walkout Stairs",
    description: "Add-on service for stair cleaning",
    price: "$149",
    description_sub: "Add-on to other services",
    highlighted: false,
  },
  {
    id: 6,
    name: "Full Exteriors",
    description: "Complete home exterior cleaning package",
    price: "Call or Text for Quote",
    highlighted: false,
    featured: true,
  },
  {
    id: 7,
    name: "Commercial Services",
    description: "All commercial cleaning packages",
    price: "Free Quote",
    highlighted: false,
  },
];

const paymentInfo = [
  { label: "Accepted Payment Methods", items: ["Cash", "Check", "Venmo", "Zelle", "CashApp", "Apple Pay", "Stripe", "Crypto"] },
  { label: "Discounts", items: ["Military: 10% off", "65+ Seniors: 10% off"] },
  { label: "Pricing Info", items: ["Taxes: Included in price", "Quotes expire: No", "Payment due: Upon booking"] },
];

export function PelicanPricingSection({
  venture,
}: PelicanPricingSectionProps) {
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
              Transparent Pricing
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-lg text-neutral-400">
            All quotes are free with no obligation. Pricing includes all applicable taxes and fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {pricingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-lg backdrop-blur-sm transition-all duration-300 ${
                pkg.highlighted
                  ? "ring-2 ring-cyan-400 bg-cyan-400/10 border border-cyan-400/50 transform md:col-span-2 lg:col-span-1"
                  : pkg.featured
                  ? "col-span-1 md:col-span-2 lg:col-span-1 ring-1 ring-orange-400/50 bg-orange-400/5 border border-orange-400/30"
                  : "bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5"
              } p-8`}
            >
              {/* Highlighted Badge */}
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 bg-cyan-400 text-neutral-950 text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Featured Badge */}
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 bg-orange-400 text-neutral-950 text-xs font-bold rounded-full">
                    Featured Package
                  </span>
                </div>
              )}

              {/* Package Info */}
              <div className="mb-6 pt-2">
                <h3 className="text-xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-4">
                  {pkg.description}
                </p>
                {pkg.description_sub && (
                  <p className="text-neutral-500 text-xs italic">
                    {pkg.description_sub}
                  </p>
                )}
                <div className="space-y-2 mt-4">
                  {pkg.pricing ? (
                    pkg.pricing.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-neutral-300 text-sm">{item.quantity}</span>
                        <span className="text-2xl font-bold text-cyan-400">{item.price}</span>
                      </div>
                    ))
                  ) : (
                    // Only an actual figure gets the display size. "Call or
                    // Text for Quote" at text-4xl wrapped onto two lines and
                    // made the card tower over its neighbours.
                    <div
                      className={`font-bold text-cyan-400 ${
                        pkg.price?.startsWith("$") ? "text-4xl" : "text-2xl"
                      }`}
                    >
                      {pkg.price}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full px-6 py-3 rounded-lg font-semibold mt-auto transition-all duration-200 ${
                  pkg.highlighted
                    ? "bg-cyan-400 text-neutral-950 hover:bg-cyan-300"
                    : pkg.featured
                    ? "bg-orange-400/20 text-orange-300 border border-orange-400 hover:bg-orange-400/30"
                    : "border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                }`}
                onClick={() => smoothScrollToElement("quote-form")}
              >
                {pkg.price === "Call or Text for Quote" || pkg.price === "Free Quote"
                  ? "Get Your Free Quote"
                  : "Schedule Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Payment & Policy Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {paymentInfo.map((section, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6"
            >
              <h4 className="text-lg font-bold text-white mb-4">
                {section.label}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex gap-2 items-start">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-16 text-center">
          <p className="text-neutral-400">
            All quotes include free consultation. No hidden fees or surprises.
          </p>
        </div>
      </div>
    </section>
  );
}
