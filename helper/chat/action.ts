"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  contactUs,
  order,
  orderItem,
  product,
  productVariant,
  referralCoinHistory,
  review,
  subscriptions,
  users,
  wishlist,
  wishlistItem,
} from "@/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { getAuthSession } from "@/helper/auth/session";
import { allowRequest } from "@/lib/requestGuard";
import { describeRewardHistoryRow, syncAndGetUserRewards } from "@/lib/rewards";

// Saves a question the chat could not answer, so the team can add an answer.
// It lands in Admin → Contact Us as "CHAT QUESTION". Emails and phone
// numbers are removed first so no personal details are stored.
export async function logChatQuestion(question: string, page: string) {
  const text = String(question || "")
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email removed]")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, "[number removed]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  if (text.length < 3) return;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowRequest(`chatlog:${ip}`, 15, 60 * 60_000)) return;

  try {
    await db.insert(contactUs).values({
      name: "CHAT QUESTION",
      email: "chat@potenthygiene.com",
      message: `Asked on ${String(page || "/").slice(0, 80)}: ${text}`,
    });
  } catch (error) {
    console.error("Chat question log failed:", error);
  }
}

/** First name of the signed-in customer, so the chat can greet them. */
export async function getChatFirstName(): Promise<string | null> {
  try {
    const session = await getAuthSession({ refresh: false });
    const email = session.authenticated ? session.user?.email : null;
    if (!email) return null;
    const [row] = await db.select({ name: users.name }).from(users).where(eq(users.email, email)).limit(1);
    const first = row?.name?.trim().split(/\s+/)[0];
    return first ? first[0].toUpperCase() + first.slice(1) : null;
  } catch {
    return null;
  }
}

/** The signed-in customer's latest orders, for "where is my order" in the chat. */
export async function getChatOrders(): Promise<
  { id: string; status: string; date: string; total: number | null; items: number }[] | null
> {
  try {
    const session = await getAuthSession({ refresh: false });
    const email = session.authenticated ? session.user?.email : null;
    if (!email) return null;
    const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (!u) return null;
    const rows = await db
      .select({ id: order.id, status: order.status, createdAt: order.createdAt, total: order.totalAmount })
      .from(order)
      .where(eq(order.userId, u.id))
      .orderBy(desc(order.createdAt))
      .limit(3);
    const counts = rows.length
      ? await db
          .select({ orderId: orderItem.orderId, n: sql<number>`count(*)` })
          .from(orderItem)
          .where(inArray(orderItem.orderId, rows.map((r) => r.id)))
          .groupBy(orderItem.orderId)
      : [];
    return rows.map((r) => ({
      id: r.id,
      status: r.status || "pending",
      date: r.createdAt ? r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }) : "",
      total: r.total,
      items: Number(counts.find((c) => c.orderId === r.id)?.n || 0),
    }));
  } catch {
    return null;
  }
}

export type ChatOrderLine = {
  name: string;
  variant: string;
  slug: string | null;
  productId: string | null;
  variantId: string | null;
  sku: string | null;
  image: string | null;
  price: number | null;
  quantity: number;
};

export type ChatContext = {
  firstName: string | null;
  orders: { id: string; status: string; date: string; daysAgo: number; total: number | null; items: number; lines: ChatOrderLine[] }[];
  /** Delivered products the customer hasn't reviewed yet. */
  toReview: { productId: string; slug: string; name: string }[];
  /** No paid order yet, so first-order coupons apply. */
  firstOrder: boolean;
  /** Joined with a friend's referral link. */
  referred: boolean;
  wishlist: { slug: string; name: string }[];
  activeSubscriptions: number;
  /** Rewards credit: balance and the latest entries, newest first. */
  rewards: { balance: number; history: { title: string; amount: string; date: string; positive: boolean }[] };
};

const PAID = ["paid", "processing", "shipped", "delivered", "completed"];

/**
 * What Potent Saathi knows about the signed-in customer, so it can greet
 * them, show their orders, suggest a repeat order, ask for a review and pick
 * the right coupon. Only for the customer themselves; null when signed out.
 */
