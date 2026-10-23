"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CalendarCheck, Check, Gift, Home, Phone, ShieldCheck, Stethoscope, Tag, Truck } from "lucide-react";
import { PRODUCT_META } from "@/const/chatbot/products";
import type { ProductKey, SymptomOutcome } from "@/const/chatbot/symptomTypes";

export type LiveVariant = { id: string; sku: string; image: string | null; name: string; price: number; inStock: boolean };

export type LiveProduct = {
  id: string;
  dbSlug: string;
  image: string | null;
  isMixBox: boolean;
  slug: string;
  name: string | null;
  fromPrice: number | null;
  variants: LiveVariant[];
  inStock: boolean;
  highlights: string[];
  subscription: { monthly: number; everyTwoMonths: number } | null;
  cycleSync: number;
};

export type LiveCoupon = {
  code: string;
  description: string;
  conditions: string;
  descriptionHi?: string;
  conditionsHi?: string;
  minDifferentProducts: number;
  firstOrderOnly: boolean;
  kind?: "welcome" | "friend" | "referrer" | "festival" | "combo" | "tier";
  minimumOrderValue?: number;
  percent?: number | null;
  flat?: number | null;
  maximumDiscountAmount?: number;
  pitch?: string;
  pitchHi?: string;
};

/** Translates the cards' own text; English when no translation is given. */
export type Translate = (s: string, v?: Record<string, string | number>) => string;
export const fill: Translate = (s, v) => (v ? s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m)) : s);

export type LiveOffers = {
  coupons?: LiveCoupon[];
  freeDeliveryFrom: number;
  deliveryFee: number;
  rewards: {
    joining: number;
    orderBackPercent: number;
    birthday: number;
    review: number;
    referralYou: number;
    referralFriend: number;
    referralMinOrder: number;
    maxRedeemPerOrder: number;
    maxRedeemPercent: number;
  };
};

export type ProductPick = { product: ProductKey; why?: string; size?: string };

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ProductCards({
  picks,
  live,
  onNavigate,
  showPrices = true,
  t = fill,
}: {
  picks: ProductPick[];
  live: Record<string, LiveProduct>;
  onNavigate: () => void;
  showPrices?: boolean;
  t?: Translate;
}) {
  return (
    <div className="mt-3 space-y-2.5">
      {picks.map(({ product, why, size }) => {
        const meta = PRODUCT_META[product];
        const slug = meta.href.replace("/product-detail/", "");
        const info = live[slug];
        const save = info?.subscription ? Math.max(info.subscription.monthly, info.subscription.everyTwoMonths, info.cycleSync) : 0;
        return (
          <Link
            key={product}
            href={meta.href}
            onClick={onNavigate}
            className="flex gap-3 rounded-2xl border border-[#f0e0ea] bg-white p-2.5 pr-3 shadow-[0_2px_10px_-6px_rgba(63,39,56,0.18)] transition active:scale-[0.99] md:hover:border-[#dcc0d4]"
          >
            <span className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#FAF5F8]">
              <Image src={meta.image} alt={meta.name} fill sizes="76px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1 py-0.5">
              <span className="block text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9A5C93]">
                {meta.brand === "Potent" ? t("Free tool") : meta.brand}
              </span>
              <span className="mt-0.5 block text-[14px] font-semibold leading-snug text-[#2b1c27]">{meta.name}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-[#6d5767]">{why || t(meta.line)}</span>
              <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {size && <span className="rounded-full bg-[#F3ECFB] px-2 py-0.5 text-[11.5px] font-semibold text-[#6B4E9B]">{size}</span>}
                {showPrices && info?.fromPrice ? (
                  <span className="text-[13px] font-bold text-[#2b1c27]">
                    {info.variants.length > 1 ? t("From {price}", { price: rupees(info.fromPrice) }) : rupees(info.fromPrice)}
                  </span>
                ) : null}
                {info && !info.inStock && <span className="rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[11px] font-semibold text-[#9A4A12]">{t("Out of stock")}</span>}
                {showPrices && save > 0 && (
                  <span className="rounded-full bg-[#E9F6EE] px-2 py-0.5 text-[11px] font-semibold text-[#0E5C3A]">{t("Save {n}% on subscription", { n: save })}</span>
                )}
              </span>
            </span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#C98BBE]" aria-hidden />
          </Link>
        );
      })}
    </div>
  );
}

export function PriceDetails({ info, onAdd, t = fill }: { info: LiveProduct; onAdd?: (v: LiveVariant) => void; t?: Translate }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
      {info.variants.map((v) => (
        <div key={v.id} className="flex items-center justify-between gap-3 border-b border-[#f6ebf2] px-4 py-2 text-[14px] last:border-b-0">
          <span className="min-w-0 flex-1 text-[#3a2b36]">{v.name}</span>
          <span className="font-semibold text-[#2b1c27]">{rupees(v.price)}</span>
          {onAdd &&
            (v.inStock ? (
              <button
                type="button"
                onClick={() => onAdd(v)}
                className="min-h-9 shrink-0 rounded-full bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] px-3.5 text-[12.5px] font-semibold text-white active:scale-[0.97]"
              >
                {t("Add to bag")}
              </button>
            ) : (
              <span className="shrink-0 text-[11.5px] font-semibold text-[#9A4A12]">{t("Out of stock")}</span>
            ))}
        </div>
      ))}
    </div>
  );
}

