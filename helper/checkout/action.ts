// @ts-nocheck
"use server";

import {
  cart,
  cartItem,
  coupon,
  couponTransaction,
  order,
  product,
  productVariant,
  referralCoinHistory,
} from "@/db/schema";
import {
  COMBINED_CAP,
  couponConditions,
  couponRules,
  groupOf,
  isCouponLive,
  joinCodes,
  parseCodes,
  RETIRED_CODES,
  STORE_COUPONS,
  stackNote,
  stackProblem,
} from "@/const/coupons";
import { db } from "@/lib/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import { requireUserWithRefresh } from "../user/action";
import { calculateMixBoxPricing, type MixBoxRecipe } from "@/lib/mixYourBox";
import { getProductMaxQuantity } from "@/lib/productQuantityLimits";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE as SHIPPING_FEE,
  calculateShippingFee as calculateShipping,
} from "@/lib/shippingConfig";
import {
  MAX_REWARD_REDEEM_PERCENT,
  MAX_REWARD_REDEEM_PER_ORDER,
  syncAndGetUserRewards,
} from "@/lib/rewards";
import { ensureDefaultCoupons } from "@/helper/coupon/action";

const roundMoney = (amount: number) => Number(amount.toFixed(2));

async function getUserCartItems(userId: string) {
  const userCart = await db
    .select()
    .from(cart)
    .where(eq(cart.userId, userId))
    .then((rows) => rows[0]);

  if (!userCart) return [];

  const items = await db
    .select({
      productId: cartItem.productId,
      productVariantId: cartItem.productVariantId,
      mixBoxRecipe: cartItem.mixBoxRecipe,
      totalPads: cartItem.totalPads,
      boxCount: cartItem.boxCount,
      freeLiners: sql<number>`COALESCE(${cartItem.boxCount}, 0) * 4`,
      quantity: cartItem.quantity,
      title: product.name,
      variantName: productVariant.name,
      image: sql<string>`COALESCE(${productVariant.bannerImage}, ${product.bannerImage})`,
      price: sql<number>`COALESCE(${productVariant.price}, 0)`,
      originalPrice: productVariant.strikethroughPrice,
      slug: product.slug,
      sku: productVariant.sku,
      isInStock: productVariant.isInStock,
      maxQuantityPurchase: product.maxQuantityPurchase,
    })
    .from(cartItem)
    .leftJoin(product, eq(cartItem.productId, product.id))
    .leftJoin(productVariant, eq(cartItem.productVariantId, productVariant.id))
    .where(eq(cartItem.cartId, userCart.id));

  return items.map((item) => {
    const isYatra = Boolean(
      item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit",
    );
    const yatraData = isYatra ? (item.mixBoxRecipe as any) : null;
    const yatraPrice =
      yatraData?.items?.reduce(
        (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.qty || 0),
        0,
      ) || Number(item.price || 0);

    return {
      ...item,
      quantity: item.quantity ?? 1,
      price: isYatra ? yatraPrice : (item.price ?? 0),
      title: isYatra ? "Looway Yatra Kit" : item.title,
      variantName: isYatra ? yatraData.kitName : item.variantName,
      image: isYatra ? "/looway/yatra-kit-thumb-v2.png" : item.image,
      yatraKit: yatraData,
      mixBoxRecipe: isYatra ? undefined : item.mixBoxRecipe,
    };
  });
}

// How many different products are in the bag (sizes of one product count once).
function differentProducts(items: any[]) {
  return new Set(items.map((i) => i.productId || i.productSlug || i.slug || i.title).filter(Boolean)).size;
}

