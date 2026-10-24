// Corrections applied when product text is read from the database, so the
// pages follow the store rules even where older admin text says otherwise.
// Nothing here writes to the database.

const NO_RETURNS_ANSWER =
  "As a personal hygiene product, it can’t be returned, refunded or replaced once delivered. You can cancel an order until it ships, and a cancelled order is refunded in full. Questions about your order? Email care@potenthygiene.com.";

const TEXT_FIXES: [RegExp, string][] = [
  // Free delivery is on orders of ₹399 and above.
  [/(over|above) ₹\s?599/g, "$1 ₹399"],
  // Subscription discounts and options.
  [/Subscribe monthly \(10% off\)/g, "Subscribe monthly (15% off)"],
  [/every 2 months \(5% off\)/g, "every 2 months (12% off)"],
  [/You can change, pause or cancel any time/g, "You can pause or cancel any time"],
  // The funnel is reusable.
  [/Disposable stand-and-pee funnel/g, "Reusable stand-and-pee funnel"],
  // Packaging is bold, not hidden.
  [/plain (&|and) discreet on the outside/gi, "bold and proud on the outside"],
  // Orders are dispatched within 24 to 48 hours.
  [/\b(ship|ships|shipped|dispatch|dispatched|sent out|packed)( \w+)? within 24 hours\b(?! to)/gi, "$1$2 within 24 to 48 hours"],
  // No long dashes in customer-facing text. Number ranges read "to"; elsewhere a comma reads the same.
  [/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1 to $2"],
  [/\s*[\u2013\u2014]\s*/g, ", "],
  // Leftover HTML in admin-entered text.
  [/&amp;/g, "&"],
  [/<\/?b>/g, ""],
];

// The menstrual cup is a Potent Hygiene product, not an Ovy one. Older admin
// text calls it "Ovy Menstrual Cup" or "Ovy Cup"; it reads "Potent Hygiene
// Menstrual Cup" everywhere it is shown. Capitals are kept as they were.
const OVY_CUP = /\bOvy(\s+reusable)?(\s+menstrual)?\s+(cups?)\b/gi;

function cupBrand(match: string, reusable?: string, menstrual?: string, cup = "Cup"): string {
  const upper = match === match.toUpperCase();
  const capital = /^[A-Z]/.test(cup);
  const word = menstrual ? menstrual.trim() : capital ? "Menstrual" : "menstrual";
  const out = `Potent Hygiene${reusable ? ` ${reusable.trim()}` : ""} ${word} ${cup}`;
  return upper ? out.toUpperCase() : out;
}

export function fixProductText<T extends string | null | undefined>(text: T): T {
  if (!text) return text;
  let out: string = text;
  for (const [pattern, replacement] of TEXT_FIXES) {
    out = out.replace(pattern, replacement);
  }
  out = out.replace(OVY_CUP, cupBrand);
  return out as T;
}

// Product and variant names from the database, for cards, the product page,
// the bag, orders and the chat.
export function fixProductName<T extends string | null | undefined>(name: T): T {
  if (!name) return name;
  return name.replace(OVY_CUP, cupBrand) as T;
}

// Fixes the name of a product and of each of its variants, leaving everything
// else as it came from the database.
export function fixVariantNames<V extends { name?: string | null }>(variants: V[]): V[] {
  return variants.map((v) => ({ ...v, name: fixProductName(v.name) }));
}

// Short product highlights shown on cards. Claims the rules don't allow are
// swapped for honest ones.
const HIGHLIGHT_FIXES: Record<string, string> = {
  flushable: "Bin after use, never flush",
  "zero germ contact": "No direct seat contact",
  "eco-friendly & reusable": "Reusable for years",
  "eco-friendly and reusable": "Reusable for years",
};

export function fixHighlights(list: string[] | null | undefined): string[] {
  return (list || []).map((h) => HIGHLIGHT_FIXES[h.trim().toLowerCase()] || fixProductText(h));
}

export function fixProductFaq<T extends { question?: string | null; answer?: string | null }>(
  faq: T,
): T {
  const answer = fixProductText(faq.answer);
  return {
    ...faq,
    question: fixProductText(faq.question),
    answer:
      answer && /make it right|hassle-free replacement|replaced free/i.test(answer)
        ? NO_RETURNS_ANSWER
        : answer,
  };
}
