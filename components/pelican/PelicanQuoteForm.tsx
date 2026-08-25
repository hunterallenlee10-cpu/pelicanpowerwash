"use client";

import { Venture } from "@/types";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface PelicanQuoteFormProps {
  venture: Venture;
}

const services = [
  "House Washing",
  "Driveway & Concrete",
  "Patio & Deck",
  "Roof & Gutter",
  "Pressure Washing",
  "Soft Wash",
  "Other Service"
];

const propertyTypes = [
  "Single Family Home",
  "Multi-Unit Residential",
  "Commercial Building",
  "Industrial Facility",
  "Other"
];

export function PelicanQuoteForm({ venture }: PelicanQuoteFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "phone",
    address: "",
    city: "",
    zip: "",
    propertyType: "",
    services: [] as string[],
    projectSize: "",
    condition: "",
    description: "",
    preferredDate: "",
    notes: "",
    source: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Shown under the error as a support reference. The server sends a short
  // non-sensitive code (email_not_configured, email_rejected) plus the HTTP
  // status, which is what a failure report needs to be actionable.
  const [errorReference, setErrorReference] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        services: checkbox.checked
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setErrorReference("");

    try {
      // Send to email via API - the recipient is set server side in
      // app/api/pelican-quote/route.ts, not by the browser.
      const response = await fetch("/api/pelican-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          preferredContact: "phone",
          address: "",
          city: "",
          zip: "",
          propertyType: "",
          services: [],
          projectSize: "",
          condition: "",
          description: "",
          preferredDate: "",
          notes: "",
          source: ""
        });
        // Reset after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const data = await response.json().catch(() => null);
        const fieldErrors = data?.errors
          ? Object.values(data.errors as Record<string, string>).join(" ")
          : "";
        setErrorMessage(
          fieldErrors ||
            "We couldn't send your request. Please try again, or call or text us at (240) 925-2609."
        );
        if (!fieldErrors) {
          setErrorReference(
            [data?.code || "unknown", `http_${response.status}`].join(" · ")
          );
        }
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error);
      setErrorMessage(
        "We couldn't send your request. Please try again, or call or text us at (240) 925-2609."
      );
      setErrorReference("network_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-12">
              <div className="text-6xl mb-6">✓</div>
              <h3 className="text-3xl font-bold text-white mb-4">Quote Request Received!</h3>
              <p className="text-neutral-400 mb-6 text-lg">
                Thank you for contacting Pelican Power Wash. We'll review your request and get back to you within 24 hours.
              </p>
              <p className="text-neutral-500 text-sm">
                For immediate assistance, call or text us at (240) 925-2609
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: venture.colors.primary }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: venture.colors.accent }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-cyan-500/10 border border-cyan-500/30">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">
              Free Quote
            </span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Get Your Free Quote Today
          </h2>
          <p className="text-lg text-neutral-400">
            Fill out the form below and we'll get back to you within 24 hours with a detailed quote. No obligation, no surprises.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="pb-6 border-b border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-6">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="(240) 925-2609"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Preferred Contact <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="phone">Phone Call</option>
                      <option value="text">Text Message</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="pb-6 border-b border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-6">Property Information</h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="Leonardtown"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      placeholder="20650"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="">Select property type...</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Details */}
              <div className="pb-6 border-b border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-6">Project Details</h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Services Needed
                  </label>
                  <div className="space-y-2">
                    {services.map(service => (
                      <label key={service} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          value={service}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-400"
                        />
                        <span className="text-neutral-300">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Project Size
                    </label>
                    <select
                      name="projectSize"
                      value={formData.projectSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="">Select size...</option>
                      <option value="small">Small (under 1000 sq ft)</option>
                      <option value="medium">Medium (1000-3000 sq ft)</option>
                      <option value="large">Large (3000-10000 sq ft)</option>
                      <option value="xlarge">Extra Large (10000+ sq ft)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Current Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="">Select condition...</option>
                      <option value="good">Good (light cleaning)</option>
                      <option value="fair">Fair (moderate cleaning)</option>
                      <option value="poor">Poor (heavy cleaning)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Tell us more about your project..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      Preferred Service Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">
                      How Did You Hear About Us?
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="">Select source...</option>
                      <option value="google">Google Search</option>
                      <option value="referral">Friend Referral</option>
                      <option value="facebook">Facebook</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  placeholder="Any additional information we should know?"
                />
              </div>

              {/* Submission Error */}
              {errorMessage && (
                <div
                  role="alert"
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
                >
                  <p>{errorMessage}</p>
                  {errorReference && (
                    <p className="mt-2 text-xs text-red-400/70 font-mono">
                      Reference: {errorReference}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-cyan-400 text-neutral-950 rounded-lg font-bold hover:bg-cyan-300 disabled:bg-cyan-400/50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Submitting..." : "Get Your Free Quote"}
                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              {/* Trust Statement */}
              <p className="text-center text-neutral-400 text-sm">
                Free quote, no obligation. We'll respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