async function getValidCoupon({
  code,
  userId,
  subtotal,
  items = [],
}: {
  code?: string | null;
  userId: string;
  subtotal: number;
  items?: any[];
}) {
  const normalizedCode = code?.trim().toUpperCase();
  if (!normalizedCode) return { couponInfo: null, error: null };

  if (RETIRED_CODES.includes(normalizedCode)) {
    return { couponInfo: null, error: "Invalid coupon code" };
  }

  // Extra rules from const/coupons.ts: dates, bag size, first order only.
  const rules = couponRules(normalizedCode);
  if (rules) {
    if (!isCouponLive(rules)) {
      return { couponInfo: null, error: "This coupon isn't active right now" };
    }
    if (rules.minDifferentProducts && differentProducts(items) < rules.minDifferentProducts) {
      return {
        couponInfo: null,
        error: `Add ${rules.minDifferentProducts} or more different products to use ${normalizedCode}`,
      };
    }
    if (rules.firstOrderOnly && userId) {
      const previous = await db
        .select({ id: order.id })
        .from(order)
        .where(
          and(
            eq(order.userId, userId),
            inArray(order.status, ["paid", "processing", "shipped", "delivered", "completed"]),
          ),
        )
        .limit(1);
      if (previous.length) {
        return { couponInfo: null, error: `${normalizedCode} is for your first order only` };
      }
    }
    // Friends who joined with someone's referral link.
    if (rules.referredOnly) {
      const joined = userId
        ? await db
            .select({ id: referralCoinHistory.id })
            .from(referralCoinHistory)
            .where(eq(referralCoinHistory.newUserId, userId))
            .limit(1)
        : [];
      if (!joined.length) {
        return { couponInfo: null, error: `${normalizedCode} is for friends who joined with a referral link` };
      }
    }
    // Once for every referred friend whose first order has been delivered.
    if (rules.referrerOnly) {
      const friends = userId
        ? await db
            .selectDistinct({ id: referralCoinHistory.newUserId })
            .from(referralCoinHistory)
            .where(eq(referralCoinHistory.userId, userId))
        : [];
      const friendIds = friends.map((f) => f.id).filter((id): id is string => !!id && id !== userId);
      const delivered = friendIds.length
        ? await db
            .selectDistinct({ userId: order.userId })
            .from(order)
            .where(and(inArray(order.userId, friendIds), inArray(order.status, ["delivered", "completed"])))
        : [];
      const [used] = await db
        .select({ n: sql<number>`count(*)` })
        .from(couponTransaction)
        .where(and(eq(couponTransaction.userId, userId), eq(couponTransaction.code, normalizedCode)));
      if (delivered.length <= Number(used?.n || 0)) {
        return {
          couponInfo: null,
          error: `${normalizedCode} unlocks when a friend you referred gets their first order delivered`,
        };
      }
    }
  }

  await ensureDefaultCoupons();

  const couponRows = await db
    .select()
    .from(coupon)
    .where(eq(coupon.code, normalizedCode));

  const couponInfo = couponRows[0];
  if (!couponInfo) {
    return { couponInfo: null, error: "Invalid coupon code" };
  }

  if (subtotal < couponInfo.minimumOrderValue) {
    return {
      couponInfo: null,
      error: `Minimum order value for this coupon is ₹${couponInfo.minimumOrderValue}`,
    };
  }

  if (couponInfo.useOnce) {
    const existingUsage = await db
      .select({ id: couponTransaction.id })
      .from(couponTransaction)
      .where(
        and(
          eq(couponTransaction.userId, userId),
          eq(couponTransaction.couponId, couponInfo.id),
        ),
      )
      .limit(1);

    if (existingUsage.length > 0) {
      return {
        couponInfo: null,
        error: "This coupon can only be used once",
      };
    }
  }

  return { couponInfo, error: null };
}

type ValidCoupon = NonNullable<Awaited<ReturnType<typeof getValidCoupon>>["couponInfo"]>;

/**
 * One or two coupons ("STOCKUP80+FIRSTCARE15"). Each is checked on its own,
 * then the pair is checked against the combining rules in const/coupons.ts.
 * Each discount is worked out on the bag total; together they take at most
 * COMBINED_CAP of the bag.
 */
