import type { MetadataRoute } from "next";
import { SITE_URL } from "@/const/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api/",
          "/cart",
          "/checkout",
          "/order-confirmation",
          "/login",
          "/signup",
          "/reset-password",
          "/email-verification",
          "/test",
          "/testing-templates",
          "/suggested-products",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
