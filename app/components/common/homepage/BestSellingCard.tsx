/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Plus, Check, Heart, ChevronDown } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { useWishlistStore } from "@/store/WishlistStore";
import {
  addToWishlist as addWishlistDB,
  removeFromWishlist as removeWishlistDB,
} from "@/store/WishlistActions";
import { useEffect, useState } from "react";
import { OfferTag } from "@/app/components/common/offers/Offers";

type Props = {
  product: any;
  buttonColor?: string;
  index?: number;
  brand?: boolean | string;
  onQuickView?: (product: any) => void;
  onAddToCart?: (product: any) => Promise<boolean | void> | boolean | void;
  isFifthMobileCard?: boolean;
  /** Square photo on desktop instead of 4:5, for the homepage. */
  compact?: boolean;
};

const CARD_TINTS = [
  "bg-[#F5EEF0]",
  "bg-[#E6F4F6]",
  "bg-[#FAF7F2]",
  "bg-[#E6F4F6]",
  "bg-[#F5EEF0]",
];

export const getProductNumericPrice = (product: any): number => {
  if (!product) return 0;

  const priceVal =
    product.price ??
    product.basePrice ??
    product.productVariants?.[0]?.price ??
    product.prodcutVarientBoxRes?.[0]?.price ??
    product.variants?.[0]?.price ??
    product.startingPrice;

  if (priceVal !== null && priceVal !== undefined && priceVal !== "") {
    const num =
      typeof priceVal === "number"
        ? priceVal
        : Number(String(priceVal).replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && num > 0) {
      return num;
    }
  }

  // No guessed prices: if the catalogue has none, the card says so.
  return 0;
};

export const formatProductPrice = (product: any): string => {
  const num = getProductNumericPrice(product);
  return num > 0 ? `₹${num}` : "See price";
};

const getCompactVariantLabel = (variant: any) => {
  const label = String(variant?.size || variant?.name || "Variant").trim();
  const compactLabel = label
    .replace(/^Pack of\s+/i, "Pack ")
    .replace(/\s+Pack$/i, "")
    .replace(/First Period Box/i, "First Box")
    .replace(/\s+/g, " ");

  return compactLabel.length > 16
    ? `${compactLabel.slice(0, 16).trim()}...`
    : compactLabel;
};

// Badge shown when a product has none of its own, chosen from what the
// product is (not its position in the grid).
export const getDefaultBadge = (product: any): string => {
  const s = String(product?.slug || product?.name || "").toLowerCase();
  if (s.includes("cup") || s.includes("funnel")) return "Reusable";
  if (s.includes("teen")) return "For first periods";
  if (s.includes("liner")) return "Daily Care";
  if (s.includes("pant")) return "Super slim";
  if (s.includes("seat")) return "Public toilets";
  if (s.includes("bag") || s.includes("puke")) return "Travel essential";
  return "Bestseller";
};

