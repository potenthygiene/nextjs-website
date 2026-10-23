"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Check } from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { toast } from "sonner";
import {
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantLabel,
  getOvyVariantPrice,
  getOvyVariants,
  type OvyVariant,
} from "./brands/ovyProductPricing";
import {
  BTN_BASE,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CONTAINER,
  EYEBROW_TEAL,
  H2,
  LEAD,
  SECTION_Y,
} from "./homeStyles";

interface CupProduct {
  id?: string;
  _id?: string;
  slug?: string | null;
  name?: string | null;
  bannerImage?: string | null;
  [key: string]: unknown;
}

type Props = {
  badgeText?: string;
  title?: string;
  highlight?: string;
  paragraphs?: string[];
  image?: string;
  primaryColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  bgAccent?: string;
  tickerColor?: string;
  tickerText?: string;
};

export function OurStory(_props: Props) {
  void _props;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cupProduct, setCupProduct] = useState<CupProduct | null>(null);
  const [cupLoadFailed, setCupLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/catalog/products/ovy-cup")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load cup details");
        return response.json();
      })
      .then((payload) => {
        if (!cancelled) setCupProduct(payload.product || null);
      })
      .catch((error) => {
        console.error("Unable to load cup details:", error);
        if (!cancelled) setCupLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cupVariant = getOvyVariants(cupProduct)[0] as OvyVariant | undefined;
  const cupPrice = getOvyVariantPrice(cupVariant);
  const cupProductId = getOvyProductId(cupProduct);
  const cupVariantId = getOvyVariantId(cupVariant);
  const cupImage = getImageUrl(
    cupVariant?.bannerImage ||
      cupVariant?.image ||
      cupProduct?.bannerImage ||
      "/product-images/cup-rbw.jpg",
  );
  const canAddToCart = Boolean(cupProductId && cupVariantId && cupPrice > 0);

  const handleAddToCart = async () => {
    if (adding || !canAddToCart) {
      if (!canAddToCart) toast.error("Cup product details are unavailable.");
      return;
    }

    setAdding(true);

    try {
      const result = await addToCart({
        productId: cupProductId,
        productVariantId: cupVariantId,
        sku: cupVariant?.sku,
        slug: cupProduct?.slug || "ovy-cup",
        title: `${cupProduct?.name || "Ovy Menstrual Cup"} - ${getOvyVariantLabel(cupVariant)}`,
        image: cupImage,
        price: cupPrice,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (result === false) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Cup cart add error:", error);
      toast.error("Unable to add the cup to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className={`w-full overflow-hidden bg-white ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT IMAGE CONTAINER */}
          <div className="flex justify-center lg:col-span-5">
            <div className="group relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-3xl border border-gray-100/80 shadow-xl sm:aspect-square sm:rounded-[2.5rem] lg:max-w-lg">
              <Image
                src={cupImage}
                alt="Ovy Menstrual Cup"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col text-left lg:col-span-7">
            <span className={`${EYEBROW_TEAL} mb-2 sm:mb-3`}>
              Ovy menstrual cup
            </span>

            <h2 className={`${H2} mb-3 sm:mb-4`}>
              <span className="block">One cup.</span>
              <span className="mt-1 block text-[#016271]">
                Years of freedom.
              </span>
            </h2>

            <p className={`${LEAD} mb-5 max-w-xl sm:mb-6`}>
              Up to 12 hours between changes, even overnight. 100% medical-grade
              silicone, latex-free and BPA-free. The product page has a
              30-second size finder and a 20-second cervix check, so you get the
              size right first time.
            </p>

            {/* 3 Metric Cards (3 Columns on Mobile & Desktop) */}
            <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3.5">
              <div className="flex flex-col justify-start rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-3 sm:p-4">
                <span className="mb-0.5 block font-serif text-base font-bold text-[#016271] sm:text-xl">
                  12 hrs
                </span>
                <span className="text-xs leading-snug text-[#5C524D] sm:text-sm">
                  between changes, even overnight
                </span>
              </div>

              <div className="flex flex-col justify-start rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-3 sm:p-4">
                <span className="mb-0.5 block font-serif text-base font-bold text-[#016271] sm:text-xl">
                  Years
                </span>
                <span className="text-xs leading-snug text-[#5C524D] sm:text-sm">
                  of use from one cup, replacing thousands of disposables
                </span>
              </div>

              <div className="flex flex-col justify-start rounded-2xl border border-[#BDE3EA] bg-[#E6F4F6] p-3 sm:p-4">
                <span className="mb-0.5 block font-serif text-base font-bold text-[#016271] sm:text-xl">
                  3 sizes
                </span>
                <span className="text-xs leading-snug text-[#5C524D] sm:text-sm">
                  Teen XS, Medium and Large, in four colours
                </span>
              </div>
            </div>

            {/* One primary (add to bag), one secondary (size finder) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {cupLoadFailed ? (
                // Live price did not load: send her to the product page instead.
                <Link href="/product-detail/ovy-cup" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
                  Shop the cup <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding || !canAddToCart}
                  className={`${
                    added
                      ? `${BTN_BASE} bg-emerald-700 text-white`
                      : canAddToCart
                        ? BTN_PRIMARY
                        : `${BTN_BASE} bg-gray-200 text-ink-muted`
                  } w-full sm:w-auto`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden />
                      <span>Added to bag</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" aria-hidden />
                      <span>
                        {cupPrice > 0 ? `Add to bag, ₹${cupPrice}` : "Loading price"}
                      </span>
                    </>
                  )}
                </button>
              )}

              <Link
                href="/product-detail/ovy-cup?scroll=size-finder#size-finder"
                className={`${BTN_SECONDARY} w-full sm:w-auto`}
              >
                Find my size
              </Link>
            </div>

            <p className="mt-3 text-[13px] text-[#5C524D]">
              {cupVariant ? `Adds ${getOvyVariantLabel(cupVariant)}. ` : ""}
              <Link
                href="/product-detail/ovy-cup"
                className="inline-flex items-center gap-1 py-2 font-semibold text-[#016271] underline-offset-4 hover:underline"
              >
                See every size and colour
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
