import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BTN_PRIMARY, CONTAINER, EYEBROW_TEAL, H2, LEAD } from "./homeStyles";

// Each tag opens the Yatra Kit page on the matching preset (it matches
// ?kit= against the kit ids in const/productsContent.ts).
const TRIP_TAGS = [
  { label: "Girls' Trip", kit: "girls" },
  { label: "Teerth Yatra", kit: "teerth" },
  { label: "Boys' Trip", kit: "boys" },
  { label: "Pregnancy Travel", kit: "preg" },
  { label: "Toddler Travel", kit: "toddler" },
  { label: "Family", kit: "family" },
];

export function YatraKitPromo() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] pt-0 pb-9 sm:pb-12 lg:pb-14">
      
      {/* Looway checkerboard */}
      <div 
        className="mb-8 h-3 w-full opacity-90 sm:mb-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='14' viewBox='0 0 24 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='2' width='10' height='10' rx='1' fill='%23016271'/%3E%3Crect x='12' y='2' width='10' height='10' rx='1' fill='%23F5BA24'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat-x",
          backgroundSize: "24px 14px",
        }}
      />

      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <span className={`${EYEBROW_TEAL} mb-2 sm:mb-3`}>
              Looway Yatra Kit
            </span>

            <h2 className={`${H2} mb-3 sm:mb-4`}>
              Pick a kit. Open it.<br className="hidden sm:block" /> Make it yours.
            </h2>

            <p className={`${LEAD} mb-5 max-w-lg sm:mb-6`}>
              Eleven ready-made kits, from Girls’ Trip to Teerth Yatra to Pregnancy, each built for the toilets that particular trip will throw at you. Open any one and change what is inside.
            </p>

            {/* Trip presets: tap one to open that kit */}
            <ul className="mb-6 flex max-w-md flex-wrap gap-2">
              {TRIP_TAGS.map((tag) => (
                <li key={tag.kit}>
                  <Link
                    href={`/looway-yatra-kit?kit=${tag.kit}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-[13px] font-medium text-[#1F1915] shadow-2xs transition-colors hover:border-[#016271] hover:text-[#016271]"
                  >
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div>
              <Link href="/looway-yatra-kit" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
                <span>Build your Yatra Kit</span>
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="group relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-3xl border border-white/80 shadow-xl sm:aspect-[4/3] lg:max-w-lg">
              <Image
                src="/yatra_mom_daughter.jpg"
                alt="Mother and daughter camping with Looway Yatra Kit"
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
