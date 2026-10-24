// Keeps the store coupons in the database in step with const/coupons.ts.
// Server code only: it is not a "use server" action, so browsers can't run it.
import { coupon, couponTransaction } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { RETIRED_CODES, STORE_COUPONS } from "@/const/coupons";

let hasEnsuredDefaultCoupons = false;

export async function ensureDefaultCoupons() {
  if (hasEnsuredDefaultCoupons) return;
  try {
    const existing = await db
      .select({ code: coupon.code })
      .from(coupon);
    const existingCodes = new Set(
      existing.map((c) => String(c.code || "").trim().toUpperCase()),
    );

    // The 12 store coupons from const/coupons.ts.
    const defaults = STORE_COUPONS.map((c) => ({
      name: c.name,
      code: c.code,
      description: c.description,
      isDiscountPercentage: c.percent !== undefined,
      discountPercentage: c.percent ?? null,
      discountFixedAmount: c.percent !== undefined ? null : (c.flat ?? 0),
      minimumOrderValue: c.minimumOrderValue,
      maximumDiscountAmount: c.maximumDiscountAmount,
      useOnce: c.useOnce,
    }));

    for (const item of defaults) {
      if (!existingCodes.has(item.code)) {
        await db.insert(coupon).values(item);
      }
    }

    // Old test coupons and replaced versions: remove the ones never used.
    // Used ones stay for order history; checkout refuses them anyway.
    const retired = await db
      .select({ id: coupon.id, code: coupon.code })
      .from(coupon)
      .where(inArray(coupon.code, RETIRED_CODES));
    for (const row of retired) {
      const [used] = await db
        .select({ id: couponTransaction.id })
        .from(couponTransaction)
        .where(eq(couponTransaction.couponId, row.id))
        .limit(1);
      if (!used) await db.delete(coupon).where(eq(coupon.id, row.id));
    }
    hasEnsuredDefaultCoupons = true;
  } catch (err) {
    console.error("ensureDefaultCoupons error:", err);
  }
}
