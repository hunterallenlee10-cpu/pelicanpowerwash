import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Reviews } from "@/components/sections/Reviews";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { FAQ } from "@/components/sections/FAQ";
import { QuoteSection } from "@/components/sections/QuoteSection";

/*
 * The one-page site. Section ids are the nav targets: services, work,
 * pricing, process, about, testimonials, service-areas, faq, quote-form.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Work />
        <Pricing />
        <Process />
        <About />
        <Reviews />
        <ServiceArea />
        <FAQ />
        <QuoteSection />
      </main>
      <SiteFooter />
    </>
  );
}
