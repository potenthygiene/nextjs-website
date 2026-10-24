import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarHeart } from "lucide-react";
import { CONTAINER, EYEBROW_TEAL, H2, HOME_HEAD_MB, HOME_Y, LEAD } from "./homeStyles";

// Shop by brand: the two ranges side by side, short enough on a phone that
// the bestsellers start on the next screen. The third tile is the free
// Period Tracker, which is live, for the visitor who came to learn.
export function BrandAccordion() {
  return (
    <section className={`w-full border-b border-gray-100 bg-[#f4f1ec] ${HOME_Y}`}>
      <div className={CONTAINER}>
        <div className={`${HOME_HEAD_MB} space-y-2 text-center sm:space-y-3`}>
          <span className={EYEBROW_TEAL}>One house, two ranges</span>
          <h2 className={H2}>
            Periods, handled.<br className="sm:hidden" /> Journeys, handled.
          </h2>
          <p className={`${LEAD} mx-auto hidden max-w-2xl sm:block`}>
            Two ranges with one promise between them: nothing about your body
            should ever make you pause your life.
          </p>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 sm:gap-6 lg:gap-8">
          {/* Ovy */}
          <Link
            href="/ovy#products"
            className="group relative flex flex-col justify-between rounded-2xl border border-purple-100/50 bg-[#f5e7eb] p-4 transition-shadow duration-300 hover:shadow-xl sm:min-h-[300px] sm:rounded-[28px] sm:p-6 lg:p-8"
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="flex h-9 items-center sm:h-14">
                <Image
                  src="/brand/ovy-mark.png"
                  alt="Ovy"
                  width={140}
                  height={80}
                  className="h-8 w-auto object-contain sm:h-12"
                />
              </div>
              <h3 className="font-serif text-[15px] leading-snug font-bold text-[#1F1915] sm:text-2xl">
                Period and intimate care
              </h3>
              <p className="text-[13px] leading-snug text-[#5C524D] sm:text-base sm:leading-relaxed">
                <span className="sm:hidden">Pads, teen kits, cup and liners.</span>
                <span className="hidden sm:inline">
                  Organic pads sized to your real flow, first-period kits, a
                  reusable cup and daily liners.
                </span>
              </p>
            </div>

            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#7E4D77] px-3 text-sm font-semibold text-white transition-colors group-hover:bg-[#602E55] sm:mt-6 sm:w-fit sm:px-6 sm:text-[15px]">
              Shop Ovy
              <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden />
            </span>
          </Link>

          {/* Looway */}
          <Link
            href="/looway"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-teal-100/50 bg-[#E6F4F6] p-4 pt-5 transition-shadow duration-300 hover:shadow-xl sm:min-h-[300px] sm:rounded-[28px] sm:p-6 lg:p-8"
          >
            {/* Looway checkerboard */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-[repeating-linear-gradient(45deg,#016271,#016271_10px,#E5C158_10px,#E5C158_20px)] opacity-90 sm:h-3" />

            <div className="space-y-2 sm:space-y-3">
              <div className="flex h-9 items-center sm:h-14">
                <Image
                  src="/brand/looway-mark.png"
                  alt="Looway"
                  width={160}
                  height={70}
                  className="h-8 w-auto object-contain sm:h-12"
                />
              </div>
              <h3 className="font-serif text-[15px] leading-snug font-bold text-[#1F1915] sm:text-2xl">
                Travel and everyday hygiene
              </h3>
              <p className="text-[13px] leading-snug text-[#5C524D] sm:text-base sm:leading-relaxed">
                <span className="sm:hidden">Pee funnel, seat covers, pee and puke bags.</span>
                <span className="hidden sm:inline">
                  A stand-to-pee funnel, seat covers, pee and puke bags for
                  motion sickness and morning sickness, and a build-your-own
                  Yatra Kit. Bags and seat covers for all genders and all ages.
                </span>
              </p>
            </div>

            <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#016271] px-3 text-sm font-semibold text-white transition-colors group-hover:bg-[#004851] sm:mt-6 sm:w-fit sm:px-6 sm:text-[15px]">
              Shop Looway
              <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden />
            </span>
          </Link>

          {/* Free Period Tracker (live), with the Wellness Hub still to come */}
          <Link
            href="/period-log"
            className="group col-span-2 flex flex-row items-center justify-between gap-4 rounded-2xl border border-amber-100/60 bg-[#f4eee2] p-4 transition-shadow duration-300 hover:shadow-xl md:col-span-1 md:min-h-[300px] md:flex-col md:items-start md:rounded-[28px] md:p-6 lg:p-8"
          >
            <div className="flex items-start gap-3 md:block md:space-y-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#016271] md:h-14 md:w-14">
                <CalendarHeart className="h-5 w-5 md:h-7 md:w-7" aria-hidden />
              </span>
              <div className="space-y-1 md:space-y-2">
                <h3 className="font-serif text-[15px] leading-snug font-bold text-[#1F1915] sm:text-2xl">
                  Free Period Tracker
                </h3>
                <p className="text-[13px] leading-snug text-[#5C524D] sm:text-base sm:leading-relaxed">
                  See your next periods in seconds.
                  <span className="hidden md:inline">
                    {" "}More free tools are coming in the Wellness Hub. Our
                    tools guide you. They do not diagnose.
                  </span>
                </p>
              </div>
            </div>

            <span className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-[#016271] bg-white px-4 text-sm font-semibold text-[#016271] transition-colors group-hover:bg-[#E6F4F6] md:w-fit md:px-6 md:text-[15px]">
              Try it
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
