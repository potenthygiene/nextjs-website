/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { PRODUCT_SEO, SITE_URL } from "@/const/seo";
import { getImageUrl } from "@/lib/imageUrl";
import { resolveCanonicalSlug } from "@/lib/productSlugs";
import { getProductOnce } from "@/lib/productCache";

function absolute(src?: string | null) {
  if (!src) return null;
  const url = getImageUrl(src);
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

// Product facts for Google Shopping, rich results and AI assistants, built
// from the live database so prices and stock are always current. No star
// ratings are included until the reviews behind them are real and verified.
function productJsonLd(product: any, slug: string) {
  const url = `${SITE_URL}/product-detail/${slug}`;
  const seo = PRODUCT_SEO[slug];
  const variants: any[] = (product.productVariants || []).filter((v: any) => Number(v.price) > 0);
  const brand = product.brand === "loway" ? "Looway" : "Ovy";
  const images = [
    product.bannerImage,
    ...(product.productMediaRes || []).map((m: any) => m.mediaURL),
  ]
    .map(absolute)
    .filter(Boolean)
    .slice(0, 6);
  const description = String(seo?.description || product.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
  const availability = (inStock: boolean) =>
    inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IN",
    returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  };
  const shipping = {
    "@type": "OfferShippingDetails",
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      // "Usually delivered in 5 to 7 days."
      handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 4, maxValue: 5, unitCode: "DAY" },
    },
  };
  const seller = { "@id": `${SITE_URL}/#organization` };

  const offers =
    variants.length > 1
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: Math.min(...variants.map((v) => Number(v.price))),
          highPrice: Math.max(...variants.map((v) => Number(v.price))),
          offerCount: variants.length,
          availability: availability(variants.some((v) => v.isInStock !== false)),
          url,
          seller,
          offers: variants.map((v) => ({
            "@type": "Offer",
            name: v.name,
            sku: v.sku,
            price: Number(v.price),
            priceCurrency: "INR",
            availability: availability(v.isInStock !== false),
            itemCondition: "https://schema.org/NewCondition",
            url,
            seller,
            hasMerchantReturnPolicy: returnPolicy,
            shippingDetails: shipping,
          })),
        }
      : variants.length === 1
        ? {
            "@type": "Offer",
            sku: variants[0].sku,
            price: Number(variants[0].price),
            priceCurrency: "INR",
            availability: availability(variants[0].isInStock !== false),
            itemCondition: "https://schema.org/NewCondition",
            url,
            seller,
            hasMerchantReturnPolicy: returnPolicy,
            shippingDetails: shipping,
          }
        : undefined;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      name: seo?.title || product.name,
      description,
      url,
      image: images.length ? images : undefined,
      sku: variants[0]?.sku,
      brand: { "@type": "Brand", name: brand },
      manufacturer: seller,
      countryOfOrigin: "IN",
      category: brand === "Ovy" ? "Feminine hygiene > Period care" : "Personal hygiene > Travel hygiene",
      offers,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
        { "@type": "ListItem", position: 3, name: brand, item: `${SITE_URL}/${brand.toLowerCase()}` },
        { "@type": "ListItem", position: 4, name: seo?.title || product.name, item: url },
      ],
    },
  ];
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalSlug(slug);
  const product = await getProductOnce(canonicalSlug);

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, canonicalSlug)) }}
        />
      )}
      {children}
    </>
  );
}
