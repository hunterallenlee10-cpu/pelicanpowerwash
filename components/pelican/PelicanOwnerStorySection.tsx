"use client";

import { Venture } from "@/types";
import { Heart, MapPin, Award } from "lucide-react";
import { smoothScrollToElement } from "@/lib/scrollUtils";

interface PelicanOwnerStoryProps {
  venture: Venture;
}

export function PelicanOwnerStorySection({ venture }: PelicanOwnerStoryProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: venture.colors.primary }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: venture.colors.accent }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-cyan-500/10 border border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">
                Our Story
              </span>
            </div>

            <h2 className="heading-lg text-white mb-6">
              Locally Owned. Community Focused.
            </h2>

            <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
              Our whole team was born and raised right here in Southern Maryland. Pelican isn't just a name—it means to swoop in and help when you need it. That's exactly what we do for our community.
            </p>

            <p className="text-neutral-400 mb-8 leading-relaxed">
              We're a team operation deeply focused on delivering professional, swift, and perfect service to everyone in St. Mary's County and surrounding areas. With over a decade of combined experience, we've built our reputation on reliability, quality workmanship, and treating every property like it's our own.
            </p>

            <p className="text-neutral-400 mb-8 leading-relaxed">
              When you choose Pelican Power Wash, you're supporting a local business owned and operated by people who care about your property and your community. We show up on time, do the job right, and we're always here when you need us.
            </p>

            {/* Core Values */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 p-3 bg-cyan-400/10 rounded-lg">
                  <Heart className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Community Care</h4>
                  <p className="text-neutral-400 text-sm">We're invested in our community and treat every customer like family.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 p-3 bg-cyan-400/10 rounded-lg">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Professional Excellence</h4>
                  <p className="text-neutral-400 text-sm">We use top-tier equipment and professional techniques on every job.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 p-3 bg-cyan-400/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Local Pride</h4>
                  <p className="text-neutral-400 text-sm">Proud to serve St. Mary's County with dedication and pride.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Info Side */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-cyan-400">10+</span>
                <span className="text-neutral-400">Years Combined Experience</span>
              </div>
              <p className="text-neutral-400 text-sm">Our team brings over a decade of combined experience to every job</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-cyan-400">500+</span>
                <span className="text-neutral-400">Happy Customers</span>
              </div>
              <p className="text-neutral-400 text-sm">Residential and commercial properties cleaned</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-cyan-400">100%</span>
                <span className="text-neutral-400">Satisfaction</span>
              </div>
              <p className="text-neutral-400 text-sm">Guaranteed on every project we complete</p>
            </div>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-cyan-400">24/7</span>
                <span className="text-neutral-400">Contact Available</span>
              </div>
              <p className="text-neutral-400 text-sm">Call, text, or email anytime—we're here for you</p>
            </div>

            {/* CTA */}
            <button
              className="w-full px-8 py-4 bg-cyan-400 text-neutral-950 rounded-lg font-bold hover:bg-cyan-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
              onClick={() => {
                smoothScrollToElement("quote-form");
              }}
            >
              Experience the Pelican Difference
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
