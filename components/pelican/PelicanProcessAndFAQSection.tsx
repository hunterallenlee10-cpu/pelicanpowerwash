"use client";

import { Venture } from "@/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { smoothScrollToElement } from "@/lib/scrollUtils";

interface PelicanProcessAndFAQSectionProps {
  venture: Venture;
}

const steps = [
  {
    id: 1,
    title: "Customer Submits Property Info",
    description: "Tell us about your property and the cleaning services you need through our easy quote form.",
  },
  {
    id: 2,
    title: "Pelican Confirms & Responds",
    description: "Our team reviews your request and reaches out to confirm details and answer any questions.",
  },
  {
    id: 3,
    title: "Call/Text Within 24 Hours",
    description: "We contact you within 24 hours with a professional quote and available scheduling options.",
  },
  {
    id: 4,
    title: "In-Person Inspection (When Needed)",
    description: "For complex projects, we may schedule a quick on-site inspection to ensure accurate quoting.",
  },
  {
    id: 5,
    title: "Written Quote & Schedule",
    description: "Receive your written quote, approve, and we schedule your service at your convenience.",
  },
];

const faqs = [
  {
    question: "Do I need to be home during the cleaning?",
    answer: "No, you don't need to be home. We can access your property with your permission. Just make sure gates are unlocked if applicable."
  },
  {
    question: "How long does cleaning typically take?",
    answer: "Most residential services take 1-3 hours depending on the size and type of cleaning needed."
  },
  {
    question: "Do you bring your own water?",
    answer: "No, we use your property's water supply. We just need access to an exterior water connection."
  },
  {
    question: "Do you need an exterior water connection?",
    answer: "Yes, we require access to an exterior water source. A standard outdoor faucet works perfectly."
  },
  {
    question: "Is pressure washing safe for my siding?",
    answer: "Yes, absolutely! We use the appropriate pressure settings and soft-wash methods for delicate surfaces like vinyl and wood."
  },
  {
    question: "Do you offer soft-wash services?",
    answer: "Yes, soft-wash is one of our specialties. We use low-pressure, chemical-based cleaning for sensitive surfaces."
  },
  {
    question: "Can you remove oil and rust stains?",
    answer: "It depends on the stain type and surface. We can remove most oil and rust stains with our specialized solutions."
  },
  {
    question: "Will the cleaning damage my plants?",
    answer: "No, we use pet-safe and plant-safe solutions. We also protect landscaping during the cleaning process."
  },
  {
    question: "Do I need to move outdoor furniture?",
    answer: "You don't have to—we'll carefully move furniture as needed during the cleaning process."
  },
  {
    question: "What if rain is forecast for my cleaning day?",
    answer: "We can reschedule your service if rain is expected. Most cleanings can be rescheduled with no penalty."
  },
  {
    question: "Do you clean during winter?",
    answer: "Yes, we can clean in winter as long as temperatures are above 40°F to prevent freezing."
  },
  {
    question: "How often should my house be pressure washed?",
    answer: "Most homes benefit from professional cleaning every 2-3 months, depending on weather and local conditions."
  },
  {
    question: "Do you serve commercial properties?",
    answer: "Yes! We offer complete commercial cleaning solutions for businesses, stores, parking lots, and more."
  },
  {
    question: "Are estimates completely free?",
    answer: "Yes, all estimates are completely free with no obligation. We want to earn your business."
  },
  {
    question: "How quickly can you schedule my service?",
    answer: "We typically schedule services within 12-48 hours of approval, depending on availability."
  },
  {
    question: "What is your response time?",
    answer: "We respond to all inquiries within 24 hours. For faster service, call or text us directly at (240) 925-2609."
  },
  {
    question: "Do you offer free quotes?",
    answer: "Yes, all quotes are completely free, no obligation, and you can get one by calling, texting, or filling out our form."
  },
  {
    question: "What areas do you serve?",
    answer: "We proudly serve St. Mary's County and Southern Maryland. Contact us to see if we service your specific location."
  },
  {
    question: "Do you provide written estimates?",
    answer: "Yes, we provide detailed written estimates for all projects so you know exactly what to expect."
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-neutral-900/50 hover:bg-neutral-800/50 transition-colors text-left"
      >
        <span className="font-semibold text-white">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-neutral-950/50 border-t border-neutral-800">
          <p className="text-neutral-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function PelicanProcessAndFAQSection({
  venture,
}: PelicanProcessAndFAQSectionProps) {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
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
              How We Work
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Our Process & Your Questions Answered
          </h2>
          <p className="text-lg text-neutral-400">
            From quote to cleaning day, here's how we work and answers to your most common questions.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Process Steps */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 text-sm font-bold">
                1
              </span>
              The Quote & Cleaning Process
            </h3>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4 items-start">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
                      <span className="text-sm font-bold">{step.id}</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow pt-1">
                    <h4 className="text-base font-bold text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-neutral-400 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 text-sm font-bold">
                ✓
              </span>
              Why Choose Our Process
            </h3>
            <div className="space-y-4">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">24 Hours</div>
                <p className="text-neutral-400 text-sm">Guaranteed response time to all inquiries</p>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">12-48 Hours</div>
                <p className="text-neutral-400 text-sm">Typical scheduling window after approval</p>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">100% Free</div>
                <p className="text-neutral-400 text-sm">All quotes are completely free, no obligation</p>
              </div>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
                <p className="text-neutral-400 text-sm">Contact availability via call, text, or form</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </h3>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-400 mb-6">
            Still have questions? Contact us directly or request a free quote.
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
              Get Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
