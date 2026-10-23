"use client";

// Coupon messages for the whole site, all read from const/coupons.ts so they
// change by themselves when a festival starts or ends.

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Copy, Gift, PartyPopper, ShoppingBag, Tag, TrendingUp, Users } from "lucide-react";
import { bagOffers, couponConditions, festiveCoupon, liveCoupons, type StoreCoupon, TIER_COUPONS } from "@/const/coupons";

// Offers depend on today's date, so they render in the browser only: a page
// built earlier never shows a festival that has ended.
const noop = () => () => {};
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** A coupon code you can tap to copy. */
export function CopyCode({ code, tone = "ovy" }: { code: string; tone?: "ovy" | "teal" | "light" }) {
  const [copied, setCopied] = useState(false);
  const cls =
    tone === "teal"
      ? "border-[#016271]/40 bg-white text-[#016271]"
      : tone === "light"
        ? "border-white/60 bg-white/15 text-white"
        : "border-[#C98BBE] bg-white text-[#7E4D77]";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard
          ?.writeText(code)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          })
          .catch(() => {});
      }}
      className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg border border-dashed px-2.5 font-mono text-[12.5px] font-bold tracking-wide transition active:scale-[0.97] ${cls}`}
      aria-label={`Copy coupon ${code}`}
    >
      {code}
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5 opacity-70" aria-hidden />}
    </button>
  );
}

const ICON: Record<StoreCoupon["kind"], typeof Tag> = {
  festival: PartyPopper,
  welcome: Gift,
  friend: Users,
  referrer: Users,
  combo: ShoppingBag,
  tier: TrendingUp,
  occasion: Gift,
};

const HREF: Record<StoreCoupon["kind"], string> = {
  festival: "/shop",
  welcome: "/signup",
  friend: "/signup",
  referrer: "/dashboard/referral",
  combo: "/shop",
  tier: "/shop",
  occasion: "/dashboard/profile",
};

/** The top strip: festive offer first, then the other offers in turn. */
export function OfferStrip() {
  const mounted = useMounted();
  const live = mounted ? liveCoupons() : [];
  const festive = festiveCoupon();
  const ladder = TIER_COUPONS.filter((c) => live.includes(c));
  const lines: { text: string; href: string }[] = [
    ...(festive ? [{ text: festive.pitch, href: "/shop" }] : []),
    ...live.filter((c) => c.kind === "welcome").map((c) => ({ text: c.pitch, href: "/signup" })),
    ...live.filter((c) => c.occasion === "birthday").map((c) => ({ text: c.pitch, href: "/dashboard/profile" })),
    ...(ladder.length
      ? [{ text: `Spend more, save more: ${ladder.map((c) => `₹${c.flat} off on ₹${c.minimumOrderValue}+`).join(" · ")}`, href: "/shop" }]
      : []),
    ...live.filter((c) => c.kind === "combo" || c.kind === "referrer").map((c) => ({ text: c.pitch, href: HREF[c.kind] })),
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || lines.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % lines.length), 4500);
    return () => clearInterval(t);
  }, [paused, lines.length]);
  if (!mounted) return <span className="inline-block min-h-[1.25em]" aria-hidden />;
  if (!lines.length) return <>Free delivery on orders of ₹399 and above. Prices include GST.</>;
  const line = lines[i % lines.length];
  return (
    <span onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-live="polite">
      <Link key={line.text} href={line.href} className="offer-fade inline-block font-semibold underline-offset-2 hover:underline">
        {line.text}
      </Link>
    </span>
  );
}

type Brand = "ovy" | "looway" | "teen" | "any";

const PAIR_HINT: Record<Brand, string> = {
  ovy: "Pads with liners, or a cup with liners",
  teen: "A teen kit with seat covers for school",
  looway: "Seat covers with a pee funnel or pee bags",
  any: "Mix Ovy and Looway as you like",
};

/** The "Offers for you" box under a product's buy button. */
export function OffersForYou({ brand = "any", className = "" }: { brand?: Brand; className?: string }) {
  const mounted = useMounted();
  const live = mounted ? liveCoupons() : [];
  const festive = live.find((c) => c.kind === "festival");
  const welcome = live.find((c) => c.kind === "welcome");
  const pair = live.find((c) => c.kind === "combo");
  const ladder = TIER_COUPONS.filter((c) => live.includes(c));
  if (!live.length) return null;
  const tone = brand === "looway" ? "teal" : "ovy";
  const ink = brand === "looway" ? "text-[#016271]" : "text-[#7E4D77]";
  return (
    <div className={`rounded-2xl border border-dashed ${brand === "looway" ? "border-[#016271]/35 bg-[#F1FAF9]" : "border-[#dcc0d4] bg-[#FFF7FB]"} p-4 ${className}`}>
      <p className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] ${ink}`}>
        <Tag className="h-3.5 w-3.5" aria-hidden /> Offers for you
      </p>
      <ul className="mt-2.5 space-y-2.5 text-[13.5px] leading-snug text-[#3a2b36]">
        {festive && (
          <li className="flex items-center justify-between gap-3">
            <span><strong>{festive.description.replace(/, on orders.*$/, "")}</strong> on ₹{festive.minimumOrderValue}+</span>
            <CopyCode code={festive.code} tone={tone} />
          </li>
        )}
        {pair && (
          <li className="flex items-center justify-between gap-3">
            <span>
              <strong>Pair up, save {pair.percent}%</strong>: {PAIR_HINT[brand]}
            </span>
            <CopyCode code={pair.code} tone={tone} />
          </li>
        )}
        {welcome && (
          <li className="flex items-center justify-between gap-3">
            <span>
              <strong>New here?</strong> {welcome.percent}% off your first order. <Link href="/signup" className={`font-semibold underline ${ink}`}>Sign up</Link>
            </span>
            <CopyCode code={welcome.code} tone={tone} />
          </li>
        )}
      </ul>
      {ladder.length > 0 && (
        <div className="mt-3 border-t border-black/5 pt-3">
          <p className="text-[12.5px] font-semibold text-[#3a2b36]">Spend more, save more</p>
          <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1">
            {ladder.map((c) => (
              <span key={c.code} className="shrink-0 rounded-xl bg-white px-3 py-2 text-center shadow-[0_1px_6px_-3px_rgba(0,0,0,0.2)]">
                <span className={`block text-[14px] font-bold ${ink}`}>₹{c.flat} off</span>
                <span className="block text-[12px] text-[#6d5767]">on ₹{c.minimumOrderValue}+</span>
                <span className="mt-0.5 block font-mono text-[12px] font-bold tracking-wide text-[#a08a99]">{c.code}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mt-2.5 text-[12px] text-[#8a7484]">One store coupon per order, plus FIRSTCARE15 or SHARECARE15 on top. Rewards credit applies too. Free delivery on ₹399+.</p>
    </div>
  );
}

/** A row of offer cards for home, shop and brand pages. */
export function OffersBand({ title = "Offers running now", className = "" }: { title?: string; className?: string }) {
  const mounted = useMounted();
  const live = mounted ? liveCoupons() : [];
  if (!live.length) return null;
  return (
    <section className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 ${className}`} aria-label="Offers">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-serif text-[24px] font-bold leading-[1.15] text-[#1F1915] sm:text-3xl">{title}</h2>
        <span className="text-[12.5px] text-[#5C524D]">Tap a code to copy · one store coupon per order</span>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {live.map((c) => {
          const Icon = ICON[c.kind];
          const hot = c.kind === "festival";
          return (
            <Link
              key={c.code}
              href={HREF[c.kind]}
              className={`flex w-[240px] shrink-0 snap-start flex-col justify-between rounded-2xl p-4 transition active:scale-[0.98] sm:w-[260px] ${
                hot ? "bg-gradient-to-br from-[#7E4D77] to-[#C98BBE] text-white" : "border border-[#f0e0ea] bg-white text-[#2b1c27] md:hover:border-[#C98BBE]"
              }`}
            >
              <span>
                <Icon className={`h-5 w-5 ${hot ? "text-white" : "text-[#9A5C93]"}`} aria-hidden />
                <span className="mt-2 block text-[15px] font-bold leading-snug">{c.description}</span>
                <span className={`mt-1 block text-[12px] ${hot ? "text-white/85" : "text-[#8a7484]"}`}>{couponConditions(c)}</span>
              </span>
              <span className="mt-3">
                <CopyCode code={c.code} tone={hot ? "light" : "ovy"} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** A small tag for product cards. */
export function OfferTag({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const live = mounted ? liveCoupons() : [];
  const festive = live.find((c) => c.kind === "festival");
  const pair = live.find((c) => c.kind === "combo");
  const c = festive || pair;
  if (!c) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[#FBEFF8] px-2 py-0.5 text-[12px] font-semibold text-[#7E4D77] ${className}`}>
      <Tag className="h-3 w-3" aria-hidden />
      {festive ? `Extra ${festive.percent}% off: ${festive.code}` : `Buy any 2: ${pair!.percent}% off`}
    </span>
  );
}

/** In the bag: the best coupon right now, and how far the next saving is. */
export function SpendMoreBar({
  subtotal,
  differentProducts,
  onApply,
  applied,
  showBest = true,
}: {
  subtotal: number;
  differentProducts: number;
  onApply?: (code: string) => void;
  applied?: string | null;
  showBest?: boolean;
}) {
  const offers = bagOffers(subtotal, differentProducts);
  const best = showBest ? offers.best : undefined;
  const next = offers.next;
  if (!best && !next) return null;
  const prev = next ? [...TIER_COUPONS].reverse().find((c) => c.minimumOrderValue <= subtotal) : undefined;
  const from = prev?.minimumOrderValue || 0;
  const pct = next ? Math.max(4, Math.min(100, Math.round(((subtotal - from) / (next.coupon.minimumOrderValue - from)) * 100))) : 100;
  return (
    <div className="mb-4 rounded-xl border border-[#dcc0d4] bg-[#FFF7FB] p-3.5">
      {best && best.coupon.code !== applied && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] leading-snug text-[#3a2b36]">
            <span className="font-semibold text-[#7E4D77]">Best for your bag:</span> <span className="font-mono font-bold">{best.coupon.code}</span> saves you ₹
            {Math.round(best.saving)}
          </p>
          {onApply && (
            <button
              type="button"
              onClick={() => onApply(best.coupon.code)}
              className="min-h-8 shrink-0 rounded-full bg-[#7E4D77] px-3.5 text-[12px] font-bold text-white active:scale-[0.97]"
            >
              Apply
            </button>
          )}
        </div>
      )}
      {next && (
        <div className={best && best.coupon.code !== applied ? "mt-3" : ""}>
          <p className="text-[12.5px] text-[#3a2b36]">
            Add <strong>₹{next.needed}</strong> more to save <strong>₹{next.saving}</strong> with <span className="font-mono font-bold">{next.coupon.code}</span>
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f0dbe8]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#AF71A7] to-[#7E4D77] transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
