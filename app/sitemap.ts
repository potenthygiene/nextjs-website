import type { MetadataRoute } from "next";
import { eq, max as sqlMax } from "drizzle-orm";
import { PRODUCT_SEO, PUBLIC_PAGES, SITE_URL } from "@/const/seo";
import { getJournalPosts } from "@/helper/blog/action";
import { db } from "@/lib/db";
import { product, productVariant } from "@/db/schema";
import { resolveCanonicalSlug } from "@/lib/productSlugs";

export const revalidate = 3600;

// Every date here is when the page really last changed, so Google and Bing
// can trust it and recrawl the pages that matter. Never use "now".

const day = (iso?: string | null) => (iso ? new Date(`${iso.slice(0, 10)}T09:00:00+05:30`) : undefined);

function latest(...dates: (Date | undefined | null)[]): Date | undefined {
  const valid = dates.filter((d): d is Date => !!d && !Number.isNaN(d.getTime()));
  return valid.length ? new Date(Math.max(...valid.map((d) => d.getTime()))) : undefined;
}

// Last change per product: the product row or any of its sizes and prices.
async function productChanges(): Promise<Map<string, { brand: string | null; changed?: Date }>> {
  const rows = await db
    .select({
      slug: product.slug,
      brand: product.brand,
      productUpdated: product.updatedAt,
      variantUpdated: sqlMax(productVariant.updatedAt),
    })
    .from(product)
    .leftJoin(productVariant, eq(productVariant.productId, product.id))
    .groupBy(product.slug, product.brand, product.updatedAt);

  return new Map(
    rows.map((r) => [
      // The database uses a few older slugs; key by the address the site shows.
      resolveCanonicalSlug(r.slug),
      { brand: r.brand, changed: latest(r.productUpdated, r.variantUpdated ? new Date(r.variantUpdated) : null) },
    ]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products] = await Promise.all([
    getJournalPosts().catch(() => []),
    productChanges().catch(() => new Map<string, { brand: string | null; changed?: Date }>()),
  ]);

  const newestPost = latest(...posts.map((p) => day(p.isoDate)));
  const allProducts = [...products.values()];
  const newestProduct = latest(...allProducts.map((p) => p.changed));
  const newestOf = (brand: string) => latest(...allProducts.filter((p) => p.brand === brand).map((p) => p.changed));

  const pages: MetadataRoute.Sitemap = PUBLIC_PAGES.map(({ path, updated }) => {
    // Pages that show products or articles change when those do.
    const shows: Record<string, Date | undefined> = {
      "/": latest(newestPost, newestProduct),
      "/shop": newestProduct,
      "/ovy": newestOf("ovy"),
      "/looway": newestOf("loway"),
      "/looway-yatra-kit": newestOf("loway"),
      "/blog": newestPost,
    };
    return {
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: latest(day(updated), shows[path]),
      changeFrequency: "monthly",
      priority:
        path === "/" ? 1 : ["/shop", "/ovy", "/looway", "/looway-yatra-kit"].includes(path) ? 0.9 : 0.5,
    };
  });

  const productPages: MetadataRoute.Sitemap = Object.keys(PRODUCT_SEO).map((slug) => ({
    url: `${SITE_URL}/product-detail/${slug}`,
    lastModified: latest(day("2026-10-22"), products.get(slug)?.changed),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: day(b.isoDate),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...productPages, ...postPages];
}
