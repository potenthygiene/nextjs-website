import { db } from "@/db";
import { order, orderItem, product, productVariant } from "@/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import { ORDER_STATUS } from "@/const/globalconst";
import {
  REVIEW_PHOTO_REWARD_RUPEES,
  REVIEW_TEXT_REWARD_RUPEES,
} from "@/lib/rewardsRules";

// Reviews come only from people who have received the product, like the
// big marketplaces: an order with it that reached "delivered".
const RECEIVED = [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED];

export const NOT_A_BUYER_MESSAGE =
  "Reviews are open to customers who have received this product. Once your order is delivered, you can review it from My Orders.";

/** Whether this person has a delivered order that contains this product. */
export async function hasReceivedProduct(userId: string, productId: string) {
  if (!userId || !productId) return false;
  const [prod] = await db
    .select({ slug: product.slug })
    .from(product)
    .where(eq(product.id, productId))
    .limit(1);
  const [row] = await db
    .select({ id: orderItem.id })
    .from(orderItem)
    .innerJoin(order, eq(orderItem.orderId, order.id))
    .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
    .where(
      and(
        eq(order.userId, userId),
        inArray(order.status, RECEIVED),
        prod?.slug
          ? or(eq(productVariant.productId, productId), eq(orderItem.productVarientSlug, prod.slug))
          : eq(productVariant.productId, productId),
      ),
    )
    .limit(1);
  return !!row;
}

/** Which of these (user, product) pairs are verified buyers, for badges. */
export async function receivedPairs(pairs: { userId: string | null; productId: string | null }[]) {
  const users = [...new Set(pairs.map((p) => p.userId).filter(Boolean))] as string[];
  if (!users.length) return new Set<string>();
  const rows = await db
    .select({
      userId: order.userId,
      productId: productVariant.productId,
      slug: orderItem.productVarientSlug,
    })
    .from(orderItem)
    .innerJoin(order, eq(orderItem.orderId, order.id))
    .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
    .where(and(inArray(order.userId, users), inArray(order.status, RECEIVED)));
  const productIds = [...new Set(pairs.map((p) => p.productId).filter(Boolean))] as string[];
  const slugRows = productIds.length
    ? await db.select({ id: product.id, slug: product.slug }).from(product).where(inArray(product.id, productIds))
    : [];
  const idBySlug = new Map(slugRows.map((r) => [String(r.slug), String(r.id)]));
  const out = new Set<string>();
  for (const r of rows) {
    const pid = r.productId || (r.slug ? idBySlug.get(String(r.slug)) : undefined);
    if (pid) out.add(`${r.userId}:${pid}`);
  }
  return out;
}

/** Whether a stored review has a photo (imageUrl or a media list). */
export function reviewHasPhoto(r: { imageUrl?: string | null; varient?: string | null }) {
  if (r.imageUrl) return true;
  if (!r.varient) return false;
  try {
    const parsed = JSON.parse(r.varient);
    return Array.isArray(parsed) ? parsed.some(Boolean) : !!parsed;
  } catch {
    return !!r.varient;
  }
}

/** ₹25 for a written review, ₹50 with a photo. */
export function reviewReward(r: { imageUrl?: string | null; varient?: string | null }) {
  return reviewHasPhoto(r) ? REVIEW_PHOTO_REWARD_RUPEES : REVIEW_TEXT_REWARD_RUPEES;
}
