// The Potent chat's answer finder. No AI and no server: it scores what the
// visitor typed against the approved answer bank and returns the best match,
// close alternatives, or nothing (so the chat can hand over to a person).

import type { ChatAnswer } from "@/const/chatbot/types";
import { ALL_ANSWERS } from "@/const/chatbot";

const STOPWORDS = new Set(
  (
    "a an the is are am was were be been i me my mine we our you your u ur it its this that these those to of in on at for from with by " +
    "and or but so if then than do does did done can could should would will shall may might must have has had please pls plz tell know want " +
    "about any some there here what which who whom whose why how when where " +
    // Hinglish fillers
    "hai hain ho tha thi the ka ki ke ko se me mein mai main mujhe mera meri mere hum aap ap tum kya kyu kyun kaise kaisa kaisi kab kahan kaha " +
    "koi kuch bhi to toh na nahi nhi ya aur ek yeh ye woh wo isme usme liye lie jo ji haan han sir mam maam madam bhai didi"
  ).split(" "),
);

// Words that mean the same thing for matching purposes.
const SYNONYMS: Record<string, string> = {
  periods: "period", mc: "period", mahwari: "period", masik: "period", chums: "period", menses: "period", menstruation: "period", menstrual: "period",
  pads: "pad", napkin: "pad", napkins: "pad", sanitary: "pad",
  liner: "liner", liners: "liner", pantyliner: "liner",
  cups: "cup", menstrualcup: "cup",
  panties: "panty", pantie: "panty", underwear: "panty",
  funnel: "funnel", stp: "funnel", standing: "funnel",
  seatcover: "seatcover", seatcovers: "seatcover",
  vomit: "puke", ulti: "puke",
  urine: "pee", peshab: "pee", susu: "pee", toilet: "toilet", washroom: "toilet", bathroom: "toilet", loo: "toilet",
  delivery: "deliver", delivered: "deliver", shipping: "deliver", ship: "deliver", shipped: "deliver", dispatch: "deliver", courier: "deliver",
  refund: "refund", refunds: "refund", wapas: "refund", paisa: "money", paise: "money",
  cancel: "cancel", cancelled: "cancel", cancellation: "cancel",
  subscribe: "subscription", subscriptions: "subscription", subscribed: "subscription",
  price: "price", cost: "price", rate: "price", kimat: "price", keemat: "price", daam: "price", rs: "price", rupees: "price",
  dard: "pain", cramps: "pain", cramp: "pain", ache: "pain",
  khoon: "blood", bleeding: "blood", bleed: "blood",
  ladki: "girl", beti: "daughter", bachi: "girl", bacchi: "girl",
  safar: "travel", yatra: "travel", journey: "travel", trip: "travel", travelling: "travel", traveling: "travel",
  xlplus: "xlplus", "xl+": "xlplus",
  bulk: "bulk", wholesale: "bulk", corporate: "bulk", b2b: "bulk",
};

function stem(word: string): string {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/xl\s*\+|xl\s*plus/g, " xlplus ")
    .replace(/[^a-z0-9+\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): string[] {
  return normalise(text)
    .split(" ")
    .map((w) => SYNONYMS[w] || w)
    .map(stem)
    .map((w) => SYNONYMS[w] || w)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function closeEnough(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 2 || a.length < 5) return false;
  const limit = a.length >= 8 ? 2 : 1;
  // Edit distance where swapping two neighbouring letters counts as one edit.
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let best = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      best = Math.min(best, d[i][j]);
    }
    if (best > limit) return false;
  }
  return d[a.length][b.length] <= limit;
}

type Indexed = {
  answer: ChatAnswer;
  words: Map<string, number>; // word → weight
  questionWords: Set<string>;
  phrases: string[]; // normalised phrasings and multi-word keywords
  live: boolean; // read from the live site (product FAQs, FAQ page, Journal)
};

let LIVE_ANSWERS: ChatAnswer[] = [];

