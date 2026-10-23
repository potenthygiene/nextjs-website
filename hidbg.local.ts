import * as E from "@/lib/chat/engine";
import { ANSWERS_HI, TRIGGERS_HI } from "@/const/chatbot/hi";
E.addHindi(ANSWERS_HI, TRIGGERS_HI);
for (const q of process.argv.slice(2)) {
  E.findAnswer(q);
  console.log(q, "\n  ", E.lastScored.join("\n   "));
}
