// @ts-nocheck
import { NextResponse } from "next/server";
import { runRenewalCheck } from "@/lib/renewalCheck";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorizedCron(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;

  const authHeader = req.headers.get("authorization");
  const cronHeader = req.headers.get("x-cron-secret");

  return authHeader === `Bearer ${cronSecret}` || cronHeader === cronSecret;
}

async function handler(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized cron request" },
      { status: 401 },
    );
  }
  return NextResponse.json(await runRenewalCheck());
}

export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}
