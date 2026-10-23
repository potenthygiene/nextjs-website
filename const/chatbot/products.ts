import type { ChatAnswer } from "./types";
import type { ProductKey } from "./symptomTypes";

// Product details the chat shows on cards. Live prices, sizes and offers
// come from /api/chat-knowledge; these are the fixed parts.

export const PRODUCT_META: Record<ProductKey, { name: string; brand: "Ovy" | "Looway" | "Potent"; href: string; image: string; line: string }> = {
  "ovy-pads": {
    name: "Ovy Organic Sanitary Pads",
    brand: "Ovy",
    href: "/product-detail/ovy-pads",
    image: "/product-images/pads.jpg",
    line: "L, XL and XL+ · BIS certified · rash-free",
  },
  "ovy-liners": {
    name: "Ovy Daily Panty Liners",
    brand: "Ovy",
    href: "/product-detail/ovy-liners",
    image: "/product-images/liners.jpg",
    line: "Thin, breathable · dermatologically tested",
  },
  "ovy-panty": {
    name: "Ovy Super Slim Period Panties",
    brand: "Ovy",
    href: "/product-detail/ovy-panty",
    image: "/ovy/panty-box.jpg",
    line: "Leak-proof · for heavy days and nights",
  },
  "ovy-teen": {
    name: "Ovy Teen First Period Kits",
    brand: "Ovy",
    href: "/product-detail/ovy-teen",
    image: "/product-images/teen.jpg",
    line: "Soft teen pads and kits for first periods",
  },
  "ovy-cup": {
    name: "Ovy Menstrual Cup",
    brand: "Ovy",
    href: "/product-detail/ovy-cup",
    image: "/product-images/cup.jpg",
    line: "Medical-grade silicone · Teen, Medium, Large",
  },
  "looway-pee-funnel": {
    name: "Looway Reusable Pee Funnel",
    brand: "Looway",
    href: "/product-detail/looway-pee-funnel",
    image: "/product-images/funnel.jpg",
    line: "Pee standing up, anywhere · washable",
  },
  "looway-pee-puke": {
    name: "Looway Pee & Puke Bags",
    brand: "Looway",
    href: "/product-detail/looway-pee-puke",
    image: "/product-images/pukebags.jpg",
    line: "Leak-proof · turns liquid to gel",
  },
  "looway-toilet-seat-covers": {
    name: "Looway Toilet Seat Covers",
    brand: "Looway",
    href: "/product-detail/looway-toilet-seat-covers",
    image: "/product-images/seatcovers.jpg",
    line: "Biodegradable paper · use, fold and bin",
  },
  "looway-yatra-kit": {
    name: "Looway Yatra Kit",
    brand: "Looway",
    href: "/looway-yatra-kit",
    image: "/looway/yatra-kit-thumb-v2.png",
    line: "Build one travel hygiene kit for the trip",
  },
  "period-tracker": {
    name: "Free Period Tracker",
    brand: "Potent",
    href: "/period-log",
    image: "/trackermainImage.png",
    line: "See your next periods in seconds",
  },
};

export type Combo = { id: string; title: string; why: string; items: ProductKey[] };

export const COMBOS: Combo[] = [
  { id: "day-night", title: "Day and night cover", why: "XL by day and XL+ at night, in one Mix Your Box.", items: ["ovy-pads"] },
  { id: "pads-liners", title: "Pads + liners", why: "Pads for your period, liners for the light days and discharge in between.", items: ["ovy-pads", "ovy-liners"] },
  { id: "heavy-nights", title: "Heavy-night set", why: "XL+ pads for the day, a leak-proof period panty for the night.", items: ["ovy-pads", "ovy-panty"] },
  { id: "cup-backup", title: "Cup + liner backup", why: "A reusable cup, with a liner as backup while you learn.", items: ["ovy-cup", "ovy-liners"] },
  { id: "school-ready", title: "School-ready teen set", why: "A teen kit for her bag, seat covers for school toilets.", items: ["ovy-teen", "looway-toilet-seat-covers"] },
  { id: "travel-trio", title: "Travel trio", why: "Seat covers, a pee funnel and pee bags: every toilet on the trip, sorted.", items: ["looway-toilet-seat-covers", "looway-pee-funnel", "looway-pee-puke"] },
  { id: "period-travel", title: "Periods on the go", why: "Pads and seat covers in one pouch for trains and highways.", items: ["ovy-pads", "looway-toilet-seat-covers"] },
];

// Products worth suggesting after an answer, by what the answer is about.
const RULES: [RegExp, ProductKey[]][] = [
  [/(vomit|puke|motion|car-sick|nausea-travel|bags)/, ["looway-pee-puke"]],
  [/(funnel|pee-outdoors|bus-wont-stop|highway|darshan|trek|camp|no-toilet)/, ["looway-pee-funnel", "looway-toilet-seat-covers"]],
  [/(seat|public-toilet|train-toilet|squat|office-desk|hostel|toilet)/, ["looway-toilet-seat-covers"]],
  [/(yatra|kit-|pilgrim|kumbh|travel|trip|flight|road)/, ["looway-yatra-kit", "looway-toilet-seat-covers"]],
  [/(first-period|teen|daughter|puberty|school|tell-parent)/, ["ovy-teen"]],
  [/(cup)/, ["ovy-cup"]],
  [/(heavy|clot|night|postpartum|after-birth|flood|leak|perimenopause|menopause|panty)/, ["ovy-pads", "ovy-panty"]],
  [/(discharge|spotting|light-period|liner|bladder)/, ["ovy-liners"]],
  [/(rash|sensitive|chemical|pads-safe|pad-)/, ["ovy-pads"]],
  [/(late|irregular|cycle|ovulat|fertile|tracker|day-one|symptom-diary)/, ["period-tracker"]],
];

/** Up to two products that genuinely relate to an answer. */
export function productsFor(answer: ChatAnswer): ProductKey[] {
  if (["orders", "delivery", "payments", "returns", "account", "rewards", "contact", "small-talk", "brand", "business"].includes(answer.topic)) return [];
  // Health answers about infections or urgent care get no product push.
  if (/(uti|burning|itch|fever|tss|sti|cancer|lump|miscarriage|abortion|dark-thoughts|faint|pmdd|severe|endometriosis)/.test(answer.id)) return [];
  const topicDefault: Partial<Record<ChatAnswer["topic"], ProductKey>> = {
    "ovy-pads": "ovy-pads",
    "ovy-liners": "ovy-liners",
    "ovy-panty": "ovy-panty",
    "ovy-teen": "ovy-teen",
    "ovy-cup": "ovy-cup",
    "looway-funnel": "looway-pee-funnel",
    "looway-bags": "looway-pee-puke",
    "looway-seat-covers": "looway-toilet-seat-covers",
    "yatra-kit": "looway-yatra-kit",
  };
  const found = new Set<ProductKey>();
  const own = topicDefault[answer.topic];
  if (own) found.add(own);
  for (const [re, keys] of RULES) {
    if (re.test(answer.id)) keys.forEach((k) => found.add(k));
    if (found.size >= 2) break;
  }
  return [...found].slice(0, 2);
}

/** A combo that includes the first suggested product, if any. */
export function comboFor(keys: ProductKey[]): Combo | undefined {
  if (!keys.length) return undefined;
  return COMBOS.find((c) => c.items.includes(keys[0]) && c.items.length > 1);
}
