// Shared rules for every quiz on the site and its chat version
// (const/chatbot/quizzes.ts). The pages and the chat both call these
// functions, so the same taps always give the same pick.
// Pure data and functions only. Never put a price in here: pages show the
// live price from the product data, and the chat shows live prices itself.

import { MIX_BOX_SHORTCUTS, normalizePadSize, type MixBoxRecipe, type PadSize } from "../lib/mixYourBox";

export type { PadSize };
export type QuizOptionDef = { id: string; label: string; sub?: string };
export type QuizStepDef = { id: string; question: string; helper?: string; options: QuizOptionDef[] };
export type QuizAnswers = Record<string, string | undefined>;

/* ------------------------------------------------------------------ */
/* Pads                                                                */
/* ------------------------------------------------------------------ */

export type PadMixId = "recommended" | "lighter_flow" | "heavier_flow" | "more_nights";
export type PadPickKey = PadSize | `mix:${PadMixId}`;

export const isMixPick = (key: PadPickKey): key is `mix:${PadMixId}` => key.startsWith("mix:");

/** The Mix Your Box recipe for a mix pick (same presets as the box builder). */
export function mixRecipeFor(key: PadPickKey): MixBoxRecipe | null {
  if (!isMixPick(key)) return null;
  const id = key.slice(4);
  return MIX_BOX_SHORTCUTS.find((s) => s.id === id)?.recipe ?? null;
}

export const PAD_PICKS: Record<PadPickKey, { label: string; short: string; title: string; why: string; altWhy: string }> = {
  L: {
    label: "L (240mm)",
    short: "L",
    title: "Your fit: Ovy L pads (240mm)",
    why: "A slim 240mm pad for light flow, spotting and the last days of a period, with 4 to 6 hours of rash-free cover.",
    altWhy: "L (240mm) suits your lightest days, when a longer pad feels like too much.",
  },
  XL: {
    label: "XL (280mm)",
    short: "XL",
    title: "Your fit: Ovy XL pads (280mm)",
    why: "A 280mm pad for medium to heavy flow, with up to 8 hours of rash-free cover for full school, office or travel days.",
    altWhy: "XL (280mm) gives you more length on busy days and normal nights.",
  },
  "XL+": {
    label: "XL+ (320mm)",
    short: "XL+",
    title: "Your fit: Ovy XL+ pads (320mm)",
    why: "Our longest pad: 320mm with dual leak guards and a wider back, made for heavy flow and nights.",
    altWhy: "XL+ (320mm) is the one to keep for heavy days and nights.",
  },
  "mix:recommended": {
    label: "Mix Your Box: 6 L, 9 XL, 6 XL+",
    short: "Mix Your Box",
    title: "Your fit: Mix Your Box",
    why: "Your flow changes through your period, so one box with all three sizes fits better: XL for regular days, XL+ for nights and heavy hours, L for the lighter end.",
    altWhy: "Mix Your Box puts L, XL and XL+ in one box, for when your flow changes from day to day.",
  },
  "mix:lighter_flow": {
    label: "Mix Your Box: 12 L, 6 XL, 3 XL+",
    short: "Mix Your Box",
    title: "Your fit: Mix Your Box for lighter flow",
    why: "Mostly L for your light days, with a few XL and XL+ for nights, so a night leak doesn't catch you out.",
    altWhy: "A lighter-flow Mix Your Box keeps a few XL and XL+ for nights, next to your L pads.",
  },
  "mix:heavier_flow": {
    label: "Mix Your Box: 3 L, 9 XL, 9 XL+",
    short: "Mix Your Box",
    title: "Your fit: Mix Your Box for heavier flow",
    why: "Plenty of XL and XL+ for your heavy days and nights, with a few L for the last light days.",
    altWhy: "A heavier-flow Mix Your Box adds XL and L for the days your flow eases.",
  },
  "mix:more_nights": {
    label: "Mix Your Box: 3 L, 6 XL, 12 XL+",
    short: "Mix Your Box",
    title: "Your fit: Mix Your Box for nights",
    why: "Twelve XL+ for heavy days and every night, plus XL and L as your flow eases, to stop the leaks you've been getting.",
    altWhy: "A night-heavy Mix Your Box gives you twelve XL+, with XL and L for the lighter days.",
  },
};

export const PAD_STEPS: QuizStepDef[] = [
  {
    id: "flow",
    question: "How heavy is your flow on most period days?",
    helper: "Think about a usual period, not your heaviest hour.",
    options: [
      { id: "light", label: "Light", sub: "Spotting, lighter days, the last days of a period" },
      { id: "medium", label: "Medium", sub: "A normal, steady flow on most days" },
      { id: "heavy", label: "Heavy", sub: "You soak through pads quickly on the first days" },
      { id: "variable", label: "It changes a lot", sub: "Heavy for the first 2 days, then light or medium" },
    ],
  },
  {
    id: "leaks",
    question: "Do you get leaks at night or when you move a lot?",
    helper: "Leaks usually mean you need more length at the back, not a thicker pad.",
    options: [
      { id: "rarely", label: "Rarely or never", sub: "Your cover works most of the time" },
      { id: "sometimes", label: "Sometimes at night", sub: "You wake up worried about the back of the pad" },
      { id: "often", label: "Often, day or night", sub: "Leaks happen when you sit, sleep or move" },
    ],
  },
  {
    id: "duration",
    question: "How many days does your period last?",
    helper: "Count every day you bleed, light days included.",
    options: [
      { id: "3-4", label: "3 to 4 days", sub: "A shorter period" },
      { id: "5-7", label: "5 to 7 days", sub: "The most common length" },
      { id: "7+", label: "More than 7 days", sub: "8 days or longer" },
    ],
  },
];

