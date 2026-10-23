import BlogListClient from "./BlogListClient";
import { getJournalPosts } from "@/helper/blog/action";
import { pageMetadata } from "@/const/seo";
import { Suspense } from "react";
import { BlogListSkeleton } from "@/app/components/common/skeletons";
import { journalSerif } from "@/app/components/common/journal/fonts";

export const metadata = pageMetadata("blog");

export default async function BlogPage() {
  const posts = await getJournalPosts();

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <section className="bg-[#E6F4F6]">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 md:pb-20 md:pt-20">
          <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#016271]">
            The Potent Journal
          </p>
          <h1 className={`${journalSerif.className} mt-4 max-w-3xl text-[38px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#14302F] sm:text-[52px] md:text-[60px]`}>
            Honest answers on health, periods and hygiene.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#46575A] sm:text-[18px]">
            Clear, sourced guides for Indian bodies, Indian toilets and Indian journeys. No euphemisms, no scare stories, just what you need to know.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogListClient initialBlogs={posts} />
        </Suspense>
      </main>
    </div>
  );
}
