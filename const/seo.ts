import type { Metadata } from "next";

export const SITE_URL = "https://www.potenthygiene.com";
export const SITE_NAME = "Potent Hygiene";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const MARKETPLACE_LINKS = {
  amazon:
    "https://www.amazon.in/stores/PotentHygiene/page/18678868-B6F1-4388-A566-62231A1FE8D5",
  myntra: "https://www.myntra.com/potent-hygiene",
};

export const SOCIAL_LINKS = [
  "https://www.instagram.com/potenthygiene/",
  "https://www.facebook.com/potenthygiene",
  MARKETPLACE_LINKS.amazon,
  MARKETPLACE_LINKS.myntra,
];

type PageSeo = { title: string; description: string; path: string };

// One entry per public page. Titles get " | Potent Hygiene" added by the
// root layout's title template, except the homepage, which is absolute.
const PAGES: Record<string, PageSeo> = {
  home: {
    title:
      "Potent Hygiene | Organic Period Care & Travel Hygiene, Made in India",
    description:
      "Ovy rash-free organic sanitary pads, teen kits, liners and menstrual cups, and Looway pee funnels, toilet seat covers and travel bags. Made in Jaipur. Free delivery on ₹399+.",
    path: "/",
  },
  shop: {
    title: "Shop Period Care & Travel Hygiene Products",
    description:
      "Shop Ovy organic sanitary pads, teen kits, panty liners and menstrual cups, and Looway travel hygiene essentials. Subscribe and save up to 15%. Free delivery on ₹399+.",
    path: "/shop",
  },
  ovy: {
    title: "Ovy Organic Period Care: Pads, Teen Kits, Cups & Liners",
    description:
      "Ovy is period care made for Indian bodies: rash-free, dermatologically tested organic pads in L, XL and XL+, teen kits, daily liners and medical-grade menstrual cups.",
    path: "/ovy",
  },
  looway: {
    title: "Looway Travel Hygiene: Pee Funnel, Seat Covers & Travel Bags",
    description:
      "Looway makes Indian toilets and journeys easier: a reusable female pee funnel, disposable toilet seat covers and leak-proof urine and vomit bags for travel.",
    path: "/looway",
  },
  "yatra-kit": {
    title: "Looway Yatra Kit: Build Your Travel Hygiene Kit",
    description:
      "Build a travel hygiene kit for treks, pilgrimages, road trips and flights: Looway seat covers, pee and puke bags and a reusable pee funnel in one kit.",
    path: "/looway-yatra-kit",
  },
  "period-log": {
    title: "Free Period Tracker & Period Calculator",
    description:
      "Enter your last period date and cycle length to see your next periods. A free, simple period tracker from Ovy by Potent Hygiene.",
    path: "/period-log",
  },
  blog: {
    title: "Health & Hygiene Journal: Period, Women's & Travel Guides",
    description:
      "Sourced guides on periods, pad rash, discharge, PMDD, perimenopause, dengue, pollution, handwashing and public toilet hygiene, written for India by Potent Hygiene.",
    path: "/blog",
  },
  faq: {
    title: "FAQs: Orders, Delivery, Subscriptions & Products",
    description:
      "Answers to common questions about Ovy and Looway products, delivery, subscriptions, Cycle Sync, payments and cancellations.",
    path: "/faq",
  },
  contact: {
    title: "Contact Us",
    description:
      "Call, WhatsApp or email Potent Hygiene, Monday to Saturday, 10 am to 7 pm. Customer care: care@potenthygiene.com. Business and bulk orders: info@potenthygiene.com.",
    path: "/contact",
  },
  about: {
    title: "About Us: India's Scenario-Based Hygiene Brand",
    description:
      "Potent Hygiene is a woman-founded brand from Jaipur, building Ovy period care and Looway travel hygiene for Indian bodies, Indian toilets and Indian journeys.",
    path: "/about",
  },
  business: {
    title: "B2B & Bulk Orders: Hygiene Supply for Businesses",
    description:
      "B2B supply of Ovy pads, teen kits and cups and Looway seat covers, pee and puke bags and Yatra Kits for corporates, travel operators, hotels, schools, hospitals and CSR. GST invoice, quote in one working day.",
    path: "/business",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description:
      "How and when Potent Hygiene orders ship across India, delivery times and free delivery on orders of ₹399 and above.",
    path: "/shipping-policy",
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    description:
      "Potent Hygiene's cancellation and refund policy for personal hygiene products.",
    path: "/refund-policy",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Potent Hygiene collects, uses and protects your personal data.",
    path: "/privacy-policy",
  },
  "terms-condition": {
    title: "Terms & Conditions",
    description: "Terms and conditions for using potenthygiene.com.",
    path: "/terms-condition",
  },
};

