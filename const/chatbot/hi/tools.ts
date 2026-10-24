// Hindi versions of the chat's planners and quizzes (tools.ts). Same ids and
// keys as the English. TOOL_TEXT_HI maps every exact English string a tool's
// result() can return to Hindi. Sizes (L, XL, XL+) stay the same in Hindi.

export const TOOLS_HI: Record<string, { title: string; short: string; steps: Record<string, { text: string; options: Record<string, string> }> }> = {
  "trip-planner": {
    title: "मेरे सफ़र की हाइजीन प्लान करें",
    short: "सफ़र हाइजीन प्लानर",
    steps: {
      trip: {
        text: "यह किस तरह का सफ़र है?",
        options: {
          holiday: "छुट्टी या घूमना-फिरना",
          pilgrimage: "तीर्थयात्रा या यात्रा",
          trek: "ट्रेक, कैंपिंग या एडवेंचर",
          road: "लंबी रोड ट्रिप",
          wedding: "शादी, त्योहार या कोई बड़ा आयोजन",
          work: "काम से सफ़र",
          family: "परिवार से मिलने जाना",
          school: "स्कूल या कॉलेज ट्रिप",
          daily: "रोज़ का आना-जाना, ऑफ़िस या कॉलेज",
        },
      },
      travel: {
        text: "आप कैसे जा रहे हैं? जो भी लागू हों, सब चुनें।",
        options: {
          train: "ट्रेन",
          bus: "बस",
          car: "कार या कैब",
          flight: "फ़्लाइट",
          foot: "पैदल या ट्रेकिंग",
          boat: "नाव या फ़ेरी",
        },
      },
      who: {
        text: "आपको मिलाकर कौन-कौन सफ़र कर रहा है? जो भी लागू हों, सब चुनें।",
        options: {
          women: "महिलाएँ",
          teen: "किशोर लड़कियाँ",
          men: "पुरुष या लड़के",
          kids: "बच्चे (5 से 12 साल)",
          toddler: "छोटे बच्चे या शिशु",
          elderly: "बुज़ुर्ग माता-पिता",
          pregnant: "कोई गर्भवती",
        },
      },
      length: {
        text: "सफ़र कितना लंबा है?",
        options: {
          day: "एक दिन या एक रात",
          few: "2 से 4 दिन",
          week: "5 से 7 दिन",
          long: "एक हफ़्ते से ज़्यादा",
        },
      },
      toilets: {
        text: "रास्ते में कैसे टॉयलेट मिलने की उम्मीद है? जो भी लागू हों, सब चुनें।",
        options: {
          clean: "साफ़ वेस्टर्न टॉयलेट (होटल, एयरपोर्ट)",
          public: "पब्लिक या स्टेशन के टॉयलेट, कभी ठीक कभी नहीं",
          highway: "हाईवे के ढाबे और पेट्रोल पंप",
          squat: "इंडियन (बैठने वाले) टॉयलेट",
          onboard: "ट्रेन, बस, प्लेन या नाव के टॉयलेट",
          notoilet: "लंबे रास्ते तक कोई टॉयलेट नहीं",
          unsure: "पक्का नहीं पता",
        },
      },
      place: {
        text: "जगह और मौसम कैसे हैं? जो भी लागू हों, सब चुनें।",
        options: {
          hills: "पहाड़ या ठंड",
          beach: "समुद्र तट, या गर्मी और उमस",
          hot: "गर्म और सूखा",
          rain: "मानसून या बारिश",
          city: "कोई शहर",
          remote: "गाँव या दूर-दराज़ के इलाके",
        },
      },
      period: {
        text: "क्या सफ़र में किसी को पीरियड आ सकता है?",
        options: {
          heavy: "हाँ, मीडियम या भारी फ़्लो के साथ",
          light: "हाँ, हल्के फ़्लो या स्पॉटिंग के साथ",
          maybe: "शायद, तारीख़ें पक्की नहीं हैं",
          no: "नहीं, उम्मीद नहीं है",
        },
      },
      health: {
        text: "किसी और बात की तैयारी करनी है? जो भी लागू हों, सब चुनें।",
        options: {
          motion: "मोशन सिकनेस या जी मिचलाना",
          urgency: "बार-बार टॉयलेट जाना, या थोड़ा पेशाब लीक होना",
          knees: "घुटनों या कूल्हों में जकड़न, नीचे बैठना मुश्किल",
          uti: "अक्सर UTI या नीचे जलन होती है",
          postpartum: "हाल ही में बच्चा हुआ है",
          cramps: "पीरियड में दर्द",
          none: "इनमें से कुछ नहीं",
        },
      },
      priority: {
        text: "इस सफ़र में सबसे ज़्यादा क्या मायने रखता है? जो भी लागू हों, सब चुनें।",
        options: {
          light: "हल्का सामान",
          eco: "पर्यावरण के अनुकूल विकल्प",
          emergency: "इमरजेंसी के लिए तैयार रहना",
          none: "कुछ ख़ास नहीं",
        },
      },
    },
  },

  "cycle-phase": {
    title: "मैं अपनी साइकिल में कहाँ हूँ?",
    short: "साइकिल फ़ेज़ गाइड",
    steps: {
      day: {
        text: "अभी आप अपनी साइकिल में कहाँ हैं? पीरियड का पहला दिन, डे 1 होता है।",
        options: {
          period: "अभी पीरियड चल रहा है",
          after: "पीरियड ख़त्म हुए कुछ दिन हुए हैं",
          mid: "पीरियड शुरू हुए लगभग दो हफ़्ते हुए हैं",
          before: "अगले पीरियड से पहले का हफ़्ता या उसके आसपास",
          unsure: "पक्का नहीं पता",
        },
      },
      cycle: {
        text: "आपकी साइकिल कितनी नियमित है?",
        options: {
          regular: "नियमित, हर 21 से 35 दिन में",
          varies: "एक हफ़्ता या ज़्यादा आगे-पीछे हो जाती है",
          irregular: "बहुत अनियमित, या महीने छूट जाते हैं",
          hormonal: "मैं पिल या कोई और हार्मोनल गर्भनिरोधक ले रही हूँ",
          young: "मेरे पीरियड पिछले 2 साल में ही शुरू हुए हैं",
        },
      },
      focus: {
        text: "आप किन बातों पर टिप्स चाहती हैं? जो भी लागू हों, सब चुनें।",
        options: {
          energy: "एनर्जी, काम और पढ़ाई",
          move: "एक्सरसाइज़ और चलना-फिरना",
          food: "खाना और क्रेविंग",
          mood: "मूड और नींद",
          skin: "त्वचा और डिस्चार्ज",
          body: "क्रैम्प और पेट फूलना",
        },
      },
    },
  },

  "comfort-plan": {
    title: "मेरे पीरियड हफ़्ते का आराम प्लान करें",
    short: "पीरियड आराम प्लान",
    steps: {
      trouble: {
        text: "आपके पीरियड हफ़्ते को क्या मुश्किल बनाता है? जो भी लागू हों, सब चुनें।",
        options: {
          cramps: "क्रैम्प या कमर दर्द",
          bloat: "पेट फूलना या पेट ख़राब होना",
          mood: "मूड स्विंग, चिड़चिड़ापन या उदासी",
          tired: "थकान",
          sleep: "नींद ठीक न आना, या रात में लीक की चिंता",
          headache: "सिरदर्द",
          cravings: "क्रेविंग",
          skin: "मुहाँसे या दाने",
          rash: "पैड रैश या रगड़",
          none: "ख़ास कुछ नहीं, बस एक प्लान चाहिए",
        },
      },
      when: {
        text: "सबसे मुश्किल कब होता है?",
        options: {
          before: "पीरियड से पहले के दिनों में",
          first: "पहले एक-दो दिन",
          whole: "पूरा पीरियड हफ़्ता",
          unsure: "पक्का नहीं पता",
        },
      },
      impact: {
        text: "इससे आपका दिन कितना प्रभावित होता है?",
        options: {
          mild: "थोड़ा, मैं अपना काम करती रहती हूँ",
          some: "कुछ दिन मेरी रफ़्तार धीमी हो जाती है",
          stops: "इसकी वजह से स्कूल, काम या प्लान छूट जाते हैं",
          worse: "यह नया है, या बढ़ता जा रहा है",
        },
      },
      day: {
        text: "आपका आम दिन कैसा होता है?",
        options: {
          school: "स्कूल या कॉलेज",
          desk: "ऑफ़िस या डेस्क का काम",
          feet: "पूरा दिन खड़े रहकर काम",
          home: "घर पर, घर संभालना",
          sport: "खेल, जिम या डांस",
        },
      },
      flow: {
        text: "और ज़्यादातर दिनों में आपका फ़्लो कितना होता है?",
        options: {
          light: "हल्का",
          medium: "मीडियम",
          heavy: "भारी, या रात में लीक होता है",
          unsure: "पक्का नहीं पता",
        },
      },
    },
  },

  "first-period": {
    title: "पहले पीरियड की तैयारी",
    short: "पहले पीरियड की तैयारी",
    steps: {
      who: {
        text: "जवाब कौन दे रहा है?",
        options: {
          parent: "माता-पिता या देखभाल करने वाले",
          girl: "मैं ख़ुद, अपनी तैयारी कर रही हूँ",
        },
      },
      age: {
        text: "उसकी उम्र कितनी है, या आपकी उम्र कितनी है?",
        options: {
          u8: "8 साल या उससे कम",
          "9-11": "9 से 11 साल",
          "12-13": "12 से 13 साल",
          "14": "14 साल",
          "15": "15 साल या ज़्यादा",
        },
      },
      stage: {
        text: "अभी स्थिति क्या है?",
        options: {
          none: "अभी प्यूबर्टी का कोई संकेत नहीं",
          signs: "ब्रेस्ट बड या सफ़ेद डिस्चार्ज जैसे संकेत, पर पीरियड अभी नहीं",
          started: "पहला पीरियड आ चुका है",
        },
      },
      ready: {
        text: "क्या-क्या पहले से तैयार है? जो भी लागू हों, सब चुनें।",
        options: {
          knows: "पता है कि पीरियड क्या है और क्यों आता है",
          kit: "स्कूल बैग में एक छोटी किट",
          pad: "पैड लगाना, लपेटना और डस्टबिन में डालना आता है",
          spare: "बैग में एक्स्ट्रा अंडरवियर",
          ask: "पता है कि स्कूल में मदद के लिए किससे पूछना है",
          track: "पीरियड की तारीख़ें नोट करती है",
          nothing: "अभी इनमें से कुछ नहीं",
        },
      },
      worry: {
        text: "सबसे बड़ी चिंता क्या है? जो भी लागू हों, सब चुनें।",
        options: {
          school: "स्कूल में शुरू हो जाना",
          leaks: "यूनिफ़ॉर्म पर लीक या दाग",
          pain: "दर्द या क्रैम्प",
          toilets: "स्कूल के गंदे टॉयलेट",
          sport: "खेल, तैराकी या PE",
          night: "रात में लीक",
          talk: "इस बारे में बात करने में झिझक",
          none: "कोई बड़ी चिंता नहीं",
        },
      },
    },
  },

  "hygiene-check": {
    title: "मेरी इंटिमेट हाइजीन रूटीन जाँचें",
    short: "हाइजीन रूटीन जाँच",
    steps: {
      habits: {
        text: "इनमें से क्या-क्या पहले से आपकी रूटीन में है? जो भी लागू हों, सब चुनें।",
        options: {
          underwear: "रोज़ साफ़ कॉटन अंडरवियर",
          water: "बाहर से सादे पानी से धोना, अंदर साबुन नहीं",
          wipe: "आगे से पीछे की ओर पोंछना",
          change: "हर 4 से 6 घंटे में पैड बदलना",
          toilets: "पब्लिक सीट पर सीट कवर इस्तेमाल करना",
          liner: "डिस्चार्ज वाले दिनों में पतला लाइनर",
          dry: "अच्छी तरह सुखाना और गीले कपड़े जल्दी बदलना",
          hands: "पैड बदलने से पहले और बाद में हाथ धोना",
          none: "पक्का नहीं, मेरी कोई तय रूटीन नहीं है",
        },
      },
      worry: {
        text: "क्या हाल में कुछ परेशान कर रहा है? जो भी लागू हों, सब चुनें।",
        options: {
          odour: "तेज़ गंध",
          itch: "खुजली या जलन",
          rash: "पैड रैश या रगड़",
          discharge: "डिस्चार्ज में बदलाव",
          none: "नहीं, सब ठीक है",
        },
      },
    },
  },
};

