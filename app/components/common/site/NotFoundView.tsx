import Link from "next/link";

// The "page not found" screen: friendly, on brand, and one tap from the
// places people usually want.
const LINKS = [
  { href: "/shop", label: "Shop all products" },
  { href: "/ovy", label: "Ovy period care" },
  { href: "/looway", label: "Looway travel hygiene" },
  { href: "/quiz", label: "Find what I need" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact us" },
];

export function NotFoundView() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#016271]">Page not found</p>
      <h1 className="mt-3 font-serif text-[28px] font-bold leading-tight text-[#1F1915] sm:text-4xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#5C524D]">
        It may have moved, or the link may be old. Here are the places most people are looking for.
      </p>
      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-2.5">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex min-h-12 items-center justify-center rounded-full border-2 border-[#016271] px-4 text-[14px] font-semibold text-[#016271] transition-colors hover:bg-[#E6F4F6]"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <Link href="/" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-[#016271] px-6 text-[15px] font-semibold text-white hover:bg-[#014d59]">
        Back to the homepage
      </Link>
    </main>
  );
}
