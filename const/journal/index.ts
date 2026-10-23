import type { Article, Block, CoverTheme, JournalProduct } from "./types";
import whiteDischarge from "./articles/white-discharge-normal-or-not";
import dengue from "./articles/dengue-symptoms-warning-signs-recovery";
import supremeCourt from "./articles/supreme-court-menstrual-health-right-schools";
import breastExam from "./articles/breast-self-exam-at-home-guide";
import padSafety from "./articles/are-sanitary-pads-safe-chemicals-rashes";
import pmdd from "./articles/pms-vs-pmdd-symptoms-difference";
import handwashing from "./articles/how-to-wash-hands-properly-steps";
import perimenopause from "./articles/perimenopause-symptoms-early-signs";
import travelToilets from "./articles/public-toilet-hygiene-travel-uti-tips";
import pollution from "./articles/aqi-pollution-health-protect-lungs";

export type { Article } from "./types";

// Newest first.
export const ARTICLES: Article[] = [
  whiteDischarge,
  dengue,
  supremeCourt,
  breastExam,
  padSafety,
  pmdd,
  handwashing,
  perimenopause,
  travelToilets,
  pollution,
].sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const JOURNAL_AUTHOR = {
  name: "Team Potent Hygiene",
  bio: "Written by the Potent Hygiene team in Jaipur, the people behind Ovy period care and Looway travel hygiene. Every article is checked against the public health sources listed with it.",
  image: "/author-placeholder.jpg",
};

export const COVER_THEMES: Record<
  CoverTheme,
  { from: string; to: string; ink: string; soft: string; accent: string }
> = {
  teal: { from: "#075965", to: "#1A8D91", ink: "#075965", soft: "#E6F4F6", accent: "#9FE0DD" },
  ovy: { from: "#5E3358", to: "#9A6592", ink: "#7E4D77", soft: "#FBF1FB", accent: "#F2C6EC" },
  looway: { from: "#0B4A2F", to: "#2F7D55", ink: "#0E5C3A", soft: "#EEF5EF", accent: "#B9E4C9" },
  rose: { from: "#9C3D5A", to: "#D97A8F", ink: "#9C3D5A", soft: "#FDF1F4", accent: "#FFD3DD" },
  amber: { from: "#8A4B12", to: "#D08A33", ink: "#8A4B12", soft: "#FDF5EA", accent: "#FFE0B0" },
  sky: { from: "#1F4E79", to: "#4C8FC2", ink: "#1F4E79", soft: "#EEF4FA", accent: "#C7E0F5" },
};

export const JOURNAL_PRODUCTS: Record<
  JournalProduct,
  { name: string; brand: "Ovy" | "Looway" | "Potent"; href: string; image: string; line: string }
> = {
  "ovy-pads": {
    name: "Ovy Organic Sanitary Pads",
    brand: "Ovy",
    href: "/product-detail/ovy-pads",
    image: "/product-images/pads.jpg",
    line: "BIS certified, dermatologically tested, rash-free pads in L, XL and XL+.",
  },
  "ovy-liners": {
    name: "Ovy Daily Panty Liners",
    brand: "Ovy",
    href: "/product-detail/ovy-liners",
    image: "/product-images/liners.jpg",
    line: "Dermatologically tested, rash-free liners for everyday freshness.",
  },
  "ovy-panty": {
    name: "Ovy Super Slim Period Panties",
    brand: "Ovy",
    href: "/product-detail/ovy-panty",
    image: "/ovy/panty-box.jpg",
    line: "Single-use, leak-resistant period panties for heavy days and nights.",
  },
  "ovy-teen": {
    name: "Ovy Teen First Period Kits",
    brand: "Ovy",
    href: "/product-detail/ovy-teen",
    image: "/product-images/teen.jpg",
    line: "Soft teen pads and kits that make a first period calm.",
  },
  "ovy-cup": {
    name: "Ovy Menstrual Cup",
    brand: "Ovy",
    href: "/product-detail/ovy-cup",
    image: "/product-images/cup.jpg",
    line: "Medical-grade silicone in Teen, Medium and Large.",
  },
  "looway-pee-funnel": {
    name: "Looway Reusable Pee Funnel",
    brand: "Looway",
    href: "/product-detail/looway-pee-funnel",
    image: "/product-images/funnel.jpg",
    line: "A soft, washable funnel so you can pee standing up, anywhere.",
  },
  "looway-pee-puke": {
    name: "Looway Urine & Vomit Bags",
    brand: "Looway",
    href: "/product-detail/looway-pee-puke",
    image: "/product-images/pukebags.jpg",
    line: "Leak-proof bags that turn liquid into gel. Seal and bin.",
  },
  "looway-toilet-seat-covers": {
    name: "Looway Toilet Seat Covers",
    brand: "Looway",
    href: "/product-detail/looway-toilet-seat-covers",
    image: "/product-images/seatcovers.jpg",
    line: "Wet-proof disposable seat covers. Use, fold and bin.",
  },
  "looway-yatra-kit": {
    name: "Looway Yatra Kit",
    brand: "Looway",
    href: "/looway-yatra-kit",
    image: "/looway/yatra-kit-thumb-v2.png",
    line: "Build one travel hygiene kit for the whole trip.",
  },
  "period-tracker": {
    name: "Free Period Tracker",
    brand: "Potent",
    href: "/period-log",
    image: "/trackermainImage.png",
    line: "See your next periods and fertile days in seconds. No sign-up needed.",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-22" or a Date → "22 Oct 2026". */
export function formatJournalDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(`${value.slice(0, 10)}T00:00:00Z`) : value;
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Strips the inline format (**bold**, *italic*, [text](href)) to plain text. */
export function plainText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function blockText(b: Block): string {
  switch (b.type) {
    case "p":
    case "h3":
      return b.text;
    case "ul":
    case "ol":
    case "checklist":
      return b.items.join(" ");
    case "callout":
      return `${b.title} ${b.text}`;
    case "table":
      return [...b.head, ...b.rows.flat()].join(" ");
    case "steps":
      return b.items.map((i) => `${i.title} ${i.text}`).join(" ");
    case "stats":
      return b.items.map((i) => `${i.value} ${i.label}`).join(" ");
    case "product":
      return b.note;
    case "figure":
      return b.caption || "";
  }
}

export function articleWordCount(a: Article): number {
  const text = [
    ...a.intro,
    ...a.takeaways,
    ...a.sections.flatMap((s) => [s.heading, ...s.blocks.map(blockText)]),
    ...a.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return plainText(text).split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(a: Article): number {
  return Math.max(3, Math.round(articleWordCount(a) / 220));
}

export function coverImage(slug: string): string {
  return `/journal-cover/${slug}`;
}

export function shareImage(slug: string): string {
  return `/journal-share/${slug}`;
}

/** Same shape as the database blog rows the site already shows. */
export function articleAsPost(a: Article) {
  return {
    id: `journal-${a.slug}`,
    slug: a.slug,
    title: a.title,
    blogCategory: a.category,
    metaDescription: a.description,
    data: a.description,
    image: coverImage(a.slug),
    date: formatJournalDate(a.date),
    isoDate: a.date,
    readMinutes: readingMinutes(a),
    isPublished: true,
    fromCode: true,
  };
}
