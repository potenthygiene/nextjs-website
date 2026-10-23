import type { Article } from "../types";

const article: Article = {
  slug: "pms-vs-pmdd-symptoms-difference",
  title: "PMDD Symptoms vs PMS: How to Tell the Difference and Get Help",
  seoTitle: "PMDD Symptoms vs PMS: Key Differences and Getting Help",
  description:
    "PMDD symptoms go far beyond normal PMS. Learn the difference, why it happens, how to track two cycles and when to see a doctor this World Mental Health Day.",
  category: "Period Care",
  tags: ["PMDD", "PMS", "Mental health", "Mood", "Cycle tracking"],
  primaryKeyword: "PMDD symptoms",
  keywords: [
    "PMS vs PMDD",
    "premenstrual dysphoric disorder",
    "period mood swings",
    "anxiety before period",
    "PMS symptoms",
    "luteal phase",
    "how to track PMS",
    "PMDD treatment",
    "World Mental Health Day",
    "PMDD test",
  ],
  date: "2026-10-08",
  cover: { theme: "ovy", icon: "brain", kicker: "World Mental Health Day" },
  intro: [
    "For two weeks of the month you feel like yourself. Then, a few days before your period, something shifts: you snap at people you love, cry over nothing, or feel a heaviness you cannot explain. If that pattern sounds familiar, you may be looking at **PMDD symptoms**, not ordinary PMS, and the difference matters.",
    "This Saturday, 10 October, is World Mental Health Day, and this year's theme is \"Lived experiences heard: real voices, real change.\" In that spirit, this guide explains PMS vs PMDD in plain language, why it happens, how to track your symptoms, what genuinely helps, and how to get a doctor to take you seriously.",
  ],
  takeaways: [
    "PMDD (premenstrual dysphoric disorder) is a recognised, treatable condition, not bad PMS or a personality flaw.",
    "Both PMS and PMDD happen in the luteal phase and ease once your period starts; PMDD is far more severe and disrupts daily life.",
    "PMDD is linked to an unusual sensitivity to normal hormone changes, so a hormone blood test will not diagnose it.",
    "A daily symptom chart kept for at least two cycles is the most useful thing you can take to a doctor.",
    "If you have thoughts of self-harm, call Tele MANAS on 14416 or go to the nearest emergency department.",
  ],
  sections: [
    {
      id: "pms-vs-pmdd",
      heading: "PMS vs PMDD: what is the difference?",
      blocks: [
        {
          type: "p",
          text: "PMS and PMDD both appear in the luteal phase, the one to two weeks between ovulation and your period, and both ease once bleeding starts. The difference is severity. PMS is uncomfortable but manageable. PMDD brings mood symptoms severe enough to disrupt work, studies, relationships and your sense of who you are.",
        },
        {
          type: "p",
          text: "Because the symptom lists overlap, doctors look at how intense the symptoms are, how much they get in the way, and whether they reliably switch off once your period starts.",
        },
        {
          type: "table",
          caption: "PMS vs PMDD at a glance. Sources: NHS, Cleveland Clinic, US Office on Women's Health.",
          head: ["", "PMS", "PMDD"],
          rows: [
            ["When it starts", "In the week or two before your period", "Usually 10 to 14 days before your period"],
            ["When it eases", "Once your period starts", "Within the first few days of your period"],
            ["Main symptoms", "Bloating, tender breasts, tiredness, cravings, irritability, low mood", "At least one severe mood symptom, such as despair, rage, anxiety or panic, plus physical symptoms"],
            ["Severity", "Uncomfortable but manageable", "Intense and often frightening; can include thoughts of self-harm"],
            ["Impact on daily life", "You can usually carry on with school, work and family", "Disrupts work, studies, friendships, marriage or parenting"],
            ["How common", "Most people who have periods get some symptoms at some point", "Up to about 5% of women of childbearing age"],
          ],
        },
      ],
    },
    {
      id: "pmdd-symptoms",
      heading: "What are PMDD symptoms? Emotional and physical signs",
      blocks: [
        {
          type: "p",
          text: "PMDD symptoms look like PMS turned up several notches, with mood at the centre. Doctors generally look for five or more symptoms in the days before your period, at least one of them emotional, such as deep sadness, anger, anxiety or mood swings, which clear up soon after bleeding begins.",
        },
        { type: "h3", text: "Emotional symptoms" },
        {
          type: "ul",
          items: [
            "Sadness, hopelessness or feeling worthless",
            "Irritability or anger that feels out of proportion, often aimed at the people closest to you",
            "Anxiety, tension or feeling constantly on edge",
            "Panic attacks",
            "Sudden mood swings or tearfulness",
            "Losing interest in things you usually enjoy",
            "Feeling out of control, or finding it hard to concentrate",
          ],
        },
        { type: "h3", text: "Physical symptoms" },
        {
          type: "ul",
          items: [
            "Tiredness and low energy",
            "Sleeping much more or much less than usual",
            "Food cravings or binge eating",
            "Bloating and tender breasts",
            "Headaches, and joint or muscle pain",
          ],
        },
        {
          type: "p",
          text: "The pattern matters more than any single symptom: many people with PMDD feel like themselves for two weeks, like a stranger for one, then real relief once their period arrives.",
        },
        {
          type: "stats",
          items: [
            { value: "5 or more", label: "symptoms, at least one of them mood-related, are usually needed for a PMDD diagnosis", source: "US Office on Women's Health" },
            { value: "Up to 5%", label: "of women of childbearing age are affected by PMDD", source: "US Office on Women's Health" },
            { value: "2 cycles", label: "the minimum the NHS suggests keeping a symptom diary for", source: "NHS" },
          ],
        },
      ],
    },
    {
      id: "why-pmdd-happens",
      heading: "Why does PMDD happen if your hormones are normal?",
      blocks: [
        {
          type: "p",
          text: "PMDD is not caused by a hormone imbalance. Research from the US National Institute of Mental Health suggests that people with PMDD have an unusual sensitivity to the normal rise and fall of hormones after ovulation. Their hormone levels are typically the same as anyone else's; the brain simply reacts to the change more strongly.",
        },
        {
          type: "p",
          text: "After ovulation, progesterone and oestrogen rise and then fall before your period. These hormones interact with brain chemicals such as serotonin, which helps regulate mood. In most people the shift causes mild PMS or nothing at all. In people with PMDD, the same shift sets off a much bigger emotional reaction.",
        },
        {
          type: "p",
          text: "So a routine hormone blood test will not diagnose PMDD, and a normal result does not mean you are imagining it. It is not a character flaw or \"just PMS\". The NHS notes that inherited genetic factors may also play a part.",
        },
        { type: "h3", text: "Could it be something else?" },
        {
          type: "p",
          text: "Depression, anxiety disorders and thyroid problems can cause similar symptoms, and some ongoing conditions get worse before a period. That is why doctors take a full history and may check your thyroid before calling it PMDD. Tracking shows whether your symptoms truly switch on and off with your cycle.",
        },
      ],
    },
    {
      id: "how-to-track-pms",
      heading: "How to track PMS and PMDD symptoms over two cycles",
      blocks: [
        {
          type: "p",
          text: "Track daily for at least two full cycles, rating each symptom on a simple scale and noting your period dates. A written record is the most useful thing you can bring to a doctor, because PMDD is diagnosed from the pattern of your symptoms over time, not from a scan or a blood test.",
        },
        {
          type: "steps",
          items: [
            {
              title: "Mark your period dates",
              text: "Log the first day of each period in our free [period tracker](/period-log), which estimates when your next one is due. That tells you roughly when your premenstrual window starts, so the hard days do not catch you off guard.",
            },
            {
              title: "Pick your symptoms",
              text: "Choose the five to eight that bother you most, such as low mood, irritability, anxiety, sleep, cravings, bloating and headaches. Keep the list the same every day.",
            },
            {
              title: "Rate them every evening",
              text: "Score each one from 0 (none) to 3 (severe). It takes a minute alongside your evening chai, in a notebook or your phone's notes app.",
            },
            {
              title: "Note the impact",
              text: "Write one line about what the day cost you: a missed class, a row at home, a day you could not get out of bed. Doctors want to know about impact, not only feelings.",
            },
            {
              title: "Look for the pattern",
              text: "After two cycles, compare the week before your period with the week after it. PMDD shows a clear rise before bleeding and a clear drop afterwards. Symptoms that stay the same all month point to something else worth discussing.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Fill it in on good days too",
          text: "Zeros matter. The calm days after your period are what make the pattern visible, so complete the chart even when you feel completely fine.",
        },
      ],
    },
    {
      id: "lifestyle-steps",
      heading: "What helps with period mood swings and anxiety before your period?",
      blocks: [
        {
          type: "p",
          text: "Regular exercise, steady sleep, balanced meals and cutting back on caffeine, alcohol, salt and sugar are the first steps most health services suggest. They can ease milder PMS and support you alongside treatment for PMDD. Be realistic, though: for severe PMDD, lifestyle changes alone are rarely enough.",
        },
        {
          type: "table",
          caption: "Evidence levels summarised from NHS and MedlinePlus guidance.",
          head: ["Step", "What it involves", "How strong is the evidence?"],
          rows: [
            ["Regular aerobic exercise", "Brisk walking, cycling, dancing or yoga on most days", "Widely recommended and low risk; helpful for many people, though studies vary in quality"],
            ["A steady sleep routine", "The same bedtime and wake time, screens off earlier", "Advised as a first step when sleep is a problem; low risk and worth doing"],
            ["Smaller, balanced meals", "Whole grains, dal, vegetables and fruit; less salt and sugar", "Recommended by health services; the evidence is modest"],
            ["Less caffeine and alcohol", "Swapping the third cup of chai or coffee for water in the premenstrual week", "Commonly advised and low risk, though not strongly proven for PMDD"],
            ["Talking therapy (CBT)", "A structured course of cognitive behavioural therapy with a trained therapist", "Offered for PMS by the NHS and listed by MedlinePlus as a PMDD treatment, alone or with other care"],
            ["Supplements and herbal products", "Pills and powders sold for \"hormone balance\" or PMS", "Most studies found common nutritional supplements did not relieve PMDD symptoms; ask a doctor before trying any"],
          ],
        },
        {
          type: "p",
          text: "If your chart still shows severe symptoms after two or three cycles of trying these, that is not a failure on your part. It simply tells you and your doctor that more help is needed.",
        },
      ],
    },
    {
      id: "talk-to-a-doctor",
      heading: "How to talk to a doctor about PMDD treatment",
      blocks: [
        {
          type: "p",
          text: "Book an appointment with a gynaecologist, a general physician or a psychiatrist, and bring your symptom chart. Say clearly that the symptoms affect your daily life. PMDD is treatable, and a doctor can talk you through the options, which include talking therapy and medical treatments chosen for your situation.",
        },
        {
          type: "checklist",
          title: "Take this to your appointment",
          items: [
            "Your symptom chart from at least two cycles",
            "Your period dates for the last three to six months",
            "A short list of the hardest moments, such as days missed from work or college",
            "Any medicines, supplements or contraception you use",
            "Your questions, written down, so nerves do not wipe them from your mind",
          ],
        },
        {
          type: "p",
          text: "It helps to open with one clear sentence: \"For about a week before every period, my mood changes so much that I cannot function normally, and I have tracked it for two months.\" That tells the doctor exactly what you need from the visit.",
        },
        {
          type: "callout",
          tone: "doctor",
          title: "When to see a doctor",
          text: "See a doctor if premenstrual mood changes disrupt your work, studies, relationships or care of your children; if lifestyle changes have not helped after a few cycles; if your symptoms never fully clear after your period; or if you also have severe period pain or very heavy bleeding. This is guidance, not a diagnosis.",
        },
      ],
    },
    {
      id: "self-harm-help",
      heading: "What to do if PMDD brings thoughts of self-harm",
      blocks: [
        {
          type: "p",
          text: "If you have thoughts of harming yourself, call Tele MANAS on **14416** or **1-800-891-4416**, India's free, 24-hour government mental health helpline, or go to the nearest emergency department. MedlinePlus notes that PMDD can bring suicidal thoughts, so this is a known part of the condition, not a personal weakness.",
        },
        {
          type: "p",
          text: "Tele MANAS was launched by the Union Health Ministry on 10 October 2022, World Mental Health Day. Counselling is free, in 20 Indian languages, with referral to psychiatrists and psychologists when needed.",
        },
        {
          type: "ul",
          items: [
            "Tell one person you trust what is happening, today, even if it feels awkward.",
            "On a good day, write a short safety plan: who you will call, where you will go, and what helps you get through a bad hour.",
            "Save the helpline number in your phone as a contact, so you do not have to search for it.",
          ],
        },
        {
          type: "callout",
          tone: "warning",
          title: "If you are in immediate danger",
          text: "Go to the nearest hospital emergency department or call **112**. Do not wait for your period to start or for the feeling to pass on its own.",
        },
      ],
    },
    {
      id: "support-someone-with-pmdd",
      heading: "How to support a wife, daughter or friend with PMDD",
      blocks: [
        {
          type: "p",
          text: "Believe her, help her track, and plan around the hard days together. In many Indian homes, premenstrual mood changes are brushed off as moodiness or taken personally by the whole family. Seeing PMDD as a health condition rather than a choice takes a great deal of tension out of home life.",
        },
        {
          type: "ul",
          items: [
            "Do not say \"it is just your hormones\" mid-argument. Raise patterns on a calm day.",
            "Offer to share chores, school runs or cooking in her premenstrual week.",
            "For a teenager, a parent and a doctor should be involved together. Mood changes in teens deserve to be taken seriously.",
            "Learn the warning signs, and save the Tele MANAS number, 14416.",
          ],
        },
        {
          type: "p",
          text: "Premenstrual symptoms can also change in your 40s. Our guide to [perimenopause symptoms and early signs](/blog/perimenopause-symptoms-early-signs) explains why.",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is PMDD a mental health condition or a hormone problem?",
      a: "It sits between the two. Hormone levels in people with PMDD are usually normal; US National Institute of Mental Health research suggests the brain is unusually sensitive to their monthly rise and fall. Because the symptoms are mainly emotional, it is treated as a mental health condition as well as a menstrual one.",
    },
    {
      q: "How do I know if I have PMS or PMDD?",
      a: "Track your symptoms every day for at least two cycles and look at the pattern. Both appear before your period and ease once it starts. If the symptoms are mild and you can carry on with daily life, that is more like PMS. If mood symptoms are severe and disrupt work, studies or relationships, talk to a doctor about PMDD. Only a doctor can make the diagnosis.",
    },
    {
      q: "Why do I get anxiety before my period?",
      a: "Anxiety before a period is a common PMS symptom. After ovulation, oestrogen and progesterone rise and then fall, and these changes interact with brain chemicals such as serotonin that affect mood. For most people the anxiety is manageable. If it becomes intense, includes panic attacks, or stops you functioning every month, it is worth tracking and discussing with a doctor.",
    },
    {
      q: "Can PMDD be treated?",
      a: "Yes. PMDD is treatable, and MedlinePlus notes that with proper diagnosis and treatment, most women find their symptoms resolve or become manageable. A doctor can talk you through the options, which include talking therapy and medical treatments, alongside lifestyle steps such as regular exercise and steady sleep. Do not start any medicine or supplement without a doctor's advice.",
    },
    {
      q: "Who should I see for PMDD in India?",
      a: "A gynaecologist, a general physician or a psychiatrist can all assess premenstrual symptoms, so start with whoever you can see soonest. Bring a symptom chart from at least two cycles and your period dates. If you need to talk to someone first, Tele MANAS on 14416 is free, runs 24 hours and can guide you towards in-person care.",
    },
  ],
  sources: [
    { label: "NHS: Premenstrual syndrome (PMS)", url: "https://www.nhs.uk/conditions/premenstrual-syndrome/" },
    { label: "MedlinePlus (US National Library of Medicine): Premenstrual dysphoric disorder", url: "https://medlineplus.gov/ency/article/007193.htm" },
    { label: "US Office on Women's Health: Premenstrual dysphoric disorder (PMDD)", url: "https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome/premenstrual-dysphoric-disorder-pmdd" },
    { label: "National Institute of Mental Health: Premenstrual dysphoric disorder", url: "https://www.nimh.nih.gov/research/research-conducted-at-nimh/research-areas/clinics-and-labs/sbe/participate-in-research/premenstrual-dysphoric-disorder" },
    { label: "Cleveland Clinic: Premenstrual dysphoric disorder (PMDD)", url: "https://my.clevelandclinic.org/health/diseases/9132-premenstrual-dysphoric-disorder-pmdd" },
    { label: "World Health Organization: World Mental Health Day", url: "https://www.who.int/campaigns/world-mental-health-day" },
    { label: "Press Information Bureau, Government of India: Advancing India's Mental Healthcare and Well-Being (Tele MANAS), February 2026", url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc2026211785801.pdf" },
  ],
};

export default article;
