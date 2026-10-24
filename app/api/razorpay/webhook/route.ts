// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { NextResponse } from "next/server";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import {
  couponTransaction,
  order,
  orderItem,
  payment,
  paymentGatewayPlans,
  paymentGatewaySubscription,
  product,
  productVariant,
  razorpayWebhookEvent,
  rewardCoinsHistory,
  subscriptions,
  users,
} from "@/src/db/schema";
import { ORDER_STATUS } from "@/const/globalconst";
import { RAZORPAY_WEBHOOK_SECRET } from "@/env";
import {
  sendFirstPurchaseEmail,
  sendOrderConfirmationEmail,
} from "@/helper/emailTemplates/action";
import { sendEmail } from "@/lib/email";
import {
  handleSubscriptionCharged,
  rupeesFromPaise,
  sendSuccessEmails,
  userHasPaidOrder,
} from "@/lib/subscriptionRenewal";
import {
  calculateOrderRewardRupees,
  reverseCancelledOrderRewards,
  syncAndGetUserRewards,
} from "@/lib/rewards";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HANDLED_EVENTS = new Set([
  "payment.captured",
  "payment.failed",
  "subscription.charged",
  "subscription.cancelled",
]);

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received || "");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!RAZORPAY_WEBHOOK_SECRET || !signature) return false;

  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return signaturesMatch(expected, signature);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function webhookEventAlreadyProcessed(eventId: string | null) {
  if (!eventId) return false;

  const [existing] = await db
    .select({ id: razorpayWebhookEvent.id })
    .from(razorpayWebhookEvent)
    .where(eq(razorpayWebhookEvent.eventId, eventId))
    .limit(1);

  return Boolean(existing);
}

async function rememberWebhookEvent({
  eventId,
  eventName,
  paymentId,
}: {
  eventId: string | null;
  eventName: string;
  paymentId?: string | null;
}) {
  if (!eventId) return;

  await db
    .insert(razorpayWebhookEvent)
    .values({
      eventId,
      eventName,
      paymentId: paymentId ?? null,
    })
    .onConflictDoNothing();
}

async function sendFailureEmail({
  email,
  name,
  orderId,
  amount,
  paymentId,
  reason,
}: {
  email?: string | null;
  name?: string | null;
  orderId?: string | null;
  amount: number;
  paymentId?: string | null;
  reason?: string | null;
}) {
  if (!email) return;

  const safeName = escapeHtml(name ?? "there");
  const safeOrder = orderId ? `Order: ${escapeHtml(orderId)}` : "";
  const safeReason = reason ? `<p>Reason: ${escapeHtml(reason)}</p>` : "";
  const safePaymentId = paymentId ? escapeHtml(paymentId) : "Not available";

  await sendEmail({
    to: email,
    subject: "Payment failed for your POTENT HYGIENE order",
    html: `
      <p>Hi ${safeName},</p>
      <p>We could not complete your payment of Rs. ${amount.toFixed(2)}.</p>
      <p>${safeOrder}</p>
      <p>Payment ID: ${safePaymentId}</p>
      ${safeReason}
      <p>Your order is still pending. Please try the payment again from checkout.</p>
    `,
  });
}

async function findPaymentIntent(gatewayPayment: any) {
  const conditions = [];

  if (gatewayPayment.id) {
    conditions.push(eq(payment.gatewayPaymentId, gatewayPayment.id));
  }

  if (gatewayPayment.order_id) {
    conditions.push(eq(payment.gatewayOrderId, gatewayPayment.order_id));
  }

  if (!conditions.length) return null;

  const [row] = await db
    .select({
      payment,
      order,
      user: users,
    })
    .from(payment)
    .leftJoin(order, eq(payment.orderId, order.id))
    .leftJoin(users, eq(payment.userId, users.id))
    .where(or(...conditions))
    .orderBy(desc(payment.createdAt))
    .limit(1);

  return row ?? null;
}

