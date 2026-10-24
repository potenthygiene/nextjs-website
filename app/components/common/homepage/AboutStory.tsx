import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BTN_BASE, CONTAINER, EYEBROW, H2, H2_CARD, LEAD, SECTION_Y } from "./homeStyles";

interface AboutStoryProps {
  bgColor?: string;
  kickerColor?: string;
  accentColor?: string;
  buttonColor?: string;
  imageSrc?: string;
  hideOnMobile?: boolean;
  className?: string;
  /** Show "How Cycle-Sync works" next to the main button. */
  showCycleSyncLink?: boolean;
  /** "card" renders a compact card with a small photo, for the homepage,
   * where it sits beside the cup card. */
  variant?: "band" | "card";
}

const AboutStory: React.FC<AboutStoryProps> = ({
  bgColor = "#F5EEF6",
  kickerColor = "#7E4D77",
  accentColor = "#7E4D77",
  buttonColor = "#7E4D77",
  imageSrc = "/product-images/pads-l.jpg",
  hideOnMobile = false,
  className = "",
  showCycleSyncLink = true,
  variant = "band",
}) => {
  const isCard = variant === "card";
  const steps = [
    {
      n: "01",
      title: "Pick your lengths",
      body: "L 240mm, XL 280mm and XL+ 320mm, in any mix that adds up to 21.",
    },
    {
      n: "02",
      title: "Liners included",
      body: "Four Ovy daily liners go into every box.",
    },
    {
      n: "03",
      title: "Time it to your cycle",
      body: "Enter three dates once. The box arrives about 5 days before your period, every cycle. Pause or cancel any time.",
    },
  ];

  const lead = (
    <p className={`${LEAD} max-w-xl ${isCard ? "mb-4" : "mb-5"}`}>
      Build one 21-pad box across L, XL and XL+ in any combination, with
      4 liners always included. Then let Cycle-Sync land it about 5 days
      before you are due. It is the first period delivery in India timed
      to your own cycle.
    </p>
  );

  // 3 numbered steps
  const stepList = (
    <div className={`${isCard ? "mb-5" : "mb-6"} flex flex-col divide-y divide-purple-200/60 border-t border-b border-purple-200/60`}>
      {steps.map((step) => (
        <div
          key={step.n}
          className={`flex items-start gap-4 ${isCard ? "py-2.5 sm:py-3" : "py-3 sm:py-4"}`}
        >
          <span
            className="shrink-0 pt-0.5 font-serif text-base font-bold sm:text-lg"
            style={{ color: accentColor }}
          >
            {step.n}
          </span>
          <div className="flex flex-col">
            <h3 className="mb-0.5 text-[15px] font-bold text-[#1F1915] sm:text-base">
              {step.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-[#5C524D] sm:text-sm">
              {step.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // One primary, one secondary
  const actions = (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href="/product-detail/ovy-pads#mix"
        className={`${BTN_BASE} w-full text-white shadow-sm hover:opacity-90 sm:w-auto`}
        style={{ backgroundColor: buttonColor }}
      >
        <span>Build your box</span>
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      {showCycleSyncLink && (
        <Link
          href="/product-detail/ovy-pads?plan=cycleSync#cycle-sync"
          className={`${BTN_BASE} w-full border-2 bg-white sm:w-auto`}
          style={{ borderColor: buttonColor, color: buttonColor }}
        >
          How Cycle-Sync works
        </Link>
      )}
    </div>
  );

  if (isCard) {
    return (
      <article
        className={`flex h-full flex-col rounded-3xl border border-purple-100/60 p-5 sm:p-7 ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className="mb-3 flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white bg-white shadow-sm sm:h-24 sm:w-24">
            <Image
              src={imageSrc}
              alt="Ovy Regular Flow Sanitary Pads Box"
              fill
              className="object-cover object-center"
              sizes="96px"
            />
          </div>
          <div className="min-w-0">
            <span
              className={`${EYEBROW} mb-1.5`}
              style={{ color: kickerColor }}
            >
              Only at Ovy
            </span>
            <h2 className={H2_CARD}>
              <span className="block">Your flow is not the same every day.</span>
              <span className="block" style={{ color: accentColor }}>
                Your box should not be either.
              </span>
            </h2>
          </div>
        </div>
        {lead}
        {stepList}
        <div className="mt-auto">{actions}</div>
      </article>
    );
  }

  return (
    <section
      className={`${hideOnMobile ? "hidden md:block" : ""} w-full overflow-hidden ${SECTION_Y} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-14">
          {/* LEFT IMAGE CONTAINER */}
          <div className="flex justify-center lg:col-span-5">
            <div className="group relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-3xl border border-purple-100/60 shadow-xl sm:aspect-square sm:rounded-[2.5rem] lg:max-w-lg">
              <Image
                src={imageSrc}
                alt="Ovy Regular Flow Sanitary Pads Box"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col text-left lg:col-span-7">
            <span
              className={`${EYEBROW} mb-2 sm:mb-3`}
              style={{ color: kickerColor }}
            >
              Only at Ovy
            </span>

            <h2 className={`${H2} mb-3`}>
              <span className="block">
                Your flow is not the same every day.
              </span>
              <span className="mt-0.5 block" style={{ color: accentColor }}>
                Your box should not be either.
              </span>
            </h2>

            {lead}
            {stepList}
            {actions}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
