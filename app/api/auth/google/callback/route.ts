// Back from Google (through Cognito): swap the code for tokens, make sure the
// customer has an account here (new accounts get the same joining credit and
// referral as email sign-ups), sign them in, then send them on. New accounts go
// to My profile to add a phone number, birthday and anniversary.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { referralCoinHistory, rewardCoinsHistory, users } from "@/db/schema";
import { setAuthCookies } from "@/helper/auth/session";
import { generateUniqueReferralCode } from "@/lib/referralCode";
import { REFERRAL_EARNING_RUPEES, REFERRAL_FRIEND_BONUS_RUPEES, SIGNUP_BONUS_RUPEES } from "@/lib/rewards";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (why: string) => NextResponse.redirect(new URL(`/login?error=${why}`, url.origin));

  const domain = process.env.COGNITO_DOMAIN?.replace(/\/$/, "");
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  if (!domain || !clientId) return fail("google_unavailable");

  const cookieStore = await cookies();
  let saved: { state?: string; redirect?: string; ref?: string } = {};
  try {
    saved = JSON.parse(cookieStore.get("google_oauth")?.value || "{}");
  } catch {}
  const code = url.searchParams.get("code");
  if (!code || !saved.state || saved.state !== url.searchParams.get("state")) return fail("google_failed");

  // Code → tokens.
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: `${url.origin}/api/auth/google/callback`,
  });
  const headers: Record<string, string> = { "Content-Type": "application/x-www-form-urlencoded" };
  if (clientSecret) headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  const tokenRes = await fetch(`${domain}/oauth2/token`, { method: "POST", headers, body });
  if (!tokenRes.ok) return fail("google_failed");
  const tokens = (await tokenRes.json()) as { id_token?: string; access_token?: string; refresh_token?: string };
  if (!tokens.id_token || !tokens.access_token) return fail("google_failed");

  const claims = (jwt.decode(tokens.id_token) || {}) as { email?: string; name?: string; given_name?: string; sub?: string };
  const email = String(claims.email || "").toLowerCase();
  if (!email || !claims.sub) return fail("google_no_email");

  // An account here for this email (created now if new).
  let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  let isNew = false;
  if (!user) {
    isNew = true;
    const name = (claims.name || claims.given_name || "New User").trim();
    const [referrer] = saved.ref ? await db.select().from(users).where(eq(users.referralCode, saved.ref)).limit(1) : [];
    const validReferral = !!referrer && referrer.email?.toLowerCase() !== email;
    const referralCode = await generateUniqueReferralCode(db, name);
    [user] = await db
      .insert(users)
      .values({
        name,
        email,
        phone: "0000000000",
        cognitoId: claims.sub,
        referralCode,
        isEmailVerified: true,
        rewardOrderCoins: SIGNUP_BONUS_RUPEES + (validReferral ? REFERRAL_FRIEND_BONUS_RUPEES : 0),
        referralCoins: 0,
      })
      .returning();
    await db.insert(rewardCoinsHistory).values({ userId: user.id, coins: SIGNUP_BONUS_RUPEES, type: "signup_bonus" });
    if (validReferral && referrer.id !== user.id) {
      await db.insert(rewardCoinsHistory).values({ userId: user.id, coins: REFERRAL_FRIEND_BONUS_RUPEES, type: "referral_welcome" });
      await db.insert(referralCoinHistory).values({
        userId: referrer.id,
        coins: REFERRAL_EARNING_RUPEES,
        newUserName: name,
        newUserId: user.id,
        type: "referral",
      });
    }
  }

  await setAuthCookies({ accessToken: tokens.access_token, idToken: tokens.id_token, refreshToken: tokens.refresh_token });
  const next = isNew ? "/dashboard/profile?welcome=1" : saved.redirect || "/";
  const res = NextResponse.redirect(new URL(next, url.origin));
  res.cookies.delete("google_oauth");
  return res;
}
