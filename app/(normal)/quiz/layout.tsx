import type { ReactNode } from "react";
import { pageMetadata } from "@/const/seo";

// The quiz page is a client component, so its title and description live here.
export const metadata = pageMetadata("quiz");

export default function QuizLayout({ children }: { children: ReactNode }) {
  return children;
}
