/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Lightbulb, MessageCircle, RotateCcw, ShieldAlert, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getFullProductDetails } from "@/helper/product/action";
import { getImageUrl } from "@/lib/imageUrl";
import { BUY_ONCE_PLAN } from "@/lib/pdpSubscriptionRules";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { PRODUCT_META } from "@/const/chatbot/products";
import {
  NEED_STEPS,
  NEED_STORAGE_KEY,
  isMixPick,
  linerPackOfVariant,
  mixRecipeFor,
  needQuizResult,
  padSizeOfVariant,
  type NeedPick,
  type QuizAnswers,
} from "@/const/quizRules";
import { NEUTRAL_QUIZ_THEME, formatInr, openSaathi, themeStyle } from "@/app/components/common/quiz/QuizKit";

const SLUGS = ["ovy-pads", "ovy-liners", "ovy-panty", "ovy-cup"] as const;
const PAD_HASH: Record<string, string> = { L: "#l", XL: "#xl", "XL+": "#xlp" };

function readAnswers(): QuizAnswers | null {
  for (const store of ["sessionStorage", "localStorage"] as const) {
    try {
      const raw = window[store].getItem(NEED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as QuizAnswers;
      }
    } catch {
      // Blocked or bad storage: try the next one.
    }
  }
  return null;
}

const variantsOf = (product: any): any[] =>
  Array.isArray(product?.productVariants) ? product.productVariants : Array.isArray(product?.prodcutVarientBoxRes) ? product.prodcutVarientBoxRes : [];

const inStock = (v: any) => v?.isInStock !== false && v?.is_in_stock !== false;
const livePrice = (value: any) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

type Resolved = {
  pick: NeedPick;
  name: string;
  image: string;
  product?: any;
  variant?: any;
  price: number | null;
  strike: number | null;
  href: string;
  action: { kind: "add" } | { kind: "link"; label: string; href: string; onClick?: () => void };
};

function resolvePick(pick: NeedPick, products: Record<string, any>): Resolved {
  const meta = PRODUCT_META[pick.product];
  const product = pick.product === "period-tracker" ? undefined : products[pick.product];
  const image = product?.bannerImage ? getImageUrl(product.bannerImage) : meta.image;
  const name = product?.name || meta.name;
  const base = { pick, name, image, product, price: null, strike: null, href: meta.href };

  if (pick.product === "ovy-pads" && pick.padPick) {
    const key = pick.padPick;
    if (isMixPick(key)) {
      const recipe = mixRecipeFor(key);
      const save = () => {
        try {
          if (recipe) window.localStorage.setItem("ovy_mix_your_box_recipe", JSON.stringify(recipe));
        } catch {
          // The box then opens with its default recipe.
        }
      };
      return { ...base, href: "/product-detail/ovy-pads#mix", action: { kind: "link", label: "Build this box", href: "/product-detail/ovy-pads#mix", onClick: save } };
    }
    const matches = variantsOf(product).filter((v) => padSizeOfVariant(v) === key);
    const variant = matches.find(inStock) || matches[0];
    const href = `/product-detail/ovy-pads${PAD_HASH[key] || ""}`;
    const price = livePrice(variant?.price);
    return {
      ...base,
      variant,
      price,
      strike: livePrice(variant?.strikethroughPrice),
      href,
      action: variant && price ? { kind: "add" } : { kind: "link", label: "Choose it on the pads page", href },
    };
  }
  if (pick.product === "ovy-liners" && pick.linerPack) {
    const matches = variantsOf(product).filter((v) => linerPackOfVariant(v) === pick.linerPack);
    const variant = matches.find(inStock) || matches[0];
    const href = `/product-detail/ovy-liners#p${pick.linerPack}`;
    const price = livePrice(variant?.price);
    return {
      ...base,
      variant,
      price,
      strike: livePrice(variant?.strikethroughPrice),
      href,
      action: variant && price ? { kind: "add" } : { kind: "link", label: "Choose it on the liners page", href },
    };
  }
  if (pick.product === "ovy-cup") {
    return { ...base, href: "/product-detail/ovy-cup#size-finder", action: { kind: "link", label: "Find my cup size", href: "/product-detail/ovy-cup#size-finder" } };
  }
  if (pick.product === "ovy-panty") {
    return { ...base, action: { kind: "link", label: "Choose your size", href: meta.href } };
  }
  return { ...base, action: { kind: "link", label: "Open the free Period Tracker", href: meta.href } };
}

