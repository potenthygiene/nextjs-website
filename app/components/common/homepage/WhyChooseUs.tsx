import { CONTAINER, EYEBROW_TEAL, H2, LEAD, SECTION_Y } from "./homeStyles";

const WHY_CARDS = [
  {
    badge: "Only here",
    title: "Cycle-Sync delivery",
    description:
      "Your box lands about 5 days before you are due. The first period delivery in India timed to your own cycle.",
    isMint: true,
  },
  {
    badge: "Only here",
    title: "Mix Your Box",
    description:
      "One box, three pad lengths, in whatever combination your cycle actually needs. Nobody else does this.",
    isMint: true,
  },
  {
    title: "Subscribe and save",
    description:
      "A saving on every order, free delivery over the threshold, and a surprise gift in every third box. Pause or cancel in two clicks.",
  },
  {
    title: "Rewards Club",
    description:
      "Credits in rupees rather than points. Earned on orders, reviews, referrals and your birthday, and applied automatically at checkout.",
  },
  {
    title: "Gift mode",
    description:
      "Hides the price and adds your note, so a teen kit arrives feeling thoughtful rather than transactional.",
  },
  {
    title: "Claims we can prove",
    description:
      "Certified toxin-free, dermatologically tested, pH-balanced and non-irritant, with a certificate behind every word on the pack.",
  },
];

// Why buy direct. On a phone the cards are a swipe row the visitor controls
// (no auto-scrolling), on desktop a 3-column grid.
export function WhyChooseUs() {
  return (
    <section className={`relative w-full overflow-hidden bg-[#FAF7F2] ${SECTION_Y}`}>
      <div className={CONTAINER}>
        <div className="mb-6 space-y-2 text-center sm:mb-10 sm:space-y-3">
          <span className={EYEBROW_TEAL}>Why buy direct</span>
          <h2 className={H2}>Better here than anywhere else.</h2>
          <p className={`${LEAD} mx-auto max-w-xl`}>
            The things you only get on potenthygiene.com, and the claims we can
            actually prove.
          </p>
        </div>

        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-auto sm:grid sm:max-w-6xl sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {WHY_CARDS.map((card) => (
            <li
              key={card.title}
              className={`flex w-[78%] shrink-0 snap-start flex-col rounded-2xl p-5 shadow-2xs sm:w-auto sm:p-6 ${
                card.isMint
                  ? "border border-[#BDE3EA] bg-[#E6F4F6]"
                  : "border border-gray-100 bg-white"
              }`}
            >
              {card.badge && (
                <span className="mb-3 inline-block w-fit rounded-full border border-[#016271]/20 bg-white/90 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-[#016271] uppercase">
                  {card.badge}
                </span>
              )}
              <h3 className="mb-1.5 font-serif text-lg font-bold text-[#1F1915] sm:text-xl">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#5C524D]">
                {card.description}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-center text-xs text-[#5C524D] sm:hidden" aria-hidden>
          Swipe for more
        </p>
      </div>
    </section>
  );
}
