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
  // Leftover HTML in admin-entered text.
  [/&amp;/g, "&"],
  [/<\/?b>/g, ""],
];

export function fixProductText<T extends string | null | undefined>(text: T): T {
  if (!text) return text;
  let out: string = text;
  for (const [pattern, replacement] of TEXT_FIXES) {
    out = out.replace(pattern, replacement);
  }
  return out as T;
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