export default function BestsellingCard({
  product,
  index = 0,
  onQuickView,
  onAddToCart,
  isFifthMobileCard = false,
  compact = false,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadVariants = async () => {
      if (!product?.slug) return;
      try {
        const response = await fetch(
          `/api/catalog/products/${encodeURIComponent(product.slug)}`,
        );
        if (!response.ok) return;
        const payload = await response.json();
        const productVariants =
          payload.product?.productVariants ||
          payload.product?.prodcutVarientBoxRes ||
          payload.product?.variants ||
          [];
        if (!cancelled) {
          setVariants(productVariants);
          setSelectedVariant(productVariants[0] || null);
        }
      } catch (error) {
        console.error("Unable to load card variants:", error);
      }
    };

    loadVariants();
    return () => {
      cancelled = true;
    };
  }, [product?.slug]);

  // Wishlist store integration
  const wishlistItems = useWishlistStore((state) => state.items);
  const prodId = product.id || product._id || product.slug;
  const isWishlisted = wishlistItems.some(
    (i) =>
      i.productId === prodId ||
      i.productId === product.id ||
      i.productId === product.slug ||
      i.slug === product.slug,
  );

  const selectedVariantPrice = Number(selectedVariant?.price || 0);
  const formattedPrice = selectedVariantPrice > 0
    ? `₹${selectedVariantPrice}`
    : formatProductPrice(product);
  const priceNum = getProductNumericPrice(product);

  // Select background tint based on index
  const bgTint = CARD_TINTS[index % CARD_TINTS.length];

  // Badge label fallback
  const badgeLabel = product.badge || getDefaultBadge(product);

  const isOutOfStock = Boolean(
    selectedVariant
      ? selectedVariant.isInStock === false ||
        selectedVariant.is_in_stock === false
      : variants.length > 0
        ? variants.every(
            (v) => v.isInStock === false || v.is_in_stock === false,
          )
        : product.isInStock === false || product.is_in_stock === false,
  );

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isOutOfStock) return;
    setIsAdding(true);
    const addedToCart = onAddToCart
      ? await onAddToCart({ ...product, selectedVariant })
      : true;
    setIsAdding(false);
    if (addedToCart === false) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      await removeWishlistDB(prodId);
    } else {
      let productWithVariants = { ...product, variants, selectedVariant };
      if ((!variants || variants.length === 0) && product?.slug) {
        try {
          const response = await fetch(
            `/api/catalog/products/${encodeURIComponent(product.slug)}`,
          );
          if (response.ok) {
            const payload = await response.json();
            if (payload.product) {
              const loadedVars =
                payload.product.productVariants ||
                payload.product.prodcutVarientBoxRes ||
                payload.product.variants ||
                [];
              productWithVariants = {
                ...product,
                ...payload.product,
                variants: loadedVars,
                selectedVariant: selectedVariant || loadedVars[0],
              };
            }
          }
        } catch (err) {
          console.error("Failed to load catalog variants for wishlist card:", err);
        }
      }

      await addWishlistDB({
        ...productWithVariants,
        productId: prodId,
        name: productWithVariants.name || product.name,
        price: selectedVariant?.price || priceNum,
        image: selectedVariant?.image || selectedVariant?.bannerImage || productWithVariants.image || productWithVariants.bannerImage || "/product.png",
        hasVarientBox: Boolean(productWithVariants.hasVarientBox),
        slug: productWithVariants.slug || product.slug,
        selectedVariant: selectedVariant || productWithVariants.selectedVariant || productWithVariants.variants?.[0],
        variants: productWithVariants.variants || productWithVariants.productVariants || productWithVariants.prodcutVarientBoxRes,
      });
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className={`group border-gray-150 relative flex h-full w-full justify-between overflow-hidden rounded-2xl border bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isFifthMobileCard
          ? "col-span-2 sm:col-span-1 flex-row sm:flex-col"
          : "col-span-1 flex-col"
      }`}
    >
      {/* Media Image Container */}
      <div
        className={`relative overflow-hidden ${bgTint} ${
          isFifthMobileCard
            ? `w-[42%] sm:w-full aspect-square sm:aspect-[4/5] shrink-0 ${compact ? "lg:aspect-square" : ""}`
            : `aspect-[4/5] w-full ${compact ? "lg:aspect-square" : ""}`
        }`}
      >
        {/* Badge */}
        {badgeLabel && (
          <div className="absolute top-2 left-2 z-20 sm:top-3 sm:left-3">
            <span className="rounded-full border border-white/60 bg-white/95 px-2 py-0.5 text-[12px] font-bold text-[#016271] shadow-md backdrop-blur-md sm:px-3 sm:py-1 sm:text-xs">
              {badgeLabel}
            </span>
          </div>
        )}

        {/* Action Buttons (Heart Wishlist & Eye Quick View) */}
        <div
          className={`absolute z-30 flex items-center gap-1.5 ${
            isFifthMobileCard
              ? "bottom-2 left-2 sm:bottom-auto sm:left-auto sm:top-3 sm:right-3 flex-row sm:flex-col sm:gap-2"
              : "top-2 right-2 sm:top-3 sm:right-3 flex-col sm:gap-2"
          }`}
        >
          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-ink-muted shadow-md backdrop-blur-md transition-colors hover:text-red-500 sm:h-9 sm:w-9"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          {/* Quick View Eye Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              aria-label={`Quick view: ${product.name}`}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-ink-muted shadow-md backdrop-blur-md transition-colors hover:text-[#016271] sm:h-9 sm:w-9"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Product Image (Full-bleed cover) */}
        <Link
          href={`/product-detail/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={getImageUrl(
              product.image || product.bannerImage || "/product.png",
            )}
            alt={product.name}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 300px"
          />
        </Link>
      </div>

      {/* Details & Actions Section */}
      <div
        className={`flex grow flex-col justify-between space-y-2 bg-white p-3 sm:space-y-3 sm:p-4 ${
          isFifthMobileCard ? "w-[58%] sm:w-full" : "w-full"
        }`}
      >
        <Link
          href={`/product-detail/${product.slug}`}
          className="block space-y-1 sm:space-y-1.5"
        >
          <h3 className="line-clamp-2 font-serif text-sm leading-snug font-bold text-[#1F1915] transition-colors group-hover:text-[#016271] sm:text-base md:text-lg">
            {product.name}
          </h3>

          <p className="line-clamp-2 min-h-[2.6em] text-[13px] leading-snug font-normal text-[#5C524D] sm:text-sm">
            {product.description ||
              "Safe, organic and dermatologically tested feminine hygiene care."}
          </p>

          {product.infoText && (
            <p className="mt-0.5 line-clamp-1 text-xs font-normal text-[#5C524D]/80">
              {product.infoText}
            </p>
          )}
        </Link>

        {/* Price & Add to Cart Action Row */}
        <div
          className={`mt-auto flex border-t border-gray-100 pt-1.5 sm:pt-2 ${
            isFifthMobileCard
              ? "flex-row items-center justify-between gap-2 sm:flex-col sm:items-stretch"
              : "flex-col gap-2"
          }`}
        >
          <div className="flex min-w-0 items-baseline gap-1">
            {variants.length > 1 && (
              <div className="relative w-full min-w-0">
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(event) =>
                    setSelectedVariant(
                      variants.find(
                        (variant) => variant.id === event.target.value,
                      ),
                    )
                  }
                  onClick={(event) => event.stopPropagation()}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white py-1 pr-8 pl-2 text-[13px] font-semibold text-[#1F1915] outline-none transition-colors focus:border-[#016271] sm:text-sm"
                  aria-label="Choose product variant"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {getCompactVariantLabel(variant)} - ₹
                      {Number(variant.price || 0)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
              </div>
            )}
            {variants.length <= 1 && (
              <span className="text-[15px] font-bold text-[#1F1915] sm:text-base">
                {formattedPrice}
              </span>
            )}
          </div>

          {/* Live offer (const/coupons.ts) */}
          <OfferTag className="mb-1.5 self-start" />

          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className={`flex min-h-11 cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-gray-200 text-sm font-semibold text-ink-muted shadow-none ${
                isFifthMobileCard ? "w-auto px-4 sm:w-full" : "w-full px-3"
              }`}
            >
              <span>Out of stock</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white shadow-xs transition-colors duration-300 ${
                isFifthMobileCard ? "w-auto px-4 sm:w-full" : "w-full px-3"
              } ${added ? "bg-emerald-700" : "bg-[#016271] hover:bg-[#004851]"}`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden />
                  <span>Add to bag</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
