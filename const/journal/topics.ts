import type { CoverTheme, JournalCategory } from "./types";

export const JOURNAL_TOPICS: {
  name: JournalCategory;
  slug: string;
  blurb: string;
  theme: CoverTheme;
}[] = [
  { name: "Period Care", slug: "period-care", blurb: "Pads, rashes, PMS and what's normal", theme: "ovy" },
  { name: "Women's Health", slug: "womens-health", blurb: "Discharge, breasts, perimenopause", theme: "rose" },
  { name: "Everyday Hygiene", slug: "everyday-hygiene", blurb: "Habits that actually keep you well", theme: "teal" },
  { name: "Travel Hygiene", slug: "travel-hygiene", blurb: "Trains, highways and public toilets", theme: "looway" },
  { name: "Seasonal Health", slug: "seasonal-health", blurb: "Dengue, smog and the season ahead", theme: "amber" },
  { name: "Rights & Policy", slug: "rights-and-policy", blurb: "What the law says, in plain words", theme: "sky" },
];

// Older database posts used looser category names; file them under a topic.
const LEGACY_TOPICS: Record<string, JournalCategory> = {
  "sanitary pads": "Period Care",
  "at work": "Period Care",
  "period care": "Period Care",
  protection: "Everyday Hygiene",
  "personal hygiene": "Everyday Hygiene",
  "women's hygiene": "Everyday Hygiene",
  "women’s hygiene": "Everyday Hygiene",
  "hygiene basics": "Everyday Hygiene",
  skin: "Women's Health",
  "skin pimples": "Women's Health",
  "wellness tips": "Women's Health",
};

export function normaliseTopic(category?: string | null): string {
  if (!category) return "Everyday Hygiene";
  const exact = JOURNAL_TOPICS.find((t) => t.name.toLowerCase() === category.toLowerCase());
  return exact?.name || LEGACY_TOPICS[category.trim().toLowerCase()] || category;
}

/** Health days the Journal has a guide for. */
export const HEALTH_CALENDAR: { when: string; name: string; slug: string }[] = [
  { when: "All October", name: "Breast Cancer Awareness Month", slug: "breast-self-exam-at-home-guide" },
  { when: "10 Oct", name: "World Mental Health Day", slug: "pms-vs-pmdd-symptoms-difference" },
  { when: "15 Oct", name: "Global Handwashing Day", slug: "how-to-wash-hands-properly-steps" },
  { when: "18 Oct", name: "World Menopause Day", slug: "perimenopause-symptoms-early-signs" },
  { when: "Oct to Nov", name: "Pollution season in North India", slug: "aqi-pollution-health-protect-lungs" },
  { when: "8 Nov", name: "Diwali travel", slug: "public-toilet-hygiene-travel-uti-tips" },
  { when: "19 Nov", name: "World Toilet Day", slug: "public-toilet-hygiene-travel-uti-tips" },
];
