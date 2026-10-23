// Guided symptom check-ins for Potent Saathi. These never diagnose: they ask
// focused questions, then explain what the symptoms are commonly linked to,
// what helps, which products may make things easier, and how urgently to
// see a doctor. All text accepts **bold** and [link](/path).

export type AgeBand = "u13" | "13-17" | "18-29" | "30-39" | "40-49" | "50+";
export type Who = "me" | "daughter" | "someone";
export type Sex = "female" | "male" | "other";

export type SymptomOption = {
  id: string;
  label: string;
  /** "red" = needs urgent care; "amber" = should see a doctor soon. */
  flag?: "red" | "amber";
};

export type SymptomQuestion = {
  id: string;
  text: string;
  /** Let the person pick several, then tap Done. */
  multi?: boolean;
  options: SymptomOption[];
};

export type ProductKey =
  | "ovy-pads"
  | "ovy-liners"
  | "ovy-panty"
  | "ovy-teen"
  | "ovy-cup"
  | "looway-pee-funnel"
  | "looway-pee-puke"
  | "looway-toilet-seat-covers"
  | "looway-yatra-kit"
  | "period-tracker";

export type SymptomOutcome = {
  id: string;
  /**
   * When this outcome applies. Every listed condition must hold. The first
   * matching outcome wins, so put red-flag outcomes first and a default
   * (no conditions) last.
   */
  match?: {
    /** questionId → any of these option ids was chosen. */
    answers?: Record<string, string[]>;
    ages?: AgeBand[];
    who?: Who[];
    sex?: Sex[];
    /** Any chosen option carries this flag (or a stronger one). */
    flag?: "red" | "amber";
  };
  urgency: "emergency" | "soon" | "checkup" | "selfcare";
  title: string;
  /** 1 to 3 sentences, warm and plain. */
  summary: string;
  /** What these symptoms are commonly linked to (never "you have"). 2 to 5 items. */
  oftenLinkedTo: string[];
  /** Practical things to do now. 2 to 5 items. */
  whatHelps: string[];
  /** One sentence on when and why to see a doctor. */
  seeDoctor: string;
  products?: ProductKey[];
  readMore?: { label: string; href: string }[];
};

export type SymptomFlow = {
  id: string;
  title: string;
  /** Shown on the "Check my symptoms" menu. */
  short: string;
  /** Phrases that should start this check-in when typed. */
  triggers: string[];
  /** Which profile details matter for this flow. Age is always asked. */
  needs: { who?: boolean; sex?: boolean };
  questions: SymptomQuestion[];
  outcomes: SymptomOutcome[];
  sources: { label: string; url: string }[];
};