const SuggestedProducts = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers | null | undefined>(undefined);
  const [products, setProducts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    setAnswers(readAnswers());
  }, []);

  useEffect(() => {
    if (answers === undefined) return;
    if (!answers) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const entries = await Promise.all(
        SLUGS.map(async (slug) => {
          try {
            return [slug, await getFullProductDetails(slug)] as const;
          } catch {
            return [slug, null] as const;
          }
        }),
      );
      if (!cancelled) {
        setProducts(Object.fromEntries(entries));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [answers]);

  const result = useMemo(() => (answers ? needQuizResult(answers) : null), [answers]);
  const resolved = useMemo(() => (result ? result.picks.map((p) => resolvePick(p, products)) : []), [result, products]);

  const answerChips = useMemo(
    () =>
      answers
        ? NEED_STEPS.map((step) => {
            const opt = step.options.find((o) => o.id === answers[step.id]);
            return opt ? { id: step.id, label: opt.label } : null;
          }).filter(Boolean) as { id: string; label: string }[]
        : [],
    [answers],
  );

  const retake = () => {
    for (const store of ["sessionStorage", "localStorage"] as const) {
      try {
        window[store].removeItem(NEED_STORAGE_KEY);
      } catch {
        // Nothing to clear.
      }
    }
    router.push("/quiz");
  };

  const addToBag = async (r: Resolved) => {
    if (!r.variant || !r.price || !r.product) return;
    if (!inStock(r.variant)) {
      toast.error("This one is out of stock right now.");
      return;
    }
    setAdding(r.pick.product);
    try {
      await addToCartAction({
        productId: r.product.id,
        productVariantId: r.variant.id,
        sku: r.variant.sku,
        slug: r.product.slug || "",
        title: r.variant.name || `${r.name} (${r.pick.size || ""})`,
        image: r.variant.bannerImage || r.variant.image || r.product.bannerImage || "/product.png",
        price: r.price,
        originalPrice: r.strike && r.strike > r.price ? r.strike : undefined,
        selectedPlan: BUY_ONCE_PLAN,
        isSubscribed: false,
        purchaseType: "one_time",
        subscriptionType: null,
        quantity: 1,
        isQuantityChangable: true,
      });
      toast.success(`${r.pick.size || r.name} added to bag!`);
    } catch (err) {
      console.error("Quiz add to bag failed:", err);
      toast.error("Couldn't add it to your bag. Please try again.");
    } finally {
      setAdding(null);
    }
  };

  const renderAction = (r: Resolved, big: boolean) => {
    const cls = `flex ${big ? "min-h-[48px] text-sm sm:text-base" : "min-h-[44px] text-sm"} w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--quiz-accent)] px-4 py-2.5 font-bold text-white transition hover:bg-[var(--quiz-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50`;
    if (r.action.kind === "add") {
      const out = !inStock(r.variant);
      return (
        <button type="button" className={cls} disabled={out || adding === r.pick.product} onClick={() => addToBag(r)}>
          <ShoppingBag className="h-4 w-4" />
          {out ? "Out of stock right now" : adding === r.pick.product ? "Adding..." : "Add to bag"}
        </button>
      );
    }
    return (
      <Link href={r.action.href} onClick={r.action.onClick} className={cls}>
        {r.action.label} <ArrowRight className="h-4 w-4" />
      </Link>
    );
  };

  if (answers === undefined || (answers && loading)) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-gray-500" style={themeStyle(NEUTRAL_QUIZ_THEME)}>
        Fetching your personalised picks...
      </div>
    );
  }

  if (!answers || !result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center" style={themeStyle(NEUTRAL_QUIZ_THEME)}>
        <h1 className="font-serif text-2xl font-bold text-[var(--quiz-ink)]">Take the quiz first</h1>
        <p className="mt-2 text-sm text-gray-600">Four quick questions about your flow, comfort and skin, and we&apos;ll match you to the right Ovy products and sizes.</p>
        <Link
          href="/quiz"
          className="mx-auto mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[var(--quiz-accent)] px-6 font-bold text-white hover:bg-[var(--quiz-accent-dark)]"
        >
          Start the quiz <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const [main, ...others] = resolved;

  return (
    <div className="mx-auto mb-10 max-w-5xl px-4 pt-4 sm:pt-8" style={themeStyle(NEUTRAL_QUIZ_THEME)}>
      {/* Heading */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--quiz-soft)] px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--quiz-accent-dark)] uppercase">
        <Sparkles className="h-3.5 w-3.5" /> Your quiz result
      </span>
      <h1 className="mt-2 font-serif text-2xl leading-tight font-bold text-[var(--quiz-ink)] sm:text-4xl">{result.title}</h1>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">{result.intro}</p>

      {/* Your answers */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {answerChips.map((c) => (
          <span key={c.id} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            {c.label}
          </span>
        ))}
        <button type="button" onClick={retake} className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-full px-2 text-xs font-semibold text-[var(--quiz-accent-dark)] underline underline-offset-2">
          Change answers
        </button>
      </div>

      {/* Main pick */}
      {main ? (
        <div className="mt-6 grid gap-5 rounded-3xl border-2 border-[var(--quiz-accent)] bg-gradient-to-br from-[var(--quiz-soft)] via-white to-white p-4 sm:grid-cols-[220px_1fr] sm:p-6">
          <Link href={main.href} className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-white">
            <Image src={main.image} alt={main.name} fill className="object-contain p-2" unoptimized />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wider text-[var(--quiz-accent-dark)] uppercase">Best match</p>
            <h2 className="mt-1 font-serif text-xl font-bold text-[var(--quiz-ink)] sm:text-2xl">{main.name}</h2>
            {main.pick.size ? <p className="mt-0.5 text-sm font-semibold text-gray-700">{main.pick.size}</p> : null}
            {main.price ? (
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-xl font-bold text-[var(--quiz-accent-dark)]">{formatInr(main.price)}</span>
                {main.strike && main.strike > main.price ? <span className="text-sm text-gray-400 line-through">{formatInr(main.strike)}</span> : null}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{main.pick.why}</p>
            {main.pick.padPick && isMixPick(main.pick.padPick) ? (
              <p className="mt-1 text-xs text-gray-500">Your box is priced in the box builder.</p>
            ) : null}
            <div className="mt-4 grid gap-2 sm:max-w-sm">
              {renderAction(main, true)}
              <Link href={main.href} className="flex min-h-[44px] items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 text-sm font-semibold text-[var(--quiz-ink)] hover:bg-gray-50">
                See full details
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Why */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="mb-2 text-xs font-bold tracking-wide text-[var(--quiz-ink)] uppercase">Why these picks</p>
          <ul className="space-y-2">
            {result.reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm leading-relaxed text-gray-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--quiz-accent)]" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-[#FAF7F0] p-5">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-[var(--quiz-ink)] uppercase">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Good to know
          </p>
          <ul className="space-y-2">
            {result.tips.map((t) => (
              <li key={t} className="text-sm leading-relaxed text-gray-700">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {result.warnings.map((w) => (
        <p key={w} className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
          <span>{w}</span>
        </p>
      ))}

      {/* Other picks */}
      {others.length > 0 ? (
        <>
          <h2 className="mt-8 font-serif text-xl font-bold text-[var(--quiz-ink)]">Goes well with it</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => (
              <div key={`${r.pick.product}-${r.pick.size || ""}`} className="flex flex-col rounded-3xl bg-white p-4 shadow-sm">
                <Link href={r.href} className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50">
                  <Image src={r.image} alt={r.name} fill className="object-contain p-2" unoptimized />
                </Link>
                <h3 className="mt-3 text-sm font-bold text-[var(--quiz-ink)]">{r.name}</h3>
                {r.pick.size ? <p className="text-xs font-semibold text-gray-600">{r.pick.size}</p> : null}
                {r.price ? <p className="mt-1 text-sm font-bold text-[var(--quiz-accent-dark)]">{formatInr(r.price)}</p> : null}
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-600">{r.pick.why}</p>
                <div className="mt-3">{renderAction(r, false)}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--quiz-ink)]">Still have a question?</p>
          <p className="text-xs text-gray-600">Potent Saathi can help with sizes, periods and orders.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => openSaathi()}
            className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--quiz-accent)] px-5 text-sm font-bold text-white hover:bg-[var(--quiz-accent-dark)]"
          >
            <MessageCircle className="h-4 w-4" /> Ask Potent Saathi
          </button>
          <button
            type="button"
            onClick={retake}
            className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 text-sm font-semibold text-[var(--quiz-ink)] hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" /> Retake quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedProducts;
