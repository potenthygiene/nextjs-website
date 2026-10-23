import { pageMetadata } from "@/const/seo";
import { Hero } from "@/app/components/common/homepage/HeroSection";
import { BrandAccordion } from "@/app/components/common/homepage/Brand";
import BestsellingProducts from "@/app/components/common/homepage/BestSellingProduct";
import { CategoryGrid } from "@/app/components/common/homepage/CategorySection";
import { WhyChooseUs } from "@/app/components/common/homepage/WhyChooseUs";
import StoryTruth from "@/app/components/common/homepage/StoryTruth";
import { OurStory } from "@/app/components/common/homepage/OurStory";
import AboutStory from "@/app/components/common/homepage/AboutStory";
import { YatraKitPromo } from "@/app/components/common/homepage/YatraKitPromo";
import { JournalSection } from "@/app/components/common/homepage/JournalSection";
import { FounderStory } from "@/app/components/common/homepage/FounderStory";
import { PadSharedImpact } from "@/app/components/common/homepage/PadSharedImpact";
import { InstagramFeed } from "@/app/components/common/homepage/InstaFeed";
import { ClosingCta } from "@/app/components/common/homepage/ClosingCta";
import { Newsletter } from "@/app/components/common/homepage/NewsLetter";
import { OffersBand } from "@/app/components/common/offers/Offers";

export const metadata = pageMetadata("home");

// Homepage order, phone first. The top half is for the visitor who came to
// buy, the bottom half for the one who came to learn:
//   1. Hero: what we are, one primary and one secondary button, trust row
//   2. Shop by brand (Ovy, Looway, free Period Tracker)
//   3. Bestsellers with Add to bag (live catalogue and prices)
//   4. Offers running now (live coupons)
//   5. Shop by moment or by category, for the visitor who is not sure
//   6. Why buy direct: only-here features and the claims we can prove
//   7. Product stories, each with its own button: first period, cup,
//      Mix Your Box with Cycle-Sync, Yatra Kit
//   8. Learn: Journal, Period Tracker and the quiz
//   9. Founder story, give-back, community
//  10. Closing call to action, then the newsletter
export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white">
      <Hero />
      <BrandAccordion />
      <BestsellingProducts title="The ones everyone comes back for." brand={null} />
      <OffersBand title="Offers running now" />
      <CategoryGrid />
      <WhyChooseUs />

      <StoryTruth />
      <OurStory />
      <AboutStory />
      <YatraKitPromo />

      <JournalSection />
      <FounderStory />
      <PadSharedImpact />
      <InstagramFeed
        theme="teal"
        title="Join our community."
        username="@potenthygiene"
      />
      <ClosingCta />
      <Newsletter />
    </main>
  );
}
