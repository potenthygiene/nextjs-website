import type { ChatAnswer } from "./types";
import { ANSWERS as ORDERS } from "./answers/orders";
import { ANSWERS as OVY } from "./answers/ovy";
import { ANSWERS as LOOWAY } from "./answers/looway";
import { ANSWERS as HEALTH } from "./answers/health";
import { ANSWERS as HEALTH2 } from "./answers/health2";
import { ANSWERS as TRAVEL2 } from "./answers/travel2";
import { ANSWERS as BRAND } from "./answers/brand";

export const ALL_ANSWERS: ChatAnswer[] = [...ORDERS, ...OVY, ...LOOWAY, ...HEALTH, ...HEALTH2, ...TRAVEL2, ...BRAND];
