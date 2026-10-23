import type { Metadata } from "next";
import type { ReactNode } from "react";

// Results depend on answers saved in this browser, so the page is kept out
// of search (robots.ts also blocks it) but still gets a proper title.
export const metadata: Metadata = {
  title: "Your Suggested Products",
  description: "Ovy period care picks based on your quiz answers.",
  robots: { index: false, follow: true },
};

export default function SuggestedProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
