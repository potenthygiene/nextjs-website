// Store coupons and their extra rules. The discount itself (percentage or
// amount, minimum order, maximum discount, one use per customer) lives in the
// database and can be edited in Admin → Coupons. This file adds what the
// database can't hold: dates, how many different products the bag needs,
// first-order-only, and whether the coupon is shown to customers.
//
// To add a coupon: add an entry to STORE_COUPONS. It is created in the
// database automatically the next time checkout or Admin → Coupons loads,
// and Potent Saathi starts mentioning it once it is public and live.

export type StoreCoupon = {
  code: string;
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
  /** Shown on the site and by the chat. */
  public: boolean;
  /** Short line for banners and the chat. */
  pitch: string;
};

export const STORE_COUPONS: StoreCoupon[] = [
  {
    code: "DIWALI10",
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
  },
  {
    code: "CHHATH10",
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
  },
  {
    code: "WELCOME15",
    name: "Welcome 15% Off",
    description: "15% off your first order, for new customers",
    descriptionHi: "नए ग्राहकों के लिए पहले ऑर्डर पर 15% की छूट",
    percent: 15,
    minimumOrderValue: 399,
    maximumDiscountAmount: 150,
    useOnce: true,
    firstOrderOnly: true,
    public: true,
    pitch: "New here? 15% off your first order with WELCOME15",
  },
  {
    code: "COMBO10",
    name: "Combo 10% Off",
    description: "10% off when your bag has 2 or more different products",
    descriptionHi: "बैग में 2 या ज़्यादा अलग-अलग प्रोडक्ट होने पर 10% की छूट",
    percent: 10,
    minimumOrderValue: 0,
    maximumDiscountAmount: 200,
    useOnce: false,
    minDifferentProducts: 2,
    public: true,
    pitch: "Buy any 2 different products: 10% off with COMBO10",
  },
  {
    code: "COMBO15",
    name: "Combo 15% Off",
    description: "15% off when your bag has 3 or more different products",
    descriptionHi: "बैग में 3 या ज़्यादा अलग-अलग प्रोडक्ट होने पर 15% की छूट",
    percent: 15,
    minimumOrderValue: 0,
    maximumDiscountAmount: 300,
    useOnce: false,
    minDifferentProducts: 3,
    public: true,
    pitch: "Buy any 3 different products: 15% off with COMBO15",
  },
];

/** Codes that must never work for customers (old test coupons). */
export const BLOCKED_CODES = ["TEST20", "TEST50"];

const toTime = (s?: string) => (s ? new Date(s).getTime() : undefined);

export function couponRules(code: string) {
  return STORE_COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

export function isCouponLive(c: StoreCoupon, now = Date.now()) {
  const start = toTime(c.startsAt);
  const end = toTime(c.endsAt);
  return (start === undefined || now >= start) && (end === undefined || now <= end);
}

/** Public coupons a customer can use today, most relevant first. */
export function liveCoupons(now = Date.now()) {
  return STORE_COUPONS.filter((c) => c.public && isCouponLive(c, now));
}

/** The festive coupon running today, for banners. */
export function festiveCoupon(now = Date.now()) {
  return liveCoupons(now).find((c) => c.startsAt && c.endsAt);
}

const formatDay = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

/** One line describing the conditions, for the bag and the chat. */
export function couponConditions(c: StoreCoupon) {
  const parts: string[] = [];
  if (c.minDifferentProducts) parts.push(`${c.minDifferentProducts} or more different products`);
  if (c.firstOrderOnly) parts.push("first order only");
  if (c.minimumOrderValue) parts.push(`orders of ₹${c.minimumOrderValue}+`);
  if (c.maximumDiscountAmount) parts.push(`up to ₹${c.maximumDiscountAmount} off`);
  if (c.endsAt) parts.push(`till ${formatDay(c.endsAt)}`);
  return parts.join(" · ");
}

const HINDI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

/** The conditions line in Hindi, for the chat. */
export function couponConditionsHi(c: StoreCoupon) {
  const parts: string[] = [];
  if (c.minDifferentProducts) parts.push(`${c.minDifferentProducts} या ज़्यादा अलग-अलग प्रोडक्ट`);
  if (c.firstOrderOnly) parts.push("सिर्फ़ पहला ऑर्डर");
  if (c.minimumOrderValue) parts.push(`₹${c.minimumOrderValue}+ के ऑर्डर`);
  if (c.maximumDiscountAmount) parts.push(`₹${c.maximumDiscountAmount} तक की छूट`);
  if (c.endsAt) {
    const [day, month] = new Date(c.endsAt)
      .toLocaleDateString("en-GB", { day: "numeric", month: "numeric", timeZone: "Asia/Kolkata" })
      .split("/");
    parts.push(`${day} ${HINDI_MONTHS[Number(month) - 1]} तक`);
  }
  return parts.join(" · ");
}
