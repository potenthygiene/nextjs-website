import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, SITE_URL } from "@/const/seo";
import { getBlogs } from "@/helper/blog/action";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/product-detail") ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/product-detail") ||
            ["/shop", "/ovy", "/looway", "/looway-yatra-kit"].includes(path)
          ? 0.9
          : 0.5,
  }));

  let posts: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getBlogs();
    posts = blogs
      .filter((b: any) => b.slug && b.isPublished !== false)
      .map((b: any) => ({
        url: `${SITE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt || b.createdAt || now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {
    // The sitemap still lists every page if the blog list cannot be read.
  }

  return [...pages, ...posts];
}
