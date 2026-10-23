import type { Finder, FinderPick, FinderResult } from "./finders";
import type { ProductKey } from "./symptomTypes";

// Rule-based planners and quizzes for the chat, with no AI behind them.
// The trip planner covers what the old Travel Architect prototype asked;
// the others come from the Wellness Hub prototype, kept general and safe:
// no diagnosis, no medicine names, and a see-a-doctor line in every result.

export type Tool = Finder & { short: string; page?: { label: string; href: string } };

type A = Record<string, string[]>;
const has = (a: A, step: string, id: string) => (a[step] || []).includes(id);
const any = (a: A, step: string, ids: string[]) => ids.some((id) => has(a, step, id));
const one = (a: A, step: string, fallback: string) => a[step]?.[0] || fallback;

/** Adds a pick once per product, keeping the first reason. */
const add = (picks: FinderPick[], product: ProductKey, why: string, size?: string) => {
  if (!picks.some((p) => p.product === product)) picks.push(size ? { product, why, size } : { product, why });
};

const L = "L (240mm)";
const XL = "XL (280mm)";
const XLP = "XL+ (320mm)";
const MIX = "Mix Your Box (L, XL and XL+)";

const TRACKER_LINK = { label: "Open the Period Tracker", href: "/period-log" };

// ---------------------------------------------------------------- Trip planner

const KIT_WHY: Record<string, string> = {
  "Pregnancy Travel": "Start from the Pregnancy Travel kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  "Toddler Travel": "Start from the Toddler Travel kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  "Teerth Yatra": "Start from the Teerth Yatra kit, made for pilgrimages, and edit it to fit. Every kit comes with free intimate wipes.",
  "Sports & Adventure": "Start from the Sports & Adventure kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  "Working Woman": "Start from the Working Woman kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  "Boys' Trip": "Start from the Boys' Trip kit: seat covers and bags, no women's items, plus free intimate wipes.",
  "Girls' Trip": "Start from the Girls' Trip kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  Family: "Start from the Family kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  Weekender: "Start from the Weekender kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.",
  Complete: "Start from the Complete kit, which covers every toilet situation, and edit it to fit. Every kit comes with free intimate wipes.",
};

