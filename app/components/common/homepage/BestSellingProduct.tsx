/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X, Plus, Check } from "lucide-react";
import BestsellingCard, {
  formatProductPrice,
  getDefaultBadge,
} from "./BestSellingCard";
import { useCatalogStore } from "@/store/catalogStore";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import {
  BTN_BASE,
  BTN_PRIMARY,
  CONTAINER,
  EYEBROW_TEAL,
  H2,
  LEAD,
  LINK_ARROW,
  SECTION_Y,
} from "./homeStyles";

type Props = {
  title?: string;
  brand?: "ovy" | "loway" | string | null;
  buttonColor?: string;
  description?: string;
};

export default function BestsellingProducts({
  title = "The ones everyone comes back for.",
  description = "Across both ranges. Between them they cover most of what a month and a journey can throw at you.",
  brand = null,
  buttonColor = "#016271",
}: Props) {
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [quickViewVariants, setQuickViewVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);
  const [modalAdding, setModalAdding] = useState(false);
  const [modalAdded, setModalAdded] = useState(false);

  const rawProducts = useCatalogStore((state) =>
    state.categories ? state.products : [],
  );

  // Live catalogue only: never a hardcoded product or price.
  const displayProducts: any[] = (
    brand ? rawProducts.filter((p) => p.brand === brand) : rawProducts
  ).slice(0, 5);

  const getProductDetails = async (product: any) => {
    if (product.productVariants?.length || product.variants?.length) {
      return product;
    }

    const response = await fetch(
      `/api/catalog/products/${encodeURIComponent(product.slug)}`,
    );
    if (!response.ok) throw new Error("Unable to load product variants");

    const payload = await response.json();
    return payload.product;
  };

  const handleAddToCart = async (product: any) => {
    const detailedProduct = await getProductDetails(product);
    const variant =
      product.selectedVariant ||
      detailedProduct.productVariants?.[0] ||
      detailedProduct.prodcutVarientBoxRes?.[0] ||
      detailedProduct.variants?.[0];

    const variants =
      detailedProduct.productVariants ||
      detailedProduct.prodcutVarientBoxRes ||
      detailedProduct.variants ||
      [];

    if (variants.length > 1) {
      setQuickViewProduct(detailedProduct);
      setQuickViewVariants(variants);
      setSelectedVariant(variant);
      return false;
    }

    return addProductVariantToCart(detailedProduct, variant);
  };

  const addProductVariantToCart = async (product: any, variant: any) => {
    const priceNum = Number(variant?.price ?? product.price ?? product.basePrice);

    return addToCart({
      productId: product.id,
      productVariantId: variant?.id,
      sku: variant?.sku,
      slug: product.slug || "",
      title: variant?.name || product.name || "Product",
      image: getImageUrl(
        product.image || product.bannerImage || "/product.png",
      ),
      price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0,
      quantity: 1,
      isQuantityChangable: true,
    });
  };

  const modalIsOutOfStock = Boolean(
    selectedVariant
      ? selectedVariant.isInStock === false ||
        selectedVariant.is_in_stock === false
      : quickViewVariants.length > 0 &&
        quickViewVariants.every(
          (v) => v.isInStock === false || v.is_in_stock === false,
        ),
  );

  const handleModalAdd = async () => {
    if (!quickViewProduct || modalAdding || modalIsOutOfStock) return;
    setModalAdding(true);
    await addProductVariantToCart(
      quickViewProduct,
      selectedVariant || quickViewVariants[0],
    );
    setModalAdding(false);
    setModalAdded(true);
    setTimeout(() => setModalAdded(false), 2000);
  };

  const openQuickView = async (product: any) => {
    setLoadingProductDetails(true);
    try {
      const detailedProduct = await getProductDetails(product);
      const variants =
        detailedProduct.productVariants ||
        detailedProduct.prodcutVarientBoxRes ||
        detailedProduct.variants ||
        [];
      setQuickViewProduct(detailedProduct);
      setQuickViewVariants(variants);
      setSelectedVariant(variants[0]);
    } catch (error) {
      console.error("Unable to load product details:", error);
      setQuickViewProduct(product);
      setQuickViewVariants([]);
      setSelectedVariant(null);
    } finally {
      setLoadingProductDetails(false);
    }
  };

  const getProductHighlights = (prod: any) => {
    if (prod?.highlights && Array.isArray(prod.highlights)) {
      return prod.highlights;
    }
    const s = String(prod?.slug || "").toLowerCase();
    if (s.includes("funnel")) {
      return [
        "Stand, go, touch nothing, clothes just moved aside",
        "Reusable with its own cotton carry pouch",
        "Safe through pregnancy: no squatting, no dirty seat",
      ];
    }
    if (s.includes("cup")) {
      return [
        "100% medical-grade silicone, latex-free and BPA-free",
        "Up to 12 hours protection between changes",
        "Reusable for years, replacing thousands of disposables",
      ];
    }
    if (s.includes("puke") || s.includes("bag")) {
      return [
        "Turns urine or vomit to gel in 60 seconds",
        "Holds up to 700ml, odour locked and leak-proof",
        "For motion sickness, pregnancy nausea and travel",
      ];
    }
    if (s.includes("seat")) {
      return [
        "Biodegradable paper seat covers for Western loos",
        "For school, office, trains, airports and travel",
        "Slips easily into any handbag or pocket",
      ];
    }
    return [
      "Organic top sheet, certified toxin-free",
      "pH-balanced and dermatologically tested",
      "Ships within 24 to 48 hours in bold, proud packaging",
    ];
  };

  return (
    <section
      id="bestsellers"
      className={`w-full scroll-mt-24 border-b border-gray-100 bg-[#FAF8F5] ${SECTION_Y}`}
    >
      <div className={CONTAINER}>
        <div className="mb-6 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <span className={EYEBROW_TEAL}>Start here</span>
            <h2 className={H2}>{title}</h2>
            <p className={`${LEAD} hidden sm:block`}>{description}</p>
          </div>
          <Link href="/shop" className={`${LINK_ARROW} shrink-0 self-start sm:self-auto`}>
            Shop all
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* 2 columns on a phone (the 5th card spans both), 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {displayProducts.map((product: any, idx: number) => (
            <BestsellingCard
              key={product.id || idx}
              product={product}
              index={idx}
              isFifthMobileCard={idx === 4}
              buttonColor={buttonColor}
              onQuickView={openQuickView}
              onAddToCart={(p) => handleAddToCart(p)}
            />
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="animate-fadeIn fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div
            className="fixed inset-0"
            onClick={() => setQuickViewProduct(null)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={quickViewProduct.name || "Quick view"}
            className="relative z-10 grid w-full max-w-2xl grid-cols-1 items-start gap-4 sm:gap-6 rounded-3xl border border-gray-100 bg-white p-4 sm:p-8 shadow-2xl sm:grid-cols-12 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto my-auto no-scrollbar sm:items-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-md transition-colors hover:bg-gray-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/11] sm:aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl bg-[#F5EEF0] sm:col-span-5">
              <Image
                unoptimized
                src={getImageUrl(
                  quickViewProduct.image ||
                    quickViewProduct.bannerImage ||
                    "/product.png",
                )}
                alt={quickViewProduct.name}
                fill
                className="h-full w-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="flex flex-col space-y-2.5 sm:space-y-3.5 text-left sm:col-span-7">
              <span className="w-fit rounded-full bg-[#016271]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#016271] sm:px-3 sm:py-1 sm:text-xs">
                {quickViewProduct.badge || getDefaultBadge(quickViewProduct)}
              </span>

              <h3 className="font-serif text-xl font-bold text-[#1F1915] sm:text-2xl leading-tight">
                {quickViewProduct.name}
              </h3>

              <p className="text-sm leading-relaxed font-normal text-[#5C524D] line-clamp-3 sm:line-clamp-none">
                {quickViewProduct.description ||
                  "Safe, organic and dermatologically tested feminine hygiene care."}
              </p>

              {/* Highlights */}
              <ul className="space-y-1 sm:space-y-1.5 border-y border-gray-100 py-2 sm:py-2.5">
                {getProductHighlights(quickViewProduct).map(
                  (item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] font-medium text-[#1F1915] sm:text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#016271]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>

              <div className="flex items-baseline gap-1 pt-0.5 sm:pt-1">
                {!selectedVariant && (
                  <span className="text-[13px] font-normal text-[#5C524D]">from</span>
                )}
                <span className="text-xl sm:text-2xl font-bold text-[#1F1915]">
                  {selectedVariant
                    ? `₹${Number(selectedVariant.price || 0)}`
                    : formatProductPrice(quickViewProduct)}
                </span>
              </div>

              {quickViewVariants.length > 1 && (
                <label className="flex flex-col gap-1 text-sm font-semibold text-[#1F1915]">
                  Choose variant
                  <select
                    value={selectedVariant?.id || ""}
                    onChange={(event) =>
                      setSelectedVariant(
                        quickViewVariants.find(
                          (variant) => variant.id === event.target.value,
                        ),
                      )
                    }
                    className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#016271] cursor-pointer"
                  >
                    {quickViewVariants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name || variant.size || "Variant"} - ₹
                        {Number(variant.price || 0)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-2 pt-1.5 sm:flex-row sm:gap-3 sm:pt-2">
                {modalIsOutOfStock ? (
                  <button
                    type="button"
                    disabled
                    className="flex min-h-12 w-full flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold bg-gray-200 text-gray-500 shadow-none sm:w-auto"
                  >
                    <span>Out of stock</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleModalAdd}
                    disabled={modalAdding}
                    className={`${
                      modalAdded ? `${BTN_BASE} bg-emerald-700 text-white` : BTN_PRIMARY
                    } w-full flex-1 sm:w-auto`}
                  >
                    {modalAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added to bag</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>
                          {loadingProductDetails ? "Loading..." : "Add to bag"}
                        </span>
                      </>
                    )}
                  </button>
                )}

                <Link
                  href={`/product-detail/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className={`${LINK_ARROW} w-full justify-center sm:w-auto`}
                >
                  View full details
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