export type PadQuizResult = {
  primary: PadPickKey;
  alternative: PadPickKey;
  reasons: string[];
  tips: string[];
  warning?: string;
};

const PAD_REASONS = {
  flow: {
    light: "Light flow: you don't need a long, bulky pad on most days.",
    medium: "Medium flow: a 280mm pad covers a normal day without changes every couple of hours.",
    heavy: "Heavy flow: your first days need the most length and the strongest core.",
    variable: "Your flow changes: one size can't fit both your heavy days and your light ones.",
  } as Record<string, string>,
  leaks: {
    rarely: "Rare leaks: there's no need to size up just in case.",
    sometimes: "Night leaks: you need more length at the back while you sleep.",
    often: "Frequent leaks: more length and a wider back stop most leaks.",
  } as Record<string, string>,
  duration: {
    "3-4": "A shorter period: most of your days are at your usual flow.",
    "5-7": "5 to 7 days: your flow usually eases towards the end, when a lighter pad is enough.",
    "7+": "More than 7 days: you need cover for more days, light ones at the end included.",
  } as Record<string, string>,
};

export const PAD_TIPS = {
  L: "Change every 4 to 6 hours, sooner if it feels full or damp.",
  XL: "XL lasts up to 8 hours, so it also covers a normal night's sleep.",
  "XL+": "Wear XL+ to bed: the 320mm length and wider back guard against leaks while you sleep.",
  mix: "Use XL+ at night and in your heaviest hours, XL on regular days and L as your flow eases.",
  leaks: "For nights, place the pad a little further back and press the wings firmly under your underwear.",
  bin: "Roll a used pad into its disposal bag and bin it. Never flush.",
  long: "A period that often lasts more than 7 days is worth checking with a doctor.",
  soak: "If you soak through an XL+ in under 2 hours, or pass large clots, please see a doctor.",
};

export function padQuizResult(a: QuizAnswers): PadQuizResult {
  const flow = a.flow || "medium";
  const leaks = a.leaks || "rarely";
  const duration = a.duration || "5-7";
  const longPeriod = duration !== "3-4";
  let primary: PadPickKey;
  let alternative: PadPickKey;

  if (flow === "light") {
    if (leaks === "rarely") [primary, alternative] = ["L", "mix:lighter_flow"];
    else if (leaks === "sometimes") [primary, alternative] = ["mix:lighter_flow", "L"];
    else [primary, alternative] = ["XL", "mix:lighter_flow"];
  } else if (flow === "medium") {
    if (leaks === "rarely") [primary, alternative] = duration === "7+" ? ["mix:recommended", "XL"] : ["XL", "mix:recommended"];
    else if (leaks === "sometimes") [primary, alternative] = ["mix:recommended", "XL"];
    else [primary, alternative] = ["XL+", "mix:more_nights"];
  } else if (flow === "heavy") {
    if (!longPeriod) [primary, alternative] = leaks === "rarely" ? ["XL+", "mix:heavier_flow"] : ["XL+", "mix:more_nights"];
    else [primary, alternative] = leaks === "rarely" ? ["mix:heavier_flow", "XL+"] : ["mix:more_nights", "XL+"];
  } else {
    if (leaks === "rarely") [primary, alternative] = ["mix:recommended", "XL"];
    else if (leaks === "sometimes") [primary, alternative] = ["mix:heavier_flow", "XL+"];
    else [primary, alternative] = ["mix:more_nights", "XL+"];
  }

  const reasons = [PAD_REASONS.flow[flow], PAD_REASONS.leaks[leaks], PAD_REASONS.duration[duration]].filter(Boolean);
  const tips = [isMixPick(primary) ? PAD_TIPS.mix : PAD_TIPS[primary]];
  if (leaks !== "rarely") tips.push(PAD_TIPS.leaks);
  tips.push(PAD_TIPS.bin);
  const warning = duration === "7+" ? PAD_TIPS.long : flow === "heavy" && leaks === "often" ? PAD_TIPS.soak : undefined;
  return { primary, alternative, reasons, tips, warning };
}

/** The pad size a variant is, read from its size field first, then its name or SKU. */
export function padSizeOfVariant(v: { size?: string | null; name?: string | null; sku?: string | null } | null | undefined): PadSize | null {
  if (!v) return null;
  const fromSize = normalizePadSize(String(v.size || ""));
  if (fromSize) return fromSize;
  const fromName = normalizePadSize(String(v.name || ""));
  if (fromName) return fromName;
  const sku = String(v.sku || "").toUpperCase();
  if (/(^|[-_])XLP($|[-_])/.test(sku)) return "XL+";
  if (/(^|[-_])XL($|[-_])/.test(sku)) return "XL";
  if (/(^|[-_])L($|[-_])/.test(sku)) return "L";
  return null;
}

