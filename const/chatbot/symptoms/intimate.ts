import type { SymptomFlow } from "../symptomTypes";
import { FEMALE, MIDLIFE_AGES, NO_PREG_AGES, PERIOD_AGES, REPRO } from "../applies";

// Intimate health check-ins: discharge, itching, burning when peeing, PMS and
// pad rash. Guidance only, never a diagnosis. Pregnancy, sex and
// contraception only come up for women 18 to 44 asking for themselves or
// someone else (REPRO in ../applies); children and women 45+ get their own
// outcomes where the general wording wouldn't fit.

export const FLOWS: SymptomFlow[] = [
  // 1. Changes in vaginal discharge
  {
    id: "discharge",
    title: "Changes in vaginal discharge",
    short: "Colour, smell, texture or itching",
    triggers: [
      "vaginal discharge",
      "white discharge",
      "discharge smell",
      "smelly discharge",
      "yellow discharge",
      "green discharge",
      "brown discharge",
      "discharge with itching",
      "safed pani",
      "white pani aa raha hai",
      "likoria",
      "leucorrhoea",
      "discharge normal hai kya",
      "discharge badal gaya",
    ],
    needs: {},
    showIf: FEMALE,
    notFor:
      "This check-in is about vaginal discharge, so it doesn't fit the details you gave: for a boy or man with discharge, pain or sores, please see a doctor, as it usually needs a simple test.",
    questions: [
      {
        id: "change",
        text: "What has changed most?",
        options: [
          { id: "more", label: "There's more than usual, but it looks the same" },
          { id: "colour", label: "The colour: yellow, green or grey" },
          { id: "thick", label: "Thick and lumpy, like cottage cheese" },
          { id: "smell", label: "A strong or fishy smell" },
          { id: "blood", label: "Pink, red or bloody, and it's not my period", flag: "amber" },
          { id: "unsure", label: "Not sure, it just feels different" },
        ],
      },
      {
        id: "when",
        text: "When did you notice it?",
        options: [
          { id: "cycle", label: "It comes and goes with my cycle", showIf: { ages: PERIOD_AGES } },
          { id: "days", label: "In the last few days" },
          { id: "week", label: "It has lasted more than a week" },
          { id: "product", label: "After a new soap, wash, wipe, pad or liner" },
        ],
      },
      {
        id: "with",
        text: "Anything else along with it? Pick all that fit.",
        multi: true,
        options: [
          { id: "itch", label: "Itching, soreness, or burning when I pee" },
          { id: "pain", label: "Pain low in my tummy or pelvis", flag: "amber" },
          { id: "sores", label: "Sores, blisters or lumps", flag: "amber" },
          { id: "fever", label: "Fever along with tummy or pelvic pain", flag: "red" },
          { id: "bleed", label: "Bleeding after sex", flag: "red", showIf: REPRO },
          { id: "bleed-meno", label: "Any bleeding after menopause", flag: "red", showIf: { ages: MIDLIFE_AGES } },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "preg",
        text: "Could you be pregnant?",
        showIf: REPRO,
        options: [
          { id: "yes", label: "Yes, or I'm pregnant" },
          { id: "fluid", label: "I'm pregnant and it's watery, a gush or a trickle", flag: "red" },
          { id: "unsure", label: "Not sure" },
          { id: "no", label: "No" },
        ],
      },
    ],
    outcomes: [
      {
        id: "discharge-red-np",
        match: { flag: "red", ages: NO_PREG_AGES },
        urgency: "emergency",
        title: "Something you mentioned needs a doctor today",
        summary:
          "Thank you for telling me. Fever with tummy or pelvic pain, or bleeding that isn't a period, are signs to get checked **today**, not waited out. If the pain is severe or there is faintness, call **112** or go to the nearest emergency.",
        oftenLinkedTo: [
          "An infection that has spread higher up, which needs prompt treatment",
          "Bleeding that isn't a period, which always deserves an examination",
        ],
        whatHelps: [
          "Contact a doctor or gynaecologist today",
          "Note when it started and what changed, to tell the doctor",
          "Don't put creams, washes or home remedies on the area before the visit",
        ],
        seeDoctor:
          "Today: these signs are usually something treatable, but they are never ones to sit on.",
      },
      {
        id: "discharge-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "Something you mentioned needs a doctor today",
        summary:
          "Thank you for telling me. Fever with pelvic pain, bleeding after sex or after menopause, or watery fluid in pregnancy are signs to get checked **today**, not waited out. If the pain is severe or you feel faint, call **112** or go to the nearest emergency.",
        oftenLinkedTo: [
          "An infection that has spread higher up, which needs prompt treatment",
          "Bleeding that isn't a period, which always deserves an examination",
          "In pregnancy, leaking waters, which can look like discharge or a bladder leak",
        ],
        whatHelps: [
          "Contact your doctor, gynaecologist or midwife today",
          "In pregnancy, don't sit and watch a liner to find out. Not being sure is itself the reason to call",
          "Wear a pad, not a cup or tampon, so the doctor can see what's happening",
          "Note when it started and what changed, to tell the doctor",
        ],
        seeDoctor:
          "Today: these signs are usually something treatable, but they are never ones to sit on.",
      },
      {
        id: "discharge-amber-np",
        match: { flag: "amber", ages: NO_PREG_AGES },
        urgency: "soon",
        title: "This change is worth a doctor's look in the next day or two",
        summary:
          "Blood in discharge outside a period, tummy or pelvic pain, or sores and blisters are signs to get checked soon. Most causes are common and treatable, but they need the right check, not a guess.",
        oftenLinkedTo: [
          "Infections that a simple swab or urine test can check",
          "Irritation or small injuries to the skin",
          "Skin conditions of the vulva, which respond well to treatment",
          "Hormone changes, such as in the first years of periods or after menopause",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist in the next day or two",
          "Wash the outside only, with plain warm water. No soap, antiseptic or douching",
          "Wear loose cotton underwear",
          "For a child or teen, a parent or trusted adult can go along, and you can ask for a female doctor",
        ],
        seeDoctor:
          "Within 1 to 2 days, and sooner if a fever, severe pain or heavier bleeding starts.",
        readMore: [{ label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" }],
      },
      {
        id: "discharge-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "This change is worth a doctor's look in the next day or two",
        summary:
          "Blood in discharge outside your period, pelvic pain, or sores and blisters are signs to get checked soon. Most causes are common and treatable, but they need the right test, not a guess.",
        oftenLinkedTo: [
          "Infections, including ones passed on through sex, which often need a simple test",
          "Irritation or small injuries to the skin or cervix",
          "Hormone changes, including from contraception",
        ],
        whatHelps: [
          "Book a visit with a doctor, gynaecologist or sexual health clinic in the next day or two",
          "Wash the outside only, with plain warm water. No soap, antiseptic or douching",
          "Wear loose cotton underwear",
          "Testing is quick, often just a swab or urine sample, and confidential",
        ],
        seeDoctor:
          "Within 1 to 2 days, and sooner if a fever, severe pain or heavier bleeding starts.",
        readMore: [
          { label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" },
        ],
      },
      {
        id: "discharge-pregnant",
        match: { answers: { preg: ["yes"], change: ["colour", "thick", "smell", "unsure"] } },
        urgency: "soon",
        title: "Discharge has changed, and you may be pregnant",
        summary:
          "More discharge is very normal in pregnancy. A change in colour, texture or smell is worth a call **sooner than you'd bother at other times**, and isn't something to treat yourself from a chemist shelf.",
        oftenLinkedTo: [
          "Common, treatable infections like thrush or an imbalance of the vagina's own bacteria",
          "Normal pregnancy changes, which a doctor can confirm",
        ],
        whatHelps: [
          "Call your doctor or midwife in the next day or two and describe the change",
          "Don't use medicines, washes or home remedies without their advice",
          "A fresh, breathable liner changed every 3 to 4 hours can help you stay comfortable",
        ],
        seeDoctor:
          "Within 1 to 2 days, and straight away if there is any bleeding, pain or watery fluid.",
        products: ["ovy-liners"],
      },
      {
        id: "discharge-child",
        match: { ages: ["u5"] },
        urgency: "checkup",
        title: "Discharge in a young child is worth showing a doctor",
        summary:
          "Before puberty, discharge isn't expected, so discharge, redness or soreness in a young child is worth a gentle check by a doctor. It's usually something simple, like irritation from soap or a mild infection.",
        oftenLinkedTo: [
          "Irritation from soap, bubble bath, wipes or tight clothes",
          "Wet or soiled nappies or underwear left on for long",
          "A mild infection, which a doctor can check easily",
          "Sometimes a small object, such as a bit of tissue, which a doctor can gently check for",
        ],
        whatHelps: [
          "Wash the outside with plain warm water only and pat dry",
          "Loose cotton underwear changed daily, and frequent nappy changes",
          "Wipe front to back every time",
          "Skip bubble bath and scented soaps",
        ],
        seeDoctor:
          "Book a visit in the next few days, and sooner if there is blood, a bad smell, pain or a fever.",
      },
      {
        id: "discharge-young",
        match: { ages: ["u13"], answers: { change: ["colour", "thick", "smell", "unsure"] } },
        urgency: "checkup",
        title: "Discharge that's changed in a young girl",
        summary:
          "A little white or clear discharge is normal and often a sign that periods are on the way. Discharge that smells strong, looks coloured or lumpy, or itches is worth showing a doctor, not managing with a liner.",
        oftenLinkedTo: [
          "Irritation from soap, bubble bath or tight clothes",
          "Not wiping front to back",
          "Common infections that a doctor can check easily",
        ],
        whatHelps: [
          "Wash the outside with plain warm water only and pat dry",
          "Loose cotton underwear, changed daily",
          "Wipe front to back every time",
          "A parent or trusted adult can go with her to the doctor",
        ],
        seeDoctor:
          "Book a visit in the next few days, and sooner if there is pain, blood or a fever.",
      },
      {
        id: "discharge-teen",
        match: { ages: ["13-17"], answers: { change: ["colour", "thick", "smell", "unsure"] } },
        urgency: "checkup",
        title: "Discharge that has changed is worth a check",
        summary:
          "Some white or clear discharge is normal and healthy in the teen years. When it changes colour, turns lumpy, smells strong or itches, a doctor can tell what's going on with a quick check, and it's usually easy to treat.",
        oftenLinkedTo: [
          "Thrush, a yeast overgrowth, often thick and white with itching",
          "An imbalance of the vagina's own bacteria, often thin and grey with a fishy smell",
          "Irritation from scented soap, washes, wipes or tight clothes",
        ],
        whatHelps: [
          "Book a visit with a doctor this week: a parent or trusted adult can go too",
          "Stop any scented soap, intimate wash, wipe or spray",
          "Wash the outside only, with plain warm water",
          "If a liner helps you feel fresh, change it every 3 to 4 hours",
        ],
        seeDoctor:
          "This week, because the right treatment depends on the cause, and that needs a doctor.",
        products: ["ovy-liners"],
        readMore: [{ label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" }],
      },
      {
        id: "discharge-midlife",
        match: { ages: ["45-49", "50+"], answers: { change: ["colour", "thick", "smell", "unsure"] } },
        urgency: "checkup",
        title: "Discharge that has changed in your late 40s or 50s",
        summary:
          "Changes in discharge are common at this age and usually easy to treat. Around and after menopause, lower hormone levels can also make the skin thinner and drier, which changes discharge and makes infection and irritation more likely. A quick check finds the cause.",
        oftenLinkedTo: [
          "Thrush, or an imbalance of the vagina's own bacteria",
          "Thinning and dryness of the vaginal skin around and after menopause",
          "Scented washes, wipes or douching upsetting the natural balance",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist this week",
          "Stop any scented soap, intimate wash, wipe or spray",
          "Wash the outside only, with plain warm water",
          "Any blood in discharge after menopause needs a doctor within a few days",
        ],
        seeDoctor:
          "This week, because the right treatment depends on the cause.",
        products: ["ovy-liners"],
      },
      {
        id: "discharge-infection-pattern",
        match: { answers: { change: ["colour", "thick", "smell"] } },
        urgency: "checkup",
        title: "Your discharge has changed in colour, texture or smell",
        summary:
          "Changes like these are very common and usually easy to treat, but each cause is treated differently, so guessing rarely helps. A doctor can tell with a quick check.",
        oftenLinkedTo: [
          "Thrush, a yeast overgrowth, often thick and white with itching",
          "An imbalance of the vagina's own bacteria, often thin and grey with a fishy smell",
          "Some infections passed on through sex, often yellow, green or frothy",
          "Scented washes, wipes or douching upsetting the natural balance",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist this week",
          "Stop any scented soap, intimate wash, wipe or spray",
          "Wash the outside only, with plain warm water",
          "If a liner helps you feel fresh, change it every 3 to 4 hours",
        ],
        seeDoctor:
          "This week, because the right treatment depends on the cause, and that needs a doctor.",
        products: ["ovy-liners"],
        readMore: [
          { label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" },
        ],
      },
      {
        id: "discharge-with-itch",
        match: { answers: { with: ["itch"] } },
        urgency: "checkup",
        title: "Discharge with itching or burning",
        summary:
          "Itching, soreness or burning alongside discharge is one of the signs worth getting checked. It's usually something common and treatable.",
        oftenLinkedTo: [
          "Thrush or another common vaginal infection",
          "A urine infection, if it burns when you pee",
          "Irritation from soap, wipes, detergent or a product worn too long",
        ],
        whatHelps: [
          "Book a visit with a doctor this week",
          "Plain warm water on the outside only, and pat dry",
          "Loose cotton underwear, and sleep without underwear if it feels better",
          "Drink plenty of water if peeing stings",
        ],
        seeDoctor:
          "This week, and within a day or two if burning when you pee gets worse or a fever starts.",
        readMore: [
          { label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" },
        ],
      },
      {
        id: "discharge-normal-young",
        match: { ages: ["u13", "13-17"] },
        urgency: "selfcare",
        title: "This sounds like everyday discharge",
        summary:
          "Discharge is normal and healthy: it's how the body keeps itself clean. In girls, white or clear discharge often starts a few months to a year before the first period, and once periods start it changes through the month.",
        oftenLinkedTo: [
          "A sign that periods may start within a year or so, if they haven't yet",
          "Normal changes through the cycle once periods have started",
          "Sweat, heat or tight clothes making it feel like more",
        ],
        whatHelps: [
          "Wash the outside only, with plain warm water. The vagina cleans itself",
          "If it started after a new soap, wash or product, stop that product",
          "Cotton underwear, and a liner changed every 3 to 4 hours for a fresh feeling",
          "Note changes in the free [period tracker](/period-log) to learn the pattern",
        ],
        seeDoctor:
          "If it starts to itch, smell strong, change colour or comes with pain, book a visit.",
        products: ["ovy-liners", "ovy-teen"],
        readMore: [{ label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" }],
      },
      {
        id: "discharge-normal-midlife",
        match: { ages: ["45-49", "50+"] },
        urgency: "selfcare",
        title: "This sounds like everyday discharge",
        summary:
          "Discharge is normal and healthy at every age. In the years around menopause, many women notice less discharge or more dryness, and some notice changes from month to month while periods are changing.",
        oftenLinkedTo: [
          "Normal changes while periods are changing",
          "Lower hormone levels around and after menopause, which can mean less discharge and more dryness",
          "Sweat, heat or tight clothes",
        ],
        whatHelps: [
          "Wash the outside only, with plain warm water",
          "If it started after a new soap, wash or product, stop that product",
          "Cotton underwear, and a liner changed every 3 to 4 hours if you'd like to feel fresh",
          "Mention dryness or soreness to a doctor: there are simple treatments",
        ],
        seeDoctor:
          "If it starts to itch, smell strong, change colour, shows any blood or comes with pain, book a visit.",
        products: ["ovy-liners"],
      },
      {
        id: "discharge-normal",
        urgency: "selfcare",
        title: "This sounds like everyday discharge",
        summary:
          "Discharge is normal and healthy. It's how the body keeps itself clean, and it changes through the month: clearer and stretchy around mid-cycle, thicker and creamier after. More is also common in pregnancy and with some contraception.",
        oftenLinkedTo: [
          "Normal changes through your cycle",
          "Ovulation, when it's clear, slippery and more noticeable",
          "In girls, a sign that periods may start within a year or so",
          "Pregnancy or hormonal contraception",
        ],
        whatHelps: [
          "Wash the outside only, with plain warm water. The vagina cleans itself",
          "If it started after a new soap, wash or product, stop that product",
          "Cotton underwear, and a liner changed every 3 to 4 hours if you'd like to feel fresh",
          "Note changes in the free [period tracker](/period-log) to learn your own pattern",
        ],
        seeDoctor:
          "If it starts to itch, smell strong, change colour or comes with pain, book a visit.",
        products: ["ovy-liners", "period-tracker"],
        readMore: [
          { label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" },
        ],
      },
    ],
    sources: [
      { label: "NHS: Vaginal discharge", url: "https://www.nhs.uk/symptoms/vaginal-discharge/" },
      { label: "Cleveland Clinic: Vaginal discharge", url: "https://my.clevelandclinic.org/health/symptoms/4719-vaginal-discharge" },
      { label: "MedlinePlus: Vaginal discharge", url: "https://medlineplus.gov/ency/article/003158.htm" },
      { label: "NHS 111 Wales: Vaginitis", url: "https://111.wales.nhs.uk/vaginitis/?locale=en" },
    ],
  },

  // 2. Itching, burning or irritation down there
  {
    id: "itching",
    title: "Itching, burning or irritation down there",
    short: "Itchy, sore or burning skin",
    triggers: [
      "itching down there",
      "vaginal itching",
      "itchy vagina",
      "private part itching",
      "burning down there",
      "irritation down there",
      "vulva itching",
      "itchy after shaving",
      "neeche khujli",
      "khujli ho rahi hai",
      "private part me khujli",
      "private part me jalan",
      "neeche jalan ho rahi hai",
    ],
    needs: {},
    showIf: FEMALE,
    notFor:
      "This check-in is written for girls and women, so it doesn't fit the details you gave: for itching or soreness in a boy or man, a pharmacist or doctor can help, and see a doctor soon for sores, blisters or a fever.",
    questions: [
      {
        id: "where",
        text: "Where is it mostly?",
        options: [
          { id: "outside", label: "On the skin outside, the lips or vulva" },
          { id: "inside", label: "Inside, at the opening" },
          { id: "folds", label: "In the skin folds or inner thighs" },
          { id: "pee", label: "It burns mostly when I pee" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "start",
        text: "When did it start?",
        options: [
          { id: "recent", label: "Today or yesterday" },
          { id: "week", label: "Within the last week" },
          { id: "longer", label: "More than two weeks ago" },
          { id: "returns", label: "It keeps coming back" },
        ],
      },
      {
        id: "trigger",
        text: "Anything new or different lately? Pick all that fit.",
        multi: true,
        options: [
          { id: "product", label: "A new soap, intimate wash, wipe or detergent" },
          { id: "pad", label: "Pads or liners, or wearing one for long", showIf: { ages: PERIOD_AGES } },
          { id: "shave", label: "Shaving, waxing or hair removal cream", showIf: { ages: ["13-17", "18-29", "30-39", "40-44", "45-49", "50+"] } },
          { id: "heat", label: "Heat, sweat, tight clothes or travel" },
          { id: "period", label: "It started around my period", showIf: { ages: PERIOD_AGES } },
          { id: "nappy", label: "Nappies, or wet or soiled underwear", showIf: { ages: ["u5"] } },
          { id: "night", label: "Worse at night, or itching around the bottom too", showIf: { ages: ["u5", "5-12"] } },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "with",
        text: "Anything else along with it? Pick all that fit.",
        multi: true,
        options: [
          { id: "discharge", label: "Discharge that's changed in colour, texture or smell" },
          { id: "sores", label: "Sores, blisters or ulcers", flag: "amber" },
          { id: "patches", label: "White, thin or shiny patches of skin", flag: "amber" },
          { id: "fever", label: "Fever or pain low in my tummy", flag: "red" },
          { id: "bleed", label: "Bleeding after sex", flag: "red", showIf: REPRO },
          { id: "bleed-other", label: "Any bleeding that isn't a normal period", flag: "red" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "preg",
        text: "Could you be pregnant?",
        showIf: REPRO,
        options: [
          { id: "yes", label: "Yes, or I'm pregnant", flag: "amber" },
          { id: "unsure", label: "Not sure" },
          { id: "no", label: "No" },
        ],
      },
    ],
    outcomes: [
      {
        id: "itching-red-young",
        match: { flag: "red", ages: ["u13"] },
        urgency: "emergency",
        title: "Itching with a fever, tummy pain or bleeding needs a doctor today",
        summary:
          "In a child, itching that comes with a fever, tummy pain or any bleeding should be checked by a doctor **today**. If the child is very unwell, floppy or in severe pain, call **112** or go to the nearest emergency.",
        oftenLinkedTo: [
          "An infection that needs prompt treatment",
          "A skin injury or skin condition that needs a proper look",
          "Bleeding in a young girl, which always deserves an examination",
        ],
        whatHelps: [
          "Contact a doctor today, and go with her",
          "Don't put creams, powders or home remedies on the area before the visit",
          "Loose cotton underwear, and keep the area clean and dry",
        ],
        seeDoctor:
          "Today: it's usually something treatable, but not something to sit on.",
      },
      {
        id: "itching-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "Something you mentioned needs a doctor today",
        summary:
          "Itching with a fever or tummy pain, or bleeding that isn't a period, is one to get checked **today**. If the pain is severe or you feel faint, call **112** or go to the nearest emergency.",
        oftenLinkedTo: [
          "An infection that may have spread, which needs prompt treatment",
          "Bleeding that isn't a period, which always deserves an examination",
        ],
        whatHelps: [
          "Contact a doctor or gynaecologist today",
          "Use a pad, not a cup or tampon, until a doctor has seen it",
          "Don't put creams, washes or home remedies on the area before the visit",
        ],
        seeDoctor:
          "Today: it's usually something treatable, but not something to sit on.",
      },
      {
        id: "itching-amber-np",
        match: { flag: "amber", ages: NO_PREG_AGES },
        urgency: "soon",
        title: "This itch is worth a doctor's look in the next day or two",
        summary:
          "Sores, blisters, or white, thin or shiny patches of skin are worth seeing a doctor about soon. Most causes are common and treatable once someone looks.",
        oftenLinkedTo: [
          "Infections that cause sores or blisters, which a simple test can check",
          "Skin conditions of the vulva, such as lichen sclerosus, which is most common in young girls and after menopause and responds well to treatment",
          "Irritation or a reaction to something touching the skin",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist in the next day or two",
          "Don't burst blisters or scratch. A cool, clean cloth can soothe",
          "Plain warm water on the outside only, and pat dry",
          "For a child or teen, a parent or trusted adult can go along",
        ],
        seeDoctor:
          "Within 1 to 2 days, because sores and skin changes need a proper look and sometimes a simple test.",
      },
      {
        id: "itching-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "This itch is worth a doctor's look in the next day or two",
        summary:
          "Sores, blisters, unusual skin patches, or itching during pregnancy are worth seeing a doctor about soon. Most causes are common and treatable once someone looks.",
        oftenLinkedTo: [
          "Some infections, including ones passed on through sex, that cause sores or blisters",
          "Skin conditions of the vulva, which respond well to treatment",
          "In pregnancy, common infections like thrush, which are more likely then",
        ],
        whatHelps: [
          "Book a visit with a doctor, gynaecologist or sexual health clinic in the next day or two",
          "Don't burst blisters or scratch. A cool, clean cloth can soothe",
          "Plain warm water on the outside only, and pat dry",
          "In pregnancy, don't use anything from a chemist shelf without your doctor's advice",
        ],
        seeDoctor:
          "Within 1 to 2 days, because sores and skin changes need a proper look and sometimes a simple test.",
      },
      {
        id: "itching-child",
        match: { ages: ["u13"] },
        urgency: "checkup",
        title: "Itching down there in a young girl",
        summary:
          "Itching or soreness down there is common in young girls and is usually caused by something simple, like soap, bubble bath, wet clothes or threadworms. It often settles with a few gentle changes, and a doctor can check if it doesn't.",
        oftenLinkedTo: [
          "Irritation from soap, bubble bath, wipes or detergent",
          "Wet or soiled nappies or underwear, sweat or tight clothes",
          "Threadworms, especially if it itches more at night or around the bottom",
          "Less often, a skin condition or infection that a doctor can check",
        ],
        whatHelps: [
          "Wash with plain warm water only and pat dry, with no bubble bath or scented soap",
          "Loose cotton underwear changed daily, and quick changes out of wet clothes or nappies",
          "Wipe front to back every time, and keep nails short to limit scratching",
          "If threadworms are possible, a doctor or pharmacist can advise on treatment for the whole family",
        ],
        seeDoctor:
          "See a doctor if it doesn't settle in a few days, keeps coming back, or there is discharge, bleeding, sores or white patches.",
      },
      {
        id: "itching-discharge",
        match: { answers: { with: ["discharge"] } },
        urgency: "checkup",
        title: "Itching along with a change in discharge",
        summary:
          "Itching with discharge that has changed is one of the commonest reasons to see a gynaecologist, and it's usually easy to treat. The causes look alike, so a check beats guessing.",
        oftenLinkedTo: [
          "Thrush, often with thick white discharge",
          "An imbalance of the vagina's own bacteria",
          "Other infections that a simple swab can check",
        ],
        whatHelps: [
          "Book a visit with a doctor this week",
          "Stop scented soaps, washes, wipes and sprays",
          "Loose cotton underwear, and air time for the skin",
        ],
        seeDoctor:
          "This week, because each cause is treated differently.",
        readMore: [
          { label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" },
        ],
      },
      {
        id: "itching-pee",
        match: { answers: { where: ["pee"] } },
        urgency: "checkup",
        title: "It burns mostly when you pee",
        summary:
          "Burning when you pee can come from the bladder or from sore skin outside that stings when urine touches it. A doctor can tell which with a simple urine test.",
        oftenLinkedTo: [
          "A urine infection",
          "Sore or irritated skin around the opening",
          "Thrush or another vaginal infection",
        ],
        whatHelps: [
          "Drink plenty of water so your urine is pale",
          "Don't hold urine for long",
          "Pouring a little lukewarm water over the area while you pee can ease the sting",
        ],
        seeDoctor:
          "Within a day or two, and the same day if a fever, back pain or vomiting starts.",
        readMore: [
          { label: "Public toilet hygiene and UTI tips", href: "/blog/public-toilet-hygiene-travel-uti-tips" },
        ],
      },
      {
        id: "itching-lasting",
        match: { answers: { start: ["longer", "returns"] } },
        urgency: "checkup",
        title: "An itch that's lasting or keeps coming back",
        summary:
          "Itching that lasts more than a couple of weeks, or keeps returning, deserves a proper check rather than another round of guessing.",
        oftenLinkedTo: [
          "Repeated thrush, which a doctor may check blood sugar for",
          "A skin condition of the vulva, such as eczema",
          "Ongoing irritation from a product used every day",
          "Lower hormone levels around menopause, which can make skin dry and itchy",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist",
          "Keep a note of when it flares, and what you used or wore that day",
          "Switch to plain warm water and unscented, mild laundry products",
        ],
        seeDoctor:
          "Book a visit soon, because a lasting itch is usually very treatable once the cause is found.",
        products: ["period-tracker"],
      },
      {
        id: "itching-pad-shave",
        match: { answers: { trigger: ["pad", "shave"] } },
        urgency: "selfcare",
        title: "Skin irritation from pads, liners or hair removal",
        summary:
          "Itching or burning on the outside skin after wearing a pad for long or after shaving or waxing is usually a skin reaction, not an infection. It often settles in a few days once the cause is removed.",
        oftenLinkedTo: [
          "Trapped moisture and heat from a pad or liner worn too long",
          "Friction where the edges rub",
          "Razor bumps or a reaction to hair removal cream",
        ],
        whatHelps: [
          "Change pads every 4 to 6 hours and liners every 3 to 4 hours",
          "Give your skin liner-free time, and skip liners on sore or freshly waxed skin",
          "Plain warm water, pat dry, loose cotton underwear",
          "Let shaved skin heal before shaving again, and don't scratch",
        ],
        seeDoctor:
          "If it doesn't settle in a few days, spreads, or blisters appear, see a doctor.",
        products: ["ovy-pads"],
        readMore: [
          { label: "Are sanitary pads safe?", href: "/blog/are-sanitary-pads-safe-chemicals-rashes" },
        ],
      },
      {
        id: "itching-default",
        urgency: "selfcare",
        title: "Itching that's new and mild",
        summary:
          "A mild, new itch is very common, and often comes from something touching the skin: soap, a wash, detergent, sweat or tight clothes. It usually eases within a few days once the trigger is gone.",
        oftenLinkedTo: [
          "Irritation from scented soap, intimate wash, wipes or detergent",
          "Sweat, heat and tight clothes, especially on long journeys",
          "Early thrush, which may need a doctor if discharge changes",
        ],
        whatHelps: [
          "Wash the outside only, with plain warm water, and pat dry",
          "Stop any new or scented product",
          "Loose cotton underwear, and change out of sweaty clothes quickly",
          "Try not to scratch. A cool, clean cloth can soothe",
        ],
        seeDoctor:
          "If it lasts more than a week, keeps coming back, or discharge changes, see a doctor.",
      },
    ],
    sources: [
      { label: "NHS 111 Wales: Vaginitis", url: "https://111.wales.nhs.uk/vaginitis/?locale=en" },
      { label: "MedlinePlus: Vaginal discharge", url: "https://medlineplus.gov/ency/article/003158.htm" },
      { label: "NHS: Contact dermatitis", url: "https://www.nhs.uk/conditions/contact-dermatitis/" },
      { label: "Cleveland Clinic: Vaginal discharge", url: "https://my.clevelandclinic.org/health/symptoms/4719-vaginal-discharge" },
    ],
  },

  // 3. Burning or pain while peeing
  {
    id: "uti",
    title: "Burning or pain while peeing",
    short: "Burning, stinging or peeing often",
    triggers: [
      "burning while peeing",
      "pain while peeing",
      "burning urine",
      "uti",
      "urine infection",
      "frequent urination",
      "pee burns",
      "peshab me jalan",
      "pishab mein jalan",
      "urine mein jalan",
      "susu mein jalan",
      "baar baar peshab aana",
      "baar baar toilet jaana",
    ],
    needs: { who: true, sex: true },
    questions: [
      {
        id: "main",
        text: "What are you noticing? Pick all that fit.",
        multi: true,
        options: [
          { id: "burn", label: "Burning or stinging when I pee" },
          { id: "often", label: "Needing to go often or urgently" },
          { id: "small", label: "Only small amounts come out" },
          { id: "cloudy", label: "Cloudy, dark or strong-smelling urine" },
          { id: "lower", label: "Pain or pressure low in my tummy" },
          { id: "itch", label: "Itching or a change in discharge" },
        ],
      },
      {
        id: "serious",
        text: "Any of these too? Pick all that fit.",
        multi: true,
        options: [
          { id: "fever", label: "Fever, chills or shivering", flag: "red" },
          { id: "back", label: "Pain in my back or side, below the ribs", flag: "red" },
          { id: "vomit", label: "Vomiting or feeling very unwell", flag: "red" },
          { id: "confused", label: "Confused or very drowsy", flag: "red" },
          { id: "blood", label: "Blood in my urine, pink or red", flag: "amber" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "preg",
        text: "Is pregnancy possible right now?",
        showIf: REPRO,
        options: [
          { id: "yes", label: "Yes, or I'm pregnant", flag: "amber" },
          { id: "unsure", label: "Not sure" },
          { id: "no", label: "No, or this doesn't apply" },
        ],
      },
      {
        id: "how",
        text: "How long has it been going on?",
        options: [
          { id: "new", label: "It started in the last day or two" },
          { id: "lasting", label: "More than two days and not getting better" },
          { id: "repeat", label: "It keeps coming back, twice or more in six months" },
        ],
      },
      {
        id: "habits",
        text: "Does any of this sound like you lately? Pick all that fit.",
        multi: true,
        options: [
          { id: "hold", label: "Holding urine for hours: travel, work or school" },
          { id: "water", label: "Not drinking much water" },
          { id: "toilets", label: "Avoiding dirty or public toilets" },
          { id: "pad", label: "Long hours in the same pad or liner", showIf: { ages: PERIOD_AGES, sex: ["female", "other"] } },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "uti-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "Burning with fever, back pain or vomiting needs care today",
        summary:
          "When burning comes with a fever, pain in the back or side, vomiting or confusion, it can be a sign that an infection has reached the kidneys. Please see a doctor **today**. If someone is confused, very drowsy or struggling, call **112** or go to the nearest emergency.",
        oftenLinkedTo: [
          "A urine infection that has moved up towards the kidneys",
          "An infection that is making the whole body unwell",
        ],
        whatHelps: [
          "See a doctor or go to a hospital today. Don't wait for it to pass",
          "Keep sipping water if you can keep it down",
          "Don't drive yourself if you feel faint, confused or very unwell",
        ],
        seeDoctor:
          "Today, because kidney infections are very treatable when caught early and serious if left.",
      },
      {
        id: "uti-amber",
        match: { answers: { preg: ["yes"] } },
        urgency: "soon",
        title: "Burning when peeing that needs a doctor soon",
        summary:
          "Blood in your urine, or burning when peeing during pregnancy, should be checked by a doctor within a day or two. In pregnancy especially, urine infections need treating promptly.",
        oftenLinkedTo: [
          "A urine infection",
          "Irritation of the bladder or urine tube",
          "Less often, a stone or another cause a doctor would want to rule out",
        ],
        whatHelps: [
          "Book a doctor's visit in the next day or two and ask for a urine test",
          "Drink enough water to keep your urine pale",
          "In pregnancy, don't take anything without your doctor's advice",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if a fever, back pain or vomiting starts.",
      },
      {
        id: "uti-blood",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Blood in the urine needs a doctor soon",
        summary:
          "Pink or red urine, or blood when peeing, should be checked by a doctor within a day or two. It's often linked to a urine infection, which is very treatable, but a doctor will want to check the cause.",
        oftenLinkedTo: [
          "A urine infection",
          "Irritation of the bladder or urine tube",
          "Less often, a stone or another cause a doctor would want to rule out",
        ],
        whatHelps: [
          "Book a doctor's visit in the next day or two and ask for a urine test",
          "Drink enough water to keep the urine pale",
          "Note whether the colour comes and goes, and anything eaten, like beetroot, that can colour urine",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if a fever, back pain or vomiting starts.",
      },
      {
        id: "uti-young",
        match: { ages: ["u13", "13-17"] },
        urgency: "soon",
        title: "Children and teens with burning should see a doctor",
        summary:
          "Burning or stinging when peeing in a child or teenager should always be checked by a doctor, who can do a simple urine test. Most causes are easy to treat.",
        oftenLinkedTo: [
          "A urine infection",
          "Sore skin from soap, bubble bath or tight clothes",
          "Holding urine at school or on journeys",
        ],
        whatHelps: [
          "See a doctor in the next day or two, with a parent or trusted adult",
          "Plenty of water through the day",
          "Wash the outside with plain warm water only, and for girls, wipe front to back",
          "Go to the toilet when the urge comes, even at school",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if there is a fever, vomiting or tummy or back pain.",
      },
      {
        id: "uti-male",
        match: { sex: ["male"] },
        urgency: "soon",
        title: "For men, burning when peeing always needs a doctor",
        summary:
          "Urine infections are less common in men, so when burning or frequent peeing happens, a doctor should check the cause rather than waiting it out.",
        oftenLinkedTo: [
          "A urine infection",
          "Infection or swelling of the prostate gland",
          "Some infections passed on through sex",
        ],
        whatHelps: [
          "See a doctor in the next day or two and ask for a urine test",
          "Drink enough water to keep your urine pale",
          "Don't hold urine for long",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if a fever, back pain or vomiting starts.",
      },
      {
        id: "uti-lasting",
        match: { answers: { how: ["lasting", "repeat"] } },
        urgency: "soon",
        title: "Burning that's lasting or keeps coming back",
        summary:
          "Symptoms that don't ease within two days, or come back often, need a doctor and a urine test. Repeated infections are common and there is a lot a doctor can do.",
        oftenLinkedTo: [
          "A urine infection that needs the right treatment",
          "Repeat infections, which a doctor may want to look into further",
          "Irritation that feels like an infection but needs a different approach",
        ],
        whatHelps: [
          "See a doctor in the next day or two and ask for a urine test",
          "Drink enough water to keep your urine pale",
          "Don't hold urine for hours, and wipe front to back",
          "Cut back on coffee and alcohol while it settles",
        ],
        seeDoctor:
          "Within 1 to 2 days, because lasting or repeat symptoms need a test, not a guess.",
        readMore: [
          { label: "Public toilet hygiene and UTI tips", href: "/blog/public-toilet-hygiene-travel-uti-tips" },
        ],
      },
      {
        id: "uti-habits",
        match: { answers: { habits: ["hold", "toilets", "water"] } },
        urgency: "soon",
        title: "Burning when peeing, with long hours of holding on",
        summary:
          "Burning, stinging and needing to go often are classic signs worth checking with a doctor, who can confirm with a urine test. Women's health sources link holding urine for long and not drinking enough to urine infections.",
        oftenLinkedTo: [
          "A urine infection",
          "Holding urine for hours on journeys or at work",
          "Not drinking enough water",
        ],
        whatHelps: [
          "See a doctor or pharmacist in the next day or two",
          "Drink enough water to keep your urine pale",
          "Go when you need to, rather than waiting for a clean toilet",
          "A pee funnel or seat covers can make dirty or crowded toilets easier to use, for hygiene and comfort. They don't prevent or treat infections",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if a fever, back pain or vomiting starts.",
        products: ["looway-pee-funnel", "looway-toilet-seat-covers", "looway-yatra-kit"],
        readMore: [
          { label: "Public toilet hygiene and UTI tips", href: "/blog/public-toilet-hygiene-travel-uti-tips" },
        ],
      },
      {
        id: "uti-default",
        urgency: "soon",
        title: "Burning or stinging when you pee",
        summary:
          "Burning when peeing is common and usually very treatable. It's on the list of signs worth seeing a doctor about, who can confirm the cause with a simple urine test.",
        oftenLinkedTo: [
          "A urine infection",
          "Thrush or sore skin outside, which stings when urine touches it",
          "Scented washes, soaps or wipes irritating the area",
          "Not drinking enough water",
        ],
        whatHelps: [
          "See a doctor or pharmacist in the next day or two",
          "Drink enough water to keep your urine pale, and rest",
          "Wipe front to back, and skip scented intimate products",
          "If you are sexually active, peeing soon after sex is a commonly advised habit",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if a fever, back pain or vomiting starts.",
        readMore: [
          { label: "Public toilet hygiene and UTI tips", href: "/blog/public-toilet-hygiene-travel-uti-tips" },
        ],
      },
    ],
    sources: [
      { label: "NHS: Urinary tract infections", url: "https://www.nhs.uk/conditions/urinary-tract-infections-utis/" },
      { label: "MedlinePlus: Vaginal discharge", url: "https://medlineplus.gov/ency/article/003158.htm" },
      { label: "NHS 111 Wales: Vaginitis", url: "https://111.wales.nhs.uk/vaginitis/?locale=en" },
    ],
  },

  // 4. Mood changes or PMS before periods
  {
    id: "pms",
    title: "Mood changes or PMS before periods",
    short: "Low mood, irritability or PMS",
    triggers: [
      "pms",
      "pmdd",
      "mood swings before period",
      "irritable before periods",
      "crying before period",
      "sad before periods",
      "anxiety before periods",
      "premenstrual",
      "periods se pehle mood",
      "period se pehle gussa",
      "chidchidapan before periods",
      "mood kharab rehta hai period se pehle",
      "feeling low before period",
    ],
    needs: {},
    ageOptions: PERIOD_AGES,
    showIf: { ...FEMALE, ages: PERIOD_AGES },
    notFor:
      "This check-in is about mood changes linked to periods, so it doesn't fit the details you gave: if someone's mood is worrying you, a doctor can help, and Tele MANAS on 14416 is free and open 24 hours.",
    questions: [
      {
        id: "timing",
        text: "When do these feelings usually show up?",
        options: [
          { id: "before", label: "In the week or two before my period, easing once it starts" },
          { id: "during", label: "Mostly during my period" },
          { id: "always", label: "Most of the month, not linked to my cycle" },
          { id: "unsure", label: "Not sure, I've never tracked it" },
        ],
      },
      {
        id: "feel",
        text: "What do you notice? Pick all that fit.",
        multi: true,
        options: [
          { id: "irritable", label: "Irritable, angry or snappy" },
          { id: "low", label: "Low, tearful or hopeless" },
          { id: "anxious", label: "Anxious, tense or on edge" },
          { id: "body", label: "Bloating, sore breasts, headaches or cravings" },
          { id: "sleep", label: "Tired or sleeping badly" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "impact",
        text: "How much does it affect your days?",
        options: [
          { id: "mild", label: "I notice it, but I manage" },
          { id: "some", label: "It gets in the way of work, study or plans" },
          { id: "severe", label: "It badly affects my work, relationships or daily life" },
          { id: "control", label: "I feel out of control or scared of how I feel", flag: "amber" },
        ],
      },
      {
        id: "safety",
        text: "Have you had any thoughts of harming yourself, or of not wanting to be here?",
        options: [
          { id: "now", label: "Yes, right now", flag: "red" },
          { id: "sometimes", label: "Yes, sometimes, around my period", flag: "red" },
          { id: "private", label: "I'd rather not say", flag: "amber" },
          { id: "no", label: "No" },
        ],
      },
    ],
    outcomes: [
      {
        id: "pms-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "You deserve support right now",
        summary:
          "I'm really glad you told me. Please talk to someone now: call **Tele MANAS on 14416**, India's free government mental health helpline, open 24 hours in many languages. If you feel you might act on these thoughts, call **112** or go to the nearest hospital.",
        oftenLinkedTo: [
          "Severe premenstrual mood changes, which are a known and treatable pattern",
          "Depression or anxiety, which can get worse before a period",
        ],
        whatHelps: [
          "Call Tele MANAS on 14416 now, or 112 if you are in danger",
          "Tell one person you trust how you are feeling today, and don't stay alone",
          "Keep away from anything you could use to hurt yourself",
          "Once you are safe, see a doctor. This is treatable and you don't have to manage it alone",
        ],
        seeDoctor:
          "Today: thoughts of self-harm always deserve help straight away, even if they pass after your period.",
        readMore: [
          { label: "PMS vs PMDD: the difference", href: "/blog/pms-vs-pmdd-symptoms-difference" },
        ],
      },
      {
        id: "pms-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "These feelings are worth talking to someone about soon",
        summary:
          "Feeling out of control or frightened by your own moods is a sign to get support, not to push through alone. If you ever have thoughts of harming yourself, call **Tele MANAS on 14416** or **112**.",
        oftenLinkedTo: [
          "Severe premenstrual mood changes, sometimes called PMDD",
          "Anxiety or low mood that flares before periods",
          "Stress, poor sleep and exhaustion piling up",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist in the next few days",
          "Talk to someone you trust about how you've been feeling",
          "Tele MANAS on 14416 is free, confidential and open 24 hours if you need to talk first",
        ],
        seeDoctor:
          "Within the next few days, because strong mood symptoms are very treatable with the right support.",
        readMore: [
          { label: "PMS vs PMDD: the difference", href: "/blog/pms-vs-pmdd-symptoms-difference" },
        ],
      },
      {
        id: "pms-pmdd-pattern",
        match: { answers: { timing: ["before"], impact: ["severe"] } },
        urgency: "checkup",
        title: "A strong monthly pattern that's worth a doctor's look",
        summary:
          "Mood changes that arrive in the week or two before your period, ease once it starts, and badly affect work or relationships fit a pattern doctors take seriously. It's real, it isn't a weakness, and it's treatable.",
        oftenLinkedTo: [
          "PMDD, a more severe form of PMS",
          "Strong PMS",
          "Anxiety or low mood that worsens before periods",
        ],
        whatHelps: [
          "Track your moods and period dates for at least two cycles in the free [period tracker](/period-log)",
          "Take that record to a gynaecologist, general physician or psychiatrist",
          "Regular sleep, movement, and smaller, more frequent meals",
          "Tell the people close to you which days are harder, so they can help",
        ],
        seeDoctor:
          "Book a visit, because this pattern responds well to treatment and you don't need to just cope.",
        products: ["period-tracker"],
        readMore: [
          { label: "PMS vs PMDD: the difference", href: "/blog/pms-vs-pmdd-symptoms-difference" },
        ],
      },
      {
        id: "pms-all-month",
        match: { answers: { timing: ["always"] } },
        urgency: "checkup",
        title: "Mood changes that aren't tied to your cycle",
        summary:
          "When low mood, irritability or anxiety stays for most of the month, it's less likely to be PMS alone. That's worth talking through with a doctor, and it's very treatable.",
        oftenLinkedTo: [
          "Low mood or anxiety that flares before periods but is there all month",
          "Stress, poor sleep or burnout",
          "Thyroid or other health changes a doctor may check",
        ],
        whatHelps: [
          "Book a visit with a doctor and describe how long it has been going on",
          "Note your moods and period dates in the [period tracker](/period-log) to show the pattern",
          "Tele MANAS on 14416 is free and confidential if you'd like to talk to someone",
        ],
        seeDoctor:
          "Book a visit soon, because ongoing low mood deserves care whatever the cause.",
        products: ["period-tracker"],
      },
      {
        id: "pms-midlife",
        match: { ages: ["40-49", "50+"] },
        urgency: "checkup",
        title: "Mood changes in your 40s and around menopause",
        summary:
          "In the years before menopause, hormones can swing more, and mood changes, poor sleep and irritability often become stronger or new. It's common and there is real help for it.",
        oftenLinkedTo: [
          "Perimenopause, the years leading up to menopause",
          "PMS that changes as cycles change",
          "Poor sleep, hot flushes and stress adding up",
        ],
        whatHelps: [
          "Track moods, sleep and period dates in the [period tracker](/period-log)",
          "Regular movement, daylight and a steady sleep routine",
          "Ask a doctor about perimenopause. Many women don't, and there is a lot that helps",
        ],
        seeDoctor:
          "Book a routine visit, and sooner if your mood is very low or affecting daily life.",
        products: ["period-tracker"],
        readMore: [
          { label: "Early signs of perimenopause", href: "/blog/perimenopause-symptoms-early-signs" },
        ],
      },
      {
        id: "pms-teen",
        match: { ages: ["u13", "13-17"] },
        urgency: "selfcare",
        title: "Mood changes before periods are common in teens",
        summary:
          "In the first few years of periods, hormones are still settling, so feeling teary, cross or tired before a period is very common. You're not overreacting, and it does get easier to predict.",
        oftenLinkedTo: [
          "Normal hormone changes in the days before a period",
          "PMS, which many girls and women feel",
          "School stress and poor sleep making it stronger",
        ],
        whatHelps: [
          "Mark your moods in the [period tracker](/period-log) so the hard days feel less of a surprise",
          "Sleep, water, regular meals and some movement every day",
          "Talk to a parent, school counsellor or someone you trust",
        ],
        seeDoctor:
          "If it stops you going to school or seeing friends, or you feel very low, see a doctor with a parent.",
        products: ["period-tracker"],
        readMore: [
          { label: "PMS vs PMDD: the difference", href: "/blog/pms-vs-pmdd-symptoms-difference" },
        ],
      },
      {
        id: "pms-default",
        urgency: "selfcare",
        title: "This sounds like common PMS",
        summary:
          "Most women feel some PMS: irritability, low mood, bloating or tiredness in the days before a period, easing once it starts. It varies month to month, and small changes often help.",
        oftenLinkedTo: [
          "Normal hormone changes in the second half of the cycle",
          "Stress and poor sleep, which make PMS feel stronger",
          "Caffeine, alcohol and very salty food for some people",
        ],
        whatHelps: [
          "Track symptoms for two cycles in the free [period tracker](/period-log) to see your pattern",
          "Regular exercise, good sleep, and smaller, more frequent meals",
          "Relaxing activities like yoga, walking or breathing exercises",
          "A doctor or pharmacist can advise on pain relief for cramps or headaches",
        ],
        seeDoctor:
          "If it starts affecting work, study or relationships, or self-help isn't enough, see a doctor.",
        products: ["period-tracker"],
        readMore: [
          { label: "PMS vs PMDD: the difference", href: "/blog/pms-vs-pmdd-symptoms-difference" },
        ],
      },
    ],
    sources: [
      { label: "NHS: Premenstrual syndrome", url: "https://www.nhs.uk/conditions/pre-menstrual-syndrome/" },
      { label: "Cleveland Clinic: PMDD", url: "https://my.clevelandclinic.org/health/diseases/9132-premenstrual-dysphoric-disorder-pmdd" },
      { label: "MedlinePlus: Premenstrual syndrome", url: "https://medlineplus.gov/ency/article/001505.htm" },
    ],
  },

  // 5. Rash or soreness from pads or liners
  {
    id: "pad-rash",
    title: "Rash or soreness from pads or liners",
    short: "Redness, chafing or sore skin",
    triggers: [
      "pad rash",
      "rash from pads",
      "sanitary pad rash",
      "liner rash",
      "chafing from pad",
      "pad allergy",
      "soreness from pad",
      "rashes during periods",
      "thigh rash during periods",
      "pad se rash",
      "pad se jalan",
      "pad se khujli",
      "pad lagane se dane",
    ],
    needs: {},
    ageOptions: PERIOD_AGES,
    showIf: { ...FEMALE, ages: PERIOD_AGES },
    notFor:
      "This check-in is about rashes from pads and liners, so it doesn't fit the details you gave: for a rash in a young child, a boy or a man, a pharmacist or doctor can help, and see a doctor soon if there are blisters, pus or a fever.",
    questions: [
      {
        id: "howlong",
        text: "How long has the rash been there?",
        options: [
          { id: "new", label: "It just started this period" },
          { id: "settling", label: "A few days, and it's settling" },
          { id: "week", label: "More than a week, or not settling" },
          { id: "every", label: "It happens every period" },
        ],
      },
      {
        id: "look",
        text: "How does it look or feel? Pick all that fit.",
        multi: true,
        options: [
          { id: "red", label: "Red, pink or darker patches" },
          { id: "chafe", label: "Rubbed raw where the pad edges sit" },
          { id: "itch", label: "Itchy or burning" },
          { id: "blisters", label: "Blisters, open sores or weeping skin", flag: "amber" },
          { id: "spread", label: "Spreading, hot, swollen or with pus", flag: "amber" },
          { id: "fever", label: "Fever or feeling unwell with it", flag: "red" },
        ],
      },
      {
        id: "change",
        text: "How often do you usually change your pad or liner?",
        options: [
          { id: "ontime", label: "Every 4 to 6 hours" },
          { id: "long", label: "Every 8 hours or more" },
          { id: "day", label: "Once a day or less" },
          { id: "liner", label: "I wear a liner most of the day, every day" },
        ],
      },
      {
        id: "habits",
        text: "Does any of this apply? Pick all that fit.",
        multi: true,
        options: [
          { id: "scented", label: "Scented pads, wipes, soap or intimate wash" },
          { id: "newbrand", label: "A new brand of pad or liner" },
          { id: "tight", label: "Tight jeans, synthetic underwear or heat" },
          { id: "sensitive", label: "I have sensitive skin or eczema" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "pad-rash-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "A rash with fever needs a doctor today",
        summary:
          "A rash that comes with a fever or feeling unwell is one to get checked **today**, as the skin may be infected. If you feel faint, confused or very unwell, call **112** or go to the nearest emergency.",
        oftenLinkedTo: [
          "A skin infection on top of a rash",
          "An infection elsewhere that needs prompt treatment",
        ],
        whatHelps: [
          "See a doctor today",
          "Keep the area clean and dry, and wear loose cotton",
          "Don't put creams, powders or home remedies on it before the visit",
        ],
        seeDoctor:
          "Today, because a fever with a rash needs a proper examination.",
      },
      {
        id: "pad-rash-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "This rash needs a doctor's look in the next day or two",
        summary:
          "Blisters, open or weeping skin, or a rash that is spreading, hot or swollen is more than everyday chafing. Please see a doctor soon.",
        oftenLinkedTo: [
          "Broken skin that has become infected",
          "A stronger allergic reaction to something touching the skin",
          "Sores that need checking for other causes",
        ],
        whatHelps: [
          "See a doctor in the next day or two",
          "Stop using the product you think caused it",
          "Plain warm water, pat dry, loose cotton underwear",
          "Skip liners on broken or sore skin",
        ],
        seeDoctor:
          "Within 1 to 2 days, and today if a fever starts.",
      },
      {
        id: "pad-rash-lasting",
        match: { answers: { howlong: ["week"] } },
        urgency: "checkup",
        title: "A rash that isn't settling",
        summary:
          "A pad rash usually eases within a few days of removing the cause. If it's lasted more than a week, or isn't getting better, it's worth a doctor's look.",
        oftenLinkedTo: [
          "An allergy to something in a product you are still using",
          "Thrush or another infection, especially with itching or discharge",
          "A skin condition such as eczema",
        ],
        whatHelps: [
          "Book a visit with a doctor or dermatologist",
          "Stop the product you suspect, and switch to plain warm water only",
          "Loose cotton underwear and air time for the skin",
        ],
        seeDoctor:
          "Book a visit soon, because a rash that lingers needs the cause found.",
        readMore: [
          { label: "Are sanitary pads safe?", href: "/blog/are-sanitary-pads-safe-chemicals-rashes" },
        ],
      },
      {
        id: "pad-rash-every-period",
        match: { answers: { howlong: ["every"] } },
        urgency: "checkup",
        title: "A rash that comes back every period",
        summary:
          "A rash that returns each period often points to something in your routine or a product that doesn't suit your skin. Small changes usually help, and a doctor can check if it keeps happening.",
        oftenLinkedTo: [
          "A reaction to fragrance, dye or adhesive in a product",
          "Trapped moisture and heat on heavy days",
          "Sensitive skin or eczema",
        ],
        whatHelps: [
          "Change pads every 4 to 6 hours, more often on heavy or hot days",
          "Choose unscented products and avoid scented wipes and washes",
          "Try a different pad for a cycle and see if it settles",
          "Track which days it flares in the [period tracker](/period-log)",
        ],
        seeDoctor:
          "If changes don't help within a cycle or two, see a doctor or dermatologist.",
        products: ["ovy-pads", "period-tracker"],
        readMore: [
          { label: "Are sanitary pads safe?", href: "/blog/are-sanitary-pads-safe-chemicals-rashes" },
        ],
      },
      {
        id: "pad-rash-moisture",
        match: { answers: { change: ["long", "day", "liner"] } },
        urgency: "selfcare",
        title: "Long wear is the most likely trigger",
        summary:
          "Trapped moisture and heat, not the pad itself, is the biggest cause of pad rash. Changing more often usually settles it within a few days.",
        oftenLinkedTo: [
          "Moisture and heat held against the skin for hours",
          "Friction from walking, travel or exercise",
          "A daily liner never giving the skin a break",
        ],
        whatHelps: [
          "Change pads every 4 to 6 hours, and liners every 3 to 4 hours",
          "Give your skin liner-free time, and skip liners until the skin heals",
          "Keep a spare pad in your bag so you can change on time",
          "Rinse with plain warm water, pat dry, and wear loose cotton",
        ],
        seeDoctor:
          "If it doesn't settle in a few days, spreads or blisters, see a doctor.",
        products: ["ovy-pads"],
        readMore: [
          { label: "Are sanitary pads safe?", href: "/blog/are-sanitary-pads-safe-chemicals-rashes" },
        ],
      },
      {
        id: "pad-rash-irritant",
        match: { answers: { habits: ["scented", "newbrand", "sensitive"] } },
        urgency: "selfcare",
        title: "Your skin may be reacting to a product",
        summary:
          "Sensitive skin can react to fragrance, dye or adhesive in pads, wipes and washes. Stopping the trigger usually lets the skin settle within a few days. No product can promise to suit every skin, so watch how yours responds.",
        oftenLinkedTo: [
          "An irritant skin reaction to scented or new products",
          "An allergy to one ingredient",
          "Sensitive skin or eczema flaring with heat and moisture",
        ],
        whatHelps: [
          "Stop the scented or new product, and use plain warm water only",
          "Choose unscented pads that are dermatologically tested",
          "Don't use antiseptic or scented washes on the area. They make it worse",
          "Loose cotton underwear and air time for the skin",
        ],
        seeDoctor:
          "If redness, itching or rash doesn't settle after stopping the product, see a doctor.",
        products: ["ovy-pads"],
        readMore: [
          { label: "Are sanitary pads safe?", href: "/blog/are-sanitary-pads-safe-chemicals-rashes" },
        ],
      },
      {
        id: "pad-rash-default",
        urgency: "selfcare",
        title: "Mild chafing or pad rash",
        summary:
          "Mild redness or soreness from a pad is a skin reaction, not an infection, and it's very common. It usually eases within a few days with a few simple changes.",
        oftenLinkedTo: [
          "Friction where the pad edges rub",
          "Heat, sweat and tight clothes",
          "A pad size or shape that doesn't suit the day",
        ],
        whatHelps: [
          "Change every 4 to 6 hours, sooner on hot days",
          "Fold the wings fully under so the pad stays put and rubs less",
          "Rinse with plain warm water, pat dry, and wear loose cotton",
          "Don't scratch. A cool, clean cloth can soothe",
        ],
        seeDoctor:
          "If it lasts more than a few days, spreads, or blisters appear, see a doctor.",
        products: ["ovy-pads"],
        readMore: [
          { label: "Are sanitary pads safe?", href: "/blog/are-sanitary-pads-safe-chemicals-rashes" },
        ],
      },
    ],
    sources: [
      { label: "NHS: Contact dermatitis", url: "https://www.nhs.uk/conditions/contact-dermatitis/" },
      { label: "Medical News Today: Pad rash", url: "https://www.medicalnewstoday.com/articles/pad-rash" },
      { label: "MedlinePlus: Vaginal discharge", url: "https://medlineplus.gov/ency/article/003158.htm" },
    ],
  },
];
