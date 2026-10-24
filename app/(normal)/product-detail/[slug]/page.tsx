/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Product from "../../../components/common/Product-detail/product";
import TrustBadges from "../../../components/common/Product-detail/trustbadges";
import AboutProduct from "../../../components/common/Product-detail/aboutproduct";
import ProductReviews from "../../../components/common/Product-detail/productreview";
import { getProductReviews } from "@/helper";
import { getFullProductDetails, getProductSimilarProducts } from "@/helper/product/action";
import {
  lowayProductDetailsPage,
  ovyProductDetailsPage,
} from "@/const/globalconst";
import SeatCoversPageClient from "@/app/components/common/Product-detail/SeatCoversPageClient";
import MenstrualCupPageClient from "@/app/components/common/Product-detail/MenstrualCupPageClient";
import OvyTeenPageClient from "@/app/components/common/Product-detail/OvyTeenPageClient";
import PeePukeBagsPageClient from "@/app/components/common/Product-detail/PeePukeBagsPageClient";
import PeeFunnelPageClient from "@/app/components/common/Product-detail/PeeFunnelPageClient";
import ProductFaqSection from "@/app/components/common/Product-detail/ProductFaqSection";
import {
  loowayPeePuke,
  loowayPeeFunnel,
  loowayToiletSeatCovers,
  ovyCup,
  ovyTeen,
  PRODUCTS_STATIC_CONTENT,
} from "@/const/productsContent";
import { PRODUCT_SEO, productMetadata } from "@/const/seo";
import { resolveCanonicalSlug } from "@/lib/productSlugs";
import { getProductOnce } from "@/lib/productCache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalSlug(slug);
  // Unknown product: answer with a real 404 (search engines get the metadata
  // before the page streams, so this sets the status for them).
  if (!PRODUCT_SEO[canonicalSlug] && !(await getProductOnce(canonicalSlug))) {
    notFound();
  }
  return productMetadata(canonicalSlug);
}

export default async function Page({ params }: any) {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalSlug(slug);

  // The teen page also shows four other products; start loading them now.
  const routineSlugs = ["ovy-cup", "ovy-pads", "ovy-liners", "looway-toilet-seat-covers"];
  const routineEntriesPromise =
    canonicalSlug === "ovy-teen"
      ? Promise.all(
          routineSlugs.map(async (rSlug) => {
            try {
              return [rSlug, await getFullProductDetails(rSlug)] as const;
            } catch {
              return [rSlug, null] as const;
            }
          }),
        )
      : null;

  const [product, reviewWithMedia, similarProducts] = await Promise.all([
    getProductOnce(canonicalSlug),
    getProductReviews(canonicalSlug),
    getProductSimilarProducts(canonicalSlug),
  ]);

  if (canonicalSlug === "looway-pee-funnel") {
    return (
      <PeeFunnelPageClient
        product={
          product || {
            slug: "looway-pee-funnel",
            name: "Looway Reusable Female Pee Funnel",
          }
        }
        reviewWithMedia={reviewWithMedia}
        content={loowayPeeFunnel}
      />
    );
  }

  if (canonicalSlug === "looway-pee-puke") {
    return (
      <PeePukeBagsPageClient
        product={
          product || {
            slug: "looway-pee-puke",
            name: "Looway Pee & Puke Bags: Disposable Urine & Vomit Bags",
          }
        }
        reviewWithMedia={reviewWithMedia}
        content={loowayPeePuke}
      />
    );
  }

  if (canonicalSlug === "looway-toilet-seat-covers") {
    return (
      <SeatCoversPageClient
        product={product || { slug: "looway-toilet-seat-covers", name: "Looway Disposable Toilet Seat Covers" }}
        reviewWithMedia={reviewWithMedia}
        content={loowayToiletSeatCovers}
      />
    );
  }

  if (canonicalSlug === "ovy-cup") {
    return (
      <MenstrualCupPageClient
        product={product || { slug: "ovy-cup", name: "Potent Hygiene Menstrual Cup" }}
        reviewWithMedia={reviewWithMedia}
        content={ovyCup}
      />
    );
  }

  if (canonicalSlug === "ovy-teen" && routineEntriesPromise) {
    const routineEntries = await routineEntriesPromise;
    const ovyProductsMap = Object.fromEntries(routineEntries);

    return (
      <OvyTeenPageClient
        product={product || { slug: "ovy-teen", name: "Ovy Organic Soft Sanitary Pads: Teen" }}
        reviewWithMedia={reviewWithMedia}
        similarProducts={similarProducts || []}
        ovyProductsMap={ovyProductsMap}
        content={ovyTeen}
      />
    );
  }

  if (!product) {
    notFound();
  }

  const themeColor =
    product.brand == "loway" ? lowayProductDetailsPage : ovyProductDetailsPage;

  const productContent =
    PRODUCTS_STATIC_CONTENT[slug] ||
    PRODUCTS_STATIC_CONTENT[product.slug] ||
    null;
  const faqTheme = product.brand === "loway" ? "looway" : "ovy";

  return (
    <div className="container">
      <div className="">
        <Product
          // categoryName={catetoryName}
          // variants={product}
          productInfo={product}
          themeColor={themeColor}
          reviews={reviewWithMedia}
        />
        <TrustBadges themeColor={themeColor} />
        <AboutProduct variant={product} themeColor={themeColor} />
        <ProductReviews
          reviews={reviewWithMedia}
          product={product}
          themeColor={themeColor}
        />
        <ProductFaqSection
          theme={faqTheme}
          faqs={product.productFaqRes}
          content={productContent}
        />
      </div>
    </div>
  );
}