/* ------------------------------------------------------------------ */
/* Menstrual cup                                                       */
/* ------------------------------------------------------------------ */

export type CupSize = "xs" | "m" | "l";

export const CUP_SIZES: Record<CupSize, { name: string; cap: string; label: string; title: string; why: string }> = {
  xs: {
    name: "Teen (XS)",
    cap: "16 ml",
    label: "Teen (XS), 16 ml",
    title: "Your size: Teen (XS), 16 ml",
    why: "The smallest, softest Ovy cup, made for teens, first-timers and a low cervix, with light to average flow.",
  },
  m: {
    name: "Medium",
    cap: "25 ml",
    label: "Medium, 25 ml",
    title: "Your size: Medium, 25 ml",
    why: "The everyday all-rounder for average flow and cervix, if you haven't had a vaginal birth. C-section mums and many over-30s use Medium.",
  },
  l: {
    name: "Large",
    cap: "35 ml",
    label: "Large, 35 ml",
    title: "Your size: Large, 35 ml",
    why: "The largest cup, made for after a vaginal birth, heavier or longer days, and a higher cervix.",
  },
};

/** Why the second-choice size might suit, keyed "primary>alternative". */
export const CUP_ALT_WHY: Record<string, string> = {
  "xs>m": "Medium (25 ml) is the next size up, for when Teen starts to feel small or your flow gets heavier.",
  "m>xs": "Teen (XS) is shorter and softer, if Medium feels too long or firm at first.",
  "m>l": "Large (35 ml) holds more, if you find yourself emptying Medium often on heavy days.",
  "l>m": "Medium (25 ml) is shorter, if Large sits too low or feels like too much.",
};

export const CUP_STEPS: QuizStepDef[] = [
  {
    id: "age",
    question: "How old are you?",
    helper: "Teen (XS) is made for under-18s, so teens can stop here.",
    options: [
      { id: "under18", label: "Under 18" },
      { id: "adult", label: "18 or older" },
    ],
  },
  {
    id: "experience",
    question: "Have you used a menstrual cup before?",
    helper: "First-timers often find a smaller, softer cup easier to start with.",
    options: [
      { id: "first", label: "No, this is my first cup" },
      { id: "used", label: "Yes, I've used one" },
    ],
  },
  {
    id: "birth",
    question: "Have you given birth vaginally?",
    helper: "A C-section doesn't change your size, so choose No.",
    options: [
      { id: "none", label: "No, or only by C-section" },
      { id: "vaginal", label: "Yes, a vaginal birth" },
    ],
  },
  {
    id: "flow",
    question: "How heavy is your flow?",
    options: [
      { id: "light", label: "Light to normal", sub: "A pad lasts you a few hours" },
      { id: "heavy", label: "Heavy", sub: "You change pads often, or leak on heavy days" },
    ],
  },
  {
    id: "cervix",
    question: "How high is your cervix?",
    helper: "On a period day, wash your hands and slide one finger in until you feel your cervix (firm, like the tip of your nose). Note how far your finger went.",
    options: [
      { id: "low", label: "Low", sub: "I reach it at the 1st knuckle" },
      { id: "average", label: "Average", sub: "At the 2nd knuckle" },
      { id: "high", label: "High", sub: "At the 3rd knuckle, or I can't reach it" },
      { id: "unsure", label: "Not sure yet", sub: "I haven't checked" },
    ],
  },
];

/** Under-18s get Teen (XS) straight away, so the rest is not asked. */
export const cupSkip = (stepId: string, a: QuizAnswers) => a.age === "under18" && stepId !== "age";

export type CupQuizResult = { size: CupSize; alternative: CupSize; reasons: string[]; tips: string[]; warning?: string };

const CUP_REASONS: Record<string, string> = {
  under18: "You're under 18: Teen (XS) is made for teens.",
  first: "Your first cup: a smaller, softer cup is easier to fold and insert.",
  used: "You've used a cup before, so you can size by your body rather than starting small.",
  vaginal: "After a vaginal birth, a larger cup seals better.",
  none: "No vaginal birth: your size stays the same at any age, C-section included.",
  heavy: "Heavy flow: more capacity means fewer changes.",
  light: "Light to normal flow: you don't need extra capacity.",
  low: "Low cervix: a shorter cup sits more comfortably.",
  average: "Average cervix: most sizes fit, so your other answers decide.",
  high: "High cervix: you have room for a longer cup, and the stem helps you reach it.",
  unsure: "Cervix not checked yet: we've assumed average. The 20-second check will confirm it.",
};

export const CUP_TIPS = {
  fold: "Start with the punch-down fold: it makes the smallest tip and is the easiest for a first go.",
  practise: "Practise at home on a lighter day, with a liner as backup.",
  boil: "Sterilise by boiling for 5 to 7 minutes before your first use and after each period.",
  empty: "Empty, rinse and reinsert at least every 12 hours, more often on heavy days.",
  low: "With a low cervix, you may want to trim the stem.",
  high: "Keep the full stem to help you reach the base.",
  unsure: "Do the 20-second cervix check on a period day to confirm your size.",
  birth: "If your baby is recent, wait until your doctor clears you to use internal products again.",
};

