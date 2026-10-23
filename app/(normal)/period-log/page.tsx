import Image from "next/image";
import LogEntry from "./logEntry";
import TrackerGuide from "./trackerGuide";
import { pageMetadata } from "@/const/seo";

export const metadata = pageMetadata("period-log");

const Page = () => {
  return (
    <>
      {/* Short hero on phones so the tracker starts near the top of the screen. */}
      <div className="relative w-full min-h-[40vh] md:min-h-[87vh] overflow-hidden">
        <Image
          src="/trackermainImage.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative flex items-center justify-center bg-black/40 w-full min-h-[40vh] md:min-h-[87vh] px-4 py-8">
          <div className="max-w-sm md:max-w-xl flex flex-col items-center gap-3 md:gap-4 text-center text-white">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">Know Your Body Better</h1>
          <p className="text-white/90 max-w-lg text-center text-[14px]">
            A period tracker helps women monitor their menstrual cycle, predict
            upcoming periods, and understand body patterns. It provides insights
            into ovulation, symptoms, and health trends, making it easier to
            stay prepared, manage well-being, and take control of reproductive
            health confidently
          </p>
        </div>
        </div>
      </div>
      <LogEntry/>
      <TrackerGuide/>
    </>
  );
};

export default Page;