async function handlePaymentCaptured(gatewayPayment: any) {
  if (!gatewayPayment?.id) {
    return { action: "ignored_missing_payment" };
  }

  if (gatewayPayment.invoice_id) {
    return { action: "ignored_subscription_capture" };
  }

  const intent = await findPaymentIntent(gatewayPayment);
  const amount = rupeesFromPaise(gatewayPayment.amount);

  if (!intent?.payment) {
    await db
      .insert(payment)
      .values({
        gatewayOrderId: gatewayPayment.order_id ?? null,
        gatewayPaymentId: gatewayPayment.id,
        paymentStatus: "success",
        modeOfPayment: "razorpay",
        amount,
        paymentMeta: {
          status: "success",
          gatewayPayment,
          capturedAt: new Date().toISOString(),
          unlinked: true,
        },
      })
      .onConflictDoNothing();

    await sendSuccessEmails({
      email: gatewayPayment.email,
      name: gatewayPayment.email,
      orderId: gatewayPayment.order_id ?? gatewayPayment.id,
      amount,
      isFirstPaidOrder: false,
    });

    return { action: "stored_unlinked_payment", paymentId: gatewayPayment.id };
  }

  const alreadySuccess =
    intent.payment.paymentStatus === "success" &&
    intent.payment.gatewayPaymentId === gatewayPayment.id;
  // Only mark the order paid if Razorpay took the full amount of this order.
  const expected = Number(intent.order?.totalAmount ?? intent.payment.amount ?? 0);
  const amountMatches = !expected || Math.abs(expected - amount) <= 1;
  if (!amountMatches) {
    console.error("Payment amount does not match the order", {
      orderId: intent.order?.id,
      expected,
      captured: amount,
      paymentId: gatewayPayment.id,
    });
  }
  const shouldMarkPaid =
    amountMatches && intent.order?.id && intent.order.status === ORDER_STATUS.PENDING;
  const isFirstPaidOrder = intent.user?.id
    ? !(await userHasPaidOrder(intent.user.id, intent.order?.id))
    : false;

  await db.transaction(async (tx) => {
    await tx
      .update(payment)
      .set({
        gatewayPaymentId: gatewayPayment.id,
        gatewayOrderId: gatewayPayment.order_id ?? intent.payment.gatewayOrderId,
        paymentStatus: "success",
        amount,
        paymentMeta: {
          ...((intent.payment.paymentMeta as any) || {}),
          status: "success",
          gatewayPayment,
          capturedAt: new Date().toISOString(),
        },
      })
      .where(eq(payment.id, intent.payment.id));

    if (shouldMarkPaid) {
      await tx
        .update(order)
        .set({
          status: ORDER_STATUS.PAID,
          updatedAt: new Date(),
        })
        .where(eq(order.id, intent.order.id));

      // One record per coupon used (an order can carry a store coupon plus
      // a personal one), so once-only and per-referral limits count correctly.
      const meta = intent.payment.paymentMeta as any;
      const used: { id: string; code: string; discount: number }[] = Array.isArray(meta?.coupons) && meta.coupons.length
        ? meta.coupons
        : meta?.coupon?.id
          ? [{ id: meta.coupon.id, code: meta.coupon.code, discount: Number(meta?.discount || 0) }]
          : [];
      for (const c of used) {
        if (!c?.id) continue;
        await tx.insert(couponTransaction).values({
          userId: intent.order.userId,
          couponId: c.id,
          code: c.code,
          discountedAmount: Math.round(Number(c.discount || 0)),
        });
      }
    }
  });

  if (intent.order?.userId) {
    await syncAndGetUserRewards(intent.order.userId);
  }

  if (!alreadySuccess && intent.order?.id) {
    await sendSuccessEmails({
      email: intent.user?.email ?? gatewayPayment.email,
      name: intent.user?.name,
      orderId: intent.order.id,
      amount,
      isFirstPaidOrder,
    });
  }

  return {
    action: alreadySuccess ? "already_processed" : "captured",
    orderId: intent.order?.id,
    paymentId: gatewayPayment.id,
  };
}