async function getValidCoupons({
  code,
  userId,
  subtotal,
  items = [],
}: {
  code?: string | null;
  userId: string;
  subtotal: number;
  items?: any[];
}): Promise<{ parts: { info: ValidCoupon; discount: number }[]; total: number; error: string | null }> {
  const codes = parseCodes(code);
  if (!codes.length) return { parts: [], total: 0, error: null };
  const infos: ValidCoupon[] = [];
  for (const c of codes) {
    const { couponInfo, error } = await getValidCoupon({ code: c, userId, subtotal, items });
    if (error || !couponInfo) return { parts: [], total: 0, error: codes.length > 1 ? `${c}: ${error || "Invalid coupon code"}` : error || "Invalid coupon code" };
    infos.push(couponInfo);
  }
  if (infos.length === 2) {
    const a = couponRules(infos[0].code);
    const b = couponRules(infos[1].code);
    const problem = a && b ? stackProblem(a, b) : "These coupons can't be used together";
    if (problem) return { parts: [], total: 0, error: problem };
  }
  // Store coupon first, then the personal one that adds on to it.
  infos.sort((x, y) => Number(["welcome", "referrer"].includes(couponRules(x.code)?.kind || "")) - Number(["welcome", "referrer"].includes(couponRules(y.code)?.kind || "")));
  const parts = infos.map((info) => {
    let d = info.isDiscountPercentage ? subtotal * ((info.discountPercentage ?? 0) / 100) : (info.discountFixedAmount ?? 0);
    if (info.maximumDiscountAmount > 0) d = Math.min(d, info.maximumDiscountAmount);
    return { info, discount: roundMoney(Math.min(d, subtotal)) };
  });
  let total = roundMoney(parts.reduce((n, p) => n + p.discount, 0));
  if (parts.length > 1) {
    const cap = roundMoney(subtotal * COMBINED_CAP);
    if (total > cap) {
      const last = parts[parts.length - 1];
      last.discount = roundMoney(Math.max(0, last.discount - (total - cap)));
      total = cap;
    }
  }
  return { parts, total, error: null };
}

const couponSummary = (parts: { info: ValidCoupon; discount: number }[]) => {
  if (!parts.length) return null;
  const first = parts[0].info;
  return {
    id: first.id,
    name: parts.map((p) => p.info.name).join(" + "),
    // The code sent back to pay: "A+B" when two coupons are used.
    code: joinCodes(parts.map((p) => p.info.code)),
    description: parts.map((p) => p.info.description).filter(Boolean).join(" · "),
    isDiscountPercentage: first.isDiscountPercentage,
    discountPercentage: first.discountPercentage,
    discountFixedAmount: first.discountFixedAmount,
    minimumOrderValue: Math.max(...parts.map((p) => p.info.minimumOrderValue || 0)),
    maximumDiscountAmount: first.maximumDiscountAmount,
    useOnce: first.useOnce,
  };
};

