import type { AgeBand, Applies, Sex, Who } from "./symptomTypes";

// Profile rules for the symptom check-ins: which flows, questions and options
// fit the person, so nobody is asked about something that can't apply to them.

type ProfileLike = { age?: AgeBand; who?: Who; sex?: Sex };

const UMBRELLA: Partial<Record<AgeBand, AgeBand[]>> = {
  u13: ["u5", "5-12"],
  "40-49": ["40-44", "45-49"],
};

const expand = (a: AgeBand): AgeBand[] => [a, ...(UMBRELLA[a] || [])];

/**
 * Whether an age falls in a list. "u13" covers u5 and 5-12, "40-49" covers
 * 40-44 and 45-49. An empty or missing list passes, and so does an unknown age.
 */
export function ageIn(list: AgeBand[] | undefined, age?: AgeBand): boolean {
  if (!list || !list.length || !age) return true;
  const inList = new Set(list.flatMap(expand));
  return expand(age).some((a) => inList.has(a));
}

/** The person's sex as far as we know it: a daughter is female, a son is male. */
export function effectiveSex(p: { who?: Who; sex?: Sex }): Sex | undefined {
  if (p.who === "daughter") return "female";
  if (p.who === "son") return "male";
  return p.sex;
}

/**
 * Whether a showIf condition holds for this profile and the answers so far.
 * Every listed condition must hold; a condition on an unknown profile value
 * passes, because we only hide what we know doesn't fit.
 */
export function applies(cond: Applies | undefined, p: ProfileLike, answers: Record<string, string[]> = {}): boolean {
  if (!cond) return true;
  if (cond.ages && !ageIn(cond.ages, p.age)) return false;
  const sex = effectiveSex(p);
  if (cond.sex && cond.sex.length && sex && !cond.sex.includes(sex)) return false;
  if (cond.who && cond.who.length && p.who && !cond.who.includes(p.who)) return false;
  if (cond.answers && !Object.entries(cond.answers).every(([q, ids]) => (answers[q] || []).some((a) => ids.includes(a)))) return false;
  if (cond.notAnswers && Object.entries(cond.notAnswers).some(([q, ids]) => (answers[q] || []).some((a) => ids.includes(a)))) return false;
  return true;
}

// ── Shared conditions used by the check-ins ──

/** Every adult age band, 18 and over. */
export const ADULT_AGES: AgeBand[] = ["18-29", "30-39", "40-44", "45-49", "50+"];

/**
 * Ages where pregnancy questions may be asked: 18 to 49. Pregnancy is still
 * possible in the late 40s, until a full year without periods, so women 45 to
 * 49 are asked too. Not asked from 50.
 */
export const PREG_AGES: AgeBand[] = ["18-29", "30-39", "40-44", "45-49"];

/**
 * Pregnancy, the chance of pregnancy, a recent baby, breastfeeding and
 * contraception: only for a woman aged 18 to 49 asking for herself or for
 * someone else, never for a child, a teen, 50 and over, a male, or when a
 * parent is asking about a daughter or son.
 */
export const REPRO: Applies = { ages: PREG_AGES, sex: ["female", "other"], who: ["me", "someone"] };

/**
 * Sex-related symptoms, such as bleeding after sex or pain during sex: for a
 * woman of any adult age asking for herself or someone else, including after
 * menopause, when bleeding after sex is a red flag. Never for a child, a teen,
 * a male, or when a parent is asking about a daughter or son.
 */
export const SEX_SYMPTOMS: Applies = { ages: ADULT_AGES, sex: ["female", "other"], who: ["me", "someone"] };

/** Anyone who may have periods: girls from about 8 (inside 5-12) up. */
export const PERIOD_AGES: AgeBand[] = ["5-12", "13-17", "18-29", "30-39", "40-44", "45-49", "50+"];

/** Female body check-ins: not for a male or a son. */
export const FEMALE: Applies = { sex: ["female", "other"], who: ["me", "daughter", "someone"] };

/** Menopause options: 40 and over. */
export const MIDLIFE_AGES: AgeBand[] = ["40-44", "45-49", "50+"];

/** Age groups some outcomes are written for. */
export const CHILD_AGES: AgeBand[] = ["u5", "5-12"];
export const YOUNG_AGES: AgeBand[] = ["u5", "5-12", "13-17"];
export const OLDER_AGES: AgeBand[] = ["45-49", "50+"];

/** Ages that get the outcome wording without pregnancy: children, teens and 50+. */
export const NO_PREG_AGES: AgeBand[] = ["u5", "5-12", "13-17", "50+"];
