import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BTN_SHAPE, CONTAINER, EYEBROW, HOME_Y, SECTION_Y } from "./homeStyles";

interface PadSharedImpactProps {
  bgColor?: string;
  badgeColor?: string;
  buttonTextColor?: string;
  /** Homepage layout: two columns on desktop and tighter padding. */
  compact?: boolean;
}

export function PadSharedImpact({
  bgColor = "#016271",
  badgeColor = "#76D2DC",
  buttonTextColor = "#016271",
  compact = false,
}: PadSharedImpactProps) {
  const partner = (
    <p className={`${compact ? "mb-5" : "mb-8"} text-[13px] text-white/80 sm:text-sm`}>
      In partnership with{" "}
      <span className="font-semibold text-white">
        Roshni Manav Utthaan Sansthaan
      </span>{" "}
      · Reg. 580/Jaipur/1997-98
    </p>
  );

  const button = (
    <Link
      href="/ovy"
      className={`${BTN_SHAPE} w-full bg-white px-6 text-[15px] shadow-md hover:bg-white/90 sm:w-auto sm:px-8 sm:text-base`}
      style={{ color: buttonTextColor }}
    >
      Shop Ovy pads <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );

  if (compact) {
    // Homepage: the same words, side by side on desktop.
    return (
      <section className={`${HOME_Y} text-white`} style={{ backgroundColor: bgColor }}>
        <div className={`${CONTAINER} grid grid-cols-1 items-center gap-5 text-center lg:grid-cols-2 lg:gap-12 lg:text-left`}>
          <div>
            <span className={`${EYEBROW} mb-3`} style={{ color: badgeColor }}>
              Every order gives back
            </span>
            <h2 className="mb-3 font-serif text-[26px] leading-[1.15] font-bold text-white sm:text-4xl lg:text-[44px]">
              A pad bought is a pad shared.
            </h2>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base lg:mx-0">
              A portion of every Ovy order goes to Roshni Manav Utthaan Sansthaan,
              which puts safe, organic period products into the hands of girls and
              women who cannot afford them.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-white/20 lg:pl-12">
            <p className="mb-3 font-serif text-xl font-normal text-white italic sm:text-2xl md:text-3xl">
              So she can have her period with dignity.
            </p>
            {partner}
            {button}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${SECTION_Y} text-white`} style={{ backgroundColor: bgColor }}>
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        {/* BADGE */}
        <span
          className={`${EYEBROW} mb-3`}
          style={{ color: badgeColor }}
        >
          Every order gives back
        </span>

        {/* TITLE */}
        <h2 className="mb-4 font-serif text-[26px] leading-[1.15] font-bold text-white sm:text-4xl lg:text-[44px]">
          A pad bought is a pad shared.
        </h2>

        {/* SUBTITLE */}
        <p className="mx-auto mb-6 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base">
          A portion of every Ovy order goes to Roshni Manav Utthaan Sansthaan,
          which puts safe, organic period products into the hands of girls and
          women who cannot afford them.
        </p>

        {/* ITALIC SCRIPT QUOTE */}
        <p className="my-2 font-serif text-xl font-normal text-white italic sm:text-2xl md:text-3xl">
          So she can have her period with dignity.
        </p>

        {/* DIVIDER */}
        <div className="w-full max-w-lg border-t border-white/20 my-6" />

        {/* PARTNERSHIP FOOTER */}
        {partner}

        {/* BUTTON */}
        {button}
      </div>
    </section>
  );
}
