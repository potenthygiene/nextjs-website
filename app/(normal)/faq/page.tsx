import GeneralFaqPage from "@/app/components/common/faq/GeneralFaq";
import { FAQ_GROUPS } from "@/const/generalFaqs";
import { pageMetadata } from "@/const/seo";

export const metadata = pageMetadata("faq");

// FAQPage structured data so Google and AI search can show these answers.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((g) =>
    g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  ),
};

const page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <GeneralFaqPage />
    </>
  );
};

export default page;
