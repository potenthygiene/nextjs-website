/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { users } from "@/db/schema";
import { cognitoForgotPassword } from "@/helper/cognito";
import { allowRequest, clientIp } from "@/lib/requestGuard";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// The same answer whether or not an account exists, so this can't be used to
// find out who shops with us. Limited per address and per email.
const SENT = "If an account exists for this email, we've sent a reset code to it.";

export async function POST(req: Request) {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    if (!email) {
        return NextResponse.json({ error: "Please enter your email." }, { status: 400 });
    }
    if (
        !allowRequest(`forgot:${clientIp(req)}`, 8, 15 * 60 * 1000) ||
        !allowRequest(`forgot:${email.toLowerCase()}`, 3, 15 * 60 * 1000)
    ) {
        return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
    }
    try {
        const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
        if (user) await cognitoForgotPassword({ email });
    } catch (err: any) {
        console.error("ForgotPassword error:", err?.name || err);
    }
    return NextResponse.json({ message: SENT, delivery: null }, { status: 200 });
}
