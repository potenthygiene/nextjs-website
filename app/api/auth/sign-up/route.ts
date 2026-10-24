/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { referralCoinHistory, rewardCoinsHistory, users } from "@/db/schema";
import { cognito, cognitoAdminGetUser, cognitoSignUp } from "@/helper/cognito";
import { AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { USER_POOL_ID } from "@/env";
import { allowRequest, clientIp } from "@/lib/requestGuard";
import { generateUniqueReferralCode } from "@/lib/referralCode";
import {
  REFERRAL_EARNING_RUPEES,
  REFERRAL_FRIEND_BONUS_RUPEES,
  SIGNUP_BONUS_RUPEES,
} from "@/lib/rewards";
import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";

// Nothing about an account is trusted until its email is confirmed with the
// code. If an unconfirmed account already exists for this email (an earlier
// attempt that was never finished, or someone else typing this email), the
// person signing up now takes it over: fresh code, their own name, phone and
// referral. So nobody can lock the real owner out or squat their email.
const BAD_REF = "This referral code can't be used for this account.";

async function findReferrer(ref: string) {
  const cleanRef = ref.trim();
  let found = await db
    .select()
    .from(users)
    .where(sql`lower(${users.referralCode}) = lower(${cleanRef})`);
  if (
    !found.length &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanRef)
  ) {
    found = await db.select().from(users).where(eq(users.id, cleanRef));
  }
  return found[0] || null;
}

async function addReferral(newUser: any, referrer: any, name: string) {
  await db.insert(rewardCoinsHistory).values({
    userId: newUser.id,
    coins: REFERRAL_FRIEND_BONUS_RUPEES,
    type: "referral_welcome",
  });
  // The referrer's ₹100 is paid once this friend's first order is delivered.
  await db.insert(referralCoinHistory).values({
    userId: referrer.id,
    coins: REFERRAL_EARNING_RUPEES,
    newUserName: name,
    newUserId: newUser.id,
    type: "referral",
  });
}

export async function POST(req: Request) {
  if (!allowRequest(`signup:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const { email, password, name, phone, ref } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    let referrer: any = null;
    if (ref && typeof ref === "string" && ref.trim()) {
      referrer = await findReferrer(ref);
      const isSelf =
        referrer &&
        (referrer.email?.toLowerCase() === String(email).toLowerCase() ||
          (phone && referrer.phone === phone));
      if (!referrer || isSelf) {
        return NextResponse.json({ message: BAD_REF }, { status: 400 });
      }
    }

    let existing: any = null;
    try {
      existing = await cognitoAdminGetUser({ email });
    } catch (error: any) {
      if (error?.__type !== "UserNotFoundException" && error?.name !== "UserNotFoundException") throw error;
    }

    if (existing?.UserStatus === "CONFIRMED" || existing?.UserStatus === "EXTERNAL_PROVIDER") {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in." },
        { status: 409 },
      );
    }

    if (existing) {
      await cognito.send(new AdminDeleteUserCommand({ UserPoolId: USER_POOL_ID, Username: email }));
    }

    const cognitoRes = await cognitoSignUp({
      email,
      password,
      userAttribute: [{ Name: "email", Value: email }],
    });
    const cognitoId = cognitoRes.UserSub;
    if (!cognitoId) throw new Error("Sign-up failed. Please try again.");

    const safeName = String(name || "New User").trim().slice(0, 80);
    const safePhone = String(phone || "0000000000").slice(0, 15);

    const [dbUser] = await db.select().from(users).where(eq(users.email, email));
    let userRow: any = dbUser;

    if (!dbUser) {
      const generatedCode = await generateUniqueReferralCode(db, safeName);
      [userRow] = await db
        .insert(users)
        .values({
          name: safeName,
          email,
          phone: safePhone,
          cognitoId,
          referralCode: generatedCode,
          rewardOrderCoins: SIGNUP_BONUS_RUPEES + (referrer ? REFERRAL_FRIEND_BONUS_RUPEES : 0),
          referralCoins: 0,
        })
        .returning();
      await db.insert(rewardCoinsHistory).values({
        userId: userRow.id,
        coins: SIGNUP_BONUS_RUPEES,
        type: "signup_bonus",
      });
      if (referrer && referrer.id !== userRow.id) await addReferral(userRow, referrer, safeName);
    } else if (!dbUser.isEmailVerified) {
      // An unfinished sign-up: replace whatever it held with this person's details.
      [userRow] = await db
        .update(users)
        .set({ name: safeName, phone: safePhone, cognitoId, updatedAt: new Date() })
        .where(eq(users.id, dbUser.id))
        .returning();
      await db
        .delete(rewardCoinsHistory)
        .where(and(eq(rewardCoinsHistory.userId, dbUser.id), eq(rewardCoinsHistory.type, "referral_welcome")));
      await db.delete(referralCoinHistory).where(eq(referralCoinHistory.newUserId, dbUser.id));
      if (referrer && referrer.id !== dbUser.id) await addReferral(userRow, referrer, safeName);
    } else {
      await db.update(users).set({ cognitoId }).where(eq(users.id, dbUser.id));
    }

    return NextResponse.json(
      {
        message: "We've sent a code to your email.",
        data: { userId: userRow.id, email },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error?.message || "Sign-up failed. Please try again." },
      { status: 500 },
    );
  }
}
