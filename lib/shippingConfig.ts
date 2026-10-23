// lib/shippingConfig.ts
/**
 * Single source of truth for store-wide shipping & delivery thresholds.
 * An order of exactly ₹399 qualifies for free delivery.
 */
export const FREE_SHIPPING_THRESHOLD = 399;
export const STANDARD_SHIPPING_FEE = 60;

export function calculateShippingFee(amount: number): number {
  if (amount <= 0) return 0;
  return amount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function isFreeShippingEligible(amount: number): boolean {
  return amount >= FREE_SHIPPING_THRESHOLD;
}

export const FREE_SHIPPING_TEXT = `Free shipping over ₹${FREE_SHIPPING_THRESHOLD}`;
export const FREE_DELIVERY_TEXT = `Free delivery over ₹${FREE_SHIPPING_THRESHOLD}`;


/**
 * Single source of truth for dispatch and delivery times. Use these strings
 * everywhere a time is stated; never hand-type a different number.
 * (The shipping policy page keeps its per-zone table; its summary line
 * uses DELIVERY_TIME_TEXT.)
 */
export const DISPATCH_WINDOW = "within 24 to 48 hours";
export const DELIVERY_WINDOW = "usually 5 to 7 days after dispatch";
export const DELIVERY_REMOTE_NOTE = "remote areas can take longer";

/** "Dispatched within 24 to 48 hours" */
export const DISPATCH_TEXT = `Dispatched ${DISPATCH_WINDOW}`;
/** "Usually 5 to 7 days after dispatch, remote areas can take longer" */
export const DELIVERY_ETA_TEXT = `Usually 5 to 7 days after dispatch, ${DELIVERY_REMOTE_NOTE}`;
/** Full sentence for FAQs and policy summaries. */
export const DELIVERY_TIME_TEXT = `Orders are dispatched ${DISPATCH_WINDOW} and delivery is ${DELIVERY_WINDOW}; ${DELIVERY_REMOTE_NOTE}.`;