export function cupQuizResult(a: QuizAnswers): CupQuizResult {
  if (a.age === "under18") {
    return {
      size: "xs",
      alternative: "m",
      reasons: [CUP_REASONS.under18],
      tips: [CUP_TIPS.fold, CUP_TIPS.practise, CUP_TIPS.boil, CUP_TIPS.empty],
    };
  }
  const first = a.experience !== "used";
  const vaginal = a.birth === "vaginal";
  const heavy = a.flow === "heavy";
  const cervix = a.cervix || "unsure";
  let size: CupSize;
  let alternative: CupSize;

  if (vaginal) {
    [size, alternative] = cervix === "low" ? ["m", "l"] : ["l", "m"];
  } else if (heavy) {
    if (cervix === "high") [size, alternative] = ["l", "m"];
    else if (cervix === "low") [size, alternative] = ["m", "xs"];
    else [size, alternative] = ["m", "l"];
  } else if (cervix === "low") {
    [size, alternative] = ["xs", "m"];
  } else if (first && cervix !== "high") {
    [size, alternative] = ["xs", "m"];
  } else if (cervix === "high") {
    [size, alternative] = ["m", "l"];
  } else {
    [size, alternative] = ["m", "xs"];
  }

  const reasons = [
    CUP_REASONS[first ? "first" : "used"],
    CUP_REASONS[vaginal ? "vaginal" : "none"],
    CUP_REASONS[heavy ? "heavy" : "light"],
    CUP_REASONS[cervix],
  ];
  const tips: string[] = [];
  if (first) tips.push(CUP_TIPS.fold, CUP_TIPS.practise);
  if (cervix === "low" || cervix === "high" || cervix === "unsure") tips.push(CUP_TIPS[cervix as "low" | "high" | "unsure"]);
  tips.push(CUP_TIPS.boil, CUP_TIPS.empty);
  return { size, alternative, reasons, tips, warning: vaginal ? CUP_TIPS.birth : undefined };
}

/** The cup size a variant is, read from explicit size words, never a lone letter inside a word. */
export function cupSizeOfVariant(v: { size?: string | null; name?: string | null; sku?: string | null } | null | undefined): CupSize | null {
  if (!v) return null;
  const read = (raw: string): CupSize | null => {
    const s = raw.toLowerCase();
    if (!s.trim()) return null;
    if (/\bteen\b|\bxs\b|\bx-small\b|\bextra small\b|\b16\s?ml\b/.test(s)) return "xs";
    if (/\blarge\b|\b35\s?ml\b|^\s*l\s*$|\(l\)/.test(s)) return "l";
    if (/\bmedium\b|\b25\s?ml\b|^\s*m\s*$|\(m\)/.test(s)) return "m";
    return null;
  };
  const fromSize = read(String(v.size || ""));
  if (fromSize) return fromSize;
  const fromName = read(String(v.name || ""));
  if (fromName) return fromName;
  const sku = String(v.sku || "").toUpperCase();
  if (/(^|-)XS(-|$)/.test(sku)) return "xs";
  if (/(^|-)L(-|$)/.test(sku)) return "l";
  if (/(^|-)M(-|$)/.test(sku)) return "m";
  return null;
}

/* ------------------------------------------------------------------ */
/* Ovy Teen kits                                                       */
/* ------------------------------------------------------------------ */

export type TeenKit = "STARTER" | "PRO" | "FIRST";

export const TEEN_KITS: Record<TeenKit, { label: string; title: string; why: string; altWhy: string; contents: string[] }> = {
  STARTER: {
    label: "Starter Pack",
    title: "Her kit: Starter Pack",
    why: "The first-period kit: 25 essentials for unpredictable early cycles, with soft pads that won't show under a school uniform.",
    altWhy: "The Starter Pack (L and XL pads) suits a lighter, school-day routine.",
    contents: ["10 Large (L) pads, 240mm", "11 Extra Large (XL) pads, 280mm", "4 soft panty liners", "25 biodegradable disposal bags"],
  },
  PRO: {
    label: "Pro-Active Pack",
    title: "Her kit: Pro-Active Pack",
    why: "The sports and travel kit: three pad sizes for practice, matches, tournaments and heavy days, so her period never benches her.",
    altWhy: "The Pro-Active Pack adds XL+ pads, for heavy days, matches and nights.",
    contents: [
      "7 Large (L) pads, 240mm",
      "7 Extra Large (XL) pads, 280mm",
      "7 Extra Large+ (XL+) pads, 320mm",
      "4 soft panty liners",
      "25 biodegradable disposal bags",
    ],
  },
  FIRST: {
    label: "First Period Box (coming soon)",
    title: "Her kit: First Period Box",
    why: "The 50-piece milestone gift box is coming soon. Until it's here, the kit above covers her first cycle.",
    altWhy: "The 50-piece First Period Box gift set is coming soon: tap to get notified.",
    contents: [
      "14 Large (L) pads, 240mm",
      "14 Extra Large (XL) pads, 280mm",
      "14 Extra Large+ (XL+) pads, 320mm",
      "8 soft panty liners",
      "50 biodegradable disposal bags",
      "1 period panty, seat covers, wipes and a guidebook",
    ],
  },
};