export function CouponList({
  coupons,
  highlight,
  hindi,
  t = fill,
  onApply,
}: {
  coupons: LiveCoupon[];
  highlight?: string;
  hindi?: boolean;
  t?: Translate;
  /** Opens the bag with this coupon applied. */
  onApply?: (code: string) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!coupons.length) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-dashed border-[#dcc0d4] bg-[#FFF7FB]">
      <p className="px-4 pb-1 pt-3 text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#9A5C93]">{t("Coupons you can use today")}</p>
      {coupons.map((c) => (
        <div key={c.code} className={`flex items-center gap-3 border-t border-[#f3e0ec] px-4 py-2.5 first-of-type:border-t-0 ${highlight === c.code ? "bg-[#FBEFF8]" : ""}`}>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[14px] font-bold tracking-wide text-[#7E4D77]">{c.code}</span>
            <span className="block text-[12.5px] leading-snug text-[#5e4458]">{(hindi && c.descriptionHi) || c.description}</span>
            <span className="block text-[11.5px] text-[#a08a99]">{(hindi && c.conditionsHi) || c.conditions}</span>
          </span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(c.code).then(() => setCopied(c.code)).catch(() => {})}
            className="min-h-9 shrink-0 rounded-full border border-[#e3c9db] bg-white px-3 text-[12px] font-semibold text-[#7E4D77] active:scale-[0.97]"
          >
            {copied === c.code ? t("Copied") : t("Copy")}
          </button>
          {onApply && c.kind !== "referrer" && (
            <button
              type="button"
              onClick={() => onApply(c.code)}
              className="min-h-9 shrink-0 rounded-full bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] px-3 text-[12px] font-semibold text-white active:scale-[0.97]"
            >
              {t("Apply")}
            </button>
          )}
        </div>
      ))}
      <p className="border-t border-[#f3e0ec] px-4 py-2 text-[11.5px] text-[#a08a99]">{t("One store coupon per order, plus FIRSTCARE15 or SHARECARE15 on top. Tap Apply and I'll open your bag with it applied.")}</p>
    </div>
  );
}