/** Adds answers read from the live site. Hand-written answers win ties. */
export function addLiveAnswers(list: ChatAnswer[]) {
  const known = new Set(ALL_ANSWERS.map((a) => a.id));
  LIVE_ANSWERS = list.filter((a) => a && a.id && !known.has(a.id) && a.question && a.answer);
  INDEX = null;
}

const allAnswers = () => [...ALL_ANSWERS, ...LIVE_ANSWERS];

let INDEX: Indexed[] | null = null;
let IDF: Map<string, number> | null = null;
let VOCAB: string[] = [];

function buildIndex() {
  if (INDEX) return;
  const docFreq = new Map<string, number>();
  const liveIds = new Set(LIVE_ANSWERS.map((a) => a.id));
  INDEX = allAnswers().map((answer) => {
    const words = new Map<string, number>();
    const add = (text: string, weight: number) =>
      tokens(text).forEach((w) => words.set(w, Math.max(words.get(w) || 0, weight)));
    add(answer.question, 1);
    answer.phrasings.forEach((p) => add(p, 1));
    answer.keywords.forEach((k) => add(k, 1.6));
    words.forEach((_, w) => docFreq.set(w, (docFreq.get(w) || 0) + 1));
    const phrases = [answer.question, ...answer.phrasings, ...answer.keywords.filter((k) => k.includes(" "))]
      .map(normalise)
      .filter((p) => p.length >= 6 && p.includes(" "));
    return { answer, words, phrases, questionWords: new Set(tokens(answer.question)), live: liveIds.has(answer.id) };
  });
  const n = INDEX.length;
  IDF = new Map([...docFreq].map(([w, df]) => [w, Math.log(1 + n / df)]));
  VOCAB = [...docFreq.keys()];
}

// Context words: a question about the body should not get an order answer,
// and an order question should not get a health answer.
const BODY_WORDS = new Set([
  "period", "blood", "pain", "discharge", "pregnant", "pregnancy", "doctor", "pcos", "itch", "itching", "burning", "menopause",
  "ovulation", "cramp", "spotting", "clot", "mood", "pms", "pmdd", "vagina", "vaginal", "infection", "uti", "acne", "late", "missed",
  "irregular", "dard", "bleed", "khoon", "smell", "rash",
]);
const ORDER_WORDS = new Set([
  "order", "deliver", "parcel", "package", "track", "tracking", "refund", "payment", "paid", "address", "invoice", "coupon",
  "account", "login", "password", "otp", "checkout", "cart", "awb", "subscription",
]);
const ORDER_TOPICS = new Set(["orders", "delivery", "payments", "subscriptions", "returns", "account", "rewards", "business", "contact"]);
const BODY_TOPICS = new Set(["periods", "health"]);

/** Top candidates of the last search, for testing. */
export let lastScored: string[] = [];

export type ChatResult =
  | { kind: "answer"; answer: ChatAnswer; alternatives: ChatAnswer[] }
  | { kind: "unsure"; options: ChatAnswer[] }
  | { kind: "none" };

