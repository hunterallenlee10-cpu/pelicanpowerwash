import { PelicanHeader } from "@/components/layout/PelicanHeader";
import { PelicanFooter } from "@/components/layout/PelicanFooter";
import { getVentureById } from "@/data/ventures";
import { PelicanAnimatedBackground } from "@/components/pelican/PelicanAnimatedBackground";
import { PelicanHeroSection } from "@/components/pelican/PelicanHeroSection";
import { PelicanTrustStrip } from "@/components/pelican/PelicanTrustStrip";
import { PelicanServicesSection } from "@/components/pelican/PelicanServicesSection";
import { PelicanProcessAndFAQSection } from "@/components/pelican/PelicanProcessAndFAQSection";
import { PelicanWhyChooseSection } from "@/components/pelican/PelicanWhyChooseSection";
import { PelicanOwnerStorySection } from "@/components/pelican/PelicanOwnerStorySection";
import { PelicanPricingSection } from "@/components/pelican/PelicanPricingSection";
import { PelicanServiceAreasSection } from "@/components/pelican/PelicanServiceAreasSection";
import { PelicanTestimonialsSection } from "@/components/pelican/PelicanTestimonialsSection";
import { PelicanQuoteForm } from "@/components/pelican/PelicanQuoteForm";
import { PelicanCTASection } from "@/components/pelican/PelicanCTASection";

export default function PelicanPage() {
  const venture = getVentureById("pelican");

  if (!venture) {
    return <div>Venture not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <PelicanAnimatedBackground />
      <PelicanHeader />

      <main className="pt-20 relative z-10">
        <PelicanHeroSection venture={venture} />
        <PelicanTrustStrip venture={venture} />
        <PelicanServicesSection venture={venture} />
        {/* Wrapper ids are the header/footer nav targets; PelicanServicesSection
            carries its own #services id, so it needs no wrapper. */}
        <div id="process">
          <PelicanProcessAndFAQSection venture={venture} />
        </div>
        <PelicanWhyChooseSection venture={venture} />
        <PelicanOwnerStorySection venture={venture} />
        <div id="pricing">
          <PelicanPricingSection venture={venture} />
        </div>
        <div id="service-areas">
          <PelicanServiceAreasSection venture={venture} />
        </div>
        <div id="testimonials">
          <PelicanTestimonialsSection venture={venture} />
        </div>
        <div id="quote-form">
          <PelicanQuoteForm venture={venture} />
        </div>
        <PelicanCTASection venture={venture} />
      </main>

      <div className="relative z-10">
        <PelicanFooter />
      </div>
    </div>
  );
}
