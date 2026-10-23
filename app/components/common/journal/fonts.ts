import { Fraunces } from "next/font/google";

// Editorial serif for Journal headlines only; body text stays in the site font.
export const journalSerif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});