export function findAnswer(text: string): ChatResult {
  buildIndex();
  const query = tokens(text);
  const normQuery = ` ${normalise(text)} `;
  if (!query.length) return { kind: "none" };

  // Fix typos against the known vocabulary once per query word.
  const resolved = query.map((q) => {
    if (IDF!.has(q)) return { word: q, fuzzy: false };
    const near = VOCAB.find((v) => closeEnough(q, v));
    return near ? { word: near, fuzzy: true } : { word: q, fuzzy: false };
  });

  const words = new Set(resolved.map((r) => r.word));
  const aboutBody = [...words].some((w) => BODY_WORDS.has(w));
  const aboutOrder = [...words].some((w) => ORDER_WORDS.has(w));

  const scored = INDEX!.map((doc) => {
    let score = 0;
    let matched = 0;
    for (const { word, fuzzy } of resolved) {
      const weight = doc.words.get(word);
      if (weight) {
        score += (IDF!.get(word) || 1) * weight * (fuzzy ? 0.75 : 1);
        matched += 1;
      }
    }
    // A whole phrasing inside the question is a strong signal.
    for (const p of doc.phrases) {
      if (normQuery.includes(` ${p} `)) {
        score += 2 + p.split(" ").length * 0.6;
        break;
      }
    }
    // Prefer the answer whose own question is closest to what was asked.
    if (doc.questionWords.size) {
      let overlap = 0;
      doc.questionWords.forEach((w) => words.has(w) && overlap++);
      score += 2 * (overlap / doc.questionWords.size);
    }
    if (doc.live) score *= 0.85;
    const topic = doc.answer.topic;
    if (aboutBody && !aboutOrder && ORDER_TOPICS.has(topic)) score *= 0.5;
    if (aboutOrder && !aboutBody && BODY_TOPICS.has(topic)) score *= 0.6;
    return { doc, score, coverage: matched / resolved.length };
  });

  scored.sort((a, b) => b.score - a.score);
  lastScored = scored.slice(0, 5).map((s) => `${s.doc.answer.id} ${s.score.toFixed(2)} cov ${s.coverage.toFixed(2)}`);
  const [top, second] = scored;
  if (!top || top.score < 2.2) return { kind: "none" };

  const confident = top.score >= 4.5 && top.coverage >= 0.5;
  const clearWinner = !second || top.score >= second.score * 1.25;
  const alternatives = scored
    .slice(1, 4)
    .filter((s) => s.score >= top.score * 0.6)
    .map((s) => s.doc.answer);

  if (confident && clearWinner) return { kind: "answer", answer: top.doc.answer, alternatives };
  if (confident) return { kind: "answer", answer: top.doc.answer, alternatives };
  // Only offer suggestions when at least half of the question matched something.
  if (!scored.slice(0, 5).some((x) => x.coverage >= 0.5)) return { kind: "none" };
  return {
    kind: "unsure",
    options: scored.slice(0, 3).filter((s) => s.score >= 2.2 && s.coverage >= 0.4).map((s) => s.doc.answer),
  };
}

export function answerById(id: string): ChatAnswer | undefined {
  return allAnswers().find((a) => a.id === id);
}

// ---- Conversation helpers ----

export function isGreeting(text: string): boolean {
  return /^(hi+|hello+|hey+|hiya|namaste|namaskar|helo|good (morning|afternoon|evening)|hola|ram ram|sat sri akal|salaam|assalam\w*)( (there|ji|potent|team))?$/.test(
    normalise(text),
  );
}

/** "Yes", "haan", "open it": go ahead with what was just suggested. */
export function isYes(text: string): boolean {
  return /^(yes|yes please|yeah|yep|yup|ya|haan|han|haa|ha ji|haan ji|sure|go|chalo|show me|take me there|open it|open|yes take me there|yes open it|please do)$/.test(
    normalise(text),
  );
}

/** "Ok", "thanks", "got it": an acknowledgement, not a question. */
export function isAck(text: string): boolean {
  return /^(ok|okay|okk+|k|kk|ok thanks|ok thank you|thanks|thank you|thank u|thanku|thx|ty|dhanyavad|dhanyawad|shukriya|got it|cool|nice|great|fine|alright|theek hai|thik hai|accha|acha|achha|hmm+|done|perfect|awesome|super|understood|samajh gaya|samajh gayi)$/.test(
    normalise(text),
  );
}

