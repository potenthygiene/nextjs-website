// Store coupons and their extra rules. The discount itself (percentage or
// amount, minimum order, maximum discount, one use per customer) lives in the
// database and can be edited in Admin → Coupons. This file adds what the
// database can't hold: dates, how many different products the bag needs,
// first-order-only, referral rules, and whether the coupon is shown to customers.
//
// To add a coupon: add an entry to STORE_COUPONS. It is created in the
// database automatically the next time checkout or Admin → Coupons loads,
// and the site and Potent Saathi start showing it once it is public and live.
// Database limits: name and code up to 20 characters, description up to 100.
//
// Combining coupons (like Amazon and Shopify stores, not one-code-only like Myntra):
// - One store coupon per order: a festival, Stock Up or Pair Up coupon.
// - Plus at most one personal coupon on top:
//   FIRSTCARE15 (first order) adds on to a Stock Up coupon only;
//   SHARECARE15 (for referring a friend) adds on to any one store coupon.
// - Every percentage is worked out on the bag total, and all coupons together
//   take at most 30% off the bag.
// - Birthday and anniversary coupons stand alone: they can't be combined with
//   any other coupon. Each works once a year, all through that month.
// - Rewards credits still apply on top (up to 20% of what is left, at most ₹150).

export type CouponKind = "welcome" | "friend" | "referrer" | "festival" | "combo" | "tier" | "occasion";
export type CouponGroup = "store" | "personal";

export type StoreCoupon = {
  code: string;
  kind: CouponKind;
  name: string;
  description: string;
  /** The same description in Hindi, for the chat. */
  descriptionHi: string;
  percent?: number;
  flat?: number;
  minimumOrderValue: number;
  maximumDiscountAmount: number;
  useOnce: boolean;
  /** India time, inclusive. */
  startsAt?: string;
  endsAt?: string;
  minDifferentProducts?: number;
  firstOrderOnly?: boolean;
  /** Only for accounts that joined with a friend's referral link. */
  referredOnly?: boolean;
  /** Once for every referred friend whose first order has been delivered. */
  referrerOnly?: boolean;
  /** Occasion coupons: works in the month of this date from the customer's profile, once a year. */
  occasion?: "birthday" | "anniversary";
  /** Personal coupons only: the store coupon kinds it can be added to. */
  stacksWith?: CouponKind[];
  /** Shown on the site and by the chat. */
  public: boolean;
  /** Short line for banners and the chat. */
  pitch: string;
  pitchHi: string;
};

