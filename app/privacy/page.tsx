import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { business, emailHref } from "@/data/site";

export const metadata: Metadata = {
  title: `Privacy policy | ${business.name}`,
  description: `How ${business.name} handles the information you send us.`,
  alternates: { canonical: "/privacy" },
};

/*
 * Plain-language policy that matches what the site actually does today: the
 * quote form emails the request through Resend, and Vercel Analytics counts
 * visits without cookies. Update it if either changes.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16 md:py-24">
        <h1 className="h-section">Privacy policy</h1>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink">
          <p>
            This page explains what happens to the information you give{" "}
            {business.name} through this website.
          </p>

          <h2>What we collect</h2>
          <p>
            When you request a quote we receive what you type into the form:
            your name, phone number, email if you give one, the property address
            and details about the job. We do not ask for payment details on this
            site.
          </p>

          <h2>How we use it</h2>
          <p>
            Only to reply to your request, prepare a quote and schedule the
            work. We do not sell or share your information with anyone for
            marketing.
          </p>

          <h2>Services we rely on</h2>
          <p>
            Quote requests are delivered to our inbox by email through Resend.
            Visits to the site are counted with Vercel Analytics, which does not
            use cookies or track you across other sites.
          </p>

          <h2>Your choices</h2>
          <p>
            To see, correct or delete what you sent us, email{" "}
            <a href={emailHref} className="font-semibold text-accent-text underline underline-offset-4">
              {business.email}
            </a>{" "}
            or call {business.phone.display}.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
