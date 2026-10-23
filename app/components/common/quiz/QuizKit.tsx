"use client";

// Shared building blocks for the site quizzes: the step flow (with Back and
// skipped steps), a progress bar, tap-friendly options and a result card.
// Colours come from CSS variables set by each page's theme, so one set of
// components fits Ovy, Looway and the neutral /quiz page.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, Lightbulb, RotateCcw, ShieldAlert, Heart, X } from "lucide-react";
import type { QuizAnswers, QuizStepDef } from "@/const/quizRules";

export type QuizTheme = {
  accent: string;
  accentDark: string;
  soft: string;
  ink: string;
};

export const OVY_QUIZ_THEME: QuizTheme = { accent: "#9A5B90", accentDark: "#7E4D77", soft: "#F3E6F0", ink: "#1A150F" };
export const NEUTRAL_QUIZ_THEME: QuizTheme = { accent: "#016271", accentDark: "#014b57", soft: "#E3F3F5", ink: "#1A1A1A" };

export function themeStyle(theme: QuizTheme): React.CSSProperties {
  return {
    "--quiz-accent": theme.accent,
    "--quiz-accent-dark": theme.accentDark,
    "--quiz-soft": theme.soft,
    "--quiz-ink": theme.ink,
  } as React.CSSProperties;
}

/* ------------------------------------------------------------------ */
/* Flow state                                                          */
/* ------------------------------------------------------------------ */

export function useQuizFlow(steps: QuizStepDef[], skip?: (stepId: string, a: QuizAnswers) => boolean) {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const visibleFor = useCallback((a: QuizAnswers) => steps.filter((s) => !skip?.(s.id, a)), [steps, skip]);
  const visible = useMemo(() => visibleFor(answers), [visibleFor, answers]);
  const current = done ? null : visible[Math.min(pos, visible.length - 1)] || null;

  const answer = (stepId: string, optionId: string) => {
    const next = { ...answers, [stepId]: optionId };
    setAnswers(next);
    setDirection("forward");
    const nextVisible = visibleFor(next);
    const idx = nextVisible.findIndex((s) => s.id === stepId);
    if (timer.current) clearTimeout(timer.current);
    // A short pause lets the tap register visually before the next question.
    timer.current = setTimeout(() => {
      if (idx + 1 < nextVisible.length) setPos(idx + 1);
      else setDone(true);
    }, 220);
  };

  const back = () => {
    if (timer.current) clearTimeout(timer.current);
    setDirection("back");
    if (done) {
      setDone(false);
      setPos(visible.length - 1);
    } else {
      setPos((p) => Math.max(0, p - 1));
    }
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setAnswers({});
    setPos(0);
    setDone(false);
    setDirection("forward");
  };

  return {
    answers,
    current,
    done,
    direction,
    stepNumber: Math.min(pos, visible.length - 1) + 1,
    total: visible.length,
    canGoBack: done || pos > 0,
    answer,
    back,
    reset,
  };
}

export type QuizFlow = ReturnType<typeof useQuizFlow>;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

