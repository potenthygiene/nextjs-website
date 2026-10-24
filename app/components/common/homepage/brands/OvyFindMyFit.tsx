/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { QuizResult, QuizSteps, themeStyle, useQuizFlow, type QuizAction, type QuizTheme } from "@/app/components/common/quiz/QuizKit";
import {
  CUP_ALT_WHY,
  CUP_SIZES,
  CUP_TIPS,
  LINER_PACKS,
  LINER_TIP,
  OVY_FIT_STEPS,
  PAD_PICKS,
  PAD_TIPS,
  TEEN_KITS,
  TEEN_TIPS,
  cupSizeOfVariant,
  isMixPick,
  linerPackOfVariant,
  mixRecipeFor,
  ovyFitReasons,
  ovyFitResult,
  ovyFitSkip,
  padSizeOfVariant,
  teenKitOfVariant,
  type PadPickKey,
} from "@/const/quizRules";
import { getOvyProductId, getOvyVariants, getOvyVariantId, getOvyVariantPrice, type OvyVariant } from "./ovyProductPricing";

const FIT_THEME: QuizTheme = { accent: "#602E55", accentDark: "#4E2445", soft: "#F6EFF8", ink: "#1F1915" };

const PAD_HASH: Record<string, string> = { L: "#l", XL: "#xl", "XL+": "#xlp" };
const CUP_IMAGES = { xs: "/ovy/cup-xs.jpg", m: "/ovy/cup-m.jpg", l: "/ovy/cup-l.jpg" } as const;

type Shown = {
  title: string;
  productName: string;
  sizeLabel: string;
  description: string;
  image: string;
  slug: string;
  product: any;
  variant?: OvyVariant & { isInStock?: boolean; strikethroughPrice?: number | string };
  href: string;
  tips: string[];
  contents?: string[];
  alternative: { title: string; why: string; href: string; label: string };
  extra?: QuizAction;
  mixRecipe?: Record<string, number> | null;
};

const inStock = (v: any) => v?.isInStock !== false && v?.is_in_stock !== false;