export const TEEN_STEPS: QuizStepDef[] = [
  {
    id: "stage",
    question: "Where is she with periods?",
    helper: "It's fine if her period hasn't started yet: a kit in her bag means she's ready.",
    options: [
      { id: "first", label: "Not started yet, or just started", sub: "Getting ready for her first periods" },
      { id: "regular", label: "She's had periods for a while", sub: "Regular monthly care" },
    ],
  },
  {
    id: "activity",
    question: "What does her week look like?",
    options: [
      { id: "school", label: "School and study", sub: "Classes, tuition and an easy routine" },
      { id: "sports", label: "Sports, dance or travel", sub: "Practice, matches, tournaments and long days out" },
    ],
  },
  {
    id: "flow",
    question: "How heavy are her periods?",
    helper: "Early periods are often light or irregular. Not sure is a fine answer.",
    options: [
      { id: "light", label: "Light" },
      { id: "medium", label: "Medium" },
      { id: "heavy", label: "Heavy", sub: "She soaks pads quickly or leaks at night" },
      { id: "unsure", label: "Not sure yet" },
    ],
  },
  {
    id: "kit",
    question: "What would she like best?",
    options: [
      { id: "basic", label: "A ready-to-use pad kit", sub: "Everything for one cycle" },
      { id: "gift", label: "A milestone gift box", sub: "A bigger box with extras to mark the moment" },
    ],
  },
];

export type TeenQuizResult = { kit: Exclude<TeenKit, "FIRST">; alternative: Exclude<TeenKit, "FIRST">; wantsGift: boolean; reasons: string[]; tips: string[]; warning: string };

const TEEN_REASONS: Record<string, string> = {
  first: "Early periods: L and XL pads cover cycles that are light one month and heavier the next.",
  regular: "Regular periods: one kit holds a full cycle's supply.",
  sports: "Sports or travel: three pad sizes, XL+ included, keep her covered through matches and long days.",
  school: "School days: soft pads that won't show under a uniform.",
  heavy: "Heavy days: XL+ (320mm) gives her the most cover, day and night.",
  lightmedium: "Light to medium flow: L and XL are the right lengths for her.",
  unsure: "Flow not known yet: two pad sizes let her find what suits her.",
  gift: "Gift box: the First Period Box is coming soon, and this kit is ready now.",
};

export const TEEN_TIPS = {
  bag: "Pop the kit in her school bag before her period starts, so she's ready wherever she is.",
  change: "Show her how to change a pad every 4 to 6 hours, even on light days.",
  bin: "Wrap used pads in the disposal bags and bin them. Never flush.",
  irregular: "Periods are often irregular for the first year or two. That's normal.",
  doctor: "See a doctor if she soaks through a pad every 1 to 2 hours, bleeds for more than 7 days, or feels faint or dizzy.",
  gift: "Here's the kit that fits her. The 50-piece First Period Box gift set is coming soon, and this kit is ready now.",
};

export function teenQuizResult(a: QuizAnswers): TeenQuizResult {
  const sports = a.activity === "sports";
  const heavy = a.flow === "heavy";
  const kit = sports || heavy ? "PRO" : "STARTER";
  const alternative = kit === "PRO" ? "STARTER" : "PRO";
  const wantsGift = a.kit === "gift";
  const reasons = [
    TEEN_REASONS[a.stage === "regular" ? "regular" : "first"],
    TEEN_REASONS[sports ? "sports" : "school"],
    TEEN_REASONS[heavy ? "heavy" : a.flow === "unsure" || !a.flow ? "unsure" : "lightmedium"],
  ];
  if (wantsGift) reasons.push(TEEN_REASONS.gift);
  const tips = [TEEN_TIPS.bag, TEEN_TIPS.change, TEEN_TIPS.bin];
  if (a.stage !== "regular") tips.push(TEEN_TIPS.irregular);
  return { kit, alternative, wantsGift, reasons, tips, warning: TEEN_TIPS.doctor };
}

/** The teen kit a variant is, from explicit kit words in its name or SKU. */
export function teenKitOfVariant(v: { name?: string | null; sku?: string | null; size?: string | null } | null | undefined): TeenKit | null {
  if (!v) return null;
  const s = `${v.name || ""} ${v.size || ""} ${v.sku || ""}`.toLowerCase();
  if (/\bfirst\b|\bfpb\b/.test(s)) return "FIRST";
  if (/pro-?\s?active|\bpro\b/.test(s)) return "PRO";
  if (/\bstarter\b|\bstart\b/.test(s)) return "STARTER";
  return null;
}

/* ------------------------------------------------------------------ */
/* Liners                                                              */
/* ------------------------------------------------------------------ */

export type LinerPack = 40 | 60 | 80;

export const LINER_PACKS: Record<LinerPack, { label: string; title: string; why: string }> = {
  40: { label: "Pack of 40", title: "Your fit: Ovy liners, pack of 40", why: "The smallest pack, to try Ovy liners or for a few days a month." },
  60: { label: "Pack of 60", title: "Your fit: Ovy liners, pack of 60", why: "Our pick for most days: thin, breathable and fragrance free." },
  80: { label: "Pack of 80", title: "Your fit: Ovy liners, pack of 80", why: "Best value per liner, for wearing one every day." },
};

