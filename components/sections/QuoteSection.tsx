import { Camera, Mail, MessageSquare, Phone } from "lucide-react";
import { business, emailHref, phoneHref, smsHref } from "@/data/site";
import { QuoteForm } from "./QuoteForm";

const contacts = [
  {
    icon: MessageSquare,
    label: "Text",
    value: business.phone.display,
    href: smsHref,
    note: "Fastest reply",
  },
  { icon: Phone, label: "Call", value: business.phone.display, href: phoneHref },
  { icon: Mail, label: "Email", value: business.email, href: emailHref },
];

export function QuoteSection() {
  return (
    <section id="quote-form" className="py-20 md:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="h-section">Get a free quote.</h2>
          <p className="lede mt-5">
            Tell us about the job and we will reply within{" "}
            {business.responseTime} with a price. No obligation.
          </p>

          <ul className="mt-10 space-y-3">
            {contacts.map((contact) => (
              <li key={contact.label}>
                <a
                  href={contact.href}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-ink-2"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text">
                    <contact.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-2">
                      {contact.label}
                      {contact.note && (
                        <span className="ml-2 font-semibold text-accent-text">{contact.note}</span>
                      )}
                    </span>
                    <span className="block truncate font-semibold text-ink">{contact.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 flex gap-3 text-ink-2">
            <Camera className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden />
            <span>
              Quickest way to an exact price: text two or three photos of the
              area to {business.phone.display}.
            </span>
          </p>
        </div>

        <QuoteForm />
      </div>
    </section>
  );
}
