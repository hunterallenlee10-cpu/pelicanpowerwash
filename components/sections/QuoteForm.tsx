"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, LoaderCircle } from "lucide-react";
import { business, phoneHref, quoteServiceOptions } from "@/data/site";

const propertyTypes = [
  "Single Family Home",
  "Multi-Unit Residential",
  "Commercial Building",
  "Industrial Facility",
  "Other",
];

const contactMethods = [
  { value: "phone", label: "Phone call" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
];

// Field names match app/api/pelican-quote/route.ts and the email it sends.
const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  preferredContact: "text",
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
  source: "",
  honeypot: "",
};

type FormState = typeof emptyForm;

const fallbackMessage = `We couldn't send your request. Please try again, or call or text us at ${business.phone.display}.`;

function todayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export function QuoteForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  // Shown under the error as a support reference. The server sends a short
  // non-sensitive code (email_not_configured, email_rejected) plus the HTTP
  // status, which is what a failure report needs to be actionable.
  const [errorReference, setErrorReference] = useState("");

  const update = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    setErrorReference("");
    setFieldErrors({});

    try {
      // The recipient is set server side, not by the browser.
      const response = await fetch("/api/pelican-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("sent");
        setForm(emptyForm);
        return;
      }

      const data = await response.json().catch(() => null);
      if (data?.errors) {
        setFieldErrors(data.errors as Record<string, string>);
        setErrorMessage("Please fix the highlighted fields.");
      } else {
        setErrorMessage(fallbackMessage);
        setErrorReference(
          [data?.code || "unknown", `http_${response.status}`].join(" · ")
        );
      }
    } catch (error) {
      console.error("Quote form submission error:", error);
      setErrorMessage(fallbackMessage);
      setErrorReference("network_error");
    }
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-start rounded-2xl border border-line bg-surface p-8 sm:p-10"
      >
        <CheckCircle2 className="h-10 w-10 text-accent-text" aria-hidden />
        <h3 className="font-display mt-5 text-2xl text-ink">Request received.</h3>
        <p className="mt-3 max-w-[48ch] text-lg leading-relaxed text-ink-2">
          Thanks for reaching out. We will get back to you within{" "}
          {business.responseTime}. Need us sooner? Call or text{" "}
          <a href={phoneHref} className="font-semibold text-accent-text underline underline-offset-4">
            {business.phone.display}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-secondary mt-8"
        >
          Send another request
        </button>
      </div>
    );
  }

  const errorProps = (name: keyof FormState) =>
    fieldErrors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` }
      : {};

  const fieldError = (name: keyof FormState) =>
    fieldErrors[name] ? (
      <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-danger">
        {fieldErrors[name]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
    >
      {/* Spam trap: hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="honeypot">Leave this field empty</label>
        <input
          id="honeypot"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={update}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-ink-2">About you</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="field-label">
              Full name <span className="text-danger">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              minLength={2}
              value={form.fullName}
              onChange={update}
              className="field"
              {...errorProps("fullName")}
            />
            {fieldError("fullName")}
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              Phone <span className="text-danger">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={update}
              className="field"
              {...errorProps("phone")}
            />
            {fieldError("phone")}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="field-label">
              Email <span className="font-normal text-ink-2">(optional)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required={form.preferredContact === "email"}
              value={form.email}
              onChange={update}
              className="field"
              {...errorProps("email")}
            />
            {fieldError("email")}
          </div>
        </div>

        <div className="mt-5">
          <p id="contact-label" className="field-label">
            Best way to reach you
          </p>
          <div role="radiogroup" aria-labelledby="contact-label" className="flex flex-wrap gap-2">
            {contactMethods.map((method) => (
              <label key={method.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="preferredContact"
                  value={method.value}
                  checked={form.preferredContact === method.value}
                  onChange={update}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-2 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                  {method.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-line pt-8">
        <legend className="float-left w-full text-sm font-semibold text-ink-2">The job</legend>

        <div className="clear-both pt-4">
          <p id="services-label" className="field-label">
            What needs cleaning?
          </p>
          <div role="group" aria-labelledby="services-label" className="flex flex-wrap gap-2">
            {quoteServiceOptions.map((service) => {
              const checked = form.services.includes(service);
              return (
                <label key={service} className="cursor-pointer">
                  <input
                    type="checkbox"
                    value={service}
                    checked={checked}
                    onChange={() => toggleService(service)}
                    className="peer sr-only"
                  />
                  <span className="inline-block rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-2 transition-colors peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-accent-text peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                    {service}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="address" className="field-label">
              Street address <span className="font-normal text-ink-2">(optional)</span>
            </label>
            <input
              id="address"
              name="address"
              autoComplete="street-address"
              value={form.address}
              onChange={update}
              className="field"
            />
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="city" className="field-label">
              Town
            </label>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={update}
              className="field"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="zip" className="field-label">
              ZIP
            </label>
            <input
              id="zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={10}
              value={form.zip}
              onChange={update}
              className="field"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="propertyType" className="field-label">
              Property type
            </label>
            <Select id="propertyType" value={form.propertyType} onChange={update}>
              <option value="">Choose one</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="projectSize" className="field-label">
              Size
            </label>
            <Select id="projectSize" value={form.projectSize} onChange={update}>
              <option value="">Choose one</option>
              <option value="small">Under 1,000 sq ft</option>
              <option value="medium">1,000 to 3,000 sq ft</option>
              <option value="large">3,000 to 10,000 sq ft</option>
              <option value="xlarge">Over 10,000 sq ft</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="condition" className="field-label">
              Condition
            </label>
            <Select id="condition" value={form.condition} onChange={update}>
              <option value="">Choose one</option>
              <option value="good">Light dirt</option>
              <option value="fair">Moderate buildup</option>
              <option value="poor">Heavy buildup</option>
            </Select>
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="description" className="field-label">
              Tell us about the job
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={update}
              className="field resize-y"
              placeholder="For example: two-story vinyl house, green on the north side, plus the driveway."
            />
          </div>
        </div>
      </fieldset>

      <details className="group mt-6 border-t border-line pt-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
          More details (optional)
        </summary>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="preferredDate" className="field-label">
              Preferred date
            </label>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              // Set on focus rather than at render: the page is prerendered at
              // build time, so a render-time "today" would be stale.
              onFocus={(event) => {
                event.currentTarget.min = todayISO();
              }}
              value={form.preferredDate}
              onChange={update}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="source" className="field-label">
              How did you hear about us?
            </label>
            <Select id="source" value={form.source} onChange={update}>
              <option value="">Choose one</option>
              <option value="google">Google</option>
              <option value="referral">Friend or neighbor</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="nextdoor">Nextdoor</option>
              <option value="truck">Saw the truck or a yard sign</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="field-label">
              Anything else
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={update}
              className="field resize-y"
              placeholder="Gate codes, pets, best time to call."
            />
          </div>
        </div>
      </details>

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <p className="font-medium">{errorMessage}</p>
          {errorReference && (
            <p className="mt-1.5 font-mono text-xs opacity-80">Reference: {errorReference}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
            Sending
          </>
        ) : (
          <>
            Send quote request
            <ArrowRight className="h-5 w-5" aria-hidden />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-sm text-ink-2">
        Free and no obligation. We reply within {business.responseTime}.
      </p>
    </form>
  );
}

function Select({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="field appearance-none pr-10"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-2"
        aria-hidden
      />
    </div>
  );
}