export function OffersCard({ offers, subscriptionSave, t = fill }: { offers: LiveOffers; subscriptionSave: number; t?: Translate }) {
  const r = offers.rewards;
  const rows: { icon: typeof Truck; title: string; text: string }[] = [
    {
      icon: Truck,
      title: t("Free delivery from {a}", { a: rupees(offers.freeDeliveryFrom) }),
      text: t("Orders below {a} have a flat {fee} delivery charge. Prices include GST.", { a: rupees(offers.freeDeliveryFrom), fee: rupees(offers.deliveryFee) }),
    },
    ...(subscriptionSave
      ? [
          {
            icon: CalendarCheck,
            title: t("Save up to {n}% on subscriptions", { n: subscriptionSave }),
            text: t("Monthly and every-2-months plans, plus Cycle Sync on pads, teen kits and panties. Pause or cancel in two clicks."),
          },
        ]
      : []),
    {
      icon: Gift,
      title: t("{j} welcome credit + {p}% back", { j: rupees(r.joining), p: r.orderBackPercent }),
      text: t(
        "Join Potent Rewards free. Earn {p}% back on delivered orders, {b} on your birthday and up to {r} for an approved review. Use up to {mp}% of an order, at most {mx}.",
        { p: r.orderBackPercent, b: rupees(r.birthday), r: rupees(r.review), mp: r.maxRedeemPercent, mx: rupees(r.maxRedeemPerOrder) },
      ),
    },
    {
      icon: Tag,
      title: t("Refer a friend: {friend} credit for them, {you} credit for you", { you: rupees(r.referralYou), friend: rupees(r.referralFriend) }),
      text: t("Your credit lands when their first order of {min} or more is delivered, along with SHARECARE15. Credits work together with coupons.", { min: rupees(r.referralMinOrder) }),
    },
  ];
  return (
    <div className="mt-3 space-y-2">
      {rows.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex gap-3 rounded-2xl border border-[#f0e0ea] bg-white p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBEFF8] text-[#7E4D77]">
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold leading-snug text-[#2b1c27]">{title}</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-[#6d5767]">{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const URGENCY = {
  emergency: { label: "See a doctor today", icon: AlertTriangle, bg: "#FDECEC", ink: "#B42318", ring: "#F4B4AE" },
  soon: { label: "See a doctor soon", icon: Stethoscope, bg: "#FFF4E5", ink: "#9A4A12", ring: "#F6CF9B" },
  checkup: { label: "Book a check-up", icon: CalendarCheck, bg: "#EEF4FA", ink: "#1F4E79", ring: "#C7DCF0" },
  selfcare: { label: "Usually fine to manage at home", icon: Home, bg: "#EAF6EE", ink: "#0E5C3A", ring: "#BFE3CB" },
} as const;

export function ResultCard({ outcome, Rich, t = fill }: { outcome: SymptomOutcome; Rich: (p: { text: string }) => React.ReactNode; t?: Translate }) {
  const u = URGENCY[outcome.urgency];
  const Icon = u.icon;
  return (
    <div className="overflow-hidden rounded-[22px] border bg-white shadow-[0_2px_14px_-6px_rgba(63,39,56,0.18)]" style={{ borderColor: u.ring }}>
      <div className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-[0.06em]" style={{ backgroundColor: u.bg, color: u.ink }}>
        <Icon className="h-4 w-4" aria-hidden /> {t(u.label)}
      </div>
      <div className="space-y-3.5 px-4 pb-4 pt-3 text-[14.5px] leading-relaxed text-[#3a2b36]">
        <div>
          <p className="text-[16px] font-semibold leading-snug text-[#2b1c27]">{outcome.title}</p>
          <p className="mt-1.5"><Rich text={outcome.summary} /></p>
        </div>
        <Section title={t("Often linked to")} items={outcome.oftenLinkedTo} Rich={Rich} />
        <Section title={t("What helps")} items={outcome.whatHelps} Rich={Rich} />
        <div className="rounded-xl bg-[#FAF5F8] p-3 text-[13.5px]">
          <span className="font-semibold text-[#2b1c27]">{t("When to see a doctor: ")}</span>
          <Rich text={outcome.seeDoctor} />
        </div>
        {outcome.urgency === "emergency" && (
          <a href="tel:112" className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B42318] text-[14.5px] font-semibold text-white">
            <Phone className="h-4 w-4" aria-hidden /> {t("Emergency? Call 112")}
          </a>
        )}
        <p className="flex items-start gap-1.5 text-[11.5px] leading-snug text-[#a08a99]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {t("General guidance from trusted health sources, not a diagnosis. A doctor can tell you what is really going on.")}
        </p>
      </div>
    </div>
  );
}

function Section({ title, items, Rich }: { title: string; items: string[]; Rich: (p: { text: string }) => React.ReactNode }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#a3899b]">{title}</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C98BBE]" aria-hidden />
            <span><Rich text={it} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { rupees };

/** A packing list or step list from a planner or quiz. */
export function Checklist({ items, title, Rich, t = fill }: { items: string[]; title?: string; Rich: (p: { text: string }) => React.ReactNode; t?: Translate }) {
  if (!items.length) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-[#d9ece6] bg-white">
      <p className="border-b border-[#e8f3ef] px-4 pb-2 pt-3 text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#0E5C3A]">{t(title || "Your checklist")}</p>
      <ul className="space-y-2 px-4 py-3 text-[14px] leading-snug text-[#2b3a33]">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-[#E9F6EE] text-[#0E5C3A]">
              <Check className="h-3 w-3" aria-hidden />
            </span>
            <span><Rich text={it} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
