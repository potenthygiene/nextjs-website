import type { SymptomFlow } from "../symptomTypes";

// Cycle check-ins: late, irregular, heavy, spotting and painful periods.
// These never diagnose and never name a medicine. Red-flag outcomes come
// first in every flow, then amber, then situations, then a default.

export const FLOWS: SymptomFlow[] = [
  // ───────────── Late or missed period ─────────────
  {
    id: "late-period",
    title: "Late or missed period",
    short: "My period is late or missed",
    triggers: [
      "period late",
      "late period",
      "missed period",
      "missed my period",
      "period nahi aaya",
      "periods nahi aa rahe",
      "mc late hai",
      "date nikal gayi",
      "periods delay ho gaye",
      "period miss ho gaya",
      "period not coming",
      "period kyu nahi aaya",
      "period 10 din late",
      "why is my period late",
    ],
    needs: { who: true },
    questions: [
      {
        id: "late",
        text: "How late is the period?",
        options: [
          { id: "few-days", label: "A few days, under a week" },
          { id: "one-two-weeks", label: "1 to 2 weeks" },
          { id: "over-two-weeks", label: "More than 2 weeks" },
          { id: "three-months", label: "No period for 3 months or more" },
        ],
      },
      {
        id: "pregnancy",
        text: "Is there any chance of pregnancy? Any sex in the last few months counts, even with protection.",
        options: [
          { id: "possible", label: "Yes, it's possible" },
          { id: "test-negative", label: "Possible, but a test was negative" },
          { id: "unsure", label: "Not sure" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "changes",
        text: "Has anything changed in the last month or two?",
        multi: true,
        options: [
          { id: "stress", label: "Stress, exams, travel or poor sleep" },
          { id: "illness", label: "A recent illness or fever" },
          { id: "weight", label: "Weight loss or gain, dieting, or much more exercise" },
          { id: "contraception", label: "Started, stopped or changed contraception, or took an emergency pill" },
          { id: "baby", label: "Had a baby recently, or breastfeeding" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "symptoms",
        text: "Any of these as well?",
        multi: true,
        options: [
          { id: "severe-pain", label: "Severe or one-sided pain low in the tummy", flag: "red" },
          { id: "faint", label: "Fainting, feeling very dizzy, or pain at the tip of the shoulder", flag: "red" },
          { id: "odd-bleeding", label: "Light, brown or stop-start bleeding that's not like a usual period", flag: "amber" },
          { id: "hormone-signs", label: "Acne, extra facial or body hair, or weight that's hard to shift" },
          { id: "tired", label: "Very tired, feeling cold or hot easily, or hair fall" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "late-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "Severe pain or faintness with a late period needs help now",
        summary:
          "When a period is late, severe tummy pain, fainting or shoulder tip pain can be a sign of a pregnancy growing outside the womb. That is an emergency, even if a pregnancy test was negative. Please call **112** or go to the nearest emergency department now.",
        oftenLinkedTo: [
          "A pregnancy outside the womb (ectopic pregnancy), which needs urgent care",
          "An ovarian cyst that has twisted or burst",
          "Other tummy problems, such as appendicitis, that a doctor needs to rule out",
        ],
        whatHelps: [
          "Call **112** or ask someone to take you to hospital now",
          "Lie down if you feel faint, and don't go alone",
          "Tell the doctor when the last period started and whether pregnancy is possible",
        ],
        seeDoctor: "Go now: this is not one to wait out at home.",
      },
      {
        id: "late-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "A late period with unusual bleeding is worth checking soon",
        summary:
          "Light, brown or stop-start bleeding when a period is late can have several causes, and most are common and treatable. If there's any chance of pregnancy, it needs checking within a day or two, because some early pregnancy problems start this way.",
        oftenLinkedTo: [
          "Hormone changes that shift the cycle",
          "Early pregnancy, including a pregnancy outside the womb, which a doctor needs to rule out",
          "A recent change in contraception, or an emergency pill",
          "Polyps or an infection in the womb or cervix",
        ],
        whatHelps: [
          "If pregnancy is possible, do a home pregnancy test today",
          "Use a liner or light pad so you can see how much bleeding there is and its colour",
          "Note the dates in the [period tracker](/period-log) to show the doctor",
          "If severe pain, fainting or heavy bleeding starts, call **112** or go to emergency straight away",
        ],
        seeDoctor: "See a doctor or gynaecologist in the next day or two, and sooner if any pain starts.",
        products: ["ovy-liners", "period-tracker"],
      },
      {
        id: "late-pregnancy",
        match: { answers: { pregnancy: ["possible", "test-negative", "unsure"] } },
        urgency: "checkup",
        title: "Your period is late, and pregnancy is possible",
        summary:
          "Pregnancy is the commonest reason for a missed period, so a home test is the first step. A test is most reliable from the day the period was due, or 3 weeks after the last sex. If it's negative and there's still no period a week later, test again.",
        oftenLinkedTo: [
          "Pregnancy",
          "Stress, travel, illness or weight change delaying ovulation",
          "An emergency pill, which can make the next period early or about a week late",
          "Starting or stopping hormonal contraception",
        ],
        whatHelps: [
          "Do a home pregnancy test, ideally with the first urine of the morning",
          "If it's negative and the period still hasn't come in a week, repeat the test",
          "If it's positive, book a doctor's visit to confirm it and start pregnancy care",
          "Note the last period date in the [period tracker](/period-log)",
        ],
        seeDoctor:
          "See a doctor if the test is positive or the period is more than a week late after an emergency pill, and go straight away if pain or bleeding starts.",
        products: ["period-tracker"],
      },
      {
        id: "late-three-months",
        match: { answers: { late: ["three-months"] } },
        urgency: "checkup",
        title: "No period for 3 months is worth a doctor's check",
        summary:
          "When periods stop for 3 months or more and pregnancy isn't the reason, a doctor should take a look. It's usually something common and treatable, and simple blood tests often find the answer.",
        oftenLinkedTo: [
          "PCOS, especially with acne, extra hair or weight changes",
          "Thyroid problems, or a raised milk hormone (prolactin)",
          "Big weight loss, eating very little, heavy training or long-term stress",
          "Hormonal contraception or breastfeeding",
          "Perimenopause in the 40s, or the ovaries slowing down early if under 40",
        ],
        whatHelps: [
          "Do a pregnancy test first, even if it seems unlikely",
          "Write down when the last few periods came and any other changes",
          "Eat regular, balanced meals and keep sleep steady",
          "Book a routine visit with a doctor or gynaecologist",
        ],
        seeDoctor:
          "Book a check in the next few weeks: long gaps without periods matter for long-term bone health, so they shouldn't be ignored.",
        products: ["period-tracker"],
      },
      {
        id: "late-40s",
        match: { ages: ["40-49", "50+"] },
        urgency: "selfcare",
        title: "A late period in your 40s is often linked to perimenopause",
        summary:
          "In the years before menopause, cycles often get longer or shorter, or skip a month. That's common, but pregnancy is still possible until a full year without periods, so a test is wise if there's any chance.",
        oftenLinkedTo: [
          "Perimenopause, usually between 45 and 55, though it can start earlier",
          "Stress, illness or weight change",
          "Thyroid problems, which are common at this age",
          "Pregnancy, which is still possible",
        ],
        whatHelps: [
          "Track periods and other changes, like hot flushes or poor sleep, in the [period tracker](/period-log)",
          "Keep a mix of pad sizes handy, since flow can swing heavier or lighter",
          "Mention hot flushes, mood changes or sleep problems to a doctor: there's real help available",
        ],
        seeDoctor:
          "See a doctor if periods stop for 3 months, become very heavy or come less than 3 weeks apart, and always for any bleeding after a full year without periods.",
        products: ["ovy-pads", "period-tracker"],
        readMore: [{ label: "Early signs of perimenopause", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "late-teen",
        match: { ages: ["u13", "13-17"] },
        urgency: "selfcare",
        title: "Late periods are common in the first couple of years",
        summary:
          "For the first year or two after periods start, cycles can be anywhere from about 21 to 45 days, and skipping a month is common. Exam stress, sport and growth spurts can all delay a period. If you're checking for your daughter, a simple log helps you both see the pattern.",
        oftenLinkedTo: [
          "A cycle that is still settling, which can take up to 2 years",
          "Exam stress, travel or poor sleep",
          "Lots of sport, dieting or weight change",
          "A recent illness",
        ],
        whatHelps: [
          "Log every period in the [period tracker](/period-log)",
          "Keep a pad and spare underwear in the school bag, so a surprise period is no stress",
          "Eat regular meals, especially on sports days",
          "If there's any chance of pregnancy, a test is the first step",
        ],
        seeDoctor:
          "See a doctor if there's no period for 3 months, if periods haven't started by 15, or if they still come more than 45 days apart after the first 2 years.",
        products: ["ovy-teen", "period-tracker"],
      },
      {
        id: "late-default",
        urgency: "selfcare",
        title: "A late period is common, and often linked to everyday changes",
        summary:
          "A period can come a few days to a couple of weeks late because of stress, travel, illness or a change in weight or routine. Most of the time the cycle settles by itself.",
        oftenLinkedTo: [
          "Stress, exams, travel, night shifts or poor sleep",
          "A recent illness or fever",
          "Weight change, dieting or a lot more exercise",
          "Starting, stopping or changing contraception, or an emergency pill",
          "PCOS or thyroid problems, if it keeps happening",
        ],
        whatHelps: [
          "If there's any chance of pregnancy, do a home test",
          "Log dates in the [period tracker](/period-log) to see your real pattern",
          "Keep sleep, meals and exercise steady for a few weeks",
          "If you've noticed acne, extra hair, weight change or constant tiredness, tell a doctor: a simple blood test can check hormones and thyroid",
        ],
        seeDoctor:
          "See a doctor if there's no period for 3 months, if periods often come less than 21 or more than 35 days apart, or if pain or unusual bleeding starts.",
        products: ["period-tracker", "ovy-pads"],
      },
    ],
    sources: [
      { label: "NHS: Stopped or missed periods", url: "https://www.nhs.uk/conditions/stopped-or-missed-periods/" },
      { label: "NHS: Irregular periods", url: "https://www.nhs.uk/conditions/irregular-periods/" },
      { label: "NHS: Ectopic pregnancy symptoms", url: "https://www.nhs.uk/conditions/ectopic-pregnancy/symptoms/" },
      { label: "NHS: PCOS symptoms", url: "https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/symptoms/" },
    ],
  },

  // ───────────── Irregular periods ─────────────
  {
    id: "irregular",
    title: "Irregular periods",
    short: "My periods are irregular",
    triggers: [
      "irregular periods",
      "periods irregular hai",
      "irregular cycle",
      "period time pe nahi aata",
      "periods har mahine alag date pe",
      "periods twice a month",
      "mahine mein do baar period",
      "periods skip ho rahe",
      "period ka koi fixed time nahi",
      "pcos periods",
      "pcod irregular",
      "cycle not regular",
      "periods early aa gaye",
    ],
    needs: { who: true },
    questions: [
      {
        id: "pattern",
        text: "What best describes the pattern?",
        options: [
          { id: "varies", label: "The gap changes a lot from month to month" },
          { id: "close", label: "Periods come less than 21 days apart" },
          { id: "far", label: "Gaps longer than 35 days, or months skipped" },
          { id: "long", label: "Periods last more than 7 days" },
          { id: "between", label: "Bleeding between periods as well", flag: "amber" },
        ],
      },
      {
        id: "duration",
        text: "How long has it been like this?",
        options: [
          { id: "recent", label: "Just the last 1 or 2 cycles" },
          { id: "months", label: "3 to 6 months" },
          { id: "long-time", label: "More than 6 months, or always" },
        ],
      },
      {
        id: "signs",
        text: "Have you noticed any of these?",
        multi: true,
        options: [
          { id: "hormone", label: "Acne, extra facial or body hair, or weight that's hard to shift" },
          { id: "thyroid", label: "Constant tiredness, feeling cold or hot easily, hair fall, or a racing heart" },
          { id: "lifestyle", label: "Big stress, weight loss, dieting or heavy exercise" },
          { id: "heavy", label: "Very heavy bleeding, or clots bigger than a ₹5 coin", flag: "amber" },
          { id: "severe", label: "Severe pain, fainting, or soaking a pad every hour", flag: "red" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "situation",
        text: "Does any of this apply?",
        options: [
          { id: "pregnancy", label: "Pregnancy is possible" },
          { id: "trying", label: "Trying to get pregnant" },
          { id: "contraception", label: "On hormonal contraception, or stopped it recently" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "irr-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "Severe pain, fainting or very fast bleeding needs help now",
        summary:
          "These are signs to get checked today, not wait out. Please call **112** or go to the nearest emergency department now, especially if pregnancy is possible.",
        oftenLinkedTo: [
          "Losing blood faster than the body can keep up with",
          "A pregnancy problem, including a pregnancy outside the womb",
          "An ovarian cyst that has twisted or burst",
        ],
        whatHelps: [
          "Call **112** or ask someone to take you to hospital now",
          "Lie down if you feel faint, and don't go alone",
          "Tell the doctor the last period date and whether pregnancy is possible",
        ],
        seeDoctor: "Go now: this is not one to wait out at home.",
      },
      {
        id: "irr-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Irregular periods with heavy or in-between bleeding are worth a check soon",
        summary:
          "Heavy bleeding, big clots or bleeding between periods alongside an irregular cycle should be seen by a doctor in the next few days. It's usually something common and treatable, but it's never something to sit on.",
        oftenLinkedTo: [
          "Hormone imbalance, including PCOS, where periods can be far apart and then heavy",
          "Thyroid problems",
          "Fibroids or polyps in the womb",
          "Low iron from heavy bleeding, if there's tiredness or breathlessness",
        ],
        whatHelps: [
          "Note how often you change pads on the heaviest day, and the size of any clots",
          "Use an XL+ pad or a period panty on the heaviest days and at night",
          "Log dates in the [period tracker](/period-log) to show the doctor",
          "Ask the doctor about an iron check if you're always tired",
        ],
        seeDoctor:
          "See a doctor or gynaecologist in the next few days, and go to emergency if a pad soaks through within an hour or you feel faint.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "irr-pregnancy",
        match: { answers: { situation: ["pregnancy", "trying"] } },
        urgency: "checkup",
        title: "Irregular periods, and pregnancy is possible or planned",
        summary:
          "If pregnancy is possible, a home test is the first step, since a missed or odd period is often the earliest sign. If you're trying to conceive, irregular cycles make timing harder, and a doctor can help find out why.",
        oftenLinkedTo: [
          "Pregnancy",
          "Ovulation that isn't happening every month",
          "PCOS or thyroid problems",
          "Stress or weight change",
        ],
        whatHelps: [
          "Do a home pregnancy test if a period is late",
          "Log periods in the [period tracker](/period-log): it shows a pattern, but it isn't a fertility or ovulation tracker",
          "Keep meals, sleep and exercise steady",
          "With irregular cycles, there's no need to wait a full year of trying before seeing a doctor",
        ],
        seeDoctor:
          "See a doctor if the test is positive, or soon if you're trying to conceive, since irregular cycles are a good reason not to wait.",
        products: ["period-tracker"],
      },
      {
        id: "irr-signs",
        match: { answers: { signs: ["hormone", "thyroid"] } },
        urgency: "checkup",
        title: "Irregular periods with other body changes are worth a check",
        summary:
          "Irregular periods together with acne, extra hair, weight changes or constant tiredness are often linked to hormone conditions that are common and very treatable. A doctor can usually find the answer with an examination, blood tests and sometimes an ultrasound.",
        oftenLinkedTo: [
          "PCOS, which is very common in India and often starts in the teens",
          "An underactive or overactive thyroid",
          "Insulin resistance, which a blood sugar test can check",
          "A raised milk hormone (prolactin)",
        ],
        whatHelps: [
          "Write down your period dates and the other changes you've noticed",
          "Regular movement and balanced meals help with many hormone conditions",
          "Keep a mix of pad sizes handy, since flow can be light one month and heavy the next",
          "Book a visit with a doctor or gynaecologist",
        ],
        seeDoctor: "Book a routine visit: these conditions are easier to manage when found early.",
        products: ["ovy-pads", "period-tracker"],
      },
      {
        id: "irr-teen",
        match: { ages: ["u13", "13-17"] },
        urgency: "selfcare",
        title: "Irregular periods are common in the first couple of years",
        summary:
          "It can take 1 to 2 years for periods to settle. Until then, cycles of about 21 to 45 days, skipped months and changing flow are all common. If you're checking for your daughter, a simple log helps you both see when something needs a doctor.",
        oftenLinkedTo: [
          "A cycle that is still settling after periods start",
          "Exam stress, sport or poor sleep",
          "Growth spurts, dieting or weight change",
          "PCOS, if irregular periods carry on with acne or extra hair",
        ],
        whatHelps: [
          "Log every period in the [period tracker](/period-log)",
          "Keep a pad and spare underwear in the school bag",
          "Eat regular meals, especially on sports days",
          "Talk to a parent, school nurse or doctor about any worry",
        ],
        seeDoctor:
          "See a doctor if periods last more than 7 days, come less than 21 days apart, stop for 3 months, or still come more than 45 days apart after the first 2 years.",
        products: ["ovy-teen", "period-tracker"],
      },
      {
        id: "irr-long",
        match: { answers: { duration: ["months", "long-time"] } },
        urgency: "checkup",
        title: "Irregular for several months: worth a routine check",
        summary:
          "A cycle that has been irregular for 3 months or more deserves a look, even without other symptoms. It's usually something common and treatable.",
        oftenLinkedTo: [
          "PCOS",
          "Thyroid problems",
          "Stress, weight change or heavy exercise",
          "Hormonal contraception, or the months after stopping it",
          "Perimenopause, for those in their 40s",
        ],
        whatHelps: [
          "Log dates and flow in the [period tracker](/period-log) for 2 or 3 cycles before the visit",
          "Keep sleep and meals steady",
          "Keep a mix of pad sizes handy for unpredictable months",
          "If pregnancy is possible, do a test first",
        ],
        seeDoctor: "Book a routine visit with a doctor or gynaecologist in the next few weeks.",
        products: ["ovy-pads", "period-tracker"],
      },
      {
        id: "irr-default",
        urgency: "selfcare",
        title: "One or two irregular cycles are common",
        summary:
          "A cycle that shifts for a month or two is often linked to stress, travel, illness or a change in routine, and usually settles on its own.",
        oftenLinkedTo: [
          "Stress, exams, travel or night shifts",
          "A recent illness",
          "Weight change, or a big change in exercise",
          "Starting, stopping or missing hormonal contraception",
        ],
        whatHelps: [
          "Log dates in the [period tracker](/period-log) to see the real pattern",
          "Keep sleep, meals and exercise steady",
          "If pregnancy is possible, do a home test",
          "Watch for the signs that need a doctor: gaps under 21 or over 35 days, periods over 7 days, or bleeding in between",
        ],
        seeDoctor:
          "See a doctor if it carries on for 3 months, or sooner if periods last more than 7 days or come less than 21 days apart.",
        products: ["period-tracker"],
      },
    ],
    sources: [
      { label: "NHS: Irregular periods", url: "https://www.nhs.uk/conditions/irregular-periods/" },
      { label: "NHS: PCOS symptoms", url: "https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/symptoms/" },
      { label: "NHS: Stopped or missed periods", url: "https://www.nhs.uk/conditions/stopped-or-missed-periods/" },
    ],
  },

  // ───────────── Heavy bleeding or clots ─────────────
  {
    id: "heavy",
    title: "Heavy bleeding or clots",
    short: "My periods are heavy or have clots",
    triggers: [
      "heavy periods",
      "heavy bleeding",
      "heavy flow",
      "bahut zyada bleeding",
      "periods mein zyada khoon",
      "blood clots in periods",
      "period mein clots aa rahe",
      "pad jaldi bhar jata hai",
      "soaking pads",
      "big clots",
      "period 10 din se band nahi",
      "periods lasting too long",
      "khoon ke thakke",
    ],
    needs: { who: true },
    questions: [
      {
        id: "soak",
        text: "On the heaviest day, how quickly does a pad soak through?",
        options: [
          { id: "hourly", label: "Every hour or less, for 2 hours or more in a row", flag: "red" },
          { id: "two-hours", label: "Every 1 to 2 hours, for several hours", flag: "amber" },
          { id: "few-hours", label: "Every 3 to 4 hours" },
          { id: "fine", label: "It lasts 4 hours or more" },
        ],
      },
      {
        id: "clots",
        text: "Are there clots?",
        options: [
          { id: "none", label: "No clots, or only small ones" },
          { id: "coin", label: "Clots bigger than a ₹5 coin", flag: "amber" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "days",
        text: "How many days does the bleeding last?",
        options: [
          { id: "normal", label: "7 days or less" },
          { id: "long", label: "More than 7 days", flag: "amber" },
          { id: "very-long", label: "2 weeks or more", flag: "amber" },
        ],
      },
      {
        id: "situation",
        text: "Does any of this apply?",
        multi: true,
        options: [
          { id: "pregnant", label: "Pregnant, or pregnancy is possible", flag: "red" },
          { id: "baby", label: "Had a baby in the last 6 weeks" },
          { id: "bruise", label: "Bruise easily, frequent nosebleeds, or heavy bleeding runs in the family", flag: "amber" },
          { id: "heavier", label: "Periods are much heavier than they used to be" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "feel",
        text: "How is the body feeling?",
        multi: true,
        options: [
          { id: "faint", label: "Fainted, or feeling faint or very dizzy", flag: "red" },
          { id: "chest", label: "Chest pain, or a racing heart at rest", flag: "red" },
          { id: "pain", label: "Severe pain in the tummy", flag: "red" },
          { id: "tired", label: "Tired all the time, breathless on stairs, or looking pale", flag: "amber" },
          { id: "disrupt", label: "Missing school, work or plans because of it" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "heavy-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "This much bleeding needs medical help now",
        summary:
          "Soaking a pad within an hour, fainting, chest pain, severe pain, or heavy bleeding when pregnancy is possible are signs to get help straight away. Please call **112** or go to the nearest emergency department now.",
        oftenLinkedTo: [
          "Losing blood faster than the body can keep up with",
          "A pregnancy problem, such as a miscarriage or a pregnancy outside the womb",
          "A low blood count from heavy blood loss",
        ],
        whatHelps: [
          "Call **112** or ask someone to take you to hospital now",
          "Lie down with your legs raised if you feel faint, and don't go alone",
          "Tell the doctor how often you've been changing pads",
        ],
        seeDoctor: "Go now: this is not one to wait out at home.",
      },
      {
        id: "heavy-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Heavy bleeding like this is worth a doctor's visit soon",
        summary:
          "Soaking a pad in under 2 hours, clots bigger than a ₹5 coin, bleeding beyond 7 days or constant tiredness are signs that a period is heavier than it should be. It's common and treatable, and a doctor can check iron levels too.",
        oftenLinkedTo: [
          "Fibroids or polyps in the womb",
          "Hormone imbalance, including PCOS or thyroid problems",
          "Adenomyosis or endometriosis",
          "A bleeding disorder, especially with easy bruising or a family history",
          "Low iron or anaemia, when there's tiredness or breathlessness",
        ],
        whatHelps: [
          "Use an XL+ pad, or a period panty for nights and the heaviest days",
          "Note how often you change and the size of any clots: it helps the doctor a lot",
          "Eat iron-rich food like dal, rajma, spinach, dates and jaggery, with amla, lemon or orange to help absorb it",
          "Ask the doctor for a blood count and iron check",
          "Go to emergency if a pad soaks through within an hour or you feel faint",
        ],
        seeDoctor: "See a doctor or gynaecologist in the next few days.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "heavy-postpartum",
        match: { answers: { situation: ["baby"] } },
        urgency: "selfcare",
        title: "Bleeding after birth is heaviest at first, then eases",
        summary:
          "After having a baby, bleeding (lochia) is heaviest for the first few days and slowly tapers over a few weeks. Some small clots early on are common, but there are clear signs that need a doctor the same day.",
        oftenLinkedTo: [
          "The womb healing after birth",
          "Bleeding that picks up with more activity",
          "Less often, an infection or a piece of placenta left behind, which needs a doctor",
        ],
        whatHelps: [
          "Use XL+ pads or period panties, not a cup or tampon, until your doctor says it's fine",
          "Rest when you can and build up activity slowly",
          "Call your doctor the same day for a fever, smelly discharge, clots bigger than a plum, or bleeding that turns heavy again after easing",
          "Call **112** if a pad soaks through within an hour, clots are bigger than a golf ball, or you feel faint",
        ],
        seeDoctor:
          "Call your doctor if bleeding is still very heavy after the first week, and the same day for any of the warning signs above.",
        products: ["ovy-pads", "ovy-panty"],
      },
      {
        id: "heavy-teen",
        match: { ages: ["u13", "13-17"] },
        urgency: "checkup",
        title: "Heavy periods in the first years are common, but worth mentioning",
        summary:
          "Periods can be heavier while the cycle settles in the first year or two. Heavy periods from the very start can also be linked to a bleeding disorder, so it's worth telling a doctor, especially if heavy bleeding runs in the family. If you're checking for your daughter, ask her how often she changes at school.",
        oftenLinkedTo: [
          "Hormones that are still settling, so the lining builds up more in some months",
          "A bleeding disorder, which a blood test can check",
          "Low iron, if there's tiredness or breathlessness",
        ],
        whatHelps: [
          "Pack XL or XL+ pads and spare underwear for school",
          "A period panty at night takes away the worry about leaks on bedding",
          "Eat iron-rich food with something sour like amla or lemon",
          "Log heavy days in the [period tracker](/period-log)",
        ],
        seeDoctor:
          "See a doctor if a pad soaks through in under 2 hours, periods last more than 7 days, or school is often missed because of them.",
        products: ["ovy-teen", "ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "heavy-40s",
        match: { ages: ["40-49", "50+"] },
        urgency: "checkup",
        title: "Heavier periods in your 40s are common, but worth a check",
        summary:
          "Flow often swings heavier in the years before menopause. New or much heavier bleeding at this age is still worth a doctor's visit, because a few causes are easier to treat when found early.",
        oftenLinkedTo: [
          "Perimenopause hormone swings",
          "Fibroids or polyps, which are common at this age",
          "Adenomyosis",
          "Thyroid problems",
          "Less often, a thickened womb lining that a doctor should check",
        ],
        whatHelps: [
          "Use XL+ pads or a period panty on heavy days and nights",
          "Keep a mix of sizes, since flow can change from month to month",
          "Eat iron-rich food, and ask for an iron check if you're tired",
          "Read about the [early signs of perimenopause](/blog/perimenopause-symptoms-early-signs)",
        ],
        seeDoctor:
          "Book a check with a gynaecologist, and see one quickly for any bleeding after a full year without periods.",
        products: ["ovy-pads", "ovy-panty"],
        readMore: [{ label: "Early signs of perimenopause", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "heavy-disrupt",
        match: { answers: { feel: ["disrupt"] } },
        urgency: "checkup",
        title: "Heavy periods that get in the way of life deserve treatment",
        summary:
          "Heavy bleeding is judged by how much it affects your life, not just by volume. If it keeps you from school, work or plans, there are effective treatments, and a doctor can help.",
        oftenLinkedTo: [
          "Fibroids or polyps",
          "Hormone imbalance, PCOS or thyroid problems",
          "Adenomyosis or endometriosis",
          "In many people no single cause is found, and it's still treatable",
        ],
        whatHelps: [
          "Use XL+ pads or a period panty for the heaviest days and nights",
          "A menstrual cup with volume markings lets you measure your flow, which is useful to show a doctor",
          "Log heavy days in the [period tracker](/period-log)",
          "Ask the doctor for a blood count and iron check",
        ],
        seeDoctor: "Book a routine visit with a doctor or gynaecologist.",
        products: ["ovy-pads", "ovy-panty", "ovy-cup", "period-tracker"],
      },
      {
        id: "heavy-default",
        urgency: "selfcare",
        title: "A heavy-feeling period within the usual range",
        summary:
          "Changing every 3 to 4 hours or more, with small or no clots and bleeding for 7 days or less, is within the usual range for many people. Flow changes from day to day, and heavier days are normal.",
        oftenLinkedTo: [
          "Natural differences in flow between people",
          "The first 2 or 3 days usually being the heaviest",
          "A copper IUD, which can make periods heavier for some",
          "Stress or a change in routine",
        ],
        whatHelps: [
          "Pick pads by the day: XL or XL+ for heavy days and nights, L for lighter days",
          "A period panty helps on nights and long travel days",
          "Eat iron-rich food with vitamin C, like dal with a squeeze of lemon",
          "Log flow in the [period tracker](/period-log) to notice any change",
        ],
        seeDoctor:
          "See a doctor if pads start soaking through in under 2 hours, clots get bigger than a ₹5 coin, periods last more than 7 days, or you feel tired all the time.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
      },
    ],
    sources: [
      { label: "NHS: Heavy periods", url: "https://www.nhs.uk/conditions/heavy-periods/" },
      { label: "NHS: Iron deficiency anaemia", url: "https://www.nhs.uk/conditions/iron-deficiency-anaemia/" },
      { label: "NHS: Fibroids", url: "https://www.nhs.uk/conditions/fibroids/" },
      { label: "NHS: Endometriosis", url: "https://www.nhs.uk/conditions/endometriosis/" },
    ],
  },

  // ───────────── Bleeding or spotting between periods ─────────────
  {
    id: "spotting",
    title: "Bleeding or spotting between periods",
    short: "I'm bleeding or spotting between periods",
    triggers: [
      "spotting",
      "spotting between periods",
      "bleeding between periods",
      "bleeding after sex",
      "beech mein bleeding",
      "period ke beech spotting",
      "brown spotting",
      "halki bleeding ho rahi hai",
      "spotting kyu ho rahi hai",
      "bleeding after menopause",
      "spotting on the pill",
      "light bleeding but not period",
      "sex ke baad bleeding",
    ],
    needs: {},
    questions: [
      {
        id: "when",
        text: "When does the bleeding or spotting happen?",
        options: [
          { id: "mid", label: "Around the middle of the cycle" },
          { id: "before", label: "A day or two before a period" },
          { id: "after-sex", label: "After sex", flag: "amber" },
          { id: "random", label: "At random times, no pattern" },
          { id: "contraception", label: "Since starting, changing or missing contraception (pill, injection, IUD or emergency pill)" },
          { id: "menopause", label: "After menopause (a year or more with no periods)", flag: "red" },
        ],
      },
      {
        id: "pregnancy",
        text: "Is there any chance of pregnancy?",
        options: [
          { id: "yes", label: "Yes, pregnant or it's possible", flag: "red" },
          { id: "unsure", label: "Not sure", flag: "amber" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "howlong",
        text: "How long has this been happening?",
        options: [
          { id: "once", label: "Just once" },
          { id: "few", label: "A few times in the last 2 to 3 months" },
          { id: "months", label: "For more than 3 months" },
        ],
      },
      {
        id: "signs",
        text: "Any of these as well?",
        multi: true,
        options: [
          { id: "heavy-faint", label: "Heavy bleeding, fainting or feeling very dizzy", flag: "red" },
          { id: "severe-pain", label: "Severe or one-sided tummy pain, or pain with a fever", flag: "red" },
          { id: "discharge", label: "Unusual discharge, a strong smell or itching", flag: "amber" },
          { id: "sex-pain", label: "Pain during sex", flag: "amber" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "sp-emergency",
        match: { answers: { signs: ["heavy-faint", "severe-pain"] } },
        urgency: "emergency",
        title: "Bleeding with severe pain or faintness needs help now",
        summary:
          "Bleeding together with severe or one-sided pain, a fever, heavy flow or fainting needs a doctor today. Please call **112** or go to the nearest emergency department now, especially if pregnancy is possible.",
        oftenLinkedTo: [
          "A pregnancy problem, including a pregnancy outside the womb",
          "A pelvic infection, especially with a fever",
          "An ovarian cyst that has twisted or burst",
        ],
        whatHelps: [
          "Call **112** or ask someone to take you to hospital now",
          "Lie down if you feel faint, and don't go alone",
          "Tell the doctor the last period date and whether pregnancy is possible",
        ],
        seeDoctor: "Go now: this is not one to wait out at home.",
      },
      {
        id: "sp-pregnancy",
        match: { answers: { pregnancy: ["yes"] } },
        urgency: "soon",
        title: "Bleeding when pregnancy is possible: call a doctor today",
        summary:
          "Light spotting in early pregnancy is fairly common, but any bleeding during a pregnancy, or a possible one, should be checked by a doctor the same day. A home pregnancy test is a good first step if it's not done yet.",
        oftenLinkedTo: [
          "Spotting as the pregnancy settles into the womb, very early on",
          "Changes in the cervix during pregnancy",
          "A threatened miscarriage",
          "A pregnancy outside the womb, which a doctor must rule out",
        ],
        whatHelps: [
          "Do a home pregnancy test if it's not done yet",
          "Call your doctor or gynaecologist today",
          "Use a pad or liner, not a cup, so you can see the colour and amount",
          "Go to emergency straight away if pain becomes severe, or you feel faint or bleed heavily",
        ],
        seeDoctor:
          "Contact a doctor today, and go to emergency for severe pain, shoulder tip pain, fainting or heavy bleeding.",
        products: ["ovy-liners", "ovy-pads"],
      },
      {
        id: "sp-menopause",
        match: { answers: { when: ["menopause"] } },
        urgency: "soon",
        title: "Any bleeding after menopause needs a doctor",
        summary:
          "Once periods have stopped for a full year, any bleeding at all, even one spot, even once, needs a doctor. It's usually caused by something common and treatable, but it should always be checked quickly.",
        oftenLinkedTo: [
          "Thinning of the vaginal or womb lining after menopause",
          "Polyps, which are small non-cancerous growths",
          "A thickened womb lining",
          "Less often, cancer, which is much easier to treat when found early",
        ],
        whatHelps: [
          "Book a gynaecologist visit this week, even if it happened only once",
          "Note the date, amount and colour of the bleeding",
          "Use a liner so you can see if it happens again",
          "Don't wait to see if it stops on its own",
        ],
        seeDoctor: "See a doctor within a few days: this is one to check, never one to wait out.",
        products: ["ovy-liners"],
      },
      {
        id: "sp-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Bleeding after sex or with other symptoms is worth checking soon",
        summary:
          "That's one to get checked rather than wait out. It's usually something small and fixable, but it's never something to sit on. If pregnancy is possible, do a test first.",
        oftenLinkedTo: [
          "Changes on the surface of the cervix, which are common and treatable",
          "An infection, including a sexually transmitted infection",
          "Polyps on the cervix or in the womb",
          "Dryness or small tears during sex",
          "Early pregnancy, if a test hasn't ruled it out",
        ],
        whatHelps: [
          "If there's any chance of pregnancy, do a home test",
          "Avoid sex until a doctor has checked",
          "Wash the outside with plain water only: no douching, soap or scented washes",
          "Keep up with any cervical screening your doctor suggests",
        ],
        seeDoctor: "See a doctor or gynaecologist in the next few days.",
        products: ["ovy-liners"],
        readMore: [{ label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" }],
      },
      {
        id: "sp-contraception",
        match: { answers: { when: ["contraception"] } },
        urgency: "checkup",
        title: "Spotting after a contraception change is common in the first months",
        summary:
          "Spotting is common in the first 3 months of a new pill, injection or hormonal IUD, after missed pills, and after an emergency pill. It's still worth telling the doctor or clinic who gave it, so they can check it's settling.",
        oftenLinkedTo: [
          "The body adjusting to new hormone levels",
          "Missed or late pills",
          "An emergency pill shifting the cycle",
          "Less often, an infection or a pregnancy, which a doctor can rule out",
        ],
        whatHelps: [
          "Keep using the method as advised unless a doctor says to stop",
          "If pills were missed, follow the leaflet and think about a pregnancy test",
          "Use a liner for light spotting and change it every 3 to 4 hours",
          "Note spotting days in the [period tracker](/period-log)",
        ],
        seeDoctor:
          "See the doctor who prescribed it if spotting carries on past 3 months, gets heavier, or comes with pain or bleeding after sex.",
        products: ["ovy-liners", "period-tracker"],
      },
      {
        id: "sp-cycle",
        match: { answers: { when: ["mid", "before"] } },
        urgency: "checkup",
        title: "Light spotting around mid-cycle or before a period",
        summary:
          "A little spotting around ovulation or a day or two before a period can be linked to normal hormone shifts. Bleeding between periods is still worth getting checked, so mention it to a doctor even if it's light.",
        oftenLinkedTo: [
          "The hormone dip around ovulation",
          "Low progesterone in the second half of the cycle",
          "Stress or a change in routine",
          "Polyps or fibroids, which a doctor can check",
        ],
        whatHelps: [
          "Use a liner on spotting days and change it every 3 to 4 hours",
          "Note when it happens in the [period tracker](/period-log) to see a pattern",
          "If pregnancy is possible, do a test",
          "Book a routine visit, especially if it keeps happening",
        ],
        seeDoctor:
          "Book a routine visit with a doctor or gynaecologist: in-between bleeding should always be checked at least once.",
        products: ["ovy-liners", "period-tracker"],
      },
      {
        id: "sp-default",
        urgency: "checkup",
        title: "Bleeding between periods is worth getting checked",
        summary:
          "Bleeding at random times can have several causes, and most are common and treatable. It's still one to check rather than wait out.",
        oftenLinkedTo: [
          "Hormone changes, including thyroid problems or PCOS",
          "Polyps or fibroids",
          "An infection of the cervix or womb",
          "Perimenopause, for those in their 40s",
        ],
        whatHelps: [
          "Use a liner on spotting days and change it every 3 to 4 hours",
          "Note each episode in the [period tracker](/period-log)",
          "If pregnancy is possible, do a home test",
          "Book a visit with a doctor or gynaecologist",
        ],
        seeDoctor:
          "Book a visit within the next couple of weeks, and sooner if it gets heavier or pain starts.",
        products: ["ovy-liners", "period-tracker"],
      },
    ],
    sources: [
      { label: "MedlinePlus: Vaginal bleeding between periods", url: "https://medlineplus.gov/ency/article/003156.htm" },
      { label: "NHS: Post-menopausal bleeding", url: "https://www.nhs.uk/conditions/post-menopausal-bleeding/" },
      { label: "NHS: Ectopic pregnancy symptoms", url: "https://www.nhs.uk/conditions/ectopic-pregnancy/symptoms/" },
      { label: "NHS: Irregular periods", url: "https://www.nhs.uk/conditions/irregular-periods/" },
    ],
  },

  // ───────────── Period pain and cramps ─────────────
  {
    id: "pain",
    title: "Period pain and cramps",
    short: "I have period pain or cramps",
    triggers: [
      "period pain",
      "period cramps",
      "painful periods",
      "periods mein dard",
      "period mein bahut dard",
      "pet dard periods",
      "kamar dard periods mein",
      "severe cramps",
      "cramps not stopping",
      "dysmenorrhea",
      "lower back pain during periods",
      "mc mein dard",
      "pain during periods",
    ],
    needs: { who: true },
    questions: [
      {
        id: "severity",
        text: "How bad is the pain at its worst?",
        options: [
          { id: "mild", label: "Mild, a dull ache" },
          { id: "moderate", label: "Moderate, but I can carry on" },
          { id: "severe", label: "Severe, it stops me from my day" },
          { id: "sudden", label: "Sudden, sharp, or the worst pain ever", flag: "red" },
        ],
      },
      {
        id: "impact",
        text: "Does it mean missing school, college or work?",
        options: [
          { id: "no", label: "No" },
          { id: "sometimes", label: "Sometimes, a day here and there" },
          { id: "most", label: "Most months" },
          { id: "nothing-helps", label: "Yes, and heat or rest don't help at all", flag: "amber" },
        ],
      },
      {
        id: "timing",
        text: "When does the pain come?",
        options: [
          { id: "first-days", label: "In the first day or two of the period" },
          { id: "before", label: "Starts before the period and lasts through it" },
          { id: "other-times", label: "Also at other times, not only during periods", flag: "amber" },
          { id: "worse", label: "It has got worse over months or years", flag: "amber" },
          { id: "new", label: "It's new: periods weren't painful before", flag: "amber" },
        ],
      },
      {
        id: "signs",
        text: "Any of these as well?",
        multi: true,
        options: [
          { id: "fever", label: "Fever, or feeling hot and shivery", flag: "red" },
          { id: "one-sided", label: "Sudden severe pain on one side, or fainting", flag: "red" },
          { id: "pregnancy", label: "Pregnancy is possible and the period is late or unusual", flag: "red" },
          { id: "sex-bowel", label: "Pain during sex, or when pooing or peeing", flag: "amber" },
          { id: "heavy", label: "Very heavy bleeding or big clots", flag: "amber" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "pain-red",
        match: { flag: "red" },
        urgency: "emergency",
        title: "This kind of pain needs medical help now",
        summary:
          "Sudden or severe one-sided pain, fainting, pain with a fever, or pain when pregnancy is possible needs a doctor today. Please call **112** or go to the nearest emergency department now.",
        oftenLinkedTo: [
          "A pregnancy outside the womb, if pregnancy is possible",
          "A pelvic infection, especially with a fever",
          "An ovarian cyst that has twisted or burst",
          "Appendicitis or another tummy problem",
        ],
        whatHelps: [
          "Call **112** or ask someone to take you to hospital now",
          "Lie down if you feel faint, and don't go alone",
          "Tell the doctor the last period date and whether pregnancy is possible",
        ],
        seeDoctor: "Go now: this is not one to wait out at home.",
      },
      {
        id: "pain-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "This pattern of pain is worth a doctor's visit soon",
        summary:
          "Pain that heat and rest don't touch, pain outside periods, pain that keeps getting worse, or pain with sex or bowel movements isn't something to put up with. It's often linked to conditions that are common, treatable and too often missed.",
        oftenLinkedTo: [
          "Endometriosis, which takes years to diagnose on average",
          "Adenomyosis",
          "Fibroids",
          "A pelvic infection",
          "An IUD, especially in the first few months after fitting",
        ],
        whatHelps: [
          "Keep a pain diary: when it starts, how bad it is, and what it stops you doing",
          "Use heat on the lower tummy or back",
          "Tell the doctor exactly how much it affects your life: that's the detail that gets taken seriously",
          "A doctor or pharmacist can advise on pain relief that's right for you",
        ],
        seeDoctor:
          "See a doctor or gynaecologist in the next few days, and go to emergency if the pain becomes sudden or severe or a fever starts.",
        products: ["period-tracker"],
      },
      {
        id: "pain-severe",
        match: { answers: { severity: ["severe"] } },
        urgency: "checkup",
        title: "Period pain that stops your day deserves a proper check",
        summary:
          "Period pain that keeps you from normal life isn't something to just put up with. Endometriosis is one possible reason among several, it's commonly missed, and many people wait years for an answer. If you're checking for your daughter, take her pain seriously and go with her to a gynaecologist.",
        oftenLinkedTo: [
          "Strong womb contractions from natural chemicals called prostaglandins",
          "Endometriosis or adenomyosis",
          "Fibroids",
          "Heavy periods, which often come with more cramping",
        ],
        whatHelps: [
          "Heat on the lower tummy, or a warm bath or shower",
          "Gentle movement: a short walk, cat-cow or child's pose",
          "Plenty of water and warm, home-cooked food",
          "A doctor or pharmacist can advise on pain relief, rather than guessing",
          "Be specific with the doctor about days missed and what you can't do",
        ],
        seeDoctor: "Book a gynaecologist visit: severe pain is a reason to be examined, not to cope.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "pain-most",
        match: { answers: { impact: ["most"] } },
        urgency: "checkup",
        title: "Missing days most months is worth talking to a doctor about",
        summary:
          "If period pain takes days away from school or work most months, there is help available. A doctor can look for a cause and suggest options that fit you.",
        oftenLinkedTo: [
          "Strong period cramps from prostaglandins",
          "Endometriosis or adenomyosis",
          "Fibroids",
          "Heavy periods",
        ],
        whatHelps: [
          "Start heat early, before the pain peaks",
          "Gentle stretches like cat-cow, child's pose and hip circles",
          "Go easier on salt, caffeine and very cold or oily food on period days",
          "A doctor or pharmacist can advise on pain relief that's right for you",
        ],
        seeDoctor: "Book a routine visit with a doctor or gynaecologist.",
        products: ["ovy-pads", "period-tracker"],
      },
      {
        id: "pain-teen",
        match: { ages: ["u13", "13-17"] },
        urgency: "selfcare",
        title: "Period cramps are common in the teen years",
        summary:
          "Cramps are common in the first years of periods and often ease with heat, gentle movement and rest. If you're checking for your daughter, pain that regularly makes her miss school is worth a doctor's visit, not something to put up with.",
        oftenLinkedTo: [
          "The womb tightening to shed its lining",
          "Natural chemicals called prostaglandins",
          "Less often, endometriosis, which can start in the teens",
        ],
        whatHelps: [
          "A hot water bottle on the lower tummy",
          "A short walk or gentle stretches like child's pose",
          "Water, small regular snacks and warm food",
          "A pharmacist or doctor can advise on pain relief that's right for this age",
        ],
        seeDoctor: "See a doctor if the pain often stops school or sport, or if heat and rest don't help.",
        products: ["ovy-teen", "ovy-pads"],
      },
      {
        id: "pain-default",
        urgency: "selfcare",
        title: "Period cramps that ease with comfort measures",
        summary:
          "A dull ache in the lower tummy or back, mostly in the first day or two, is common and comes from the womb tightening to shed its lining. Heat, movement and rest help most people.",
        oftenLinkedTo: [
          "Natural chemicals called prostaglandins that make the womb contract",
          "Heavier flow days",
          "PMS, if the pain starts before the period with bloating or mood changes",
          "A copper IUD, which can make cramps stronger for some",
        ],
        whatHelps: [
          "Heat on the lower tummy or back",
          "Gentle movement: cat-cow, child's pose, hip circles or a short walk",
          "Plenty of water, and go easier on salt and caffeine",
          "A pharmacist or doctor can advise on pain relief that's right for you",
        ],
        seeDoctor:
          "See a doctor if the pain gets worse over time, stops you from your day, or comes with pain during sex or between periods.",
        products: ["ovy-pads", "period-tracker"],
        readMore: [{ label: "PMS vs PMDD: what's the difference?", href: "/blog/pms-vs-pmdd-symptoms-difference" }],
      },
    ],
    sources: [
      { label: "NHS: Period pain", url: "https://www.nhs.uk/conditions/period-pain/" },
      { label: "NHS: Endometriosis", url: "https://www.nhs.uk/conditions/endometriosis/" },
      { label: "NHS: Fibroids", url: "https://www.nhs.uk/conditions/fibroids/" },
      { label: "NHS: Ectopic pregnancy symptoms", url: "https://www.nhs.uk/conditions/ectopic-pregnancy/symptoms/" },
    ],
  },
];
