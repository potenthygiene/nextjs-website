import type { Finder, FinderPick, FinderResult } from "./finders";

// The quizzes that live on the site, rebuilt for the chat with the same
// questions, options and result logic as the page they sit on. Each one
// links back to its page. No prices: the chat shows live prices itself.

export type Quiz = Finder & { short: string; page?: { label: string; href: string } };

const one = (a: Record<string, string[]>, step: string) => (a[step] || [])[0] || "";

// ---- Ovy Teen kit contents (KITS_DATA on the Ovy Teen page) ----
const TEEN_KITS: Record<string, { size: string; why: string; checklist: string[] }> = {
  STARTER: {
    size: "Starter Pack",
    why: "The first-period kit: 25 essentials for unpredictable early cycles, with soft pads that won't show under a school uniform.",
    checklist: ["10 Large (L) pads, 240mm", "11 Extra Large (XL) pads, 280mm", "4 soft panty liners", "25 biodegradable disposal bags"],
  },
  PRO: {
    size: "Pro-Active Pack",
    why: "The sports and travel kit: three pad sizes for practice, matches, tournaments and heavy days, so her period never benches her.",
    checklist: [
      "7 Large (L) pads, 240mm",
      "7 Extra Large (XL) pads, 280mm",
      "7 Extra Large+ (XL+) pads, 320mm",
      "4 soft panty liners",
      "25 biodegradable disposal bags",
    ],
  },
  FIRST: {
    size: "First Period Box (coming soon)",
    why: "The 50-piece milestone gift box is coming soon. Until it's here, the Starter Pack covers her first cycle.",
    checklist: [
      "14 Large (L) pads, 240mm",
      "14 Extra Large (XL) pads, 280mm",
      "14 Extra Large+ (XL+) pads, 320mm",
      "8 soft panty liners",
      "50 biodegradable disposal bags",
      "1 period panty, seat covers, wipes and a guidebook",
    ],
  },
};

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

const CUP_SIZES: Record<string, { size: string; why: string }> = {
  xs: { size: "Teen (XS), 16 ml", why: "Based on your answers, the Teen (XS) cup (16 ml) gives the best seal, comfort and leak protection. It's made for teens and first-timers under 18." },
  m: { size: "Medium, 25 ml", why: "Based on your answers, the Medium cup (25 ml) gives the best seal, comfort and leak protection. It's the everyday all-rounder for anyone without a vaginal birth, C-section mums included." },
  l: { size: "Large, 35 ml", why: "Based on your answers, the Large cup (35 ml) gives the best seal, comfort and leak protection. It's made for after a vaginal birth or a very heavy flow." },
};

