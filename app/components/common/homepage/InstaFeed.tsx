"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEED_IMAGES = [
  {
    id: "1",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_3.jpg",
    alt: "What a period is not",
  },
  {
    id: "2",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_4.jpg",
    alt: "Period cramps surviving the apocalypse",
  },
  {
    id: "3",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_5.jpg",
    alt: "Period cramps eat these foods",
  },
  {
    id: "4",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_1.jpg",
    alt: "On my period wake up and cry together",
  },
  {
    id: "5",
    src: "https://dw0n4qiceose7.cloudfront.net/website-images/insta_2.jpg",
    alt: "When period cramps hit so bad comfort pose",
  },
];

// Quadruple items to ensure seamless infinite loop marquee without empty gaps on large screens
const CAROUSEL_ITEMS = [...FEED_IMAGES, ...FEED_IMAGES, ...FEED_IMAGES, ...FEED_IMAGES];

type Props = {
  title?: string;
  username?: string;
  theme?: "pink" | "teal";
  bgColor?: string;
  kickerColor?: string;
  headingColor?: string;
  buttonBorderColor?: string;
  buttonTextColor?: string;
  buttonHoverBg?: string;
  buttonHoverText?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  buttonColor?: string;
};

export function InstagramFeed({
  title = "Join the Potent circle.",
  username = "@POTENTHYGIENE",
  theme = "teal",
  bgColor,
  kickerColor,
  headingColor,
  buttonBorderColor,
  buttonTextColor,
  buttonHoverBg,
  buttonHoverText,
}: Props) {
  const isPink = theme === "pink";

  const sectionBg = bgColor || (isPink ? "bg-[#F7E8F2]" : "bg-[#EBF7F8]");
  const kickerCls = kickerColor || (isPink ? "text-[#744c67]" : "text-[#006573]");
  const headingCls = headingColor || "text-[#1F1915]";

  const btnBorderCls = buttonBorderColor || (isPink ? "border-[#744c67]" : "border-[#006573]");
  const btnTextCls = buttonTextColor || (isPink ? "text-[#744c67]" : "text-[#006573]");
  const btnHoverBgCls = buttonHoverBg || (isPink ? "hover:bg-[#744c67]" : "hover:bg-[#006573]");
  const btnHoverTextCls = buttonHoverText || "hover:text-white";
  const btnBgCls = isPink ? "bg-[#F7E8F2]" : "bg-[#EBF7F8]";

  return (
    <section
      className={`w-full overflow-hidden py-12 sm:py-16 lg:py-20 ${
        sectionBg.startsWith("#") ? "" : sectionBg
      }`}
      style={sectionBg.startsWith("#") ? { backgroundColor: sectionBg } : undefined}
    >
      <div className="w-full text-center">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10 space-y-2">
          <span
            className={`block text-[11px] font-bold tracking-[0.14em] uppercase sm:text-xs ${kickerCls}`}
          >
            {username}
          </span>

          <h2
            className={`px-4 font-serif text-[26px] leading-[1.15] font-bold sm:text-4xl lg:text-[44px] ${headingCls}`}
          >
            {title}
          </h2>
        </div>

        {/* INFINITE MARQUEE CAROUSEL */}
        <div className="w-full overflow-hidden py-3">
          <div
            className="flex w-max items-center gap-4 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none sm:gap-6"
            style={{ animationDuration: "50s" }}
          >
            {CAROUSEL_ITEMS.map((img, idx) => (
              <a
                key={`${img.id}-${idx}`}
                href="https://www.instagram.com/potenthygiene/"
                target="_blank"
                rel="noreferrer"
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xs border border-white/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square w-44 sm:w-60 md:w-64 shrink-0 group block cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 240px, 256px"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center pt-8 sm:pt-10">
          <Link
            href="https://www.instagram.com/potenthygiene/"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 ${btnBorderCls} ${btnTextCls} ${btnBgCls} ${btnHoverBgCls} ${btnHoverTextCls} px-6 text-[15px] font-semibold shadow-2xs transition-colors duration-300`}
          >
            <span>Follow {username.toLowerCase()}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

