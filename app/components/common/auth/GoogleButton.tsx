"use client";

// "Continue with Google". Hidden until NEXT_PUBLIC_GOOGLE_SIGNIN is "on"
// (set it once Google is added to the Cognito app client and COGNITO_DOMAIN is set).

export const GOOGLE_SIGNIN_ON = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN === "on";

const ERRORS: Record<string, string> = {
  google_unavailable: "Google sign-in isn't available right now. Please use your email.",
  google_failed: "Google sign-in didn't finish. Please try again, or use your email.",
  google_no_email: "Your Google account didn't share an email address. Please use your email.",
};

export function GoogleButton({ redirect, refCode, error }: { redirect?: string | null; refCode?: string | null; error?: string | null }) {
  const message = error ? ERRORS[error] : null;
  if (!GOOGLE_SIGNIN_ON) return message ? <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</p> : null;
  const qs = new URLSearchParams();
  if (redirect) qs.set("redirect", redirect);
  if (refCode) qs.set("ref", refCode);
  return (
    <div className="mb-4">
      {message && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</p>}
      <a
        href={`/api/auth/google${qs.toString() ? `?${qs}` : ""}`}
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
      >
        <svg aria-hidden width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z" />
        </svg>
        Continue with Google
      </a>
      <div className="my-3 flex items-center gap-3 text-[11px] uppercase tracking-wider text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        or with email
        <span className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}