export async function getChatContext(): Promise<ChatContext | null> {
  try {
    const session = await getAuthSession({ refresh: false });
    const email = session.authenticated ? session.user?.email : null;
    if (!email) return null;
    const [u] = await db.select({ id: users.id, name: users.name }).from(users).where(eq(users.email, email)).limit(1);
    if (!u) return null;

    const rows = await db
      .select({ id: order.id, status: order.status, createdAt: order.createdAt, total: order.totalAmount })
      .from(order)
      .where(eq(order.userId, u.id))
      .orderBy(desc(order.createdAt))
      .limit(5);
    const ids = rows.map((r) => r.id);
    const lines = ids.length
      ? await db
          .select({
            orderId: orderItem.orderId,
            quantity: orderItem.quantity,
            variantName: orderItem.productVarientName,
            image: orderItem.productVarientImage,
            price: orderItem.productVarientPrice,
            sku: orderItem.productVarientSKU,
            variantId: orderItem.productVariantId,
            productId: productVariant.productId,
            variantLabel: productVariant.name,
            slug: product.slug,
            productName: product.name,
          })
          .from(orderItem)
          .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
          .leftJoin(product, eq(productVariant.productId, product.id))
          .where(inArray(orderItem.orderId, ids))
      : [];

    const now = Date.now();
    const orders = rows.map((r) => {
      const mine = lines.filter((l) => l.orderId === r.id);
      return {
        id: r.id,
        status: r.status || "pending",
        date: r.createdAt ? r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }) : "",
        daysAgo: r.createdAt ? Math.floor((now - r.createdAt.getTime()) / 86_400_000) : 0,
        total: r.total,
        items: mine.reduce((n, l) => n + Number(l.quantity || 1), 0),
        lines: mine.map((l) => ({
          name: l.productName || l.variantName || "Potent product",
          variant: l.variantLabel || "",
          slug: l.slug,
          productId: l.productId,
          variantId: l.variantId,
          sku: l.sku,
          image: l.image,
          price: l.price,
          quantity: Number(l.quantity || 1),
        })),
      };
    });

    const deliveredProducts = new Map<string, { productId: string; slug: string; name: string }>();
    for (const o of orders.filter((o) => o.status === "delivered" || o.status === "completed")) {
      for (const l of o.lines) {
        if (l.productId && l.slug && !deliveredProducts.has(l.productId)) deliveredProducts.set(l.productId, { productId: l.productId, slug: l.slug, name: l.name });
      }
    }
    const reviewed = deliveredProducts.size
      ? await db
          .select({ productId: review.productId })
          .from(review)
          .where(and(eq(review.userId, u.id), inArray(review.productId, [...deliveredProducts.keys()])))
      : [];
    const reviewedIds = new Set(reviewed.map((r) => r.productId));

    const [joined] = await db
      .select({ id: referralCoinHistory.id })
      .from(referralCoinHistory)
      .where(eq(referralCoinHistory.newUserId, u.id))
      .limit(1);

    const saved = await db
      .select({ slug: product.slug, name: product.name })
      .from(wishlistItem)
      .innerJoin(wishlist, eq(wishlistItem.wishlistId, wishlist.id))
      .innerJoin(product, eq(wishlistItem.productId, product.id))
      .where(eq(wishlist.userId, u.id))
      .limit(5);

    const [subs] = await db
      .select({ n: sql<number>`count(*)` })
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, u.id), eq(subscriptions.isActive, true)));

    // Rewards: the same balance checkout uses.
    let rewards: ChatContext["rewards"] = { balance: 0, history: [] };
    try {
      const r = await syncAndGetUserRewards(u.id);
      rewards = {
        balance: Math.max(0, Math.round(Number(r.balance || 0))),
        history: (r.history || []).slice(0, 6).map((h) => {
          const d = describeRewardHistoryRow(h);
          return { title: String(d.title).replace(/\s*[\u2013\u2014]\s*/g, ": "), amount: d.formattedAmount, date: d.formattedDate, positive: d.isPositive };
        }),
      };
    } catch {
      // Orders still show without the rewards part.
    }

    const first = u.name?.trim().split(/\s+/)[0];
    return {
      firstName: first ? first[0].toUpperCase() + first.slice(1) : null,
      orders: orders.slice(0, 3),
      toReview: [...deliveredProducts.values()].filter((p) => !reviewedIds.has(p.productId)).slice(0, 2),
      firstOrder: !rows.some((r) => PAID.includes(String(r.status))),
      referred: !!joined,
      wishlist: saved.map((s) => ({ slug: s.slug, name: s.name || s.slug })),
      activeSubscriptions: Number(subs?.n || 0),
      rewards,
    };
  } catch (error) {
    console.error("Chat context failed:", error);
    return null;
  }
}