export const TOOL_TEXT_HI: Record<string, string> = {
  // ---- shared: sizes, page and link labels
  "L (240mm)": "L (240mm)",
  "XL (280mm)": "XL (280mm)",
  "XL+ (320mm)": "XL+ (320mm)",
  "Mix Your Box (L, XL and XL+)": "Mix Your Box (L, XL और XL+)",
  "Open the Period Tracker": "Period Tracker खोलें",
  "Check my dates in the Period Tracker": "Period Tracker में मेरी तारीख़ें देखें",
  "Build a Yatra Kit": "Yatra Kit बनाएँ",
  "Shop Looway": "Looway शॉप करें",
  "Ovy Teen kits": "Ovy Teen किट",

  // ---- trip planner: Yatra Kit
  "Start from the Pregnancy Travel kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Pregnancy Travel किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Toddler Travel kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Toddler Travel किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Teerth Yatra kit, made for pilgrimages, and edit it to fit. Every kit comes with free intimate wipes.":
    "तीर्थयात्राओं के लिए बनी Teerth Yatra किट से शुरू करें और ज़रूरत के हिसाब से बदल लें। हर किट के साथ इंटिमेट वाइप्स मुफ़्त आते हैं।",
  "Start from the Sports & Adventure kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Sports & Adventure किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Working Woman kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Working Woman किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Boys' Trip kit: seat covers and bags, no women's items, plus free intimate wipes.":
    "Boys' Trip किट से शुरू करें: सीट कवर और बैग, महिलाओं का कोई सामान नहीं, साथ में इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Girls' Trip kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Girls' Trip किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Family kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Family किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Weekender kit and edit it to fit: everything in one pouch, with free intimate wipes in every kit.":
    "Weekender किट से शुरू करें और ज़रूरत के हिसाब से बदल लें: सब कुछ एक पाउच में, और हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Start from the Complete kit, which covers every toilet situation, and edit it to fit. Every kit comes with free intimate wipes.":
    "Complete किट से शुरू करें, जो हर तरह के टॉयलेट के लिए है, और ज़रूरत के हिसाब से बदल लें। हर किट के साथ इंटिमेट वाइप्स मुफ़्त आते हैं।",

  // ---- trip planner: Looway picks
  "Sit instead of hovering, with no lowering a bump onto a dirty seat. Use, fold and bin, never flush.":
    "हवा में झुकने के बजाय आराम से बैठें, बेबी बंप के साथ गंदी सीट पर झुके बिना। इस्तेमाल करें, मोड़ें और डस्टबिन में डालें, कभी फ़्लश न करें।",
  "Lay one before your child sits on any public seat. Use, fold and bin, never flush.":
    "बच्चे के किसी भी पब्लिक सीट पर बैठने से पहले एक कवर बिछा दें। इस्तेमाल करें, मोड़ें और डस्टबिन में डालें, कभी फ़्लश न करें।",
  "For train and plane toilets, where hovering is wobbly. Use, fold and bin, never flush.":
    "ट्रेन और प्लेन के टॉयलेट के लिए, जहाँ हवा में झुककर रहना डगमगाता है। इस्तेमाल करें, मोड़ें और डस्टबिन में डालें, कभी फ़्लश न करें।",
  "For every Western seat on the way: use, fold and bin. Never flush.":
    "रास्ते की हर वेस्टर्न सीट के लिए: इस्तेमाल करें, मोड़ें और डस्टबिन में डालें। कभी फ़्लश न करें।",
  "Pee standing up, with no painful squatting over a pan with a bump. Practise once at home first.":
    "खड़े होकर पेशाब करें, बेबी बंप के साथ पैन पर दर्द भरा उकड़ूँ बैठना नहीं। पहले एक बार घर पर प्रैक्टिस कर लें।",
  "No squatting on stiff knees: an elderly mother or anyone with sore joints can pee standing. Practise at home first.":
    "जकड़े घुटनों पर उकड़ूँ बैठना नहीं: बुज़ुर्ग माँ या जोड़ों के दर्द वाला कोई भी खड़े होकर पेशाब कर सकता है। पहले घर पर प्रैक्टिस कर लें।",
  "Pee standing, mostly dressed, where there's no toilet at all. Practise once at home first.":
    "जहाँ टॉयलेट है ही नहीं, वहाँ कपड़े लगभग पहने हुए खड़े होकर पेशाब करें। पहले एक बार घर पर प्रैक्टिस कर लें।",
  "For squat pans and filthy toilets: pee standing up without touching anything. Practise once at home first.":
    "इंडियन (बैठने वाले) टॉयलेट और गंदे टॉयलेट के लिए: कुछ भी छुए बिना खड़े होकर पेशाब करें। पहले एक बार घर पर प्रैक्टिस कर लें।",
  "For motion sickness: vomit turns to gel in about 60 seconds and the smell stays locked in.":
    "मोशन सिकनेस के लिए: उल्टी लगभग 60 सेकंड में जेल बन जाती है और गंध अंदर ही बंद रहती है।",
  "Held like a potty, a pee bag saves you in traffic jams and long queues. Leak-proof once sealed.":
    "पॉटी की तरह पकड़ा गया पी बैग ट्रैफ़िक जाम और लंबी लाइनों में काम आता है। सील करने के बाद लीक-प्रूफ़।",
  "For when the bus won't stop or the queue is long: pee in, seal it, and it turns to gel. Unisex.":
    "जब बस न रुके या लाइन लंबी हो: पेशाब करें, सील करें, और यह जेल बन जाता है। सबके लिए, महिला और पुरुष दोनों।",
  "For when there's no toilet at all: it turns pee into gel and stays leak-proof once sealed.":
    "जब टॉयलेट हो ही नहीं: यह पेशाब को जेल में बदल देता है और सील करने के बाद लीक-प्रूफ़ रहता है।",

  // ---- trip planner: Ovy picks
  "Our most protective pad, made for heavy flow and bleeding after birth.":
    "हमारा सबसे ज़्यादा सुरक्षा देने वाला पैड, भारी फ़्लो और डिलीवरी के बाद की ब्लीडिंग के लिए बना।",
  "Leak-proof cover for long sits and nights while bleeding after birth is still heavy.":
    "जब डिलीवरी के बाद की ब्लीडिंग अभी भारी हो, तब लंबे समय बैठने और रातों के लिए लीक-प्रूफ़ कवर।",
  "Soft teen pads and kits, so she's ready if her period starts on the trip.":
    "नरम टीन पैड और किट, ताकि सफ़र में पीरियड शुरू हो जाए तो वह तैयार रहे।",
  "XL by day and XL+ for nights and long journeys, all in one box.":
    "दिन में XL और रात व लंबे सफ़र के लिए XL+, सब एक ही डिब्बे में।",
  "Light pads for light days, with a few spare in case the flow picks up.":
    "हल्के दिनों के लिए हल्के पैड, और फ़्लो बढ़ जाए तो कुछ एक्स्ट्रा।",
  "Travel and stress can bring a period early, so pack a box with every size.":
    "सफ़र और तनाव से पीरियड जल्दी आ सकता है, इसलिए हर साइज़ वाला डिब्बा पैक करें।",
  "Leak-proof for 10 to 12 hours: made for overnight journeys and long stretches with no toilet.":
    "10 से 12 घंटे तक लीक-प्रूफ़: रात भर के सफ़र और बिना टॉयलेट वाले लंबे रास्तों के लिए बनी।",
  "For spotting and the light days at the end of a period.":
    "स्पॉटिंग और पीरियड के आख़िर के हल्के दिनों के लिए।",
  "Reusable, with up to 12 hours of wear and nothing to bin, if you've already practised at home.":
    "दोबारा इस्तेमाल होने वाला, 12 घंटे तक पहन सकते हैं और कुछ फेंकना नहीं पड़ता, अगर आप घर पर पहले से प्रैक्टिस कर चुकी हैं।",
  "The option made for swimming, if you've already practised with it at home.":
    "तैराकी के लिए बना विकल्प, अगर आप घर पर पहले से इसकी प्रैक्टिस कर चुकी हैं।",
  "Discharge often increases in pregnancy: thin liners keep you fresh on long days.":
    "प्रेग्नेंसी में डिस्चार्ज अक्सर बढ़ जाता है: पतले लाइनर लंबे दिनों में ताज़गी बनाए रखते हैं।",

  // ---- trip planner: checklist
  "Enough seat covers for every toilet stop, plus a few spare": "हर टॉयलेट स्टॉप के लिए काफ़ी सीट कवर, साथ में कुछ एक्स्ट्रा",
  "Pee and puke bags: about 2 per traveller for the day": "पी और पुक बैग: दिन भर के लिए हर यात्री के लगभग 2",
  "Pee and puke bags: about 2 per traveller for each travel day, plus a few spare":
    "पी और पुक बैग: सफ़र के हर दिन के लिए हर यात्री के लगभग 2, साथ में कुछ एक्स्ट्रा",
  "Each bag holds up to 700 ml and can be used 2 to 3 times: bin it once full, or 24 hours after opening":
    "हर बैग में 700 ml तक आता है और 2 से 3 बार इस्तेमाल हो सकता है: भरने पर, या खोलने के 24 घंटे बाद, डस्टबिन में डालें",
  "The pee funnel in its cotton pouch, practised once at home before you go":
    "कॉटन पाउच में पी फ़नल, जाने से पहले घर पर एक बार प्रैक्टिस किया हुआ",
  "One funnel for each woman or girl, as a funnel shouldn't be shared":
    "हर महिला या लड़की का अपना फ़नल, क्योंकि फ़नल शेयर नहीं करना चाहिए",
  "Pads: about 4 to 5 a day for each day a period may fall on the trip, plus a spare pack":
    "पैड: सफ़र में जितने दिन पीरियड आ सकता है, हर दिन के लगभग 4 से 5, साथ में एक एक्स्ट्रा पैक",
  "A night pouch by your pillow: a fresh pad, wipes and a disposal bag":
    "तकिए के पास एक रात वाला पाउच: एक नया पैड, वाइप्स और एक डिस्पोज़ल बैग",
  "Period care in your hand luggage, not the checked bag": "पीरियड का सामान हैंड लगेज में रखें, चेक-इन बैग में नहीं",
  "All the period care you need, as small towns and hill routes may not stock your size":
    "पीरियड का सारा ज़रूरी सामान साथ रखें, क्योंकि छोटे शहरों और पहाड़ी रास्तों पर आपका साइज़ शायद न मिले",
  "Spare underwear and dark, loose clothes for period days": "पीरियड के दिनों के लिए एक्स्ट्रा अंडरवियर और गहरे रंग के ढीले कपड़े",
  "A hot water bottle or heat patch for cramp days": "क्रैम्प वाले दिनों के लिए गर्म पानी की बोतल या हीट पैच",
  "New to cups? Practise for a cycle or two at home first, and carry a few pads as backup":
    "कप पहली बार? पहले एक-दो साइकिल घर पर प्रैक्टिस करें, और बैकअप के लिए कुछ पैड साथ रखें",
  "Show her how to wrap and bin a pad, and tell her it's fine to ask you or a teacher for help":
    "उसे पैड लपेटकर डस्टबिन में डालना सिखाएँ, और बताएँ कि आपसे या टीचर से मदद माँगना बिल्कुल ठीक है",
  "A few pads anyway: travel, stress and altitude can bring a period early":
    "फिर भी कुछ पैड रखें: सफ़र, तनाव और ऊँचाई से पीरियड जल्दी आ सकता है",
  "Soon after birth: ask your doctor before travelling, and carry plenty of XL+ pads":
    "डिलीवरी के कुछ समय बाद: सफ़र से पहले डॉक्टर से पूछें, और भरपूर XL+ पैड साथ रखें",
  "Pregnancy: check with your doctor before a long trip, and carry your pregnancy file":
    "प्रेग्नेंसी: लंबे सफ़र से पहले डॉक्टर से पूछ लें, और अपनी प्रेग्नेंसी फ़ाइल साथ रखें",
  "Walk a little at every stop and keep sipping water, even though you'll pee more":
    "हर स्टॉप पर थोड़ा चलें और घूँट-घूँट पानी पीती रहें, भले ही पेशाब ज़्यादा लगे",
  "Toilet stops every hour or two, with everyone going, even if they say they don't need to":
    "हर एक-दो घंटे में टॉयलेट स्टॉप, और सब जाएँ, भले ही वे कहें कि ज़रूरत नहीं है",
  "Spare clothes for each child, and a bag for wet clothes": "हर बच्चे के लिए एक्स्ट्रा कपड़े, और गीले कपड़ों के लिए एक बैग",
  "Diapers or pull-ups and a changing mat for the little one": "छोटे बच्चे के लिए डायपर या पुल-अप और एक चेंजिंग मैट",
  "Take little ones into the cubicle with you, and wash hands together after":
    "छोटे बच्चों को अपने साथ टॉयलेट के अंदर ले जाएँ, और बाद में साथ में हाथ धोएँ",
  "For elderly parents: a lower berth or aisle seat near the toilet, and a stop every 1 to 2 hours":
    "बुज़ुर्ग माता-पिता के लिए: टॉयलेट के पास लोअर बर्थ या आइल सीट, और हर 1 से 2 घंटे में एक स्टॉप",
  "For motion sickness: sit facing forward by a window, eat light before you set off, and keep a bag within reach":
    "मोशन सिकनेस के लिए: खिड़की के पास आगे की ओर मुँह करके बैठें, निकलने से पहले हल्का खाएँ, और एक बैग हाथ के पास रखें",
  "Go at every good stop, even if you don't feel the need yet": "हर अच्छे स्टॉप पर टॉयलेट जाएँ, भले ही अभी ज़रूरत न लगे",
  "Ask for a Western toilet where you can, and keep the funnel handy for squat pans":
    "जहाँ हो सके वेस्टर्न टॉयलेट माँगें, और इंडियन (बैठने वाले) टॉयलेट के लिए फ़नल पास रखें",
  "Don't hold your pee: go when you need to, keep sipping water and wipe front to back":
    "पेशाब रोककर न रखें: ज़रूरत हो तब जाएँ, घूँट-घूँट पानी पीते रहें और आगे से पीछे की ओर पोंछें",
  "Pack out every used pad, cover and wipe in a sealed bag, and never bury or leave them behind":
    "हर इस्तेमाल किया पैड, कवर और वाइप एक सील बैग में वापस लाएँ, उन्हें न कभी गाड़ें, न वहीं छोड़ें",
  "Warm layers that are quick to manage in a cold toilet, and go before you head out":
    "गर्म कपड़ों की परतें जो ठंडे टॉयलेट में जल्दी संभल जाएँ, और बाहर निकलने से पहले टॉयलेट हो आएँ",
  "Breathable cotton underwear, a spare pair for every day, and a bag for wet clothes":
    "हवादार कॉटन अंडरवियर, हर दिन के लिए एक एक्स्ट्रा जोड़ी, और गीले कपड़ों के लिए एक बैग",
  "Extra drinking water and loose cotton clothes, as heat dries you out fast":
    "पीने का एक्स्ट्रा पानी और ढीले कॉटन कपड़े, क्योंकि गर्मी में शरीर जल्दी सूखता है",
  "A waterproof pouch for pads, covers and wipes, and quick-dry clothes":
    "पैड, कवर और वाइप्स के लिए एक वॉटरप्रूफ़ पाउच, और जल्दी सूखने वाले कपड़े",
  "Everything you'll need, as shops may be few and far between": "ज़रूरत का सारा सामान साथ रखें, क्योंकि दुकानें कम और दूर-दूर हो सकती हैं",
  "For long darshan queues: a pee and puke bag and wipes in a small sling bag":
    "लंबी दर्शन की लाइनों के लिए: एक छोटे स्लिंग बैग में पी और पुक बैग और वाइप्स",
  "For sarees and lehengas: go before you're fully dressed, and keep a small potli with wipes and a spare pad":
    "साड़ी और लहंगे के लिए: पूरी तरह तैयार होने से पहले टॉयलेट हो आएँ, और वाइप्स व एक एक्स्ट्रा पैड वाली छोटी पोटली रखें",
  "A small pouch for the office: pads, liners, spare underwear, seat covers and wipes":
    "ऑफ़िस के लिए एक छोटा पाउच: पैड, लाइनर, एक्स्ट्रा अंडरवियर, सीट कवर और वाइप्स",
  "A bag or drawer kit: a few pads, liners, seat covers, wipes and spare underwear. Restock it when you use something.":
    "बैग या दराज़ की किट: कुछ पैड, लाइनर, सीट कवर, वाइप्स और एक्स्ट्रा अंडरवियर। कुछ इस्तेमाल हो जाए तो दोबारा भर लें।",
  "Seat covers and a couple of pee bags in your bag for long commutes": "लंबे आने-जाने के लिए बैग में सीट कवर और दो-एक पी बैग",
  "Loose, pull-on clothes, and a shawl or dupatta that doubles as a privacy screen":
    "ढीले, आसानी से उतरने वाले कपड़े, और एक शॉल या दुपट्टा जो परदे का काम भी करे",
  "Pack out every used cover, bag and wipe in a sealed bag, and never bury or leave them behind":
    "हर इस्तेमाल किया कवर, बैग और वाइप एक सील बैग में वापस लाएँ, उन्हें न कभी गाड़ें, न वहीं छोड़ें",
  "Loose, comfortable clothes that are quick to manage at a toilet stop": "ढीले, आरामदायक कपड़े जो टॉयलेट स्टॉप पर जल्दी संभल जाएँ",
  "Tissues, plus a zip pouch for used covers, bags and wipes until you reach a bin":
    "टिशू, और डस्टबिन मिलने तक इस्तेमाल किए कवर, बैग और वाइप्स के लिए एक ज़िप पाउच",
  "Hand sanitiser and a small pack of wet wipes": "हैंड सैनिटाइज़र और वेट वाइप्स का एक छोटा पैक",
  "Tissues, plus a zip pouch for used pads, covers and wipes until you reach a bin":
    "टिशू, और डस्टबिन मिलने तक इस्तेमाल किए पैड, कवर और वाइप्स के लिए एक ज़िप पाउच",
  "A water bottle to sip from through the day": "दिन भर घूँट-घूँट पीने के लिए पानी की बोतल",
  "Pack flat: seat covers and bags slip into a handbag pocket": "चपटा पैक करें: सीट कवर और बैग हैंडबैग की जेब में आ जाते हैं",
  "To save space, a period panty or a cup replaces several pads": "जगह बचाने के लिए, एक पीरियड पैंटी या कप कई पैड की जगह ले लेता है",
  "The funnel lasts for years and a cup is reusable; seat covers are biodegradable paper, to bin, never flush":
    "फ़नल सालों चलता है और कप दोबारा इस्तेमाल होता है; सीट कवर बायोडिग्रेडेबल पेपर के हैं, डस्टबिन में डालें, कभी फ़्लश न करें",
  "An emergency pouch: a pad, a seat cover, a pee bag, wipes and spare underwear":
    "एक इमरजेंसी पाउच: एक पैड, एक सीट कवर, एक पी बैग, वाइप्स और एक्स्ट्रा अंडरवियर",
  "An emergency pouch: a seat cover, a pee bag, wipes and spare underwear":
    "एक इमरजेंसी पाउच: एक सीट कवर, एक पी बैग, वाइप्स और एक्स्ट्रा अंडरवियर",
  "Save 112, India's emergency number, in every phone": "भारत का इमरजेंसी नंबर 112 हर फ़ोन में सेव करें",
  "Order at least a week before you leave, and try anything new at home first":
    "निकलने से कम से कम एक हफ़्ता पहले ऑर्डर करें, और कोई भी नई चीज़ पहले घर पर आज़मा लें",
  "Wherever you are, see a doctor straight away for heavy bleeding, severe pain, fever or burning when you pee. Emergency: 112.":
    "आप जहाँ भी हों, भारी ब्लीडिंग, तेज़ दर्द, बुख़ार या पेशाब में जलन हो तो तुरंत डॉक्टर को दिखाएँ। इमरजेंसी: 112।",
  "Wherever you are, see a doctor straight away for a high fever, severe pain or vomiting that won't stop. Emergency: 112.":
    "आप जहाँ भी हों, तेज़ बुख़ार, तेज़ दर्द या न रुकने वाली उल्टी हो तो तुरंत डॉक्टर को दिखाएँ। इमरजेंसी: 112।",

  // ---- trip planner: tips, titles, intros
  "Yatra routes get crowded: go to the toilet before every queue or climb, and keep a pee bag in your sling bag.":
    "यात्रा के रास्तों पर भीड़ होती है: हर लाइन या चढ़ाई से पहले टॉयलेट हो आएँ, और स्लिंग बैग में एक पी बैग रखें।",
  "Leave no trace: pack out everything you use, and pee downwind, away from water and paths.":
    "कोई निशान न छोड़ें: इस्तेमाल की हर चीज़ वापस लाएँ, और हवा की दिशा में, पानी और रास्तों से दूर पेशाब करें।",
  "Book an aisle seat or a lower berth near the toilet, and stop every one to two hours on the road.":
    "टॉयलेट के पास आइल सीट या लोअर बर्थ बुक करें, और सड़क पर हर एक-दो घंटे में रुकें।",
  "Stop every hour or two and have everyone go, even if they say they don't need to.":
    "हर एक-दो घंटे में रुकें और सबको टॉयलेट भेजें, भले ही वे कहें कि ज़रूरत नहीं है।",
  "Older people dehydrate faster, so remind them to sip water, and plan a stop every one to two hours.":
    "बुज़ुर्गों में पानी की कमी जल्दी होती है, इसलिए उन्हें घूँट-घूँट पानी पीने की याद दिलाएँ, और हर एक-दो घंटे में एक स्टॉप रखें।",
  "On winding roads, keep a pee and puke bag open within reach: it gels in about 60 seconds and locks in the smell.":
    "घुमावदार सड़कों पर एक पी और पुक बैग खोलकर हाथ के पास रखें: यह लगभग 60 सेकंड में जेल बन जाता है और गंध बंद कर देता है।",
  "Wear your longest protection under heavy outfits, and keep a small pouch with a friend for quick toilet trips.":
    "भारी कपड़ों के नीचे सबसे लंबी सुरक्षा पहनें, और जल्दी टॉयलेट जाने के लिए एक छोटा पाउच किसी सहेली के पास रखें।",
  "Keep a small kit in your bag or desk drawer, and restock it as soon as you use something.":
    "बैग या डेस्क की दराज़ में एक छोटी किट रखें, और कुछ इस्तेमाल होते ही उसे दोबारा भर लें।",
  "For a long trip, carry enough seat covers for every toilet stop and a few spare pee bags, so you never have to ration them.":
    "लंबे सफ़र के लिए, हर टॉयलेट स्टॉप के हिसाब से काफ़ी सीट कवर और कुछ एक्स्ट्रा पी बैग रखें, ताकि आपको उन्हें बचा-बचाकर इस्तेमाल न करना पड़े।",
  "Keep everything in one pouch you can reach without unpacking the bag.": "सब कुछ एक ऐसे पाउच में रखें जो बैग खोले बिना हाथ आ जाए।",
  "Your everyday hygiene kit": "आपकी रोज़ की हाइजीन किट",
  "Your trip hygiene plan": "आपके सफ़र का हाइजीन प्लान",
  "Here's what I'd keep in your bag every day.": "मैं रोज़ आपके बैग में ये रखने का सुझाव दूँगी।",
  "Here's the kit and packing list I'd suggest for this trip.": "इस सफ़र के लिए मेरी सुझाई किट और पैकिंग लिस्ट ये है।",

  // ---- cycle phase guide
  "Menstrual phase: your period": "मेंस्ट्रुअल फ़ेज़: आपका पीरियड",
  "Day 1 is the first day of bleeding. Hormones are at their lowest, so energy can dip and cramps are common. It's a normal, healthy part of the cycle.":
    "ब्लीडिंग का पहला दिन डे 1 होता है। हार्मोन सबसे कम होते हैं, इसलिए एनर्जी कम लग सकती है और क्रैम्प आम हैं। यह साइकिल का एक सामान्य, स्वस्थ हिस्सा है।",
  "Follicular phase: energy building": "फ़ॉलिक्युलर फ़ेज़: एनर्जी बढ़ रही है",
  "After your period, hormones start to rise. Many people feel their energy, mood and focus pick up through these days.":
    "पीरियड के बाद हार्मोन बढ़ने लगते हैं। इन दिनों बहुत-सी महिलाओं को एनर्जी, मूड और ध्यान बेहतर लगता है।",
  "Ovulation: often your peak": "ओव्यूलेशन: अक्सर आपका सबसे अच्छा समय",
  "Around the middle of the cycle an egg is released. Energy and mood often peak, and discharge may turn clear and stretchy, like raw egg white.":
    "साइकिल के बीच के आसपास एक अंडा निकलता है। एनर्जी और मूड अक्सर सबसे अच्छे होते हैं, और डिस्चार्ज कच्चे अंडे की सफ़ेदी जैसा साफ़ और खिंचने वाला हो सकता है।",
  "Luteal phase: winding down": "ल्यूटियल फ़ेज़: रफ़्तार धीमी",
  "In the week or two before your period, energy winds down. Bloating, tender breasts, cravings or mood changes (PMS) can show up, then ease once your period starts.":
    "पीरियड से पहले के एक-दो हफ़्तों में एनर्जी कम होने लगती है। पेट फूलना, ब्रेस्ट में दर्द, क्रेविंग या मूड में बदलाव (PMS) हो सकते हैं, जो पीरियड शुरू होते ही कम हो जाते हैं।",
  "Your cycle in four phases": "आपकी साइकिल के चार फ़ेज़",
  "Your cycle has four phases: your period, the days after it, ovulation around the middle, and the days before your next period. Logging your dates is the easiest way to see where you are.":
    "आपकी साइकिल के चार फ़ेज़ हैं: आपका पीरियड, उसके बाद के दिन, बीच के आसपास ओव्यूलेशन, और अगले पीरियड से पहले के दिन। अपनी तारीख़ें लॉग करना यह जानने का सबसे आसान तरीका है कि आप कहाँ हैं।",
  "Plan lighter tasks for your heaviest days, and take short breaks": "सबसे भारी दिनों के लिए हल्के काम रखें, और छोटे-छोटे ब्रेक लें",
  "A good time to start new tasks, plan ahead or take on harder study": "नए काम शुरू करने, आगे की प्लानिंग या मुश्किल पढ़ाई के लिए अच्छा समय",
  "Many feel most social and confident now: good for talks, meetings and big days":
    "इस समय बहुत-सी महिलाएँ सबसे ज़्यादा मिलनसार और आत्मविश्वासी महसूस करती हैं: बातचीत, मीटिंग और बड़े दिनों के लिए अच्छा",
  "Finish things off rather than starting big new tasks, and keep your to-do list short":
    "बड़े नए काम शुरू करने के बजाय चल रहे काम पूरे करें, और अपनी काम की लिस्ट छोटी रखें",
  "Gentle movement: a short walk, stretching or easy yoga, and rest if you need it":
    "हल्की हलचल: थोड़ी सैर, स्ट्रेचिंग या आसान योग, और ज़रूरत हो तो आराम",
  "Energy is rising: a good time for brisk walks, dance, sport or strength work":
    "एनर्जी बढ़ रही है: तेज़ सैर, डांस, खेल या स्ट्रेंथ एक्सरसाइज़ के लिए अच्छा समय",
  "If you feel strong, enjoy harder workouts, and warm up well": "अगर ताक़त महसूस हो, तो कड़ी एक्सरसाइज़ का मज़ा लें, और अच्छे से वॉर्म-अप करें",
  "Swap hard sessions for walking, yoga or swimming if you feel heavy": "भारीपन लगे तो कड़ी एक्सरसाइज़ की जगह सैर, योग या तैराकी करें",
  "Iron-rich foods like dal, rajma, palak and eggs, with lemon or amla to help your body take up the iron":
    "दाल, राजमा, पालक और अंडे जैसे आयरन वाले खाने, साथ में नींबू या आँवला ताकि शरीर आयरन अच्छे से ले सके",
  "Fresh, balanced meals: vegetables, protein, and curd or other fermented foods":
    "ताज़ा, संतुलित खाना: सब्ज़ियाँ, प्रोटीन, और दही या दूसरे ख़मीर वाले खाने",
  "Plenty of water, fruit and vegetables, and regular meals": "भरपूर पानी, फल और सब्ज़ियाँ, और समय पर खाना",
  "Regular meals with whole grains and protein help steady cravings; go easy on salt, sugar and caffeine":
    "साबुत अनाज और प्रोटीन के साथ समय पर खाना क्रेविंग को काबू में रखता है; नमक, चीनी और कैफ़ीन कम रखें",
  "Sleep a little longer if you can, and be kind to yourself on low days": "हो सके तो थोड़ा ज़्यादा सोएँ, और उदास दिनों में ख़ुद के साथ नरमी रखें",
  "Make the most of a better mood: catch up with friends or plan something you enjoy":
    "अच्छे मूड का पूरा फ़ायदा उठाएँ: दोस्तों से मिलें या कुछ ऐसा प्लान करें जो आपको पसंद हो",
  "High energy can make sleep lighter, so keep a regular bedtime": "ज़्यादा एनर्जी से नींद हल्की हो सकती है, इसलिए सोने का समय तय रखें",
  "Mood dips are common before a period: rest, talk to someone close, and keep a regular bedtime":
    "पीरियड से पहले मूड गिरना आम है: आराम करें, किसी क़रीबी से बात करें, और सोने का समय तय रखें",
  "Change pads every 4 to 6 hours and keep the skin clean and dry to avoid rashes":
    "रैश से बचने के लिए हर 4 से 6 घंटे में पैड बदलें और त्वचा साफ़ और सूखी रखें",
  "Discharge is usually light now; a thin liner is enough if you need one": "इस समय डिस्चार्ज आमतौर पर हल्का होता है; ज़रूरत हो तो पतला लाइनर काफ़ी है",
  "Clear, stretchy discharge is normal around ovulation; a liner keeps you fresh":
    "ओव्यूलेशन के आसपास साफ़, खिंचने वाला डिस्चार्ज सामान्य है; लाइनर से ताज़गी बनी रहती है",
  "Spots on the chin or jaw are common before a period: wash gently and don't pick":
    "पीरियड से पहले ठुड्डी या जबड़े पर दाने आम हैं: हल्के से धोएँ और उन्हें न छेड़ें",
  "Heat on the lower belly, like a hot water bottle, eases most cramps": "निचले पेट पर सेक, जैसे गर्म पानी की बोतल, ज़्यादातर क्रैम्प में आराम देता है",
  "Bloating usually settles now; pain outside your period that keeps coming back is worth a doctor's check":
    "इस समय पेट फूलना आमतौर पर ठीक हो जाता है; पीरियड के अलावा बार-बार होने वाले दर्द के लिए डॉक्टर को दिखाना ठीक रहेगा",
  "A twinge on one side around ovulation is common; severe or lasting pain needs a doctor":
    "ओव्यूलेशन के आसपास एक तरफ़ हल्की चुभन आम है; तेज़ या लगातार दर्द हो तो डॉक्टर को दिखाएँ",
  "For bloating, go easy on salty snacks and fizzy drinks, and sip water through the day":
    "पेट फूलने पर नमकीन स्नैक्स और सोडा वाले ड्रिंक कम लें, और दिन भर घूँट-घूँट पानी पिएँ",
  "Period (about days 1 to 5): energy may dip, so rest, use heat for cramps and eat iron-rich foods":
    "पीरियड (लगभग डे 1 से 5): एनर्जी कम हो सकती है, इसलिए आराम करें, क्रैम्प के लिए सेक लें और आयरन वाले खाने खाएँ",
  "After your period (about days 6 to 13): energy and mood often rise": "पीरियड के बाद (लगभग डे 6 से 13): एनर्जी और मूड अक्सर बेहतर होते हैं",
  "Ovulation (around the middle): clear, stretchy discharge and often your peak energy":
    "ओव्यूलेशन (बीच के आसपास): साफ़, खिंचने वाला डिस्चार्ज और अक्सर सबसे ज़्यादा एनर्जी",
  "Before your period (the last week or two): PMS like bloating, cravings or mood changes can show up":
    "पीरियड से पहले (आख़िरी एक-दो हफ़्ते): पेट फूलना, क्रेविंग या मूड में बदलाव जैसे PMS हो सकते हैं",
  "Log your period in the Period Tracker to see which phase you're in": "आप किस फ़ेज़ में हैं, यह देखने के लिए Period Tracker में अपना पीरियड लॉग करें",
  "Tracking phases isn't reliable birth control: use contraception if you don't want to get pregnant":
    "फ़ेज़ ट्रैक करना भरोसेमंद गर्भनिरोध नहीं है: अगर आप प्रेग्नेंट नहीं होना चाहतीं, तो गर्भनिरोधक इस्तेमाल करें",
  "See a doctor if cycles are often shorter than 21 days or longer than 35, a period lasts over 7 days, or you bleed between periods":
    "अगर साइकिल अक्सर 21 दिन से छोटी या 35 दिन से लंबी हो, पीरियड 7 दिन से ज़्यादा चले, या दो पीरियड के बीच ब्लीडिंग हो, तो डॉक्टर को दिखाएँ",
  "Rash-free, dermatologically tested pads for your period days. The pad size finder picks L, XL or XL+.":
    "पीरियड के दिनों के लिए रैश-फ़्री, डर्मेटोलॉजिकली टेस्टेड पैड। पैड साइज़ फ़ाइंडर L, XL या XL+ में से सही साइज़ चुनता है।",
  "Thin liners for the light discharge that comes and goes after your period.":
    "पीरियड के बाद कभी-कभी होने वाले हल्के डिस्चार्ज के लिए पतले लाइनर।",
  "Clear, stretchy discharge is common around ovulation: a thin liner keeps you fresh.":
    "ओव्यूलेशन के आसपास साफ़, खिंचने वाला डिस्चार्ज आम है: पतला लाइनर ताज़गी बनाए रखता है।",
  "Keep pads in your bag in the days before your period, so it never catches you out.":
    "पीरियड से पहले के दिनों में बैग में पैड रखें, ताकि यह कभी अचानक परेशान न करे।",
  "Log your period to see your phase, your next dates and your PMS days.":
    "अपना फ़ेज़, अगली तारीख़ें और PMS वाले दिन देखने के लिए अपना पीरियड लॉग करें।",
  "Phases vary from person to person, so treat this as a guide and go by how your body feels.":
    "फ़ेज़ हर किसी में अलग होते हैं, इसलिए इसे एक गाइड मानें और अपने शरीर के एहसास पर चलें।",
  "When your cycle shifts, the phases shift too. Logging a few periods in the tracker shows your own pattern.":
    "जब साइकिल आगे-पीछे होती है, तो फ़ेज़ भी खिसकते हैं। ट्रैकर में कुछ पीरियड लॉग करने से आपका अपना पैटर्न दिखता है।",
  "With an irregular cycle, phases are hard to predict. Log your periods, and see a doctor if you go 3 months without one.":
    "अनियमित साइकिल में फ़ेज़ का अंदाज़ा लगाना मुश्किल है। अपने पीरियड लॉग करें, और 3 महीने तक पीरियड न आए तो डॉक्टर को दिखाएँ।",
  "Hormonal contraception changes these natural phases, so this guide may not match how you feel. Your doctor can tell you what to expect.":
    "हार्मोनल गर्भनिरोधक इन प्राकृतिक फ़ेज़ को बदल देता है, इसलिए यह गाइड शायद आपके एहसास से मेल न खाए। आपके डॉक्टर बता सकते हैं कि क्या उम्मीद करें।",
  "In the first couple of years, irregular cycles are common. Log your periods so you can start to see a pattern.":
    "शुरुआती एक-दो सालों में अनियमित साइकिल आम है। अपने पीरियड लॉग करें ताकि धीरे-धीरे पैटर्न दिखने लगे।",

  // ---- period comfort plan
  "Heat on your lower belly: a hot water bottle or heat patch": "निचले पेट पर सेक: गर्म पानी की बोतल या हीट पैच",
  "Gentle movement, like a short walk, cat-cow or child's pose": "हल्की हलचल, जैसे थोड़ी सैर, कैट-काउ या चाइल्ड पोज़",
  "Go easy on salt and fizzy drinks, and sip water through the day": "नमक और सोडा वाले ड्रिंक कम लें, और दिन भर घूँट-घूँट पानी पिएँ",
  "Warm, home-cooked meals, eaten little and often": "गर्म, घर का बना खाना, थोड़ा-थोड़ा और बार-बार",
  "Plan lighter days where you can, and tell someone close how you feel": "जहाँ हो सके हल्के दिन रखें, और किसी क़रीबी को बताएँ कि आप कैसा महसूस कर रही हैं",
  "A short walk outdoors or a few slow, deep breaths when mood dips": "मूड गिरे तो बाहर थोड़ी सैर या कुछ धीमी, गहरी साँसें",
  "A regular bedtime, and iron-rich foods like dal, palak, chana and eggs": "सोने का तय समय, और दाल, पालक, चना और अंडे जैसे आयरन वाले खाने",
  "Wear your longest protection at night, like an XL+ pad or a period panty, so you can sleep without checking":
    "रात में सबसे लंबी सुरक्षा पहनें, जैसे XL+ पैड या पीरियड पैंटी, ताकि बिना बार-बार देखे सो सकें",
  "Regular meals and water, and rest in a dark, quiet room when a headache comes":
    "समय पर खाना और पानी, और सिरदर्द हो तो अंधेरे, शांत कमरे में आराम",
  "Keep fruit, nuts or roasted chana handy, and eat every few hours to steady cravings":
    "फल, मेवे या भुना चना पास रखें, और क्रेविंग काबू में रखने के लिए हर कुछ घंटे में खाएँ",
  "Wash your face gently twice a day, and don't pick at spots": "दिन में दो बार चेहरा हल्के से धोएँ, और दानों को न छेड़ें",
  "Change pads every 4 to 6 hours, and keep the skin clean and dry": "हर 4 से 6 घंटे में पैड बदलें, और त्वचा साफ़ और सूखी रखें",
  "Mark your expected dates so the week never takes you by surprise": "अपनी अनुमानित तारीख़ें नोट करें ताकि यह हफ़्ता कभी अचानक न आए",
  "Note your symptoms in the Period Tracker to see which days PMS starts":
    "PMS किन दिनों शुरू होता है, यह देखने के लिए Period Tracker में अपने लक्षण नोट करें",
  "Keep the first day or two lighter where you can": "जहाँ हो सके, पहले एक-दो दिन हल्के रखें",
  "A pouch in your school bag: 2 pads, spare underwear, a disposal bag and wipes":
    "स्कूल बैग में एक पाउच: 2 पैड, एक्स्ट्रा अंडरवियर, एक डिस्पोज़ल बैग और वाइप्स",
  "A desk drawer kit: pads, liners, spare underwear and a heat patch": "डेस्क की दराज़ में किट: पैड, लाइनर, एक्स्ट्रा अंडरवियर और एक हीट पैच",
  "Change just before a long shift, and pick a longer pad or a period panty":
    "लंबी शिफ़्ट से ठीक पहले बदलें, और लंबा पैड या पीरियड पैंटी चुनें",
  "Rest counts too: share the chores on your hardest day": "आराम भी ज़रूरी है: सबसे मुश्किल दिन घर के काम बाँट लें",
  "Exercise is fine on your period: a cup or a period panty gives you freedom to move":
    "पीरियड में एक्सरसाइज़ ठीक है: कप या पीरियड पैंटी से आप खुलकर हिल-डुल सकती हैं",
  "If low mood feels heavy, or you have thoughts of harming yourself, call Tele MANAS on 14416, free and confidential":
    "अगर उदासी भारी लगे, या ख़ुद को नुक़सान पहुँचाने के ख़याल आएँ, तो Tele MANAS को 14416 पर कॉल करें, मुफ़्त और गोपनीय",
  "See a doctor if pain stops you from your day, a pad soaks through in an hour or two, or you feel faint":
    "अगर दर्द से आपका दिन रुक जाए, पैड एक-दो घंटे में भीग जाए, या चक्कर जैसा लगे, तो डॉक्टर को दिखाएँ",
  "Rash-free, dermatologically tested pads are gentle on skin that chafes.": "रैश-फ़्री, डर्मेटोलॉजिकली टेस्टेड पैड रगड़ खाने वाली त्वचा पर नरम रहते हैं।",
  "Dermatologically tested, rash-free pads in the size that suits your flow.": "डर्मेटोलॉजिकली टेस्टेड, रैश-फ़्री पैड, आपके फ़्लो के हिसाब से सही साइज़ में।",
  "Leak-proof all night, so you can sleep without checking.": "पूरी रात लीक-प्रूफ़, ताकि आप बिना बार-बार देखे सो सकें।",
  "Medical-grade silicone, up to 12 hours of wear, and fine for sport and swimming.":
    "मेडिकल-ग्रेड सिलिकॉन, 12 घंटे तक पहन सकते हैं, और खेल और तैराकी के लिए भी ठीक।",
  "Log your period and symptoms to see your PMS days coming.": "अपने PMS वाले दिन पहले से देखने के लिए अपना पीरियड और लक्षण लॉग करें।",
  "Your period comfort plan": "आपका पीरियड आराम प्लान",
  "PMS is real, and planning for the days before your period helps. Here's a plan for your week.":
    "PMS सच में होता है, और पीरियड से पहले के दिनों की तैयारी मदद करती है। आपके हफ़्ते के लिए प्लान ये है।",
  "The first day or two are often the hardest. Here's a plan to make them easier.":
    "पहले एक-दो दिन अक्सर सबसे मुश्किल होते हैं। उन्हें आसान बनाने का प्लान ये है।",
  "Here's a simple plan for your whole period week.": "आपके पूरे पीरियड हफ़्ते के लिए एक आसान प्लान ये है।",
  "Pain or mood changes that stop your day, or are new or getting worse, deserve a doctor's check. You don't have to put up with them.":
    "जो दर्द या मूड में बदलाव आपका दिन रोक दें, या नए हों या बढ़ रहे हों, उनके लिए डॉक्टर को दिखाना चाहिए। आपको इन्हें चुपचाप सहने की ज़रूरत नहीं है।",
  "Small changes add up: try the plan for two or three cycles and keep what helps you most.":
    "छोटे बदलाव मिलकर असर करते हैं: इस प्लान को दो-तीन साइकिल तक आज़माएँ और जो सबसे ज़्यादा मदद करे, उसे अपनाएँ।",

  // ---- first period readiness
  "Talk it through early and simply: a period is a normal, healthy sign of growing up":
    "पहले से और आसान शब्दों में बात करें: पीरियड बड़े होने का एक सामान्य, स्वस्थ संकेत है",
  "Put a small kit in the school bag: 2 pads, spare underwear, wipes and a disposal bag":
    "स्कूल बैग में एक छोटी किट रखें: 2 पैड, एक्स्ट्रा अंडरवियर, वाइप्स और एक डिस्पोज़ल बैग",
  "Practise at home: open a pad, stick it on underwear, then wrap it and bin it":
    "घर पर प्रैक्टिस करें: पैड खोलें, अंडरवियर पर चिपकाएँ, फिर लपेटकर डस्टबिन में डालें",
  "Keep spare underwear and a dark pair of leggings in the bag": "बैग में एक्स्ट्रा अंडरवियर और गहरे रंग की एक लेगिंग रखें",
  "Agree who to ask at school, like a teacher or the school nurse, and that asking is always fine":
    "तय कर लें कि स्कूल में किससे पूछना है, जैसे टीचर या स्कूल नर्स, और यह कि पूछना हमेशा ठीक है",
  "Note the first day of each period in the Period Tracker to learn the pattern":
    "पैटर्न समझने के लिए हर पीरियड का पहला दिन Period Tracker में नोट करें",
  "If it starts at school: tie a jumper round the waist, head to the toilet and use the kit":
    "अगर स्कूल में शुरू हो जाए: कमर पर स्वेटर बाँधें, टॉयलेट जाएँ और किट इस्तेमाल करें",
  "A longer pad or a period panty on heavy days, and dark clothes, take the stress out of stains":
    "भारी दिनों में लंबा पैड या पीरियड पैंटी, और गहरे रंग के कपड़े, दाग की चिंता दूर कर देते हैं",
  "Heat on the lower belly and a short walk help most cramps": "निचले पेट पर सेक और थोड़ी सैर ज़्यादातर क्रैम्प में मदद करते हैं",
  "Seat covers for school toilets: use, fold and bin, never flush": "स्कूल के टॉयलेट के लिए सीट कवर: इस्तेमाल करें, मोड़ें और डस्टबिन में डालें, कभी फ़्लश न करें",
  "Sport and PE are fine on a period, and a period panty gives freedom to move":
    "पीरियड में खेल और PE बिल्कुल ठीक हैं, और पीरियड पैंटी से खुलकर हिल-डुल सकते हैं",
  "A longer pad or a period panty for nights, and an old towel under the sheet at first":
    "रातों के लिए लंबा पैड या पीरियड पैंटी, और शुरू में चादर के नीचे एक पुराना तौलिया",
  "Keep it matter-of-fact: everyone gets periods, and there are no silly questions":
    "बात सीधी-सादी रखें: पीरियड सबको आते हैं, और कोई सवाल बेवकूफ़ी भरा नहीं होता",
  "Soft teen pads and kits for the first years of periods, with a guide written for girls.":
    "पीरियड के शुरुआती सालों के लिए नरम टीन पैड और किट, साथ में लड़कियों के लिए लिखी एक गाइड।",
  "A first-period kit to have ready before it starts, with a guide written for girls.":
    "पीरियड शुरू होने से पहले तैयार रखने के लिए पहले पीरियड की किट, साथ में लड़कियों के लिए लिखी एक गाइड।",
  "Thin liners for the white discharge that often comes before the first period.":
    "पहले पीरियड से पहले अक्सर होने वाले सफ़ेद डिस्चार्ज के लिए पतले लाइनर।",
  "Leak-proof cover for nights, sport and heavy days, so stains stop being a worry.":
    "रातों, खेल और भारी दिनों के लिए लीक-प्रूफ़ कवर, ताकि दाग की चिंता ख़त्म हो जाए।",
  "For school toilets: use, fold and bin, never flush.": "स्कूल के टॉयलेट के लिए: इस्तेमाल करें, मोड़ें और डस्टबिन में डालें, कभी फ़्लश न करें।",
  "Note each period's first day to learn the pattern and see the next one coming.":
    "पैटर्न समझने और अगला पीरियड पहले से देखने के लिए हर पीरियड का पहला दिन नोट करें।",
  "No rush: the first period usually comes a year or two after the first signs of puberty":
    "कोई जल्दी नहीं: पहला पीरियड आमतौर पर प्यूबर्टी के पहले संकेतों के एक-दो साल बाद आता है",
  "White discharge often shows up before the first period, so it's a good cue to keep a kit ready":
    "पहले पीरियड से पहले अक्सर सफ़ेद डिस्चार्ज दिखता है, इसलिए यह किट तैयार रखने का अच्छा संकेत है",
  "Early periods are often light, brown or irregular for the first year or two, which is common":
    "शुरुआती एक-दो साल पीरियड अक्सर हल्के, भूरे या अनियमित होते हैं, जो आम बात है",
  "Everything's in place: just restock the kit after each period": "सब कुछ तैयार है: बस हर पीरियड के बाद किट दोबारा भर लें",
  "Puberty signs or a period at 8 or younger are worth a check with a children's doctor":
    "8 साल या उससे कम उम्र में प्यूबर्टी के संकेत या पीरियड हों, तो बच्चों के डॉक्टर को दिखाना ठीक रहेगा",
  "No period by 15, or no signs of puberty by 13, is worth a doctor's check":
    "15 साल तक पीरियड न आए, या 13 साल तक प्यूबर्टी का कोई संकेत न हो, तो डॉक्टर को दिखाना ठीक रहेगा",
  "See a doctor for a pad soaked in under an hour, bleeding for over 7 days, or pain that means missing school":
    "अगर पैड एक घंटे से कम में भीग जाए, ब्लीडिंग 7 दिन से ज़्यादा चले, या दर्द से स्कूल छूटे, तो डॉक्टर को दिखाएँ",
  "Getting ready early": "पहले से तैयारी",
  "Getting ready for the first period": "पहले पीरियड की तैयारी",
  "Settling into periods": "पीरियड की आदत डालना",
  "Here's a calm plan for you, with what to add next.": "आपके लिए एक सुकून भरा प्लान ये है, साथ में आगे क्या जोड़ना है।",
  "Here's a calm plan for her, with what to add next.": "उसके लिए एक सुकून भरा प्लान ये है, साथ में आगे क्या जोड़ना है।",
  "Keep your kit in the same pocket of your bag, so you can grab it without thinking.":
    "अपनी किट बैग की एक ही जेब में रखें, ताकि बिना सोचे झट से निकाल सकें।",
  "Pop a kit in her school bag before her period starts, so she's ready wherever she is.":
    "पीरियड शुरू होने से पहले ही एक किट उसके स्कूल बैग में रख दें, ताकि वह जहाँ भी हो, तैयार रहे।",

  // ---- intimate hygiene check
  "Fresh cotton underwear every day, and sooner if it gets damp": "रोज़ साफ़ कॉटन अंडरवियर, और गीला हो जाए तो पहले ही बदलें",
  "Plain water on the outside is all you need: no soap, douches or sprays inside":
    "बाहर से सादा पानी ही काफ़ी है: अंदर साबुन, डूश या स्प्रे नहीं",
  "Wipe front to back after the toilet, every time": "टॉयलेट के बाद हर बार आगे से पीछे की ओर पोंछें",
  "On period days, change pads every 4 to 6 hours, even on light days": "पीरियड के दिनों में हर 4 से 6 घंटे में पैड बदलें, हल्के दिनों में भी",
  "On public Western seats, use a seat cover rather than sitting straight on the seat":
    "पब्लिक वेस्टर्न सीट पर सीधे बैठने के बजाय सीट कवर इस्तेमाल करें",
  "On discharge days, a thin liner keeps underwear fresh; change it a few times a day":
    "डिस्चार्ज वाले दिनों में पतला लाइनर अंडरवियर को ताज़ा रखता है; इसे दिन में कुछ बार बदलें",
  "Pat dry after a bath, and change out of damp or sweaty clothes soon": "नहाने के बाद थपथपाकर सुखाएँ, और गीले या पसीने वाले कपड़े जल्दी बदलें",
  "Wash hands before and after changing a pad": "पैड बदलने से पहले और बाद में हाथ धोएँ",
  "Keep it up, and replace underwear that's worn thin or stretched": "ऐसे ही जारी रखें, और घिसे या ढीले हो चुके अंडरवियर बदल दें",
  "For a pad rash: change more often, keep the skin dry, and give it air at night where you can":
    "पैड रैश के लिए: पैड जल्दी-जल्दी बदलें, त्वचा सूखी रखें, और हो सके तो रात में हवा लगने दें",
  "A strong fishy smell, itching, or discharge that changes colour or texture is worth a doctor's check, rather than washes or sprays":
    "मछली जैसी तेज़ गंध, खुजली, या रंग या बनावट बदलने वाले डिस्चार्ज के लिए वॉश या स्प्रे के बजाय डॉक्टर को दिखाएँ",
  "See a doctor for itching, a strong smell, sores, or discharge that changes colour or texture":
    "खुजली, तेज़ गंध, घाव, या रंग या बनावट बदलने वाले डिस्चार्ज के लिए डॉक्टर को दिखाएँ",
  "Rash-free, dermatologically tested pads, changed every 4 to 6 hours, are gentle on chafed skin.":
    "रैश-फ़्री, डर्मेटोलॉजिकली टेस्टेड पैड, हर 4 से 6 घंटे में बदले जाएँ, तो रगड़ खाई त्वचा पर नरम रहते हैं।",
  "Thin, breathable liners for everyday discharge, so underwear stays fresh.": "रोज़ के डिस्चार्ज के लिए पतले, हवादार लाइनर, ताकि अंडरवियर ताज़ा रहे।",
  "A slim box in your bag means you never sit straight on a public seat. Use, fold and bin.":
    "बैग में एक पतला डिब्बा, ताकि आपको कभी पब्लिक सीट पर सीधे न बैठना पड़े। इस्तेमाल करें, मोड़ें और डस्टबिन में डालें।",
  "Your hygiene routine check": "आपकी हाइजीन रूटीन की जाँच",
  "Lovely: your routine already covers every habit on the list.": "बहुत बढ़िया: आपकी रूटीन में लिस्ट की हर आदत पहले से है।",
  "Your routine is in good shape. Here's what would round it off.": "आपकी रूटीन अच्छी है। इसे पूरा करने के लिए बस ये जोड़ें।",
  "Here are a few easy habits to build into your day.": "अपने दिन में शामिल करने के लिए कुछ आसान आदतें ये हैं।",
  "The vagina cleans itself, so the outside only needs plain water. Skip douches, scented washes and sprays.":
    "योनि ख़ुद को साफ़ रखती है, इसलिए बाहर सिर्फ़ सादा पानी काफ़ी है। डूश, ख़ुशबू वाले वॉश और स्प्रे न इस्तेमाल करें।",
};
