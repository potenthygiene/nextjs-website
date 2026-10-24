import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/env";
import { calculateCheckoutPricingForUser, createPendingCheckoutOrder } from "@/helper";
import { requireUserWithRefresh } from "@/helper/user/action";
import { db } from "@/src/db";
import { address } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { couponCode, addressId, directItem, isGift, giftNote } = body;
  const { userId, email } = await requireUserWithRefresh();
  const customItems = directItem ? [directItem] : undefined;
  const pricing = await calculateCheckoutPricingForUser({
    userId,
    couponCode,
    customItems,
  });

  if (!pricing.success || pricing.final <= 0) {
    return NextResponse.json(
      { error: pricing.message ?? "Unable to calculate checkout total" },
      { status: 400 },
    );
  }

  const [shippingAddress] = await db
    .select()
    .from(address)
    .where(and(eq(address.id, Number(addressId)), eq(address.userId, userId)))
    .limit(1);

  if (!shippingAddress) {
    return NextResponse.json(
      { error: "Please select a valid address" },
      { status: 400 },
    );
  }

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID!,
    key_secret: RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(pricing.final * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const pendingOrder = await createPendingCheckoutOrder({
      userId,
      couponCode,
      address: shippingAddress,
      razorpayOrderId: order.id,
      customItems,
      isGift: Boolean(isGift),
      giftNote: isGift && giftNote ? String(giftNote).trim().slice(0, 200) : "",
    });

    if (!pendingOrder.success) {
      return NextResponse.json(pendingOrder, { status: 400 });
    }

    // So every payment in the Razorpay dashboard shows whose order it is.
    const customer = {
      name: String(shippingAddress.fullName || "").slice(0, 80),
      phone: String(shippingAddress.phone || "").slice(0, 20),
      email: String(email || "").slice(0, 120),
    };
    try {
      await razorpay.orders.edit(order.id, {
        notes: {
          order_number: String(pendingOrder.orderId),
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
        },
      });
    } catch (e) {
      console.error("Could not add notes to the Razorpay order:", e);
    }

    return NextResponse.json({
      ...order,
      checkout: pricing,
      localOrderId: pendingOrder.orderId,
      customer,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation failed:", error);
    const razorpayError = error as {
      error?: { description?: string };
      statusCode?: number;
    };

    return NextResponse.json(
      {
        error:
          razorpayError.error?.description ??
          "Razorpay order creation failed. Check Razorpay key id and secret.",
      },
      { status: razorpayError.statusCode ?? 500 },
    );
  }
}