async function handlePaymentFailed(gatewayPayment: any) {
  if (!gatewayPayment?.id) {
    return { action: "ignored_missing_payment" };
  }

  const intent = await findPaymentIntent(gatewayPayment);
  const amount = rupeesFromPaise(gatewayPayment.amount);
  const alreadyFailed =
    intent?.payment?.paymentStatus === "failed" &&
    intent.payment.gatewayPaymentId === gatewayPayment.id;

  if (intent?.payment) {
    await db
      .update(payment)
      .set({
        gatewayPaymentId: gatewayPayment.id,
        gatewayOrderId: gatewayPayment.order_id ?? intent.payment.gatewayOrderId,
        paymentStatus: "failed",
        amount,
        paymentMeta: {
          ...((intent.payment.paymentMeta as any) || {}),
          status: "failed",
          gatewayPayment,
          failedAt: new Date().toISOString(),
        },
      })
      .where(eq(payment.id, intent.payment.id));
  } else {
    await db
      .insert(payment)
      .values({
        gatewayOrderId: gatewayPayment.order_id ?? null,
        gatewayPaymentId: gatewayPayment.id,
        paymentStatus: "failed",
        modeOfPayment: "razorpay",
        amount,
        paymentMeta: {
          status: "failed",
          gatewayPayment,
          failedAt: new Date().toISOString(),
          unlinked: true,
        },
      })
      .onConflictDoNothing();
  }

  if (!alreadyFailed) {
    await sendFailureEmail({
      email: intent?.user?.email ?? gatewayPayment.email,
      name: intent?.user?.name,
      orderId: intent?.order?.id,
      amount,
      paymentId: gatewayPayment.id,
      reason: gatewayPayment.error_description,
    });
  }

  return {
    action: alreadyFailed ? "already_processed" : "failed",
    orderId: intent?.order?.id,
    paymentId: gatewayPayment.id,
  };
}

async function handleSubscriptionCancelledWebhook(eventPayload: any) {
  const gatewaySubEntity = eventPayload.payload?.subscription?.entity;
  if (!gatewaySubEntity?.id) {
    return { action: "ignored_missing_subscription" };
  }

  const [row] = await db
    .select({
      subscription: subscriptions,
      gatewaySubscription: paymentGatewaySubscription,
    })
    .from(paymentGatewaySubscription)
    .innerJoin(
      subscriptions,
      eq(paymentGatewaySubscription.subscriptionId, subscriptions.id),
    )
    .where(
      eq(
        paymentGatewaySubscription.gatewaySubscriptionId,
        gatewaySubEntity.id,
      ),
    )
    .limit(1);

  if (!row?.subscription) {
    return { action: "subscription_not_found" };
  }

  await db
    .update(subscriptions)
    .set({
      isActive: false,
      isPaused: false,
      endDate: new Date(),
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

  if (row.subscription.userId) {
    await syncAndGetUserRewards(row.subscription.userId);
  }

  return {
    action: "subscription_cancelled",
    subscriptionId: row.subscription.id,
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const eventId = req.headers.get("x-razorpay-event-id");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { success: false, message: "Invalid Razorpay webhook signature" },
      { status: 400 },
    );
  }

  if (await webhookEventAlreadyProcessed(eventId)) {
    return NextResponse.json({ success: true, duplicate: true });
  }

  const eventPayload = JSON.parse(rawBody);
  const eventName = eventPayload.event;

  if (!HANDLED_EVENTS.has(eventName)) {
    await rememberWebhookEvent({ eventId, eventName });
    return NextResponse.json({ success: true, ignored: true });
  }

  let result;
  let paymentId = eventPayload.payload?.payment?.entity?.id ?? null;

  if (eventName === "payment.captured") {
    result = await handlePaymentCaptured(eventPayload.payload?.payment?.entity);
  } else if (eventName === "payment.failed") {
    result = await handlePaymentFailed(eventPayload.payload?.payment?.entity);
  } else if (eventName === "subscription.cancelled") {
    result = await handleSubscriptionCancelledWebhook(eventPayload);
  } else {
    result = await handleSubscriptionCharged(eventPayload);
    paymentId = result?.paymentId ?? paymentId;
  }

  await rememberWebhookEvent({ eventId, eventName, paymentId });

  return NextResponse.json({
    success: true,
    event: eventName,
    result,
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Razorpay webhook endpoint is live and waiting for POST requests.",
  });
}

