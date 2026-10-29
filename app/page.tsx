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
import { HowWeWork } from "@/components/story/HowWeWork";
import { driveStory, houseStory } from "@/data/story";

/*
 * The one-page site, in the order of a scroll-through:
 * driveway story (hero) -> try the wand -> house & roof story ->
 * before/after -> pressure gauge -> instant quote -> how we work ->
 * then the reference sections (services, packages, process, about, area,
 * FAQ, quote form). The bottom quote bar (app/layout.tsx) is always in reach.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ScrollStory story={driveStory} heading="h1" />
        <WashGame />
        <ScrollStory story={houseStory} heading="h2" />
        <Work />
        <MethodGauge />
        <InstantPrice />
        <HowWeWork />
        <TrustBar />
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
