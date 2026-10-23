"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contactUs, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/helper/auth/session";
import { allowRequest } from "@/lib/requestGuard";

// Saves a question the chat could not answer, so the team can add an answer.
// It lands in Admin → Contact Us as "CHAT QUESTION". Emails and phone
// numbers are removed first so no personal details are stored.
export async function logChatQuestion(question: string, page: string) {
  const text = String(question || "")
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email removed]")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, "[number removed]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  if (text.length < 3) return;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowRequest(`chatlog:${ip}`, 15, 60 * 60_000)) return;

  try {
    await db.insert(contactUs).values({
      name: "CHAT QUESTION",
      email: "chat@potenthygiene.com",
      message: `Asked on ${String(page || "/").slice(0, 80)}: ${text}`,
    });
  } catch (error) {
    console.error("Chat question log failed:", error);
  }
}

/** First name of the signed-in customer, so the chat can greet them. */
export async function getChatFirstName(): Promise<string | null> {
  try {
    const session = await getAuthSession({ refresh: false });
    const email = session.authenticated ? session.user?.email : null;
    if (!email) return null;
    const [row] = await db.select({ name: users.name }).from(users).where(eq(users.email, email)).limit(1);
    const first = row?.name?.trim().split(/\s+/)[0];
    return first ? first[0].toUpperCase() + first.slice(1) : null;
  } catch {
    return null;
  }
}
