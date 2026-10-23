import type { Article } from "../types";

const article: Article = {
  slug: "dengue-symptoms-warning-signs-recovery",
  title: "Dengue symptoms: warning signs, platelet count and recovery guide",
  seoTitle: "Dengue Symptoms: Warning Signs, Platelets and Recovery",
  description:
    "Dengue symptoms day by day, the warning signs that mean hospital, what platelet counts really mean, periods during dengue, safe home care and prevention.",
  category: "Seasonal Health",
  tags: ["Dengue", "Monsoon health", "Fever", "Mosquito prevention", "Periods"],
  primaryKeyword: "dengue symptoms",
  keywords: [
    "dengue warning signs",
    "dengue platelet count",
    "dengue recovery diet",
    "dengue fever day by day",
    "dengue test NS1 IgM",
    "dengue and periods",
    "heavy bleeding in dengue",
    "how to prevent dengue at home",
    "Aedes mosquito",
    "papaya leaf for dengue",
  ],
  date: "2026-09-26",
  cover: { theme: "amber", icon: "bug", kicker: "Post-monsoon health" },
  intro: [
    "It starts like any other monsoon fever: a sudden high temperature, a headache that sits behind your eyes, and an ache in your bones bad enough that dengue earned the old name \"breakbone fever\". Knowing the dengue symptoms early, and which ones mean hospital, makes a real difference. In much of India, cases climb through the late monsoon and into October and November, when every cooler, flower pot and forgotten bucket on the terrace can breed mosquitoes.",
    "This guide takes you through dengue fever day by day, the warning signs doctors watch for, which test to ask about, how to care for someone at home, what platelet numbers really mean, what to do if your period comes during dengue, and how to stop mosquitoes breeding in your own home.",
  ],
  takeaways: [
    "Dengue usually starts with a sudden high fever, severe headache, pain behind the eyes, body aches, nausea and sometimes a rash.",
    "The riskiest time is often when the fever falls, around day 3 to 7, so keep watching closely for at least two days after the fever breaks.",
    "Severe tummy pain, repeated vomiting, bleeding gums or nose, blood in vomit or stool, restlessness or fast breathing mean go to hospital straight away.",
    "WHO and India's NCVBDC warn against aspirin and ibuprofen-type painkillers in dengue, so take only what a doctor advises.",
    "Aedes mosquitoes bite in the daytime and breed in clean standing water, so a weekly check of coolers, pots and tyres is your best defence.",
  ],
  sections: [
    {
      id: "early-dengue-symptoms",
      heading: "What are the early symptoms of dengue?",
      blocks: [
        {
          type: "p",
          text: "The most common dengue symptoms are a sudden high fever (often around 40°C), a severe headache, pain behind the eyes, muscle and joint aches, nausea, vomiting, swollen glands and a rash. According to WHO, symptoms usually begin 4 to 10 days after an infected mosquito bite and last 2 to 7 days.",
        },
        {
          type: "p",
          text: "Many people, especially children, have a mild illness or no symptoms at all. Some adults, India's dengue guidelines note, get severe bone pain.",
        },
        {
          type: "p",
          text: "You can't tell dengue from malaria, chikungunya or typhoid by looking, so a fever in dengue season deserves a blood test, not a guess.",
        },
      ],
    },
    {
      id: "dengue-fever-day-by-day",
      heading: "Dengue fever day by day: the three phases",
      blocks: [
        {
          type: "p",
          text: "Dengue usually moves through three phases. The febrile phase brings high fever for 2 to 7 days. The critical phase often starts around day 3 to 7, just as the fever falls, and lasts about 24 to 48 hours. The recovery phase follows, as the body reabsorbs leaked fluid and platelets climb back.",
        },
        {
          type: "p",
          text: "The trap is the middle phase. The fever goes, the family relaxes, and that is when plasma (the liquid part of blood) can leak from blood vessels. CDC notes that patients can look well even as shock builds.",
        },
        {
          type: "table",
          caption: "Timings vary from person to person. Based on CDC and NCVBDC guidance.",
          head: ["Phase", "Roughly when", "What you may notice", "What to do"],
          rows: [
            [
              "Febrile",
              "From day 1, fever lasting 2 to 7 days",
              "Sudden high fever, headache, pain behind the eyes, body ache, flushed face, nausea",
              "See a doctor, get tested, rest and drink plenty of fluids",
            ],
            [
              "Critical",
              "Around days 3 to 7, as the fever falls, for 24 to 48 hours",
              "The fever drops but you may feel worse; warning signs can appear within hours",
              "Watch closely for at least two days after the fever breaks; go to hospital at any warning sign",
            ],
            [
              "Recovery",
              "After the critical phase",
              "Appetite returns, you pass more urine, platelets rise, sometimes a rash",
              "Keep eating and drinking well, rest, and repeat blood tests if your doctor asks",
            ],
          ],
        },
        {
          type: "p",
          text: "India's National Center for Vector Borne Diseases Control (NCVBDC) puts it plainly: complications usually appear between the third and fifth day of illness, so keep watching the patient for two days even after the fever has gone.",
        },
      ],
    },
    {
      id: "dengue-warning-signs",
      heading: "Dengue warning signs that need a hospital now",
      blocks: [
        {
          type: "p",
          text: "Dengue warning signs include severe tummy pain, vomiting that won't stop, bleeding gums or nose, blood in vomit or stool, fast breathing, restlessness, intense thirst, pale cold skin and extreme weakness. WHO says anyone with these signs should seek care immediately. They often appear after the fever has already gone.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Go to hospital straight away if you notice",
          text: "Severe tummy pain or tenderness; vomiting again and again; bleeding from the gums or nose; blood in vomit, or black or bloody stools; fast or difficult breathing; restlessness or unusual sleepiness; signs of fluid build-up such as a swollen belly; pale, cold or clammy skin; excessive thirst or a very dry mouth. **Do not wait to see if it settles.**",
        },
        {
          type: "p",
          text: "For children, NCVBDC adds red spots on the skin and constant crying to the list.",
        },
        {
          type: "callout",
          tone: "doctor",
          title: "When to see a doctor",
          text: "See a doctor within a day for any fever during dengue season, especially with headache, body ache or a rash. Go sooner if the person is pregnant, a baby or an older adult, or lives with a long-term condition such as diabetes, heart or kidney disease. If you've had dengue before, mention it: WHO notes a second infection raises the risk of severe dengue.",
        },
      ],
    },
    {
      id: "dengue-test-ns1-igm",
      heading: "Which dengue test do you need: NS1 or IgM?",
      blocks: [
        {
          type: "p",
          text: "The right dengue test depends on the day of illness. NS1 antigen and PCR tests pick up the virus itself and work best in the first 7 days of symptoms. IgM antibody tests detect your body's response, become useful from about day 3, and are the main test after day 7, according to CDC.",
        },
        {
          type: "p",
          text: "So a negative NS1 late in the illness, or a negative IgM on day 1, doesn't always rule dengue out. Your doctor will choose the test.",
        },
        {
          type: "p",
          text: "Alongside it, most doctors order a complete blood count. This tracks your platelets and your haematocrit (how concentrated your blood is). India's dengue guidelines treat a falling platelet count together with a rising haematocrit as an early sign of trouble, which is why you may be asked for repeat tests.",
        },
      ],
    },
    {
      id: "dengue-care-at-home",
      heading: "How to care for dengue at home",
      blocks: [
        {
          type: "p",
          text: "Most people with dengue recover at home with rest, plenty of fluids and close watching. WHO says there is no specific treatment for dengue, so care is about keeping the body hydrated and spotting warning signs early. Never self-medicate, and take only the medicines your doctor advises for fever and pain.",
        },
        {
          type: "callout",
          tone: "warning",
          title: "Avoid aspirin and ibuprofen-type painkillers",
          text: "WHO advises avoiding non-steroidal anti-inflammatory drugs (NSAIDs) such as ibuprofen and aspirin in dengue because they can increase the risk of bleeding, and India's NCVBDC guidelines say the same. Some pain and cold combination tablets contain them, so check with your doctor or pharmacist before taking anything, even a medicine already in the house.",
        },
        {
          type: "steps",
          items: [
            {
              title: "Drink steadily through the day",
              text: "NCVBDC advises large amounts of fluids, such as water, soup, milk and juice, alongside a normal diet. Nariyal pani, dal water, thin chaas and nimbu pani all count. Small sips often are easier than big glasses if you feel sick.",
            },
            {
              title: "Rest properly",
              text: "Complete rest is part of the official advice. Skip office, school, the gym and housework until your doctor says it's safe.",
            },
            {
              title: "Keep a simple log",
              text: "Note the temperature, fluids drunk, how often urine is passed, and any vomiting or bleeding. It helps you spot changes early.",
            },
            {
              title: "Sleep under a net",
              text: "Put the patient under a mosquito net, even in the daytime. A mosquito that bites someone with dengue can pass the virus on to the rest of the family.",
            },
          ],
        },
      ],
    },
    {
      id: "dengue-platelet-count",
      heading: "Dengue platelet count: what the number really means",
      blocks: [
        {
          type: "p",
          text: "A falling dengue platelet count is common, and platelets usually recover on their own in the recovery phase. Doctors don't judge danger on the platelet number alone. They look at the trend, the haematocrit, your fluid levels and warning signs together. CDC advises against routine preventive platelet transfusions.",
        },
        {
          type: "p",
          text: "So don't panic at a low number or push for a transfusion. Platelets are given when a doctor sees a specific need, such as serious bleeding, not simply because the report has dropped.",
        },
        { type: "h3", text: "Does papaya leaf juice increase platelets?" },
        {
          type: "p",
          text: "Papaya leaf is the most forwarded dengue remedy on WhatsApp, and the honest answer is that the evidence is limited. A 2019 systematic review found nine small trials, six from India. Most showed platelets rising faster, but the authors rated them low to moderate quality with a high risk of bias.",
        },
        {
          type: "p",
          text: "None of them checked whether papaya leaf prevents what actually makes dengue dangerous: plasma leakage, severe bleeding or death, and safety wasn't established. If you want to try it, tell your doctor first, and never let it replace fluids, monitoring or a hospital visit.",
        },
      ],
    },
    {
      id: "dengue-and-periods",
      heading: "Can dengue make your period heavier?",
      blocks: [
        {
          type: "p",
          text: "It can. Low platelets slow clotting, so a period that arrives during dengue may be heavier, longer or more clotted than usual. CDC lists heavy menstrual bleeding among the serious bleeding signs in dengue, so heavier or unexpected bleeding during dengue always needs a doctor's attention, the same day.",
        },
        {
          type: "p",
          text: "Tell your doctor straight away if, while you have dengue or are recovering, you soak through an XL+ pad in under 2 hours, pass large clots, get a period much earlier than expected, or bleed when it isn't your period at all. **Bleeding between periods is a see-a-doctor sign at any time, and during dengue it is urgent.**",
        },
        {
          type: "p",
          text: "Count how many pads you use and how soaked they are, and note the dates in a [period tracker](/period-log). \"One soaked pad every hour since morning\" helps a doctor far more than \"a lot\". A longer pad such as an [XL+](/product-detail/ovy-pads) keeps you more comfortable on heavy days, but it is never a substitute for being seen.",
        },
      ],
    },
    {
      id: "dengue-recovery-diet",
      heading: "Dengue recovery diet: what to eat as you get better",
      blocks: [
        {
          type: "p",
          text: "A good dengue recovery diet is simple, soft and full of fluid: khichdi, dal, curd rice, soups, idli, fruit and plenty to drink. No special menu cures dengue. The aim is to replace the fluid and energy the fever burned through, and to eat enough protein to rebuild your strength.",
        },
        {
          type: "ul",
          items: [
            "**Fluids first:** water, nariyal pani, soups, chaas, nimbu pani and milk, little and often.",
            "**Easy energy:** khichdi, dalia, poha, idli, rice with dal, boiled potatoes.",
            "**Protein to rebuild:** dal, curd, paneer, and eggs, fish or chicken if you eat them.",
          ],
        },
        {
          type: "p",
          text: "Recovery can take longer than the fever: India's dengue guidelines note that some adults feel tired and low for a while afterwards. Return to work, school and exercise gradually, and see your doctor if exhaustion or low mood drags on for weeks.",
        },
      ],
    },
    {
      id: "how-to-prevent-dengue-at-home",
      heading: "How to prevent dengue at home",
      blocks: [
        {
          type: "p",
          text: "To prevent dengue at home, stop Aedes mosquitoes breeding and stop them biting. The Aedes mosquito breeds in clean, still water in containers and bites mainly during the day. WHO advises covering, emptying and cleaning water containers every week, wearing clothes that cover your skin, and using repellents.",
        },
        {
          type: "checklist",
          title: "Your weekly dengue check",
          items: [
            "Empty and scrub the desert cooler tank, then dry it or refill it with fresh water.",
            "Empty the saucers under flower pots, and change the water in vases and money plant bottles.",
            "Check the terrace and balcony for old tyres, buckets, coconut shells, broken pots and plastic that can hold rainwater.",
            "Make sure overhead tanks, drums and matkas have tight lids.",
            "Empty the drip tray behind the fridge and refresh pet and bird water bowls.",
            "Report standing water in gutters or construction pits nearby to your municipal body.",
          ],
        },
        { type: "h3", text: "How to protect yourself from bites" },
        {
          type: "ul",
          items: [
            "Wear long sleeves and full-length trousers or a salwar during the day, when Aedes mosquitoes bite.",
            "Use a repellent containing DEET, picaridin or IR3535 on exposed skin, following the label, especially for children.",
            "Fit mesh screens on windows, and use a net for anyone who naps in the daytime, including babies and patients.",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How many days does dengue fever last?",
      a: "Dengue fever usually lasts 2 to 7 days. The fever often breaks around day 3 to 7, and that is when the critical phase can begin, lasting about 24 to 48 hours. After that, most people move into recovery, though tiredness can linger for weeks. Keep watching closely for two days after the fever goes, because that is when warning signs often appear.",
    },
    {
      q: "What platelet count is dangerous in dengue?",
      a: "No single number decides on its own. Doctors look at how fast platelets are falling, whether haematocrit is rising, and whether there are warning signs such as bleeding, severe tummy pain or repeated vomiting. Many people recover with low platelets and no transfusion. CDC advises against routine preventive platelet transfusions, so follow your doctor's judgement rather than the number alone.",
    },
    {
      q: "Which painkiller is safe in dengue?",
      a: "Take only what your doctor advises. WHO and India's NCVBDC warn against aspirin and ibuprofen-type painkillers (NSAIDs) in dengue because they can increase the risk of bleeding. Some pain and cold combination tablets contain these, so check with a doctor or pharmacist before taking anything from the medicine box, even something you have used safely before.",
    },
    {
      q: "Is dengue contagious from person to person?",
      a: "No. Dengue doesn't spread through touch, coughing or sharing food. It spreads when an Aedes mosquito bites an infected person and then bites someone else. That is why a patient should rest under a mosquito net, even during the day, and why clearing standing water around your home protects everyone in the family.",
    },
    {
      q: "Can dengue affect my periods?",
      a: "It can. Low platelets mean blood clots more slowly, so a period during dengue may be heavier or longer than usual, and some women bleed unexpectedly. CDC counts heavy menstrual bleeding among the serious bleeding signs in dengue. Tell your doctor the same day if you are soaking through a pad in under 2 hours, passing large clots, or bleeding when it isn't your period.",
    },
  ],
  sources: [
    {
      label: "World Health Organization: Dengue and severe dengue fact sheet",
      url: "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue",
    },
    {
      label: "NCVBDC, Ministry of Health and Family Welfare: Do's and don'ts for managing dengue fever",
      url: "https://ncvbdc.mohfw.gov.in/WriteReadData/l892s/guidelines%20for%20treatment%20of%20Dengue.pdf",
    },
    {
      label: "CDC: Clinical features of dengue",
      url: "https://www.cdc.gov/dengue/hcp/clinical-signs/index.html",
    },
    {
      label: "CDC: Clinical testing guidance for dengue",
      url: "https://www.cdc.gov/dengue/hcp/diagnosis-testing/index.html",
    },
    {
      label: "CDC: Clinical care of dengue",
      url: "https://www.cdc.gov/dengue/hcp/clinical-care/index.html",
    },
    {
      label: "Rajapakse et al. (2019): Carica papaya extract in dengue, a systematic review and meta-analysis (NIH PubMed Central)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6788024/",
    },
  ],
};

export default article;
