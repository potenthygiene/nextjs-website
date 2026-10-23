import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { product, productFaq, productVariant } from "@/db/schema";
import { fixHighlights } from "@/lib/contentFixes";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/shippingConfig";
import * as R from "@/lib/rewards";
import { couponConditions, couponConditionsHi, liveCoupons } from "@/const/coupons";
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

// Live product facts for the chat's product cards: prices, sizes, stock,
// highlights and subscription savings, straight from the database.
async function liveProducts() {
  const [products, variants] = await Promise.all([
    db.select().from(product),
    db
      .select({
        id: productVariant.id,
        productId: productVariant.productId,
        name: productVariant.name,
        sku: productVariant.sku,
        price: productVariant.price,
        inStock: productVariant.isInStock,
        image: productVariant.bannerImage,
      })
      .from(productVariant),
  ]);
  return products.map((p) => {
    const vs = variants.filter((v) => v.productId === p.id && Number(v.price) > 0);
    const prices = vs.map((v) => Number(v.price));
    return {
      id: p.id,
      dbSlug: p.slug,
      image: p.bannerImage,
      isMixBox: !!p.isMixBox,
      slug: resolveCanonicalSlug(p.slug),
      name: p.name,
      brand: p.brand === "loway" ? "Looway" : "Ovy",
      fromPrice: prices.length ? Math.min(...prices) : null,
      variants: vs.map((v) => ({ id: v.id, sku: v.sku, image: v.image, name: v.name, price: Number(v.price), inStock: v.inStock !== false })),
      inStock: vs.length ? vs.some((v) => v.inStock !== false) : true,
      highlights: fixHighlights(p.highlights).slice(0, 3),
      subscription: p.allowSubscription ? { monthly: p.subscribeMonthlyDiscount || 0, everyTwoMonths: p.subscribeBiMontlyDiscount || 0 } : null,
      cycleSync: p.allowCycleSync && p.cycleSyncDiscount ? p.cycleSyncDiscount : 0,
    };
  });
}

const OFFERS = {
  freeDeliveryFrom: FREE_SHIPPING_THRESHOLD,
  deliveryFee: STANDARD_SHIPPING_FEE,
  rewards: {
    joining: R.SIGNUP_BONUS_RUPEES,
    orderBackPercent: Math.round(R.ORDER_REWARD_RATE * 100),
    birthday: R.BIRTHDAY_REWARD_RUPEES,
    review: Math.max(R.REVIEW_TEXT_REWARD_RUPEES, R.REVIEW_PHOTO_REWARD_RUPEES),
    referralYou: R.REFERRAL_EARNING_RUPEES,
    referralFriend: R.REFERRAL_FRIEND_BONUS_RUPEES,
    referralMinOrder: R.REFERRAL_MIN_ORDER_AMOUNT,
    maxRedeemPerOrder: R.MAX_REWARD_REDEEM_PER_ORDER,
    maxRedeemPercent: Math.round(R.MAX_REWARD_REDEEM_PERCENT * 100),
  },
};

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
  let catalog: Awaited<ReturnType<typeof liveProducts>> = [];
  try {
    [products, catalog] = await Promise.all([productFaqs(), liveProducts()]);
  } catch (error) {
    console.error("chat-knowledge product data failed:", error);
  }

  return NextResponse.json(
    {
      answers: [...products, ...general, ...journal],
      products: catalog,
      offers: {
        ...OFFERS,
        coupons: liveCoupons().map((c) => ({
          code: c.code,
          description: c.description,
          conditions: couponConditions(c),
          descriptionHi: c.descriptionHi,
          conditionsHi: couponConditionsHi(c),
          minDifferentProducts: c.minDifferentProducts || 0,
          firstOrderOnly: !!c.firstOrderOnly,
          kind: c.kind,
          minimumOrderValue: c.minimumOrderValue,
          percent: c.percent ?? null,
          flat: c.flat ?? null,
          maximumDiscountAmount: c.maximumDiscountAmount,
          pitch: c.pitch,
          pitchHi: c.pitchHi,
        })),
      },
    },
    { headers: { "Cache-Control": "public, max-age=600, s-maxage=3600" } },
  );
}
