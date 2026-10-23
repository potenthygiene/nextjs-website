import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarHeart, CalendarDays, ShieldCheck } from "lucide-react";
import BlogListClient from "./BlogListClient";
import { getJournalPosts } from "@/helper/blog/action";
import { pageMetadata, SITE_URL } from "@/const/seo";
import { BlogListSkeleton } from "@/app/components/common/skeletons";
import { journalSerif } from "@/app/components/common/journal/fonts";
import { COVER_THEMES } from "@/const/journal";
import { HEALTH_CALENDAR, JOURNAL_TOPICS } from "@/const/journal/topics";
import { getImageUrl } from "@/lib/imageUrl";
import { Newsletter } from "@/app/components/common/homepage/NewsLetter";

export const metadata = pageMetadata("blog");

type Post = Awaited<ReturnType<typeof getJournalPosts>>[number];

function Meta({ post }: { post: Post }) {
  return (
    <p className="text-[12.5px] text-[#5C7275]">
      {post.date}
      {post.readMinutes > 0 && ` · ${post.readMinutes} min read`}
    </p>
  );
}

function jsonLd(posts: Post[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/blog#page`,
      name: "The Potent Journal",
      description:
        "Sourced guides on period care, women's health, everyday hygiene and travel hygiene from Potent Hygiene.",
      url: `${SITE_URL}/blog`,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: posts.length,
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/blog/${p.slug}`,
          name: p.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
      ],
    },
  ];
}

export default async function BlogPage() {
  const posts = await getJournalPosts();
  const [lead, ...others] = posts;
  const secondary = others.slice(0, 2);
  const alsoNew = others.slice(2, 6);
  const counts = new Map<string, number>();
  posts.forEach((p) => counts.set(p.blogCategory, (counts.get(p.blogCategory) || 0) + 1));
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#33403F]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(posts)) }} />

      {/* Masthead */}
      <section className="relative overflow-hidden bg-[#E6F4F6]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/50" aria-hidden />
        <div className="pointer-events-none absolute -bottom-52 right-40 h-[380px] w-[380px] rounded-full bg-[#CFEAEC]/70" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 md:pb-32 md:pt-16">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[13px] text-[#5C7275]">
            <Link href="/" className="hover:text-[#075965]">Home</Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-[#075965]">Journal</span>
          </nav>
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#016271]">The Potent Journal</p>
          <h1 className={`${journalSerif.className} mt-4 max-w-4xl text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] text-[#14302F] sm:text-[56px] md:text-[68px]`}>
            Honest answers on health, periods and <span className="italic text-[#016271]">hygiene.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[#46575A] sm:text-[18.5px]">
            Clear, sourced guides for Indian bodies, Indian toilets and Indian journeys. No euphemisms, no scare stories, just what you need to know.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] font-medium text-[#075965]">
            <li className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" />{posts.length} guides</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Sourced from WHO, NHS, ICMR and more</li>
            {lead && <li className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Updated {lead.date}</li>}
          </ul>
        </div>
      </section>

      {/* Lead stories */}
      {lead && (
        <section aria-label="Latest stories" className="relative mx-auto -mt-20 max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
            <Link
              href={`/blog/${lead.slug}`}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-[#E1ECEE] bg-white shadow-[0_30px_70px_-34px_rgba(7,89,101,0.45)]"
            >
              <div className="relative aspect-[1200/630] overflow-hidden">
                <Image
                  src={getImageUrl(lead.image)}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 680px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#016271]">
                  Latest · {lead.blogCategory}
                </p>
                <h2 className={`${journalSerif.className} mt-3 text-[26px] font-semibold leading-[1.15] text-[#14302F] group-hover:text-[#075965] sm:text-[32px]`}>
                  {lead.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-[15.5px] leading-relaxed text-[#46575A]">{lead.metaDescription}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                  <Meta post={lead} />
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#016271] transition-all group-hover:gap-2.5">
                    Read article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <div className="grid gap-5">
              {secondary.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group grid grid-cols-[120px_1fr] overflow-hidden rounded-[24px] border border-[#E1ECEE] bg-white transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(7,89,101,0.35)] sm:grid-cols-[170px_1fr]"
                >
                  <div className="relative min-h-[150px]">
                    <Image src={getImageUrl(p.image)} alt="" fill sizes="170px" className="object-cover object-[84%_50%]" />
                  </div>
                  <div className="flex flex-col justify-center p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#016271]">{p.blogCategory}</p>
                    <h3 className={`${journalSerif.className} mt-1.5 line-clamp-3 text-[17px] font-semibold leading-snug text-[#14302F] group-hover:text-[#075965] sm:text-[19px]`}>
                      {p.title}
                    </h3>
                    <div className="mt-2"><Meta post={p} /></div>
                  </div>
                </Link>
              ))}

              {alsoNew.length > 0 && (
                <div className="rounded-[24px] border border-[#E1ECEE] bg-white p-5">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5C7275]">Also new</p>
                  <ol className="divide-y divide-[#EEF3F3]">
                    {alsoNew.map((p, i) => (
                      <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`} className="group flex items-start gap-3 py-2.5">
                          <span className={`${journalSerif.className} w-5 shrink-0 text-[18px] font-semibold text-[#9FD3D6]`}>{i + 1}</span>
                          <span className="text-[14.5px] font-medium leading-snug text-[#14302F] group-hover:text-[#016271]">{p.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Topics */}
      <section aria-labelledby="topics-heading" className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 id="topics-heading" className={`${journalSerif.className} text-[28px] font-semibold text-[#14302F] sm:text-[34px]`}>
            Explore by topic
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {JOURNAL_TOPICS.map((t) => {
            const theme = COVER_THEMES[t.theme];
            const n = counts.get(t.name) || 0;
            return (
              <Link
                key={t.slug}
                href={`/blog?topic=${t.slug}#articles`}
                scroll={false}
                className="group relative overflow-hidden rounded-[22px] p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
                style={{ backgroundColor: theme.soft }}
              >
                <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-60 transition-transform group-hover:scale-125" style={{ backgroundColor: theme.accent }} aria-hidden />
                <p className={`${journalSerif.className} relative text-[19px] font-semibold leading-tight sm:text-[22px]`} style={{ color: theme.ink }}>
                  {t.name}
                </p>
                <p className="relative mt-1.5 text-[13.5px] leading-snug text-[#46575A] sm:text-[14.5px]">{t.blurb}</p>
                <p className="relative mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: theme.ink }}>
                  {n} {n === 1 ? "guide" : "guides"} <ArrowUpRight className="h-3.5 w-3.5" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Health calendar */}
      <section aria-labelledby="calendar-heading" className="mt-20 bg-[#075965] py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-7 flex items-center gap-3">
            <CalendarHeart className="h-6 w-6 text-[#9FE0DD]" />
            <h2 id="calendar-heading" className={`${journalSerif.className} text-[26px] font-semibold sm:text-[32px]`}>
              On the health calendar
            </h2>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {HEALTH_CALENDAR.filter((c) => bySlug.has(c.slug)).map((c) => (
              <Link
                key={c.name}
                href={`/blog/${c.slug}`}
                className="group w-[230px] shrink-0 snap-start rounded-[20px] border border-white/15 bg-white/[0.07] p-5 transition-colors hover:bg-white/[0.13]"
              >
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#9FE0DD]">{c.when}</p>
                <p className={`${journalSerif.className} mt-2 text-[19px] font-semibold leading-snug`}>{c.name}</p>
                <p className="mt-3 line-clamp-2 text-[13px] leading-snug text-white/75">{bySlug.get(c.slug)?.title}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-white">
                  Read the guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All articles */}
      <section id="articles" aria-labelledby="all-heading" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
        <h2 id="all-heading" className={`${journalSerif.className} mb-8 text-[28px] font-semibold text-[#14302F] sm:text-[34px]`}>
          All articles
        </h2>
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogListClient initialBlogs={posts} topics={JOURNAL_TOPICS.map((t) => ({ name: t.name, slug: t.slug }))} />
        </Suspense>
      </section>

      {/* Tools */}
      <section className="mx-auto mb-20 grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-2">
        <Link href="/period-log" className="group flex items-center justify-between gap-6 rounded-[24px] bg-[#FBF1FB] p-6 sm:p-8">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#7E4D77]">Free tool</p>
            <p className={`${journalSerif.className} mt-2 text-[24px] font-semibold leading-tight text-[#3E2440]`}>Period tracker and calculator</p>
            <p className="mt-2 text-[14.5px] text-[#5E4A5C]">See your next periods in seconds. No sign-up needed.</p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0 text-[#7E4D77] transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/faq" className="group flex items-center justify-between gap-6 rounded-[24px] bg-[#EEF5EF] p-6 sm:p-8">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-[#0E5C3A]">Quick answers</p>
            <p className={`${journalSerif.className} mt-2 text-[24px] font-semibold leading-tight text-[#163826]`}>Orders, delivery and subscriptions</p>
            <p className="mt-2 text-[14.5px] text-[#41584A]">Everything about buying from Potent, in one place.</p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0 text-[#0E5C3A] transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      <Newsletter
        title="The Journal, in your inbox."
        subtitle="One useful health and hygiene guide at a time, plus first looks at new Ovy and Looway launches."
      />
    </div>
  );
}
