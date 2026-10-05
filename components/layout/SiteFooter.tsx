import Image from "next/image";
import Link from "next/link";
import { Mail, MessageSquare, Phone } from "lucide-react";
import {
  SHOW_CONTENT_SLOTS,
  business,
  emailHref,
  phoneHref,
  serviceCategories,
  serviceTowns,
  showReviewsSection,
  smsHref,
} from "@/data/site";

const socialLabels: Record<keyof typeof business.socials, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  nextdoor: "Nextdoor",
  google: "Google",
};

const companyLinks = [
  { label: "Our work", href: "/#work" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Get a free quote", href: "/#quote-form" },
].filter((link) => showReviewsSection || link.href !== "/#testimonials");

export function SiteFooter() {
  const socials = (
    Object.keys(business.socials) as (keyof typeof business.socials)[]
  ).filter((key) => business.socials[key]);

  return (
    <footer className="bg-navy text-white">
      {/* Closing call to action */}
      <div className="border-b border-white/10">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1fr_auto] md:py-16">
          <div className="flex items-center gap-6">
            <Image
              src="/pelican/logo.png"
              alt=""
              width={120}
              height={120}
              className="hidden h-28 w-28 shrink-0 sm:block"
            />
            <div>
              <h2 className="font-display text-3xl leading-tight text-balance md:text-4xl">
                Ready for a cleaner property?
              </h2>
              <p className="mt-2 text-lg text-white/70">
                Text a few photos and we will reply within {business.responseTime}.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={smsHref} className="btn bg-white text-navy hover:bg-white/90">
              <MessageSquare className="h-4 w-4" aria-hidden />
              Text {business.phone.display}
            </a>
            <Link
              href="/#quote-form"
              className="btn border border-white/30 text-white hover:border-white"
            >
              Get a free quote
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-xl">{business.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Soft washing and pressure washing for homes and businesses in{" "}
            {business.primaryArea} and across {business.region}.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a href={phoneHref} className="inline-flex items-center gap-2.5 hover:text-[#6ad9e5]">
                <Phone className="h-4 w-4 text-[#6ad9e5]" aria-hidden />
                {business.phone.display}
              </a>
            </li>
            <li>
              <a href={emailHref} className="inline-flex items-center gap-2.5 break-all hover:text-[#6ad9e5]">
                <Mail className="h-4 w-4 shrink-0 text-[#6ad9e5]" aria-hidden />
                {business.email}
              </a>
            </li>
            <li className="text-white/65">
              {business.hours ?? "Call or text any time."}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/50">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {serviceCategories.flatMap((category) =>
              category.services.slice(0, 2).map((service) => (
                <li key={service.name}>
                  <Link href="/#services" className="text-white/80 hover:text-white">
                    {service.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/50">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="text-white/80 hover:text-white">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/50">Service area</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            {serviceTowns.map((group) => (
              <li key={group.county}>{group.county}</li>
            ))}
          </ul>

          {socials.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map((key) => (
                <li key={key}>
                  <a
                    href={business.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/20 px-3.5 py-1.5 text-sm hover:border-white"
                  >
                    {socialLabels[key]}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            SHOW_CONTENT_SLOTS && (
              <p className="mt-6 rounded-2xl border border-dashed border-white/25 px-4 py-3 text-xs leading-relaxed text-white/60">
                Social links go here: Facebook, Instagram, Nextdoor and your
                Google Business Profile. Add them in data/site.ts.
              </p>
            )
          )}
        </div>
      </div>

      {/* Extra bottom padding on mobile clears the fixed call/text bar. */}
      <div className="border-t border-white/10 pb-20 md:pb-0">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
            {business.licenseNumber && ` License #${business.licenseNumber}.`}
          </p>
          <p>A {business.parentCompany} venture</p>
        </div>
      </div>
    </footer>
  );
}
