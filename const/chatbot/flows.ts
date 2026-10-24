// Tap-through helpers inside the chat. Facts follow the product knowledge base
// (02-ovy-sanitary-pads, 05-ovy-menstrual-cup). No prices.

export type FlowStep = {
  text: string;
  options: { label: string; next: string }[];
};

export type FlowResult = {
  text: string;
  links: { label: string; href: string }[];
};

export const FLOWS: Record<string, FlowStep | FlowResult> = {
  // ---- Pad size finder ----
  "pad:start": {
    text: "Let's find your pad size. How heavy is your flow on most days?",
    options: [
      { label: "Light", next: "pad:light" },
      { label: "Medium to heavy", next: "pad:medium" },
      { label: "Very heavy or overnight", next: "pad:heavy" },
      { label: "It changes a lot", next: "pad:mix" },
      { label: "Buying for someone else", next: "pad:gift" },
    ],
  },
  "pad:light": {
    text: "**L (240mm)** suits you: light days, school, work and the last days of a period, for 4 to 6 hours. Keep a few **XL** for heavier days or nights.",
    links: [{ label: "See Ovy pads", href: "/product-detail/ovy-pads" }],
  },
  "pad:medium": {
    text: "**XL (280mm)** is your everyday pad: medium to heavy days and full school or office days, for up to 8 hours. For nights or your heaviest day, **XL+** gives more cover at the back.",
    links: [{ label: "See Ovy pads", href: "/product-detail/ovy-pads" }],
  },
  "pad:heavy": {
    text: "**XL+ (320mm)** is our most protective pad: extra length, a wider back and dual side leak guards for very heavy flow, nights and postpartum bleeding. If you soak through an XL+ in under 2 hours, please see a doctor.",
    links: [{ label: "See Ovy pads", href: "/product-detail/ovy-pads" }],
  },
  "pad:mix": {
    text: "Go for **Mix Your Box**: combine L, XL and XL+ in one box, so every day of your period has the right pad. A good first mix is 6 L, 9 XL and 6 XL+.",
    links: [{ label: "Build my box", href: "/product-detail/ovy-pads" }],
  },
  "pad:gift": {
    text: "Choose **XL+** if you don't know their flow. It's the most protective, so it suits anyone. Or pick **Mix Your Box** so they get every size.",
    links: [{ label: "See Ovy pads", href: "/product-detail/ovy-pads" }],
  },

  // ---- Cup size finder ----
  "cup:start": {
    text: "Let's find your cup size. Fit matters most, so a few quick questions. Have you had a vaginal birth?",
    options: [
      { label: "Yes", next: "cup:large" },
      { label: "No, or only a C-section", next: "cup:cervix" },
    ],
  },
  "cup:cervix": {
    text: "On a period day, with clean hands, gently slide one finger in until you feel your cervix (firm, like the tip of your nose). How far did your finger go?",
    options: [
      { label: "To the 1st knuckle (low)", next: "cup:teen" },
      { label: "To the 2nd knuckle (average)", next: "cup:flow" },
      { label: "3rd knuckle or can't reach (high)", next: "cup:medium" },
      { label: "Not sure / prefer not to check", next: "cup:flow" },
    ],
  },
  "cup:flow": {
    text: "And which sounds most like you?",
    options: [
      { label: "First time, or a teen", next: "cup:teen" },
      { label: "Average flow", next: "cup:medium" },
      { label: "Heavy flow", next: "cup:medium-heavy" },
    ],
  },
  "cup:teen": {
    text: "**Teen (XS, 16 ml)** is the softest and shortest, made for first-timers, teens and a lower cervix. Try the punch-down fold for an easy first go.",
    links: [{ label: "See Potent Hygiene cup", href: "/product-detail/ovy-cup" }],
  },
  "cup:medium": {
    text: "**Medium (25 ml)** is the everyday all-rounder, including many over-30s and C-section mums. It's worn for up to 12 hours.",
    links: [{ label: "See Potent Hygiene cup", href: "/product-detail/ovy-cup" }],
  },
  "cup:medium-heavy": {
    text: "Start with **Medium (25 ml)** and empty it more often on heavy days. If your cervix sits high, **Large (35 ml)** gives more room. The cup page has a 4-question size quiz to double-check.",
    links: [{ label: "Take the size quiz", href: "/product-detail/ovy-cup" }],
  },
  "cup:large": {
    text: "**Large (35 ml)** usually fits best after a vaginal birth, once your doctor has cleared you to use internal products again. It's worn for up to 12 hours.",
    links: [{ label: "See Potent Hygiene cup", href: "/product-detail/ovy-cup" }],
  },
};

export function isFlowResult(node: FlowStep | FlowResult): node is FlowResult {
  return "links" in node;
}
