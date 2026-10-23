// The Potent chat answers from this approved bank only (no AI). Text in
// `answer` accepts **bold** and [link text](/path) and nothing else.

export type ChatTopic =
  | "orders"
  | "delivery"
  | "payments"
  | "subscriptions"
  | "returns"
  | "account"
  | "rewards"
  | "business"
  | "contact"
  | "ovy-pads"
  | "ovy-liners"
  | "ovy-panty"
  | "ovy-teen"
  | "ovy-cup"
  | "looway-funnel"
  | "looway-bags"
  | "looway-seat-covers"
  | "yatra-kit"
  | "travel"
  | "periods"
  | "health"
  | "brand"
  | "small-talk";

export type ChatAnswer = {
  /** Unique, kebab-case, prefixed by the file's domain, e.g. "ord-track-order". */
  id: string;
  topic: ChatTopic;
  /** The question as shown on a suggestion button. Short, under 70 characters. */
  question: string;
  /** 6 to 14 natural ways people ask it, English and Hinglish, as typed on a phone. */
  phrasings: string[];
  /** Strong words or short phrases that point to this answer, English and Hinglish. */
  keywords: string[];
  /** 20 to 80 words. Plain, warm, direct. */
  answer: string;
  /** Up to 2 buttons. */
  links?: { label: string; href: string }[];
  /** Ids of 2 or 3 answers to offer next, from the same file. */
  related?: string[];
};
