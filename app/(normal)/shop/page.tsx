import React, { Suspense } from "react";
import { pageMetadata } from "@/const/seo";

export const metadata = pageMetadata("shop");
import FilterBar from "../../components/common/category/filterTopBar";
import FiltersSidebar from "../../components/common/category/filterSideBar";
import CategoryProducts from "../../components/common/category/categoryProducts";
import { ShopSkeleton } from "@/app/components/common/skeletons";
import { OffersBand } from "@/app/components/common/offers/Offers";

const Page = () => {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <div className="bg-[#FAF8F5] min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <FilterBar />
          <OffersBand title="Save more today" className="!px-0 !py-4" />
          <div className="mt-6 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            <FiltersSidebar />
            <CategoryProducts />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
