// "Continue with Google": sends the shopper to Cognito's hosted sign-in with
// Google picked, and comes back to /api/auth/google/callback.
// Needs COGNITO_DOMAIN (for example https://potent.auth.ap-south-1.amazoncognito.com)
// and Google added as an identity provider on the Cognito app client.

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const domain = process.env.COGNITO_DOMAIN?.replace(/\/$/, "");
  const clientId = process.env.COGNITO_CLIENT_ID;
  if (!domain || !clientId) {
    return NextResponse.redirect(new URL("/login?error=google_unavailable", url.origin));
  }

  // Only same-site paths may be returned to.
  const redirect = url.searchParams.get("redirect") || "";
  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "";
  const ref = (url.searchParams.get("ref") || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 50);
  const state = randomBytes(16).toString("hex");

  const authorize = new URL(`${domain}/oauth2/authorize`);
  authorize.searchParams.set("identity_provider", "Google");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/auth/google/callback`);
  authorize.searchParams.set("scope", "openid email profile");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize);
  res.cookies.set("google_oauth", JSON.stringify({ state, redirect: safeRedirect, ref }), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
