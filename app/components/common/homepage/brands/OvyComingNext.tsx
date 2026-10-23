import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

// Period panties are live and buyable. This band shows the product's real
// state from the database (isInStock from getFullProductDetails) and links
// to the product page. There is no "notify me" form: it saved nothing.
export function OvyComingNext({ product }: { product?: { isInStock?: boolean } | null }) {
  // If the lookup failed, assume the usual state (on sale) rather than
  // telling shoppers it is out of stock.
  const inStock = product?.isInStock !== false;

  return (
    <section className="hidden md:block w-full bg-[#e1d5e8] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Period Panty Cover Image */}
          <div className="lg:col-span-5 flex justify-center">
            <Link href="/product-detail/ovy-panty" className="relative w-full max-w-md aspect-square transform -rotate-1.5 transition-transform hover:scale-[1.02] block">
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-xl border border-purple-200/60 bg-white">
                <Image
                  src="/ovy/panty-box.jpg"
                  alt="Super Slim Period Panties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right Column: Title, Subtitle, Checkmarks & Product Notify Box */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            
            {/* Kicker & Title */}
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-1.5">
                {inStock ? "NEW FROM OVY" : "BACK SOON"}
              </span>
              <Link href="/product-detail/ovy-panty">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1915] hover:text-[#602E55] transition-colors leading-tight">
                  Super Slim Period Panties.
                </h2>
              </Link>
              <p className="mt-3 text-xs sm:text-sm text-[#5C524D] leading-relaxed font-normal max-w-2xl">
                Worn like underwear, so nothing shifts. 360° coverage with a leak-proof back for 10 to 12 hours, and super-thin under leggings, jeans or a saree. Two sizes, M-XL and XXL-XXXL.
              </p>
            </div>

            {/* Checkmarks List */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#1F1915] max-w-xl">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Holds as much as 5 regular pads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Tear-away sides, its own wrapper to bin it in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#8C4F7C] shrink-0 stroke-[2.5]" />
                <span>Single-use, nothing to wash or soak</span>
              </div>
            </div>

            {/* Product link: real state */}
            <div className="pt-2 max-w-md">
              <Link
                href="/product-detail/ovy-panty"
                className="bg-[#8C4F7C] hover:bg-[#763f69] text-white rounded-full px-7 py-3 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{inStock ? "Shop period panties" : "See period panties"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

