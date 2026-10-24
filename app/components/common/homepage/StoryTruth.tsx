import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CONTAINER, EYEBROW_OVY, H2, HOME_Y, LEAD, SECTION_Y } from "./homeStyles";

type Props = {
  badgeText?: string;
  title?: string;
  highlight?: string;
  paragraphs?: string[];
  image?: string;
  primaryColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  bgAccent?: string;
  /** Homepage layout: tighter padding, shorter card images, and the
   * First Period Box as a slim strip under the two kits. */
  compact?: boolean;
};

const StoryTruth = ({ compact = false }: Props) => {
  const cardImage = compact
    ? "relative w-full aspect-[4/3] lg:aspect-[16/9] bg-purple-50"
    : "relative w-full aspect-[4/3] bg-purple-50";
  const cardBody = compact
    ? "p-3 sm:p-4 flex flex-col flex-1"
    : "p-3 sm:p-5 flex flex-col flex-1";
  return (
    <section className={`relative w-full overflow-hidden bg-[#F5EEF6] ${compact ? HOME_Y : SECTION_Y}`}>
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-1">
            <div>
              <span className={`${EYEBROW_OVY} mb-2 sm:mb-3`}>
                For mothers and daughters
              </span>

              <h2 className={H2}>
                Her first period,<br />
                <span className="font-caveat mt-1 inline-block text-[34px] font-normal tracking-wide text-[#7E4D77] sm:text-5xl lg:text-[52px]">
                  handled with love.
                </span>
              </h2>

              <p className={`${LEAD} mt-3 max-w-md sm:mt-5`}>
                The hardest part of a first period is the not knowing. So we chose everything in advance, wrote the guidebook she will actually read, and made the wrapper silent for school.
              </p>

              {/* Parents advice card */}
              <div className={`${compact ? "mt-5 p-5" : "mt-8 p-6"} hidden bg-white rounded-2xl shadow-xs border border-purple-100/60 max-w-md lg:block`}>
                <h3 className="mb-2 text-base font-bold text-[#1F1915]">
                  For parents: how to start the conversation
                </h3>
                <p className="text-sm leading-relaxed text-[#5C524D]">
                  You do not need the perfect words, just calm and open ones. Tell her it happens to everyone, there is no rush to have it all figured out, and she can always come to you.
                </p>
               
              </div>
            </div>

            <p className={`${compact ? "mt-4" : "mt-8"} hidden text-sm text-[#5C524D] lg:block`}>
              Gift mode at checkout hides the price and adds your note.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className={`flex flex-col gap-4 lg:col-span-7 ${compact ? "sm:gap-4" : "sm:gap-6"}`}>
            
            {/* First Period Box - Purple Banner */}
            <div
              className={`relative order-2 overflow-hidden rounded-2xl bg-[#7E4D77] p-5 text-white shadow-sm ${
                compact
                  ? "sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5"
                  : "sm:p-7 lg:order-1"
              }`}
            >
              <div>
                <span className="mb-1.5 block text-[11px] font-bold tracking-[0.14em] text-white/80 uppercase sm:mb-2 sm:text-xs">
                  The milestone gift
                </span>
                <h3 className="mb-1.5 font-serif text-xl font-bold text-white sm:mb-2 sm:text-2xl">
                  First Period Box
                </h3>
                <p className={`mb-4 max-w-xl text-sm leading-relaxed text-white/90 ${compact ? "sm:mb-0" : "sm:mb-5"}`}>
                  Pads in three sizes, period panties, seat covers, wipes, disposal bags and the “You’ve Got This” guidebook, written for her.
                </p>
              </div>
              <span className="inline-block shrink-0 rounded-full bg-[#602E55] px-3.5 py-1.5 text-[13px] font-semibold text-white">
                Coming soon
              </span>
            </div>

            {/* Product Cards (Side-by-Side on Mobile) */}
            <div className={`order-1 grid grid-cols-2 gap-3 ${compact ? "sm:gap-4" : "sm:gap-6 lg:order-2"}`}>
              
              {/* Card 1: Starter Pack */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full border border-purple-100/60">
                <div className={cardImage}>
                  <Image
                    src="/product-images/teen.jpg"
                    alt="Starter Pack"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className={cardBody}>
                  <span className="mb-1 block text-[11px] leading-tight font-bold tracking-wide text-[#7E4D77] uppercase">
                    BIG CHANGES NEED A GENTLE START
                  </span>
                  <h4 className="mb-1 font-serif text-base font-bold text-[#1F1915] sm:text-lg">
                    Starter Pack
                  </h4>
                  <p className="mb-3 flex-1 text-[13px] leading-snug text-[#5C524D] sm:text-sm">
                    10 L and 11 XL pads plus 4 liners. Two sizes, so she learns her own flow from day one.
                  </p>
                  <Link
                    href="/product-detail/ovy-teen?kit=STARTER#starter"
                    className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border-2 border-[#7E4D77] bg-white px-3 text-sm font-semibold text-[#7E4D77] transition-colors hover:bg-[#F5EEF6]"
                  >
                    Shop Starter
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>

              {/* Card 2: Pro-Active Pack */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full border border-purple-100/60">
                <div className={cardImage}>
                  <Image
                    src="/product-images/teen-pro.jpg"
                    alt="Pro-Active Pack"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className={cardBody}>
                  <span className="mb-1 block text-[11px] leading-tight font-bold tracking-wide text-[#7E4D77] uppercase">
                    BLEED. CONQUER. SLAY.
                  </span>
                  <h4 className="mb-1 font-serif text-base font-bold text-[#1F1915] sm:text-lg">
                    Pro-Active Pack
                  </h4>
                  <p className="mb-3 flex-1 text-[13px] leading-snug text-[#5C524D] sm:text-sm">
                    Three sizes, sport-tested wings and sweat-wicking fibres. For the girl who will not hit pause.
                  </p>
                  <Link
                    href="/product-detail/ovy-teen?kit=PRO#pro"
                    className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border-2 border-[#7E4D77] bg-white px-3 text-sm font-semibold text-[#7E4D77] transition-colors hover:bg-[#F5EEF6]"
                  >
                    Shop Pro-Active
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default StoryTruth;
