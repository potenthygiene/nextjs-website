import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { product, productFaq } from "@/db/schema";
import { FAQ_GROUPS } from "@/const/generalFaqs";
import { ARTICLES } from "@/const/journal";
import { fixProductFaq } from "@/lib/contentFixes";
import { resolveCanonicalSlug } from "@/lib/productSlugs";
import type { ChatAnswer, ChatTopic } from "@/const/chatbot/types";

// Extra chat answers read from the live site, so the chat keeps up when
// content changes: product FAQs from the database (admin edits show within an
// hour), the general FAQ page, and every Journal article's FAQs.
export const revalidate = 3600;

const PRODUCT_TOPIC: Record<string, ChatTopic> = {
  "ovy-pads": "ovy-pads",
  "ovy-liners": "ovy-liners",
  "ovy-panty": "ovy-panty",
  "ovy-teen": "ovy-teen",
  "ovy-cup": "ovy-cup",
  "looway-pee-funnel": "looway-funnel",
  "looway-pee-puke": "looway-bags",
  "looway-toilet-seat-covers": "looway-seat-covers",
};

const clean = (text: string) =>
  String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const shorten = (text: string, words = 90) => {
  const parts = text.split(" ");
  return parts.length > words ? `${parts.slice(0, words).join(" ")}…` : text;
};

function entry(id: string, topic: ChatTopic, q: string, a: string, links: ChatAnswer["links"]): ChatAnswer {
  const question = clean(q);
  return {
    id,
    topic,
    question: question.length > 90 ? `${question.slice(0, 87)}…` : question,
    phrasings: [question],
    keywords: [],
    answer: shorten(clean(a)),
    links,
  };
}

async function productFaqs(): Promise<ChatAnswer[]> {
  const rows = await db
    .select({ slug: product.slug, name: product.name, question: productFaq.question, answer: productFaq.answer })
    .from(productFaq)
    .innerJoin(product, eq(productFaq.productId, product.id));

  return rows.map((r, i) => {
    const slug = resolveCanonicalSlug(r.slug);
    const fixed = fixProductFaq({ question: r.question, answer: r.answer });
    return entry(`dyn-p-${slug}-${i}`, PRODUCT_TOPIC[slug] || "brand", fixed.question || "", fixed.answer || "", [
      { label: "See the product", href: `/product-detail/${slug}` },
    ]);
  });
}

export async function GET() {
  const general: ChatAnswer[] = FAQ_GROUPS.flatMap((g) =>
    g.faqs.map((f) => entry(`dyn-faq-${f.id}`, "orders", f.q, f.a, f.links?.slice(0, 2) || [{ label: "All FAQs", href: "/faq" }])),
  );

  const journal: ChatAnswer[] = ARTICLES.flatMap((a) =>
    a.faqs.map((f, i) =>
      entry(`dyn-j-${a.slug}-${i}`, a.category === "Travel Hygiene" ? "travel" : "health", f.q, f.a, [
        { label: "Read the guide", href: `/blog/${a.slug}` },
      ]),
    ),
  );

  let products: ChatAnswer[] = [];
  try {
    products = await productFaqs();
  } catch (error) {
    console.error("chat-knowledge product FAQs failed:", error);
  }

  return NextResponse.json(
    { answers: [...products, ...general, ...journal] },
    { headers: { "Cache-Control": "public, max-age=600, s-maxage=3600" } },
  );
}
