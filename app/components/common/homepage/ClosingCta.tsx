import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CONTAINER,
  EYEBROW_TEAL,
  H2,
  LEAD,
} from "./homeStyles";

const REASSURANCE = [
  "Free delivery on ₹399 and above",
  "Ships in 24 to 48 hours",
  "Prices include GST",
];

// The last ask before the newsletter: one place to start for the visitor who
// scrolled all the way down without choosing.
export function ClosingCta() {
  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className={CONTAINER}>
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#BDE3EA] bg-[#E6F4F6] px-5 py-8 text-center sm:px-10 sm:py-12">
          <span className={`${EYEBROW_TEAL} mb-2`}>Still deciding?</span>
          <h2 className={H2}>Tell us what you need. We will match it.</h2>
          <p className={`${LEAD} mx-auto mt-3 max-w-xl`}>
            Four quick questions point you to the right Ovy product and size,
            or go straight to everything we make.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/quiz" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              Find what I need <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/shop" className={`${BTN_SECONDARY} w-full sm:w-auto`}>
              Shop all products
            </Link>
          </div>

          <ul className="mt-6 flex flex-col items-center gap-2 text-[13px] text-[#1F1915] sm:flex-row sm:justify-center sm:gap-5 sm:text-sm">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-[#016271]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
