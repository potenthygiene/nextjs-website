import MenstrualCupPageClient from "@/app/components/common/Product-detail/MenstrualCupPageClient";
import { ovyCup } from "@/const/productsContent";
import { getProductReviews } from "@/helper";
import { getFullProductDetails } from "@/helper/product/action";
import { productMetadata } from "@/const/seo";

export const dynamic = "force-dynamic";

// Same page as /product-detail/ovy-cup, so it points Google there.
export const metadata = productMetadata("ovy-cup");

export default async function MenstrualCupPage() {
  const slug = "ovy-cup";
  const product = await getFullProductDetails(slug);
  const reviewWithMedia = await getProductReviews(slug);

  return (
    <MenstrualCupPageClient
      product={product || { id: "ovy-cup-db-id", slug: "ovy-cup", name: "Ovy Reusable Menstrual Cup" }}
      reviewWithMedia={reviewWithMedia}
      content={ovyCup}
    />
  );
}