export const QUIZZES: Record<string, Quiz> = {
  // /quiz, linked as "Find what I need" from the hero, sub-nav, footer and contact page.
  // The site matches the answer slugs against product variant size and flow tags in the
  // database; only the flow answer can match a tag, so the chat recommends by flow.
  "find-what-i-need": {
    id: "find-what-i-need",
    title: "Find what I need",
    short: "Find what I need quiz",
    page: { label: "Open the full quiz", href: "/quiz" },
    steps: [
      {
        id: "flow",
        text: "What describes your flow?",
        options: [
          { id: "light", label: "Light flow" },
          { id: "medium", label: "Medium flow" },
          { id: "heavy", label: "Heavy flow" },
          { id: "unsure", label: "Unsure" },
        ],
      },
      {
        id: "cramps",
        text: "Do you experience cramps or discomfort?",
        options: [
          { id: "none", label: "No discomfort" },
          { id: "mild", label: "Mild discomfort" },
          { id: "severe", label: "Severe cramps" },
          { id: "varies", label: "Varies" },
        ],
      },
      {
        id: "material",
        text: "What is your preferred material for period products?",
        options: [
          { id: "cotton", label: "Cotton" },
          { id: "synthetic", label: "Synthetic blend" },
          { id: "silicone", label: "Medical-grade silicone" },
          { id: "unsure", label: "Unsure" },
        ],
      },
      {
        id: "allergy",
        text: "Do you have any allergies or sensitivities to certain materials?",
        options: [
          { id: "none", label: "No allergies" },
          { id: "sensitive", label: "Sensitive skin" },
          { id: "allergic", label: "Allergic reactions" },
          { id: "unsure", label: "Not sure" },
        ],
      },
    ],
    result: (a) => {
      const flow = one(a, "flow") || "unsure";
      const allergy = one(a, "allergy");
      const picks: FinderPick[] = [];
      if (one(a, "material") === "silicone") {
        picks.push({ product: "ovy-cup", why: "You prefer medical-grade silicone, so the reusable Ovy cup fits. Take the cup size quiz to pick Teen, Medium or Large." });
      }
      if (flow === "light") {
        picks.push({ product: "ovy-pads", size: "L (240mm)", why: "Made for light flow, spotting and the last days of a period." });
        picks.push({ product: "ovy-liners", why: "Thin liners for the lightest days and discharge between periods." });
      } else if (flow === "medium") {
        picks.push({ product: "ovy-pads", size: "XL (280mm)", why: "Your everyday pad for medium flow and full school or office days." });
      } else if (flow === "heavy") {
        picks.push({ product: "ovy-pads", size: "XL+ (320mm)", why: "Our longest pad, with a wider back for heavy days and nights." });
        picks.push({ product: "ovy-panty", why: "Leak-proof period panties for your heaviest nights." });
      } else {
        picks.push({ product: "ovy-pads", size: "Mix Your Box (L, XL and XL+)", why: "Not sure of your flow? Mix Your Box gives you L, XL and XL+ in one box, so you can find out." });
      }
      const sensitiveSkin = allergy === "sensitive" || allergy === "allergic";
      const cramps = one(a, "cramps");
      const tip =
        allergy === "allergic"
          ? "If a period product has given you a rash, itching or swelling before, stop using it, and see a doctor if it doesn't settle."
          : cramps === "severe"
            ? "If cramps keep you from school, work or sleep, or get worse over time, please see a doctor. Painful periods are common, but they are not something you just have to live with."
            : undefined;
      return {
        title: "Your period care picks",
        intro: sensitiveSkin
          ? "Ovy pads and liners are dermatologically tested, rash-free and non-irritant, which suits sensitive skin. Here's what fits your answers."
          : "Here's what fits your answers.",
        picks: picks.slice(0, 3),
        tip,
        links:
          one(a, "material") === "silicone"
            ? [
                { label: "Open the full quiz", href: "/quiz" },
                { label: "Take the cup size quiz", href: "/product-detail/ovy-cup#size-finder" },
              ]
            : [{ label: "Open the full quiz", href: "/quiz" }],
      };
    },
  },

  // /ovy, the "Find my fit" band ("Three taps. The right pack."). The band has no id.
  "ovy-find-my-fit": {
    id: "ovy-find-my-fit",
    title: "Find my fit",
    short: "Ovy find my fit",
    page: { label: "See it on the Ovy page", href: "/ovy" },
    steps: [
      {
        id: "for",
        text: "What is it for?",
        options: [
          { id: "my-period", label: "My period: pads or a cup" },
          { id: "days-between", label: "The days in between: discharge, spotting, light leaks" },
          { id: "first-period", label: "A first period: buying for a teen" },
        ],
      },
      {
        id: "flow",
        text: "What flow do you usually have?",
        options: [
          { id: "regular-flow", label: "Light to regular flow: everyday pads for work, school and commute" },
          { id: "heavy-flow", label: "Heavy flow and nights: extra coverage for heavy days and sleep" },
          { id: "reusable-cup", label: "Prefer a reusable cup: 12-hour freedom for sport, swim and long days" },
        ],
      },
    ],
    skip: (step, a) => step === "flow" && one(a, "for") !== "my-period",
    result: (a) => {
      const forWhat = one(a, "for");
      const flow = one(a, "flow");
      let pick: FinderPick;
      let link = { label: "See Ovy pads", href: "/product-detail/ovy-pads" };
      if (forWhat === "days-between") {
        pick = { product: "ovy-liners", why: "Ultra-thin daily liners to stay fresh between periods." };
        link = { label: "See Ovy liners", href: "/product-detail/ovy-liners" };
      } else if (forWhat === "first-period") {
        pick = { product: "ovy-teen", size: "Starter Pack", why: "Two pad sizes, 4 liners and disposal bags for her first period." };
        link = { label: "See Ovy Teen kits", href: "/product-detail/ovy-teen" };
      } else if (flow === "heavy-flow") {
        pick = { product: "ovy-pads", size: "XL+ (320mm)", why: "320mm XL+ with extra-wide back coverage for heavy days and nights." };
      } else if (flow === "reusable-cup") {
        pick = { product: "ovy-cup", why: "A medical-grade silicone cup that lasts for years. Take the cup size quiz to pick your size." };
        link = { label: "Take the cup size quiz", href: "/product-detail/ovy-cup#size-finder" };
      } else {
        pick = { product: "ovy-pads", size: "L or XL", why: "Rash-free pads sized to your actual flow: L for lighter days, XL for regular days." };
      }
      return {
        title: "Your perfect match",
        intro: "Here's the pack that fits.",
        picks: [pick],
        tip: "Orders are dispatched within 24 to 48 hours.",
        links: [link],
      };
    },
  },

  // Pad product page (Ovy pads), "Find My Fit (Size Quiz)" next to the size picker,
  // the size quiz banner and the "Not sure what you need?" card.
  "pad-size": {
    id: "pad-size",
    title: "Pad size quiz",
    short: "Pad size quiz",
    page: { label: "Open the pads page", href: "/product-detail/ovy-pads" },
    steps: [
      {
        id: "flow",
        text: "How heavy is your period flow usually?",
        options: [
          { id: "light", label: "Light flow: lighter days, spotting, last days of a period" },
          { id: "medium", label: "Medium or regular flow: normal steady flow on most days" },
          { id: "heavy", label: "Heavy flow: soaking through pads quickly on the first days" },
          { id: "variable", label: "Changes a lot: heavy first 2 days, then light or medium" },
        ],
      },
      {
        id: "leaks",
        text: "Do you get leaks at night or during activity?",
        options: [
          { id: "rarely", label: "Rarely or never" },
          { id: "sometimes", label: "Sometimes at night" },
          { id: "often", label: "Often, or high risk" },
        ],
      },
      {
        id: "duration",
        text: "How many days does your period last?",
        options: [
          { id: "3-4", label: "3 to 4 days" },
          { id: "5-7", label: "5 to 7 days" },
          { id: "7+", label: "More than 7 days" },
        ],
      },
    ],
    result: (a) => {
      const flow = one(a, "flow");
      const leaks = one(a, "leaks");
      const duration = one(a, "duration");
      let title: string;
      let pick: FinderPick;
      if (flow === "variable" || duration === "7+" || (flow === "heavy" && duration === "5-7")) {
        title = "Recommended for your cycle";
        pick = {
          product: "ovy-pads",
          size: "Mix Your Box",
          why: "Your flow varies across your cycle. Mix Your Box gives you L for light days, XL for regular days and XL+ for heavy flow and nights, in a single box.",
        };
      } else if (leaks === "often") {
        title = "Best match for heavy flow";
        pick = {
          product: "ovy-pads",
          size: "XL+ (320mm)",
          why: "Our longest pad (320mm) with dual leak guards, for heavy flow days and peace of mind overnight.",
        };
      } else if (flow === "light") {
        title = "Best match for light flow";
        pick = {
          product: "ovy-pads",
          size: "L (240mm)",
          why: "A compact 240mm pad for light flow, spotting and comfortable everyday wear on your lighter days.",
        };
      } else {
        title = "Most popular choice";
        pick = {
          product: "ovy-pads",
          size: "XL (280mm)",
          why: "A versatile 280mm pad for regular to heavy flow, with up to 8 hours of rash-free comfort.",
        };
      }
      const tip =
        duration === "7+"
          ? "A period that often lasts more than 7 days is worth mentioning to a doctor."
          : flow === "heavy" && leaks === "often"
            ? "If you soak through an XL+ in under 2 hours, please see a doctor."
            : undefined;
      return {
        title,
        intro: "Here's the pad size that fits your answers.",
        picks: [pick],
        tip,
        links: [{ label: "Open the pads page", href: "/product-detail/ovy-pads" }],
      };
    },
  },

  // Menstrual cup page (/product-detail/ovy-cup and /menstrual-cup), "Take the 30-second
  // quiz" in the #size-finder section and "30-Sec Size Quiz" next to the size picker.
  "cup-size": {
    id: "cup-size",
    title: "Cup size quiz",
    short: "Cup size quiz",
    page: { label: "Open the cup size finder", href: "/product-detail/ovy-cup#size-finder" },
    steps: [
      {
        id: "age",
        text: "What is your age?",
        options: [
          { id: "under18", label: "Under 18 (teen)" },
          { id: "18to30", label: "18 to 30" },
          { id: "above30", label: "Over 30" },
        ],
      },
      {
        id: "birth",
        text: "Have you given birth vaginally?",
        options: [
          { id: "none", label: "No, or a C-section delivery" },
          { id: "vaginal", label: "Yes, I've given birth vaginally" },
        ],
      },
      {
        id: "flow",
        text: "How heavy is your period flow?",
        options: [
          { id: "light", label: "Light to normal flow" },
          { id: "heavy", label: "Heavy flow (I change pads often)" },
        ],
      },
      {
        id: "cervix",
        text: "What is your cervix height? On a period day, with clean hands, slide one finger in until you feel your cervix (firm, like the tip of your nose).",
        options: [
          { id: "medium", label: "Average or high (2nd knuckle or further)" },
          { id: "low", label: "Low (1st knuckle)" },
          { id: "unsure", label: "Unsure, or a first-time user" },
        ],
      },
    ],
    // The site picks Teen (XS) for every under-18 answer, so the birth, flow and
    // cervix questions are not asked of a teen.
    skip: (step, a) => one(a, "age") === "under18" && (step === "birth" || step === "flow" || step === "cervix"),
    result: (a) => {
      const age = one(a, "age");
      const birth = one(a, "birth");
      const flow = one(a, "flow");
      const cervix = one(a, "cervix");
      let rec: "xs" | "m" | "l" = "m";
      if (age === "under18") rec = "xs";
      else if (birth === "vaginal") rec = cervix === "low" && flow === "light" ? "m" : "l";
      else rec = age === "above30" && flow === "heavy" && cervix !== "low" ? "l" : "m";
      const size = CUP_SIZES[rec];
      const tip =
        birth === "vaginal"
          ? "If your baby is recent, wait until your doctor clears you to use internal products again."
          : rec === "xs"
            ? "Try the punch-down fold at home on a lighter day for an easy first go."
            : cervix === "unsure"
              ? "Not sure of your cervix height? The 20-second cervix check on the cup page shows you how."
              : undefined;
      return {
        title: "Your cup size",
        intro: "Here's the size that fits your answers.",
        picks: [{ product: "ovy-cup", size: size.size, why: size.why }],
        tip,
        links: [{ label: "Open the cup size finder", href: "/product-detail/ovy-cup#size-finder" }],
      };
    },
  },

  // Ovy Teen page (/product-detail/ovy-teen), "Not sure which kit is right?" banner,
  // "Find My Fit Quiz" in the Learn menu and the "Not sure what you need?" card.
  "teen-kit": {
    id: "teen-kit",
    title: "Teen kit quiz",
    short: "Teen kit quiz",
    page: { label: "See Ovy Teen kits", href: "/product-detail/ovy-teen" },
    steps: [
      {
        id: "q1",
        text: "Is this for a first period, or an active teen?",
        options: [
          { id: "first", label: "First period or first-time user" },
          { id: "regular", label: "Regular monthly period care" },
          { id: "active", label: "Sports player or tournament traveller" },
        ],
      },
      {
        id: "q2",
        text: "What is her daily activity level?",
        options: [
          { id: "school", label: "School days and light study routines" },
          { id: "sports", label: "Active sports, dance and outdoor activities" },
        ],
      },
      {
        id: "q3",
        text: "What type of kit would she love?",
        options: [
          { id: "basic", label: "An essential pad pack" },
          { id: "gift", label: "A complete milestone gift box with extras" },
        ],
      },
    ],
    // Same rule as the site: the activity answer (q2) does not change the result there.
    result: (a) => {
      const q1 = one(a, "q1");
      const q3 = one(a, "q3");
      const key = q1 === "active" ? "PRO" : q1 === "first" || q3 === "gift" ? "FIRST" : "STARTER";
      const kit = TEEN_KITS[key];
      const picks: FinderPick[] = [{ product: "ovy-teen", size: kit.size, why: kit.why }];
      if (key === "FIRST") picks.push({ product: "ovy-teen", size: TEEN_KITS.STARTER.size, why: TEEN_KITS.STARTER.why });
      return {
        title: "We recommend",
        intro: "Here's the kit that fits her.",
        picks,
        checklist: kit.checklist,
        tip: "Pop a kit in her school bag before her period starts, so she's ready wherever she is.",
        links: [{ label: "See Ovy Teen kits", href: "/product-detail/ovy-teen" }],
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
