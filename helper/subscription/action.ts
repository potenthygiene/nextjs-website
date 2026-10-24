/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import {
  order,
  paymentGatewayPlans,
  paymentGatewaySubscription,
  product,
  productVariant,
  subscriptions,
} from "@/db/schema";
import { ORDER_STATUS } from "@/const/globalconst";
import {
  reverseCancelledOrderRewards,
  syncAndGetUserRewards,
} from "@/lib/rewards";
import { db } from "@/lib/db";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUserWithRefresh } from "../user/action";

function addDaysToDate(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function rollForwardToFuture(dateInput: Date | string | null | undefined, stepDays: number, fallbackStart?: Date | string | null): Date {
  const now = new Date();
  const safeStep = Math.max(1, Number(stepDays) || 30);
  let target = dateInput
    ? new Date(dateInput)
    : fallbackStart
      ? addDaysToDate(new Date(fallbackStart), safeStep)
      : addDaysToDate(now, safeStep);

  if (Number.isNaN(target.getTime())) {
    target = addDaysToDate(now, safeStep);
  }

  while (target <= now) {
    target = addDaysToDate(target, safeStep);
  }
  return target;
}

export async function getUserSubscriptions() {
  try {
    const { userId } = await requireUserWithRefresh();

    const rows = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
        plan: paymentGatewayPlans,
        product: product,
        variant: productVariant,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .leftJoin(
        paymentGatewayPlans,
        eq(paymentGatewaySubscription.planId, paymentGatewayPlans.gatewayPlanId),
      )
      .leftJoin(product, eq(subscriptions.productId, product.id))
      .leftJoin(
        productVariant,
        eq(subscriptions.productVariantId, productVariant.id),
      )
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.startDate), desc(subscriptions.id));

    const mapped = rows.map((row) => {
      const isActive = Boolean(row.subscription.isActive);
      const isPaused = Boolean(row.subscription.isActive && row.subscription.isPaused);
      const productName = (row.product?.name ?? "Subscription").trim();
      const rawSize = (row.variant?.name ?? row.plan?.descirption ?? "").trim();
      const sizeName =
        rawSize && rawSize.toLowerCase() !== productName.toLowerCase()
          ? rawSize
          : null;

      const subscriptionType = row.subscription.subscriptionType;
      const frequencyInDays =
        Number(row.subscription.frequencyInDays) ||
        (subscriptionType === "every_2_months"
          ? 60
          : subscriptionType === "cycle_sync"
            ? 28
            : 30);

      let nextOrderDate: Date | null = null;
      let nextDeliveryDates: string[] = [];
      let nextChargeDate: Date | null = null;

      if (isActive) {
        const d1 = rollForwardToFuture(
          row.subscription.nextOrderDate,
          frequencyInDays,
          row.subscription.startDate,
        );
        const d2 = addDaysToDate(d1, frequencyInDays);
        const d3 = addDaysToDate(d1, frequencyInDays * 2);
        nextOrderDate = d1;
        nextDeliveryDates = [
          d1.toISOString(),
          d2.toISOString(),
          d3.toISOString(),
        ];

        if (subscriptionType === "cycle_sync") {
          // Box 1 (d1) is already paid for; Next Charge Date must strictly map to Box 2's charge date (5 days before Box 2's delivery date d2).
          const box2ChargeDate = addDaysToDate(d2, -5);
          const rawCharge = row.subscription.chargeDate
            ? new Date(row.subscription.chargeDate)
            : null;
          const d1EndOfDay = new Date(
            d1.getFullYear(),
            d1.getMonth(),
            d1.getDate(),
            23,
            59,
            59,
            999,
          );
          if (
            rawCharge &&
            !Number.isNaN(rawCharge.getTime()) &&
            rawCharge > d1EndOfDay
          ) {
            nextChargeDate = rollForwardToFuture(
              rawCharge,
              frequencyInDays,
              row.subscription.startDate,
            );
          } else {
            nextChargeDate = rollForwardToFuture(
              box2ChargeDate,
              frequencyInDays,
              row.subscription.startDate,
            );
          }
        } else {
          nextChargeDate = rollForwardToFuture(
            row.subscription.chargeDate ?? d1,
            frequencyInDays,
            row.subscription.startDate,
          );
        }
      }

      const rawAmount = row.plan?.price
        ? Math.round(Number(row.plan.price) / 100)
        : row.variant?.price
          ? Number(row.variant.price)
          : null;

      return {
        id: row.subscription.id,
        orderId: row.subscription.orderId,
        productId: row.subscription.productId,
        productVariantId: row.subscription.productVariantId,
        productName,
        variantName: sizeName ?? productName,
        sizeName,
        image: row.variant?.bannerImage ?? row.product?.bannerImage ?? null,
        sku: row.variant?.sku ?? null,
        subscriptionType,
        frequencyInDays,
        nextOrderDate: nextOrderDate ? nextOrderDate.toISOString() : null,
        nextDeliveryDates,
        chargeDate: nextChargeDate ? nextChargeDate.toISOString() : null,
        startDate: row.subscription.startDate,
        endDate: row.subscription.endDate,
        isActive,
        isPaused,
        pausedAt: row.subscription.pausedAt,
        cancelReason: row.subscription.cancelReason ?? null,
        gatewaySubscriptionId:
          row.gatewaySubscription?.gatewaySubscriptionId ?? null,
        planId: row.gatewaySubscription?.planId ?? null,
        amount: rawAmount,
        remainingCount: row.gatewaySubscription?.remainingCount ?? null,
        totalCount: row.gatewaySubscription?.totalCount ?? null,
      };
    });

    // Sort: Active first, Paused second, Cancelled last
    mapped.sort((a, b) => {
      const rank = (s: typeof a) => (!s.isActive ? 2 : s.isPaused ? 1 : 0);
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      return b.id - a.id;
    });

    return {
      success: true,
      subscriptions: mapped,
    };
  } catch (error: any) {
    console.error("Failed to fetch subscriptions:", error);
    if (error?.message === "UNAUTHORIZED") {
      return {
        success: false,
        subscriptions: [],
        message: "UNAUTHORIZED",
      };
    }

    return {
      success: false,
      subscriptions: [],
      message: "Failed to fetch subscriptions",
    };
  }
}

