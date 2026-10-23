/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useMemo } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { WriteReviewModal } from "../dashboard-review/WriteReviewModal";
import ProductReviews from "./productreview";
import { lowayProductDetailsPage } from "@/const/globalconst";
import { getReviewRating, getReviewStats, reviewCountLabel } from "@/lib/reviewStats";

// Only real, admin-approved reviews from the database are shown here.
// Never add hardcoded reviews, ratings, counts or star breakdowns.
const FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "s5", label: "5★" },
  { id: "s4", label: "4★" },
];

export default function LoowayReviewsSection({
  submittedReviews,
  product,
}: {
  submittedReviews?: any[];
  product?: any;
}) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => getReviewStats(submittedReviews), [submittedReviews]);

  const combinedReviews = useMemo(
    () =>
      (submittedReviews || [])
        .filter((r: any) => getReviewRating(r) !== null)
        .map((r: any) => ({
          id: `db-${r.id}`,
          name: r.name || "Customer",
          city: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "",
          stage: "Customer review",
          stars: getReviewRating(r) as number,
          quote: r.message || "",
          media: r.media || [],
        })),
    [submittedReviews],
  );

  const filteredReviews = combinedReviews.filter((rev: any) => {
    if (activeFilter === "all") return true;
    const m = /^s([1-5])$/.exec(activeFilter);
    return m ? rev.stars === Number(m[1]) : true;
  });

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section id="reviews" className="w-full bg-[#FBF8F1] scroll-mt-32 sm:scroll-mt-36 py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <span className="text-[10.5px] sm:text-xs font-extrabold tracking-widest text-[#0E5C3A] uppercase block mb-1.5 sm:mb-2">
            WHAT TRAVELLERS SAY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0A4A2E] leading-tight">
            Loved on every journey
          </h2>
        </div>

        {stats.count === 0 ? (
          <p className="text-sm font-medium opacity-70">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
        <>
        {/* Rating Breakdown Top Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-[#FAF6F0] p-4 sm:p-8 md:p-10 shadow-2xs mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center">
            {/* Left Score Summary */}
            <div className="md:col-span-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#E4DED0]/70 pb-4 md:pb-0 md:pr-8">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-6xl font-extrabold text-[#0A4A2E]">
                    {stats.averageLabel}
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-[#17271E]/50">
                    / 5
                  </span>
                </div>

                <div className="flex flex-col items-end md:items-start">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-[#D99B00] my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.round(stats.average) ? "fill-[#D99B00]" : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-[11px] sm:text-xs font-semibold text-[#17271E]/70">
                    Based on <strong className="text-[#0A4A2E]">{reviewCountLabel(stats.count)}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0E5C3A]">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0E5C3A]" />
                <span>Every review is checked before it goes live</span>
              </div>

              {/* Write a review button hidden on PDP as requested */}
              {/* <div className="mt-3.5">
                <WriteReviewModal
                  product={{ name: "Looway Toilet Seat Covers", slug: "looway-toilet-seat-covers" }}
                  btnClassName="px-4 py-2 text-xs font-bold rounded-full bg-[#0A4A2E] text-white hover:bg-[#06331F] transition cursor-pointer inline-flex items-center gap-1.5"
                />
              </div> */}
            </div>

            {/* Right Rating Breakdown Bars */}
            <div className="md:col-span-7">
              <div className="text-[11px] sm:text-xs font-bold text-[#0A4A2E] mb-2.5 sm:mb-3">
                Rating breakdown <span className="font-normal text-[#17271E]/60">• tap a row to filter</span>
              </div>


              <div className="space-y-2 text-xs font-semibold">
                {stats.breakdown.map((row) => (
                  <button
                    key={row.stars}
                    onClick={() => setActiveFilter(`s${row.stars}`)}
                    className="flex w-full items-center gap-3 group text-left rounded-lg p-1 transition-colors hover:bg-white/60"
                  >
                    <span className="w-6 font-bold text-[#0A4A2E] shrink-0">
                      {row.stars} ★
                    </span>
                    <div className="h-3 flex-1 rounded-full bg-[#EAE5D9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#D99B00] transition-all duration-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[#17271E]/70 font-bold shrink-0">
                      {row.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all whitespace-nowrap ${
                activeFilter === f.id
                  ? "bg-[#0E5C3A] text-white shadow-2xs"
                  : "bg-white text-[#17271E]/80 border border-[#E4DED0] hover:border-[#0E5C3A]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Carousel Slider */}
        <div className="relative">
          {/* Scroll Nav Arrow Left */}
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 -left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E5C3A] shadow-md border border-[#E4DED0] hover:scale-105 transition-all"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Scroll Nav Arrow Right */}
          <button
            onClick={scrollRight}
            className="absolute top-1/2 -right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E5C3A] shadow-md border border-[#E4DED0] hover:scale-105 transition-all"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-1 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="w-[78vw] max-w-[285px] sm:w-[350px] shrink-0 snap-start rounded-2xl border border-[#E4DED0] bg-white p-4 sm:p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center text-[#D99B00] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rev.stars
                            ? "fill-[#D99B00] text-[#D99B00]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#17271E] leading-relaxed font-medium">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                {/* Footer User Info */}
                <div className="mt-5 border-t border-[#E4DED0]/60 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F0E8] font-bold text-[#0A4A2E] text-sm">
                      {rev.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-[#0A4A2E] truncate">
                        {rev.name}
                      </div>
                      <div className="text-[11px] text-[#17271E]/60 font-medium">
                        {rev.city}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#E4F0E8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#0E5C3A]">
                      {rev.stage}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <Check className="h-3 w-3 stroke-[3]" /> Checked review
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        </>
        )}

        {/* Customer Reviews from DB */}
        {submittedReviews && submittedReviews.length > 0 && (
          <div className="mt-12 border-t border-[#E4DED0] pt-8">
            <ProductReviews
              reviews={submittedReviews}
              product={product}
              themeColor={lowayProductDetailsPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
