// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
// Turning a paid subscription renewal into an order. Used by the Razorpay
// webhook and by the daily renewal check, so a renewal Razorpay has charged
// always becomes an order even if the webhook message never arrived.
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/src/db";
import {
  order,
  orderItem,
  payment,
  paymentGatewayPlans,
  paymentGatewaySubscription,
  product,
  productVariant,
  subscriptions,
  users,
} from "@/src/db/schema";
import { ORDER_STATUS } from "@/const/globalconst";
import {
  sendFirstPurchaseEmail,
  sendOrderConfirmationEmail,
} from "@/helper/emailTemplates/action";
import { syncAndGetUserRewards } from "@/lib/rewards";

export function rupeesFromPaise(value?: number | null) {
  return Math.round(Number(value || 0) / 100);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getNextDueDate(currentDueDate: Date | null, frequencyInDays: number) {
  const now = new Date();
  let nextDueDate = currentDueDate ? new Date(currentDueDate) : now;

  do {
    nextDueDate = addDays(nextDueDate, frequencyInDays);
  } while (nextDueDate <= now);

  return nextDueDate;
}

export async function userHasPaidOrder(userId: string, excludeOrderId?: string | null) {
  const paidStatuses = [
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.COMPLETED,
  ];
  const conditions = [
    eq(order.userId, userId),
    inArray(order.status, paidStatuses),
  ];

  if (excludeOrderId) {
    conditions.push(sql`${order.id} <> ${excludeOrderId}`);
  }

  const rows = await db
    .select({ id: order.id })
    .from(order)
    .where(and(...conditions))
    .limit(1);

  return rows.length > 0;
}

export async function sendSuccessEmails({
  email,
  name,
  orderId,
  amount,
  isFirstPaidOrder,
}: {
  email?: string | null;
  name?: string | null;
  orderId: string;
  amount: number;
  isFirstPaidOrder: boolean;
}) {
  if (!email) return;

  const firstName = name ?? "there";
  const orderDate = new Date().toLocaleDateString("en-IN");

  if (isFirstPaidOrder) {
    await sendFirstPurchaseEmail(email, firstName);
  }

  await sendOrderConfirmationEmail(email, firstName, orderId, orderDate, amount);
}

async function getSourceOrder(subscription: any) {
  if (!subscription.orderId) return null;

  const rows = await db
    .select({
      order,
      item: orderItem,
      variant: productVariant,
      product,
    })
    .from(order)
    .leftJoin(orderItem, eq(orderItem.orderId, order.id))
    .leftJoin(productVariant, eq(orderItem.productVariantId, productVariant.id))
    .leftJoin(product, eq(productVariant.productId, product.id))
    .where(eq(order.id, subscription.orderId));

  if (!rows.length) return null;

  return {
    order: rows[0].order,
    items: rows.filter((row) => row.item),
  };
}

async function getFallbackItems(subscription: any) {
  if (!subscription.productVariantId) return [];

  return db
    .select({
      variant: productVariant,
      product,
    })
    .from(productVariant)
    .leftJoin(product, eq(productVariant.productId, product.id))
    .where(eq(productVariant.id, subscription.productVariantId));
}

export async function handleSubscriptionCharged(eventPayload: any) {
  const gatewaySubscription = eventPayload.payload?.subscription?.entity;
  const gatewayPayment = eventPayload.payload?.payment?.entity;

  if (!gatewaySubscription?.id || !gatewayPayment?.id) {
    return { action: "ignored_missing_subscription_payment" };
  }

  const [existingSuccess] = await db
    .select({ id: payment.id, orderId: payment.orderId })
    .from(payment)
    .where(
      and(
        eq(payment.gatewayPaymentId, gatewayPayment.id),
        eq(payment.paymentStatus, "success"),
      ),
    )
    .limit(1);

  if (existingSuccess?.orderId) {
    return {
      action: "already_processed",
      orderId: existingSuccess.orderId,
      paymentId: gatewayPayment.id,
    };
  }

  const [subscriptionRow] = await db
    .select({
      subscription: subscriptions,
      gatewaySubscription: paymentGatewaySubscription,
      plan: paymentGatewayPlans,
      user: users,
    })
    .from(paymentGatewaySubscription)
    .innerJoin(
      subscriptions,
      eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
    )
    .leftJoin(
      paymentGatewayPlans,
      eq(paymentGatewaySubscription.planId, paymentGatewayPlans.gatewayPlanId),
    )
    .leftJoin(users, eq(paymentGatewaySubscription.userId, users.id))
    .where(
      eq(
        paymentGatewaySubscription.gatewaySubscriptionId,
        gatewaySubscription.id,
      ),
    )
    .limit(1);

  if (!subscriptionRow?.subscription) {
    return {
      action: "subscription_not_found",
      paymentId: gatewayPayment.id,
      gatewaySubscriptionId: gatewaySubscription.id,
    };
  }

  const amount =
    rupeesFromPaise(gatewayPayment.amount) ||
    Math.round(Number(subscriptionRow.plan?.price || 0) / 100);
  const sourceOrder = await getSourceOrder(subscriptionRow.subscription);
  const existingPendingOrder =
    sourceOrder?.order?.status === ORDER_STATUS.PENDING ? sourceOrder : null;
  const fallbackItems = sourceOrder ? [] : await getFallbackItems(subscriptionRow.subscription);
  const pendingPaymentRows = await db
    .select()
    .from(payment)
    .where(
      and(
        eq(payment.gatewayTransactionId, gatewaySubscription.id),
        eq(payment.paymentStatus, "pending"),
      ),
    )
    .orderBy(desc(payment.createdAt))
    .limit(1);
  const pendingPayment = pendingPaymentRows[0] ?? null;
  const frequencyInDays = Number(
    subscriptionRow.subscription.frequencyInDays ||
      (subscriptionRow.subscription.subscriptionType === "cycle_sync"
        ? 28
        : subscriptionRow.subscription.subscriptionType === "every_2_months"
          ? 60
          : 30),
  );
  const existingNextOrder = subscriptionRow.subscription.nextOrderDate
    ? new Date(subscriptionRow.subscription.nextOrderDate)
    : null;
  const nextOrderDate =
    existingPendingOrder &&
    existingNextOrder &&
    !Number.isNaN(existingNextOrder.getTime()) &&
    existingNextOrder > new Date()
      ? existingNextOrder
      : getNextDueDate(
          subscriptionRow.subscription.nextOrderDate,
          frequencyInDays,
        );
  const nextChargeDate =
    subscriptionRow.subscription.subscriptionType === "cycle_sync"
      ? addDays(nextOrderDate, frequencyInDays - 5)
      : nextOrderDate;
  const isFirstPaidOrder = subscriptionRow.user?.id
    ? !(await userHasPaidOrder(subscriptionRow.user.id, existingPendingOrder?.order?.id))
    : false;

  const result = await db.transaction(async (tx) => {
    let paidOrderId = existingPendingOrder?.order?.id ?? null;

    if (paidOrderId) {
      await tx
        .update(order)
        .set({
          status: ORDER_STATUS.PAID,
          updatedAt: new Date(),
          totalAmount: amount,
        })
        .where(eq(order.id, paidOrderId));
    } else {
      const [createdOrder] = await tx
        .insert(order)
        .values({
          userId: subscriptionRow.subscription.userId,
          status: ORDER_STATUS.PAID,
          totalAmount: amount,
          addressLine1: sourceOrder?.order?.addressLine1 ?? null,
          addressLine2: sourceOrder?.order?.addressLine2 ?? null,
          city: sourceOrder?.order?.city ?? null,
          state: sourceOrder?.order?.state ?? null,
          pincode: sourceOrder?.order?.pincode ?? null,
        })
        .returning({ id: order.id });

      paidOrderId = createdOrder.id;

      if (sourceOrder?.items?.length) {
        await tx.insert(orderItem).values(
          sourceOrder.items.map((row: any) => ({
            orderId: paidOrderId,
            productVariantId: row.item.productVariantId,
            quantity: row.item.quantity,
            mixBoxRecipe: row.item.mixBoxRecipe,
            totalPads: row.item.totalPads,
            boxCount: row.item.boxCount,
            freeLiners: row.item.freeLiners,
            productVarientName: row.item.productVarientName,
            productVarientSlug: row.item.productVarientSlug,
            productVarientImage: row.item.productVarientImage,
            productVarientPrice: row.item.productVarientPrice,
            productVarientSKU: row.item.productVarientSKU,
          })),
        );
      } else if (fallbackItems.length) {
        const fallback = fallbackItems[0];
        await tx.insert(orderItem).values({
          orderId: paidOrderId,
          productVariantId: fallback.variant.id,
          quantity: subscriptionRow.gatewaySubscription.quantity ?? 1,
          productVarientName: fallback.variant.name ?? fallback.product?.name,
          productVarientSlug: fallback.product?.slug ?? null,
          productVarientImage:
            fallback.variant.bannerImage ?? fallback.product?.bannerImage ?? null,
          productVarientPrice: amount,
          productVarientSKU: fallback.variant.sku ?? null,
        });
      }
    }

    const paymentMeta = {
      status: "success",
      gatewayPayment,
      gatewaySubscription,
      subscriptionId: subscriptionRow.subscription.id,
      gatewaySubscriptionId: gatewaySubscription.id,
      chargedAt: new Date().toISOString(),
    };

    if (pendingPayment) {
      await tx
        .update(payment)
        .set({
          orderId: paidOrderId,
          userId: subscriptionRow.subscription.userId,
          gatewayOrderId: gatewayPayment.order_id ?? null,
          gatewayPaymentId: gatewayPayment.id,
          gatewayTransactionId: gatewaySubscription.id,
          paymentStatus: "success",
          modeOfPayment: "razorpay_subscription",
          amount,
          paymentMeta: {
            ...((pendingPayment.paymentMeta as any) || {}),
            ...paymentMeta,
          },
        })
        .where(eq(payment.id, pendingPayment.id));
    } else {
      await tx.insert(payment).values({
        userId: subscriptionRow.subscription.userId,
        orderId: paidOrderId,
        gatewayOrderId: gatewayPayment.order_id ?? null,
        gatewayPaymentId: gatewayPayment.id,
        gatewayTransactionId: gatewaySubscription.id,
        paymentStatus: "success",
        modeOfPayment: "razorpay_subscription",
        amount,
        paymentMeta,
      });
    }

    await tx
      .update(subscriptions)
      .set({
        orderId: paidOrderId,
        chargeDate: nextChargeDate,
        nextOrderDate,
        isActive: true,
      })
      .where(eq(subscriptions.id, subscriptionRow.subscription.id));

    await tx
      .update(paymentGatewaySubscription)
      .set({
        remainingCount:
          gatewaySubscription.remaining_count ??
          subscriptionRow.gatewaySubscription.remainingCount,
        totalCount:
          gatewaySubscription.total_count ??
          subscriptionRow.gatewaySubscription.totalCount,
      })
      .where(eq(paymentGatewaySubscription.id, subscriptionRow.gatewaySubscription.id));

    return { orderId: paidOrderId };
  });

  if (subscriptionRow.subscription.userId) {
    await syncAndGetUserRewards(subscriptionRow.subscription.userId);
  }

  await sendSuccessEmails({
    email: subscriptionRow.user?.email ?? gatewayPayment.email,
    name: subscriptionRow.user?.name,
    orderId: result.orderId,
    amount,
    isFirstPaidOrder,
  });

  return {
    action: "subscription_charged",
    orderId: result.orderId,
    paymentId: gatewayPayment.id,
  };
}
