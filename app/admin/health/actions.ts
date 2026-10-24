"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/helper/auth/guard";
import { syncAndGetUserRewards } from "@/lib/rewards";
import { runRenewalCheck } from "@/lib/renewalCheck";
import { sendEmail } from "@/lib/email";

/** Recalculate every customer's Rewards balance with the current rules. */
export async function recalculateAllRewards() {
  await requireAdmin();
  const all = await db.select({ id: users.id, before: users.rewardOrderCoins }).from(users);
  let changed = 0;
  let failed = 0;
  for (const u of all) {
    try {
      const { balance } = await syncAndGetUserRewards(u.id);
      if (Number(u.before ?? 0) !== balance) changed++;
    } catch {
      failed++;
    }
  }
  revalidatePath("/admin/health");
  return { checked: all.length, changed, failed };
}

/** Check every running subscription with Razorpay now (it also runs daily). */
export async function checkRenewalsNow() {
  await requireAdmin();
  try {
    const out: any = await runRenewalCheck();
    const made = (out.results || []).filter((r: any) =>
      (r.actions || []).some((a: any) => a.action === "subscription_charged"),
    ).length;
    revalidatePath("/admin/health");
    return { ok: true, checked: out.checked, ordersMade: made };
  } catch (e: any) {
    return { ok: false, message: e?.message || "The check could not run." };
  }
}

/** Send one test email to the signed-in admin, to prove site emails work. */
export async function sendTestEmail() {
  const admin = await requireAdmin();
  try {
    await sendEmail({
      to: String(admin.email),
      subject: "Potent Hygiene: test email from the website",
      html: "<p>This is a test from Admin, Site health. If it reached your inbox (not spam), site emails are working.</p>",
    });
    return { ok: true, to: admin.email };
  } catch (e: any) {
    return { ok: false, message: e?.message || "Sending failed." };
  }
}
