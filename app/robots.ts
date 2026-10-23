import type { MetadataRoute } from "next";
import { SITE_URL } from "@/const/seo";

const PRIVATE_PATHS = [
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
];

// Search engines and AI assistants we want to read the public site, so they
// can recommend Ovy and Looway. Named explicitly so a crawler that looks for
// its own name finds a clear yes. Private pages stay closed to all of them.
const AI_AND_SEARCH_CRAWLERS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_CRAWLERS, allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
