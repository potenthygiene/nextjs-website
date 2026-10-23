"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, CalendarHeart, ListChecks } from "lucide-react";
import Link from "next/link";
import { getJournalPosts } from "@/helper/blog/action";
import {
  BTN_SECONDARY,
  CONTAINER,
  EYEBROW_TEAL,
  H2,
  LEAD,
  SECTION_Y,
} from "./homeStyles";

const FALLBACK_ARTICLES = [
  {
    category: "SANITARY PADS",
    title: "Why choose sanitary pads instead of cloth during periods?",
    date: "19 Aug 2026",
    link: "/blog/why-choose-sanitary-pads-instead-of-cloth-during-periods",
  },
  {
    category: "PROTECTION",
    title: "Protection and women's hygiene",
    date: "19 Aug 2026",
    link: "/blog/protection-and-womens-hygiene",
  },
  {
    category: "SKIN",
    title: "Skin pimples: causes, prevention and simple care tips",
    date: "19 Aug 2026",
    link: "/blog/skin-pimples-causes-prevention-and-simple-care-tips",
  },
  {
    category: "AT WORK",
    title: "Periods, power, productivity: managing menstrual health at work",
    date: "2026",
    link: "/blog/periods-power-productivity-how-managing-menstrual-health-can-skyrocket-your-efficiency",
  },
];

// Free tools for the visitor who came to learn rather than to buy.
const TOOLS = [
  {
    title: "Free Period Tracker",
    body: "Enter your last period and cycle length to see your next dates.",
    href: "/period-log",
    cta: "Open the tracker",
    Icon: CalendarHeart,
  },
  {
    title: "Find what I need",
    body: "Four questions, about 30 seconds, matched to your flow and skin.",
    href: "/quiz",
    cta: "Take the quiz",
    Icon: ListChecks,
  },
];

// Learn: the Journal plus the free tools. Shown on phones too, since that is
// where nearly every visitor reads.
export function JournalSection() {
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const blogs = await getJournalPosts();
        if (blogs && blogs.length > 0) {
          const mapped = blogs.slice(0, 4).map((b) => ({
            category: (b.blogCategory || "JOURNAL").toUpperCase(),
            title: b.title,
            date: b.date || "Recent",
            link: `/blog/${b.slug}`,
          }));
          setArticles(
            mapped.length < 4
              ? [...mapped, ...FALLBACK_ARTICLES.slice(mapped.length)]
              : mapped,
          );
        }
      } catch (err) {
        console.error("Failed loading journal section blogs:", err);
      }
    }
    loadBlogs();
  }, []);

  return (
    <section className={`overflow-hidden bg-white ${SECTION_Y}`} id="learn">
      <div className={CONTAINER}>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end sm:gap-4">
          <div className="space-y-2 sm:space-y-3">
            <span className={EYEBROW_TEAL}>Learn</span>
            <h2 className={H2}>The stuff nobody explains properly.</h2>
            <p className={`${LEAD} max-w-xl`}>
              Straight answers on periods, the body and travel hygiene, with no
              euphemisms. Our tools guide you. They do not diagnose.
            </p>
          </div>
          <span className="hidden shrink-0 sm:block">
            <Link href="/blog" className={BTN_SECONDARY}>
              Read the journal <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </span>
        </div>

        {/* Free tools */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-5">
          {TOOLS.map(({ title, body, href, cta, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-4 transition-shadow hover:shadow-md sm:p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#016271]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-base font-bold text-[#1F1915] sm:text-lg">
                  {title}
                </span>
                <span className="block text-[13px] leading-snug text-[#5C524D] sm:text-sm">
                  {body}
                </span>
                <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-[#016271]">
                  {cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Articles: a swipe row on phones, a grid from tablet up */}
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4 md:gap-6">
          {articles.map((item) => (
            <li key={item.link} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Link
                href={item.link}
                className="group flex h-full flex-col justify-between rounded-2xl border border-gray-100/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md sm:p-6"
              >
                <div>
                  <span className="mb-3 block w-fit rounded-full bg-[#E2F4F7] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#016271] uppercase">
                    {item.category}
                  </span>
                  <h3 className="mb-4 font-serif text-base leading-snug font-bold text-[#1F1915] transition-colors group-hover:text-[#016271] sm:text-lg">
                    {item.title}
                  </h3>
                </div>
                <span className="mt-auto text-[13px] font-medium text-[#5C524D]">
                  {item.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 sm:hidden">
          <Link href="/blog" className={`${BTN_SECONDARY} w-full`}>
            Read the journal <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
