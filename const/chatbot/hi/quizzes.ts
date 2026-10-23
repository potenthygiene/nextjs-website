// Hindi for the site quizzes in const/chatbot/quizzes.ts. QUIZZES_HI holds the
// titles, menu labels and questions; QUIZ_TEXT_HI maps every exact English
// string a quiz result can return (and each quiz's page link label) to Hindi.
// The questions and result strings come from const/quizRules.ts.

export const QUIZZES_HI: Record<string, { title: string; short: string; steps: Record<string, { text: string; options: Record<string, string> }> }> = {
  "find-what-i-need": {
    title: "मुझे क्या चाहिए, यह ढूँढें",
    short: "मुझे क्या चाहिए क्विज़",
    steps: {
      flow: {
        text: "आपका फ़्लो आमतौर पर कैसा रहता है?",
        options: {
          light: "हल्का: स्पॉटिंग और हल्के दिन",
          medium: "मीडियम: नॉर्मल, एक जैसा फ़्लो",
          heavy: "भारी: पैड जल्दी भर जाते हैं या रात में लीक होता है",
          unsure: "बदलता रहता है, या पक्का नहीं पता: किसी दिन भारी, किसी दिन हल्का",
        },
      },
      cramps: {
        text: "क्या आपको क्रैम्प्स या तकलीफ़ होती है?",
        options: {
          none: "नहीं, ख़ास नहीं",
          mild: "हल्के: तकलीफ़ होती है, पर दिन चलता रहता है",
          severe: "तेज़: क्रैम्प्स की वजह से स्कूल, काम या नींद छूट जाती है",
          varies: "बदलता रहता है: कुछ पीरियड बाक़ियों से ज़्यादा मुश्किल होते हैं",
        },
      },
      prefer: {
        text: "आप क्या इस्तेमाल करना चाहेंगी?",
        options: {
          pads: "पैड: कॉटन जैसे नरम और रैश-फ़्री",
          cup: "मेंस्ट्रुअल कप: मेडिकल-ग्रेड सिलिकॉन, सालों तक दोबारा इस्तेमाल",
          panty: "पीरियड पैंटी: एक बार इस्तेमाल वाली, अंडरवियर की तरह पहनें, भारी दिनों और रातों के लिए",
          unsure: "पक्का नहीं पता: आप ही सुझाइए",
        },
      },
      skin: {
        text: "क्या पीरियड प्रोडक्ट्स से आपकी स्किन पर असर होता है?",
        options: {
          none: "नहीं",
          sensitive: "थोड़ा: कभी-कभी रैश या रगड़ हो जाती है",
          allergic: "हाँ, पहले रिएक्शन हुआ है: किसी प्रोडक्ट से रैश, खुजली या सूजन",
          unsure: "पक्का नहीं पता",
        },
      },
    },
  },

  "ovy-find-my-fit": {
    title: "मेरा सही पैक ढूँढें",
    short: "Ovy सही पैक",
    steps: {
      for: {
        text: "यह किसके लिए है?",
        options: {
          "my-period": "मेरा पीरियड: पैड या कप",
          "days-between": "बीच के दिन: डिस्चार्ज, स्पॉटिंग, हल्के लीक",
          "first-period": "पहला पीरियड: किसी टीन के लिए ख़रीदना है",
        },
      },
      type: {
        text: "आपको क्या इस्तेमाल करना पसंद है?",
        options: {
          pads: "पैड: नरम, रैश-फ़्री और आसान",
          cup: "मेंस्ट्रुअल कप: दोबारा इस्तेमाल होने वाला, 12 घंटे तक, खेल और तैराकी में भी ठीक",
        },
      },
      flow: {
        text: "आपका फ़्लो कैसा रहता है?",
        options: {
          light: "हल्का: हल्के दिन और स्पॉटिंग",
          regular: "नॉर्मल: काम, स्कूल और रोज़ का सफ़र",
          heavy: "भारी, या रातें: भारी दिन और नींद",
          varies: "बहुत बदलता है: शुरू के दिन भारी, आख़िर में हल्का",
        },
      },
      cupfor: {
        text: "आप पर कौन सा लागू होता है?",
        options: {
          under18: "18 से कम",
          nobirth: "18 या ज़्यादा, नॉर्मल (वजाइनल) डिलीवरी नहीं हुई: सी-सेक्शन भी शामिल",
          vaginal: "मेरी नॉर्मल (वजाइनल) डिलीवरी हुई है",
        },
      },
      liners: {
        text: "आप लाइनर कितनी बार पहनेंगी?",
        options: {
          sometimes: "कभी-कभी: लाइनर आज़मा रही हूँ, या महीने में कुछ दिन",
          most: "ज़्यादातर दिन: ज़्यादातर दिनों में डिस्चार्ज होता है",
          daily: "हर दिन: पूरे महीने",
        },
      },
      teen: {
        text: "उसका हफ़्ता कैसा रहता है?",
        options: {
          school: "स्कूल और पढ़ाई: क्लास, ट्यूशन और आराम की दिनचर्या",
          sports: "खेल, डांस या सफ़र: प्रैक्टिस, मैच और बाहर के लंबे दिन",
        },
      },
    },
  },

  "pad-size": {
    title: "पैड साइज़ क्विज़",
    short: "पैड साइज़ क्विज़",
    steps: {
      flow: {
        text: "पीरियड के ज़्यादातर दिनों में आपका फ़्लो कितना भारी होता है?",
        options: {
          light: "हल्का: स्पॉटिंग, हल्के दिन, पीरियड के आख़िरी दिन",
          medium: "मीडियम: ज़्यादातर दिनों में नॉर्मल, एक जैसा फ़्लो",
          heavy: "भारी: शुरुआती दिनों में पैड जल्दी भर जाते हैं",
          variable: "बहुत बदलता है: पहले 2 दिन भारी, फिर हल्का या मीडियम",
        },
      },
      leaks: {
        text: "क्या रात में या ज़्यादा भाग-दौड़ में लीक होता है?",
        options: {
          rarely: "कभी-कभार या कभी नहीं: ज़्यादातर समय कवर ठीक रहता है",
          sometimes: "कभी-कभी रात में: सुबह पैड के पीछे की फ़िक्र रहती है",
          often: "अक्सर, दिन हो या रात: बैठते, सोते या चलते समय लीक होता है",
        },
      },
      duration: {
        text: "आपका पीरियड कितने दिन चलता है?",
        options: {
          "3-4": "3 से 4 दिन: छोटा पीरियड",
          "5-7": "5 से 7 दिन: सबसे आम",
          "7+": "7 दिन से ज़्यादा: 8 दिन या उससे लंबा",
        },
      },
    },
  },

  "cup-size": {
    title: "कप साइज़ क्विज़",
    short: "कप साइज़ क्विज़",
    steps: {
      age: {
        text: "आपकी उम्र क्या है?",
        options: {
          under18: "18 से कम",
          adult: "18 या उससे ज़्यादा",
        },
      },
      experience: {
        text: "क्या आपने पहले मेंस्ट्रुअल कप इस्तेमाल किया है?",
        options: {
          first: "नहीं, यह मेरा पहला कप है",
          used: "हाँ, इस्तेमाल किया है",
        },
      },
      birth: {
        text: "क्या आपकी नॉर्मल (वजाइनल) डिलीवरी हुई है?",
        options: {
          none: "नहीं, या सिर्फ़ सी-सेक्शन से",
          vaginal: "हाँ, नॉर्मल (वजाइनल) डिलीवरी",
        },
      },
      flow: {
        text: "आपका फ़्लो कितना भारी है?",
        options: {
          light: "हल्के से नॉर्मल: एक पैड कुछ घंटे चल जाता है",
          heavy: "भारी: पैड अक्सर बदलने पड़ते हैं, या भारी दिनों में लीक होता है",
        },
      },
      cervix: {
        text: "आपकी सर्विक्स कितनी ऊँचाई पर है? पीरियड वाले दिन, हाथ धोकर एक उँगली अंदर डालें, जब तक सर्विक्स महसूस न हो (सख़्त, नाक की नोक जैसी)। देखें उँगली कितनी अंदर गई।",
        options: {
          low: "नीची: पहली गाँठ तक पहुँच जाती है",
          average: "औसत: दूसरी गाँठ पर",
          high: "ऊँची: तीसरी गाँठ पर, या पहुँच नहीं पाती",
          unsure: "अभी पक्का नहीं पता: मैंने चेक नहीं किया",
        },
      },
    },
  },

  "teen-kit": {
    title: "टीन किट क्विज़",
    short: "टीन किट क्विज़",
    steps: {
      stage: {
        text: "पीरियड के मामले में वह अभी कहाँ है?",
        options: {
          first: "अभी शुरू नहीं हुआ, या अभी-अभी शुरू हुआ: पहले पीरियड की तैयारी",
          regular: "उसे कुछ समय से पीरियड आ रहे हैं: हर महीने की केयर",
        },
      },
      activity: {
        text: "उसका हफ़्ता कैसा रहता है?",
        options: {
          school: "स्कूल और पढ़ाई: क्लास, ट्यूशन और आराम की दिनचर्या",
          sports: "खेल, डांस या सफ़र: प्रैक्टिस, मैच, टूर्नामेंट और बाहर के लंबे दिन",
        },
      },
      flow: {
        text: "उसके पीरियड कितने भारी होते हैं?",
        options: {
          light: "हल्के",
          medium: "मीडियम",
          heavy: "भारी: पैड जल्दी भर जाते हैं या रात में लीक होता है",
          unsure: "अभी पक्का नहीं पता",
        },
      },
      kit: {
        text: "उसे सबसे ज़्यादा क्या पसंद आएगा?",
        options: {
          basic: "इस्तेमाल के लिए तैयार पैड किट: एक साइकिल के लिए सब कुछ",
          gift: "माइलस्टोन गिफ़्ट बॉक्स: इस पल को ख़ास बनाने के लिए एक्स्ट्रा चीज़ों वाला बड़ा बॉक्स",
        },
      },
    },
  },

  "yatra-kit": {
    title: "Yatra Kit चुनें",
    short: "Yatra Kit चुनें",
    steps: {
      kit: {
        text: "आपकी यात्रा के लिए कौन सी किट सही है?",
        options: {
          complete: "Complete: हर स्थिति के लिए",
          weekender: "Weekender: अकेले, छोटी यात्रा",
          family: "Family: ग्रुप, लंबी यात्रा",
          girls: "Girls' Trip: सिर्फ़ लड़कियाँ",
          boys: "Boys' Trip: दोस्तों के साथ घूमना",
          teerth: "Teerth Yatra: तीर्थ यात्राएँ",
          preg: "Pregnancy Travel: होने वाली माँओं के लिए",
          toddler: "Toddler Travel: छोटे बच्चों के साथ",
          working: "Working Woman: ऑफ़िस और रोज़ का सफ़र",
          sports: "Sports & Adventure: ट्रेक और आउटडोर",
          carekit: "Care & Recovery: अस्पताल और देखभाल",
        },
      },
    },
  },
};