export async function calculateCheckoutPricingForUser({
  userId,
  couponCode,
  customItems,
}: {
  userId: string;
  couponCode?: string | null;
  customItems?: any[];
}) {
  const rawItems =
    customItems && customItems.length > 0
      ? customItems
      : await getUserCartItems(userId);

  const items = rawItems.map((item) => {
    const isYatra = Boolean(
      item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit"),
    );
    if (!isYatra) return item;
    const yatraData = item.yatraKit || (item.mixBoxRecipe as any);
    const yatraPrice =
      yatraData?.items?.reduce(
        (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.qty || 0),
        0,
      ) || Number(item.price || 0);

    return {
      ...item,
      quantity: item.quantity ?? 1,
      price: yatraPrice,
      title: "Looway Yatra Kit",
      variantName: yatraData.kitName || item.variantName,
      image: item.image || "/looway/yatra-kit-thumb-v2.png",
      yatraKit: yatraData,
      mixBoxRecipe: undefined,
    };
  });

  for (const item of items) {
    if (!item.mixBoxRecipe || (item.mixBoxRecipe as any).type === "yatraKit") continue;

    const pricing = calculateMixBoxPricing({
      recipe: item.mixBoxRecipe as MixBoxRecipe,
      setPrice: Number(item.price || 0),
      purchaseType: "one_time",
      subscriptionType: null,
    });

    if (!pricing.valid) {
      return {
        success: false,
        message: pricing.message,
        items,
        subtotal: 0,
        discount: 0,
        discountedSubtotal: 0,
        gst: 0,
        shipping: 0,
        final: 0,
        coupon: null,
      };
    }
  }

  for (const item of items) {
    let itemOutOfStock = item.isInStock === false;
    if (!itemOutOfStock && !item.productVariantId && item.productId) {
      const pVariants = await db
        .select({ isInStock: productVariant.isInStock })
        .from(productVariant)
        .where(eq(productVariant.productId, item.productId));
      if (pVariants.length > 0 && pVariants.every((pv) => pv.isInStock === false)) {
        itemOutOfStock = true;
      }
    }
    if (itemOutOfStock) {
      return {
        success: false,
        message: `${item.title || "An item in your cart"} is currently out of stock. Please remove it from your cart to proceed to checkout.`,
        items,
        subtotal: 0,
        discount: 0,
        discountedSubtotal: 0,
        gst: 0,
        shipping: 0,
        final: 0,
        coupon: null,
      };
    }

    const maxQty = getProductMaxQuantity(item);
    if (Number(item.quantity || 1) > maxQty) {
      return {
        success: false,
        message: `Maximum ${maxQty} per order allowed for ${item.title || "an item"}. Please adjust your bag quantity.`,
        items,
        subtotal: 0,
        discount: 0,
        discountedSubtotal: 0,
        gst: 0,
        shipping: 0,
        final: 0,
        coupon: null,
      };
    }
  }

  const subtotal = roundMoney(
    items.reduce((sum, item) => {
      const price = Number(item.price || 0);

      const isYatra = Boolean(
        item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit"),
      );

      if (item.mixBoxRecipe && !isYatra) {
        const pricing = calculateMixBoxPricing({
          recipe: item.mixBoxRecipe as MixBoxRecipe,
          setPrice: price,
          purchaseType: "one_time",
          subscriptionType: null,
        });

        if (!pricing.valid) return sum;

        return sum + pricing.price * Number(item.quantity || 1);
      }

      return sum + price * Number(item.quantity || 1);
    }, 0),
  );

  const rewardState = userId
    ? await syncAndGetUserRewards(userId)
    : { balance: 0 };
  const rewardBalance = Math.max(0, Math.round(Number(rewardState.balance || 0)));

  // Credits (Rewards):
  // - Applied automatically at checkout. No code to type.
  // - They now work together with coupons, like Myntra credit or a wallet:
  //   up to 20% of the product total left after coupons, at most ₹150 per order.
  // - Credits do not pay for delivery.
  const creditsFor = (productTotal: number) =>
    productTotal > 0
      ? Math.max(0, Math.min(rewardBalance, Math.floor(productTotal * MAX_REWARD_REDEEM_PERCENT), MAX_REWARD_REDEEM_PER_ORDER))
      : 0;

  const { parts, total: couponTotal, error: couponError } = await getValidCoupons({
    code: couponCode,
    userId,
    subtotal,
    items,
  });

  if (couponError && couponCode) {
    // The coupon can't be used: credits still apply on their own.
    const rewardsUsed = creditsFor(subtotal);
    const discountedSubtotal = roundMoney(Math.max(subtotal - rewardsUsed, 0));
    const shipping = calculateShipping(subtotal);
    const final = roundMoney(discountedSubtotal + shipping);

    return {
      success: false,
      message: couponError,
      items,
      subtotal,
      discount: 0,
      discountedSubtotal,
      gst: 0,
      shipping,
      rewardBalance,
      rewardsUsed,
      remainingRewardBalance: Math.max(0, rewardBalance - rewardsUsed),
      final,
      coupon: null,
      coupons: [],
      savingsChoiceNotice: null,
    };
  }

  // Delivery charge is separate; credits do NOT pay for delivery. Free
  // delivery is decided on the bag before any coupon, so a coupon never
  // makes an order cost more.
  const productAfterCoupon = roundMoney(Math.max(subtotal - couponTotal, 0));
  const rewardsUsed = creditsFor(productAfterCoupon);
  const shipping = calculateShipping(subtotal);
  const discountedSubtotal = roundMoney(Math.max(productAfterCoupon - rewardsUsed, 0));
  const gst = 0;
  const final = roundMoney(discountedSubtotal + shipping);
  const savingsChoiceNotice =
    parts.length && rewardsUsed > 0 ? `Your coupon${parts.length > 1 ? "s" : ""} and ₹${rewardsUsed} Rewards credit are both applied.` : null;

  return {
    success: true,
    items,
    subtotal,
    discount: couponTotal,
    discountedSubtotal,
    gst,
    shipping,
    rewardBalance,
    rewardsUsed,
    remainingRewardBalance: Math.max(0, rewardBalance - rewardsUsed),
    final,
    savingsChoiceNotice,
    coupon: couponSummary(parts),
    /** Each coupon used and what it took off, for the order record. */
    coupons: parts.map((p) => ({ id: p.info.id, code: p.info.code, discount: p.discount })),
  };
}

export async function getCheckoutPricing(couponCode?: string | null) {
  try {
    const { userId } = await requireUserWithRefresh();
    return calculateCheckoutPricingForUser({ userId, couponCode });
  } catch (error) {
    console.error("Checkout pricing failed:", error);
    return {
      success: false,
      message: "Failed to calculate checkout total",
      items: [],
      subtotal: 0,
      discount: 0,
      discountedSubtotal: 0,
      gst: 0,
      shipping: 0,
      rewardBalance: 0,
      rewardsUsed: 0,
      remainingRewardBalance: 0,
      final: 0,
      coupon: null,
    };
  }
}

