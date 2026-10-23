import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Info,
  Lightbulb,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import {
  ARTICLES,
  COVER_THEMES,
  JOURNAL_AUTHOR,
  JOURNAL_PRODUCTS,
  coverImage,
  formatJournalDate,
  plainText,
  readingMinutes,
  shareImage,
  type Article,
} from "@/const/journal";
import type { Block } from "@/const/journal/types";
import { SITE_URL } from "@/const/seo";
import { journalSerif } from "./fonts";
import { Inline } from "./Inline";
import { ReadingProgress, ShareButtons, TableOfContents } from "./ArticleClient";

const CALLOUTS = {
  tip: { icon: Lightbulb, bg: "#E6F4F6", border: "#9FD3D6", ink: "#075965" },
  note: { icon: Info, bg: "#FAF7F2", border: "#E6DCCB", ink: "#5B4A2E" },
  warning: { icon: AlertTriangle, bg: "#FFF6E8", border: "#F2C98B", ink: "#8A4B12" },
  doctor: { icon: Stethoscope, bg: "#FDF1F4", border: "#F0B8C5", ink: "#9C3D5A" },
} as const;

function BlockView({ block, ink, soft }: { block: Block; ink: string; soft: string }) {
  switch (block.type) {
    case "p":
      return (
        <p className="my-5">
          <Inline text={block.text} />
        </p>
      );
    case "h3":
      return (
        <h3 className={`${journalSerif.className} mb-3 mt-9 text-[21px] font-semibold leading-snug text-[#14302F]`}>
          <Inline text={block.text} />
        </h3>
      );
    case "ul":
      return (
        <ul className="my-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="relative pl-6">
              <span
                className="absolute left-0 top-[0.7em] h-2 w-2 rounded-full"
                style={{ backgroundColor: ink }}
                aria-hidden
              />
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="relative pl-10">
              <span
                className="absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold"
                style={{ backgroundColor: soft, color: ink }}
                aria-hidden
              >
                {i + 1}
              </span>
              <Inline text={item} />
            </li>
          ))}
        </ol>
      );
    case "callout": {
      const c = CALLOUTS[block.tone];
      const Icon = c.icon;
      return (
        <aside
          className="my-8 rounded-2xl border p-5 sm:p-6"
          style={{ backgroundColor: c.bg, borderColor: c.border }}
        >
          <p className="mb-2 flex items-center gap-2.5 text-[15px] font-semibold" style={{ color: c.ink }}>
            <Icon className="h-5 w-5 shrink-0" />
            {block.title}
          </p>
          <p className="text-[16px] leading-relaxed text-[#33403F]">
            <Inline text={block.text} />
          </p>
        </aside>
      );
    }
    case "table":
      return (
        <figure className="my-8">
          <div className="overflow-x-auto rounded-2xl border border-[#D6E6E8] bg-white">
            <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
              <thead>
                <tr style={{ backgroundColor: soft }}>
                  {block.head.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-[13px] font-semibold uppercase tracking-wide" style={{ color: ink }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-t border-[#E7EFF0] align-top">
                    {row.map((cell, c) => (
                      <td key={c} className={`px-4 py-3 leading-relaxed ${c === 0 ? "font-semibold text-[#14302F]" : "text-[#33403F]"}`}>
                        <Inline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="mt-2.5 text-[13px] text-[#5C7275]">
              <Inline text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "steps":
      return (
        <ol className="my-8 space-y-0">
          {block.items.map((step, i) => (
            <li key={i} className="relative flex gap-5 pb-7 last:pb-0">
              {i < block.items.length - 1 && (
                <span className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-[#D6E6E8]" aria-hidden />
              )}
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
                style={{ backgroundColor: ink }}
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="pt-1.5">
                <p className="font-semibold text-[#14302F]">
                  <Inline text={step.title} />
                </p>
                <p className="mt-1.5 text-[16.5px] leading-relaxed">
                  <Inline text={step.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "checklist":
      return (
        <div className="my-8 rounded-2xl border border-[#D6E6E8] bg-white p-5 sm:p-6">
          {block.title && <p className="mb-4 font-semibold text-[#14302F]">{block.title}</p>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-[16px] leading-snug">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ink }} />
                <span>
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "stats":
      return (
        <div className="my-8 grid gap-3 sm:grid-cols-3">
          {block.items.map((s, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: soft }}>
              <p className={`${journalSerif.className} text-[34px] font-semibold leading-none`} style={{ color: ink }}>
                {s.value}
              </p>
              <p className="mt-2.5 text-[14.5px] leading-snug text-[#33403F]">
                <Inline text={s.label} />
              </p>
              {s.source && <p className="mt-2 text-[12px] text-[#5C7275]">Source: {s.source}</p>}
            </div>
          ))}
        </div>
      );
    case "product": {
      const p = JOURNAL_PRODUCTS[block.product];
      return (
        <Link
          href={p.href}
          className="group my-8 flex items-center gap-4 rounded-2xl border border-[#D6E6E8] bg-white p-3.5 pr-5 transition-shadow hover:shadow-[0_8px_30px_rgba(7,89,101,0.10)] sm:gap-5"
        >
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2] sm:h-24 sm:w-24">
            <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5C7275]">
              {p.brand === "Potent" ? "Free tool" : `From ${p.brand}`}
            </p>
            <p className="mt-0.5 font-semibold leading-snug text-[#14302F]">{p.name}</p>
            <p className="mt-1 text-[14.5px] leading-snug text-[#5C7275]">
              <Inline text={block.note} />
            </p>
          </div>
          <ArrowRight className="hidden h-5 w-5 shrink-0 text-[#016271] transition-transform group-hover:translate-x-1 sm:block" />
        </Link>
      );
    }
    case "figure":
      return (
        <figure className={`my-9 ${block.tall ? "mx-auto max-w-md" : ""}`}>
          <div className={`relative overflow-hidden rounded-2xl bg-[#FAF7F2] ${block.tall ? "aspect-[4/5]" : "aspect-[4/3] sm:aspect-[16/10]"}`}>
            <Image src={block.src} alt={block.alt} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          </div>
          {block.caption && (
            <figcaption className="mt-2.5 text-[13px] text-[#5C7275]">
              <Inline text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
  }
}

function relatedArticles(a: Article): Article[] {
  const others = ARTICLES.filter((x) => x.slug !== a.slug);
  const same = others.filter((x) => x.category === a.category);
  const rest = others.filter((x) => x.category !== a.category);
  return [...same, ...rest].slice(0, 3);
}

function jsonLd(a: Article) {
  const url = `${SITE_URL}/blog/${a.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      image: [`${SITE_URL}${shareImage(a.slug)}`],
      datePublished: `${a.date}T09:00:00+05:30`,
      dateModified: `${a.date}T09:00:00+05:30`,
      author: { "@type": "Organization", name: JOURNAL_AUTHOR.name, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "Potent Hygiene",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: a.category,
      keywords: [a.primaryKeyword, ...a.keywords].join(", "),
      inLanguage: "en-IN",
      citation: a.sources.map((s) => s.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ],
    },
  ];
}

export default function ArticleView({ article: a }: { article: Article }) {
  const theme = COVER_THEMES[a.cover.theme];
  const minutes = readingMinutes(a);
  const path = `/blog/${a.slug}`;
  const toc = a.sections.map((s) => ({ id: s.id, heading: s.heading }));
  const related = relatedArticles(a);

  return (
    <div className="bg-[#FDFCF9] pb-20 text-[#33403F]">
      <ReadingProgress color={theme.ink} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(a)) }}
      />

      {/* Header */}
      <header style={{ backgroundColor: theme.soft }}>
        <div className="mx-auto max-w-4xl px-4 pb-32 pt-10 sm:px-6 sm:pt-14 md:pb-40">
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-[13px] text-[#5C7275]">
            <Link href="/" className="hover:text-[#075965]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-[#075965]">Journal</Link>
            <span aria-hidden>/</span>
            <span style={{ color: theme.ink }} className="font-medium">{a.category}</span>
          </nav>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: theme.ink }}
            >
              {a.category}
            </span>
            <span className="rounded-full border bg-white/70 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: theme.ink, borderColor: `${theme.ink}33` }}>
              {a.cover.kicker}
            </span>
          </div>

          <h1 className={`${journalSerif.className} text-[34px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#14302F] sm:text-[44px] md:text-[52px]`}>
            {a.title}
          </h1>
          <p className="mt-5 max-w-3xl text-[18px] leading-relaxed text-[#46575A] sm:text-[19px]">
            {a.description}
          </p>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={JOURNAL_AUTHOR.image}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
              />
              <div className="text-[13.5px] leading-tight">
                <p className="font-semibold text-[#14302F]">{JOURNAL_AUTHOR.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[#5C7275]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <time dateTime={a.date}>{formatJournalDate(a.date)}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {minutes} min read
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {a.sources.length} sources
                  </span>
                </p>
              </div>
            </div>
            <ShareButtons title={a.title} path={path} />
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="mx-auto -mt-24 max-w-5xl px-4 sm:px-6 md:-mt-32">
        <div className="relative aspect-[1200/630] overflow-hidden rounded-3xl shadow-[0_24px_60px_-20px_rgba(7,89,101,0.35)]">
          <Image
            src={coverImage(a.slug)}
            alt={a.title}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto mt-12 grid max-w-6xl gap-12 px-4 sm:px-6 md:mt-16 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <TableOfContents items={toc} />
          </div>
        </aside>

        <article id="journal-article" className="min-w-0 max-w-[720px] text-[17.5px] leading-[1.8] sm:text-[18px]">
          {a.intro.map((p, i) => (
            <p key={i} className={i === 0 ? "mb-5 text-[19px] leading-[1.75] text-[#26393A] sm:text-[20.5px]" : "my-5"}>
              <Inline text={p} />
            </p>
          ))}

          {/* Key takeaways */}
          <section
            aria-label="Key takeaways"
            className="my-10 rounded-3xl border p-6 sm:p-8"
            style={{ backgroundColor: theme.soft, borderColor: `${theme.ink}26` }}
          >
            <p className="mb-4 flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: theme.ink }}>
              <BookOpen className="h-4 w-4" />
              Key takeaways
            </p>
            <ul className="space-y-3">
              {a.takeaways.map((t, i) => (
                <li key={i} className="flex gap-3 text-[16.5px] leading-relaxed text-[#26393A]">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" style={{ color: theme.ink }} />
                  <span>
                    <Inline text={t} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mobile table of contents */}
          <details className="group mb-10 rounded-2xl border border-[#D6E6E8] bg-white p-5 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[14px] font-semibold text-[#075965]">
              On this page
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <ol className="mt-4 space-y-2.5 text-[15px]">
              {toc.map((t, i) => (
                <li key={t.id} className="flex gap-3">
                  <span className="text-[#5C7275]">{String(i + 1).padStart(2, "0")}</span>
                  <a href={`#${t.id}`} className="text-[#26393A] hover:text-[#016271]">{t.heading}</a>
                </li>
              ))}
            </ol>
          </details>

          {a.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-32">
              <h2 className={`${journalSerif.className} mb-4 mt-14 text-[27px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#14302F] sm:text-[31px]`}>
                {s.heading}
              </h2>
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} ink={theme.ink} soft={theme.soft} />
              ))}
            </section>
          ))}

          {/* FAQs */}
          <section id="faqs" className="scroll-mt-32">
            <h2 className={`${journalSerif.className} mb-6 mt-16 text-[27px] font-semibold leading-tight text-[#14302F] sm:text-[31px]`}>
              Frequently asked questions
            </h2>
            <div className="divide-y divide-[#E1ECEE] rounded-2xl border border-[#D6E6E8] bg-white">
              {a.faqs.map((f, i) => (
                <details key={i} className="group px-5 py-1 sm:px-6" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[16.5px] font-semibold leading-snug text-[#14302F]">
                    {f.q}
                    <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-[#016271] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 text-[16px] leading-relaxed">
                    <Inline text={f.a} />
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Sources */}
          <section className="mt-14">
            <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#5C7275]">Sources</h2>
            <ol className="space-y-2 text-[14px] leading-snug">
              {a.sources.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#8AA0A3]">{i + 1}.</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#46575A] underline decoration-[#C9DADC] underline-offset-4 hover:text-[#016271]">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {/* Disclaimer and author */}
          <div className="mt-12 rounded-2xl bg-[#FAF7F2] p-5 text-[14px] leading-relaxed text-[#5B4A2E] sm:p-6">
            <strong className="font-semibold">Please note:</strong> this article is for general information and awareness. It is not medical advice and does not replace a consultation with a qualified doctor. If you are worried about a symptom, please see a doctor.
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-[#E1ECEE] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <Image src={JOURNAL_AUTHOR.image} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-[#14302F]">{JOURNAL_AUTHOR.name}</p>
                <p className="mt-1 max-w-md text-[14px] leading-relaxed text-[#5C7275]">{JOURNAL_AUTHOR.bio}</p>
              </div>
            </div>
            <ShareButtons title={a.title} path={path} />
          </div>

          {a.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <span key={t} className="rounded-full bg-[#EEF3F3] px-3 py-1 text-[12.5px] text-[#46575A]">
                  #{t.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>

      {/* Related */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className={`${journalSerif.className} text-[28px] font-semibold text-[#14302F] sm:text-[34px]`}>
            Keep reading
          </h2>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#016271] hover:gap-2.5">
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/blog/${r.slug}`} className="group overflow-hidden rounded-3xl border border-[#E1ECEE] bg-white transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(7,89,101,0.25)]">
              <div className="relative aspect-[1200/630] overflow-hidden">
                <Image src={coverImage(r.slug)} alt={r.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: COVER_THEMES[r.cover.theme].ink }}>
                  {r.category}
                </p>
                <p className={`${journalSerif.className} mt-2 text-[19px] font-semibold leading-snug text-[#14302F] group-hover:text-[#016271]`}>
                  {r.title}
                </p>
                <p className="mt-3 text-[13px] text-[#5C7275]">
                  {formatJournalDate(r.date)} · {readingMinutes(r)} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
