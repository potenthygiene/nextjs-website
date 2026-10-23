import type { Finder, FinderPick, FinderResult, FinderStep } from "./finders";
import {
  CUP_ALT_WHY,
  CUP_SIZES,
  CUP_STEPS,
  LINER_PACKS,
  LINER_TIP,
  NEED_STEPS,
  OVY_FIT_STEPS,
  PAD_PICKS,
  PAD_STEPS,
  PAD_TIPS,
  TEEN_KITS,
  TEEN_STEPS,
  CUP_TIPS,
  TEEN_TIPS,
  cupQuizResult,
  cupSkip,
  isMixPick,
  needQuizResult,
  ovyFitResult,
  ovyFitSkip,
  padQuizResult,
  teenQuizResult,
  type PadPickKey,
  type QuizAnswers,
  type QuizStepDef,
} from "../quizRules";

// The quizzes that live on the site, rebuilt for the chat. The questions and
// the rules come from const/quizRules.ts, the same module the pages use, so the
// chat gives the same pick as the page for the same taps. Each quiz links back
// to its page. No prices: the chat shows live prices itself.

export type Quiz = Finder & { short: string; page?: { label: string; href: string } };

const one = (a: Record<string, string[]>, step: string) => (a[step] || [])[0] || "";

/** Chat answers ({ step: [id] }) to the single-choice shape the shared rules use. */
const flat = (a: Record<string, string[]>): QuizAnswers =>
  Object.fromEntries(Object.entries(a).map(([k, v]) => [k, (v || [])[0]]));

/** A site question as a chat step. Options read "Label: helper" when there is one. */
const chatSteps = (steps: QuizStepDef[], withHelper: string[] = []): FinderStep[] =>
  steps.map((s) => ({
    id: s.id,
    text: withHelper.includes(s.id) && s.helper ? `${s.question} ${s.helper}` : s.question,
    options: s.options.map((o) => ({ id: o.id, label: o.sub ? `${o.label}: ${o.sub}` : o.label })),
  }));

const PADS_PAGE = { label: "Open the pads page", href: "/product-detail/ovy-pads" };
const MIX_LINK = { label: "Build it in Mix Your Box", href: "/product-detail/ovy-pads#mix" };
const CUP_FINDER = { label: "Open the cup size finder", href: "/product-detail/ovy-cup#size-finder" };
const padPick = (key: PadPickKey, alt = false): FinderPick => ({
  product: "ovy-pads",
  size: PAD_PICKS[key].label,
  why: alt ? PAD_PICKS[key].altWhy : PAD_PICKS[key].why,
});

// ---- Yatra Kit presets (loowayYatraKit.TIERS in const/productsContent.ts) ----
const YATRA_ITEMS: Record<string, string> = {
  "seat:p2": "Looway Toilet Seat Covers, 2-pack (50 covers)",
  "pp:10": "Looway Pee & Puke Bags, pack of 10",
  funnel: "Looway Pee Funnel",
  "pads:l": "Ovy Pads L (240mm)",
  "liner:40": "Ovy Daily Liners, pack of 40",
};
const YATRA_TIERS: { id: string; label: string; name: string; base: Record<string, number> }[] = [
  { id: "complete", label: "Complete: every situation", name: "Complete", base: { "seat:p2": 1, "pp:10": 1, funnel: 1 } },
  { id: "weekender", label: "Weekender: solo, short trip", name: "Weekender", base: { "seat:p2": 1, "pp:10": 1 } },
  { id: "family", label: "Family: group, long trip", name: "Family", base: { "seat:p2": 2, "pp:10": 2, funnel: 1 } },
  { id: "girls", label: "Girls' Trip: girls only", name: "Girls' Trip", base: { "seat:p2": 2, funnel: 1, "pads:l": 1, "liner:40": 1 } },
  { id: "boys", label: "Boys' Trip: mates' getaway", name: "Boys' Trip", base: { "seat:p2": 1, "pp:10": 2 } },
  { id: "teerth", label: "Teerth Yatra: pilgrimages", name: "Teerth Yatra", base: { "seat:p2": 2, funnel: 1, "pp:10": 1 } },
  { id: "preg", label: "Pregnancy Travel: mums-to-be", name: "Pregnancy Travel", base: { "seat:p2": 1, funnel: 1, "pp:10": 1, "liner:40": 1 } },
  { id: "toddler", label: "Toddler Travel: with little ones", name: "Toddler Travel", base: { "seat:p2": 2, "pp:10": 1 } },
  { id: "working", label: "Working Woman: office and commutes", name: "Working Woman", base: { "seat:p2": 1, "pads:l": 1, "liner:40": 1 } },
  { id: "sports", label: "Sports & Adventure: treks and outdoors", name: "Sports & Adventure", base: { "seat:p2": 1, funnel: 1, "pp:10": 2 } },
  { id: "carekit", label: "Care & Recovery: hospital and caregiving", name: "Care & Recovery", base: { "seat:p2": 2, "pp:10": 2 } },
];