export const STORE_COUPONS: StoreCoupon[] = [
  // ---- New customers and referrals
  {
    code: "FIRSTCARE15",
    kind: "welcome",
    name: "First Care 15%",
    description: "15% off your first order, and it adds on to a Stock Up coupon",
    descriptionHi: "पहले ऑर्डर पर 15% की छूट, और यह Stock Up कूपन के साथ भी लगती है",
    percent: 15,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: true,
    firstOrderOnly: true,
    stacksWith: ["tier"],
    public: true,
    pitch: "New here? Sign up and get 15% off your first order with FIRSTCARE15",
    pitchHi: "नए हैं? साइन अप करें और FIRSTCARE15 से पहले ऑर्डर पर 15% की छूट पाएँ",
  },
  {
    code: "SHARECARE15",
    kind: "referrer",
    name: "Share Care 15%",
    description: "15% off for referring a friend, and it adds on to any one store coupon",
    descriptionHi: "दोस्त को रेफ़र करने पर 15% की छूट, और यह किसी भी एक स्टोर कूपन के साथ लगती है",
    percent: 15,
    minimumOrderValue: 399,
    maximumDiscountAmount: 200,
    useOnce: false,
    referrerOnly: true,
    stacksWith: ["festival", "tier", "combo"],
    public: true,
    pitch: "Refer a friend: they get 15% off their first order, and you get SHARECARE15 to add to any coupon",
    pitchHi: "दोस्त को रेफ़र करें: उन्हें पहले ऑर्डर पर 15% छूट, और आपको SHARECARE15 जो किसी भी कूपन के साथ लगे",
  },

  // ---- The customer's own occasions (dates from My profile)
  {
    code: "BIRTHDAY15",
    kind: "occasion",
    name: "Birthday Month 15%",
    description: "15% off in your birthday month, once a year, on orders of ₹399 and above",
    descriptionHi: "जन्मदिन के महीने में 15% की छूट, साल में एक बार, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 15,
    minimumOrderValue: 399,
    maximumDiscountAmount: 200,
    useOnce: false,
    occasion: "birthday",
    public: true,
    pitch: "Birthday month? 15% off with BIRTHDAY15. Add your birthday in My profile",
    pitchHi: "जन्मदिन का महीना? BIRTHDAY15 से 15% की छूट। My profile में अपना जन्मदिन जोड़ें",
  },
  {
    code: "ANNIVERSARY15",
    kind: "occasion",
    name: "Anniversary 15%",
    description: "15% off in your anniversary month, once a year, on orders of ₹399 and above",
    descriptionHi: "सालगिरह के महीने में 15% की छूट, साल में एक बार, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 15,
    minimumOrderValue: 399,
    maximumDiscountAmount: 200,
    useOnce: false,
    occasion: "anniversary",
    public: true,
    pitch: "Anniversary month? 15% off with ANNIVERSARY15. Add the date in My profile",
    pitchHi: "सालगिरह का महीना? ANNIVERSARY15 से 15% की छूट। My profile में तारीख जोड़ें",
  },

  // ---- Festivals
  {
    code: "DIWALI10",
    kind: "festival",
    name: "Diwali 10% Off",
    description: "10% off for Diwali, on orders of ₹399 and above",
    descriptionHi: "दिवाली पर 10% की छूट, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 10,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: false,
    startsAt: "2026-10-23T00:00:00+05:30",
    endsAt: "2026-11-10T23:59:59+05:30",
    public: true,
    pitch: "Diwali offer: 10% off with DIWALI10, till 10 November",
    pitchHi: "दिवाली ऑफ़र: DIWALI10 से 10% की छूट, 10 नवंबर तक",
  },
  {
    code: "CHHATH10",
    kind: "festival",
    name: "Chhath Puja 10% Off",
    description: "10% off for Chhath Puja, on orders of ₹399 and above",
    descriptionHi: "छठ पूजा पर 10% की छूट, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 10,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: false,
    startsAt: "2026-11-11T00:00:00+05:30",
    endsAt: "2026-11-17T23:59:59+05:30",
    public: true,
    pitch: "Chhath Puja offer: 10% off with CHHATH10, 11 to 17 November",
    pitchHi: "छठ पूजा ऑफ़र: CHHATH10 से 10% की छूट, 11 से 17 नवंबर",
  },
  {
    code: "HAPPY2027",
    kind: "festival",
    name: "New Year 10% Off",
    description: "10% off for Christmas and New Year, on orders of ₹399 and above",
    descriptionHi: "क्रिसमस और नए साल पर 10% की छूट, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 10,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: false,
    startsAt: "2026-12-24T00:00:00+05:30",
    endsAt: "2027-01-04T23:59:59+05:30",
    public: true,
    pitch: "New Year offer: 10% off with HAPPY2027, till 4 January",
    pitchHi: "नए साल का ऑफ़र: HAPPY2027 से 10% की छूट, 4 जनवरी तक",
  },
  {
    code: "HOLI10",
    kind: "festival",
    name: "Holi 10% Off",
    description: "10% off for Holi, on orders of ₹399 and above",
    descriptionHi: "होली पर 10% की छूट, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 10,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: false,
    startsAt: "2027-03-15T00:00:00+05:30",
    endsAt: "2027-03-23T23:59:59+05:30",
    public: true,
    pitch: "Holi offer: 10% off with HOLI10, till 23 March",
    pitchHi: "होली ऑफ़र: HOLI10 से 10% की छूट, 23 मार्च तक",
  },

  {
    code: "OWNYOURFLOW10",
    kind: "festival",
    name: "Own Your Flow 10%",
    description: "10% off for Menstrual Hygiene Day week, on orders of ₹399 and above",
    descriptionHi: "मेंस्ट्रुअल हाइजीन डे वीक पर 10% की छूट, ₹399 और उससे ऊपर के ऑर्डर पर",
    percent: 10,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: false,
    startsAt: "2027-05-24T00:00:00+05:30",
    endsAt: "2027-05-31T23:59:59+05:30",
    public: true,
    pitch: "Menstrual Hygiene Day: 10% off with OWNYOURFLOW10, till 31 May",
    pitchHi: "मेंस्ट्रुअल हाइजीन डे: OWNYOURFLOW10 से 10% की छूट, 31 मई तक",
  },

  // ---- Bigger bags
  {
    code: "PAIRUP10",
    kind: "combo",
    name: "Pair Up 10%",
    description: "10% off when your bag has 2 or more different products",
    descriptionHi: "बैग में 2 या ज़्यादा अलग-अलग प्रोडक्ट होने पर 10% की छूट",
    percent: 10,
    minimumOrderValue: 0,
    maximumDiscountAmount: 200,
    useOnce: false,
    minDifferentProducts: 2,
    public: true,
    pitch: "Pair up any 2 different products: 10% off with PAIRUP10",
    pitchHi: "कोई भी 2 अलग प्रोडक्ट साथ लें: PAIRUP10 से 10% की छूट",
  },
  {
    code: "STOCKUP80",
    kind: "tier",
    name: "Stock Up ₹80",
    description: "₹80 off on orders of ₹799 and above",
    descriptionHi: "₹799 और उससे ऊपर के ऑर्डर पर ₹80 की छूट",
    flat: 80,
    minimumOrderValue: 799,
    maximumDiscountAmount: 80,
    useOnce: false,
    public: true,
    pitch: "Spend ₹799, save ₹80 with STOCKUP80",
    pitchHi: "₹799 की ख़रीद पर STOCKUP80 से ₹80 बचाएँ",
  },
  {
    code: "STOCKUP130",
    kind: "tier",
    name: "Stock Up ₹130",
    description: "₹130 off on orders of ₹1099 and above",
    descriptionHi: "₹1099 और उससे ऊपर के ऑर्डर पर ₹130 की छूट",
    flat: 130,
    minimumOrderValue: 1099,
    maximumDiscountAmount: 130,
    useOnce: false,
    public: true,
    pitch: "Spend ₹1099, save ₹130 with STOCKUP130",
    pitchHi: "₹1099 की ख़रीद पर STOCKUP130 से ₹130 बचाएँ",
  },
  {
    code: "STOCKUP200",
    kind: "tier",
    name: "Stock Up ₹200",
    description: "₹200 off on orders of ₹1499 and above",
    descriptionHi: "₹1499 और उससे ऊपर के ऑर्डर पर ₹200 की छूट",
    flat: 200,
    minimumOrderValue: 1499,
    maximumDiscountAmount: 200,
    useOnce: false,
    public: true,
    pitch: "Spend ₹1499, save ₹200 with STOCKUP200",
    pitchHi: "₹1499 की ख़रीद पर STOCKUP200 से ₹200 बचाएँ",
  },
  {
    code: "STOCKUP300",
    kind: "tier",
    name: "Stock Up ₹300",
    description: "₹300 off on orders of ₹1999 and above",
    descriptionHi: "₹1999 और उससे ऊपर के ऑर्डर पर ₹300 की छूट",
    flat: 300,
    minimumOrderValue: 1999,
    maximumDiscountAmount: 300,
    useOnce: false,
    public: true,
    pitch: "Spend ₹1999, save ₹300 with STOCKUP300",
    pitchHi: "₹1999 की ख़रीद पर STOCKUP300 से ₹300 बचाएँ",
  },
];