export async function pauseUserSubscription(subscriptionId: number) {
  try {
    const { userId } = await requireUserWithRefresh();

    const [row] = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .where(
        and(
          eq(subscriptions.id, Number(subscriptionId)),
          eq(subscriptions.userId, userId),
        ),
      )
      .limit(1);

    if (!row?.subscription) {
      return { success: false, message: "Subscription not found" };
    }

    if (!row.subscription.isActive) {
      return {
        success: false,
        message: "Cancelled subscriptions cannot be paused",
      };
    }

    const gatewaySubscriptionId =
      row.gatewaySubscription?.gatewaySubscriptionId;

    if (gatewaySubscriptionId && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const auth = Buffer.from(
          `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
        ).toString("base64");
        await fetch(
          `https://api.razorpay.com/v1/subscriptions/${gatewaySubscriptionId}/pause`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pause_at: "now" }),
          },
        );
      } catch (err) {
        console.warn("Razorpay pause gateway sync warning:", err);
      }
    }

    const pausedAt = new Date();
    await db
      .update(subscriptions)
      .set({
        isPaused: true,
        pausedAt,
      })
      .where(eq(subscriptions.id, row.subscription.id));

    revalidatePath("/dashboard/subscriptions");

    return {
      success: true,
      message: "Subscription paused",
      pausedAt: pausedAt.toISOString(),
    };
  } catch (error) {
    console.error("Failed to pause subscription:", error);
    return {
      success: false,
      message: "Failed to pause subscription",
    };
  }
}

