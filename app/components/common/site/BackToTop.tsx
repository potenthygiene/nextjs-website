"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

// Where the button sits in the right-hand stack of floating buttons.
// Bottom to top: Potent Saathi chat (56px), WhatsApp (48px), then this (40px),
// always 12px clear of the button below it. On phones the stack starts above
// the bottom tab bar; on product pages it moves up with the sticky buy bar,
// mirroring the chat and WhatsApp offsets in globals.css (up to 1023px).
const SLOT_CLASSES = {
  // Chat and WhatsApp both showing: sit above WhatsApp.
  aboveWhatsApp: {
    normal: "bottom-[208px] md:bottom-[156px]",
    sticky: "bottom-[264px] lg:bottom-[228px]",
  },
  // Only the chat showing (WhatsApp is off on the dashboard): sit above the chat.
  aboveChat: {
    normal: "bottom-[148px] md:bottom-24",
    sticky: "bottom-[206px] lg:bottom-[168px]",
  },
  // Neither showing (sign-in pages, admin).
  alone: {
    normal: "bottom-20 md:bottom-6",
    sticky: "bottom-[138px] lg:bottom-[96px]",
  },
} as const;

type Slot = keyof typeof SLOT_CLASSES;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [slot, setSlot] = useState<Slot>("aboveWhatsApp");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.9);
      setChatOpen(document.body.classList.contains("chatbot-open"));
      setSticky(!!document.querySelector(".pdp-sticky-active"));
      const hasChat = !!document.querySelector(".chatbot-floating-widget");
      const hasWhatsApp = !!document.querySelector(".whatsapp-floating-widget");
      setSlot(hasWhatsApp ? "aboveWhatsApp" : hasChat ? "aboveChat" : "alone");
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    const onChatToggle = (e: Event) => {
      const detail = (e as CustomEvent<{ isOpen?: boolean }>).detail;
      if (typeof detail?.isOpen === "boolean") setChatOpen(detail.isOpen);
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("chatbot-toggle", onChatToggle);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("chatbot-toggle", onChatToggle);
    };
  }, [pathname]);

  const shown = visible && !chatOpen;
  const position = SLOT_CLASSES[slot][sticky ? "sticky" : "normal"];

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    // A keyboard press (detail 0) would leave focus on a button that is about
    // to hide, so move it to the top of the page instead.
    if (e.detail === 0) {
      const first = document.querySelector<HTMLElement>(
        "header a[href], header button",
      );
      first?.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={`back-to-top-button fixed right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#016271]/20 bg-white/95 text-[#016271] shadow-[0_8px_24px_-6px_rgba(0,72,81,0.35)] backdrop-blur-sm transition-[opacity,transform,bottom] duration-300 hover:bg-[#E2F4F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016271] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transition-none sm:right-7 ${position} ${
        shown
          ? "visible translate-y-0 opacity-100"
          : "pointer-events-none invisible translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}
