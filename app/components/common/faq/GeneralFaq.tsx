"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, MessageCircle, Search, X } from "lucide-react";
import { FAQ_GROUPS, type GeneralFaq } from "@/const/generalFaqs";

const ALL = "all";

function FaqItem({
  faq,
  open,
  onToggle,
}: {
  faq: GeneralFaq;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div id={faq.id} className="scroll-mt-36 border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${faq.id}-answer`}
        className="flex w-full cursor-pointer items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-ink sm:text-base">
          {faq.q}
        </span>
        <ChevronDown
          className={`mt-0.5 h-5 w-5 shrink-0 text-[#016271] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div id={`${faq.id}-answer`} className="pb-5 pr-8 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
          <p>{faq.a}</p>
          {faq.links && faq.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {faq.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="rounded-full border border-[#016271]/30 px-3 py-1 text-xs font-semibold text-[#016271] transition-colors hover:bg-[#016271] hover:text-white"
                  >
                    {link.label} →
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GeneralFaqPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>(ALL);
  const [openId, setOpenId] = useState<string | null>(null);

  // Open the question named in the address (for example /faq#cod).
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id && FAQ_GROUPS.some((g) => g.faqs.some((f) => f.id === id))) {
      setOpenId(id);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 50);
    }
  }, []);

  const visibleGroups = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return FAQ_GROUPS.filter((g) => group === ALL || g.id === group)
      .map((g) => ({
        ...g,
        faqs: g.faqs.filter((f) => {
          if (!words.length) return true;
          const text = `${f.q} ${f.a}`.toLowerCase();
          return words.every((w) => text.includes(w));
        }),
      }))
      .filter((g) => g.faqs.length > 0);
  }, [query, group]);

  const resultCount = visibleGroups.reduce((n, g) => n + g.faqs.length, 0);

  return (
    <section className="w-full bg-white pb-16">
      {/* HEADER */}
      <div className="bg-[#E6F4F6] px-4 py-12 text-center sm:py-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#016271] uppercase">
          Help centre
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
          How can we help?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
          Orders, delivery, payments, subscriptions and rewards. Questions about a
          specific product are answered on its own page.
        </p>

        <div className="relative mx-auto mt-6 max-w-2xl">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <label htmlFor="faq-search" className="sr-only">
            Search the questions
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenId(null);
            }}
            placeholder="Search: delivery, cancel, Cycle Sync, credits…"
            className="h-12 w-full rounded-full border border-gray-200 bg-white pr-11 pl-12 text-base text-gray-900 shadow-sm focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/20 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-ink-muted hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* TOPICS */}
        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {[{ id: ALL, title: "All topics" }, ...FAQ_GROUPS].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setGroup(g.id);
                setOpenId(null);
              }}
              aria-pressed={group === g.id}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                group === g.id
                  ? "border-[#016271] bg-[#016271] text-white"
                  : "border-gray-200 bg-white text-ink-muted hover:border-[#016271]/50"
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>

        {/* QUESTIONS */}
        <div className="mt-8 space-y-8">
          {query && (
            <p className="text-sm text-ink-muted" aria-live="polite">
              {resultCount === 0
                ? "No questions match your search."
                : `${resultCount} question${resultCount === 1 ? "" : "s"} found`}
            </p>
          )}
          {visibleGroups.map((g) => (
            <div key={g.id}>
              <h2 className="mb-1 text-lg font-bold text-[#016271] sm:text-xl">{g.title}</h2>
              <div className="rounded-2xl border border-gray-200 px-4 sm:px-6">
                {g.faqs.map((f) => (
                  <FaqItem
                    key={f.id}
                    faq={f}
                    open={openId === f.id || (query.trim().length > 2 && resultCount <= 3)}
                    onToggle={() => setOpenId(openId === f.id ? null : f.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* STILL NEED HELP */}
        <div className="mt-12 rounded-3xl bg-[#075965] px-6 py-8 text-white sm:px-10">
          <h2 className="text-xl font-bold sm:text-2xl">Still need help?</h2>
          <p className="mt-2 text-sm text-white/80 sm:text-base">
            A real person replies, Monday to Saturday, 10 am to 7 pm.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/916375881514"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#075965] transition-colors hover:bg-white/90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
            <a
              href="mailto:care@potenthygiene.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Mail className="h-4 w-4" /> care@potenthygiene.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
