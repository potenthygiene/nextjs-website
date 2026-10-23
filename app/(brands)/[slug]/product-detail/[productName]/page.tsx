import { notFound, permanentRedirect } from "next/navigation";
import { PRODUCT_SEO } from "@/const/seo";
import { resolveCanonicalSlug } from "@/lib/productSlugs";
import { getProductOnce } from "@/lib/productCache";

export const dynamic = "force-dynamic";

// Old brand-prefixed product addresses (/ovy/product-detail/x) duplicated the
// main product page. Send them to the one canonical address instead.
// next.config.ts redirects these first; this is the fallback.
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; productName: string }>;
}) {
  const { productName } = await params;
  const canonicalSlug = resolveCanonicalSlug(productName);
  if (PRODUCT_SEO[canonicalSlug] || (await getProductOnce(canonicalSlug))) {
    permanentRedirect(`/product-detail/${canonicalSlug}`);
  }
  notFound();
}
