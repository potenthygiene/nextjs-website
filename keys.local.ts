import { readFileSync } from "fs";
import { STRINGS_HI } from "./const/chatbot/hi/strings";
import { PRODUCT_META, COMBOS } from "./const/chatbot/products";

const src = ["app/components/common/ChatBotWidget.tsx", "app/components/common/chat/ChatCards.tsx"].map((f) => readFileSync(f, "utf8")).join("\n");
const keys = new Set<string>();
const str = (raw: string) => JSON.parse(`"${raw}"`) as string;
for (const m of src.matchAll(/\bt[m]?\(\s*"((?:[^"\\]|\\.)*)"/g)) keys.add(str(m[1]));
for (const m of src.matchAll(/label: "((?:[^"\\]|\\.)*)"/g)) keys.add(str(m[1]));
for (const m of src.matchAll(/\? "((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) {
  keys.add(str(m[1]));
  keys.add(str(m[2]));
}
Object.values(PRODUCT_META).forEach((m) => keys.add(m.line));
COMBOS.forEach((c) => {
  keys.add(c.title);
  keys.add(c.why);
});
const missing = [...keys].filter((k) => !(k in STRINGS_HI) && !/^(\/|https?:|tel:)/.test(k));
console.log("keys", keys.size, "missing", missing.length);
missing.forEach((k) => console.log(" -", JSON.stringify(k)));
const unused = Object.keys(STRINGS_HI).filter((k) => !keys.has(k));
console.log("unused", unused.length, JSON.stringify(unused));
