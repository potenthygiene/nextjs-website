// Birthday and anniversary dates for occasion coupons. Both are kept on the
// users table (added at runtime, like the birthday column) as "YYYY-MM-DD",
// and each can be set only once by the customer; changes go through support.

import { db } from "@/src/db";
import { sql } from "drizzle-orm";
import { ensureUserBirthdayColumn } from "@/lib/rewards";

let anniversaryColumnEnsured = false;

export async function ensureAnniversaryColumn() {
  if (anniversaryColumnEnsured) return;
  try {
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "anniversary" varchar`);
    anniversaryColumnEnsured = true;
  } catch (err) {
    console.warn("Could not ensure anniversary column on users:", err);
  }
}

export type Occasions = { birthday: string | null; anniversary: string | null };

export async function getUserOccasions(userId: string): Promise<Occasions> {
  if (!userId) return { birthday: null, anniversary: null };
  try {
    await ensureUserBirthdayColumn();
    await ensureAnniversaryColumn();
    const res = (await db.execute(sql`SELECT "birthday", "anniversary" FROM "users" WHERE "id" = ${userId} LIMIT 1`)) as unknown;
    const rows = (Array.isArray(res) ? res : (res as { rows?: unknown[] })?.rows ?? []) as { birthday?: unknown; anniversary?: unknown }[];
    return { birthday: rows[0]?.birthday ? String(rows[0].birthday) : null, anniversary: rows[0]?.anniversary ? String(rows[0].anniversary) : null };
  } catch {
    return { birthday: null, anniversary: null };
  }
}

const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Saves the anniversary once. Returns what is stored now. */
export async function setUserAnniversary(userId: string, value?: string | null): Promise<{ anniversary: string | null; locked: boolean }> {
  const clean = String(value || "").trim();
  const current = (await getUserOccasions(userId)).anniversary;
  if (current) return { anniversary: current, locked: true };
  if (!clean || !VALID_DATE.test(clean) || new Date(clean).getTime() > Date.now()) return { anniversary: null, locked: false };
  await ensureAnniversaryColumn();
  await db.execute(sql`UPDATE "users" SET "anniversary" = ${clean} WHERE "id" = ${userId}`);
  return { anniversary: clean, locked: true };
}

/** Month number (1 to 12) of a stored date, or null. */
export const monthOf = (date?: string | null) => {
  if (!date || !VALID_DATE.test(date)) return null;
  return Number(date.slice(5, 7));
};

/** Today's month in India. */
export const indiaMonth = (now = new Date()) => Number(now.toLocaleDateString("en-GB", { month: "numeric", timeZone: "Asia/Kolkata" }));
export const indiaYear = (now = new Date()) => Number(now.toLocaleDateString("en-GB", { year: "numeric", timeZone: "Asia/Kolkata" }));

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
