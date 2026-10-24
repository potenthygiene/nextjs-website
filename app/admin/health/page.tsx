/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  coupon,
  order,
  orderItem,
  paymentGatewaySubscription,
  razorpayWebhookEvent,
  review,
  rewardCoinsHistory,
  subscriptions,
  users,
} from "@/db/schema";
import { requireAdmin } from "@/helper/auth/guard";
import { RETIRED_CODES } from "@/const/coupons";
import { isCountedRewardType } from "@/lib/rewards";
import { HealthButton } from "./HealthButtons";

export const dynamic = "force-dynamic";

// One page that shows whether the site's settings and background jobs are
// working, without ever showing a secret: settings appear as "set" or
// "missing" only.

const SETTINGS: { name: string; what: string }[] = [
  { name: "DATABASE_URL", what: "Database" },
  { name: "RAZORPAY_KEY_ID", what: "Razorpay key (server)" },
  { name: "RAZORPAY_KEY_SECRET", what: "Razorpay secret (server)" },
  { name: "NEXT_PUBLIC_RAZORPAY_KEY_ID", what: "Razorpay key (payment window)" },
  { name: "RAZORPAY_WEBHOOK_SECRET", what: "Razorpay webhook secret: without it, Razorpay's payment and renewal messages are refused" },
  { name: "SES_AWS_ACCESS_KEY_ID", what: "Amazon SES email key (optional: the main AWS key is used if missing)" },
  { name: "SES_AWS_SECRET_ACCESS_KEY", what: "Amazon SES email secret (optional, as above)" },
  { name: "AWS_REGION", what: "Amazon region" },
  { name: "EMAIL_FROM", what: "Email sender address (optional: care@potenthygiene.com is used if missing)" },
  { name: "SHIPROCKET_EMAIL", what: "Shiprocket login email" },
  { name: "SHIPROCKET_PASSWORD", what: "Shiprocket login password" },
  { name: "SHIPROCKET_PICKUP_PINCODE", what: "Warehouse pincode for delivery checks" },
  { name: "USER_POOL_ID", what: "Sign-in (Cognito user pool)" },
  { name: "COGNITO_CLIENT_ID", what: "Sign-in app id" },
  { name: "COGNITO_CLIENT_SECRET", what: "Sign-in app secret" },
  { name: "COGNITO_DOMAIN", what: "Google sign-in (Cognito hosted page)" },
  { name: "NEXT_PUBLIC_GOOGLE_SIGNIN", what: "Shows the Google button when set to on" },
  { name: "BREVO_API_KEY", what: "Newsletter (Brevo)" },
  { name: "BREVO_LIST_ID", what: "Newsletter list" },
  { name: "CRON_SECRET", what: "Locks the daily jobs so only Vercel can start them" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Pill({ ok, yes = "OK", no = "Missing" }: { ok: boolean; yes?: string; no?: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
      {ok ? yes : no}
    </span>
  );
}

const day = (d: any) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

async function shiprocketLogin() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) return { ok: false, note: "Login details are not set." };
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data?.token ? { ok: true, note: "Signed in to Shiprocket." } : { ok: false, note: data?.message || `Shiprocket said ${res.status}.` };
  } catch {
    return { ok: false, note: "Could not reach Shiprocket." };
  }
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HealthPage() {
  await requireAdmin();
  const since30 = new Date(Date.now() - 30 * 86400000);
  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const mode = keyId.startsWith("rzp_live_") ? "Live" : keyId.startsWith("rzp_test_") ? "Test" : "Unknown";

  const [webhooks, lastWebhook, subs, emptyOrders, statusCounts, oldPending, testCoupons, shortReviews, rewardTypes, shiprocket] =
    await Promise.all([
      safe(
        () =>
          db
            .select({ name: razorpayWebhookEvent.eventName, n: sql<number>`count(*)::int` })
            .from(razorpayWebhookEvent)
            .where(gte(razorpayWebhookEvent.createdAt, since30))
            .groupBy(razorpayWebhookEvent.eventName),
        [] as any[],
      ),
      safe(
        () => db.select({ at: razorpayWebhookEvent.createdAt }).from(razorpayWebhookEvent).orderBy(desc(razorpayWebhookEvent.createdAt)).limit(1),
        [] as any[],
      ),
      safe(
        () =>
          db
            .select({
              id: subscriptions.id,
              email: users.email,
              type: subscriptions.subscriptionType,
              next: subscriptions.nextOrderDate,
              isActive: subscriptions.isActive,
              isPaused: subscriptions.isPaused,
              lastOrder: order.createdAt,
              gatewayId: paymentGatewaySubscription.gatewaySubscriptionId,
            })
            .from(subscriptions)
            .leftJoin(users, eq(subscriptions.userId, users.id))
            .leftJoin(order, eq(subscriptions.orderId, order.id))
            .leftJoin(paymentGatewaySubscription, eq(paymentGatewaySubscription.subscriptionId, subscriptions.id))
            .orderBy(desc(subscriptions.nextOrderDate))
            .limit(50),
        [] as any[],
      ),
      safe(
        () =>
          db
            .select({ id: order.id, status: order.status, total: order.totalAmount, at: order.createdAt, email: users.email })
            .from(order)
            .leftJoin(orderItem, eq(orderItem.orderId, order.id))
            .leftJoin(users, eq(order.userId, users.id))
            .groupBy(order.id, users.email)
            .having(sql`count(${orderItem.id}) = 0`)
            .orderBy(desc(order.createdAt))
            .limit(100),
        [] as any[],
      ),
      safe(
        () => db.select({ status: order.status, n: sql<number>`count(*)::int` }).from(order).groupBy(order.status),
        [] as any[],
      ),
      safe(
        () =>
          db
            .select({ n: sql<number>`count(*)::int` })
            .from(order)
            .where(and(eq(order.status, "pending"), sql`${order.createdAt} < now() - interval '2 days'`)),
        [] as any[],
      ),
      safe(() => db.select({ code: coupon.code }).from(coupon).where(inArray(coupon.code, [...RETIRED_CODES])), [] as any[]),
      safe(
        () =>
          db
            .select({ id: review.id, name: review.name, message: review.message, at: review.createdAt, approved: review.isAdminApproved })
            .from(review)
            .where(sql`length(trim(coalesce(${review.message}, ''))) < 12`)
            .limit(50),
        [] as any[],
      ),
      safe(
        () =>
          db
            .select({
              type: sql<string>`split_part(${rewardCoinsHistory.type}, ':', 1)`,
              rows: sql<number>`count(*)::int`,
              total: sql<number>`coalesce(sum(${rewardCoinsHistory.coins}), 0)::int`,
            })
            .from(rewardCoinsHistory)
            .groupBy(sql`split_part(${rewardCoinsHistory.type}, ':', 1)`),
        [] as any[],
      ),
      shiprocketLogin(),
    ]);

  const missing = SETTINGS.filter((s) => !process.env[s.name]);
  const missedRenewals = subs.filter((s: any) => s.isActive && !s.isPaused && s.next && new Date(s.next) < new Date());

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Site health</h1>
        <p className="text-sm text-ink-muted">
          Settings, payments, renewals, emails and data checks in one place. Secrets are never shown: only whether each one is set.
        </p>
      </div>

      <Section title={`Settings on Vercel (${missing.length ? `${missing.length} missing` : "all set"})`}>
        <div className="divide-y">
          {SETTINGS.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div>
                <code className="font-mono text-[13px] font-semibold">{s.name}</code>
                <p className="text-ink-muted">{s.what}</p>
              </div>
              <Pill ok={!!process.env[s.name]} yes="Set" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm">
          Email sender: <b>{process.env.EMAIL_FROM || "Potent Hygiene <care@potenthygiene.com> (the default)"}</b>.
        </p>
      </Section>

      <Section title="Payments (Razorpay)">
        <div className="space-y-2 text-sm">
          <p>
            Mode: <b>{mode}</b> {mode === "Live" ? <Pill ok yes="Real payments" /> : <Pill ok={false} no="Not live" />}
          </p>
          <p>
            Payment window key matches the server key:{" "}
            <Pill ok={!!publicKeyId && publicKeyId === keyId} yes="Yes" no="No" />
          </p>
          <p>
            Messages from Razorpay in the last 30 days:{" "}
            {webhooks.length ? webhooks.map((w: any) => `${w.name} ${w.n}`).join(", ") : <b>none</b>}
            {lastWebhook[0]?.at ? ` (latest ${day(lastWebhook[0].at)})` : ""}
          </p>
          {!process.env.RAZORPAY_WEBHOOK_SECRET && (
            <p className="rounded-lg bg-red-50 p-3 text-red-800">
              The webhook secret is missing, so every message from Razorpay is refused. Renewal orders will still be made by the daily renewal check, but set this to get them instantly.
            </p>
          )}
        </div>
      </Section>

      <Section title={`Subscriptions (${missedRenewals.length} past their date)`}>
        <p className="mb-3 text-sm text-ink-muted">
          A renewal Razorpay has charged becomes an order the moment Razorpay tells us, and the daily check at 10:00 makes any that were missed.
        </p>
        <HealthButton action="renewals" />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-ink-muted">
              <tr><th className="py-1.5 pr-3">Customer</th><th className="pr-3">Plan</th><th className="pr-3">Next date</th><th className="pr-3">Last order</th><th className="pr-3">Razorpay</th><th>State</th></tr>
            </thead>
            <tbody className="divide-y">
              {subs.map((s: any) => (
                <tr key={s.id}>
                  <td className="py-1.5 pr-3">{s.email}</td>
                  <td className="pr-3">{String(s.type || "").replace(/_/g, " ")}</td>
                  <td className="pr-3">{day(s.next)}</td>
                  <td className="pr-3">{day(s.lastOrder)}</td>
                  <td className="pr-3"><Pill ok={!!s.gatewayId} yes="Linked" no="Not linked" /></td>
                  <td>{s.isActive ? (s.isPaused ? "Paused" : "Running") : "Ended"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Courier (Shiprocket)">
        <p className="text-sm">
          Login: <Pill ok={shiprocket.ok} yes="Working" no="Not working" /> {shiprocket.note}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Paid orders are not booked with a courier automatically yet. That is the next step once we choose the courier.
        </p>
      </Section>

      <Section title="Emails">
        <p className="mb-3 text-sm text-ink-muted">
          Order confirmations and password resets go out through Amazon SES. Send yourself a test to check it lands in the inbox.
        </p>
        <HealthButton action="email" />
      </Section>

      <Section title={`Orders with no items (${emptyOrders.length})`}>
        {emptyOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-ink-muted">
                <tr><th className="py-1.5 pr-3">Order</th><th className="pr-3">Date</th><th className="pr-3">Status</th><th className="pr-3">Total</th><th>Customer</th></tr>
              </thead>
              <tbody className="divide-y">
                {emptyOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="py-1.5 pr-3 font-mono text-xs">{String(o.id).slice(0, 8)}</td>
                    <td className="pr-3">{day(o.at)}</td>
                    <td className="pr-3">{o.status}</td>
                    <td className="pr-3">₹{Number(o.total || 0)}</td>
                    <td>{o.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm">Every order has its items.</p>
        )}
      </Section>

      <Section title="Test data">
        <ul className="space-y-1.5 text-sm">
          <li>
            Old test coupons still stored: {testCoupons.length ? testCoupons.map((c: any) => c.code).join(", ") : "none"}. They can never be used: checkout refuses them.
          </li>
          <li>
            Orders by status: {statusCounts.map((s: any) => `${s.status} ${s.n}`).join(", ")}. Pending for more than 2 days (payment never finished): {oldPending[0]?.n ?? 0}.
          </li>
          <li>
            Very short reviews (likely tests): {shortReviews.length ? shortReviews.map((r: any) => `"${r.message}" by ${r.name || "someone"}${r.approved ? " (live)" : ""}`).join("; ") : "none"}. Remove them in Admin, Review.
          </li>
        </ul>
      </Section>

      <Section title="Rewards">
        <p className="mb-2 text-sm text-ink-muted">
          Balances follow our rules: 5% on delivered orders, joining, birthday, review and referral credits. Old coins from before are kept on record but do not count.
        </p>
        <table className="mb-3 w-full text-left text-sm">
          <thead className="text-xs uppercase text-ink-muted">
            <tr><th className="py-1.5 pr-3">Kind</th><th className="pr-3">Rows</th><th className="pr-3">Total ₹</th><th>Counts?</th></tr>
          </thead>
          <tbody className="divide-y">
            {rewardTypes.map((t: any) => (
              <tr key={t.type}>
                <td className="py-1.5 pr-3 font-mono text-xs">{t.type || "(blank)"}</td>
                <td className="pr-3">{t.rows}</td>
                <td className="pr-3">{t.total}</td>
                <td><Pill ok={isCountedRewardType(t.type)} yes="Yes" no="No, old" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <HealthButton
          action="rewards"
          confirmText="Recalculate every customer's Rewards balance with the current rules? Balances that were too high will go down."
        />
      </Section>
    </div>
  );
}
