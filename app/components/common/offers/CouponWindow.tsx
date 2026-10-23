"use client";

// The coupons window for the bag and checkout, the way marketplaces show it:
// the best combination first, coupons you can use now with what each saves,
// locked ones with how much more to shop, ones that aren't for this account
// and why, and ones starting soon. Rules live in const/coupons.ts; savings come
// from the server (getCouponWindow), so they match what checkout charges.

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, ChevronRight, Clock, Gift, Lock, Sparkle, Tag, Users, X } from "lucide-react";
import { couponByCode, COMBINED_CAP, parseCodes, stackProblem } from "@/const/coupons";
import { type CouponWindow as WindowData, type CouponWindowItem, getCouponWindow } from "@/helper/checkout/action";

type Props = {
  /** Bag lines with price and quantity. */
  items: { price?: number; quantity?: number; productId?: string }[];
  applied?: { code: string; discount: number } | null;
  /** Apply "A" or "A+B"; resolves true when it worked. */
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  busy?: boolean;
  tone?: "teal" | "ovy";
};

const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function CouponWindow({ items, applied, onApply, onRemove, busy, tone = "teal" }: Props) {
  const [data, setData] = useState<WindowData | null>(null);
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState<string | null>(null);
  const [personal, setPersonal] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Refresh when the bag changes (a bigger bag unlocks more).
  const signature = items.map((i) => `${i.productId}:${i.price}:${i.quantity}`).join("|");
  useEffect(() => {
    let alive = true;
    if (!items.length) return;
    getCouponWindow({ items })
      .then((d) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  // Start the sheet from what is applied now.
  useEffect(() => {
    if (!open) return;
    const codes = parseCodes(applied?.code);
    setStore(codes.find((c) => couponByCode(c) && !["welcome", "referrer"].includes(couponByCode(c)!.kind)) || null);
    setPersonal(codes.find((c) => ["welcome", "referrer"].includes(couponByCode(c)?.kind || "")) || null);
    setError(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => sheetRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, applied?.code]);

  const coupons = data?.coupons || [];
  const storeList = coupons.filter((c) => c.group === "store");
  const personalList = coupons.filter((c) => c.group === "personal");
  const usable = coupons.filter((c) => c.state === "ok");
  const find = (code: string | null) => (code ? coupons.find((c) => c.code === code) : undefined);

  const conflict = (code: string, other: string | null) => {
    if (!other) return null;
    const a = couponByCode(code);
    const b = couponByCode(other);
    return a && b ? stackProblem(a, b) : null;
  };

  const selectedSaving = useMemo(() => {
    const parts = [find(store), find(personal)].filter((c): c is CouponWindowItem => !!c && c.state === "ok");
    const sum = parts.reduce((n, c) => n + c.saving, 0);
    return parts.length > 1 && data ? Math.min(sum, data.subtotal * COMBINED_CAP) : sum;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, personal, data]);

  const apply = async (code: string) => {
    setWorking(true);
    setError(null);
    const ok = await onApply(code).catch(() => false);
    setWorking(false);
    if (ok) setOpen(false);
    else setError("That coupon couldn't be applied to this bag. Check the conditions above.");
  };

  const applySelected = () => {
    const codes = [store, personal].filter(Boolean) as string[];
    if (codes.length) apply(codes.join("+"));
  };

  const ink = tone === "ovy" ? "text-[#7E4D77]" : "text-[#016271]";
  const solid = tone === "ovy" ? "bg-[#7E4D77] hover:bg-[#6A3F64]" : "bg-[#016271] hover:bg-[#014d59]";
  const soft = tone === "ovy" ? "border-[#e3c9db] bg-[#FFF7FB]" : "border-[#9FD3D6] bg-[#F3FAFB]";

  const row = (c: CouponWindowItem, kind: "store" | "personal") => {
    const chosen = kind === "store" ? store === c.code : personal === c.code;
    const clash = c.state === "ok" ? conflict(c.code, kind === "store" ? personal : store) : null;
    const enabled = c.state === "ok";
    const Icon = c.state === "locked" ? Lock : c.state === "upcoming" ? Clock : kind === "personal" ? (c.kind === "referrer" ? Users : Gift) : Tag;
    return (
      <li key={c.code}>
        <button
          type="button"
          disabled={!enabled}
          onClick={() => {
            setError(null);
            if (kind === "store") {
              const next = chosen ? null : c.code;
              setStore(next);
              if (next && personal && conflict(next, personal)) setPersonal(null);
            } else {
              const next = chosen ? null : c.code;
              setPersonal(next);
              if (next && store && conflict(next, store)) setStore(null);
            }
          }}
          aria-pressed={chosen}
          className={`flex w-full gap-3 rounded-xl border p-3 text-left transition ${
            chosen ? `border-current ${ink} bg-white shadow-[0_0_0_1px_currentColor]` : "border-gray-200 bg-white"
          } ${enabled ? "active:scale-[0.99]" : "cursor-not-allowed opacity-70"}`}
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center ${kind === "store" ? "rounded-full" : "rounded-md"} border ${
              chosen ? `${solid} border-transparent text-white` : "border-gray-300 bg-white"
            }`}
            aria-hidden
          >
            {chosen && <Check className="h-3.5 w-3.5" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-0.5 font-mono text-[12.5px] font-bold tracking-wide ${enabled ? `${ink} border-current` : "border-gray-300 text-gray-500"}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {c.code}
              </span>
              {c.saving > 0 && (
                <span className={`text-[12.5px] font-bold ${enabled ? "text-emerald-700" : "text-gray-500"}`}>
                  {enabled ? `Save ${rupees(c.saving)}` : `Saves ${rupees(c.saving)}`}
                </span>
              )}
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-gray-800">{c.title}</span>
            <span className="mt-0.5 block text-[11.5px] text-gray-500">{c.conditions}</span>
            {c.reason && (
              <span className={`mt-1 block text-[12px] font-semibold ${c.state === "ok" ? "text-gray-600" : "text-amber-700"}`}>{c.reason}</span>
            )}
            {c.state === "locked" && typeof c.progress === "number" && (
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-gray-100">
                <span className={`block h-full rounded-full ${solid}`} style={{ width: `${Math.max(6, Math.round(c.progress * 100))}%` }} />
              </span>
            )}
            {c.state === "ok" && <span className="mt-1 block text-[11.5px] text-gray-500">{clash ? clash : c.stackNote}</span>}
          </span>
        </button>
      </li>
    );
  };

  const appliedCodes = parseCodes(applied?.code);
  const bestNotApplied = data?.best && data.best.codes.join("+") !== appliedCodes.join("+") && data.best.saving > (applied?.discount || 0);

  return (
    <>
      {/* The row in the summary */}
      <div className={`rounded-xl border ${soft} p-3`}>
        {applied && appliedCodes.length ? (
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ${ink}`}>
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold text-gray-900">
                {appliedCodes.join(" + ")} applied
              </span>
              <span className="block text-[12px] font-semibold text-emerald-700">You save {rupees(applied.discount)}</span>
            </span>
            <button type="button" onClick={() => setOpen(true)} className={`text-[12.5px] font-bold ${ink}`}>
              Change
            </button>
            <button type="button" onClick={onRemove} disabled={busy} className="text-[12.5px] font-bold text-rose-600">
              Remove
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center gap-3 text-left">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ${ink}`}>
              <Tag className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold text-gray-900">Apply coupons & offers</span>
              <span className="block text-[12px] text-gray-600">
                {usable.length
                  ? `${usable.length} coupon${usable.length > 1 ? "s" : ""} for this bag${data?.best ? ` · best saves ${rupees(data.best.saving)}` : ""}`
                  : "See every coupon and how to unlock it"}
              </span>
            </span>
            <ChevronRight className={`h-5 w-5 shrink-0 ${ink}`} aria-hidden />
          </button>
        )}
        {bestNotApplied && (
          <button
            type="button"
            onClick={() => apply(data!.best!.codes.join("+"))}
            disabled={busy || working}
            className={`mt-2.5 flex w-full items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-left text-[12.5px] ${ink}`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkle className="h-3.5 w-3.5" aria-hidden />
              Best for this bag: <strong className="font-mono">{data!.best!.codes.join(" + ")}</strong> saves {rupees(data!.best!.saving)}
            </span>
            <span className="font-bold">Apply</span>
          </button>
        )}
      </div>

      {/* Rendered on the page body, so no parent container can clip or cover it. */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100002] flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div
            ref={sheetRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Apply coupons"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[#FAFAF8] outline-none sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <p className="text-[16px] font-bold text-gray-900">Apply coupons</p>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typed.trim()) apply(typed.trim().toUpperCase());
                }}
                className="flex gap-2"
              >
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 font-mono text-[14px] uppercase tracking-wider outline-none focus:border-gray-500"
                />
                <button type="submit" disabled={!typed.trim() || working} className={`h-11 rounded-xl px-4 text-[13px] font-bold text-white ${solid} disabled:opacity-50`}>
                  Check
                </button>
              </form>

              {data?.best && (
                <button
                  type="button"
                  onClick={() => {
                    const [a, b] = data.best!.codes;
                    const first = couponByCode(a);
                    const isPersonal = (c?: { kind: string }) => !!c && ["welcome", "referrer"].includes(c.kind);
                    setStore(isPersonal(first) ? b || null : a);
                    setPersonal(isPersonal(first) ? a : b || null);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] p-3.5 text-left text-white"
                >
                  <Sparkle className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-white/80">Best for this bag</span>
                    <span className="block text-[14px] font-bold">
                      {data.best.codes.join(" + ")} · save {rupees(data.best.saving)}
                    </span>
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold">Select</span>
                </button>
              )}

              <section>
                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-gray-500">Store coupons · pick one</p>
                <ul className="space-y-2">{storeList.map((c) => row(c, "store"))}</ul>
              </section>

              {personalList.length > 0 && (
                <section>
                  <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.08em] text-gray-500">Add on top · pick one</p>
                  <p className="mb-2 text-[11.5px] text-gray-500">FIRSTCARE15 adds on to a Stock Up coupon. SHARECARE15 adds on to any store coupon.</p>
                  <ul className="space-y-2">{personalList.map((c) => row(c, "personal"))}</ul>
                  {personalList.some((c) => c.kind === "referrer" && c.state !== "ok") && (
                    <Link href="/dashboard/referral" onClick={() => setOpen(false)} className={`mt-2 inline-block text-[12.5px] font-bold underline ${ink}`}>
                      Refer a friend to unlock SHARECARE15
                    </Link>
                  )}
                </section>
              )}

              <p className="rounded-xl bg-white p-3 text-[11.5px] leading-relaxed text-gray-500">
                One store coupon per order, plus one add-on. Coupons together take at most {Math.round(COMBINED_CAP * 100)}% off. Your Rewards credit is applied on
                top automatically. Free delivery is decided on your bag before coupons.
              </p>
            </div>

            <div className="border-t border-gray-200 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
              {error && <p className="mb-2 text-[12.5px] font-semibold text-rose-600">{error}</p>}
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] text-gray-500">{store || personal ? "You save" : "Pick a coupon"}</span>
                  <span className="block text-[17px] font-bold text-gray-900">{rupees(store || personal ? selectedSaving : 0)}</span>
                </span>
                <button
                  type="button"
                  onClick={applySelected}
                  disabled={(!store && !personal) || working || busy}
                  className={`h-12 rounded-xl px-6 text-[14px] font-bold text-white ${solid} disabled:opacity-50`}
                >
                  {working ? "Applying…" : "Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