export function QuizProgress({ step, total, done, label }: { step: number; total: number; done?: boolean; label?: string }) {
  const pct = done ? 100 : Math.round(((step - 1) / Math.max(total, 1)) * 100);
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-[var(--quiz-accent-dark)] uppercase">
        <span>{done ? "Your result" : `Question ${step} of ${total}`}</span>
        {label ? <span className="text-gray-500 normal-case tracking-normal font-semibold">{label}</span> : null}
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Quiz progress"
      >
        <div className="h-full rounded-full bg-[var(--quiz-accent)] transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function QuizQuestion({
  step,
  selected,
  onSelect,
  direction = "forward",
  columns = 1,
}: {
  step: QuizStepDef;
  selected?: string;
  onSelect: (optionId: string) => void;
  direction?: "forward" | "back";
  columns?: 1 | 2;
}) {
  return (
    <div
      key={step.id}
      className={`animate-in fade-in duration-300 ${direction === "back" ? "slide-in-from-left-4" : "slide-in-from-right-4"}`}
    >
      <h3 className="font-serif text-xl leading-snug font-bold text-[var(--quiz-ink)] sm:text-2xl">{step.question}</h3>
      {step.helper ? <p className="mt-1.5 text-xs leading-relaxed text-gray-600 sm:text-sm">{step.helper}</p> : null}
      <div className={`mt-4 grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`} role="group" aria-label={step.question}>
        {step.options.map((opt) => {
          const isOn = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onSelect(opt.id)}
              className={`flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-150 active:scale-[0.99] ${
                isOn
                  ? "border-[var(--quiz-accent)] bg-[var(--quiz-soft)]"
                  : "border-gray-200 bg-white hover:border-[var(--quiz-accent)] hover:bg-[var(--quiz-soft)]/40"
              }`}
            >
              <span className="min-w-0 flex-1">
                <b className="block text-sm font-semibold text-[var(--quiz-ink)]">{opt.label}</b>
                {opt.sub ? <small className="mt-0.5 block text-xs font-medium text-gray-500">{opt.sub}</small> : null}
              </span>
              <span
                className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border transition-colors ${
                  isOn ? "border-[var(--quiz-accent)] bg-[var(--quiz-accent)] text-white" : "border-gray-300 text-transparent"
                }`}
                aria-hidden="true"
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function QuizBackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-[var(--quiz-ink)]"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}

/** The whole question screen: progress, the current question and Back. */
export function QuizSteps({ flow, label, columns }: { flow: QuizFlow; label?: string; columns?: 1 | 2 }) {
  if (!flow.current) return null;
  return (
    <div>
      <QuizProgress step={flow.stepNumber} total={flow.total} label={label} />
      <QuizQuestion
        step={flow.current}
        selected={flow.answers[flow.current.id]}
        onSelect={(id) => flow.answer(flow.current!.id, id)}
        direction={flow.direction}
        columns={columns}
      />
      {flow.canGoBack ? <QuizBackButton onClick={flow.back} /> : null}
    </div>
  );
}

export type QuizAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

function ActionButton({ action, variant }: { action: QuizAction; variant: "primary" | "secondary" }) {
  const cls =
    variant === "primary"
      ? "flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--quiz-accent)] px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--quiz-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      : "flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--quiz-ink)] transition hover:bg-gray-50";
  if (action.href) {
    return (
      <Link href={action.href} onClick={action.onClick} className={cls}>
        {action.icon}
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} disabled={action.disabled} className={cls}>
      {action.icon}
      {action.label}
    </button>
  );
}

export type QuizResultProps = {
  eyebrow: string;
  title: string;
  productName: string;
  sizeLabel?: string;
  image?: string;
  price?: number | null;
  strikePrice?: number | null;
  priceNote?: string;
  description: string;
  reasons: string[];
  contents?: string[];
  alternative?: { title: string; why: string; action?: QuizAction };
  tips: string[];
  warning?: string;
  primary: QuizAction;
  secondary?: QuizAction[];
  onBack?: () => void;
  onRetake: () => void;
};

export const formatInr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function QuizResult(props: QuizResultProps) {
  const { eyebrow, title, productName, sizeLabel, image, price, strikePrice, priceNote, description, reasons, contents, alternative, tips, warning, primary, secondary, onBack, onRetake } = props;
  const showStrike = typeof price === "number" && typeof strikePrice === "number" && strikePrice > price;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <QuizProgress step={1} total={1} done />
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--quiz-accent)] px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase">
        <Heart className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h3 className="mt-2 font-serif text-2xl leading-tight font-bold text-[var(--quiz-ink)]">{title}</h3>

      <div className="mt-4 rounded-3xl border-2 border-[var(--quiz-accent)] bg-gradient-to-br from-[var(--quiz-soft)] via-white to-white p-4">
        <div className="flex items-center gap-4">
          {image ? (
            <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <Image src={image} alt={productName} fill className="object-contain p-1" sizes="80px" unoptimized />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-500">{productName}</p>
            {sizeLabel ? <p className="mt-0.5 font-serif text-lg leading-snug font-bold text-[var(--quiz-ink)]">{sizeLabel}</p> : null}
            {typeof price === "number" && price > 0 ? (
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-lg font-bold text-[var(--quiz-accent-dark)]">{formatInr(price)}</span>
                {showStrike ? <span className="text-xs text-gray-400 line-through">{formatInr(strikePrice as number)}</span> : null}
              </p>
            ) : priceNote ? (
              <p className="mt-1 text-xs font-medium text-gray-500">{priceNote}</p>
            ) : null}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{description}</p>

        {reasons.length > 0 ? (
          <div className="mt-3 rounded-2xl bg-white/80 p-3">
            <p className="mb-1.5 text-xs font-bold tracking-wide text-[var(--quiz-ink)] uppercase">Why this pick</p>
            <ul className="space-y-1.5">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-xs leading-relaxed text-gray-700 sm:text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--quiz-accent)]" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {contents && contents.length > 0 ? (
          <div className="mt-3 rounded-2xl bg-white/80 p-3">
            <p className="mb-1.5 text-xs font-bold tracking-wide text-[var(--quiz-ink)] uppercase">In the box</p>
            <ul className="grid gap-1 sm:grid-cols-2">
              {contents.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-[var(--quiz-accent)]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-2.5">
        <ActionButton action={primary} variant="primary" />
        {(secondary || []).map((s) => (
          <ActionButton key={s.label} action={s} variant="secondary" />
        ))}
      </div>

      {alternative ? (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3.5">
          <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Also worth a look</p>
          <p className="mt-1 text-sm font-bold text-[var(--quiz-ink)]">{alternative.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{alternative.why}</p>
          {alternative.action ? (
            alternative.action.href ? (
              <Link
                href={alternative.action.href}
                onClick={alternative.action.onClick}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--quiz-accent-dark)] underline underline-offset-2"
              >
                {alternative.action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={alternative.action.onClick}
                className="mt-2 inline-flex min-h-[44px] cursor-pointer items-center text-sm font-semibold text-[var(--quiz-accent-dark)] underline underline-offset-2"
              >
                {alternative.action.label}
              </button>
            )
          ) : null}
        </div>
      ) : null}

      {tips.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-[#FAF7F0] p-3.5">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wide text-[var(--quiz-ink)] uppercase">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Good to know
          </p>
          <ul className="space-y-1.5">
            {tips.map((t) => (
              <li key={t} className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {warning ? (
        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 sm:text-sm">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
          <span>{warning}</span>
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {onBack ? <QuizBackButton onClick={onBack} label="Change my last answer" /> : <span />}
        <button
          type="button"
          onClick={onRetake}
          className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-[var(--quiz-ink)]"
        >
          <RotateCcw className="h-4 w-4" /> Retake quiz
        </button>
      </div>
    </div>
  );
}

/** A bottom sheet on phones, a centred card on larger screens. */
export function QuizModal({
  open,
  onClose,
  theme,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  theme: QuizTheme;
  label: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[96] flex items-end justify-center sm:items-center sm:p-5" style={themeStyle(theme)} role="dialog" aria-modal="true" aria-label={label}>
      <div className="animate-in fade-in absolute inset-0 bg-[#1A150F]/50 backdrop-blur-xs duration-200" onClick={onClose} />
      <div className="animate-in slide-in-from-bottom-8 sm:zoom-in-95 relative max-h-[92vh] w-full max-w-[560px] overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-5 pb-8 shadow-2xl duration-300 sm:rounded-3xl sm:p-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">{label}</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full bg-[#F4F1E8] text-gray-600 transition hover:text-[#1A150F]"
            aria-label="Close quiz"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Opens Potent Saathi (the chat). The chat widget listens for this event. */
export function openSaathi(finder?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("potent-open-saathi", { detail: finder ? { finder } : {} }));
}
