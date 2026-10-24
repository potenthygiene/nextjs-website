"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { checkRenewalsNow, recalculateAllRewards, sendTestEmail } from "./actions";

const ACTIONS = {
  renewals: {
    label: "Check renewals now",
    run: checkRenewalsNow,
    done: (r: any) =>
      r.ok ? `Checked ${r.checked} subscriptions. Orders made for missed renewals: ${r.ordersMade}.` : r.message,
  },
  rewards: {
    label: "Recalculate all Rewards balances",
    run: recalculateAllRewards,
    done: (r: any) => `Checked ${r.checked} customers. Balances changed: ${r.changed}. Could not check: ${r.failed}.`,
  },
  email: {
    label: "Send me a test email",
    run: sendTestEmail,
    done: (r: any) => (r.ok ? `Sent to ${r.to}. Check it arrived in the inbox, not spam.` : r.message),
  },
} as const;

export function HealthButton({ action, confirmText }: { action: keyof typeof ACTIONS; confirmText?: string }) {
  const a = ACTIONS[action];
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          if (confirmText && !window.confirm(confirmText)) return;
          setBusy(true);
          setNote(null);
          try {
            setNote(a.done(await a.run()));
          } catch (e: any) {
            setNote(e?.message || "Something went wrong.");
          } finally {
            setBusy(false);
          }
        }}
        className="w-fit rounded-full bg-[#016271] px-4 py-2 text-sm font-semibold text-white hover:bg-[#014d59] disabled:opacity-60"
      >
        {busy ? "Working..." : a.label}
      </button>
      {note && <p className="text-sm text-ink">{note}</p>}
    </div>
  );
}
