import type { SymptomFlow } from "../symptomTypes";
import { ADULT_AGES, FEMALE, MIDLIFE_AGES, NO_PREG_AGES, PERIOD_AGES, PREG_AGES, REPRO, SEX_SYMPTOMS } from "../applies";

// Life-stage check-ins: first periods, perimenopause and menopause, breast
// changes, bleeding after birth, and pelvic pain outside a period. Each
// flow says who it fits (showIf, ageOptions); pregnancy, birth and
// contraception only come up for women 18 to 49 (REPRO in ../applies), and
// sex-related symptoms for women 18 and over (SEX_SYMPTOMS).

/** Bleeding and period-pattern questions only once periods have started. */
const NOT_YET = { notAnswers: { stage: ["not-yet", "not-yet-15"] } };

export const FLOWS: SymptomFlow[] = [
  // 1. First period worries
  {
    id: "first-period",
    title: "First period worries",
    short: "First periods, early or late puberty, and heavy or painful early periods",
    triggers: [
      "first period",
      "first periods",
      "my daughter got her period",
      "daughter first period",
      "my period started",
      "periods not started yet",
      "when will my period start",
      "first period heavy",
      "early puberty",
      "puberty signs",
      "pehla period",
      "pehli baar period aaya",
      "beti ko period aaya",
      "15 saal period nahi aaya",
    ],
    needs: { who: true },
    whoOptions: ["daughter", "me"],
    ageOptions: ["5-12", "13-17"],
    showIf: { ages: ["5-12", "13-17"], sex: ["female", "other"], who: ["me", "daughter", "someone"] },
    notFor:
      "This check-in is for girls of about 8 to 17 who are getting ready for or starting periods, so it doesn't fit the details you gave: if periods haven't started by 16 or older, please see a doctor, and any bleeding in a child under 8 needs a doctor soon.",
    questions: [
      {
        id: "stage",
        text: "Where are things right now?",
        options: [
          { id: "not-yet", label: "Periods have not started yet" },
          { id: "not-yet-15", label: "Not started yet, at age 15 or older", showIf: { ages: ["13-17"] } },
          { id: "new", label: "The first period came in the last few months" },
          { id: "settling", label: "Periods started within the last 2 years" },
          { id: "settled", label: "Periods started more than 2 years ago" },
        ],
      },
      {
        id: "puberty",
        text: "When did the first signs of puberty start, like breast buds or underarm and pubic hair?",
        showIf: { notAnswers: { stage: ["settled"] } },
        options: [
          { id: "before8", label: "Before age 8" },
          { id: "usual", label: "Between 8 and 13" },
          { id: "none", label: "No signs yet" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "bleeding",
        text: "On the heaviest day, how is the bleeding?",
        showIf: { notAnswers: { stage: ["not-yet", "not-yet-15"] } },
        options: [
          { id: "na", label: "No period yet", showIf: { answers: { stage: ["not-yet", "not-yet-15"] } } },
          { id: "light", label: "Light or moderate: a pad lasts 3 to 6 hours" },
          { id: "heavy", label: "A pad soaked every 1 to 2 hours, or clots bigger than a ₹5 coin", flag: "amber" },
          { id: "very-heavy", label: "A pad soaked in under an hour, for several hours in a row", flag: "red" },
          { id: "unsure", label: "Not sure what counts as heavy" },
        ],
      },
      {
        id: "other",
        text: "Anything else going on? Pick all that fit.",
        multi: true,
        options: [
          { id: "faint", label: "Feeling faint, dizzy, or very tired and breathless", flag: "red", showIf: NOT_YET },
          { id: "pain", label: "Pain that means missing school, even with heat and rest", flag: "amber", showIf: NOT_YET },
          { id: "long", label: "Bleeding for more than 7 days", flag: "amber", showIf: NOT_YET },
          { id: "irregular", label: "Periods come early, late or skip a month", showIf: NOT_YET },
          { id: "nervous", label: "Feeling nervous or shy about periods" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "fp-urgent",
        match: { flag: "red" },
        urgency: "emergency",
        title: "Very heavy bleeding or feeling faint needs care today",
        summary:
          "Soaking a pad in under an hour for several hours, or feeling faint or dizzy, needs a doctor today. **Go to the nearest hospital emergency department, or call 112 if she is very unwell.** Heavy early periods are very treatable, and sometimes young people just need help to slow the bleeding and check their iron.",
        oftenLinkedTo: [
          "Hormones that are still settling in the first years, which can let the lining build up and shed heavily",
          "A bleeding or clotting tendency that runs in families, which doctors check for in teens with very heavy periods",
          "Low iron (anaemia) from losing a lot of blood",
        ],
        whatHelps: [
          "Lie down if there is any faintness, and don't go anywhere alone",
          "Use an XL+ pad or a period panty, and keep count of how many are soaked and how fast",
          "Take that count and the period dates with you; doctors find them really useful",
          "Tell the doctor if anyone in the family has very heavy periods or bleeds easily",
        ],
        seeDoctor:
          "Today: go to the nearest emergency department or call 112 if there is faintness, breathlessness, or the bleeding isn't slowing.",
        products: ["ovy-pads", "ovy-panty"],
      },
      {
        id: "fp-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Heavy, long or very painful early periods are worth a doctor's check",
        summary:
          "Early periods can be heavier and crampier than later ones, but bleeding through a pad every hour or two, bleeding past 7 days, or pain that means missing school is more than anyone should put up with. A doctor can help, and most causes are common and treatable.",
        oftenLinkedTo: [
          "Hormones still settling in the first year or two of periods",
          "Strong cramps from natural chemicals called prostaglandins",
          "A bleeding tendency that runs in families",
          "Less often, conditions such as endometriosis that a doctor needs to look into",
        ],
        whatHelps: [
          "Heat on the lower tummy, gentle movement and rest ease cramps for many girls",
          "A doctor or pharmacist can advise on pain relief that suits her age",
          "Note how often pads are changed on the heaviest day and how many days it lasts; the free [period tracker](/period-log) makes this easy",
          "Use an XL+ pad or a period panty at night, so sleep isn't spent worrying about leaks",
        ],
        seeDoctor:
          "Book a visit with a doctor or gynaecologist in the next day or two, sooner if faintness, dizziness or breathlessness starts.",
        products: ["ovy-teen", "ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "fp-early-puberty",
        match: { answers: { puberty: ["before8"] } },
        urgency: "checkup",
        title: "Signs of puberty before 8 are worth a routine check",
        summary:
          "Breast buds or body hair before age 8 can happen, and it's often nothing serious, but doctors like to check it. A routine visit to a paediatrician is the right next step. It is not an emergency.",
        oftenLinkedTo: [
          "Puberty simply starting early, which sometimes runs in families",
          "Changes in the hormone signals that start puberty, which a doctor can check with simple tests",
          "Body weight, which can nudge puberty earlier",
        ],
        whatHelps: [
          "Note when you first noticed each change: breast buds, hair, a growth spurt or body odour",
          "Keep it calm and matter of fact with her; her body is not doing anything wrong",
          "If a period does come, keep a couple of pads and a spare pair of underwear in her school bag",
        ],
        seeDoctor:
          "Book a routine visit with a paediatrician, who can check her growth and hormones and talk through options if needed.",
        products: ["ovy-teen"],
      },
      {
        id: "fp-late-15",
        match: { answers: { stage: ["not-yet-15"] } },
        urgency: "checkup",
        title: "No period by 15 is worth a routine check",
        summary:
          "Periods can start as late as 16 or 17, so this is often just a later start. Doctors still like to check when periods haven't come by 15, to make sure everything is on track.",
        oftenLinkedTo: [
          "Simply starting later, which often runs in families",
          "Being underweight, very intense exercise, or a lot of stress",
          "Hormone differences, such as with the thyroid, that a doctor can check with a blood test",
        ],
        whatHelps: [
          "Note when breast growth and body hair began; periods usually follow about 2 years after breast buds",
          "Mention any big changes in weight, eating, sport training or stress",
          "Keep a starter kit ready so the first period isn't a surprise when it comes",
        ],
        seeDoctor:
          "Book a routine visit; the doctor may suggest a blood test to check hormone levels, and it's usually reassuring.",
        products: ["ovy-teen"],
      },
      {
        id: "fp-no-signs-13",
        match: { answers: { puberty: ["none"] }, ages: ["13-17"] },
        urgency: "checkup",
        title: "No signs of puberty by 13 is worth a routine check",
        summary:
          "Bodies develop on their own timetable, and a later start is common. Doctors still like to see anyone with no signs of puberty by 13, just to check things are on track.",
        oftenLinkedTo: [
          "Simply developing later, which often runs in families",
          "Low body weight, intense sport training, or a long-term illness",
          "Hormone differences that a doctor can check with simple tests",
        ],
        whatHelps: [
          "Note any height changes over the last year or two, if you know them",
          "Mention any long-term health problems, eating changes or heavy training",
          "Reassure her that there is nothing wrong with developing later than friends",
        ],
        seeDoctor:
          "Book a routine visit with a doctor; it's usually reassuring, and simple tests can check that things are on track.",
        products: ["ovy-teen"],
      },
      {
        id: "fp-ready",
        match: { answers: { stage: ["not-yet"] } },
        urgency: "selfcare",
        title: "Getting ready for a first period",
        summary:
          "Most first periods arrive between 10 and 15, usually about 2 years after breast buds appear. Getting ready early takes the fear out of it.",
        oftenLinkedTo: [
          "Normal puberty: breast buds, a growth spurt and body hair, then a period",
          "A little clear or white discharge in the months before the first period, which is normal",
          "Feeling nervous about it, which almost everyone does",
        ],
        whatHelps: [
          "Talk about it early and calmly, so the first period feels expected, not scary",
          "Pack a small pouch for the school bag: two pads, a spare pair of underwear and a disposal bag",
          "Explain that first periods are often light and can look brown rather than red",
          "Make it clear she can always come to you, a school nurse or a trusted teacher",
        ],
        seeDoctor:
          "See a doctor if there are signs of puberty before 8, no signs of puberty by 13, or no period by 15.",
        products: ["ovy-teen"],
      },
      {
        id: "fp-normal",
        urgency: "selfcare",
        title: "Early periods are often irregular, and that's normal",
        summary:
          "In the first year or two, periods can come early, late, or skip a month, and cycles anywhere from about 21 to 45 days are normal. A whole period is only about 1 to 5 tablespoons of blood, even though it can look like a lot more.",
        oftenLinkedTo: [
          "Hormones still finding their rhythm, which can take a year or two",
          "Stress, exams, travel, illness or changes in sport training",
          "Mild cramps from the womb contracting, usually in the first day or two",
        ],
        whatHelps: [
          "Track the dates in the free [period tracker](/period-log) so the pattern becomes clear",
          "Change a pad every 4 to 6 hours, sooner on heavy days, and use a longer pad at night",
          "Heat on the tummy, a warm bath, gentle movement and rest all help with cramps",
          "Keep a spare pad and underwear in the school bag, so a surprise period is no drama",
        ],
        seeDoctor:
          "See a doctor if periods last more than 7 days, soak a pad every hour or two, cause pain that means missing school, or stop for 3 months once they've started.",
        products: ["ovy-teen", "period-tracker"],
      },
    ],
    sources: [
      { label: "NHS: Starting periods", url: "https://www.nhs.uk/conditions/periods/starting-periods/" },
      { label: "NHS: Early or delayed puberty", url: "https://www.nhs.uk/conditions/early-or-delayed-puberty/" },
      { label: "NHS: Heavy periods", url: "https://www.nhs.uk/conditions/heavy-periods/" },
    ],
  },

  // 2. Perimenopause and menopause symptoms
  {
    id: "menopause",
    title: "Perimenopause and menopause symptoms",
    short: "Hot flushes, poor sleep, mood, aches or changing periods in your 40s and beyond",
    triggers: [
      "perimenopause",
      "menopause",
      "menopause symptoms",
      "hot flushes",
      "hot flashes",
      "night sweats",
      "irregular periods in 40s",
      "periods stopped",
      "bleeding after menopause",
      "joint pain after 40",
      "mood swings at 45",
      "periods band ho gaye",
      "menopause ke lakshan",
      "raat ko garmi lagti hai",
    ],
    needs: {},
    ageOptions: MIDLIFE_AGES,
    showIf: { ...FEMALE, ages: MIDLIFE_AGES },
    notFor:
      "Perimenopause usually starts in the 40s, so this check-in doesn't fit the details you gave: if periods are changing or have stopped before 40, the irregular or late period check-ins fit better, and a doctor's check is worthwhile.",
    questions: [
      {
        id: "periods",
        text: "Where are your periods right now?",
        options: [
          { id: "regular", label: "Still fairly regular" },
          { id: "changing", label: "Changing: closer together, further apart, heavier or lighter" },
          { id: "recent-stop", label: "Stopped, but less than 12 months ago" },
          { id: "stopped", label: "No period for 12 months or more" },
          { id: "unsure", label: "Not sure, or I've had surgery or treatment that affects periods" },
        ],
      },
      {
        id: "warning",
        text: "Have you noticed any of these? Pick all that fit.",
        multi: true,
        options: [
          { id: "after12", label: "Any bleeding or spotting after 12 months without a period", flag: "red", showIf: { answers: { periods: ["stopped", "unsure"] } } },
          { id: "faint", label: "Heavy bleeding with feeling faint, dizzy or breathless", flag: "red" },
          { id: "heavy", label: "Soaking a pad every 1 to 2 hours, or clots bigger than a ₹5 coin", flag: "amber", showIf: { notAnswers: { periods: ["stopped"] } } },
          { id: "between", label: "Bleeding between periods", flag: "amber", showIf: { notAnswers: { periods: ["stopped"] } } },
          { id: "after-sex", label: "Bleeding after sex", flag: "amber", showIf: SEX_SYMPTOMS },
          { id: "short", label: "Periods less than 21 days apart, or lasting more than 7 days", flag: "amber", showIf: { notAnswers: { periods: ["stopped", "recent-stop"] } } },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "symptoms",
        text: "Which of these have you been feeling? Pick all that fit.",
        multi: true,
        options: [
          { id: "hot", label: "Hot flushes or night sweats" },
          { id: "sleep", label: "Trouble sleeping" },
          { id: "mood", label: "Low mood, anxiety, irritability or brain fog" },
          { id: "aches", label: "Joint or muscle aches" },
          { id: "dryness", label: "Vaginal dryness, or stinging when peeing" },
          { id: "sex-pain", label: "Pain or discomfort during sex", showIf: SEX_SYMPTOMS },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "impact",
        text: "How much is this affecting your daily life?",
        options: [
          { id: "little", label: "A little, I'm managing" },
          { id: "lot", label: "A lot: sleep, work or relationships are suffering" },
          { id: "dark", label: "I feel very low, or have had thoughts of harming myself", flag: "red" },
        ],
      },
    ],
    outcomes: [
      {
        id: "mp-crisis",
        match: { answers: { impact: ["dark"] } },
        urgency: "emergency",
        title: "Please talk to someone today",
        summary:
          "Thank you for telling me. Feeling this low is not something to carry alone, and it is not a weakness. Hormone changes in midlife can hit mood hard, and help really does work.",
        oftenLinkedTo: [
          "Hormone swings in perimenopause, which can bring on or worsen low mood and anxiety",
          "Months of broken sleep, which makes everything feel heavier",
          "Stress at work or at home, which often peaks in midlife",
        ],
        whatHelps: [
          "**If you feel you might act on these thoughts, call 112 now or go to the nearest emergency department**",
          "Call Tele MANAS, India's free mental health helpline, on **14416**, any time of day or night",
          "Tell one person you trust how you are feeling, today",
          "Keep someone close until you feel safer",
        ],
        seeDoctor:
          "Please see a doctor today; low mood in perimenopause is common and treatable, and you deserve support now.",
      },
      {
        id: "mp-faint",
        match: { answers: { warning: ["faint"] } },
        urgency: "emergency",
        title: "Heavy bleeding with feeling faint needs care now",
        summary:
          "Feeling faint, dizzy or breathless while bleeding heavily can be a sign of a lot of blood loss. **Please go to the nearest emergency department or call 112 now.**",
        oftenLinkedTo: [
          "Heavy bleeding from hormone swings in perimenopause",
          "Fibroids or polyps, which are common in the 40s",
          "Low iron (anaemia) from heavy periods over time",
        ],
        whatHelps: [
          "Lie down, and don't drive yourself; ask someone to take you, or call 112",
          "Count how many pads are soaked and how fast",
          "Bring the dates of your last few periods if you can",
        ],
        seeDoctor: "Now: heavy bleeding with faintness needs emergency care today.",
        products: ["ovy-pads"],
      },
      {
        id: "mp-pmb",
        match: { answers: { warning: ["after12"] } },
        urgency: "soon",
        title: "Bleeding after 12 months without a period needs a doctor",
        summary:
          "Once periods have stopped for 12 months, **any bleeding at all, even a single spot, needs a doctor's check.** It is usually not serious, but it is never one to wait out. Occasionally it is an early sign of something more serious, which is easier to treat when it's found early.",
        oftenLinkedTo: [
          "Thinning of the vaginal or womb lining after menopause",
          "Polyps, small growths that are usually harmless",
          "A thickened womb lining, which a doctor checks with a scan",
          "Hormone treatment, if you are taking it",
        ],
        whatHelps: [
          "Book a gynaecologist appointment in the next day or two; don't wait to see if it happens again",
          "Note the date, how much there was and the colour, even if it was only pink or brown",
          "Wear a liner or pad for comfort, but don't use it to wait and see",
        ],
        seeDoctor:
          "See a gynaecologist within a day or two; they will usually suggest an examination and a scan.",
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "mp-sex-bleed",
        match: { answers: { periods: ["stopped"], warning: ["after-sex"] } },
        urgency: "soon",
        title: "Bleeding after sex after menopause needs a doctor",
        summary:
          "Once periods have stopped for 12 months, **any bleeding, including after sex, needs a doctor's check.** It's usually linked to thin, dry skin that tears easily, which is very treatable, but it is never one to wait out.",
        oftenLinkedTo: [
          "Thinner, drier vaginal skin after menopause",
          "Polyps on the cervix or in the womb",
          "An infection",
          "Less often, something more serious, which is easier to treat when it's found early",
        ],
        whatHelps: [
          "Book a gynaecologist appointment in the next few days, even if it happened only once",
          "Avoid sex until a doctor has checked",
          "Tell the doctor about any dryness or pain during sex: there are simple, effective treatments",
        ],
        seeDoctor:
          "See a gynaecologist within a few days; they will usually suggest an examination and sometimes a scan.",
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "mp-bleeding",
        match: { flag: "amber" },
        urgency: "soon",
        title: "These bleeding changes are worth a doctor's check",
        summary:
          "Periods often get heavier or less predictable in perimenopause, but very heavy bleeding, bleeding between periods or after sex, and very short cycles aren't something to just put up with. A doctor can find the reason and help.",
        oftenLinkedTo: [
          "Hormone swings in perimenopause",
          "Fibroids or polyps, which are very common in the 40s",
          "A thickened womb lining, which a doctor can check with a scan",
          "Low iron, after months of heavy bleeding",
        ],
        whatHelps: [
          "Log dates and heavy days in the free [period tracker](/period-log) to show your doctor",
          "Note how often you change a pad on the worst day",
          "Use XL+ pads or a [period panty](/product-detail/ovy-panty) on heavy days and nights, and carry a spare",
          "Eat iron-rich food like leafy greens, dals and jaggery, and ask your doctor about an iron test",
        ],
        seeDoctor:
          "Book a visit with a doctor or gynaecologist in the next few days, sooner if you start to feel faint or breathless.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "mp-impact",
        match: { answers: { impact: ["lot"] } },
        urgency: "checkup",
        title: "Symptoms that get in the way of life deserve help",
        summary:
          "If sleep, mood, aches or flushes are affecting your work, rest or relationships, you don't have to just put up with it. Doctors have both hormonal and non-hormonal options, and the choice is one you make together.",
        oftenLinkedTo: [
          "Falling and swinging hormone levels in perimenopause",
          "Night sweats breaking sleep, which makes aches and mood worse",
          "Other things a doctor may check, such as thyroid, iron or vitamin levels",
        ],
        whatHelps: [
          "Write down your symptoms, how often they come and how much they affect your day",
          "Bring your period dates from the free [period tracker](/period-log)",
          "Keep moving every day, and add some strength exercise two or three times a week",
          "Keep the bedroom cool and wear light cotton at night",
        ],
        seeDoctor:
          "Book a routine visit with a doctor or gynaecologist, and tell them plainly how much it is affecting you.",
        products: ["period-tracker"],
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "mp-after",
        match: { answers: { periods: ["stopped"] } },
        urgency: "selfcare",
        title: "These sound like common changes after menopause",
        summary:
          "Once periods have stopped for a year, hot flushes, poor sleep, aches and dryness can carry on for a few years, and many women don't connect them to menopause. Simple changes help, and a doctor can help more if you need it.",
        oftenLinkedTo: [
          "Lower oestrogen after menopause, which can bring flushes, joint aches and vaginal dryness",
          "Broken sleep from night sweats, which makes mood and aches feel worse",
          "Bones getting thinner after menopause, which is worth talking to a doctor about",
        ],
        whatHelps: [
          "For flushes: light cotton, a fan, a cool room, and fewer triggers like spicy food, very hot drinks, caffeine and alcohol",
          "For bones and joints: daily walking or yoga, strength exercise two or three times a week, and calcium-rich food like milk, curd, paneer and ragi",
          "For dryness, stinging when peeing or pain during sex, tell a doctor: there are simple, effective treatments",
          "Remember that any bleeding at all after a year without periods needs a doctor",
        ],
        seeDoctor:
          "See a doctor if symptoms affect your daily life, you notice palpitations, or there is any bleeding at all.",
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "mp-common-early",
        match: { ages: ["40-44", "45-49"] },
        urgency: "selfcare",
        title: "These sound like common perimenopause changes",
        summary:
          "Perimenopause often starts in the 40s, and it is much more than periods changing: sleep, mood, memory and joints are all commonly affected, and many women don't connect them. Simple changes help, and a doctor can help more if you need it.",
        oftenLinkedTo: [
          "Hormone levels rising and falling as the ovaries slow down",
          "Hot flushes and night sweats breaking sleep",
          "Lower oestrogen, which can bring joint aches and vaginal dryness",
        ],
        whatHelps: [
          "For flushes: light cotton, a fan, a cool room, and fewer triggers like spicy food, very hot drinks, caffeine and alcohol",
          "For sleep: a regular bedtime and a cool, dark room",
          "For aches and mood: daily walking or yoga, plus strength exercise two or three times a week",
          "Track periods in the free [period tracker](/period-log); pregnancy is still possible until 12 months without a period, so keep using contraception",
          "For dryness or pain during sex, tell a doctor: there are simple, effective treatments",
        ],
        seeDoctor:
          "See a doctor if symptoms affect your daily life, you notice palpitations, or there is any bleeding after 12 months without a period.",
        products: ["period-tracker", "ovy-pads"],
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
      {
        id: "mp-common",
        urgency: "selfcare",
        title: "These sound like common perimenopause changes",
        summary:
          "Perimenopause often starts in the 40s, and it is much more than periods changing: sleep, mood, memory and joints are all commonly affected, and many women don't connect them. Simple changes help, and a doctor can help more if you need it.",
        oftenLinkedTo: [
          "Hormone levels rising and falling as the ovaries slow down",
          "Hot flushes and night sweats breaking sleep",
          "Lower oestrogen, which can bring joint aches and vaginal dryness",
        ],
        whatHelps: [
          "For flushes: light cotton, a fan, a cool room, and fewer triggers like spicy food, very hot drinks, caffeine and alcohol",
          "For sleep: a regular bedtime and a cool, dark room",
          "For aches and mood: daily walking or yoga, plus strength exercise two or three times a week",
          "Track periods in the free [period tracker](/period-log) to spot patterns and show your doctor",
          "For dryness or pain during sex, tell a doctor: there are simple, effective treatments",
        ],
        seeDoctor:
          "See a doctor if symptoms affect your daily life, you notice palpitations, or there is any bleeding after 12 months without a period.",
        products: ["period-tracker", "ovy-pads"],
        readMore: [{ label: "Perimenopause symptoms and when to worry", href: "/blog/perimenopause-symptoms-early-signs" }],
      },
    ],
    sources: [
      { label: "NHS: Symptoms of menopause and perimenopause", url: "https://www.nhs.uk/conditions/menopause/symptoms/" },
      { label: "NHS: Post-menopausal bleeding", url: "https://www.nhs.uk/conditions/post-menopausal-bleeding/" },
      { label: "World Health Organization: Menopause fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/menopause" },
      { label: "NHS: Heavy periods", url: "https://www.nhs.uk/conditions/heavy-periods/" },
    ],
  },

  // 3. Breast pain or a lump
  {
    id: "breast",
    title: "Breast pain or a lump",
    short: "Breast tenderness, a lump, nipple discharge or skin changes",
    triggers: [
      "breast pain",
      "breast lump",
      "lump in breast",
      "sore breasts",
      "breast tenderness before period",
      "nipple discharge",
      "lump in armpit",
      "breast swelling",
      "breast cancer symptoms",
      "breast mein gaanth",
      "breast me dard",
      "chest mein gaanth",
      "nipple se paani aa raha hai",
    ],
    needs: {},
    ageOptions: PERIOD_AGES,
    showIf: { ...FEMALE, ages: PERIOD_AGES },
    notFor:
      "This check-in is written for girls and women, so it doesn't fit the details you gave: a lump, swelling or pain in the chest or breast of a boy, a man or a young child is worth showing a doctor, and it's often harmless.",
    questions: [
      {
        id: "concern",
        text: "What have you noticed?",
        options: [
          { id: "pain", label: "Pain or tenderness, but no lump" },
          { id: "lumpy", label: "A general lumpy feel, similar in both breasts" },
          { id: "bud", label: "A small, tender lump just under the nipple as breasts start to grow", showIf: { ages: ["5-12", "13-17"] } },
          { id: "lump", label: "A new lump or thickening in one place", flag: "amber" },
          { id: "discharge", label: "Nipple discharge" },
          { id: "change", label: "A change in the skin, the nipple or the shape", flag: "amber" },
        ],
      },
      {
        id: "timing",
        text: "Does it change with your period?",
        options: [
          { id: "cyclical", label: "Worse in the 1 to 2 weeks before my period, better after" },
          { id: "constant", label: "No, it stays the same through the month" },
          { id: "feeding", label: "I'm pregnant or breastfeeding", showIf: REPRO },
          { id: "noperiods", label: "I don't have periods now" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "signs",
        text: "Any of these? Pick all that fit.",
        multi: true,
        options: [
          { id: "hot", label: "A red, hot, swollen area with fever or chills", flag: "red" },
          { id: "blood", label: "Discharge with blood in it", flag: "amber" },
          { id: "skin", label: "Dimpled skin like orange peel, a rash on the nipple, or a nipple that has newly turned inward", flag: "amber" },
          { id: "armpit", label: "A lump or swelling in the armpit", flag: "amber" },
          { id: "shape", label: "A new change in the size or shape of one breast", flag: "amber" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "family",
        text: "Has your mother, sister or daughter had breast or ovarian cancer?",
        showIf: { ages: ADULT_AGES },
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unsure", label: "Not sure" },
        ],
      },
    ],
    outcomes: [
      {
        id: "br-infection-np",
        match: { flag: "red", ages: NO_PREG_AGES },
        urgency: "soon",
        title: "A red, hot, sore area with fever needs a doctor today",
        summary:
          "A hot, red, swollen patch with fever or chills is often linked to an infection, and it usually settles quickly with the right treatment. **Please see a doctor today.**",
        oftenLinkedTo: [
          "A breast infection",
          "Less often, a collection of pus (an abscess) that a doctor needs to treat",
          "An infected hair follicle or cyst in the skin",
        ],
        whatHelps: [
          "A cold compress for 10 minutes at a time can ease the pain",
          "Rest, drink plenty of fluids and wear a soft, supportive bra",
          "Don't squeeze or press the area",
          "A doctor or pharmacist can advise on pain relief that's right for you",
        ],
        seeDoctor:
          "See a doctor today, and go to emergency if you feel very unwell or confused, or the redness spreads fast.",
      },
      {
        id: "br-infection",
        match: { flag: "red" },
        urgency: "soon",
        title: "A red, hot, sore area with fever needs a doctor today",
        summary:
          "A hot, red, swollen patch with fever or chills is often linked to an infection. It is very common while breastfeeding but can happen at any time, and it usually settles quickly with the right treatment. **Please see a doctor today.**",
        oftenLinkedTo: [
          "Milk building up in a blocked duct while breastfeeding",
          "A breast infection (mastitis)",
          "Less often, a collection of pus (an abscess) that a doctor needs to treat",
        ],
        whatHelps: [
          "If breastfeeding, keep feeding or expressing from that side; stopping suddenly can make it worse",
          "A cold compress for 10 minutes at a time can ease the pain",
          "Rest, drink plenty of fluids and wear a soft, supportive bra",
          "A doctor or pharmacist can advise on pain relief that's safe while feeding",
        ],
        seeDoctor:
          "See a doctor today, and go to emergency if you feel very unwell or confused, or the redness spreads fast.",
      },
      {
        id: "br-feeding-change",
        match: { flag: "amber", answers: { timing: ["feeding"] } },
        urgency: "soon",
        title: "A breast change while pregnant or breastfeeding is worth a check",
        summary:
          "Breasts change a lot in pregnancy and while feeding, and a firm, tender lump is often a blocked milk duct. Still, a lump that doesn't go after a feed or two, blood in the discharge, or a skin or nipple change should be shown to a doctor.",
        oftenLinkedTo: [
          "A blocked milk duct, which often feels like a tender, firm lump",
          "Cracked or sore nipples, which can add streaks of blood",
          "Harmless lumps such as cysts or fibroadenomas",
        ],
        whatHelps: [
          "Keep feeding, starting on the sore side, and check the baby's latch",
          "Massage gently towards the nipple, with light pressure only",
          "Note whether the lump gets smaller after a feed",
        ],
        seeDoctor:
          "See a doctor or lactation consultant within a day or two if a lump doesn't go after a feed or two, and the same day if fever or redness starts.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-check-young",
        match: { flag: "amber", ages: ["u13", "13-17"] },
        urgency: "soon",
        title: "A new breast change is worth showing a doctor",
        summary:
          "In girls and teens, breast lumps are almost always harmless: often a breast bud, a cyst or a fibroadenoma. Still, a new lump, discharge with blood, or a skin or nipple change should be checked by a doctor, who may suggest an ultrasound.",
        oftenLinkedTo: [
          "A breast bud, if breasts are just starting to grow",
          "A fibroadenoma, a harmless lump that's common in teens and young women",
          "A small cyst or an infected gland",
        ],
        whatHelps: [
          "Book a visit with a doctor or gynaecologist this week: a parent or trusted adult can go too",
          "Note when it was first noticed and whether it changes with periods",
          "You can ask for a female doctor",
          "Try not to keep squeezing or prodding the area to check it",
        ],
        seeDoctor:
          "See a doctor within the next week or two, and the same day if the area becomes red, hot and painful with a fever.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-check",
        match: { flag: "amber" },
        urgency: "soon",
        title: "A new breast change is worth showing a doctor this week",
        summary:
          "Most breast lumps and changes turn out not to be cancer. Still, anything new, like a lump, blood in the discharge, or a skin or nipple change, should be examined by a doctor rather than watched. Booking a check is the calm, sensible next step.",
        oftenLinkedTo: [
          "A fluid-filled cyst, which is common in the 30s and 40s",
          "A fibroadenoma, a harmless lump that's common in younger women",
          "A small growth in a milk duct, which can cause blood-stained discharge",
          "Less often, something more serious, which is easier to treat when it's found early",
        ],
        whatHelps: [
          "Book an appointment with a doctor or gynaecologist this week; don't wait for it to hurt, as many lumps are painless",
          "Note when you first noticed it and whether it changes with your period",
          "You can ask for a female doctor, and bring someone with you",
          "Try not to keep squeezing or prodding the area to check it",
        ],
        seeDoctor:
          "See a doctor within the next few days; they will examine you and may suggest an ultrasound or mammogram, which is routine.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-bud",
        match: { answers: { concern: ["bud"] } },
        urgency: "selfcare",
        title: "A tender lump under the nipple is often a breast bud",
        summary:
          "When breasts start to develop, a small, firm, tender lump often appears just under one or both nipples. It's called a breast bud, it's a normal first sign of puberty, and one side often starts a few months before the other.",
        oftenLinkedTo: [
          "Breast buds, which usually appear between about 8 and 13",
          "Normal growth, with one side often a few months ahead",
          "Tenderness that comes and goes as breasts grow",
        ],
        whatHelps: [
          "A soft cotton crop top or starter bra can make it more comfortable",
          "Keep it calm and matter of fact: her body is doing exactly what it should",
          "Periods usually start about 2 years after breast buds, so it's a good time to get ready",
          "Note when it was first noticed",
        ],
        seeDoctor:
          "See a doctor if breast buds appear before age 8, or the lump is hard, red, hot or growing fast, or there is nipple discharge.",
        products: ["ovy-teen"],
      },
      {
        id: "br-discharge-np",
        match: { answers: { concern: ["discharge"] }, ages: NO_PREG_AGES },
        urgency: "checkup",
        title: "Nipple discharge is worth a routine check",
        summary:
          "Clear or milky discharge from the nipple is often harmless, but it's always worth getting checked at a routine visit, and sooner if there is blood.",
        oftenLinkedTo: [
          "Changes in the milk ducts that come with age or hormones",
          "Some medicines",
          "Hormone changes that a doctor can check with a blood test",
          "A small growth in a milk duct, which is usually harmless",
        ],
        whatHelps: [
          "Note the colour, whether it comes from one or both sides, and whether it comes on its own",
          "Avoid squeezing the nipple to check, as that can keep it going",
          "Wear a soft, comfortable bra",
        ],
        seeDoctor:
          "Book a routine visit, and see a doctor sooner if there is blood, a lump or a skin change.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-discharge",
        match: { answers: { concern: ["discharge"] } },
        urgency: "checkup",
        title: "Nipple discharge is worth a routine check",
        summary:
          "Milky discharge in pregnancy or while breastfeeding is normal. Otherwise, clear or milky discharge is often harmless, but it is always worth getting checked at a routine visit.",
        oftenLinkedTo: [
          "Pregnancy, breastfeeding, or the months after stopping feeding",
          "Age-related changes in the milk ducts",
          "Some medicines, including hormonal ones",
          "Hormone changes that a doctor can check with a blood test",
        ],
        whatHelps: [
          "Note the colour, whether it comes from one or both sides, and whether it comes on its own",
          "Avoid squeezing the nipple to check, as that can keep it going",
          "Wear a soft, comfortable bra",
        ],
        seeDoctor:
          "Book a routine visit, and see a doctor sooner if there is blood, a lump or a skin change.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-family",
        match: { answers: { family: ["yes"] } },
        urgency: "checkup",
        title: "With a family history, a routine breast check is a good idea",
        summary:
          "Breast pain or lumpiness on its own is rarely a sign of cancer. But when a close relative has had breast or ovarian cancer, a routine visit to talk about your own risk and when to start screening is a good idea.",
        oftenLinkedTo: [
          "Normal cycle-related tenderness or lumpiness",
          "Strain in the chest muscles or back, felt in the breast",
          "A family history that may mean starting screening earlier",
        ],
        whatHelps: [
          "Ask your family which relatives had breast or ovarian cancer, and at what age",
          "Get to know your normal with a monthly [breast self-exam](/blog/breast-self-exam-at-home-guide)",
          "Wear a well-fitted bra in the day and a soft one at night",
        ],
        seeDoctor:
          "Book a routine visit to discuss whether to start screening earlier; government health centres offer breast screening to people over 30.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-cyclical",
        match: { answers: { timing: ["cyclical"] } },
        urgency: "selfcare",
        title: "Tenderness before your period is very common",
        summary:
          "Breasts often feel fuller, heavier and sore in the week or two before a period, sometimes right into the armpits, and ease once it starts. This cyclical pain is very common and usually normal.",
        oftenLinkedTo: [
          "Normal hormone changes across the menstrual cycle",
          "The natural lumpiness of breast tissue, which is more noticeable before a period",
        ],
        whatHelps: [
          "Wear a well-fitted, supportive bra in the day and a soft one to sleep in",
          "A warm or cool compress can ease the ache",
          "A doctor or pharmacist can advise on pain relief if you need it",
          "Track it in the free [period tracker](/period-log) to see the pattern, and check your breasts a few days after your period ends",
        ],
        seeDoctor:
          "See a doctor if the pain doesn't ease after your period, stays in one spot, or you notice a new lump.",
        products: ["period-tracker"],
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
      {
        id: "br-pain",
        urgency: "selfcare",
        title: "Breast pain on its own is rarely serious",
        summary:
          "Breast pain without a lump or other change is very common, and on its own it is rarely a sign of cancer. Pain that isn't linked to your cycle often comes from the chest wall, a bra that doesn't fit, or hormone changes.",
        oftenLinkedTo: [
          "Strain in the chest muscles, neck or back, felt in the breast",
          "A bra that doesn't fit well",
          "Hormone changes, such as around periods or menopause",
          "Some medicines",
        ],
        whatHelps: [
          "Try a well-fitted, supportive bra, and a soft one at night",
          "Ease off heavy lifting or new workouts for a few days",
          "Get to know your normal with a [breast self-exam](/blog/breast-self-exam-at-home-guide)",
        ],
        seeDoctor:
          "See a doctor if the pain lasts more than a few weeks, keeps you awake, or you notice a lump, discharge or a skin change.",
        readMore: [{ label: "Breast self-exam at home", href: "/blog/breast-self-exam-at-home-guide" }],
      },
    ],
    sources: [
      { label: "NHS: Breast pain", url: "https://www.nhs.uk/conditions/breast-pain/" },
      { label: "NHS: Breast lump", url: "https://www.nhs.uk/conditions/breast-lump/" },
      { label: "NHS: Nipple discharge", url: "https://www.nhs.uk/conditions/nipple-discharge/" },
      { label: "NHS: Mastitis", url: "https://www.nhs.uk/conditions/mastitis/" },
    ],
  },

  // 4. Bleeding or periods after delivery
  {
    id: "postpartum",
    title: "Bleeding or periods after delivery",
    short: "Bleeding after birth, clots, and when periods come back",
    triggers: [
      "bleeding after delivery",
      "bleeding after birth",
      "postpartum bleeding",
      "after delivery heavy bleeding",
      "clots after delivery",
      "bleeding after c section",
      "lochia",
      "periods after delivery",
      "postpartum period",
      "breastfeeding period not coming",
      "delivery ke baad bleeding",
      "delivery ke baad period kab aayega",
      "bachcha hone ke baad periods",
    ],
    // Also for a parent asking about a grown-up daughter who has just had a baby.
    needs: { who: true },
    whoOptions: ["me", "daughter", "someone"],
    ageOptions: PREG_AGES,
    showIf: { ages: PREG_AGES, sex: ["female", "other"], who: ["me", "daughter", "someone"] },
    notFor:
      "This check-in doesn't fit the details you gave, so let's try another one: the heavy bleeding or bleeding between periods check-ins may help, and if bleeding is very heavy or there is faintness, call 112.",
    questions: [
      {
        id: "weeks",
        text: "How long ago was the birth?",
        options: [
          { id: "w0", label: "Less than a week" },
          { id: "w1-6", label: "1 to 6 weeks" },
          { id: "w6-12", label: "6 to 12 weeks" },
          { id: "w12", label: "More than 12 weeks" },
        ],
      },
      {
        id: "bleeding",
        text: "How is the bleeding now?",
        options: [
          { id: "early-heavy", label: "Red and fairly heavy, but it's only been a few days" },
          { id: "easing", label: "Getting lighter: pink, brown or creamy" },
          { id: "not-easing", label: "Still red and heavy after the first week, not easing", flag: "amber" },
          { id: "back", label: "It had eased, and now it's bright red or heavier again", flag: "red" },
          { id: "stopped", label: "Stopped. I'm wondering when periods will come back" },
        ],
      },
      {
        id: "signs",
        text: "Any of these? Pick all that fit.",
        multi: true,
        options: [
          { id: "soaking", label: "Soaking a pad in an hour or less", flag: "red" },
          { id: "clots", label: "Clots bigger than a golf ball", flag: "red" },
          { id: "faint", label: "Feeling faint, dizzy, breathless, or a racing heart", flag: "red" },
          { id: "fever", label: "Fever, chills, or discharge that smells bad", flag: "red" },
          { id: "pain", label: "Tummy pain that's getting worse, or a stitch or wound that's red, swollen or oozing", flag: "amber" },
          { id: "none", label: "None of these" },
        ],
      },
      {
        id: "feeding",
        text: "How are you feeding your baby?",
        options: [
          { id: "full", label: "Only breastfeeding" },
          { id: "mixed", label: "Breastfeeding and formula" },
          { id: "formula", label: "Formula only" },
        ],
      },
    ],
    outcomes: [
      {
        id: "pp-emergency",
        match: { answers: { signs: ["soaking", "clots", "faint"] } },
        urgency: "emergency",
        title: "Very heavy bleeding after birth needs emergency care now",
        summary:
          "Soaking a pad in an hour or less, passing clots bigger than a golf ball, or feeling faint after birth needs emergency care, even weeks after delivery. **Please call 112 or go to the nearest hospital now, and don't drive yourself.**",
        oftenLinkedTo: [
          "The womb not tightening down as it should after birth",
          "A small piece of placenta left inside the womb",
          "A tear or wound that is bleeding",
        ],
        whatHelps: [
          "Call 112, or have someone take you to hospital now",
          "Lie down with your legs raised if you feel faint",
          "Keep the soaked pads or count them, as it helps the hospital team",
          "Hand the baby to another adult so you can focus on getting help",
        ],
        seeDoctor: "Now: this is an emergency, whether the birth was days or weeks ago.",
      },
      {
        id: "pp-today",
        match: { flag: "red" },
        urgency: "soon",
        title: "This needs your doctor or maternity unit today",
        summary:
          "A fever, discharge that smells bad, or bleeding that turns bright red or heavy again after easing can be signs of an infection or something left inside the womb. These are common and treatable, but **they need checking today**, not at your next visit.",
        oftenLinkedTo: [
          "An infection of the womb lining after birth",
          "A small piece of placenta or membrane left inside",
          "An infected stitch or caesarean wound",
          "Sometimes a first period, but only a doctor can tell",
        ],
        whatHelps: [
          "Call your doctor or the hospital where you delivered, today",
          "Take your temperature and note it down",
          "Keep using pads or period panties, not tampons or a cup",
          "Go to emergency if you start to feel faint, breathless or very unwell",
        ],
        seeDoctor:
          "Today: call your doctor or maternity unit, and go to emergency if the bleeding gets heavy or you feel faint.",
        products: ["ovy-pads", "ovy-panty"],
      },
      {
        id: "pp-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Worth a doctor's check in the next day or two",
        summary:
          "Bleeding that stays red and heavy after the first week, tummy pain that's getting worse, or a sore, swollen stitch or wound should be checked soon. Most of the time it's easily sorted.",
        oftenLinkedTo: [
          "The womb shrinking back more slowly than usual",
          "A small piece of placenta left inside",
          "A stitch or wound that is healing slowly or has become infected",
        ],
        whatHelps: [
          "Call your doctor or maternity unit and describe the bleeding",
          "Note how many pads you use a day, and the colour",
          "Keep stitches clean and dry; rinse with plain warm water after using the toilet and pat dry",
          "Rest as much as you can, and ask family to help with the baby",
        ],
        seeDoctor:
          "See a doctor within a day or two, and the same day if a fever starts or the bleeding gets heavier.",
        products: ["ovy-pads", "ovy-panty"],
      },
      {
        id: "pp-lingering",
        match: { answers: { bleeding: ["easing"], weeks: ["w6-12", "w12"] } },
        urgency: "checkup",
        title: "Bleeding that's still going after 6 weeks is worth a check",
        summary:
          "Bleeding after birth usually settles within about 6 weeks, with traces for up to 8. Light bleeding or spotting that carries on beyond that is worth a routine check. It may simply be your first period, or the womb taking longer to settle.",
        oftenLinkedTo: [
          "The first period coming back",
          "The womb lining taking longer to settle",
          "Hormonal contraception started after the birth, which often causes spotting",
          "A small piece of placenta left inside, which a scan can check",
        ],
        whatHelps: [
          "Mention it at your postnatal check, or book a visit",
          "Note the dates and colour in the free [period tracker](/period-log)",
          "Keep using pads until it's down to the lightest spotting",
        ],
        seeDoctor:
          "Book a routine visit, and go sooner if it gets heavier, smells bad or comes with a fever.",
        products: ["ovy-pads", "period-tracker"],
      },
      {
        id: "pp-periods-bf",
        match: { answers: { bleeding: ["stopped"], feeding: ["full"] } },
        urgency: "selfcare",
        title: "Breastfeeding can keep periods away for months",
        summary:
          "When you are only breastfeeding, it's normal for periods to stay away for months, sometimes longer. But **you can ovulate before the first period comes**, so pregnancy is possible before you ever see a period.",
        oftenLinkedTo: [
          "The breastfeeding hormone prolactin, which holds back ovulation",
          "Frequent day and night feeds, which keep periods away for longer",
          "Periods often returning once feeds drop or the baby starts solids",
        ],
        whatHelps: [
          "Talk to your doctor about contraception from 3 weeks after the birth; breastfeeding alone is only reliable under strict conditions",
          "Keep a few XL+ pads or period panties ready, as the first periods can be heavier or irregular",
          "Log the first period in the free [period tracker](/period-log)",
        ],
        seeDoctor:
          "See a doctor for contraception advice, or if bleeding comes back very heavy or with a fever.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "pp-periods",
        match: { answers: { bleeding: ["stopped"] } },
        urgency: "selfcare",
        title: "When periods come back after birth",
        summary:
          "Without breastfeeding, periods often come back around 6 to 8 weeks after the birth, sometimes later; mixed feeding can delay them a little. The first few can be heavier, longer or irregular, and they settle over a few cycles.",
        oftenLinkedTo: [
          "Hormones resetting after pregnancy",
          "Breastfeeding, even partly, which can delay periods",
          "Stress and broken sleep, which can make cycles irregular",
        ],
        whatHelps: [
          "Ovulation comes before the first period, so talk to your doctor about contraception from 3 weeks after the birth",
          "Keep XL+ pads or period panties ready for heavier first periods",
          "Track your cycles in the free [period tracker](/period-log)",
        ],
        seeDoctor:
          "See a doctor if a period soaks a pad in under 2 hours for several hours, lasts more than 7 days, or periods don't return within a few months of stopping breastfeeding.",
        products: ["ovy-pads", "ovy-panty", "period-tracker"],
      },
      {
        id: "pp-normal",
        urgency: "selfcare",
        title: "This sounds like normal bleeding after birth",
        summary:
          "Bleeding after birth (lochia) is heaviest in the first few days, with small clots, then turns pinkish brown and finally creamy or yellowish. It usually lasts up to 6 weeks, sometimes a little longer.",
        oftenLinkedTo: [
          "The womb shedding its lining and shrinking back to size",
          "More cramping and flow while breastfeeding, which is normal",
          "A small gush when you stand up after resting, which is normal",
        ],
        whatHelps: [
          "Use XL+ pads or period panties, changing every 2 to 4 hours early on",
          "Avoid liners, tampons and cups until your doctor says it's fine",
          "Rinse with plain warm water and pat dry, especially with stitches",
          "Rest, eat iron-rich food and drink plenty of fluids",
        ],
        seeDoctor:
          "Get help the same day if a pad soaks in an hour, clots are bigger than a golf ball, or there is a fever, a bad smell or faintness.",
        products: ["ovy-pads", "ovy-panty"],
      },
    ],
    sources: [
      { label: "Cleveland Clinic: Lochia (postpartum bleeding)", url: "https://my.clevelandclinic.org/health/body/22485-lochia" },
      { label: "Cleveland Clinic: Postpartum hemorrhage", url: "https://my.clevelandclinic.org/health/diseases/22228-postpartum-hemorrhage" },
      { label: "North Bristol NHS Trust: Post-birth contraception", url: "https://www.nbt.nhs.uk/maternity-services/after-birth/post-birth-contraception" },
    ],
  },

  // 5. Lower tummy or pelvic pain not during a period
  {
    id: "pelvic-pain",
    title: "Lower tummy or pelvic pain",
    short: "Lower tummy or pelvic pain that isn't period cramps",
    triggers: [
      "pelvic pain",
      "lower abdominal pain",
      "lower tummy pain",
      "pain in lower stomach",
      "pain on one side lower abdomen",
      "right side lower pain",
      "left side lower abdomen pain",
      "ovary pain",
      "pain without periods",
      "pelvic pain not on period",
      "pet ke neeche dard",
      "neeche pet mein dard",
      "pet mein ek side dard",
      "peshab mein jalan aur pet dard",
    ],
    needs: {},
    ageOptions: PERIOD_AGES,
    showIf: { ...FEMALE, ages: PERIOD_AGES },
    notFor:
      "This check-in is written for girls and women, so it doesn't fit the details you gave: for tummy pain in a young child, a boy or a man, see a doctor today if it's severe, getting worse, or comes with fever or vomiting, and call 112 in an emergency.",
    questions: [
      {
        id: "onset",
        text: "How did the pain start?",
        options: [
          { id: "sudden", label: "Suddenly, and it's severe", flag: "red" },
          { id: "worsening", label: "Over a few hours, and it keeps getting worse", flag: "red" },
          { id: "mid", label: "Mild, around the middle of my cycle, for a day or two" },
          { id: "off-on", label: "It comes and goes over days or weeks" },
          { id: "months", label: "On and off for months" },
        ],
      },
      {
        id: "where",
        text: "Where is it worst?",
        options: [
          { id: "one-side", label: "Low on one side" },
          { id: "right", label: "It started near the belly button and moved to the lower right", flag: "red" },
          { id: "middle", label: "Low in the middle, above the pubic bone" },
          { id: "all", label: "All over the lower tummy" },
          { id: "unsure", label: "Hard to say" },
        ],
      },
      {
        id: "pregnant",
        text: "Could you be pregnant?",
        showIf: REPRO,
        options: [
          { id: "yes", label: "Yes, I'm pregnant or had a positive test", flag: "red" },
          { id: "maybe", label: "Maybe: my period is late, or I've had sex without contraception", flag: "red" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "signs",
        text: "Any of these? Pick all that fit.",
        multi: true,
        options: [
          { id: "faint", label: "Feeling faint or dizzy, or pain in the tip of the shoulder", flag: "red" },
          { id: "fever", label: "Fever, chills or vomiting", flag: "red" },
          { id: "bleeding", label: "Unusual vaginal bleeding or discharge", flag: "amber" },
          { id: "pee", label: "Pain or burning when peeing, or peeing often", flag: "amber" },
          { id: "bowel", label: "Bloating, constipation or loose motions" },
          { id: "none", label: "None of these" },
        ],
      },
    ],
    outcomes: [
      {
        id: "pv-emergency-np",
        match: { answers: { onset: ["sudden", "worsening"] }, ages: NO_PREG_AGES },
        urgency: "emergency",
        title: "Severe or worsening pain needs emergency care now",
        summary:
          "Pain that comes on suddenly and severely, or keeps getting worse over a few hours, needs checking at a hospital now. **Please call 112 or go to the nearest emergency department, and don't drive yourself.**",
        oftenLinkedTo: [
          "An ovary twisting, or a cyst bursting, which often causes sudden pain on one side",
          "Appendicitis, which often starts near the belly button and moves to the lower right",
          "A kidney stone or a severe infection",
        ],
        whatHelps: [
          "Call 112, or ask someone to take you to hospital now",
          "Tell the team when the last period was",
          "Lie in whatever position hurts least while you wait",
        ],
        seeDoctor:
          "Now: severe or worsening pain is always one for the emergency department.",
      },
      {
        id: "pv-emergency",
        match: { answers: { onset: ["sudden", "worsening"] } },
        urgency: "emergency",
        title: "Severe or worsening pain needs emergency care now",
        summary:
          "Pain that comes on suddenly and severely, or keeps getting worse over a few hours, needs checking at a hospital now. **Please call 112 or go to the nearest emergency department, and don't drive yourself.**",
        oftenLinkedTo: [
          "An ovary twisting, or a cyst bursting, which often causes sudden pain on one side",
          "Appendicitis, which often starts near the belly button and moves to the lower right",
          "A pregnancy growing outside the womb, if pregnancy is possible",
          "A kidney stone or a severe infection",
        ],
        whatHelps: [
          "Call 112, or ask someone to take you to hospital now",
          "Tell the team if your period is late or pregnancy is possible",
          "Lie in whatever position hurts least while you wait",
        ],
        seeDoctor: "Now: severe or worsening pain is always one for the emergency department.",
      },
      {
        id: "pv-faint-np",
        match: { answers: { signs: ["faint"] }, ages: NO_PREG_AGES },
        urgency: "emergency",
        title: "Pain with fainting or shoulder tip pain needs care now",
        summary:
          "Feeling faint or dizzy with tummy pain, or an odd pain where the shoulder meets the arm, can be a sign of bleeding inside the tummy. **Please call 112 or go to the nearest emergency department now.**",
        oftenLinkedTo: [
          "A cyst that has burst and is bleeding",
          "Heavy blood loss from another cause",
          "A severe infection or another tummy problem a doctor needs to find",
        ],
        whatHelps: [
          "Call 112 now, and don't drive yourself",
          "Lie down with your legs raised while you wait",
          "Tell the team when the last period was",
        ],
        seeDoctor:
          "Now: this needs emergency care.",
      },
      {
        id: "pv-faint",
        match: { answers: { signs: ["faint"] } },
        urgency: "emergency",
        title: "Pain with fainting or shoulder tip pain needs care now",
        summary:
          "Feeling faint or dizzy with tummy pain, or an odd pain where the shoulder meets the arm, can be a sign of bleeding inside the tummy. **Please call 112 or go to the nearest emergency department now.**",
        oftenLinkedTo: [
          "A pregnancy growing outside the womb, sometimes before a positive test",
          "A cyst that has burst and is bleeding",
          "Heavy blood loss from another cause",
        ],
        whatHelps: [
          "Call 112 now, and don't drive yourself",
          "Lie down with your legs raised while you wait",
          "Tell the team if your period is late or pregnancy is possible",
        ],
        seeDoctor: "Now: this needs emergency care.",
      },
      {
        id: "pv-pregnant",
        match: { answers: { pregnant: ["yes", "maybe"] } },
        urgency: "soon",
        title: "Pain when you might be pregnant needs checking today",
        summary:
          "Tummy pain in early pregnancy is often harmless, but it needs checking today, because rarely it is linked to a pregnancy growing outside the womb. If your period is late, do a home pregnancy test, and get checked whatever the result if the pain carries on.",
        oftenLinkedTo: [
          "Normal stretching and cramping as the womb grows",
          "A urine infection, which is more common in pregnancy",
          "Constipation, which is very common in pregnancy",
          "Rarely, an ectopic pregnancy, usually between 4 and 12 weeks",
        ],
        whatHelps: [
          "Call your doctor or go to a hospital today",
          "Do a home pregnancy test if not done already",
          "Go to emergency straight away if the pain becomes severe, you bleed, feel faint, or get shoulder tip pain",
        ],
        seeDoctor:
          "Today: any pelvic pain with a possible or confirmed pregnancy should be checked the same day.",
      },
      {
        id: "pv-today-young",
        match: { flag: "red", ages: ["u13", "13-17"] },
        urgency: "soon",
        title: "This kind of pain needs a doctor today",
        summary:
          "Tummy pain with fever, chills or vomiting, or pain that has moved to the lower right side, needs a doctor today. In children and teens this is often linked to appendicitis or an infection, which are very treatable when caught early.",
        oftenLinkedTo: [
          "Appendicitis, especially pain that has moved to the lower right",
          "A urine or kidney infection, especially with back or side pain",
          "A stomach infection",
          "An ovarian cyst",
        ],
        whatHelps: [
          "See a doctor today, or go to emergency if it's late at night",
          "Small sips of water and rest, and no food until a doctor has checked if appendicitis is possible",
          "Go to emergency straight away if the pain gets severe, or there is fainting or confusion",
        ],
        seeDoctor:
          "Today: fever with tummy pain, or pain that has moved to the lower right, needs prompt checking.",
      },
      {
        id: "pv-today",
        match: { flag: "red" },
        urgency: "soon",
        title: "This kind of pain needs a doctor today",
        summary:
          "Pelvic pain with fever, chills or vomiting, or pain that has moved to the lower right side, needs a doctor today. These are often linked to infections or appendicitis, which are very treatable when caught early.",
        oftenLinkedTo: [
          "An infection of the womb, tubes or ovaries (pelvic inflammatory disease)",
          "A kidney infection, especially with back or side pain",
          "Appendicitis, especially pain that has moved to the lower right",
          "A stomach infection",
        ],
        whatHelps: [
          "See a doctor today, or go to emergency if it's late at night",
          "Take small sips of water and rest",
          "Go to emergency straight away if the pain gets severe, or you feel faint or confused",
        ],
        seeDoctor:
          "Today: fever with pelvic pain, or pain that has moved to the lower right, needs prompt checking.",
      },
      {
        id: "pv-amber-young",
        match: { flag: "amber", ages: ["u13", "13-17"] },
        urgency: "soon",
        title: "Worth seeing a doctor in the next day or two",
        summary:
          "Tummy pain with burning when peeing, or with unusual bleeding or discharge, is often linked to a urine infection or irritation, which is common and easy to treat once a doctor has checked.",
        oftenLinkedTo: [
          "A urine infection (UTI)",
          "Constipation, which often causes lower tummy pain in children and teens",
          "Irritation or an infection that a doctor can check with a simple test",
          "Hormones settling in the first years of periods",
        ],
        whatHelps: [
          "Drink plenty of water and don't hold pee in, even at school",
          "Wash the outside with plain warm water only, with no scented soaps or washes",
          "A parent or trusted adult can go along to the doctor",
          "Go the same day if a fever or back pain starts, or the pain gets worse",
        ],
        seeDoctor:
          "See a doctor within a day or two for a urine test, and sooner with fever or back pain.",
      },
      {
        id: "pv-amber",
        match: { flag: "amber" },
        urgency: "soon",
        title: "Worth seeing a doctor in the next day or two",
        summary:
          "Pelvic pain with burning when you pee, or with unusual bleeding or discharge, is often linked to an infection. These are common and easily treated, but each needs the right treatment from a doctor, and guessing rarely helps.",
        oftenLinkedTo: [
          "A urine infection (UTI)",
          "A vaginal infection, or another infection a swab can check",
          "Pelvic inflammatory disease, which can follow an infection",
          "Bleeding linked to hormones, fibroids or polyps",
        ],
        whatHelps: [
          "Drink plenty of water and don't hold your pee in",
          "Avoid scented washes, sprays and douching",
          "When travelling, a pee funnel or toilet seat cover means you never have to hold on; these are hygiene products and don't treat or prevent infection",
          "Go the same day if a fever or back pain starts, or the pain gets worse",
        ],
        seeDoctor:
          "See a doctor within a day or two for a urine or swab test, and sooner with fever or back pain.",
        products: ["looway-pee-funnel", "looway-toilet-seat-covers"],
        readMore: [
          { label: "Public toilet hygiene and UTI tips", href: "/blog/public-toilet-hygiene-travel-uti-tips" },
          { label: "White discharge: normal or not?", href: "/blog/white-discharge-normal-or-not" },
        ],
      },
      {
        id: "pv-longterm",
        match: { answers: { onset: ["months"] } },
        urgency: "checkup",
        title: "Pain on and off for months deserves a proper look",
        summary:
          "Pelvic pain that keeps coming back over months is common, and there is usually a treatable reason. It's worth a routine visit rather than putting up with it.",
        oftenLinkedTo: [
          "Endometriosis or adenomyosis, especially if periods are also very painful",
          "Irritable bowel or constipation",
          "Ovarian cysts",
          "Long-term bladder irritation",
        ],
        whatHelps: [
          "Keep a pain diary: when it comes, where, and whether it links to your cycle, food or peeing",
          "Log periods in the free [period tracker](/period-log) to spot any pattern",
          "Heat on the lower tummy and gentle movement often ease it",
          "If you're over 40 and bloating or feeling full quickly keeps happening, mention it to your doctor",
        ],
        seeDoctor:
          "Book a routine visit with a doctor or gynaecologist, sooner if the pain is getting worse or you're losing weight without trying.",
        products: ["period-tracker"],
      },
      {
        id: "pv-mild",
        urgency: "selfcare",
        title: "Mild pain that comes and goes is often harmless",
        summary:
          "Mild lower tummy pain that comes and goes is very common. A one-sided twinge in the middle of your cycle is often ovulation, and gas, constipation or a full bladder can also cause cramps.",
        oftenLinkedTo: [
          "Ovulation pain, a one-sided twinge around the middle of the cycle",
          "Gas, constipation or indigestion",
          "A full or mildly irritated bladder",
          "Muscle strain",
        ],
        whatHelps: [
          "Heat on the lower tummy, rest and gentle walking",
          "Drink plenty of water and eat fibre-rich food like fruit, vegetables and whole grains",
          "Track when it happens in the free [period tracker](/period-log); pain at the same mid-cycle point each month is often ovulation",
          "A pharmacist can advise on pain relief if you need it",
        ],
        seeDoctor:
          "See a doctor if it lasts more than a few days, keeps coming back, or comes with fever, burning when peeing, unusual bleeding, or pain that gets worse.",
        products: ["period-tracker"],
      },
    ],
    sources: [
      { label: "NHS: Pelvic pain", url: "https://www.nhs.uk/conditions/pelvic-pain/" },
      { label: "NHS: Ectopic pregnancy symptoms", url: "https://www.nhs.uk/conditions/ectopic-pregnancy/symptoms/" },
      { label: "NHS: Pelvic inflammatory disease", url: "https://www.nhs.uk/conditions/pelvic-inflammatory-disease-pid/" },
      { label: "NHS: Appendicitis", url: "https://www.nhs.uk/conditions/appendicitis/" },
    ],
  },
];