export async function getDirectCheckoutPricing(
  item: any,
  couponCode?: string | null,
) {
  try {
    const { userId } = await requireUserWithRefresh();
    return calculateCheckoutPricingForUser({
      userId,
      couponCode,
      customItems: item ? [item] : [],
    });
  } catch (error) {
    console.error("Direct checkout pricing failed:", error);
    return {
      success: false,
      message: "Failed to calculate direct checkout total",
      items: item ? [item] : [],
      subtotal: 0,
      discount: 0,
      discountedSubtotal: 0,
      gst: 0,
      shipping: 0,
      rewardBalance: 0,
      rewardsUsed: 0,
      remainingRewardBalance: 0,
      final: 0,
      coupon: null,
    };
  }
}

export async function validateCartCoupon({
  code,
  items,
}: {
  code: string;
  items: any[];
}) {
  try {
    await ensureDefaultCoupons();

    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return { success: false, message: "Please enter a coupon code" };
    }

    let userId = "";
    try {
      const auth = await requireUserWithRefresh();
      userId = auth.userId || "";
    } catch {
      // Guest user is permitted to validate cart coupon
    }

    const subtotal = roundMoney(
      items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        return sum + price * Number(item.quantity || 1);
      }, 0),
    );

    const { parts, total, error } = await getValidCoupons({
      code: normalizedCode,
      userId,
      subtotal,
      items,
    });

    if (error || !parts.length) {
      return {
        success: false,
        message: error || "Invalid coupon code",
      };
    }

    const summary = couponSummary(parts)!;
    return {
      success: true,
      coupon: summary,
      coupons: parts.map((p) => ({ id: p.info.id, code: p.info.code, discount: p.discount })),
      discount: total,
      message: parts.length > 1 ? `${summary.code.replace("+", " + ")} applied! You save ₹${total.toFixed(2)}` : `Coupon ${summary.code} applied! Saved ₹${total.toFixed(2)}`,
    };
  } catch (err: any) {
    console.error("validateCartCoupon error:", err);
    return { success: false, message: "Failed to validate coupon" };
  }
}

export type CouponWindowItem = {
  code: string;
  kind: string;
  group: "store" | "personal";
  title: string;
  conditions: string;
  stackNote: string;
  /** ok: can be applied now · locked: spend or add more · ineligible: not for this account · upcoming: starts soon */
  state: "ok" | "locked" | "ineligible" | "upcoming";
  reason?: string;
  /** How close the bag is to unlocking it, 0 to 1. */
  progress?: number;
  saving: number;
  endsOn?: string;
};

export type CouponWindow = {
  signedIn: boolean;
  subtotal: number;
  coupons: CouponWindowItem[];
  best: { codes: string[]; saving: number } | null;
};

const dayLabel = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

/**
 * Every coupon for this bag, the way marketplaces show them: what can be
 * applied now and what it saves, what unlocks with a bigger bag, what isn't
 * for this account and why, what starts soon, and the best combination.
 */
