"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
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
  fromCode: boolean;
};

const ALL = "All articles";

function excerpt(post: Post, limit: number) {
  const text = (post.metaDescription || post.data || "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="text-[12.5px] text-[#5C7275]">
      {post.date}
      {post.readMinutes > 0 && ` · ${post.readMinutes} min read`}
    </p>
  );
}

function Cover({ post, sizes, priority }: { post: Post; sizes: string; priority?: boolean }) {
  return (
    <Image
      src={getImageUrl(post.image)}
      alt={post.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

export default function BlogListClient({ initialBlogs }: { initialBlogs: Post[] }) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    initialBlogs.forEach((b) => b.blogCategory && seen.add(b.blogCategory));
    return [ALL, ...seen];
  }, [initialBlogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialBlogs.filter(
      (b) =>
        (category === ALL || b.blogCategory === category) &&
        (!q || `${b.title} ${b.metaDescription} ${b.blogCategory}`.toLowerCase().includes(q)),
    );
  }, [initialBlogs, category, query]);

  if (!initialBlogs.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-[#D6E6E8] bg-white py-20 text-center text-[#5C7275]">
        New articles are on their way.
      </div>
    );
  }

  const showFeatured = category === ALL && !query.trim();
  const [featured, ...rest] = filtered;
  const grid = showFeatured ? rest : filtered;

  return (
    <div>
      {/* Filters */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C7275]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            className="h-11 w-full rounded-full border border-[#D6E6E8] bg-white pl-10 pr-4 text-[14.5px] text-[#14302F] outline-none placeholder:text-[#8AA0A3] focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/15"
          />
        </label>
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-[#5C7275]">No articles match that yet. Try another word.</p>
      )}

      {/* Featured */}
      {showFeatured && featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-12 grid overflow-hidden rounded-[28px] border border-[#E1ECEE] bg-white transition-shadow hover:shadow-[0_24px_60px_-24px_rgba(7,89,101,0.35)] md:grid-cols-[1.35fr_1fr]"
        >
          <div className="relative aspect-[1200/630] overflow-hidden md:aspect-auto md:min-h-[360px]">
            <Cover post={featured} sizes="(min-width: 768px) 60vw, 100vw" priority />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#016271]">
              Latest · {featured.blogCategory}
            </p>
            <h2 className={`${journalSerif.className} mt-3 text-[28px] font-semibold leading-[1.15] text-[#14302F] group-hover:text-[#075965] sm:text-[34px]`}>
              {featured.title}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#46575A]">{excerpt(featured, 190)}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <Meta post={featured} />
              <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#016271] transition-all group-hover:gap-2.5">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {grid.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
            <div className="relative aspect-[1200/630] overflow-hidden rounded-3xl bg-[#EEF3F3]">
              <Cover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </div>
            <p className="mt-5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#016271]">
              {post.blogCategory}
            </p>
            <h3 className={`${journalSerif.className} mt-2 text-[21px] font-semibold leading-snug text-[#14302F] group-hover:text-[#075965]`}>
              {post.title}
            </h3>
            <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-[#46575A]">{excerpt(post, 150)}</p>
            <div className="mt-4">
              <Meta post={post} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