export function OvyFindMyFit({ productsBySlug }: { productsBySlug: Record<string, any> }) {
  const flow = useQuizFlow(OVY_FIT_STEPS, ovyFitSkip);
  const [isAdding, setIsAdding] = useState(false);

  const shown = useMemo<Shown | null>(() => {
    if (!flow.done) return null;
    const r = ovyFitResult(flow.answers);
    const pick = <T,>(product: any, test: (v: any) => boolean): T | undefined => {
      const list = getOvyVariants(product).filter(test);
      return (list.find(inStock) || list[0]) as T | undefined;
    };

    if (r.kind === "pads") {
      const product = productsBySlug["ovy-pads"];
      const key: PadPickKey = r.pick;
      const variant = isMixPick(key) ? undefined : pick<OvyVariant>(product, (v) => padSizeOfVariant(v) === key);
      const recipe = mixRecipeFor(key);
      const altHref = `/product-detail/ovy-pads${isMixPick(r.alternative) ? "#mix" : PAD_HASH[r.alternative]}`;
      return {
        title: PAD_PICKS[key].title,
        productName: product?.name || "Ovy Organic Sanitary Pads",
        sizeLabel: PAD_PICKS[key].label,
        description: PAD_PICKS[key].why,
        image: variant?.bannerImage || variant?.image ? getImageUrl(variant.bannerImage || variant.image || "") : "/product-images/pads.jpg",
        slug: product?.slug || "ovy-pads",
        product,
        variant,
        href: `/product-detail/ovy-pads${recipe ? "#mix" : PAD_HASH[key]}`,
        tips: [recipe ? PAD_TIPS.mix : PAD_TIPS[key as "L" | "XL" | "XL+"], PAD_TIPS.bin],
        contents: recipe ? [`${recipe.L} L pads (240mm)`, `${recipe.XL} XL pads (280mm)`, `${recipe["XL+"]} XL+ pads (320mm)`] : undefined,
        alternative: { title: `Or ${PAD_PICKS[r.alternative].label}`, why: PAD_PICKS[r.alternative].altWhy, href: altHref, label: "See it on the pads page" },
        mixRecipe: recipe,
      };
    }
    if (r.kind === "cup") {
      const product = productsBySlug["ovy-cup"];
      const variant = pick<OvyVariant>(product, (v) => cupSizeOfVariant(v) === r.size);
      const size = CUP_SIZES[r.size];
      return {
        title: size.title,
        productName: product?.name || "Potent Hygiene Menstrual Cup",
        sizeLabel: `${size.name}, ${size.cap}${variant?.color ? ` · ${variant.color}` : ""}`,
        description: size.why,
        image: variant?.bannerImage || variant?.image ? getImageUrl(variant.bannerImage || variant.image || "") : CUP_IMAGES[r.size],
        slug: product?.slug || "ovy-cup",
        product,
        variant,
        href: "/product-detail/ovy-cup#size-finder",
        tips: [CUP_TIPS.boil, CUP_TIPS.empty],
        alternative: {
          title: `Or ${CUP_SIZES[r.alternative].name}, ${CUP_SIZES[r.alternative].cap}`,
          why: CUP_ALT_WHY[`${r.size}>${r.alternative}`] || CUP_SIZES[r.alternative].why,
          href: "/product-detail/ovy-cup#size-finder",
          label: "Compare the three sizes",
        },
        extra: { label: "Check with the full cup size quiz", href: "/product-detail/ovy-cup#size-finder" },
      };
    }
    if (r.kind === "liners") {
      const product = productsBySlug["ovy-liners"];
      const variant = pick<OvyVariant>(product, (v) => linerPackOfVariant(v) === r.pack);
      return {
        title: LINER_PACKS[r.pack].title,
        productName: product?.name || "Ovy Daily Panty Liners",
        sizeLabel: LINER_PACKS[r.pack].label,
        description: LINER_PACKS[r.pack].why,
        image: variant?.bannerImage || variant?.image ? getImageUrl(variant.bannerImage || variant.image || "") : "/product-images/liners.jpg",
        slug: product?.slug || "ovy-liners",
        product,
        variant,
        href: `/product-detail/ovy-liners#p${r.pack}`,
        tips: [LINER_TIP],
        alternative: {
          title: `Or the ${LINER_PACKS[r.alternative].label.toLowerCase()}`,
          why: LINER_PACKS[r.alternative].why,
          href: `/product-detail/ovy-liners#p${r.alternative}`,
          label: "See it on the liners page",
        },
      };
    }
    const product = productsBySlug["ovy-teen"];
    const variant = pick<OvyVariant>(product, (v) => teenKitOfVariant(v) === r.kit);
    return {
      title: TEEN_KITS[r.kit].title,
      productName: product?.name || "Ovy Teen Pads",
      sizeLabel: TEEN_KITS[r.kit].label,
      description: TEEN_KITS[r.kit].why,
      image: r.kit === "PRO" ? "/product-images/teen-pro.jpg" : "/product-images/teen.jpg",
      slug: product?.slug || "ovy-teen",
      product,
      variant,
      href: `/product-detail/ovy-teen?kit=${r.kit.toLowerCase()}`,
      tips: [TEEN_TIPS.bag, TEEN_TIPS.change],
      contents: TEEN_KITS[r.kit].contents,
      alternative: {
        title: `Or the ${TEEN_KITS[r.alternative].label}`,
        why: TEEN_KITS[r.alternative].altWhy,
        href: `/product-detail/ovy-teen?kit=${r.alternative.toLowerCase()}`,
        label: "See it on the Ovy Teen page",
      },
    };
  }, [flow.done, flow.answers, productsBySlug]);

  const price = shown?.variant ? getOvyVariantPrice(shown.variant) : 0;
  const strike = Number(shown?.variant?.strikethroughPrice);
  const canAdd = Boolean(shown && !shown.mixRecipe && shown.variant && price > 0 && getOvyProductId(shown.product));
  const outOfStock = Boolean(shown?.variant && !inStock(shown.variant));

  const saveMixRecipe = () => {
    if (!shown?.mixRecipe) return;
    try {
      window.localStorage.setItem("ovy_mix_your_box_recipe", JSON.stringify(shown.mixRecipe));
    } catch {
      // Storage can be blocked; the box then opens with its default recipe.
    }
  };

  const handleAddToCart = async () => {
    if (!shown || !canAdd || !shown.variant) return;
    setIsAdding(true);
    try {
      const added = await addToCart({
        productId: getOvyProductId(shown.product),
        productVariantId: getOvyVariantId(shown.variant),
        sku: shown.variant.sku,
        slug: shown.slug,
        title: shown.variant.name || `${shown.productName} (${shown.sizeLabel})`,
        image: shown.image,
        price,
        originalPrice: Number.isFinite(strike) && strike > price ? strike : undefined,
        quantity: 1,
        isQuantityChangable: true,
      });
      if (added === false) return;
      toast.success(`${shown.sizeLabel} added to bag!`);
    } catch (err) {
      console.error("Cart error:", err);
      toast.error("Couldn't add it to your bag. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const primary: QuizAction | null = !shown
    ? null
    : shown.mixRecipe
      ? { label: "Build this Mix Your Box", href: shown.href, onClick: saveMixRecipe, icon: <ShoppingBag className="h-5 w-5" /> }
      : canAdd
        ? {
            label: outOfStock ? "Out of stock right now" : isAdding ? "Adding..." : "Add to bag",
            onClick: handleAddToCart,
            disabled: outOfStock || isAdding,
            icon: <ShoppingBag className="h-5 w-5" />,
          }
        : { label: "Choose it on the product page", href: shown.href };

  return (
    <section id="find-my-fit" className="w-full scroll-mt-24 bg-[#F3EBF9] py-12 md:py-16" style={themeStyle(FIT_THEME)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="text-left md:col-span-5">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#C42B5B] uppercase">FIND MY FIT</span>
            <h2 className="font-serif text-3xl leading-tight font-bold text-[#1F1915] sm:text-5xl">A few taps. The right pack.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5C524D] sm:text-base">
              Two or three quick questions, for yourself or for someone you are buying for. We match the size to your flow and show you why.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="w-full rounded-3xl border border-purple-100/80 bg-white p-5 shadow-xl sm:p-8">
              {!shown || !primary ? (
                <QuizSteps flow={flow} />
              ) : (
                <QuizResult
                  eyebrow="Your perfect match"
                  title={shown.title}
                  productName={shown.productName}
                  sizeLabel={shown.sizeLabel}
                  image={shown.image}
                  price={shown.mixRecipe ? null : price || null}
                  strikePrice={Number.isFinite(strike) && strike > 0 ? strike : null}
                  priceNote={shown.mixRecipe ? "Your box is priced in the box builder." : undefined}
                  description={shown.description}
                  reasons={ovyFitReasons(flow.answers)}
                  contents={shown.contents}
                  alternative={{
                    title: shown.alternative.title,
                    why: shown.alternative.why,
                    action: { label: shown.alternative.label, href: shown.alternative.href },
                  }}
                  tips={[...shown.tips, "Orders are dispatched within 24 to 48 hours."]}
                  primary={primary}
                  secondary={shown.extra ? [shown.extra] : shown.mixRecipe ? [] : [{ label: "See full details", href: shown.href }]}
                  onBack={flow.back}
                  onRetake={flow.reset}
                />
              )}
            </div>
            <p className="mt-3 text-center text-xs text-[#5C524D]">
              Want more detail? Try the{" "}
              <Link href="/quiz" className="font-semibold text-[#602E55] underline underline-offset-2">
                full Find what I need quiz
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
