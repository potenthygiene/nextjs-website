// Potent Saathi in Hindi. Loaded only when a visitor switches the chat to
// हिंदी. Keyed by the same ids as the English, which stays the fallback for
// anything not translated (such as FAQs read from the live site).

import { HI as orders } from "./orders";
import { HI as ovy } from "./ovy";
import { HI as looway } from "./looway";
import { HI as health } from "./health";
import { HI as health2 } from "./health2";
import { HI as brand } from "./brand";
import { SYMPTOMS_HI } from "./symptoms";
import { FINDER_TEXT_HI, FINDERS_HI, FLOWS_HI, MENUS_HI } from "./ui";
import { QUIZ_TEXT_HI, QUIZZES_HI } from "./quizzes";
import { TOOL_TEXT_HI, TOOLS_HI } from "./tools";

export const ANSWERS_HI = { ...orders, ...ovy, ...looway, ...health, ...health2, ...brand };
export { SYMPTOMS_HI, FLOWS_HI, MENUS_HI };
export { STRINGS_HI } from "./strings";

type FinderHi = { title: string; short?: string; steps: Record<string, { text: string; options: Record<string, string> }> };

/** Every finder, quiz and planner, by id. */
export const ALL_FINDERS_HI: Record<string, FinderHi> = { ...FINDERS_HI, ...QUIZZES_HI, ...TOOLS_HI };
/** Every result sentence from a finder, quiz or planner. */
export const ALL_FINDER_TEXT_HI: Record<string, string> = { ...FINDER_TEXT_HI, ...QUIZ_TEXT_HI, ...TOOL_TEXT_HI };

export const TRIGGERS_HI = Object.fromEntries(Object.entries(SYMPTOMS_HI).map(([id, f]) => [id, f.triggers]));
