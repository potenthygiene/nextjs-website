"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { quizQuestions } from "@/const/globalconst";
import { NEED_STORAGE_KEY } from "@/const/quizRules";
import {
  NEUTRAL_QUIZ_THEME,
  QuizSteps,
  themeStyle,
  useQuizFlow,
} from "@/app/components/common/quiz/QuizKit";

// "Find what I need": four questions, then /suggested-products works out the
// picks in the browser from the saved answers (rules in const/quizRules.ts).
const Page = () => {
  const router = useRouter();
  const flow = useQuizFlow(quizQuestions);

  useEffect(() => {
    if (!flow.done) return;
    try {
      window.localStorage.setItem(NEED_STORAGE_KEY, JSON.stringify(flow.answers));
    } catch {
      // Storage can be blocked; sessionStorage below is the fallback.
    }
    try {
      window.sessionStorage.setItem(NEED_STORAGE_KEY, JSON.stringify(flow.answers));
    } catch {
      // Ignore: one of the two stores is enough.
    }
    router.push("/suggested-products");
  }, [flow.done, flow.answers, router]);

  return (
    <div className="flex min-h-[80vh] items-start justify-center bg-[#F4F7F7] px-4 py-6 sm:items-center sm:py-10" style={themeStyle(NEUTRAL_QUIZ_THEME)}>
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-lg sm:p-10">
        <div className="mb-5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--quiz-soft)] px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--quiz-accent-dark)] uppercase">
            <Heart className="h-3.5 w-3.5" /> Find what I need
          </span>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[var(--quiz-ink)] sm:text-3xl">Four questions, one honest match</h1>
          <p className="mt-1.5 text-sm text-gray-600">
            About 30 seconds. We match Ovy products and sizes to your flow, comfort and skin.
          </p>
        </div>

        {flow.done ? (
          <p className="py-10 text-center text-sm font-medium text-gray-600">Working out your picks...</p>
        ) : (
          <QuizSteps flow={flow} columns={2} />
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          Your answers stay on this device. We use them only to suggest products.
        </p>
      </div>
    </div>
  );
};

export default Page;
