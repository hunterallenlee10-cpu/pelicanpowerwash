import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
import { ScrollStory } from "@/components/story/ScrollStory";
import { InstantPrice } from "@/components/story/InstantPrice";
import { MethodGauge } from "@/components/story/MethodGauge";
import { WashGame } from "@/components/story/WashGame";

/*
 * The one-page site. Section ids are the nav targets: top (the scroll story),
 * instant-price, work, methods, try-the-wand, services, pricing, process,
 * about, testimonials, service-areas, faq, quote-form.
 *
 * Conversion first: the price builder sits straight after the hero, and the
 * quote bar (app/layout.tsx) keeps a quote button in reach everywhere.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ScrollStory />
        <TrustBar />
        <InstantPrice />
        <Work />
        <MethodGauge />
        <WashGame />
        <Services />
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