/** "No", "nahi", "no thanks". */
export function isNo(text: string): boolean {
  return /^(no|nope|nah|no thanks|no thank you|nahi|nhi|na|not now|nothing|nothing else|bas|that's all|thats all|no that's all)$/.test(
    normalise(text).replace(/'/g, ""),
  );
}

const NOT_NAMES =
  /^(diabetic|pregnant|bleeding|worried|anxious|tired|sick|ill|unwell|hungry|bored|confused|lost|stuck|here|back|ready|done|sorry|single|married|divorced|not|so|very|a|an|the|pregnant|having|on|in|feeling|getting|sick|okay|fine|good|late|worried|confused|looking|trying|bleeding|unable|from|here|new|back|ok|hai|thinking|using|buying|scared|married|single|a|student|teen|mom|mother|going|travelling|traveling)$/i;

/** "My name is Priya", "mera naam Priya hai", "call me Priya", or just "I'm Priya". */
export function extractName(text: string): string | null {
  const t = text.trim();
  const clear = t.match(/\b(?:my name is|my name's|mera naam|mera nam|call me|naam hai)\s+([A-Za-z]{2,20})\b/i);
  const short = t.match(/^(?:hi|hello|hey)?[\s,!.]*(?:i am|i'm|im|main)\s+([A-Za-z]{2,20})[\s!.]*$/i);
  const m = clear || short;
  if (!m || NOT_NAMES.test(m[1])) return null;
  return m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
}

export type NavTarget = { label: string; href: string };

const NAV: { label: string; href: string; words: string[] }[] = [
  { label: "the homepage", href: "/", words: ["home", "homepage", "home page", "main page"] },
  { label: "all products", href: "/shop", words: ["shop", "all products", "products", "store", "shop all"] },
  { label: "Ovy", href: "/ovy", words: ["ovy", "ovy page"] },
  { label: "Looway", href: "/looway", words: ["looway", "looway page"] },
  { label: "the Yatra Kit builder", href: "/looway-yatra-kit", words: ["yatra kit", "travel kit", "kit builder"] },
  { label: "the period tracker", href: "/period-log", words: ["period tracker", "tracker", "period calculator", "period log"] },
  { label: "the Journal", href: "/blog", words: ["journal", "blog", "blogs", "articles"] },
  { label: "the FAQs", href: "/faq", words: ["faq", "faqs", "faq page"] },
  { label: "the contact page", href: "/contact", words: ["contact", "contact us", "contact page"] },
  { label: "About us", href: "/about", words: ["about", "about us", "your story"] },
  { label: "Potent for Business", href: "/business", words: ["business", "b2b", "business page", "for business"] },
  { label: "your bag", href: "/cart", words: ["cart", "my cart", "my bag", "shopping bag", "basket", "checkout"] },
  { label: "your wishlist", href: "/wishlist", words: ["wishlist", "wish list", "saved items"] },
  { label: "your orders", href: "/dashboard/orders", words: ["orders", "my orders", "order history"] },
  { label: "your subscriptions", href: "/dashboard/subscriptions", words: ["subscriptions", "my subscriptions"] },
  { label: "Rewards and referrals", href: "/dashboard/referral", words: ["rewards", "referral", "refer and earn", "my rewards"] },
  { label: "your account", href: "/dashboard", words: ["account", "my account", "profile", "dashboard"] },
  { label: "sign in", href: "/login", words: ["login", "log in", "sign in", "signin"] },
  { label: "sign up", href: "/signup", words: ["signup", "sign up", "register", "create account"] },
  { label: "the shipping policy", href: "/shipping-policy", words: ["shipping policy", "delivery policy"] },
  { label: "the refund policy", href: "/refund-policy", words: ["refund policy", "return policy", "cancellation policy"] },
  { label: "the privacy policy", href: "/privacy-policy", words: ["privacy policy"] },
  { label: "the terms", href: "/terms-condition", words: ["terms", "terms and conditions"] },
  { label: "Ovy pads", href: "/product-detail/ovy-pads", words: ["pads", "pad", "sanitary pads", "ovy pads", "mix your box"] },
  { label: "Ovy liners", href: "/product-detail/ovy-liners", words: ["liners", "liner", "panty liners"] },
  { label: "Ovy period panties", href: "/product-detail/ovy-panty", words: ["period panty", "period panties", "panties"] },
  { label: "Ovy Teen kits", href: "/product-detail/ovy-teen", words: ["teen", "teen kit", "teen kits", "first period kit"] },
  { label: "the Ovy cup", href: "/product-detail/ovy-cup", words: ["cup", "menstrual cup", "ovy cup", "size quiz", "cup size quiz"] },
  { label: "the pee funnel", href: "/product-detail/looway-pee-funnel", words: ["funnel", "pee funnel"] },
  { label: "the urine and vomit bags", href: "/product-detail/looway-pee-puke", words: ["pee bags", "vomit bags", "puke bags", "urine bags", "pee puke bags"] },
  { label: "the toilet seat covers", href: "/product-detail/looway-toilet-seat-covers", words: ["seat covers", "toilet seat covers", "seat cover"] },
];

const NAV_VERB =
  /^(?:please )?(?:take me to|go to|goto|open|show me|navigate to|bring me to|redirect me to|send me to|i want to go to|le chalo|le jao|chalo|visit)\s+(?:the |my |your )?(.+)$/;
const NAV_SUFFIX = /^(.+?)\s+(?:kholo|khol do|dikhao|pe le chalo|par le chalo|pe chalo|open karo)$/;

/** "Take me to my cart", "open the cup page", "cart kholo", or just "cart". */
export function findNavigation(text: string): NavTarget | null {
  const t = normalise(text);
  const verb = t.match(NAV_VERB) || t.match(NAV_SUFFIX);
  const target = (verb ? verb[1] : t).replace(/\b(page|section|tab|please|pls)\b/g, " ").replace(/\s+/g, " ").trim();
  for (const n of NAV) {
    if (n.words.includes(target)) return { label: n.label, href: n.href };
  }
  if (!verb || target.split(" ").length > 3) return null;
  // Longest matching name first, so "toilet seat covers" beats "covers".
  let best: { n: (typeof NAV)[number]; len: number } | null = null;
  for (const n of NAV) {
    for (const w of n.words) {
      if ((` ${target} `).includes(` ${w} `) && (!best || w.length > best.len)) best = { n, len: w.length };
    }
  }
  return best ? { label: best.n.label, href: best.n.href } : null;
}


// Safety first: these are answered before anything else.
const CRISIS =
  /\b(suicid\w*|kill (my ?self|myself)|end (my|this) life|want to die|wanna die|self ?harm|cut(ting)? myself|khud ?kushi|aatmahatya|atmahatya|mar ?jana chahti|marna chahti|jeena nahi)\b/;
const ABUSE = /\b(rape[d]?|sexual(ly)? assault\w*|molest\w*|abuse[d]?|touched me|domestic violence|beat(s|ing)? me|harass\w*)\b/;
const EMERGENCY =
  /\b(faint(ed|ing)?|unconscious|behosh|can'?t breathe|cannot breathe|chest pain|soaking .{0,20}every hour|bleeding (a lot|heavily) .{0,20}(pregnan|dizzy)|severe pain .{0,20}pregnan|pregnan\w* .{0,20}(bleeding|severe pain))\b/;

export type SafetyResult = { kind: "crisis" | "abuse" | "emergency" } | null;

export function safetyCheck(text: string): SafetyResult {
  const t = normalise(text);
  if (CRISIS.test(t)) return { kind: "crisis" };
  if (ABUSE.test(t)) return { kind: "abuse" };
  if (EMERGENCY.test(t)) return { kind: "emergency" };
  return null;
}

/** Asking for a price: the chat never quotes one, it points to the product page. */
export function isPriceQuestion(text: string): boolean {
  const t = normalise(text);
  if (/\b(price|prices|pricing|mrp|kimat|keemat|daam|kitne ka|kitne ki|kitna ka|kitni ki|kitne rupay|kitne rupees|kitne rs)\b/.test(t)) return true;
  if (/\bcost(s|ing)?\b/.test(t) && !/\bcost of living\b/.test(t)) return true;
  return /\bhow much (is|are|does|do|for|will)\b.{0,30}\b(pad|pads|cup|cups|liner|liners|panty|panties|funnel|bag|bags|cover|covers|kit|kits|box|it|this|that|they|one)\b/.test(t);
}

/** Load and index the answers ahead of time, so the first reply is instant. */
export function warmUp() {
  buildIndex();
}

