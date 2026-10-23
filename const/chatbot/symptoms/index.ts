import type { SymptomFlow } from "../symptomTypes";
import { FLOWS as CYCLE } from "./cycle";
import { FLOWS as INTIMATE } from "./intimate";
import { FLOWS as STAGES } from "./stages";

export const SYMPTOM_FLOWS: SymptomFlow[] = [...CYCLE, ...INTIMATE, ...STAGES];
