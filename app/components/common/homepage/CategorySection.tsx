"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { CONTAINER, EYEBROW_TEAL, H2, LEAD, SECTION_Y } from "./homeStyles";
import { useCatalogStore } from "@/store/catalogStore";

const MOMENTS = [
  {
    label: "Her first period",
    body: "A kit that explains itself, with a wrapper that stays silent at school.",
    href: "/product-detail/ovy-teen",
    image: "/product-images/teen.jpg",
  },
  {
    label: "Heavy nights",
    body: "A 320mm pad with a widened back, because night leaks travel backwards.",
    href: "/product-detail/ovy-pads?size=xlplus#xlplus",
    image: "/product-images/pads-xlplus.jpg",
  },
  {
    label: "The seven-hour train",
    body: "Stand, go, touch nothing. The funnel that ends the dirty-toilet dread.",
    href: "/product-detail/looway-pee-funnel",
    image: "/product-images/funnel.jpg",
  },
  {
    label: "Car sick. Morning sick.",
    body: "A sealable bag for motion sickness on the road and nausea in pregnancy. Open, seal, bin.",
    href: "/product-detail/looway-pee-puke",
    image: "/looway/scen-bags-preg.jpg",
  },
  {
    label: "A yatra or road trip",
    body: "Every toilet a journey throws at you, or none at all, covered in one box.",
    href: "/looway-yatra-kit",
    image: "/looway/yatra.jpg",
  },
  {
    label: "Travelling light",
    body: "One cup, up to 12 hours, nothing to carry and nothing to throw away.",
    href: "/product-detail/ovy-cup",
    image: "/product-images/cup.jpg",
  },
];

type Props = {
  title?: string;
  description?: string;
};

export function CategoryGrid({
  title = "Tell us the moment. We will do the rest.",
  description = "Browse by what you need it for, or by what it is.",
}: Props) {
  const [activeTab, setActiveTab] = useState<"moment" | "category">("moment");
  const allCategories = useCatalogStore((state) => state.categories);

  return (
    <section
      className={`w-full scroll-mt-24 border-b border-gray-100 bg-white ${SECTION_Y}`}
      id="shop-by"
    >
      <div className={CONTAINER}>
        {/* Section Header */}
        <div className="mb-6 space-y-2 text-center sm:mb-10 sm:space-y-3">
          <span className={EYEBROW_TEAL}>Find yours</span>
          <h2 className={H2}>{title}</h2>
          <p className={`${LEAD} mx-auto max-w-xl`}>
            {description}
          </p>
        </div>

        {/* Tab Toggle Bar */}
        <div className="mb-6 flex justify-center sm:mb-10">
          <div
            role="tablist"
            aria-label="Browse by"
            className="inline-flex items-center gap-1 rounded-full border border-gray-200/80 bg-[#FAF7F2] p-1 shadow-2xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "moment"}
              onClick={() => setActiveTab("moment")}
              className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-semibold transition-colors duration-300 ${
                activeTab === "moment"
                  ? "bg-[#016271] text-white shadow-xs"
                  : "text-[#5C524D] hover:text-[#1F1915]"
              }`}
            >
              Shop by moment
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "category"}
              onClick={() => setActiveTab("category")}
              className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-semibold transition-colors duration-300 ${
                activeTab === "category"
                  ? "bg-[#016271] text-white shadow-xs"
                  : "text-[#5C524D] hover:text-[#1F1915]"
              }`}
            >
              Shop by category
            </button>
          </div>
        </div>

        {/* Tab Panel 1: Shop by Moment */}
        {activeTab === "moment" && (
          <div className="animate-fadeIn grid grid-cols-3 gap-2.5 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {MOMENTS.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                className="group border-gray-150 flex flex-col items-center justify-between rounded-2xl border bg-white p-2 text-center transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg sm:flex-row sm:gap-4 sm:p-4 sm:text-left"
              >
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-[#E6F4F6] sm:aspect-none sm:h-24 sm:w-20 lg:h-26 lg:w-22">
                  <Image
                    src={m.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 33vw, 100px"
                  />
                </div>
                <div className="mt-2 flex w-full min-w-0 flex-col justify-center text-center sm:mt-0 sm:pr-1 sm:text-left">
                  <h3 className="font-serif text-[13px] font-bold leading-tight text-[#1F1915] transition-colors group-hover:text-[#016271] sm:mb-1 sm:text-base md:text-lg">
                    {m.label}
                  </h3>
                  <p className="hidden text-sm leading-snug text-[#5C524D] sm:line-clamp-3">
                    {m.body}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab Panel 2: Shop by Category */}
        {activeTab === "category" && (
          <div className="animate-fadeIn mx-auto grid max-w-5xl grid-cols-3 gap-2 sm:gap-6 justify-center">
            {allCategories
              .filter((category) => {
                const name = (category.name || "").toLowerCase();
                const slug = (category.slug || "").toLowerCase();
                return !name.includes("panties") && !slug.includes("panties") && !name.includes("pantey");
              })
              .map((category) => {
                let displayName = category.name || "Category";
                let targetHref = category.redirectSlug || "/shop";

                const lowerName = displayName.toLowerCase();
                if (lowerName.includes("teen")) {
                  displayName = "Teen Periods";
                  targetHref = "/product-detail/ovy-teen";
                } else if (lowerName.includes("menstrual hygiene") || lowerName.includes("hygiene")) {
                  targetHref = "/ovy#products";
                }

                return (
                  <Link
                    key={category.id}
                    href={targetHref}
                    className="group border-gray-150 flex flex-col justify-between overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F5EEF0]">
                      <Image
                        src={getImageUrl(
                          category.bannerImage || "/placeholder.jpg",
                        )}
                        alt={displayName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 50vw, 300px"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 p-2 sm:p-3.5 md:p-4">
                      <h3 className="truncate pr-1 text-[13px] font-semibold leading-tight text-[#1F1915] capitalize transition-colors group-hover:text-[#016271] sm:text-sm md:text-base">
                        {displayName}
                      </h3>
                      <ArrowRight className="h-3 w-3 shrink-0 transform text-[#016271] transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>

    </section>
  );
}
