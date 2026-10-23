"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { journalSerif } from "@/app/components/common/journal/fonts";

type Post = {
  id: string;
  slug: string;
  title: string;
  blogCategory: string;
  metaDescription: string;
  data: string;
  image: string;
  date: string;
  readMinutes: number;
};

const ALL = "All";

function excerpt(post: Post, limit: number) {
  const text = (post.metaDescription || post.data || "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

export default function BlogListClient({
  initialBlogs,
  topics,
}: {
  initialBlogs: Post[];
  topics: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  // The chosen topic lives in the address (?topic=...), so topic links work.
  const category = topics.find((t) => t.slug === params.get("topic"))?.name || ALL;
  const [query, setQuery] = useState("");

  const chips = useMemo(() => {
    const used = new Set(initialBlogs.map((b) => b.blogCategory));
    return [ALL, ...topics.map((t) => t.name).filter((n) => used.has(n))];
  }, [initialBlogs, topics]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialBlogs.filter(
      (b) =>
        (category === ALL || b.blogCategory === category) &&
        (!q || `${b.title} ${b.metaDescription} ${b.blogCategory}`.toLowerCase().includes(q)),
    );
  }, [initialBlogs, category, query]);

  const choose = (name: string) => {
    const slug = topics.find((t) => t.name === name)?.slug;
    router.replace(slug ? `/blog?topic=${slug}#articles` : "/blog#articles", { scroll: false });
  };

  if (!initialBlogs.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-[#D6E6E8] bg-white py-20 text-center text-ink-muted">
        New articles are on their way.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Filter by topic">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => choose(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
                category === c
                  ? "border-[#075965] bg-[#075965] text-white"
                  : "border-[#D6E6E8] bg-white text-[#075965] hover:border-[#016271] hover:bg-[#E6F4F6]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search the Journal</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: dengue, rash, UTI…"
            className="h-11 w-full rounded-full border border-[#D6E6E8] bg-white pl-10 pr-10 text-[14.5px] text-ink outline-none placeholder:text-[#8AA0A3] focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted hover:bg-[#EEF3F3]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      <p className="mb-6 text-[13.5px] text-ink-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {category !== ALL && ` in ${category}`}
        {query.trim() && ` matching "${query.trim()}"`}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">No articles match that yet. Try another word or topic.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
              <div className="relative aspect-[1200/630] overflow-hidden rounded-[22px] bg-[#EEF3F3]">
                <Image
                  src={getImageUrl(post.image)}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-teal">
                {post.blogCategory}
              </p>
              <h3 className={`${journalSerif.className} mt-2 text-[21px] font-semibold leading-snug text-ink group-hover:text-[#075965]`}>
                {post.title}
              </h3>
              <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-ink-muted">{excerpt(post, 150)}</p>
              <p className="mt-4 text-[12.5px] text-ink-muted">
                {post.date}
                {post.readMinutes > 0 && ` · ${post.readMinutes} min read`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
