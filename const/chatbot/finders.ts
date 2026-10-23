import type { ProductKey } from "./symptomTypes";

// Guided "help me choose" finders. Each asks a few tap questions, then
// recommends products, sizes and a combo. Facts follow the product notes.

export type FinderStep = {
  id: string;
  text: string;
  multi?: boolean;
  options: { id: string; label: string }[];
};

export type FinderPick = { product: ProductKey; why: string; size?: string };
export type FinderResult = { title: string; intro: string; picks: FinderPick[]; tip?: string };

export type Finder = {
  id: string;
  title: string;
  steps: FinderStep[];
  /** Skip a step when it doesn't apply to the answers so far. */
  skip?: (stepId: string, a: Record<string, string[]>) => boolean;
  result: (a: Record<string, string[]>) => FinderResult;
};

const has = (a: Record<string, string[]>, step: string, id: string) => (a[step] || []).includes(id);

export const FINDERS: Record<string, Finder> = {
  ovy: {
    id: "ovy",
    title: "Help me choose period care",
    steps: [
      {
        id: "who",
        text: "Who is this for?",
        options: [
          { id: "me", label: "For me" },
          { id: "teen", label: "My daughter (first periods)" },
          { id: "gift", label: "A gift for someone" },
        ],
      },
      {
        id: "flow",
        text: "How heavy is the flow on most days?",
        options: [
          { id: "light", label: "Light" },
          { id: "medium", label: "Medium" },
          { id: "heavy", label: "Heavy" },
          { id: "very", label: "Very heavy or long nights" },
          { id: "mixed", label: "It changes a lot" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "type",
        text: "What would you like to use?",
        options: [
          { id: "pads", label: "Pads" },
          { id: "cup", label: "A menstrual cup" },
          { id: "panty", label: "Period panties" },
          { id: "suggest", label: "Not sure, suggest for me" },
        ],
      },
      {
        id: "extra",
        text: "Anything else that matters? Pick all that apply.",
        multi: true,
        options: [
          { id: "sensitive", label: "Sensitive skin or rashes" },
          { id: "sports", label: "Sports, gym or swimming" },
          { id: "nights", label: "Leaks at night" },
          { id: "discharge", label: "Discharge between periods" },
          { id: "travel", label: "Lots of travel" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    skip: (step, a) => (step === "type" && (has(a, "who", "teen") || has(a, "who", "gift"))) || (step === "flow" && has(a, "who", "gift")),
    result: (a) => {
      const picks: FinderPick[] = [];
      const flow = a.flow?.[0] || "unsure";
      const size =
        flow === "light" ? "L (240mm)" : flow === "medium" ? "XL (280mm)" : flow === "heavy" || flow === "very" ? "XL+ (320mm)" : "Mix Your Box (L, XL and XL+)";
      if (has(a, "who", "teen")) {
        picks.push({ product: "ovy-teen", why: "Soft teen pads and kits made for first periods, with a guide she can keep." });
        picks.push({ product: "ovy-liners", why: "Thin liners for the discharge that often comes before and between periods." });
        return { title: "A calm first-period kit", intro: "Here's what I'd suggest for your daughter.", picks, tip: "Pop a kit in her school bag before her period starts, so she's ready wherever she is." };
      }
      if (has(a, "who", "gift")) {
        picks.push({ product: "ovy-pads", size: "XL+ or Mix Your Box", why: "XL+ is the most protective, so it suits anyone. Mix Your Box gives every size." });
        picks.push({ product: "ovy-liners", why: "A thoughtful extra for everyday freshness." });
        return { title: "A gift that fits anyone", intro: "When you don't know someone's flow, these are the safest picks.", picks };
      }
      const type = a.type?.[0] || "suggest";
      const sports = has(a, "extra", "sports");
      if (type === "cup" || (type === "suggest" && sports)) {
        picks.push({ product: "ovy-cup", why: "Medical-grade silicone, worn up to 12 hours, and fine for swimming and sport. The size finder picks Teen, Medium or Large." });
      }
      if (type === "panty") {
        picks.push({ product: "ovy-panty", why: "Leak-proof disposable period underwear: one panty can replace 2 to 3 pad changes." });
      }
      if (type === "pads" || type === "suggest" || picks.length === 0) {
        picks.push({ product: "ovy-pads", size, why: `Dermatologically tested, rash-free pads. ${size} suits your flow.` });
      }
      if ((has(a, "extra", "nights") || flow === "very") && !picks.some((p) => p.product === "ovy-panty")) {
        picks.push({ product: "ovy-panty", why: "For heavy nights, a period panty gives front-to-back cover while you sleep." });
      }
      if (has(a, "extra", "discharge") || type === "cup") {
        picks.push({ product: "ovy-liners", why: type === "cup" ? "A liner is handy backup while you get used to the cup." : "For light days and discharge between periods." });
      }
      if (has(a, "extra", "travel")) picks.push({ product: "looway-toilet-seat-covers", why: "Biodegradable seat covers for trains, highways and office toilets." });
      const sensitive = has(a, "extra", "sensitive");
      return {
        title: "Your period care match",
        intro: sensitive
          ? "Ovy pads and liners are dermatologically tested and rash-free, which suits sensitive skin. Here's what I'd pick for you."
          : "Here's what I'd pick for you.",
        picks: picks.slice(0, 3),
        tip: "Subscribe to pads, liners or panties and save on every delivery. You can pause or cancel in two clicks.",
      };
    },
  },

  looway: {
    id: "looway",
    title: "Plan my trip hygiene",
    steps: [
      {
        id: "trip",
        text: "What kind of trip is it?",
        options: [
          { id: "train", label: "Train or bus journey" },
          { id: "road", label: "Road trip" },
          { id: "flight", label: "Flight" },
          { id: "trek", label: "Trek, camping or pilgrimage" },
          { id: "daily", label: "Daily office or college" },
        ],
      },
      {
        id: "who",
        text: "Who's travelling? Pick all that apply.",
        multi: true,
        options: [
          { id: "women", label: "Women or girls" },
          { id: "kids", label: "Young children" },
          { id: "seniors", label: "Elderly parents" },
          { id: "pregnant", label: "Someone pregnant" },
          { id: "men", label: "Men or boys" },
        ],
      },
      {
        id: "length",
        text: "How long is the trip?",
        options: [
          { id: "day", label: "A day" },
          { id: "few", label: "2 to 4 days" },
          { id: "week", label: "A week or more" },
        ],
      },
    ],
    skip: (step, a) => step === "length" && has(a, "trip", "daily"),
    result: (a) => {
      const picks: FinderPick[] = [];
      const trip = a.trip?.[0] || "train";
      picks.push({ product: "looway-toilet-seat-covers", why: "For every Western toilet on the way: use, fold and bin. Never flush." });
      if (has(a, "who", "women") && (trip === "trek" || trip === "road" || trip === "train")) {
        picks.push({ product: "looway-pee-funnel", why: "Pee standing up when the toilet is a squat, filthy or missing. Practise once at home." });
      }
      if (has(a, "who", "kids") || has(a, "who", "seniors") || has(a, "who", "pregnant") || trip === "road" || trip === "flight") {
        picks.push({ product: "looway-pee-puke", why: "Leak-proof bags that turn pee or vomit into gel, for traffic jams, motion sickness and kids." });
      }
      const many = picks.length >= 2 && trip !== "daily";
      if (many) picks.unshift({ product: "looway-yatra-kit", why: "Build all of this into one kit, with free intimate wipes in every kit." });
      if (has(a, "who", "women") && trip !== "daily") picks.push({ product: "ovy-pads", why: "Pack pads too, as travel and stress can bring a period early." });
      const length = a.length?.[0];
      return {
        title: trip === "daily" ? "Your everyday hygiene kit" : "Your trip hygiene kit",
        intro: "Here's what I'd pack for this trip.",
        picks: picks.slice(0, 4),
        tip:
          length === "week"
            ? "For a long trip, carry enough seat covers for every toilet stop and a few spare pee bags, so you never have to ration them."
            : "Keep everything in one pouch you can reach without unpacking the bag.",
      };
    },
  },
};