export async function getCouponWindow({ items }: { items: any[] }): Promise<CouponWindow> {
  await ensureDefaultCoupons();
  let userId = "";
  try {
    userId = (await requireUserWithRefresh()).userId || "";
  } catch {
    // Guests see every coupon; account-only ones say to sign in.
  }
  const subtotal = roundMoney(items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 1), 0));
  const different = differentProducts(items);

  let firstOrder = true;
  let referrerCredits = 0;
  if (userId) {
    const previous = await db
      .select({ id: order.id })
      .from(order)
      .where(and(eq(order.userId, userId), inArray(order.status, ["paid", "processing", "shipped", "delivered", "completed"])))
      .limit(1);
    firstOrder = !previous.length;
    const friends = await db.selectDistinct({ id: referralCoinHistory.newUserId }).from(referralCoinHistory).where(eq(referralCoinHistory.userId, userId));
    const friendIds = friends.map((f) => f.id).filter((id): id is string => !!id && id !== userId);
    const delivered = friendIds.length
      ? await db.selectDistinct({ userId: order.userId }).from(order).where(and(inArray(order.userId, friendIds), inArray(order.status, ["delivered", "completed"])))
      : [];
    const [used] = await db
      .select({ n: sql<number>`count(*)` })
      .from(couponTransaction)
      .where(and(eq(couponTransaction.userId, userId), eq(couponTransaction.code, "SHARECARE15")));
    referrerCredits = Math.max(0, delivered.length - Number(used?.n || 0));
  }

  const dbRows = await db.select().from(coupon).where(inArray(coupon.code, STORE_COUPONS.map((c) => c.code)));
  const byCode = new Map(dbRows.map((r) => [r.code, r]));
  const now = Date.now();
  const soon = now + 45 * 86_400_000;

  const list: CouponWindowItem[] = [];
  for (const c of STORE_COUPONS) {
    if (!c.public || c.kind === "friend") continue;
    const row = byCode.get(c.code);
    if (!row) continue;
    const start = c.startsAt ? new Date(c.startsAt).getTime() : undefined;
    const end = c.endsAt ? new Date(c.endsAt).getTime() : undefined;
    if (end !== undefined && now > end) continue;
    if (start !== undefined && start > soon) continue;
    const min = row.minimumOrderValue || 0;
    let saving = row.isDiscountPercentage ? (subtotal * (row.discountPercentage ?? 0)) / 100 : row.discountFixedAmount ?? 0;
    if (row.maximumDiscountAmount > 0) saving = Math.min(saving, row.maximumDiscountAmount);
    saving = roundMoney(Math.min(saving, subtotal));
    const item: CouponWindowItem = {
      code: c.code,
      kind: c.kind,
      group: groupOf(c),
      title: row.description || c.description,
      conditions: couponConditions(c),
      stackNote: stackNote(c),
      state: "ok",
      saving,
      endsOn: c.endsAt ? dayLabel(c.endsAt) : undefined,
    };
    if (start !== undefined && start > now) {
      item.state = "upcoming";
      item.reason = `Starts ${dayLabel(c.startsAt!)}`;
    } else if (c.firstOrderOnly && userId && !firstOrder) {
      item.state = "ineligible";
      item.reason = "For first orders only";
    } else if (c.referrerOnly && !userId) {
      item.state = "ineligible";
      item.reason = "Sign in to use: it unlocks when a friend you referred gets their first order delivered";
    } else if (c.referrerOnly && !referrerCredits) {
      item.state = "ineligible";
      item.reason = "Unlocks when a friend you referred gets their first order delivered";
    } else if (subtotal < min) {
      item.state = "locked";
      item.reason = `Shop for ₹${Math.ceil(min - subtotal)} more to use this`;
      item.progress = min ? Math.max(0, Math.min(1, subtotal / min)) : 0;
    } else if (c.minDifferentProducts && different < c.minDifferentProducts) {
      const more = c.minDifferentProducts - different;
      item.state = "locked";
      item.reason = `Add ${more} more different product${more > 1 ? "s" : ""} to use this`;
      item.progress = different / c.minDifferentProducts;
    }
    if (item.state === "ok" && c.firstOrderOnly && !userId) item.reason = "First order only: sign in at checkout";
    if (item.state === "ok" && c.referrerOnly) item.reason = `${referrerCredits} available`;
    if (item.state !== "ok") item.saving = c.flat ?? (c.percent ? roundMoney(Math.min(((Math.max(subtotal, min)) * c.percent) / 100, c.maximumDiscountAmount)) : 0);
    list.push(item);
  }

  // The best single coupon or pair, by the combining rules.
  const ok = list.filter((x) => x.state === "ok" && x.saving > 0);
  let best: CouponWindow["best"] = null;
  for (const x of ok) {
    if (!best || x.saving > best.saving) best = { codes: [x.code], saving: x.saving };
  }
  for (const x of ok.filter((o) => o.group === "store")) {
    for (const y of ok.filter((o) => o.group === "personal")) {
      const a = couponRules(x.code);
      const b = couponRules(y.code);
      if (!a || !b || stackProblem(a, b)) continue;
      const saving = roundMoney(Math.min(x.saving + y.saving, subtotal * COMBINED_CAP));
      if (!best || saving > best.saving) best = { codes: [x.code, y.code], saving };
    }
  }

  const rank = { ok: 0, locked: 1, upcoming: 2, ineligible: 3 } as const;
  list.sort((a, b) => rank[a.state] - rank[b.state] || b.saving - a.saving);
  return { signedIn: !!userId, subtotal, coupons: list, best };
}