/**
 * Codes that must never work for customers: old test coupons and earlier
 * versions replaced by the coupons above. Unused ones are removed from the
 * database automatically; used ones stay for order history but can't be applied.
 */
export const RETIRED_CODES = ["TEST20", "TEST50", "TEENFIRST10", "WELCOME15", "COMBO10", "COMBO15", "SAATHI20"];
/** Kept for older imports. */
export const BLOCKED_CODES = RETIRED_CODES;

const toTime = (s?: string) => (s ? new Date(s).getTime() : undefined);

export function couponRules(code: string) {
  return STORE_COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

export function isCouponLive(c: StoreCoupon, now = Date.now()) {
  const start = toTime(c.startsAt);
  const end = toTime(c.endsAt);
  return (start === undefined || now >= start) && (end === undefined || now <= end);
}

/** Public coupons a customer can use today, festive first. */
export function liveCoupons(now = Date.now()) {
  const order: CouponKind[] = ["festival", "welcome", "occasion", "tier", "combo", "friend", "referrer"];
  return STORE_COUPONS.filter((c) => c.public && isCouponLive(c, now)).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
}

/** The festive coupon running today, for banners. */
export function festiveCoupon(now = Date.now()) {
  return liveCoupons(now).find((c) => c.kind === "festival");
}

export const couponByCode = (code: string) => STORE_COUPONS.find((c) => c.code === code);

/** The spend-more ladder, smallest first. */
export const TIER_COUPONS = STORE_COUPONS.filter((c) => c.kind === "tier").sort((a, b) => a.minimumOrderValue - b.minimumOrderValue);

/** What a coupon takes off a bag of this value (0 when the minimum isn't met). */
export function couponSaving(c: StoreCoupon, subtotal: number) {
  if (subtotal < c.minimumOrderValue) return 0;
  const raw = c.percent !== undefined ? (subtotal * c.percent) / 100 : c.flat || 0;
  return Math.round(Math.min(raw, c.maximumDiscountAmount || raw, subtotal) * 100) / 100;
}

/** All coupons together take at most this share of the bag. */
export const COMBINED_CAP = 0.3;

export const groupOf = (c: StoreCoupon): CouponGroup => (c.kind === "welcome" || c.kind === "referrer" || c.kind === "friend" ? "personal" : "store");

/** "A+B" or "A + B" → ["A", "B"], at most two, no repeats. */
export function parseCodes(raw?: string | null) {
  return [...new Set(String(raw || "").toUpperCase().split(/[+,\s]+/).map((c) => c.trim()).filter(Boolean))].slice(0, 2);
}
export const joinCodes = (codes: string[]) => codes.join("+");

/** Why two coupons can't be used together, or null when they can. */
export function stackProblem(a: StoreCoupon, b: StoreCoupon): string | null {
  if (a.code === b.code) return "That coupon is already applied";
  const solo = a.kind === "occasion" ? a : b.kind === "occasion" ? b : null;
  if (solo) return `${solo.code} can't be combined with other coupons`;
  const ga = groupOf(a);
  const gb = groupOf(b);
  if (ga === "store" && gb === "store") return `Only one store coupon per order: choose ${a.code} or ${b.code}`;
  if (ga === "personal" && gb === "personal") return `${a.code} and ${b.code} can't be used together`;
  const personal = ga === "personal" ? a : b;
  const store = ga === "personal" ? b : a;
  if (!personal.stacksWith?.includes(store.kind)) {
    return personal.kind === "welcome" ? `${personal.code} adds on to a Stock Up coupon only, not ${store.code}` : `${personal.code} can't be added to ${store.code}`;
  }
  return null;
}

/** One line on what a coupon can be combined with, for coupon lists. */
export function stackNote(c: StoreCoupon) {
  if (c.kind === "occasion") return "Can't be combined with other coupons";
  if (c.kind === "welcome") return "Can be added to a Stock Up coupon";
  if (c.kind === "referrer") return "Can be added to any one store coupon";
  if (c.kind === "tier") return "Can be combined with FIRSTCARE15 or SHARECARE15";
  return "Can be combined with SHARECARE15";
}

export type BagOffer = { coupon: StoreCoupon; saving: number };

/**
 * The best coupon for a bag, and the next spend-more step to aim for.
 * Coupons for new customers or referrals only count when the caller says
 * they apply (firstOrder / referred), as the bag can't know.
 */
export function bagOffers(
  subtotal: number,
  differentProducts: number,
  opts: { firstOrder?: boolean; referred?: boolean; referrerCredits?: number; occasionCodes?: string[]; now?: number } = {},
) {
  const usable = liveCoupons(opts.now).filter((c) => {
    if (c.kind === "occasion" && !opts.occasionCodes?.includes(c.code)) return false;
    if (c.kind === "referrer" && !opts.referrerCredits) return false;
    if (c.kind === "friend") return false;
    if (c.firstOrderOnly && !opts.firstOrder) return false;
    if (c.minDifferentProducts && differentProducts < c.minDifferentProducts) return false;
    return true;
  });
  const scored = usable.map((coupon) => ({ coupon, saving: couponSaving(coupon, subtotal) })).filter((o) => o.saving > 0);
  const best = [...scored].sort((a, b) => b.saving - a.saving)[0] as BagOffer | undefined;
  // The best pair: one store coupon plus one personal coupon that adds on to it.
  let combo: { coupons: BagOffer[]; saving: number } | undefined;
  for (const a of scored.filter((o) => groupOf(o.coupon) === "store")) {
    for (const b of scored.filter((o) => groupOf(o.coupon) === "personal")) {
      if (stackProblem(a.coupon, b.coupon)) continue;
      const saving = Math.min(a.saving + b.saving, Math.round(subtotal * COMBINED_CAP * 100) / 100);
      if (!combo || saving > combo.saving) combo = { coupons: [a, b], saving };
    }
  }
  const top = combo && combo.saving > (best?.saving || 0) ? combo : best ? { coupons: [best], saving: best.saving } : undefined;
  const nextTier = TIER_COUPONS.find((c) => c.minimumOrderValue > subtotal && (c.flat || 0) > (best?.saving || 0));
  return {
    best,
    /** The best coupons to use together (one or two), and what they save. */
    top,
    next: nextTier ? { coupon: nextTier, needed: Math.ceil(nextTier.minimumOrderValue - subtotal), saving: nextTier.flat || 0 } : undefined,
  };
}

const formatDay = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

/** One line describing the conditions, for the bag and the chat. */
export function couponConditions(c: StoreCoupon) {
  const parts: string[] = [];
  if (c.referredOnly) parts.push("for friends who joined with a referral link");
  if (c.referrerOnly) parts.push("once per friend whose first order is delivered");
  if (c.occasion) parts.push(`in your ${c.occasion} month, once a year`);
  if (c.minDifferentProducts) parts.push(`${c.minDifferentProducts} or more different products`);
  if (c.firstOrderOnly) parts.push("first order only");
  if (c.minimumOrderValue) parts.push(`orders of ₹${c.minimumOrderValue}+`);
  if (c.maximumDiscountAmount && c.percent !== undefined) parts.push(`up to ₹${c.maximumDiscountAmount} off`);
  if (c.endsAt) parts.push(`till ${formatDay(c.endsAt)}`);
  return parts.join(" · ");
}

const HINDI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

/** The conditions line in Hindi, for the chat. */
export function couponConditionsHi(c: StoreCoupon) {
  const parts: string[] = [];
  if (c.referredOnly) parts.push("रेफ़रल लिंक से जुड़े दोस्तों के लिए");
  if (c.referrerOnly) parts.push("हर दोस्त का पहला ऑर्डर डिलीवर होने पर एक बार");
  if (c.occasion) parts.push(c.occasion === "birthday" ? "जन्मदिन के महीने में, साल में एक बार" : "सालगिरह के महीने में, साल में एक बार");
  if (c.minDifferentProducts) parts.push(`${c.minDifferentProducts} या ज़्यादा अलग-अलग प्रोडक्ट`);
  if (c.firstOrderOnly) parts.push("सिर्फ़ पहला ऑर्डर");
  if (c.minimumOrderValue) parts.push(`₹${c.minimumOrderValue}+ के ऑर्डर`);
  if (c.maximumDiscountAmount && c.percent !== undefined) parts.push(`₹${c.maximumDiscountAmount} तक की छूट`);
  if (c.endsAt) {
    const [day, month] = new Date(c.endsAt)
      .toLocaleDateString("en-GB", { day: "numeric", month: "numeric", timeZone: "Asia/Kolkata" })
      .split("/");
    parts.push(`${day} ${HINDI_MONTHS[Number(month) - 1]} तक`);
  }
  return parts.join(" · ");
}

/** Different products in a bag (sizes of one product count once). */
export function differentProductCount(items: { productId?: string; slug?: string; title?: string }[]) {
  return new Set(items.map((i) => i.productId || i.slug || i.title).filter(Boolean)).size;
}

/**
 * One short line nudging a bigger bag, for add-to-bag messages:
 * free delivery first, then the best coupon now, then the next spend-more step.
 */
export function bagNudge(subtotal: number, differentProducts: number, freeFrom = 399) {
  const { best, next } = bagOffers(subtotal, differentProducts);
  const parts: string[] = [];
  if (subtotal > 0 && subtotal < freeFrom) parts.push(`Add ₹${Math.ceil(freeFrom - subtotal)} more for free delivery`);
  if (best) parts.push(`${best.coupon.code} saves you ₹${Math.round(best.saving)} now`);
  if (next) parts.push(`add ₹${next.needed} more to save ₹${next.saving} with ${next.coupon.code}`);
  const line = parts.join(", ");
  return line ? `${line[0].toUpperCase()}${line.slice(1)}.` : "";
}