export const QUIZZES: Record<string, Quiz> = {
  // /quiz, linked as "Find what I need" from the hero, sub-nav, footer and contact page.
  // The results page (/suggested-products) works the picks out with needQuizResult.
  "find-what-i-need": {
    id: "find-what-i-need",
    title: "Find what I need",
    short: "Find what I need quiz",
    page: { label: "Open the full quiz", href: "/quiz" },
    steps: chatSteps(NEED_STEPS),
    result: (a) => {
      const r = needQuizResult(flat(a));
      const links = [{ label: "Open the full quiz", href: "/quiz" }];
      if (r.cupQuiz) links.push({ label: "Take the cup size quiz", href: "/product-detail/ovy-cup#size-finder" });
      return {
        title: r.title,
        intro: r.intro,
        picks: r.picks.map((p) => ({ product: p.product, why: p.why, size: p.size })),
        checklist: [...r.tips, ...r.warnings.slice(1)],
        tip: r.warnings[0],
        links,
      };
    },
  },

  // /ovy, the "Find my fit" band (#find-my-fit, "A few taps. The right pack.").
  "ovy-find-my-fit": {
    id: "ovy-find-my-fit",
    title: "Find my fit",
    short: "Ovy find my fit",
    page: { label: "See it on the Ovy page", href: "/ovy#find-my-fit" },
    steps: chatSteps(OVY_FIT_STEPS),
    skip: (step, a) => ovyFitSkip(step, flat(a)),
    result: (a) => {
      const r = ovyFitResult(flat(a));
      let title: string;
      let picks: FinderPick[];
      let checklist: string[];
      let links: { label: string; href: string }[];
      if (r.kind === "pads") {
        title = PAD_PICKS[r.pick].title;
        picks = [padPick(r.pick), padPick(r.alternative, true)];
        checklist = [isMixPick(r.pick) ? PAD_TIPS.mix : PAD_TIPS[r.pick], PAD_TIPS.bin];
        links = [isMixPick(r.pick) ? MIX_LINK : PADS_PAGE];
      } else if (r.kind === "cup") {
        title = CUP_SIZES[r.size].title;
        picks = [
          { product: "ovy-cup", size: CUP_SIZES[r.size].label, why: CUP_SIZES[r.size].why },
          { product: "ovy-cup", size: CUP_SIZES[r.alternative].label, why: CUP_ALT_WHY[`${r.size}>${r.alternative}`] },
        ];
        checklist = [CUP_TIPS.boil, CUP_TIPS.empty];
        links = [{ label: "Take the cup size quiz", href: "/product-detail/ovy-cup#size-finder" }];
      } else if (r.kind === "liners") {
        title = LINER_PACKS[r.pack].title;
        picks = [
          { product: "ovy-liners", size: LINER_PACKS[r.pack].label, why: LINER_PACKS[r.pack].why },
          { product: "ovy-liners", size: LINER_PACKS[r.alternative].label, why: LINER_PACKS[r.alternative].why },
        ];
        checklist = [LINER_TIP];
        links = [{ label: "See Ovy liners", href: "/product-detail/ovy-liners" }];
      } else {
        title = TEEN_KITS[r.kit].title;
        picks = [
          { product: "ovy-teen", size: TEEN_KITS[r.kit].label, why: TEEN_KITS[r.kit].why },
          { product: "ovy-teen", size: TEEN_KITS[r.alternative].label, why: TEEN_KITS[r.alternative].altWhy },
        ];
        checklist = [TEEN_TIPS.bag, TEEN_TIPS.change];
        links = [{ label: "See Ovy Teen kits", href: "/product-detail/ovy-teen" }];
      }
      return { title, intro: "Here's the pack that fits.", picks, checklist, tip: "Orders are dispatched within 24 to 48 hours.", links };
    },
  },

  // Pad product page (Ovy pads), "Find My Fit (Size Quiz)" next to the size picker,
  // the size quiz banner.
  "pad-size": {
    id: "pad-size",
    title: "Pad size quiz",
    short: "Pad size quiz",
    page: PADS_PAGE,
    steps: chatSteps(PAD_STEPS),
    result: (a) => {
      const r = padQuizResult(flat(a));
      return {
        title: PAD_PICKS[r.primary].title,
        intro: "Here's the pad size that fits your answers.",
        picks: [padPick(r.primary), padPick(r.alternative, true)],
        checklist: r.tips,
        tip: r.warning,
        links: [isMixPick(r.primary) ? MIX_LINK : PADS_PAGE],
      };
    },
  },

  // Menstrual cup page (/product-detail/ovy-cup and /menstrual-cup), "Take the 30-second
  // quiz" in the #size-finder section and "30-Sec Size Quiz" next to the size picker.
  // Under-18s get Teen (XS) straight away, so the other questions are skipped for them.
  "cup-size": {
    id: "cup-size",
    title: "Cup size quiz",
    short: "Cup size quiz",
    page: CUP_FINDER,
    steps: chatSteps(CUP_STEPS, ["cervix"]),
    skip: (step, a) => cupSkip(step, flat(a)),
    result: (a) => {
      const r = cupQuizResult(flat(a));
      return {
        title: CUP_SIZES[r.size].title,
        intro: "Here's the size that fits your answers.",
        picks: [
          { product: "ovy-cup", size: CUP_SIZES[r.size].label, why: CUP_SIZES[r.size].why },
          { product: "ovy-cup", size: CUP_SIZES[r.alternative].label, why: CUP_ALT_WHY[`${r.size}>${r.alternative}`] },
        ],
        checklist: r.tips,
        tip: r.warning,
        links: [CUP_FINDER],
      };
    },
  },

  // Ovy Teen page (/product-detail/ovy-teen), "Not sure which kit is right?" banner and
  // "Find My Fit Quiz" in the Learn menu. The First Period Box is coming soon, so it is
  // never the main pick.
  "teen-kit": {
    id: "teen-kit",
    title: "Teen kit quiz",
    short: "Teen kit quiz",
    page: { label: "See Ovy Teen kits", href: "/product-detail/ovy-teen" },
    steps: chatSteps(TEEN_STEPS),
    result: (a) => {
      const r = teenQuizResult(flat(a));
      return {
        title: TEEN_KITS[r.kit].title,
        intro: r.wantsGift ? TEEN_TIPS.gift : "Here's the kit that fits her.",
        picks: [
          { product: "ovy-teen", size: TEEN_KITS[r.kit].label, why: TEEN_KITS[r.kit].why },
          { product: "ovy-teen", size: TEEN_KITS[r.alternative].label, why: TEEN_KITS[r.alternative].altWhy },
        ],
        checklist: TEEN_KITS[r.kit].contents,
        tip: r.warning,
        links: [{ label: "See Ovy Teen kits", href: `/product-detail/ovy-teen?kit=${r.kit.toLowerCase()}` }],
      };
    },
  },

  // /looway-yatra-kit, "Choose your kit" (#choose-kit). The site's preset kits are a
  // one-tap choice; the result lists what the preset puts in the kit.
  "yatra-kit": {
    id: "yatra-kit",
    title: "Yatra Kit picker",
    short: "Yatra Kit picker",
    page: { label: "Build it on the Yatra Kit page", href: "/looway-yatra-kit#choose-kit" },
    steps: [
      {
        id: "kit",
        text: "Which kit fits your trip?",
        options: YATRA_TIERS.map((t) => ({ id: t.id, label: t.label })),
      },
    ],
    result: (a): FinderResult => {
      const tier = YATRA_TIERS.find((t) => t.id === one(a, "kit")) || YATRA_TIERS[0];
      const checklist = Object.entries(tier.base).map(([key, qty]) => (qty > 1 ? `${qty} x ${YATRA_ITEMS[key]}` : YATRA_ITEMS[key]));
      checklist.push("Free: 10 individually wrapped intimate wipes");
      return {
        title: `${tier.name} kit`,
        intro: "Here's what this kit starts with. You can add or remove items on the Yatra Kit page.",
        picks: [{ product: "looway-yatra-kit", size: tier.name, why: "One kit for every toilet you'll face on the trip, with free intimate wipes in every kit." }],
        checklist,
        tip: "Use, fold and bin every seat cover. Never flush.",
        links: [{ label: "Open this kit", href: `/looway-yatra-kit?kit=${tier.id}#choose-kit` }],
      };
    },
  },
};