export const LINER_TIP = "A liner can't hold period flow, even on a light day. Use a pad or a cup for your period.";

/** The liner pack a variant is (40, 60 or 80), from its size, name or SKU. */
export function linerPackOfVariant(v: { size?: string | null; name?: string | null; sku?: string | null } | null | undefined): LinerPack | null {
  if (!v) return null;
  for (const raw of [v.size, v.name, v.sku]) {
    const m = String(raw || "").match(/\b(40|60|80)\b/);
    if (m) return Number(m[1]) as LinerPack;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Ovy "Find my fit" (/ovy)                                            */
/* ------------------------------------------------------------------ */

export const OVY_FIT_STEPS: QuizStepDef[] = [
  {
    id: "for",
    question: "What is it for?",
    helper: "Answer for yourself, or for someone you're buying for.",
    options: [
      { id: "my-period", label: "My period", sub: "Pads or a cup" },
      { id: "days-between", label: "The days in between", sub: "Discharge, spotting, light leaks" },
      { id: "first-period", label: "A first period", sub: "Buying for a teen" },
    ],
  },
  {
    id: "type",
    question: "What do you like to use?",
    options: [
      { id: "pads", label: "Pads", sub: "Soft, rash-free and easy" },
      { id: "cup", label: "A menstrual cup", sub: "Reusable, up to 12 hours, fine for sport and swimming" },
    ],
  },
  {
    id: "flow",
    question: "What is your flow like?",
    options: [
      { id: "light", label: "Light", sub: "Lighter days and spotting" },
      { id: "regular", label: "Regular", sub: "Work, school and the commute" },
      { id: "heavy", label: "Heavy, or nights", sub: "Heavy days and sleep" },
      { id: "varies", label: "It changes a lot", sub: "Heavy first days, light at the end" },
    ],
  },
  {
    id: "cupfor",
    question: "Which describes you?",
    helper: "The full cup size quiz also checks your flow and cervix.",
    options: [
      { id: "under18", label: "Under 18" },
      { id: "nobirth", label: "18 or older, no vaginal birth", sub: "C-section included" },
      { id: "vaginal", label: "I've had a vaginal birth" },
    ],
  },
  {
    id: "liners",
    question: "How often will you wear a liner?",
    options: [
      { id: "sometimes", label: "Now and then", sub: "Trying liners, or a few days a month" },
      { id: "most", label: "Most days", sub: "Discharge on most days" },
      { id: "daily", label: "Every day", sub: "All month long" },
    ],
  },
  {
    id: "teen",
    question: "What does her week look like?",
    options: [
      { id: "school", label: "School and study", sub: "Classes, tuition and an easy routine" },
      { id: "sports", label: "Sports, dance or travel", sub: "Practice, matches and long days out" },
    ],
  },
];

export function ovyFitSkip(stepId: string, a: QuizAnswers) {
  const forWhat = a.for;
  if (stepId === "type") return forWhat !== "my-period";
  if (stepId === "flow") return forWhat !== "my-period" || a.type !== "pads";
  if (stepId === "cupfor") return forWhat !== "my-period" || a.type !== "cup";
  if (stepId === "liners") return forWhat !== "days-between";
  if (stepId === "teen") return forWhat !== "first-period";
  return false;
}

export type OvyFitResult =
  | { kind: "pads"; pick: PadPickKey; alternative: PadPickKey }
  | { kind: "cup"; size: CupSize; alternative: CupSize }
  | { kind: "liners"; pack: LinerPack; alternative: LinerPack }
  | { kind: "teen"; kit: "STARTER" | "PRO"; alternative: "STARTER" | "PRO" };

export function ovyFitResult(a: QuizAnswers): OvyFitResult {
  if (a.for === "days-between") {
    const pack: LinerPack = a.liners === "daily" ? 80 : a.liners === "most" ? 60 : 40;
    return { kind: "liners", pack, alternative: pack === 40 ? 60 : pack === 60 ? 80 : 60 };
  }
  if (a.for === "first-period") {
    return a.teen === "sports" ? { kind: "teen", kit: "PRO", alternative: "STARTER" } : { kind: "teen", kit: "STARTER", alternative: "PRO" };
  }
  if (a.type === "cup") {
    if (a.cupfor === "under18") return { kind: "cup", size: "xs", alternative: "m" };
    if (a.cupfor === "vaginal") return { kind: "cup", size: "l", alternative: "m" };
    return { kind: "cup", size: "m", alternative: "xs" };
  }
  if (a.flow === "light") return { kind: "pads", pick: "L", alternative: "XL" };
  if (a.flow === "heavy") return { kind: "pads", pick: "XL+", alternative: "mix:more_nights" };
  if (a.flow === "varies") return { kind: "pads", pick: "mix:recommended", alternative: "XL+" };
  return { kind: "pads", pick: "XL", alternative: "mix:recommended" };
}

/* ------------------------------------------------------------------ */
/* "Find what I need" (/quiz and /suggested-products)                  */
/* ------------------------------------------------------------------ */

export const NEED_STEPS: QuizStepDef[] = [
  {
    id: "flow",
    question: "What is your flow usually like?",
    helper: "Think about a usual period, not your heaviest hour.",
    options: [
      { id: "light", label: "Light", sub: "Spotting and lighter days" },
      { id: "medium", label: "Medium", sub: "A normal, steady flow" },
      { id: "heavy", label: "Heavy", sub: "You soak pads quickly or leak at night" },
      { id: "unsure", label: "It changes, or I'm not sure", sub: "Heavy some days, light on others" },
    ],
  },
  {
    id: "cramps",
    question: "Do you get cramps or discomfort?",
    helper: "This adds comfort tips, and tells you when it's worth seeing a doctor.",
    options: [
      { id: "none", label: "No, not really" },
      { id: "mild", label: "Mild", sub: "Uncomfortable, but I get on with my day" },
      { id: "severe", label: "Severe", sub: "Cramps keep me from school, work or sleep" },
      { id: "varies", label: "It varies", sub: "Some periods are worse than others" },
    ],
  },
  {
    id: "prefer",
    question: "What would you like to use?",
    helper: "Pick what feels right. We'll match it to your flow.",
    options: [
      { id: "pads", label: "Pads", sub: "Cotton-soft and rash-free" },
      { id: "cup", label: "A menstrual cup", sub: "Medical-grade silicone, reusable for years" },
      { id: "panty", label: "Period panties", sub: "Single-use, worn like underwear, for heavy days and nights" },
      { id: "unsure", label: "Not sure", sub: "Suggest for me" },
    ],
  },
  {
    id: "skin",
    question: "Is your skin sensitive to period products?",
    helper: "Tell us if a pad has given you a rash or itching before.",
    options: [
      { id: "none", label: "No" },
      { id: "sensitive", label: "A little", sub: "I get rashes or chafing sometimes" },
      { id: "allergic", label: "Yes, I've reacted before", sub: "A rash, itching or swelling from a product" },
      { id: "unsure", label: "Not sure" },
    ],
  },
];

export type NeedProduct = "ovy-pads" | "ovy-cup" | "ovy-panty" | "ovy-liners" | "period-tracker";
export type NeedPick = { product: NeedProduct; why: string; size?: string; padPick?: PadPickKey; linerPack?: LinerPack };
export type NeedResult = { title: string; intro: string; picks: NeedPick[]; reasons: string[]; tips: string[]; warnings: string[]; cupQuiz: boolean };

export const NEED_TEXT = {
  cupTitle: "Your fit: the Ovy Menstrual Cup",
  pantyTitle: "Your fit: Ovy Period Panties",
  cupWhy: "Medical-grade silicone, up to 12 hours between changes, and reusable for years. The cup size quiz picks Teen, Medium or Large for you.",
  cupSize: "Teen, Medium or Large",
  cupAltWhy: "If pads have irritated your skin, a medical-grade silicone cup is another option.",
  pantyWhy: "Leak-proof, single-use period panties that hold as much as 5 regular pads, for up to 10 to 12 hours. Made for heavy days and nights.",
  pantySize: "M-XL or XXL-XXXL",
  pantyNights: "Leak-proof period panties for your heaviest nights.",
  padsLighter: "Pads for the lighter days, when a period panty is more than you need.",
  linersLight: "Thin liners for the lightest days and discharge between periods.",
  linersCup: "A liner is handy backup while you get used to the cup.",
  tracker: "Log your cramps and symptoms each cycle in the free Period Tracker, so you can show a doctor the pattern.",
  introSensitive: "Ovy pads and liners are dermatologically tested, rash-free and non-irritant, which suits sensitive skin. Here's what fits your answers.",
  intro: "Here's what fits your answers.",
};

const NEED_REASONS: Record<string, string> = {
  "flow:light": "Light flow: a slim pad and a liner cover you without bulk.",
  "flow:medium": "Medium flow: an everyday length that lasts a full day out.",
  "flow:heavy": "Heavy flow: you need the most length, capacity and night cover.",
  "flow:unsure": "Changing flow: a mix of sizes lets you match each day.",
  "prefer:pads": "You prefer pads, so we've matched the length to your flow.",
  "prefer:cup": "You'd like a cup: reusable, up to 12 hours, and fine for sport and swimming.",
  "prefer:panty": "You'd like period panties: pull them on like underwear, no pad to shift.",
  "prefer:unsure": "Not sure what to use: pads are the easiest place to start.",
  "cramps:severe": "Severe cramps: tracking them helps a doctor see the pattern.",
  "cramps:mild": "Mild cramps: a few comfort habits can help.",
  "cramps:varies": "Cramps that vary: a few comfort habits can help on harder months.",
  "cramps:none": "No cramps: nothing extra needed there.",
  "skin:sensitive": "Sensitive skin: Ovy pads are dermatologically tested and rash-free.",
  "skin:allergic": "You've reacted to a product before: see the note below on what to watch for.",
  "skin:none": "No skin worries: any Ovy product suits you.",
  "skin:unsure": "Not sure about your skin: Ovy pads are dermatologically tested and rash-free.",
};

export const NEED_TIPS = {
  crampsMild: "A warm water bottle on your lower tummy, gentle stretching and rest can ease mild cramps.",
  crampsSevere:
    "If cramps keep you from school, work or sleep, or get worse over time, please see a doctor. Painful periods are common, but they are not something you just have to live with.",
  skinSensitive: "Change pads every 4 to 6 hours and wear breathable cotton underwear to keep skin comfortable.",
  skinAllergic: "If a period product has given you a rash, itching or swelling before, stop using it, and see a doctor if it doesn't settle.",
  cupSilicone: "Our cup is medical-grade silicone. If you have ever reacted to silicone, ask a doctor before you try it.",
  heavy: "If you soak through a pad in under 2 hours, or your period lasts more than 7 days, please see a doctor.",
  panty: "Pick M-XL for a waist of about 28 to 44 inches, or XXL-XXXL for about 44 to 56 inches.",
  bin: "Wrap used pads and panties and bin them. Never flush.",
  cupBoil: "Sterilise the cup by boiling for 5 to 7 minutes before your first use and after each period.",
};

const padForFlow = (flow: string | undefined): PadPickKey =>
  flow === "light" ? "L" : flow === "medium" ? "XL" : flow === "heavy" ? "XL+" : "mix:recommended";

export function needQuizResult(a: QuizAnswers): NeedResult {
  const flow = a.flow || "unsure";
  const cramps = a.cramps || "none";
  const prefer = a.prefer || "unsure";
  const skin = a.skin || "none";
  const pad = padForFlow(flow);
  const padPick = (why?: string): NeedPick => ({ product: "ovy-pads", padPick: pad, size: PAD_PICKS[pad].label, why: why || PAD_PICKS[pad].why });
  const picks: NeedPick[] = [];
  let title: string;

  if (prefer === "cup") {
    title = NEED_TEXT.cupTitle;
    picks.push({ product: "ovy-cup", size: NEED_TEXT.cupSize, why: NEED_TEXT.cupWhy });
    picks.push({ product: "ovy-liners", linerPack: 40, size: LINER_PACKS[40].label, why: NEED_TEXT.linersCup });
  } else if (prefer === "panty") {
    title = NEED_TEXT.pantyTitle;
    picks.push({ product: "ovy-panty", size: NEED_TEXT.pantySize, why: NEED_TEXT.pantyWhy });
    picks.push(padPick(flow === "heavy" ? undefined : NEED_TEXT.padsLighter));
  } else {
    title = PAD_PICKS[pad].title;
    picks.push(padPick());
    if (flow === "light") picks.push({ product: "ovy-liners", linerPack: 60, size: LINER_PACKS[60].label, why: NEED_TEXT.linersLight });
    if (flow === "heavy") picks.push({ product: "ovy-panty", size: NEED_TEXT.pantySize, why: NEED_TEXT.pantyNights });
    if (skin === "allergic") picks.push({ product: "ovy-cup", size: NEED_TEXT.cupSize, why: NEED_TEXT.cupAltWhy });
  }
  if (cramps === "severe") picks.push({ product: "period-tracker", why: NEED_TEXT.tracker });

  const reasons = [NEED_REASONS[`flow:${flow}`], NEED_REASONS[`prefer:${prefer}`], NEED_REASONS[`cramps:${cramps}`], NEED_REASONS[`skin:${skin}`]].filter(Boolean);

  const tips: string[] = [];
  if (cramps === "mild" || cramps === "varies") tips.push(NEED_TIPS.crampsMild);
  if (skin === "sensitive") tips.push(NEED_TIPS.skinSensitive);
  if (prefer === "panty") tips.push(NEED_TIPS.panty);
  if (prefer === "cup") tips.push(NEED_TIPS.cupBoil);
  tips.push(NEED_TIPS.bin);

  const warnings: string[] = [];
  if (cramps === "severe") warnings.push(NEED_TIPS.crampsSevere);
  if (skin === "allergic") warnings.push(prefer === "cup" ? NEED_TIPS.cupSilicone : NEED_TIPS.skinAllergic);
  if (flow === "heavy") warnings.push(NEED_TIPS.heavy);

  return {
    title,
    intro: skin === "sensitive" || skin === "allergic" ? NEED_TEXT.introSensitive : NEED_TEXT.intro,
    picks: picks.slice(0, 4),
    reasons,
    tips,
    warnings,
    cupQuiz: picks.some((p) => p.product === "ovy-cup"),
  };
}

/** Saved answers from /quiz, read by /suggested-products. */
export const NEED_STORAGE_KEY = "potentNeedQuizAnswers";

/** Short "why this pick" lines for the /ovy Find my fit result. */
export function ovyFitReasons(a: QuizAnswers): string[] {
  if (a.for === "days-between") {
    const line =
      a.liners === "daily"
        ? "Every day: the biggest pack is the best value per liner."
        : a.liners === "most"
          ? "Most days: our everyday pack, the one most people pick."
          : "Now and then: the smallest pack is plenty to start with.";
    return ["Between periods you need a thin liner, not a pad.", line];
  }
  if (a.for === "first-period") return [TEEN_REASONS[a.teen === "sports" ? "sports" : "school"], TEEN_REASONS.first];
  if (a.type === "cup") {
    const key = a.cupfor === "under18" ? "under18" : a.cupfor === "vaginal" ? "vaginal" : "none";
    return [CUP_REASONS[key]];
  }
  const flowKey = a.flow === "light" ? "light" : a.flow === "heavy" ? "heavy" : a.flow === "varies" ? "variable" : "medium";
  return [PAD_REASONS.flow[flowKey]];
}
