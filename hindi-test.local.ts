// Hindi questions through the engine, after loading the Hindi bundle.
import * as E from "@/lib/chat/engine";
import { ANSWERS_HI, TRIGGERS_HI, SYMPTOMS_HI, MENUS_HI, FLOWS_HI, FINDERS_HI, STRINGS_HI } from "@/const/chatbot/hi";
import { ALL_ANSWERS } from "@/const/chatbot";
import { SYMPTOM_FLOWS } from "@/const/chatbot/symptoms";
import { MENUS } from "@/const/chatbot/menus";
import { FLOWS } from "@/const/chatbot/flows";

E.addHindi(ANSWERS_HI, TRIGGERS_HI);

const Q: [string, string][] = [
  ["मेरा ऑर्डर कहाँ है", "track"],
  ["डिलीवरी कितने दिन में होगी", "deliver"],
  ["क्या कैश ऑन डिलीवरी है", "cod"],
  ["ऑर्डर कैंसिल करना है", "cancel"],
  ["सब्सक्रिप्शन कैसे काम करता है", "sub"],
  ["कौन सा पैड साइज़ लूँ", "size"],
  ["क्या पैड से रैश होते हैं", "rash"],
  ["पैड कितनी बार बदलना चाहिए", "change"],
  ["मेंस्ट्रुअल कप कैसे लगाते हैं", "cup"],
  ["कप का साइज़ कैसे चुनें", "size"],
  ["पीरियड पैंटी कैसे पहनें", "panty"],
  ["पहला पीरियड कब आता है", "first"],
  ["पीरियड में दर्द के लिए क्या करें", "pain"],
  ["PCOS क्या है", "pcos"],
  ["सफ़ेद पानी आना नॉर्मल है क्या", "discharge"],
  ["ट्रेन में टॉयलेट कैसे इस्तेमाल करें", "train"],
  ["पी फ़नल कैसे इस्तेमाल करें", "funnel"],
  ["सीट कवर को फ्लश कर सकते हैं क्या", "seat"],
  ["आपकी कंपनी का फाउंडर कौन है", "found"],
  ["कोई कूपन कोड है", "coupon"],
  ["कूपन काम नहीं कर रहा", "coupon"],
  ["रिफंड मिलेगा क्या", "refund"],
  ["धन्यवाद", "ACK"],
];

let ok = 0;
for (const [q, hint] of Q) {
  let got = "NONE";
  if (hint === "ACK") got = E.isAck(q) ? "ACK" : "no";
  else {
    const r = E.findAnswer(q);
    got = r.kind === "answer" ? r.answer.id : r.kind === "unsure" ? `UNSURE:${r.options.map((o) => o.id).join(",")}` : "NONE";
  }
  const pass = got.includes(hint);
  if (pass) ok++;
  console.log(`${pass ? "  ok" : "MISS"}  ${q.padEnd(40)} -> ${got}`);
}
console.log(`\n${ok}/${Q.length} matched`);

for (const t of ["मेरा पीरियड लेट है", "पेशाब में जलन हो रही है", "बहुत ज़्यादा ब्लीडिंग हो रही है", "मेरी बेटी को पहला पीरियड आया"]) {
  console.log(`trigger: ${t.padEnd(36)} -> ${E.findSymptomFlow(t)?.id || "none"}`);
}
console.log("safety:", E.safetyCheck("मैं आत्महत्या करना चाहती हूँ")?.kind, E.safetyCheck("मैं बेहोश हो गई")?.kind);
console.log("price:", E.isPriceQuestion("पैड की कीमत क्या है"), "greet:", E.isGreeting("नमस्ते"), "name:", E.extractName("मेरा नाम प्रिया है"));
console.log("suggest:", E.suggest("पीरियड", 3).map((a) => a.id));

// Coverage of the Hindi bundle against the English.
const noHi = ALL_ANSWERS.filter((a) => !ANSWERS_HI[a.id]).map((a) => a.id);
console.log("answers without Hindi:", noHi.length, noHi.slice(0, 10));
console.log("flows without Hindi:", SYMPTOM_FLOWS.filter((f) => !SYMPTOMS_HI[f.id]).map((f) => f.id));
const outcomesMissing = SYMPTOM_FLOWS.flatMap((f) => f.outcomes.filter((o) => !SYMPTOMS_HI[f.id]?.outcomes[o.id]).map((o) => `${f.id}/${o.id}`));
console.log("outcomes without Hindi:", outcomesMissing);
console.log("menus without Hindi:", Object.keys(MENUS).filter((id) => !MENUS_HI[id]));
console.log("flow nodes without Hindi:", Object.keys(FLOWS).filter((id) => !FLOWS_HI[id]));
console.log("finders:", Object.keys(FINDERS_HI), "strings:", Object.keys(STRINGS_HI).length);
const dash = JSON.stringify([ANSWERS_HI, SYMPTOMS_HI, MENUS_HI, FLOWS_HI, FINDERS_HI, STRINGS_HI]).match(/[–—]/g);
console.log("dashes:", dash?.length || 0);