const tripPlanner: Tool = {
  id: "trip-planner",
  title: "Plan my trip hygiene",
  short: "Trip hygiene planner",
  page: { label: "Build a Yatra Kit", href: "/looway-yatra-kit" },
  steps: [
    {
      id: "trip",
      text: "What kind of trip is it?",
      options: [
        { id: "holiday", label: "Holiday or sightseeing" },
        { id: "pilgrimage", label: "Pilgrimage or yatra" },
        { id: "trek", label: "Trek, camping or adventure" },
        { id: "road", label: "Long road trip" },
        { id: "wedding", label: "Wedding, festival or big event" },
        { id: "work", label: "Work trip" },
        { id: "family", label: "Visiting family" },
        { id: "school", label: "School or college trip" },
        { id: "daily", label: "Daily commute, office or college" },
      ],
    },
    {
      id: "travel",
      text: "How are you getting there? Pick all that apply.",
      multi: true,
      options: [
        { id: "train", label: "Train" },
        { id: "bus", label: "Bus" },
        { id: "car", label: "Car or cab" },
        { id: "flight", label: "Flight" },
        { id: "foot", label: "On foot or trekking" },
        { id: "boat", label: "Boat or ferry" },
      ],
    },
    {
      id: "who",
      text: "Who's travelling, including you? Pick all that apply.",
      multi: true,
      options: [
        { id: "women", label: "Women" },
        { id: "teen", label: "Teenage girls" },
        { id: "men", label: "Men or boys" },
        { id: "kids", label: "Children (5 to 12)" },
        { id: "toddler", label: "Toddlers or babies" },
        { id: "elderly", label: "Elderly parents" },
        { id: "pregnant", label: "Someone pregnant" },
      ],
    },
    {
      id: "length",
      text: "How long is the trip?",
      options: [
        { id: "day", label: "A day or one night" },
        { id: "few", label: "2 to 4 days" },
        { id: "week", label: "5 to 7 days" },
        { id: "long", label: "More than a week" },
      ],
    },
    {
      id: "toilets",
      text: "What toilets do you expect on the way? Pick all that apply.",
      multi: true,
      options: [
        { id: "clean", label: "Clean Western toilets (hotels, airports)" },
        { id: "public", label: "Public or station toilets, hit or miss" },
        { id: "highway", label: "Highway dhabas and petrol pumps" },
        { id: "squat", label: "Squat toilets" },
        { id: "onboard", label: "Toilets on the train, bus, plane or boat" },
        { id: "notoilet", label: "No toilet for long stretches" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "place",
      text: "What are the place and weather like? Pick all that apply.",
      multi: true,
      options: [
        { id: "hills", label: "Hills, mountains or cold" },
        { id: "beach", label: "Beach, or hot and humid" },
        { id: "hot", label: "Hot and dry" },
        { id: "rain", label: "Monsoon or rain" },
        { id: "city", label: "A city" },
        { id: "remote", label: "Villages or remote areas" },
      ],
    },
    {
      id: "period",
      text: "Could anyone get their period on the trip?",
      options: [
        { id: "heavy", label: "Yes, with a medium or heavy flow" },
        { id: "light", label: "Yes, with a light flow or spotting" },
        { id: "maybe", label: "Maybe, the dates aren't certain" },
        { id: "no", label: "No, not expected" },
      ],
    },
    {
      id: "health",
      text: "Anything else to plan for? Pick all that apply.",
      multi: true,
      options: [
        { id: "motion", label: "Motion sickness or nausea" },
        { id: "urgency", label: "Needing the toilet often, or small bladder leaks" },
        { id: "knees", label: "Stiff knees or hips, squatting is hard" },
        { id: "uti", label: "Prone to UTIs or irritation down there" },
        { id: "postpartum", label: "Recently had a baby" },
        { id: "cramps", label: "Painful periods" },
        { id: "none", label: "None of these" },
      ],
    },
    {
      id: "priority",
      text: "What matters most for this trip? Pick all that apply.",
      multi: true,
      options: [
        { id: "light", label: "Packing light" },
        { id: "eco", label: "Eco-friendly choices" },
        { id: "emergency", label: "Being ready for emergencies" },
        { id: "none", label: "Nothing in particular" },
      ],
    },
  ],
  skip: (step, a) => {
    const daily = has(a, "trip", "daily");
    if (step === "length" || step === "place") return daily;
    // No period question for a group of only men, children or elderly parents.
    if (step === "period") return !any(a, "who", ["women", "teen"]);
    return false;
  },
  hideOption: (step, opt, a) => {
    const daily = has(a, "trip", "daily");
    if (step === "travel") return daily && ["flight", "foot", "boat"].includes(opt);
    if (step === "who") return has(a, "trip", "school") && ["toddler", "elderly", "pregnant"].includes(opt);
    if (step === "toilets" && opt === "onboard") return !any(a, "travel", ["train", "bus", "flight", "boat"]);
    if (step === "health") {
      if (opt === "postpartum") return !has(a, "who", "women");
      if (opt === "cramps") return !any(a, "who", ["women", "teen"]) || !any(a, "period", ["heavy", "light", "maybe"]);
    }
    return false;
  },
  result: (a) => {
    const trip = one(a, "trip", "holiday");
    const daily = trip === "daily";
    const W = has(a, "who", "women");
    const T = has(a, "who", "teen");
    const M = has(a, "who", "men");
    const K = has(a, "who", "kids");
    const B = has(a, "who", "toddler");
    const E = has(a, "who", "elderly");
    const P = has(a, "who", "pregnant");
    const female = W || T || P;
    const menOnly = M && !W && !T && !P && !K && !B && !E;
    const girlsOnly = (W || T) && !M && !K && !B && !E && !P;
    const per = W || T ? one(a, "period", "maybe") : "none";
    const periodOn = per === "heavy" || per === "light" || per === "maybe";
    const len = daily ? "day" : one(a, "length", "few");
    const longTrip = len === "week" || len === "long";
    const tv = (id: string) => has(a, "travel", id);
    const unsure = has(a, "toilets", "unsure") || !(a.toilets || []).length;
    const tl = (id: string) => has(a, "toilets", id) || (unsure && ["public", "highway", "squat"].includes(id));
    const pl = (id: string) => has(a, "place", id);
    const hl = (id: string) => has(a, "health", id);
    const pr = (id: string) => has(a, "priority", id);
    const postpartum = W && hl("postpartum");
    const cramps = periodOn && hl("cramps");
    const overnight = !daily && (tv("train") || tv("bus"));
    const road = trip === "road" || tv("car") || tv("bus");
    const noToilet = tl("notoilet") || trip === "trek" || tv("foot");
    const knees = hl("knees") || E;
    const westernSeat = daily || tl("clean") || tl("public") || tl("highway") || tl("onboard");
    const squatOrDirty = tl("squat") || tl("highway") || tl("public") || (tl("onboard") && tv("train"));

    // ---- Looway picks
    const looway: FinderPick[] = [];
    if (westernSeat) {
      add(
        looway,
        "looway-toilet-seat-covers",
        P
          ? "Sit instead of hovering, with no lowering a bump onto a dirty seat. Use, fold and bin, never flush."
          : K || B
            ? "Lay one before your child sits on any public seat. Use, fold and bin, never flush."
            : tl("onboard")
              ? "For train and plane toilets, where hovering is wobbly. Use, fold and bin, never flush."
              : "For every Western seat on the way: use, fold and bin. Never flush.",
      );
    }
    const funnel =
      (W || T || P || E) && (squatOrDirty || noToilet || knees || P || pl("hills") || trip === "wedding" || trip === "pilgrimage");
    if (funnel) {
      add(
        looway,
        "looway-pee-funnel",
        P
          ? "Pee standing up, with no painful squatting over a pan with a bump. Practise once at home first."
          : knees
            ? "No squatting on stiff knees: an elderly mother or anyone with sore joints can pee standing. Practise at home first."
            : noToilet
              ? "Pee standing, mostly dressed, where there's no toilet at all. Practise once at home first."
              : "For squat pans and filthy toilets: pee standing up without touching anything. Practise once at home first.",
      );
    }
    const bags =
      hl("motion") || K || B || E || P || hl("urgency") || noToilet || road || trip === "pilgrimage" || longTrip || pr("emergency");
    if (bags) {
      add(
        looway,
        "looway-pee-puke",
        hl("motion")
          ? "For motion sickness: vomit turns to gel in about 60 seconds and the smell stays locked in."
          : K || B
            ? "Held like a potty, a pee bag saves you in traffic jams and long queues. Leak-proof once sealed."
            : E || P || hl("urgency")
              ? "For when the bus won't stop or the queue is long: pee in, seal it, and it turns to gel. Unisex."
              : "For when there's no toilet at all: it turns pee into gel and stays leak-proof once sealed.",
      );
    }
    if (!looway.length) {
      add(looway, "looway-pee-puke", "For when there's no toilet at all: it turns pee into gel and stays leak-proof once sealed.");
    }
    const yatra = looway.length >= 2;
    if (yatra) {
      const kit = P
        ? "Pregnancy Travel"
        : B
          ? "Toddler Travel"
          : trip === "pilgrimage"
            ? "Teerth Yatra"
            : trip === "trek" || tv("foot")
              ? "Sports & Adventure"
              : (trip === "work" || daily) && W
                ? "Working Woman"
                : menOnly
                  ? "Boys' Trip"
                  : girlsOnly
                    ? "Girls' Trip"
                    : K || E
                      ? "Family"
                      : len === "day" || len === "few"
                        ? "Weekender"
                        : "Complete";
      looway.unshift({ product: "looway-yatra-kit", why: KIT_WHY[kit] });
    }

    // ---- Ovy picks (never for a group without women or girls)
    const ovy: FinderPick[] = [];
    if (postpartum) {
      add(ovy, "ovy-pads", "Our most protective pad, made for heavy flow and bleeding after birth.", XLP);
      add(ovy, "ovy-panty", "Leak-proof cover for long sits and nights while bleeding after birth is still heavy.");
    }
    if (periodOn) {
      if (T) add(ovy, "ovy-teen", "Soft teen pads and kits, so she's ready if her period starts on the trip.");
      if (W) {
        if (per === "heavy") add(ovy, "ovy-pads", "XL by day and XL+ for nights and long journeys, all in one box.", MIX);
        else if (per === "light") add(ovy, "ovy-pads", "Light pads for light days, with a few spare in case the flow picks up.", L);
        else add(ovy, "ovy-pads", "Travel and stress can bring a period early, so pack a box with every size.", MIX);
      }
      if (W && per !== "light" && (overnight || noToilet || longTrip || trip === "wedding" || tv("flight"))) {
        add(ovy, "ovy-panty", "Leak-proof for 10 to 12 hours: made for overnight journeys and long stretches with no toilet.");
      }
      if (W && per === "light") add(ovy, "ovy-liners", "For spotting and the light days at the end of a period.");
      if (W && !postpartum && pr("eco")) {
        add(ovy, "ovy-cup", "Reusable, with up to 12 hours of wear and nothing to bin, if you've already practised at home.");
      } else if (W && !postpartum && pl("beach")) {
        add(ovy, "ovy-cup", "The Ovy option made for swimming, if you've already practised with it at home.");
      }
    }
    if (P) add(ovy, "ovy-liners", "Discharge often increases in pregnancy: thin liners keep you fresh on long days.");

    const picks = [...looway, ...ovy].slice(0, 7);

    // ---- Packing checklist
    const list: string[] = [];
    if (picks.some((p) => p.product === "looway-toilet-seat-covers")) list.push("Enough seat covers for every toilet stop, plus a few spare");
    if (picks.some((p) => p.product === "looway-pee-puke")) {
      list.push(
        len === "day"
          ? "Pee and puke bags: about 2 per traveller for the day"
          : "Pee and puke bags: about 2 per traveller for each travel day, plus a few spare",
      );
      list.push("Each bag holds up to 700 ml and can be used 2 to 3 times: bin it once full, or 24 hours after opening");
    }
    if (funnel) {
      list.push("The pee funnel in its cotton pouch, practised once at home before you go");
      if ([W, T, P, E].filter(Boolean).length >= 2 || (girlsOnly && !daily)) list.push("One funnel for each woman or girl, as a funnel shouldn't be shared");
    }
    if (periodOn) {
      list.push("Pads: about 4 to 5 a day for each day a period may fall on the trip, plus a spare pack");
      if (overnight) list.push("A night pouch by your pillow: a fresh pad, wipes and a disposal bag");
      if (tv("flight")) list.push("Period care in your hand luggage, not the checked bag");
      if (trip === "pilgrimage" || trip === "trek" || pl("remote") || pl("hills")) {
        list.push("All the period care you need, as small towns and hill routes may not stock your size");
      }
      list.push("Spare underwear and dark, loose clothes for period days");
      if (cramps) list.push("A hot water bottle or heat patch for cramp days");
      if (picks.some((p) => p.product === "ovy-cup")) list.push("New to cups? Practise for a cycle or two at home first, and carry a few pads as backup");
      if (T) list.push("Show her how to wrap and bin a pad, and tell her it's fine to ask you or a teacher for help");
    } else if (per === "no" && !daily) {
      list.push("A few pads anyway: travel, stress and altitude can bring a period early");
    }
    if (postpartum) list.push("Soon after birth: ask your doctor before travelling, and carry plenty of XL+ pads");
    if (P) {
      list.push("Pregnancy: check with your doctor before a long trip, and carry your pregnancy file");
      list.push("Walk a little at every stop and keep sipping water, even though you'll pee more");
    }
    if (K) list.push("Toilet stops every hour or two, with everyone going, even if they say they don't need to");
    if (K || B) list.push("Spare clothes for each child, and a bag for wet clothes");
    if (B) list.push("Diapers or pull-ups and a changing mat for the little one");
    if (K || B) list.push("Take little ones into the cubicle with you, and wash hands together after");
    if (E) list.push("For elderly parents: a lower berth or aisle seat near the toilet, and a stop every 1 to 2 hours");
    if (hl("motion")) list.push("For motion sickness: sit facing forward by a window, eat light before you set off, and keep a bag within reach");
    if (hl("urgency")) list.push("Go at every good stop, even if you don't feel the need yet");
    if (hl("knees")) list.push("Ask for a Western toilet where you can, and keep the funnel handy for squat pans");
    if (hl("uti")) list.push("Don't hold your pee: go when you need to, keep sipping water and wipe front to back");
    if (noToilet) {
      list.push(
        female
          ? "Pack out every used pad, cover and wipe in a sealed bag, and never bury or leave them behind"
          : "Pack out every used cover, bag and wipe in a sealed bag, and never bury or leave them behind",
      );
    }
    if (pl("hills")) list.push("Warm layers that are quick to manage in a cold toilet, and go before you head out");
    if (pl("beach")) list.push("Breathable cotton underwear, a spare pair for every day, and a bag for wet clothes");
    if (pl("hot")) list.push("Extra drinking water and loose cotton clothes, as heat dries you out fast");
    if (pl("rain")) list.push("A waterproof pouch for pads, covers and wipes, and quick-dry clothes");
    if (pl("remote")) list.push("Everything you'll need, as shops may be few and far between");
    if (trip === "pilgrimage") list.push("For long darshan queues: a pee and puke bag and wipes in a small sling bag");
    if (trip === "wedding") list.push("For sarees and lehengas: go before you're fully dressed, and keep a small potli with wipes and a spare pad");
    if (trip === "work") list.push("A small pouch for the office: pads, liners, spare underwear, seat covers and wipes");
    if (daily) {
      list.push(
        female
          ? "A bag or drawer kit: a few pads, liners, seat covers, wipes and spare underwear. Restock it when you use something."
          : "Seat covers and a couple of pee bags in your bag for long commutes",
      );
    } else {
      list.push(
        female
          ? "Loose, pull-on clothes, and a shawl or dupatta that doubles as a privacy screen"
          : "Loose, comfortable clothes that are quick to manage at a toilet stop",
      );
    }
    list.push("Hand sanitiser and a small pack of wet wipes");
    list.push(
      female
        ? "Tissues, plus a zip pouch for used pads, covers and wipes until you reach a bin"
        : "Tissues, plus a zip pouch for used covers, bags and wipes until you reach a bin",
    );
    list.push("A water bottle to sip from through the day");
    if (pr("light")) {
      list.push("Pack flat: seat covers and bags slip into a handbag pocket");
      if (periodOn && W) list.push("To save space, a period panty or a cup replaces several pads");
    }
    if (pr("eco")) list.push("The funnel lasts for years and a cup is reusable; seat covers are biodegradable paper, to bin, never flush");
    if (pr("emergency")) {
      list.push(female ? "An emergency pouch: a pad, a seat cover, a pee bag, wipes and spare underwear" : "An emergency pouch: a seat cover, a pee bag, wipes and spare underwear");
      list.push("Save 112, India's emergency number, in every phone");
    }
    if (!daily) list.push("Order at least a week before you leave, and try anything new at home first");
    const checklist = list.slice(0, 18);
    checklist.push(
      female || postpartum
        ? "Wherever you are, see a doctor straight away for heavy bleeding, severe pain, fever or burning when you pee. Emergency: 112."
        : "Wherever you are, see a doctor straight away for a high fever, severe pain or vomiting that won't stop. Emergency: 112.",
    );

    // ---- One tip that matters most for this trip
    const tip =
      trip === "pilgrimage"
        ? "Yatra routes get crowded: go to the toilet before every queue or climb, and keep a pee bag in your sling bag."
        : trip === "trek" || tv("foot")
          ? "Leave no trace: pack out everything you use, and pee downwind, away from water and paths."
          : P
            ? "Book an aisle seat or a lower berth near the toilet, and stop every one to two hours on the road."
            : K || B
              ? "Stop every hour or two and have everyone go, even if they say they don't need to."
              : E
                ? "Older people dehydrate faster, so remind them to sip water, and plan a stop every one to two hours."
                : hl("motion")
                  ? "On winding roads, keep a pee and puke bag open within reach: it gels in about 60 seconds and locks in the smell."
                  : trip === "wedding"
                    ? "Wear your longest protection under heavy outfits, and keep a small pouch with a friend for quick toilet trips."
                    : daily
                      ? "Keep a small kit in your bag or desk drawer, and restock it as soon as you use something."
                      : longTrip
                        ? "For a long trip, carry enough seat covers for every toilet stop and a few spare pee bags, so you never have to ration them."
                        : "Keep everything in one pouch you can reach without unpacking the bag.";

    const links: FinderResult["links"] = [];
    if (yatra) links.push({ label: "Build a Yatra Kit", href: "/looway-yatra-kit" });
    if (per === "maybe" || per === "no") links.push({ label: "Check my dates in the Period Tracker", href: "/period-log" });
    links.push({ label: "Shop Looway", href: "/looway" });

    return {
      title: daily ? "Your everyday hygiene kit" : "Your trip hygiene plan",
      intro: daily ? "Here's what I'd keep in your bag every day." : "Here's the kit and packing list I'd suggest for this trip.",
      picks,
      checklist,
      tip,
      links,
    };
  },
};

// ---------------------------------------------------------------- Cycle phase guide

const PHASE: Record<string, { title: string; intro: string }> = {
  period: {
    title: "Menstrual phase: your period",
    intro: "Day 1 is the first day of bleeding. Hormones are at their lowest, so energy can dip and cramps are common. It's a normal, healthy part of the cycle.",
  },
  after: {
    title: "Follicular phase: energy building",
    intro: "After your period, hormones start to rise. Many people feel their energy, mood and focus pick up through these days.",
  },
  mid: {
    title: "Ovulation: often your peak",
    intro: "Around the middle of the cycle an egg is released. Energy and mood often peak, and discharge may turn clear and stretchy, like raw egg white.",
  },
  before: {
    title: "Luteal phase: winding down",
    intro: "In the week or two before your period, energy winds down. Bloating, tender breasts, cravings or mood changes (PMS) can show up, then ease once your period starts.",
  },
  unsure: {
    title: "Your cycle in four phases",
    intro: "Your cycle has four phases: your period, the days after it, ovulation around the middle, and the days before your next period. Logging your dates is the easiest way to see where you are.",
  },
};

const PHASE_TIPS: Record<string, Record<string, string>> = {
  energy: {
    period: "Plan lighter tasks for your heaviest days, and take short breaks",
    after: "A good time to start new tasks, plan ahead or take on harder study",
    mid: "Many feel most social and confident now: good for talks, meetings and big days",
    before: "Finish things off rather than starting big new tasks, and keep your to-do list short",
  },
  move: {
    period: "Gentle movement: a short walk, stretching or easy yoga, and rest if you need it",
    after: "Energy is rising: a good time for brisk walks, dance, sport or strength work",
    mid: "If you feel strong, enjoy harder workouts, and warm up well",
    before: "Swap hard sessions for walking, yoga or swimming if you feel heavy",
  },
  food: {
    period: "Iron-rich foods like dal, rajma, palak and eggs, with lemon or amla to help your body take up the iron",
    after: "Fresh, balanced meals: vegetables, protein, and curd or other fermented foods",
    mid: "Plenty of water, fruit and vegetables, and regular meals",
    before: "Regular meals with whole grains and protein help steady cravings; go easy on salt, sugar and caffeine",
  },
  mood: {
    period: "Sleep a little longer if you can, and be kind to yourself on low days",
    after: "Make the most of a better mood: catch up with friends or plan something you enjoy",
    mid: "High energy can make sleep lighter, so keep a regular bedtime",
    before: "Mood dips are common before a period: rest, talk to someone close, and keep a regular bedtime",
  },
  skin: {
    period: "Change pads every 4 to 6 hours and keep the skin clean and dry to avoid rashes",
    after: "Discharge is usually light now; a thin liner is enough if you need one",
    mid: "Clear, stretchy discharge is normal around ovulation; a liner keeps you fresh",
    before: "Spots on the chin or jaw are common before a period: wash gently and don't pick",
  },
  body: {
    period: "Heat on the lower belly, like a hot water bottle, eases most cramps",
    after: "Bloating usually settles now; pain outside your period that keeps coming back is worth a doctor's check",
    mid: "A twinge on one side around ovulation is common; severe or lasting pain needs a doctor",
    before: "For bloating, go easy on salty snacks and fizzy drinks, and sip water through the day",
  },
};

const PHASE_OVERVIEW = [
  "Period (about days 1 to 5): energy may dip, so rest, use heat for cramps and eat iron-rich foods",
  "After your period (about days 6 to 13): energy and mood often rise",
  "Ovulation (around the middle): clear, stretchy discharge and often your peak energy",
  "Before your period (the last week or two): PMS like bloating, cravings or mood changes can show up",
];

const CYCLE_TIP: Record<string, string> = {
  regular: "Phases vary from person to person, so treat this as a guide and go by how your body feels.",
  varies: "When your cycle shifts, the phases shift too. Logging a few periods in the tracker shows your own pattern.",
  irregular: "With an irregular cycle, phases are hard to predict. Log your periods, and see a doctor if you go 3 months without one.",
  hormonal: "Hormonal contraception changes these natural phases, so this guide may not match how you feel. Your doctor can tell you what to expect.",
  young: "In the first couple of years, irregular cycles are common. Log your periods so you can start to see a pattern.",
};

const cyclePhase: Tool = {
  id: "cycle-phase",
  title: "Where am I in my cycle?",
  short: "Cycle phase guide",
  page: { label: "Open the Period Tracker", href: "/period-log" },
  steps: [
    {
      id: "day",
      text: "Where are you in your cycle right now? Day 1 is the first day of your period.",
      options: [
        { id: "period", label: "On my period now" },
        { id: "after", label: "A few days after my period ended" },
        { id: "mid", label: "About two weeks after my period started" },
        { id: "before", label: "In the week or so before my next period" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "cycle",
      text: "How regular is your cycle?",
      options: [
        { id: "regular", label: "Regular, every 21 to 35 days" },
        { id: "varies", label: "It shifts by a week or more" },
        { id: "irregular", label: "Very irregular, or it skips months" },
        { id: "hormonal", label: "I'm on the pill or other hormonal contraception" },
        { id: "young", label: "My periods started in the last 2 years" },
      ],
    },
    {
      id: "focus",
      text: "What would you like tips on? Pick all that apply.",
      multi: true,
      options: [
        { id: "energy", label: "Energy, work and study" },
        { id: "move", label: "Exercise and movement" },
        { id: "food", label: "Food and cravings" },
        { id: "mood", label: "Mood and sleep" },
        { id: "skin", label: "Skin and discharge" },
        { id: "body", label: "Cramps and bloating" },
      ],
    },
  ],
  result: (a) => {
    const day = one(a, "day", "unsure");
    const cycle = one(a, "cycle", "regular");
    const focus = (a.focus || []).filter((f) => PHASE_TIPS[f]);
    const chosen = focus.length ? focus : ["energy", "body"];
    const picks: FinderPick[] = [];
    if (day === "period") {
      add(picks, "ovy-pads", "Rash-free, dermatologically tested pads for your period days. The pad size finder picks L, XL or XL+.");
    } else if (day === "after") {
      add(picks, "ovy-liners", "Thin liners for the light discharge that comes and goes after your period.");
    } else if (day === "mid") {
      add(picks, "ovy-liners", "Clear, stretchy discharge is common around ovulation: a thin liner keeps you fresh.");
    } else {
      add(picks, "ovy-pads", "Keep pads in your bag in the days before your period, so it never catches you out.");
    }
    add(picks, "period-tracker", "Log your period to see your phase, your next dates and your PMS days.");

    const checklist = day === "unsure" ? [...PHASE_OVERVIEW] : chosen.map((f) => PHASE_TIPS[f][day]);
    if (day === "unsure") checklist.push("Log your period in the Period Tracker to see which phase you're in");
    if (day === "mid" || day === "unsure") {
      checklist.push("Tracking phases isn't reliable birth control: use contraception if you don't want to get pregnant");
    }
    checklist.push("See a doctor if cycles are often shorter than 21 days or longer than 35, a period lasts over 7 days, or you bleed between periods");

    return {
      title: PHASE[day].title,
      intro: PHASE[day].intro,
      picks,
      checklist,
      tip: CYCLE_TIP[cycle],
      links: [TRACKER_LINK],
    };
  },
};

// ---------------------------------------------------------------- Period comfort plan

const COMFORT: Record<string, string[]> = {
  cramps: ["Heat on your lower belly: a hot water bottle or heat patch", "Gentle movement, like a short walk, cat-cow or child's pose"],
  bloat: ["Go easy on salt and fizzy drinks, and sip water through the day", "Warm, home-cooked meals, eaten little and often"],
  mood: ["Plan lighter days where you can, and tell someone close how you feel", "A short walk outdoors or a few slow, deep breaths when mood dips"],
  tired: ["A regular bedtime, and iron-rich foods like dal, palak, chana and eggs"],
  sleep: ["Wear your longest protection at night, like an XL+ pad or a period panty, so you can sleep without checking"],
  headache: ["Regular meals and water, and rest in a dark, quiet room when a headache comes"],
  cravings: ["Keep fruit, nuts or roasted chana handy, and eat every few hours to steady cravings"],
  skin: ["Wash your face gently twice a day, and don't pick at spots"],
  rash: ["Change pads every 4 to 6 hours, and keep the skin clean and dry"],
  none: ["Mark your expected dates so the week never takes you by surprise"],
};

const COMFORT_DAY: Record<string, string> = {
  school: "A pouch in your school bag: 2 pads, spare underwear, a disposal bag and wipes",
  desk: "A desk drawer kit: pads, liners, spare underwear and a heat patch",
  feet: "Change just before a long shift, and pick a longer pad or a period panty",
  home: "Rest counts too: share the chores on your hardest day",
  sport: "Exercise is fine on your period: a cup or a period panty gives you freedom to move",
};

const comfortPlan: Tool = {
  id: "comfort-plan",
  title: "Plan my period comfort week",
  short: "Period comfort plan",
  steps: [
    {
      id: "trouble",
      text: "What makes your period week hard? Pick all that apply.",
      multi: true,
      options: [
        { id: "cramps", label: "Cramps or back ache" },
        { id: "bloat", label: "Bloating or an upset tummy" },
        { id: "mood", label: "Mood swings, irritability or low mood" },
        { id: "tired", label: "Feeling tired" },
        { id: "sleep", label: "Poor sleep, or worry about night leaks" },
        { id: "headache", label: "Headaches" },
        { id: "cravings", label: "Cravings" },
        { id: "skin", label: "Pimples or breakouts" },
        { id: "rash", label: "Pad rash or chafing" },
        { id: "none", label: "Nothing much, I just want a plan" },
      ],
    },
    {
      id: "when",
      text: "When is it hardest?",
      options: [
        { id: "before", label: "In the days before my period" },
        { id: "first", label: "The first day or two" },
        { id: "whole", label: "The whole period week" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "impact",
      text: "How much does it affect your day?",
      options: [
        { id: "mild", label: "A little, I carry on" },
        { id: "some", label: "Some days I slow down" },
        { id: "stops", label: "It stops me from school, work or plans" },
        { id: "worse", label: "It's new, or getting worse" },
      ],
    },
    {
      id: "day",
      text: "What does a normal day look like?",
      options: [
        { id: "school", label: "School or college" },
        { id: "desk", label: "Office or desk work" },
        { id: "feet", label: "On my feet all day" },
        { id: "home", label: "At home, running the house" },
        { id: "sport", label: "Sport, gym or dance" },
      ],
    },
    {
      id: "flow",
      text: "And how heavy is your flow on most days?",
      options: [
        { id: "light", label: "Light" },
        { id: "medium", label: "Medium" },
        { id: "heavy", label: "Heavy, or I leak at night" },
        { id: "unsure", label: "Not sure" },
      ],
    },
  ],
  result: (a) => {
    const trouble = (a.trouble || []).filter((t) => COMFORT[t]);
    const items = trouble.length ? trouble : ["none"];
    const when = one(a, "when", "unsure");
    const impact = one(a, "impact", "mild");
    const day = one(a, "day", "desk");
    const flow = one(a, "flow", "unsure");
    const serious = impact === "stops" || impact === "worse";

    const picks: FinderPick[] = [];
    if (items.includes("rash")) {
      add(picks, "ovy-pads", "Rash-free, dermatologically tested pads are gentle on skin that chafes.", flow === "light" ? L : flow === "medium" ? XL : flow === "heavy" ? XLP : MIX);
    } else {
      add(picks, "ovy-pads", "Dermatologically tested, rash-free pads in the size that suits your flow.", flow === "light" ? L : flow === "medium" ? XL : flow === "heavy" ? XLP : MIX);
    }
    if (flow === "heavy" || items.includes("sleep")) add(picks, "ovy-panty", "Leak-proof all night, so you can sleep without checking.");
    if (day === "sport") add(picks, "ovy-cup", "Medical-grade silicone, up to 12 hours of wear, and fine for sport and swimming.");
    if (when === "before" || items.includes("mood")) add(picks, "period-tracker", "Log your period and symptoms to see your PMS days coming.");

    const checklist: string[] = [];
    for (const t of items) checklist.push(...COMFORT[t]);
    if (when === "before") checklist.push("Note your symptoms in the Period Tracker to see which days PMS starts");
    if (when === "first") checklist.push("Keep the first day or two lighter where you can");
    checklist.push(COMFORT_DAY[day] || COMFORT_DAY.desk);
    if (items.includes("mood") && serious) {
      checklist.push("If low mood feels heavy, or you have thoughts of harming yourself, call Tele MANAS on 14416, free and confidential");
    }
    checklist.push("See a doctor if pain stops you from your day, a pad soaks through in an hour or two, or you feel faint");

    return {
      title: "Your period comfort plan",
      intro:
        when === "before"
          ? "PMS is real, and planning for the days before your period helps. Here's a plan for your week."
          : when === "first"
            ? "The first day or two are often the hardest. Here's a plan to make them easier."
            : "Here's a simple plan for your whole period week.",
      picks,
      checklist,
      tip: serious
        ? "Pain or mood changes that stop your day, or are new or getting worse, deserve a doctor's check. You don't have to put up with them."
        : "Small changes add up: try the plan for two or three cycles and keep what helps you most.",
      links: [TRACKER_LINK],
    };
  },
};

// ---------------------------------------------------------------- First period readiness

const READY_GAP: Record<string, string> = {
  knows: "Talk it through early and simply: a period is a normal, healthy sign of growing up",
  kit: "Put a small kit in the school bag: 2 pads, spare underwear, wipes and a disposal bag",
  pad: "Practise at home: open a pad, stick it on underwear, then wrap it and bin it",
  spare: "Keep spare underwear and a dark pair of leggings in the bag",
  ask: "Agree who to ask at school, like a teacher or the school nurse, and that asking is always fine",
  track: "Note the first day of each period in the Period Tracker to learn the pattern",
};

const WORRY_PLAN: Record<string, string> = {
  school: "If it starts at school: tie a jumper round the waist, head to the toilet and use the kit",
  leaks: "A longer pad or a period panty on heavy days, and dark clothes, take the stress out of stains",
  pain: "Heat on the lower belly and a short walk help most cramps",
  toilets: "Seat covers for school toilets: use, fold and bin, never flush",
  sport: "Sport and PE are fine on a period, and a period panty gives freedom to move",
  night: "A longer pad or a period panty for nights, and an old towel under the sheet at first",
  talk: "Keep it matter-of-fact: everyone gets periods, and there are no silly questions",
};

const firstPeriod: Tool = {
  id: "first-period",
  title: "Get ready for a first period",
  short: "First period readiness",
  page: { label: "Ovy Teen kits", href: "/product-detail/ovy-teen" },
  steps: [
    {
      id: "who",
      text: "Who's answering?",
      options: [
        { id: "parent", label: "A parent or carer" },
        { id: "girl", label: "I'm the girl, getting ready myself" },
      ],
    },
    {
      id: "age",
      text: "How old is she, or how old are you?",
      options: [
        { id: "u8", label: "8 or younger" },
        { id: "9-11", label: "9 to 11" },
        { id: "12-13", label: "12 to 13" },
        { id: "14", label: "14" },
        { id: "15", label: "15 or older" },
      ],
    },
    {
      id: "stage",
      text: "Where are things now?",
      options: [
        { id: "none", label: "No signs of puberty yet" },
        { id: "signs", label: "Signs like breast buds or white discharge, but no period yet" },
        { id: "started", label: "The first period has come" },
      ],
    },
    {
      id: "ready",
      text: "What's already in place? Pick all that apply.",
      multi: true,
      options: [
        { id: "knows", label: "Knows what a period is and why it happens" },
        { id: "kit", label: "A small kit in the school bag" },
        { id: "pad", label: "Knows how to use, wrap and bin a pad" },
        { id: "spare", label: "Spare underwear in the bag" },
        { id: "ask", label: "Knows who to ask for help at school" },
        { id: "track", label: "Notes down the period dates" },
        { id: "nothing", label: "None of these yet" },
      ],
    },
    {
      id: "worry",
      text: "What's the biggest worry? Pick all that apply.",
      multi: true,
      options: [
        { id: "school", label: "It starting at school" },
        { id: "leaks", label: "Leaks or stains on the uniform" },
        { id: "pain", label: "Pain or cramps" },
        { id: "toilets", label: "Dirty school toilets" },
        { id: "sport", label: "Sport, swimming or PE" },
        { id: "night", label: "Leaks at night" },
        { id: "talk", label: "Feeling shy talking about it" },
        { id: "none", label: "No big worries" },
      ],
    },
  ],
  // Dates only make sense once periods have started.
  hideOption: (step, opt, a) => step === "ready" && opt === "track" && !has(a, "stage", "started"),
  result: (a) => {
    const who = one(a, "who", "parent");
    const age = one(a, "age", "12-13");
    const stage = one(a, "stage", "signs");
    const worries = a.worry || [];
    const ready = a.ready || [];
    const gaps = Object.keys(READY_GAP).filter((k) => !ready.includes(k) && (k !== "track" || stage === "started"));

    const picks: FinderPick[] = [];
    add(picks, "ovy-teen", stage === "started" ? "Soft teen pads and kits for the first years of periods, with a guide written for girls." : "A first-period kit to have ready before it starts, with a guide written for girls.");
    if (stage === "signs") add(picks, "ovy-liners", "Thin liners for the white discharge that often comes before the first period.");
    if (worries.includes("night") || worries.includes("leaks") || worries.includes("sport")) {
      add(picks, "ovy-panty", "Leak-proof cover for nights, sport and heavy days, so stains stop being a worry.");
    }
    if (worries.includes("toilets")) add(picks, "looway-toilet-seat-covers", "For school toilets: use, fold and bin, never flush.");
    if (stage === "started") add(picks, "period-tracker", "Note each period's first day to learn the pattern and see the next one coming.");

    const checklist: string[] = [];
    if (stage === "none") checklist.push("No rush: the first period usually comes a year or two after the first signs of puberty");
    if (stage === "signs") checklist.push("White discharge often shows up before the first period, so it's a good cue to keep a kit ready");
    if (stage === "started") checklist.push("Early periods are often light, brown or irregular for the first year or two, which is common");
    for (const g of gaps) checklist.push(READY_GAP[g]);
    if (!gaps.length) checklist.push("Everything's in place: just restock the kit after each period");
    for (const w of worries) if (WORRY_PLAN[w]) checklist.push(WORRY_PLAN[w]);

    // Doctor lines that follow the usual guidance on early and late puberty.
    if (age === "u8" && stage !== "none") checklist.push("Puberty signs or a period at 8 or younger are worth a check with a children's doctor");
    if ((age === "15" && stage !== "started") || ((age === "14" || age === "15") && stage === "none")) {
      checklist.push("No period by 15, or no signs of puberty by 13, is worth a doctor's check");
    }
    checklist.push("See a doctor for a pad soaked in under an hour, bleeding for over 7 days, or pain that means missing school");

    const links: FinderResult["links"] = [{ label: "Ovy Teen kits", href: "/product-detail/ovy-teen" }];
    if (stage === "started") links.push(TRACKER_LINK);

    return {
      title: stage === "none" ? "Getting ready early" : stage === "signs" ? "Getting ready for the first period" : "Settling into periods",
      intro: who === "girl" ? "Here's a calm plan for you, with what to add next." : "Here's a calm plan for her, with what to add next.",
      picks,
      checklist,
      tip:
        who === "girl"
          ? "Keep your kit in the same pocket of your bag, so you can grab it without thinking."
          : "Pop a kit in her school bag before her period starts, so she's ready wherever she is.",
      links,
    };
  },
};

// ---------------------------------------------------------------- Intimate hygiene check

const HABIT_GAP: Record<string, string> = {
  underwear: "Fresh cotton underwear every day, and sooner if it gets damp",
  water: "Plain water on the outside is all you need: no soap, douches or sprays inside",
  wipe: "Wipe front to back after the toilet, every time",
  change: "On period days, change pads every 4 to 6 hours, even on light days",
  toilets: "On public Western seats, use a seat cover rather than sitting straight on the seat",
  liner: "On discharge days, a thin liner keeps underwear fresh; change it a few times a day",
  dry: "Pat dry after a bath, and change out of damp or sweaty clothes soon",
  hands: "Wash hands before and after changing a pad",
};

const hygieneCheck: Tool = {
  id: "hygiene-check",
  title: "Check my intimate hygiene routine",
  short: "Hygiene routine check",
  steps: [
    {
      id: "habits",
      text: "Which of these are already part of your routine? Pick all that apply.",
      multi: true,
      options: [
        { id: "underwear", label: "Fresh cotton underwear every day" },
        { id: "water", label: "Rinsing the outside with plain water, no soap inside" },
        { id: "wipe", label: "Wiping front to back" },
        { id: "change", label: "Changing pads every 4 to 6 hours" },
        { id: "toilets", label: "Using a seat cover on public seats" },
        { id: "liner", label: "A thin liner on discharge days" },
        { id: "dry", label: "Drying well and changing out of damp clothes" },
        { id: "hands", label: "Washing hands before and after changing a pad" },
        { id: "none", label: "Not sure, I don't have a set routine" },
      ],
    },
    {
      id: "worry",
      text: "Is anything bothering you lately? Pick all that apply.",
      multi: true,
      options: [
        { id: "odour", label: "A strong smell" },
        { id: "itch", label: "Itching or irritation" },
        { id: "rash", label: "Pad rash or chafing" },
        { id: "discharge", label: "A change in discharge" },
        { id: "none", label: "No, all good" },
      ],
    },
  ],
  result: (a) => {
    const habits = a.habits || [];
    const worry = a.worry || [];
    const gaps = Object.keys(HABIT_GAP).filter((k) => !habits.includes(k));
    const health = worry.includes("odour") || worry.includes("itch") || worry.includes("discharge");
    const done = Object.keys(HABIT_GAP).length - gaps.length;

    // Infection-like worries get no product push, only the doctor line.
    const picks: FinderPick[] = [];
    if (!health) {
      if (worry.includes("rash")) add(picks, "ovy-pads", "Rash-free, dermatologically tested pads, changed every 4 to 6 hours, are gentle on chafed skin.");
      if (gaps.includes("liner")) add(picks, "ovy-liners", "Thin, breathable liners for everyday discharge, so underwear stays fresh.");
      if (gaps.includes("toilets")) add(picks, "looway-toilet-seat-covers", "A slim box in your bag means you never sit straight on a public seat. Use, fold and bin.");
    }

    const checklist = gaps.map((g) => HABIT_GAP[g]);
    if (!gaps.length) checklist.push("Keep it up, and replace underwear that's worn thin or stretched");
    if (worry.includes("rash")) checklist.push("For a pad rash: change more often, keep the skin dry, and give it air at night where you can");
    checklist.push(
      health
        ? "A strong fishy smell, itching, or discharge that changes colour or texture is worth a doctor's check, rather than washes or sprays"
        : "See a doctor for itching, a strong smell, sores, or discharge that changes colour or texture",
    );

    return {
      title: "Your hygiene routine check",
      intro:
        done === Object.keys(HABIT_GAP).length
          ? "Lovely: your routine already covers every habit on the list."
          : done >= 5
            ? "Your routine is in good shape. Here's what would round it off."
            : "Here are a few easy habits to build into your day.",
      picks,
      checklist,
      tip: "The vagina cleans itself, so the outside only needs plain water. Skip douches, scented washes and sprays.",
    };
  },
};

export const TOOLS: Record<string, Tool> = {
  "trip-planner": tripPlanner,
  "cycle-phase": cyclePhase,
  "comfort-plan": comfortPlan,
  "first-period": firstPeriod,
  "hygiene-check": hygieneCheck,
};
