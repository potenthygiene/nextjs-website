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
import { Newsletter } from "@/app/components/common/homepage/NewsLetter";
import { OffersBand } from "@/app/components/common/offers/Offers";
import { CONTAINER, HOME_Y } from "@/app/components/common/homepage/homeStyles";

export const metadata = pageMetadata("home");

// Homepage order, phone first. The top half is for the visitor who came to
// buy, the bottom half for the one who came to learn:
//   1. Hero: what we are, one primary and one secondary button, trust row
//      (ships in 24 to 48 hours, free delivery on ₹399 and above, prices
//      include GST)
//   2. Shop by brand (Ovy, Looway, free Period Tracker)
//   3. Bestsellers with Add to bag and Shop all (live catalogue and prices)
//   4. Offers running now (live coupons)
//   5. Shop by moment or by category, for the visitor who is not sure
//   6. Why buy direct: only-here features and the claims we can prove
//   7. Product stories, each with its own button: first period, then the
//      cup and Mix Your Box with Cycle-Sync side by side, then Yatra Kit
//   8. Learn: Journal, Period Tracker and the quiz
//   9. Founder story, give-back, community
//  10. Newsletter
// The old "Still deciding?" band is gone: its quiz button lives in the hero
// and the Learn band, Shop all in the bestsellers and founder bands, and its
// three delivery facts in the hero trust row.
export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white">
      <Hero />
      <BrandAccordion />
      <BestsellingProducts title="The ones everyone comes back for." brand={null} compact />
      <OffersBand title="Offers running now" />
      <CategoryGrid />
      <WhyChooseUs />

      <StoryTruth compact />
      {/* Cup and Mix Your Box as two cards in one band */}
      <section className={`w-full bg-white ${HOME_Y}`}>
        <div className={`${CONTAINER} grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2`}>
          <OurStory variant="card" />
          <AboutStory variant="card" />
        </div>
      </section>
      <YatraKitPromo />

      <JournalSection />
      <FounderStory />
      <PadSharedImpact compact />
      <InstagramFeed
        theme="teal"
        title="Join our community."
        username="@potenthygiene"
        compact
      />
      <Newsletter compact />
    </main>
  );
}
