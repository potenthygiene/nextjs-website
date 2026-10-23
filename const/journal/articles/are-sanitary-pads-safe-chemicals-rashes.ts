import type { Article } from "../types";

const article: Article = {
  slug: "are-sanitary-pads-safe-chemicals-rashes",
  title: "Are Sanitary Pads Safe? Chemicals, Pad Rash and How to Choose Well",
  seoTitle: "Are Sanitary Pads Safe? Chemicals, Rash and How to Choose",
  description:
    "Are sanitary pads safe? What's inside a pad, what Indian tests found about phthalates, how to soothe pad rash at home, and a checklist for sensitive skin.",
  category: "Period Care",
  tags: ["Sanitary pads", "Pad rash", "Period care", "Sensitive skin", "BIS standards"],
  primaryKeyword: "are sanitary pads safe",
  keywords: [
    "chemicals in sanitary pads",
    "phthalates in pads",
    "pad rash",
    "sanitary pad rash treatment at home",
    "organic sanitary pads",
    "best sanitary pads for sensitive skin",
    "BIS IS 5405",
    "ISI mark sanitary napkins",
    "how often to change pad",
    "toxic chemicals in sanitary napkins",
  ],
  date: "2026-10-05",
  cover: { theme: "ovy", icon: "shield", kicker: "Period Care, Honestly" },
  intro: [
    "Somewhere between a forwarded message about \"toxic pads\" and a rash that flares every monsoon, many of us have started asking a fair question: are sanitary pads safe? You wear one for several days every month, for decades, against some of the most sensitive skin on your body. Wanting to know what is in it is simply good sense.",
    "This guide explains what a pad is made of, what testing has actually found about chemicals in sanitary pads and what it cannot tell you, how to care for pad rash at home, and how to choose a pad for sensitive skin. No scare stories, and no false comfort.",
  ],
  takeaways: [
    "Sanitary pads sold in India must meet the BIS standard IS 5405 and carry the ISI mark.",
    "A 2022 Toxics Link study found phthalates and VOCs in all 10 pads it tested, including the 4 sold as organic.",
    "Research shows these chemicals are present in pads, but it has not shown how much reaches the body in normal use or that pads cause disease.",
    "\"Organic\" describes how part of the material was grown, not its chemical content, and testing has found these chemicals in organic pads too.",
    "Most pad rash comes from heat, moisture and friction, so change every 4 to 6 hours, choose unscented pads and let your skin breathe.",
  ],
  sections: [
    {
      id: "are-sanitary-pads-safe",
      heading: "Are sanitary pads safe to use?",
      blocks: [
        {
          type: "p",
          text: "For most people, yes. Sanitary pads are a safe, practical way to manage a period, and those sold in India must meet a mandatory national standard. But safe does not mean free of every chemical. Testing has found traces of substances such as phthalates in pads, and scientists are still working out what long-term, low-level exposure means.",
        },
        {
          type: "p",
          text: "The everyday risks are more ordinary: wearing one pad too long, fragrance and dyes on sensitive skin, and the heat and friction of an Indian summer. Those you can control from your next period. And because pads sit outside the body, toxic shock concerns linked to tampons are negligible.",
        },
      ],
    },
    {
      id: "what-is-inside-a-sanitary-pad",
      heading: "What is inside a sanitary pad?",
      blocks: [
        {
          type: "p",
          text: "Most disposable pads have four or five layers: a soft top sheet against your skin, a layer that pulls fluid down quickly, an absorbent core of wood pulp, cotton or gel beads, a leak-stopping backsheet, and adhesive strips and wings to hold it in place. Some pads also add fragrance, dyes or lotions.",
        },
        {
          type: "table",
          caption: "The layers of a typical disposable pad",
          head: ["Layer", "What it does", "Common materials"],
          rows: [
            ["Top sheet", "Touches your skin and lets fluid pass through", "Non-woven plastic fibres such as polypropylene, or cotton"],
            ["Acquisition layer", "Pulls fluid down fast so the surface stays dry", "Non-woven fibres"],
            ["Absorbent core", "Holds the fluid and locks it in", "Fluffed wood pulp or cotton, often with super-absorbent polymer (SAP) gel"],
            ["Backsheet", "Stops leaks onto your underwear", "Thin plastic film, ideally breathable"],
            ["Adhesive and wings", "Keep the pad in place", "Hot-melt glue under a peel-off paper strip"],
          ],
        },
        {
          type: "p",
          text: "Phthalates and VOCs are not listed on any pack. Researchers think they come mainly from plastics, glues and fragrances, which is why they turn up in many kinds of pads, whatever the label says.",
        },
      ],
    },
    {
      id: "toxics-link-study",
      heading: "Chemicals in sanitary pads: what the Toxics Link study found",
      blocks: [
        {
          type: "p",
          text: "In November 2022, the Delhi-based environmental group Toxics Link published *Wrapped in Secrecy*, which tested 10 sanitary pads sold in India: 6 conventional and 4 marketed as organic, bought online and in Delhi markets. Every sample tested positive for both phthalates and volatile organic compounds (VOCs).",
        },
        {
          type: "ul",
          items: [
            "**Phthalates** make plastics soft and flexible. Some can interfere with hormones, which is why they are called endocrine disruptors.",
            "**The highest single phthalate level** was in a pad sold as organic, according to the Press Trust of India's report.",
            "**VOCs**, chemicals that evaporate easily, included benzene, toluene and chloroform.",
            "**India had no limits** for these chemicals in pads at the time; the report called for standards and ingredient disclosure.",
          ],
        },
        {
          type: "stats",
          items: [
            { value: "10", label: "sanitary pads tested in India, 4 of them sold as organic", source: "Toxics Link, Wrapped in Secrecy (2022)" },
            { value: "10 of 10", label: "samples that tested positive for both phthalates and VOCs", source: "Toxics Link, Wrapped in Secrecy (2022)" },
          ],
        },
        {
          type: "p",
          text: "The study measured what was in the pads, in a laboratory. It did not measure how much passes into the body during use, or whether women using them had any health effects.",
        },
      ],
    },
    {
      id: "phthalates-in-pads-research",
      heading: "Phthalates in pads: what the research does and does not show",
      blocks: [
        {
          type: "p",
          text: "Research consistently finds phthalates and VOCs in sanitary pads, in India and abroad. It has not shown how much passes into the body through vulval skin in normal use, or that using pads causes any particular disease. That gap is real, and it is why researchers are calling for better testing, clear limits and ingredient disclosure.",
        },
        { type: "h3", text: "What the research shows" },
        {
          type: "ul",
          items: [
            "A 2020 study found phthalates in 98% of 64 sanitary napkins tested in China. It estimated napkins made up about 8.2% of women's total phthalate exposure, with food a bigger source for several phthalates.",
            "A 2020 US study of 79 feminine hygiene products found VOCs across pads, tampons, washes and sprays, with more of some fragrance chemicals in scented products.",
            "In that study, \"organic\", \"natural\" and \"for sensitive skin\" labels did not reliably mean lower VOC levels.",
            "Vulval tissue can absorb some chemicals more readily than ordinary skin, so researchers take this route seriously.",
          ],
        },
        { type: "h3", text: "What the research does not show" },
        {
          type: "ul",
          items: [
            "It does not show that pads cause cancer, infertility or hormone problems in users. Those harms are linked to these chemical groups generally, often at other doses and through other routes.",
            "Exposure from pads has mostly been estimated with models, not measured in real users.",
            "In the US study, estimated risks were low for most products, though a few, including some pads, crossed the guideline levels the authors used.",
          ],
        },
        {
          type: "callout",
          tone: "note",
          title: "Why we are telling you all this",
          text: "We make sanitary pads, and we would rather give you the full picture than a slogan. Testing in India has found these chemicals across the market, including in organic pads, so it is a fair question to ask any brand, us included. If it concerns you, [contact our team](/contact) and ask exactly what our testing covers.",
        },
        {
          type: "p",
          text: "Practically, you cannot see or smell phthalates. What you *can* control is fragrance (a source of VOCs and a common irritant), how long you wear each pad, and whether it carries the ISI mark.",
        },
      ],
    },
    {
      id: "bis-is-5405",
      heading: "BIS IS 5405: the Indian standard every pad must meet",
      blocks: [
        {
          type: "p",
          text: "IS 5405 is the Bureau of Indian Standards (BIS) specification for disposable sanitary pads. Under a government Quality Control Order, pads sold in India must conform to it and carry the ISI mark under a BIS licence. It sets requirements for size, finish, pH, absorbency under pressure and microbial cleanliness.",
        },
        {
          type: "p",
          text: "The 2025 revision also covers panty liners, maternity pads and period panties. Its BIS product manual (July 2025) adds a phthalate test on raw materials and once a year on the finished product. It lists no separate VOC test.",
        },
        {
          type: "p",
          text: "Look for the ISI mark with **IS 5405** and a licence number on the pack; you can check the number on the BIS Care app.",
        },
      ],
    },
    {
      id: "pad-rash-causes",
      heading: "Pad rash: why it happens",
      blocks: [
        {
          type: "p",
          text: "Pad rash is usually contact dermatitis, a skin reaction rather than an infection. Most often it is irritation from trapped heat, moisture and friction against the vulva and inner thighs. Less often it is an allergic reaction to something in the pad, such as fragrance or adhesive. It shows up as soreness, itching, burning or redness.",
        },
        {
          type: "p",
          text: "On brown skin it may look darker or purplish rather than red, so go by how it feels too.",
        },
        {
          type: "ul",
          items: [
            "**Wearing one pad too long**, so a damp surface sits against your skin for hours",
            "**Heat and sweat**: an Indian summer, monsoon humidity, a crowded bus or a long train ride",
            "**Friction** from walking, sport, or a pad that bunches or shifts",
            "**Fragrance and dyes**, the most common triggers for sensitive skin",
            "**Adhesives**, plastic-feel top sheets and non-breathable backsheets",
          ],
        },
        {
          type: "p",
          text: "Freshly shaved or waxed skin reacts more easily. And what feels like a rash can sometimes be an infection, so one that does not settle needs a doctor.",
        },
      ],
    },
    {
      id: "pad-rash-treatment-at-home",
      heading: "Sanitary pad rash treatment at home: 6 simple steps",
      blocks: [
        {
          type: "p",
          text: "For mild pad rash, gentle care usually helps it settle: change pads more often, rinse with plain water, keep the area dry, wear loose cotton and stop using any product that seems to trigger it. Avoid antiseptic liquids and scented washes, which make irritated skin worse. If the rash does not settle, see a doctor.",
        },
        {
          type: "steps",
          items: [
            { title: "Change more often", text: "While the skin is sore, swap your pad every 3 to 4 hours, even if it is not full." },
            { title: "Rinse with plain water", text: "Rinse the outside once or twice a day with plain lukewarm water. No soap, antiseptic liquid or scented wash on the sore area." },
            { title: "Pat, don't rub", text: "Dry gently with a clean, soft towel, or let the area air-dry before you put on fresh underwear." },
            { title: "Let it breathe", text: "Wear loose cotton underwear and loose clothes." },
            { title: "Switch the suspect", text: "If the rash began with a new pad, stop using it. Try an unscented pad in a size that fits without bunching." },
            { title: "Ask before applying anything", text: "Don't put home remedies, powders or creams on sore intimate skin without asking a doctor or pharmacist first." },
          ],
        },
      ],
    },
    {
      id: "best-sanitary-pads-sensitive-skin",
      heading: "How to choose the best sanitary pads for sensitive skin",
      blocks: [
        {
          type: "p",
          text: "Choose an unscented, dye-free pad in the right length for your flow, with soft, breathable layers, from a brand that explains its dermatological testing and carries the ISI mark. Then change it every 4 to 6 hours, because the habit matters as much as the pad.",
        },
        {
          type: "checklist",
          title: "Your pad checklist",
          items: [
            "**Unscented**: no added fragrance or perfume",
            "**No added dyes** or prints on the part that touches you",
            "**The right size** for your flow, with wings that fold fully under",
            "**Soft, breathable layers** that don't feel plasticky",
            "**Dermatologically tested**, with details stated, not just a badge",
            "**ISI mark and IS 5405** printed on the pack",
          ],
        },
        { type: "h3", text: "How often to change a pad" },
        {
          type: "p",
          text: "Every 4 to 6 hours during the day, even on a light day, and sooner if it feels full or damp. Overnight, a longer pad can usually last up to about 8 hours. Go by the clock, not by how the pad looks.",
        },
        {
          type: "p",
          text: "If pads soak through far sooner, note it in our free [period tracker](/period-log) and see the doctor list below.",
        },
        { type: "h3", text: "Are organic sanitary pads better?" },
        {
          type: "p",
          text: "Organic pads use cotton grown without synthetic pesticides for some layers, and many people find them comfortable. But \"organic\" describes how material was grown, not its chemical content: testing has found phthalates and VOCs in organic pads too. Choose them for comfort, not as a safety guarantee.",
        },
        {
          type: "product",
          product: "ovy-pads",
          note: "Ovy pads are dermatologically tested and were clinically tested on 24 volunteers, where they were found to be non-irritant; that is what the testing showed, and no test can promise how your own skin will react.",
        },
      ],
    },
    {
      id: "when-to-see-a-doctor",
      heading: "When to see a doctor about pad rash",
      blocks: [
        {
          type: "p",
          text: "See a doctor if a rash does not improve after a few days of gentle care, comes back every period, or brings blisters, open sores, swelling, pus or a fever. Itching with unusual discharge, a strong smell or burning when you pee also needs checking, as those can point to an infection. Our [white discharge guide](/blog/white-discharge-normal-or-not) explains what is normal.",
        },
        {
          type: "callout",
          tone: "doctor",
          title: "When to see a doctor",
          text: "Periods are normal, but these signs are worth getting checked.",
        },
        {
          type: "ol",
          items: [
            "**Very heavy bleeding**: soaking through an XL+ pad (or a period panty) in under 2 hours for several hours in a row, or passing **clots bigger than a ₹5 coin**.",
            "**Periods that last longer than 7 days**, or that come **less than 21 or more than 35 days apart** once your cycle has settled.",
            "**Severe period pain** that stops you from your day, or that doesn't ease with the usual measures.",
            "**Bleeding between periods, after sex, or ANY bleeding after menopause.**",
            "**Periods that stop for 3 months or more** when you are not pregnant.",
            "**Signs of infection**: unusual discharge, a strong smell, itching, or burning when you pee.",
            "**After childbirth**: a fever, foul-smelling discharge, or very heavy bleeding that does not ease after the first week.",
            "**No period by age 15, or no signs of puberty by age 13.**",
          ],
        },
        {
          type: "p",
          text: "*This is guidance, not a diagnosis. If something feels off, trust yourself and see a doctor or gynaecologist. Most causes are common and treatable.*",
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Are sanitary pads safe to use every month?",
      a: "For most people, yes, and pads sold in India must meet the BIS standard IS 5405. Testing has found traces of chemicals such as phthalates in pads, but research has not shown that normal use causes disease. Choosing unscented pads and changing every 4 to 6 hours are the most useful things you can do.",
    },
    {
      q: "Do sanitary pads contain harmful chemicals?",
      a: "Studies in India, China and the US have found phthalates and volatile organic compounds in many pads, likely from plastics, adhesives and fragrance. Some can affect hormones at certain doses. Research has not established how much reaches the body in normal use. Avoiding scented pads is one simple way to cut out added fragrance chemicals.",
    },
    {
      q: "Are organic sanitary pads free of chemicals?",
      a: "No pad is free of every chemical, organic or not. The 2022 Toxics Link study found phthalates and VOCs in all four organic pads it tested, and a US study found \"organic\" labels did not reliably mean lower VOC levels. Organic cotton is a fair choice for comfort, not a guarantee of lower chemical levels.",
    },
    {
      q: "How can I treat pad rash at home?",
      a: "Change your pad every 3 to 4 hours while the skin is sore, rinse the outside with plain lukewarm water, pat dry and wear loose cotton. Stop using any pad that seems to trigger it, and skip antiseptic liquids and scented washes. Ask a doctor or pharmacist before applying anything, and see a doctor if it doesn't settle.",
    },
    {
      q: "What is BIS IS 5405?",
      a: "IS 5405 is the Bureau of Indian Standards specification for disposable sanitary pads. Pads sold in India must conform to it and carry the ISI mark under a BIS licence. It covers size, finish, pH, absorbency under pressure and microbial cleanliness, and its 2025 revision adds a phthalate test. Look for the ISI mark and IS 5405 on the pack.",
    },
  ],
  sources: [
    { label: "Toxics Link: Wrapped in Secrecy, Toxic Chemicals in Menstrual Products (2022)", url: "https://toxicslink.org/publications/reports/wrapped-in-secrecy-toxic-chemicals-in-menstrual-products/" },
    { label: "The Tribune (PTI): High amounts of harmful chemicals found in sanitary napkins sold in India, claims study", url: "https://www.tribuneindia.com/news/health/high-amounts-of-harmful-chemicals-found-in-sanitary-napkins-sold-in-india-study-453861/" },
    { label: "Bureau of Indian Standards: Product Manual for IS 5405:2025 (July 2025)", url: "https://www.bis.gov.in/wp-content/uploads/2025/07/Revised-PM-5405-CMD2.pdf" },
    { label: "Gao et al., Feminine hygiene products: a neglected source of phthalate exposure in women, Environmental Science & Technology (2020), via US EPA HERO", url: "https://hero.epa.gov/hero/index.cfm/reference/details/reference_id/5932884" },
    { label: "Lin et al., Volatile organic compounds in feminine hygiene products sold in the US market, Environment International (2020), via NIH PMC", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7958867/" },
    { label: "NHS: Contact dermatitis", url: "https://www.nhs.uk/conditions/contact-dermatitis/" },
  ],
};

export default article;
