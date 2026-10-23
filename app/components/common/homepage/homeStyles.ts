// One type scale and one button system for the homepage sections, so every
// band reads the same on a phone. Colours match the Ovy and Looway pages:
// warm ink #1F1915 for headings, warm grey #5C524D for body, teal #016271 for
// the house and Looway, Ovy purple #7E4D77 for Ovy bands.

/** Vertical rhythm for a full-width band. */
export const SECTION_Y = "py-12 sm:py-16 lg:py-20";

/** Page-width container with a 16px phone gutter. */
export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/** Small uppercase label above a heading. Add a colour class. */
export const EYEBROW =
  "block text-[11px] font-bold uppercase tracking-[0.14em] sm:text-xs";
export const EYEBROW_TEAL = `${EYEBROW} text-[#016271]`;
export const EYEBROW_OVY = `${EYEBROW} text-[#7E4D77]`;

/** Section heading (h2). */
export const H2 =
  "font-serif text-[26px] font-bold leading-[1.15] text-[#1F1915] sm:text-4xl lg:text-[44px]";

/** Card heading (h3). */
export const H3 =
  "font-serif text-base font-bold leading-snug text-[#1F1915] sm:text-lg";

/** Intro paragraph under a heading. */
export const LEAD = "text-[15px] leading-relaxed text-[#5C524D] sm:text-base";

/** Smaller body copy inside cards. Never below 13px on a phone. */
export const BODY_SM = "text-[13px] leading-snug text-[#5C524D] sm:text-sm";

/** Shape shared by every button: a pill at least 48px tall. No padding or
 * size here, so a caller can set its own without two classes fighting. */
export const BTN_SHAPE =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed";

/** Default padding and text size. */
export const BTN_SIZE = "px-6 text-[15px]";

export const BTN_BASE = `${BTN_SHAPE} ${BTN_SIZE}`;

/** Colours. Primary is solid, secondary is an outline. */
export const BTN_TEAL =
  "bg-[#016271] text-white shadow-sm hover:bg-[#004851] focus-visible:outline-[#016271]";
export const BTN_TEAL_OUTLINE =
  "border-2 border-[#016271] bg-white text-[#016271] hover:bg-[#E6F4F6] focus-visible:outline-[#016271]";
export const BTN_OVY =
  "bg-[#7E4D77] text-white shadow-sm hover:bg-[#602E55] focus-visible:outline-[#7E4D77]";
export const BTN_OVY_OUTLINE =
  "border-2 border-[#7E4D77] bg-white text-[#7E4D77] hover:bg-[#F5EEF6] focus-visible:outline-[#7E4D77]";

/** Primary: solid teal. One per band. */
export const BTN_PRIMARY = `${BTN_BASE} ${BTN_TEAL}`;

/** Secondary: teal outline. */
export const BTN_SECONDARY = `${BTN_BASE} ${BTN_TEAL_OUTLINE}`;

/** Primary and secondary for Ovy bands. */
export const BTN_PRIMARY_OVY = `${BTN_BASE} ${BTN_OVY}`;
export const BTN_SECONDARY_OVY = `${BTN_BASE} ${BTN_OVY_OUTLINE}`;

/** Text link with an arrow, for "see all" style actions. */
export const LINK_ARROW =
  "inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[#016271] underline-offset-4 hover:underline";
