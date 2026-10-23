"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CalendarCheck, Gift, Home, Phone, ShieldCheck, Stethoscope, Tag, Truck } from "lucide-react";
import { PRODUCT_META } from "@/const/chatbot/products";
import type { ProductKey, SymptomOutcome } from "@/const/chatbot/symptomTypes";

export type LiveProduct = {
  slug: string;
  name: string | null;
  fromPrice: number | null;
  variants: { name: string; price: number; inStock: boolean }[];
  inStock: boolean;
  highlights: string[];
  subscription: { monthly: number; everyTwoMonths: number } | null;
  cycleSync: number;
};

export type LiveOffers = {
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
}: {
  picks: ProductPick[];
  live: Record<string, LiveProduct>;
  onNavigate: () => void;
  showPrices?: boolean;
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
                {meta.brand === "Potent" ? "Free tool" : meta.brand}
              </span>
              <span className="mt-0.5 block text-[14px] font-semibold leading-snug text-[#2b1c27]">{meta.name}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-[#6d5767]">{why || meta.line}</span>
              <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {size && <span className="rounded-full bg-[#F3ECFB] px-2 py-0.5 text-[11.5px] font-semibold text-[#6B4E9B]">{size}</span>}
                {showPrices && info?.fromPrice ? (
                  <span className="text-[13px] font-bold text-[#2b1c27]">
                    {info.variants.length > 1 ? "From " : ""}
                    {rupees(info.fromPrice)}
                  </span>
                ) : null}
                {info && !info.inStock && <span className="rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[11px] font-semibold text-[#9A4A12]">Out of stock</span>}
                {showPrices && save > 0 && (
                  <span className="rounded-full bg-[#E9F6EE] px-2 py-0.5 text-[11px] font-semibold text-[#0E5C3A]">Save {save}% on subscription</span>
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

export function PriceDetails({ info }: { info: LiveProduct }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
      {info.variants.map((v) => (
        <div key={v.name} className="flex items-center justify-between border-b border-[#f6ebf2] px-4 py-2.5 text-[14px] last:border-b-0">
          <span className="text-[#3a2b36]">{v.name}</span>
          <span className="font-semibold text-[#2b1c27]">
            {rupees(v.price)}
            {!v.inStock && <span className="ml-2 text-[11.5px] font-semibold text-[#9A4A12]">out of stock</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export function OffersCard({ offers, subscriptionSave }: { offers: LiveOffers; subscriptionSave: number }) {
  const r = offers.rewards;
  const rows: { icon: typeof Truck; title: string; text: string }[] = [
    {
      icon: Truck,
      title: `Free delivery from ${rupees(offers.freeDeliveryFrom)}`,
      text: `Orders below ${rupees(offers.freeDeliveryFrom)} have a flat ${rupees(offers.deliveryFee)} delivery charge. Prices include GST.`,
    },
    ...(subscriptionSave
      ? [{ icon: CalendarCheck, title: `Save up to ${subscriptionSave}% on subscriptions`, text: "Monthly and every-2-months plans, plus Cycle Sync on pads, teen kits and panties. Pause or cancel in two clicks." }]
      : []),
    {
      icon: Gift,
      title: `${rupees(r.joining)} welcome credit + ${r.orderBackPercent}% back`,
      text: `Join Potent Rewards free. Earn ${r.orderBackPercent}% back on delivered orders, ${rupees(r.birthday)} on your birthday and up to ${rupees(r.review)} for an approved review. Use up to ${r.maxRedeemPercent}% of an order, at most ${rupees(r.maxRedeemPerOrder)}.`,
    },
    {
      icon: Tag,
      title: `Refer a friend: ${rupees(r.referralYou)} for you, ${rupees(r.referralFriend)} off for them`,
      text: `On their first order of ${rupees(r.referralMinOrder)} or more. Have a coupon? Apply it in your bag (coupons and credits don't combine).`,
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

export function ResultCard({ outcome, Rich }: { outcome: SymptomOutcome; Rich: (p: { text: string }) => React.ReactNode }) {
  const u = URGENCY[outcome.urgency];
  const Icon = u.icon;
  return (
    <div className="overflow-hidden rounded-[22px] border bg-white shadow-[0_2px_14px_-6px_rgba(63,39,56,0.18)]" style={{ borderColor: u.ring }}>
      <div className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-[0.06em]" style={{ backgroundColor: u.bg, color: u.ink }}>
        <Icon className="h-4 w-4" aria-hidden /> {u.label}
      </div>
      <div className="space-y-3.5 px-4 pb-4 pt-3 text-[14.5px] leading-relaxed text-[#3a2b36]">
        <div>
          <p className="text-[16px] font-semibold leading-snug text-[#2b1c27]">{outcome.title}</p>
          <p className="mt-1.5"><Rich text={outcome.summary} /></p>
        </div>
        <Section title="Often linked to" items={outcome.oftenLinkedTo} Rich={Rich} />
        <Section title="What helps" items={outcome.whatHelps} Rich={Rich} />
        <div className="rounded-xl bg-[#FAF5F8] p-3 text-[13.5px]">
          <span className="font-semibold text-[#2b1c27]">When to see a doctor: </span>
          <Rich text={outcome.seeDoctor} />
        </div>
        {outcome.urgency === "emergency" && (
          <a href="tel:112" className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B42318] text-[14.5px] font-semibold text-white">
            <Phone className="h-4 w-4" aria-hidden /> Emergency? Call 112
          </a>
        )}
        <p className="flex items-start gap-1.5 text-[11.5px] leading-snug text-[#a08a99]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          General guidance from trusted health sources, not a diagnosis. A doctor can tell you what is really going on.
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
