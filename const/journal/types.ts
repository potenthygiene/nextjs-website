// Journal articles written in code. Text fields accept a small inline
// format: **bold**, *italic* and [link text](/path or https://...).

export type JournalCategory =
  | "Women's Health"
  | "Period Care"
  | "Everyday Hygiene"
  | "Seasonal Health"
  | "Travel Hygiene"
  | "Rights & Policy";

export type CoverTheme = "teal" | "ovy" | "looway" | "rose" | "amber" | "sky";

export type CoverIcon =
  | "ribbon"
  | "droplets"
  | "brain"
  | "hand"
  | "flower"
  | "wind"
  | "train"
  | "shield"
  | "scale"
  | "bug"
  | "heart"
  | "sparkles";

export type JournalProduct =
  | "ovy-pads"
  | "ovy-liners"
  | "ovy-panty"
  | "ovy-teen"
  | "ovy-cup"
  | "looway-pee-funnel"
  | "looway-pee-puke"
  | "looway-toilet-seat-covers"
  | "looway-yatra-kit"
  | "period-tracker";

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | {
      type: "callout";
      tone: "tip" | "note" | "warning" | "doctor";
      title: string;
      text: string;
    }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "checklist"; title?: string; items: string[] }
  | {
      type: "stats";
      items: { value: string; label: string; source?: string }[];
    }
  | { type: "product"; product: JournalProduct; note: string }
  | { type: "figure"; src: string; alt: string; caption?: string; tall?: boolean };

export type Section = {
  id: string;
  heading: string;
  blocks: Block[];
};

export type Article = {
  slug: string;
  /** The on-page H1. */
  title: string;
  /** Search title, under 60 characters. " | Potent Hygiene" is added. */
  seoTitle: string;
  /** Meta description, 140 to 160 characters. */
  description: string;
  category: JournalCategory;
  tags: string[];
  primaryKeyword: string;
  keywords: string[];
  /** Publish date, YYYY-MM-DD. */
  date: string;
  cover: { theme: CoverTheme; icon: CoverIcon; kicker: string };
  /** Opening paragraphs shown before the key takeaways. */
  intro: string[];
  takeaways: string[];
  sections: Section[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
};