export const QUIZ_TEXT_HI: Record<string, string> = {
  // ---- page link labels (each quiz's `page.label`) and result links
  "Open the full quiz": "पूरा क्विज़ खोलें",
  "See it on the Ovy page": "Ovy पेज पर देखें",
  "Open the pads page": "पैड का पेज खोलें",
  "Build it in Mix Your Box": "Mix Your Box में बनाएँ",
  "Open the cup size finder": "कप साइज़ फ़ाइंडर खोलें",
  "Take the cup size quiz": "कप साइज़ क्विज़ लें",
  "See Ovy liners": "Ovy लाइनर देखें",
  "See Ovy pads": "Ovy पैड देखें",
  "See Ovy Teen kits": "Ovy Teen किट देखें",
  "Build it on the Yatra Kit page": "Yatra Kit पेज पर बनाएँ",

  // ---- pad sizes and Mix Your Box (const/quizRules.ts PAD_PICKS)
  "L (240mm)": "L (240mm)",
  "XL (280mm)": "XL (280mm)",
  "XL+ (320mm)": "XL+ (320mm)",
  "Mix Your Box: 6 L, 9 XL, 6 XL+": "Mix Your Box: 6 L, 9 XL, 6 XL+",
  "Mix Your Box: 12 L, 6 XL, 3 XL+": "Mix Your Box: 12 L, 6 XL, 3 XL+",
  "Mix Your Box: 3 L, 9 XL, 9 XL+": "Mix Your Box: 3 L, 9 XL, 9 XL+",
  "Mix Your Box: 3 L, 6 XL, 12 XL+": "Mix Your Box: 3 L, 6 XL, 12 XL+",
  "Your fit: Ovy L pads (240mm)": "आपके लिए सही: Ovy L पैड (240mm)",
  "Your fit: Ovy XL pads (280mm)": "आपके लिए सही: Ovy XL पैड (280mm)",
  "Your fit: Ovy XL+ pads (320mm)": "आपके लिए सही: Ovy XL+ पैड (320mm)",
  "Your fit: Mix Your Box": "आपके लिए सही: Mix Your Box",
  "Your fit: Mix Your Box for lighter flow": "आपके लिए सही: हल्के फ़्लो वाला Mix Your Box",
  "Your fit: Mix Your Box for heavier flow": "आपके लिए सही: भारी फ़्लो वाला Mix Your Box",
  "Your fit: Mix Your Box for nights": "आपके लिए सही: रातों वाला Mix Your Box",
  "A slim 240mm pad for light flow, spotting and the last days of a period, with 4 to 6 hours of rash-free cover.":
    "हल्के फ़्लो, स्पॉटिंग और पीरियड के आख़िरी दिनों के लिए 240mm का पतला पैड, 4 से 6 घंटे के रैश-फ़्री कवर के साथ।",
  "A 280mm pad for medium to heavy flow, with up to 8 hours of rash-free cover for full school, office or travel days.":
    "मीडियम से भारी फ़्लो के लिए 280mm का पैड, स्कूल, ऑफ़िस या सफ़र के पूरे दिन के लिए 8 घंटे तक रैश-फ़्री कवर के साथ।",
  "Our longest pad: 320mm with dual leak guards and a wider back, made for heavy flow and nights.":
    "हमारा सबसे लंबा पैड: 320mm, डुअल लीक गार्ड और पीछे से ज़्यादा चौड़ा, भारी फ़्लो और रातों के लिए बना।",
  "Your flow changes through your period, so one box with all three sizes fits better: XL for regular days, XL+ for nights and heavy hours, L for the lighter end.":
    "आपका फ़्लो पीरियड के दौरान बदलता है, इसलिए तीनों साइज़ वाला एक बॉक्स बेहतर रहेगा: नॉर्मल दिनों के लिए XL, रातों और सबसे भारी घंटों के लिए XL+, और आख़िर के हल्के दिनों के लिए L।",
  "Mostly L for your light days, with a few XL and XL+ for nights, so a night leak doesn't catch you out.":
    "हल्के दिनों के लिए ज़्यादातर L, और रातों के लिए कुछ XL और XL+, ताकि रात का लीक आपको परेशान न करे।",
  "Plenty of XL and XL+ for your heavy days and nights, with a few L for the last light days.":
    "भारी दिनों और रातों के लिए भरपूर XL और XL+, और आख़िरी हल्के दिनों के लिए कुछ L।",
  "Twelve XL+ for heavy days and every night, plus XL and L as your flow eases, to stop the leaks you've been getting.":
    "भारी दिनों और हर रात के लिए बारह XL+, और फ़्लो कम होने पर XL और L, ताकि जो लीक हो रहे थे वे रुक जाएँ।",
  "L (240mm) suits your lightest days, when a longer pad feels like too much.":
    "L (240mm) आपके सबसे हल्के दिनों के लिए ठीक है, जब लंबा पैड ज़रूरत से ज़्यादा लगे।",
  "XL (280mm) gives you more length on busy days and normal nights.":
    "XL (280mm) भाग-दौड़ वाले दिनों और नॉर्मल रातों में ज़्यादा लंबाई देता है।",
  "XL+ (320mm) is the one to keep for heavy days and nights.": "भारी दिनों और रातों के लिए XL+ (320mm) पास रखें।",
  "Mix Your Box puts L, XL and XL+ in one box, for when your flow changes from day to day.":
    "Mix Your Box में एक ही बॉक्स में L, XL और XL+ आते हैं, उन दिनों के लिए जब आपका फ़्लो रोज़ बदलता है।",
  "A lighter-flow Mix Your Box keeps a few XL and XL+ for nights, next to your L pads.":
    "हल्के फ़्लो वाले Mix Your Box में आपके L पैड के साथ रातों के लिए कुछ XL और XL+ भी रहते हैं।",
  "A heavier-flow Mix Your Box adds XL and L for the days your flow eases.":
    "भारी फ़्लो वाले Mix Your Box में उन दिनों के लिए XL और L भी हैं जब फ़्लो कम हो जाता है।",
  "A night-heavy Mix Your Box gives you twelve XL+, with XL and L for the lighter days.":
    "रातों वाले Mix Your Box में बारह XL+ मिलते हैं, और हल्के दिनों के लिए XL और L।",

  // ---- pad tips
  "Change every 4 to 6 hours, sooner if it feels full or damp.": "हर 4 से 6 घंटे में बदलें, भरा या गीला लगे तो उससे पहले।",
  "XL lasts up to 8 hours, so it also covers a normal night's sleep.": "XL 8 घंटे तक चलता है, इसलिए नॉर्मल रात की नींद में भी काम आता है।",
  "Wear XL+ to bed: the 320mm length and wider back guard against leaks while you sleep.":
    "सोते समय XL+ पहनें: 320mm की लंबाई और पीछे की चौड़ाई नींद में लीक से बचाती है।",
  "Use XL+ at night and in your heaviest hours, XL on regular days and L as your flow eases.":
    "रात में और सबसे भारी घंटों में XL+, नॉर्मल दिनों में XL, और फ़्लो कम होने पर L इस्तेमाल करें।",
  "For nights, place the pad a little further back and press the wings firmly under your underwear.":
    "रात के लिए पैड थोड़ा पीछे की ओर लगाएँ और विंग्स को अंडरवियर के नीचे अच्छे से दबा दें।",
  "Roll a used pad into its disposal bag and bin it. Never flush.": "इस्तेमाल किया पैड लपेटकर डिस्पोज़ल बैग में रखें और डस्टबिन में डालें। फ़्लश कभी न करें।",
  "A period that often lasts more than 7 days is worth checking with a doctor.": "अगर पीरियड अक्सर 7 दिन से ज़्यादा चलता है, तो डॉक्टर से ज़रूर दिखाएँ।",
  "If you soak through an XL+ in under 2 hours, or pass large clots, please see a doctor.":
    "अगर XL+ पैड 2 घंटे से कम में भर जाता है, या बड़े थक्के आते हैं, तो कृपया डॉक्टर को दिखाएँ।",
  "Here's the pad size that fits your answers.": "आपके जवाबों के हिसाब से यह पैड साइज़ सही है।",

  // ---- find what I need (/quiz)
  "Your fit: the Ovy Menstrual Cup": "आपके लिए सही: Ovy मेंस्ट्रुअल कप",
  "Your fit: Ovy Period Panties": "आपके लिए सही: Ovy पीरियड पैंटी",
  "Medical-grade silicone, up to 12 hours between changes, and reusable for years. The cup size quiz picks Teen, Medium or Large for you.":
    "मेडिकल-ग्रेड सिलिकॉन, 12 घंटे तक बिना बदले, और सालों तक दोबारा इस्तेमाल। कप साइज़ क्विज़ आपके लिए Teen, Medium या Large चुनता है।",
  "Teen, Medium or Large": "Teen, Medium या Large",
  "If pads have irritated your skin, a medical-grade silicone cup is another option.":
    "अगर पैड से आपकी स्किन पर जलन हुई है, तो मेडिकल-ग्रेड सिलिकॉन का कप एक और विकल्प है।",
  "Leak-proof, single-use period panties that hold as much as 5 regular pads, for up to 10 to 12 hours. Made for heavy days and nights.":
    "लीक-प्रूफ़, एक बार इस्तेमाल होने वाली पीरियड पैंटी, जो 5 नॉर्मल पैड जितना सोखती है, 10 से 12 घंटे तक। भारी दिनों और रातों के लिए बनी।",
  "M-XL or XXL-XXXL": "M-XL या XXL-XXXL",
  "Leak-proof period panties for your heaviest nights.": "आपकी सबसे भारी रातों के लिए लीक-प्रूफ़ पीरियड पैंटी।",
  "Pads for the lighter days, when a period panty is more than you need.": "हल्के दिनों के लिए पैड, जब पीरियड पैंटी की ज़रूरत न हो।",
  "Thin liners for the lightest days and discharge between periods.": "सबसे हल्के दिनों और दो पीरियड के बीच के डिस्चार्ज के लिए पतले लाइनर।",
  "A liner is handy backup while you get used to the cup.": "जब तक आपको कप की आदत न हो, लाइनर एक अच्छा बैकअप है।",
  "Log your cramps and symptoms each cycle in the free Period Tracker, so you can show a doctor the pattern.":
    "हर साइकिल में अपने क्रैम्प्स और लक्षण मुफ़्त Period Tracker में लिखें, ताकि आप डॉक्टर को पूरा पैटर्न दिखा सकें।",
  "Ovy pads and liners are dermatologically tested, rash-free and non-irritant, which suits sensitive skin. Here's what fits your answers.":
    "Ovy पैड और लाइनर डर्मेटोलॉजिकली टेस्टेड, रैश-फ़्री और नॉन-इरिटेंट हैं, जो सेंसिटिव स्किन के लिए ठीक हैं। आपके जवाबों के हिसाब से ये सही हैं।",
  "Here's what fits your answers.": "आपके जवाबों के हिसाब से ये सही हैं।",
  "A warm water bottle on your lower tummy, gentle stretching and rest can ease mild cramps.":
    "पेट के निचले हिस्से पर गर्म पानी की बोतल, हल्की स्ट्रेचिंग और आराम से हल्के क्रैम्प्स में राहत मिल सकती है।",
  "Change pads every 4 to 6 hours and wear breathable cotton underwear to keep skin comfortable.":
    "स्किन आराम में रहे, इसके लिए हर 4 से 6 घंटे में पैड बदलें और हवादार कॉटन अंडरवियर पहनें।",
  "Pick M-XL for a waist of about 28 to 44 inches, or XXL-XXXL for about 44 to 56 inches.":
    "कमर लगभग 28 से 44 इंच हो तो M-XL चुनें, और लगभग 44 से 56 इंच हो तो XXL-XXXL।",
  "Sterilise the cup by boiling for 5 to 7 minutes before your first use and after each period.":
    "पहली बार इस्तेमाल से पहले और हर पीरियड के बाद कप को 5 से 7 मिनट उबालकर स्टेरिलाइज़ करें।",
  "Wrap used pads and panties and bin them. Never flush.": "इस्तेमाल किए पैड और पैंटी लपेटकर डस्टबिन में डालें। फ़्लश कभी न करें।",
  "If cramps keep you from school, work or sleep, or get worse over time, please see a doctor. Painful periods are common, but they are not something you just have to live with.":
    "अगर क्रैम्प्स की वजह से आप स्कूल, काम या नींद से चूक जाती हैं, या समय के साथ दर्द बढ़ता जा रहा है, तो कृपया डॉक्टर को दिखाएँ। दर्द भरे पीरियड आम हैं, पर इन्हें चुपचाप सहते रहना ज़रूरी नहीं।",
  "If a period product has given you a rash, itching or swelling before, stop using it, and see a doctor if it doesn't settle.":
    "अगर पहले किसी पीरियड प्रोडक्ट से रैश, खुजली या सूजन हुई है, तो उसे इस्तेमाल करना बंद करें, और ठीक न हो तो डॉक्टर को दिखाएँ।",
  "Our cup is medical-grade silicone. If you have ever reacted to silicone, ask a doctor before you try it.":
    "हमारा कप मेडिकल-ग्रेड सिलिकॉन का है। अगर कभी सिलिकॉन से रिएक्शन हुआ है, तो इस्तेमाल से पहले डॉक्टर से पूछ लें।",
  "If you soak through a pad in under 2 hours, or your period lasts more than 7 days, please see a doctor.":
    "अगर पैड 2 घंटे से कम में भर जाता है, या पीरियड 7 दिन से ज़्यादा चलता है, तो कृपया डॉक्टर को दिखाएँ।",

  // ---- liners (Ovy find my fit)
  "Pack of 40": "40 का पैक",
  "Pack of 60": "60 का पैक",
  "Pack of 80": "80 का पैक",
  "Your fit: Ovy liners, pack of 40": "आपके लिए सही: Ovy लाइनर, 40 का पैक",
  "Your fit: Ovy liners, pack of 60": "आपके लिए सही: Ovy लाइनर, 60 का पैक",
  "Your fit: Ovy liners, pack of 80": "आपके लिए सही: Ovy लाइनर, 80 का पैक",
  "The smallest pack, to try Ovy liners or for a few days a month.": "सबसे छोटा पैक, Ovy लाइनर आज़माने के लिए या महीने में कुछ दिनों के लिए।",
  "Our pick for most days: thin, breathable and fragrance free.": "ज़्यादातर दिनों के लिए हमारी पसंद: पतले, हवादार और बिना ख़ुशबू के।",
  "Best value per liner, for wearing one every day.": "हर दिन पहनने के लिए, प्रति लाइनर सबसे किफ़ायती।",
  "A liner can't hold period flow, even on a light day. Use a pad or a cup for your period.":
    "लाइनर पीरियड का फ़्लो नहीं संभाल सकता, हल्के दिन भी नहीं। पीरियड के लिए पैड या कप इस्तेमाल करें।",
  "Here's the pack that fits.": "यह पैक आपके लिए सही है।",
  "Orders are dispatched within 24 to 48 hours.": "ऑर्डर 24 से 48 घंटे में डिस्पैच हो जाते हैं।",

  // ---- cup size quiz (cup page)
  "Teen (XS), 16 ml": "Teen (XS), 16 ml",
  "Medium, 25 ml": "Medium, 25 ml",
  "Large, 35 ml": "Large, 35 ml",
  "Your size: Teen (XS), 16 ml": "आपका साइज़: Teen (XS), 16 ml",
  "Your size: Medium, 25 ml": "आपका साइज़: Medium, 25 ml",
  "Your size: Large, 35 ml": "आपका साइज़: Large, 35 ml",
  "The smallest, softest Ovy cup, made for teens, first-timers and a low cervix, with light to average flow.":
    "सबसे छोटा और नरम Ovy कप, टीन, पहली बार इस्तेमाल करने वालों और नीची सर्विक्स के लिए, हल्के से औसत फ़्लो के साथ।",
  "The everyday all-rounder for average flow and cervix, if you haven't had a vaginal birth. C-section mums and many over-30s use Medium.":
    "औसत फ़्लो और सर्विक्स के लिए रोज़ का ऑल-राउंडर, अगर आपकी नॉर्मल (वजाइनल) डिलीवरी नहीं हुई है। सी-सेक्शन वाली माँएँ और 30 से ज़्यादा उम्र की कई महिलाएँ Medium इस्तेमाल करती हैं।",
  "The largest cup, made for after a vaginal birth, heavier or longer days, and a higher cervix.":
    "सबसे बड़ा कप, नॉर्मल (वजाइनल) डिलीवरी के बाद, भारी या लंबे दिनों और ऊँची सर्विक्स के लिए बना।",
  "Medium (25 ml) is the next size up, for when Teen starts to feel small or your flow gets heavier.":
    "Medium (25 ml) अगला बड़ा साइज़ है, जब Teen छोटा लगने लगे या फ़्लो भारी हो जाए।",
  "Teen (XS) is shorter and softer, if Medium feels too long or firm at first.":
    "Teen (XS) छोटा और नरम है, अगर शुरू में Medium ज़्यादा लंबा या सख़्त लगे।",
  "Large (35 ml) holds more, if you find yourself emptying Medium often on heavy days.":
    "Large (35 ml) में ज़्यादा आता है, अगर भारी दिनों में Medium बार-बार ख़ाली करना पड़े।",
  "Medium (25 ml) is shorter, if Large sits too low or feels like too much.":
    "Medium (25 ml) छोटा है, अगर Large बहुत नीचे बैठे या ज़्यादा लगे।",
  "Start with the punch-down fold: it makes the smallest tip and is the easiest for a first go.":
    "पंच-डाउन फ़ोल्ड से शुरुआत करें: इससे सबसे छोटी नोक बनती है और पहली बार में यह सबसे आसान है।",
  "Practise at home on a lighter day, with a liner as backup.": "किसी हल्के दिन घर पर प्रैक्टिस करें, बैकअप के लिए लाइनर के साथ।",
  "Sterilise by boiling for 5 to 7 minutes before your first use and after each period.":
    "पहली बार इस्तेमाल से पहले और हर पीरियड के बाद 5 से 7 मिनट उबालकर स्टेरिलाइज़ करें।",
  "Empty, rinse and reinsert at least every 12 hours, more often on heavy days.":
    "कम से कम हर 12 घंटे में ख़ाली करें, धोएँ और फिर लगाएँ, भारी दिनों में उससे जल्दी।",
  "With a low cervix, you may want to trim the stem.": "नीची सर्विक्स हो तो आप स्टेम थोड़ा काट सकती हैं।",
  "Keep the full stem to help you reach the base.": "पूरा स्टेम रहने दें, इससे कप का निचला हिस्सा पकड़ना आसान रहता है।",
  "Do the 20-second cervix check on a period day to confirm your size.": "अपना साइज़ पक्का करने के लिए पीरियड वाले दिन 20 सेकंड का सर्विक्स चेक करें।",
  "If your baby is recent, wait until your doctor clears you to use internal products again.":
    "अगर डिलीवरी हाल ही में हुई है, तो अंदर लगाने वाले प्रोडक्ट दोबारा इस्तेमाल करने से पहले डॉक्टर की हाँ का इंतज़ार करें।",
  "Here's the size that fits your answers.": "आपके जवाबों के हिसाब से यह साइज़ सही है।",

  // ---- teen kit quiz (Ovy Teen page)
  "Starter Pack": "Starter Pack",
  "Pro-Active Pack": "Pro-Active Pack",
  "Her kit: Starter Pack": "उसकी किट: Starter Pack",
  "Her kit: Pro-Active Pack": "उसकी किट: Pro-Active Pack",
  "The first-period kit: 25 essentials for unpredictable early cycles, with soft pads that won't show under a school uniform.":
    "पहले पीरियड की किट: शुरुआती अनिश्चित साइकिल के लिए 25 ज़रूरी चीज़ें, ऐसे नरम पैड के साथ जो स्कूल यूनिफ़ॉर्म के नीचे नहीं दिखते।",
  "The sports and travel kit: three pad sizes for practice, matches, tournaments and heavy days, so her period never benches her.":
    "खेल और सफ़र की किट: प्रैक्टिस, मैच, टूर्नामेंट और भारी दिनों के लिए तीन साइज़ के पैड, ताकि पीरियड उसे कभी रोक न पाए।",
  "The Starter Pack (L and XL pads) suits a lighter, school-day routine.": "Starter Pack (L और XL पैड) हल्की, स्कूल वाली दिनचर्या के लिए ठीक है।",
  "The Pro-Active Pack adds XL+ pads, for heavy days, matches and nights.": "Pro-Active Pack में भारी दिनों, मैच और रातों के लिए XL+ पैड भी हैं।",
  "10 Large (L) pads, 240mm": "10 Large (L) पैड, 240mm",
  "11 Extra Large (XL) pads, 280mm": "11 Extra Large (XL) पैड, 280mm",
  "4 soft panty liners": "4 नरम पैंटी लाइनर",
  "25 biodegradable disposal bags": "25 बायोडिग्रेडेबल डिस्पोज़ल बैग",
  "7 Large (L) pads, 240mm": "7 Large (L) पैड, 240mm",
  "7 Extra Large (XL) pads, 280mm": "7 Extra Large (XL) पैड, 280mm",
  "7 Extra Large+ (XL+) pads, 320mm": "7 Extra Large+ (XL+) पैड, 320mm",
  "Here's the kit that fits her.": "यह किट उसके लिए सही है।",
  "Here's the kit that fits her. The 50-piece First Period Box gift set is coming soon, and this kit is ready now.":
    "यह किट उसके लिए सही है। 50 चीज़ों वाला First Period Box गिफ़्ट सेट जल्द आ रहा है, और यह किट अभी तैयार है।",
  "Pop the kit in her school bag before her period starts, so she's ready wherever she is.":
    "पीरियड शुरू होने से पहले ही किट उसके स्कूल बैग में रख दें, ताकि वह जहाँ भी हो, तैयार रहे।",
  "Show her how to change a pad every 4 to 6 hours, even on light days.": "उसे बताएँ कि हर 4 से 6 घंटे में पैड बदलना है, हल्के दिनों में भी।",
  "See a doctor if she soaks through a pad every 1 to 2 hours, bleeds for more than 7 days, or feels faint or dizzy.":
    "अगर उसका पैड हर 1 से 2 घंटे में भर जाता है, 7 दिन से ज़्यादा ब्लीडिंग होती है, या उसे बेहोशी या चक्कर जैसा लगता है, तो डॉक्टर को दिखाएँ।",

  // ---- Yatra Kit picker (/looway-yatra-kit)
  "Complete kit": "Complete किट",
  "Weekender kit": "Weekender किट",
  "Family kit": "Family किट",
  "Girls' Trip kit": "Girls' Trip किट",
  "Boys' Trip kit": "Boys' Trip किट",
  "Teerth Yatra kit": "Teerth Yatra किट",
  "Pregnancy Travel kit": "Pregnancy Travel किट",
  "Toddler Travel kit": "Toddler Travel किट",
  "Working Woman kit": "Working Woman किट",
  "Sports & Adventure kit": "Sports & Adventure किट",
  "Care & Recovery kit": "Care & Recovery किट",
  Complete: "Complete",
  Weekender: "Weekender",
  Family: "Family",
  "Girls' Trip": "Girls' Trip",
  "Boys' Trip": "Boys' Trip",
  "Teerth Yatra": "Teerth Yatra",
  "Pregnancy Travel": "Pregnancy Travel",
  "Toddler Travel": "Toddler Travel",
  "Working Woman": "Working Woman",
  "Sports & Adventure": "Sports & Adventure",
  "Care & Recovery": "Care & Recovery",
  "Looway Toilet Seat Covers, 2-pack (50 covers)": "Looway Toilet Seat Covers, 2 का पैक (50 कवर)",
  "2 x Looway Toilet Seat Covers, 2-pack (50 covers)": "2 x Looway Toilet Seat Covers, 2 का पैक (50 कवर)",
  "Looway Pee & Puke Bags, pack of 10": "Looway Pee & Puke Bags, 10 का पैक",
  "2 x Looway Pee & Puke Bags, pack of 10": "2 x Looway Pee & Puke Bags, 10 का पैक",
  "Looway Pee Funnel": "Looway Pee Funnel",
  "Ovy Pads L (240mm)": "Ovy Pads L (240mm)",
  "Ovy Daily Liners, pack of 40": "Ovy Daily Liners, 40 का पैक",
  "Free: 10 individually wrapped intimate wipes": "मुफ़्त: 10 अलग-अलग पैक किए हुए इंटिमेट वाइप्स",
  "Here's what this kit starts with. You can add or remove items on the Yatra Kit page.":
    "इस किट में शुरुआत में ये चीज़ें हैं। Yatra Kit पेज पर आप चीज़ें जोड़ या हटा सकती हैं।",
  "One kit for every toilet you'll face on the trip, with free intimate wipes in every kit.":
    "यात्रा में मिलने वाले हर टॉयलेट के लिए एक किट, हर किट में मुफ़्त इंटिमेट वाइप्स के साथ।",
  "Use, fold and bin every seat cover. Never flush.": "हर सीट कवर इस्तेमाल करें, मोड़ें और डस्टबिन में डालें। फ़्लश कभी न करें।",
  "Open this kit": "यह किट खोलें",
};