export async function resumeUserSubscription(subscriptionId: number) {
  try {
    const { userId } = await requireUserWithRefresh();

    const [row] = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .where(
        and(
          eq(subscriptions.id, Number(subscriptionId)),
          eq(subscriptions.userId, userId),
        ),
      )
      .limit(1);

    if (!row?.subscription) {
      return { success: false, message: "Subscription not found" };
    }

    if (!row.subscription.isActive) {
      return {
        success: false,
        message: "Cancelled subscriptions cannot be resumed",
      };
    }

    const gatewaySubscriptionId =
      row.gatewaySubscription?.gatewaySubscriptionId;

    if (gatewaySubscriptionId && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const auth = Buffer.from(
          `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
        ).toString("base64");
        await fetch(
          `https://api.razorpay.com/v1/subscriptions/${gatewaySubscriptionId}/resume`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resume_at: "now" }),
          },
        );
      } catch (err) {
        console.warn("Razorpay resume gateway sync warning:", err);
      }
    }

    const frequencyInDays =
      Number(row.subscription.frequencyInDays) ||
      (row.subscription.subscriptionType === "every_2_months"
        ? 60
        : row.subscription.subscriptionType === "cycle_sync"
          ? 28
          : 30);

    const nextOrderDate = rollForwardToFuture(
      row.subscription.nextOrderDate,
      frequencyInDays,
      row.subscription.startDate,
    );
    let nextChargeDate: Date;
    if (row.subscription.subscriptionType === "cycle_sync") {
      const d2 = addDaysToDate(nextOrderDate, frequencyInDays);
      const box2ChargeDate = addDaysToDate(d2, -5);
      const rawCharge = row.subscription.chargeDate
        ? new Date(row.subscription.chargeDate)
        : null;
      const d1EndOfDay = new Date(
        nextOrderDate.getFullYear(),
        nextOrderDate.getMonth(),
        nextOrderDate.getDate(),
        23,
        59,
        59,
        999,
      );
      if (
        rawCharge &&
        !Number.isNaN(rawCharge.getTime()) &&
        rawCharge > d1EndOfDay
      ) {
        nextChargeDate = rollForwardToFuture(
          rawCharge,
          frequencyInDays,
          row.subscription.startDate,
        );
      } else {
        nextChargeDate = rollForwardToFuture(
          box2ChargeDate,
          frequencyInDays,
          row.subscription.startDate,
        );
      }
    } else {
      nextChargeDate = rollForwardToFuture(
        row.subscription.chargeDate ?? nextOrderDate,
        frequencyInDays,
        row.subscription.startDate,
      );
    }

    await db
      .update(subscriptions)
      .set({
        isPaused: false,
        pausedAt: null,
        nextOrderDate,
        chargeDate: nextChargeDate,
      })
      .where(eq(subscriptions.id, row.subscription.id));

    revalidatePath("/dashboard/subscriptions");

    return {
      success: true,
      message: "Subscription resumed",
      nextOrderDate: nextOrderDate.toISOString(),
      chargeDate: nextChargeDate.toISOString(),
    };
  } catch (error) {
    console.error("Failed to resume subscription:", error);
    return {
      success: false,
      message: "Failed to resume subscription",
    };
  }
}

export async function cancelUserSubscription(
  subscriptionId: number,
  reason?: string,
) {
  try {
    const { userId } = await requireUserWithRefresh();

    const [row] = await db
      .select({
        subscription: subscriptions,
        gatewaySubscription: paymentGatewaySubscription,
      })
      .from(subscriptions)
      .leftJoin(
        paymentGatewaySubscription,
        eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
      )
      .where(
        and(
          eq(subscriptions.id, Number(subscriptionId)),
          eq(subscriptions.userId, userId),
        ),
      )
      .limit(1);

    if (!row?.subscription) {
      return { success: false, message: "Subscription not found" };
    }

    if (!row.subscription.isActive) {
      if (row.subscription.orderId) {
        await db
          .update(order)
          .set({
            status: ORDER_STATUS.CANCELED,
            updatedAt: new Date(),
          })
          .where(eq(order.id, row.subscription.orderId));
        await reverseCancelledOrderRewards(row.subscription.orderId);
      }
      await syncAndGetUserRewards(userId);
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/orders");
      revalidatePath("/dashboard/subscriptions");
      revalidatePath("/dashboard/security");
      return { success: true, message: "Subscription is already cancelled" };
    }

    const gatewaySubscriptionId =
      row.gatewaySubscription?.gatewaySubscriptionId;

    if (gatewaySubscriptionId && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const auth = Buffer.from(
          `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
        ).toString("base64");
        const response = await fetch(
          `https://api.razorpay.com/v1/subscriptions/${gatewaySubscriptionId}/cancel`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cancel_at_cycle_end: false }),
          },
        );
        const data = await response.json().catch(() => null);

        if (response.ok && data) {
          await db
            .update(paymentGatewaySubscription)
            .set({
              remainingCount:
                data.remaining_count ?? row.gatewaySubscription?.remainingCount,
            })
            .where(
              eq(
                paymentGatewaySubscription.subscriptionId,
                row.subscription.id,
              ),
            );
        }
      } catch (err) {
        console.warn("Razorpay cancel gateway sync warning:", err);
      }
    }

    await db
      .update(subscriptions)
      .set({
        isActive: false,
        isPaused: false,
        pausedAt: null,
        endDate: new Date(),
        cancelReason: reason?.trim() || null,
      })
      .where(eq(subscriptions.id, row.subscription.id));

    if (row.subscription.orderId) {
      await db
        .update(order)
        .set({
          status: ORDER_STATUS.CANCELED,
          updatedAt: new Date(),
        })
        .where(eq(order.id, row.subscription.orderId));

      await reverseCancelledOrderRewards(row.subscription.orderId);
    }

    await syncAndGetUserRewards(userId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/subscriptions");
    revalidatePath("/dashboard/security");

    return { success: true, message: "Subscription cancelled" };
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return {
      success: false,
      message: "Failed to cancel subscription",
    };
  }
}
