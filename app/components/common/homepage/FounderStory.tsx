import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CONTAINER,
  EYEBROW_TEAL,
  H2,
  LEAD,
  SECTION_Y,
} from "./homeStyles";

export function FounderStory() {
  return (
    <section className={`bg-[#F8F6F1] ${SECTION_Y}`}>
      <div className={CONTAINER}>
        {/* Mobile Header Layout (< lg): Circular Avatar Left + Header Right */}
        <div className="mb-4 flex items-start gap-4 lg:hidden">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
            <Image
              src="/divitaji.jpg"
              alt="Divita Agarwal, founder of Potent Hygiene"
              fill
              className="object-cover object-top"
              sizes="80px"
            />
          </div>
          <div>
            <span className={`${EYEBROW_TEAL} mb-1`}>Our story</span>
            <h2 className="font-serif text-[22px] leading-[1.15] font-bold text-[#1F1915]">
              Made by a woman who needed it herself.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-14">
          {/* Desktop Left Image (lg:block, hidden on mobile < lg) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl shadow-sm lg:max-w-none">
              <Image
                src="/divitaji.jpg"
                alt="Divita Agarwal, founder of Potent Hygiene"
                width={600}
                height={700}
                className="h-auto w-full rounded-3xl object-cover"
              />
            </div>
          </div>

          {/* Content Container */}
          <div className="space-y-3 sm:space-y-5 lg:col-span-7">
            {/* Desktop Header Badge & Title (hidden on mobile < lg) */}
            <div className="hidden lg:block">
              <span className={`${EYEBROW_TEAL} mb-3`}>Our story</span>
              <h2 className={H2}>
                Made by a woman who needed it herself.
              </h2>
            </div>

            {/* Quote */}
            <p className="font-serif text-[17px] leading-relaxed font-medium text-[#016271] italic sm:text-xl lg:text-2xl">
              “I wanted the products I kept wishing existed: gentle on the body,
              honest on the label, and ready for the toilets we actually meet in
              India.”
            </p>

            {/* Paragraph (Desktop only) */}
            <p className={`${LEAD} hidden sm:block`}>
              Divita Agarwal founded Potent Hygiene in Jaipur with one idea:
              hygiene should fit real Indian lives, from a first period at
              school to a long train journey. Today Ovy looks after periods and
              Looway looks after journeys, both made in India and both built to
              be trusted.
            </p>

            {/* Founder Signature / Info */}
            <div className="pt-1">
              <p className="text-[15px] font-bold text-[#1F1915] sm:text-base">
                Divita Agarwal
              </p>
              <p className="text-[13px] text-[#5C524D]">
                Founder, Potent Hygiene
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link href="/about" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
                Read our full story <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <span className="hidden sm:block">
                <Link href="/shop" className={BTN_SECONDARY}>
                  Shop the range
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
