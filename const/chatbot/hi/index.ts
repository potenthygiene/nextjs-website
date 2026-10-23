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

export const ANSWERS_HI = { ...orders, ...ovy, ...looway, ...health, ...health2, ...brand };
export { SYMPTOMS_HI };
export { FINDER_TEXT_HI, FINDERS_HI, FLOWS_HI, MENUS_HI } from "./ui";
export { STRINGS_HI } from "./strings";

export const TRIGGERS_HI = Object.fromEntries(Object.entries(SYMPTOMS_HI).map(([id, f]) => [id, f.triggers]));