// Product pages, keyed by the canonical product slug.
export const PRODUCT_SEO: Record<string, Omit<PageSeo, "path">> = {
  "ovy-pads": {
    title: "Ovy Organic Sanitary Pads: Rash-Free L, XL & XL+",
    description:
      "Rash-free, dermatologically tested organic sanitary pads in L, XL and XL+ for every flow, with 4 free liners in each 21-pad box. Mix your box or subscribe and save.",
  },
  "ovy-liners": {
    title: "Ovy Daily Panty Liners: Breathable Everyday Freshness",
    description:
      "Ultra-thin, breathable daily panty liners for discharge, spotting and light days. Packs of 40, 60 and 80. Subscribe monthly or every 2 months and save.",
  },
  "ovy-panty": {
    title: "Ovy Super Slim Disposable Period Panties",
    description:
      "Super slim, single-use period panties: one panty replaces 2 to 3 pad changes, with no bulky nappy feel. Dermatologically tested and rash-free.",
  },
  "ovy-teen": {
    title: "Ovy Teen Pads & First Period Kits for Girls",
    description:
      "Soft, organic teen pads and kits that make a first period calm: the Starter Pack and the Pro-Active Pack for sporty teens. Subscribe or use Cycle Sync.",
  },
  "ovy-cup": {
    title: "Ovy Menstrual Cup: Medical-Grade Silicone, 3 Sizes",
    description:
      "A soft, medical-grade silicone menstrual cup in Teen (XS), Medium and Large, up to 12 hours of wear and years of use. Find your size with our quick size finder.",
  },
  "looway-pee-funnel": {
    title: "Looway Reusable Female Pee Funnel for Travel",
    description:
      "Pee standing up, anywhere: a soft, reusable female urination funnel for squat toilets, highways, treks and pilgrimages. Washable and lasts for years.",
  },
  "looway-pee-puke": {
    title: "Looway Leak-Proof Urine & Vomit Bags for Travel",
    description:
      "Leak-proof urine and vomit bags that turn liquid into gel, for car journeys, motion sickness, pregnancy, kids and seniors. Seal and bin, no spills.",
  },
  "looway-toilet-seat-covers": {
    title: "Looway Disposable Toilet Seat Covers: Wet-Proof",
    description:
      "Wet-proof disposable toilet seat covers for public toilets, trains, offices and travel. 25 covers per box in 2-Pack and 4-Pack. Fold it, bin it, never flush it.",
  },
};

function build(seo: PageSeo, absoluteTitle = false): Metadata {
  return {
    title: absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.path,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function pageMetadata(key: keyof typeof PAGES): Metadata {
  return build(PAGES[key], key === "home");
}

export function productMetadata(slug: string): Metadata {
  const seo = PRODUCT_SEO[slug];
  if (!seo) return {};
  return build({ ...seo, path: `/product-detail/${slug}` });
}

export const PUBLIC_PATHS = [
  ...Object.values(PAGES).map((p) => p.path),
  ...Object.keys(PRODUCT_SEO).map((slug) => `/product-detail/${slug}`),
];
