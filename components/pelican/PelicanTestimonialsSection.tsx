"use client";

import { Venture } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";

interface PelicanTestimonialsSectionProps {
  venture: Venture;
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "Pelican Power Wash transformed my driveway! The team was professional, on-time, and the results exceeded my expectations. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    content:
      "We've been using Pelican for our commercial property for 2 years now. Reliable, thorough, and fair pricing. Can't ask for better service.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Property Manager",
    content:
      "Outstanding attention to detail. They care about protecting our landscaping and never cut corners. They're our go-to company for all our properties.",
    rating: 5,
  },
];

export function PelicanTestimonialsSection({
  venture,
}: PelicanTestimonialsSectionProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Accent */}
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: venture.colors.primary }}
      />

      <div className="section-container relative z-10">
        {/* Section Header with Logo */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          {/* Logo */}
          <div className="hidden lg:block w-1/3 flex justify-center">
            <div className="relative w-32 h-32">
              <Image
                src="/pelican/logo.png"
                alt="Pelican Power Wash mascot"
                width={180}
                height={180}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Text */}
          <div className="max-w-3xl text-center lg:text-left lg:w-2/3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-cyan-500/10 border border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">
                Customer Reviews
              </span>
            </div>
            <h2 className="heading-lg text-white mb-4">
              Trusted by Our Customers
            </h2>
            <p className="text-lg text-neutral-400">
              See what homeowners and businesses say about Pelican Power Wash.
            </p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 group flex flex-col"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-cyan-400 text-cyan-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-neutral-300 leading-relaxed mb-6 flex-grow">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div>
                <h4 className="text-lg font-bold text-white">
                  {testimonial.name}
                </h4>
                <p className="text-neutral-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">4.9/5</div>
            <p className="text-neutral-400">Average Rating</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
            <p className="text-neutral-400">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
            <p className="text-neutral-400">Satisfaction Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
