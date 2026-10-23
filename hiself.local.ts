// Every Hindi question and phrasing should find its own answer (or one sharing its topic).
import * as E from "@/lib/chat/engine";
import { ANSWERS_HI, TRIGGERS_HI } from "@/const/chatbot/hi";
E.addHindi(ANSWERS_HI, TRIGGERS_HI);
let total = 0;
let own = 0;
let none = 0;
const bad: string[] = [];
for (const [id, h] of Object.entries(ANSWERS_HI)) {
  for (const q of [h.question, ...h.phrasings]) {
    total++;
    const r = E.findAnswer(q);
    const got = r.kind === "answer" ? r.answer.id : r.kind === "unsure" ? r.options[0]?.id : "";
    if (got === id || (r.kind === "unsure" && r.options.some((o) => o.id === id))) own++;
    else {
      if (!got) none++;
      bad.push(`${id} | ${q} -> ${got || "NONE"}`);
    }
  }
}
console.log(`own ${own}/${total} (${((own / total) * 100).toFixed(1)}%), none ${none}`);
console.log(bad.slice(0, Number(process.argv[2] || 25)).join("\n"));
