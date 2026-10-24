// Hindi versions of the chat's menus (menus.ts), tap-through flows (flows.ts)
// and "help me choose" finders (finders.ts). Same ids and keys as the English.

export const MENUS_HI: Record<string, { title: string; intro: string; pageLabel?: string; flowLabel?: string }> = {
  periods: {
    title: "पीरियड से जुड़े सवाल",
    intro: "पीरियड के बारे में लोग सबसे ज़्यादा ये सवाल पूछते हैं। किसी एक पर टैप करें, या अपना सवाल लिखें।",
  },
  teens: {
    title: "पहला पीरियड और किशोरियाँ",
    intro: "पहला पीरियड बड़ी बात लग सकता है। माता-पिता और किशोरियाँ सबसे ज़्यादा ये पूछते हैं।",
    pageLabel: "Ovy Teen किट",
  },
  health: {
    title: "महिलाओं की सेहत",
    intro: "महिलाओं की सेहत के आम सवाल, आसान भाषा में। किसी भी चिंता वाली बात के लिए कृपया डॉक्टर को दिखाएँ।",
  },
  travel: {
    title: "सफ़र में हाइजीन",
    intro: "ट्रेन, हाईवे, ट्रेक और यात्राएँ: यात्री हमसे सबसे ज़्यादा ये पूछते हैं।",
    pageLabel: "Yatra Kit बनाएँ",
  },
  ovy: {
    title: "Ovy पीरियड केयर",
    intro: "पैड, लाइनर, पीरियड पैंटी, टीन किट और कप। आप क्या जानना चाहेंगे?",
    pageLabel: "Ovy खरीदें",
    flowLabel: "मेरा पैड साइज़ खोजें",
  },
  looway: {
    title: "Looway ट्रैवल हाइजीन",
    intro: "पी फ़नल, सीट कवर, पी और पुक बैग और Yatra Kit। आप क्या जानना चाहेंगे?",
    pageLabel: "Looway खरीदें",
  },
  orders: {
    title: "ऑर्डर और डिलीवरी",
    intro: "ऑर्डर, डिलीवरी, पेमेंट और कैंसिलेशन के बारे में सब कुछ।",
    pageLabel: "मेरे ऑर्डर",
  },
  subscriptions: {
    title: "सब्सक्रिप्शन",
    intro: "एक बार सब्सक्राइब करें और आपकी ज़रूरी चीज़ें समय पर पहुँचेंगी। दो क्लिक में रोकें या कैंसिल करें।",
    pageLabel: "मेरे सब्सक्रिप्शन",
  },
  account: {
    title: "अकाउंट और रिवॉर्ड",
    intro: "साइन-इन में मदद, आपकी जानकारी, और Potent Rewards कैसे काम करते हैं।",
    pageLabel: "मेरा अकाउंट",
  },
  business: {
    title: "बल्क और बिज़नेस ऑर्डर",
    intro: "कंपनियों, स्कूलों, होटलों, ट्रैवल ग्रुप और CSR अभियानों के लिए Ovy और Looway।",
    pageLabel: "Potent for Business",
  },
  pads: {
    title: "Ovy पैड",
    intro: "Ovy ऑर्गेनिक पैड L, XL और XL+ में आते हैं। आप क्या जानना चाहेंगे?",
    pageLabel: "Ovy पैड खोलें",
    flowLabel: "मेरा पैड साइज़ खोजें",
  },
  liners: {
    title: "Ovy लाइनर",
    intro: "पतले, हवादार डेली लाइनर। आप क्या जानना चाहेंगे?",
    pageLabel: "Ovy लाइनर खोलें",
  },
  panty: {
    title: "Ovy पीरियड पैंटी",
    intro: "भारी दिनों और रातों के लिए लीक-प्रूफ़ डिस्पोज़ेबल पीरियड पैंटी।",
    pageLabel: "पीरियड पैंटी खोलें",
  },
  teenkit: {
    title: "Ovy Teen किट",
    intro: "नरम टीन पैड और किट, जो पहले पीरियड को सुकून भरा बनाते हैं।",
    pageLabel: "Ovy Teen खोलें",
  },
  cup: {
    title: "Potent Hygiene मेंस्ट्रुअल कप",
    intro: "Teen, Medium और Large में मेडिकल-ग्रेड सिलिकॉन। आप क्या जानना चाहेंगे?",
    pageLabel: "Potent Hygiene कप खोलें",
    flowLabel: "मेरा कप साइज़ खोजें",
  },
  funnel: {
    title: "Looway पी फ़नल",
    intro: "कहीं भी खड़े होकर पेशाब करें। आप क्या जानना चाहेंगे?",
    pageLabel: "पी फ़नल खोलें",
  },
  bags: {
    title: "Looway पी और पुक बैग",
    intro: "लीक-प्रूफ़ बैग, जो तरल को जेल में बदल देते हैं। आप क्या जानना चाहेंगे?",
    pageLabel: "पी और पुक बैग खोलें",
  },
  seatcovers: {
    title: "Looway सीट कवर",
    intro: "बायोडिग्रेडेबल कागज़ के सीट कवर: इस्तेमाल करें, मोड़ें और डस्टबिन में डालें। आप क्या जानना चाहेंगे?",
    pageLabel: "सीट कवर खोलें",
  },
  yatra: {
    title: "Looway Yatra Kit",
    intro: "पूरे सफ़र के लिए एक ट्रैवल हाइजीन किट। आप क्या जानना चाहेंगे?",
    pageLabel: "Yatra Kit बनाएँ",
  },
};

// Options are keyed by the option's `next` value. In "cup:cervix" two options
// share next "cup:flow", so that node also carries both labels keyed by their
// English label; look up options[label] first, then options[next].
export const FLOWS_HI: Record<string, { text: string; options?: Record<string, string>; links?: Record<string, string> }> = {
  // ---- Pad size finder ----
  "pad:start": {
    text: "चलिए आपका पैड साइज़ खोजते हैं। ज़्यादातर दिनों में आपका फ़्लो कितना होता है?",
    options: {
      "pad:light": "हल्का",
      "pad:medium": "मीडियम से भारी",
      "pad:heavy": "बहुत भारी या रात भर के लिए",
      "pad:mix": "बहुत बदलता रहता है",
      "pad:gift": "किसी और के लिए खरीद रहे हैं",
    },
  },
  "pad:light": {
    text: "**L (240mm)** आपके लिए सही है: हल्के दिन, स्कूल, काम और पीरियड के आखिरी दिन, 4 से 6 घंटे के लिए। भारी दिनों या रातों के लिए कुछ **XL** भी रखें।",
    links: { "See Ovy pads": "Ovy पैड देखें" },
  },
  "pad:medium": {
    text: "**XL (280mm)** आपका रोज़ का पैड है: मीडियम से भारी दिन और स्कूल या ऑफ़िस का पूरा दिन, 8 घंटे तक। रातों या सबसे भारी दिन के लिए **XL+** पीछे की तरफ़ ज़्यादा कवर देता है।",
    links: { "See Ovy pads": "Ovy पैड देखें" },
  },
  "pad:heavy": {
    text: "**XL+ (320mm)** हमारा सबसे ज़्यादा सुरक्षा देने वाला पैड है: ज़्यादा लंबाई, पीछे से ज़्यादा चौड़ा और दोनों तरफ़ लीक गार्ड, बहुत भारी फ़्लो, रातों और बच्चे के जन्म के बाद की ब्लीडिंग (पोस्टपार्टम) के लिए। अगर 2 घंटे से कम में XL+ पूरा भीग जाए, तो कृपया डॉक्टर को दिखाएँ।",
    links: { "See Ovy pads": "Ovy पैड देखें" },
  },
  "pad:mix": {
    text: "**Mix Your Box** चुनें: L, XL और XL+ को एक बॉक्स में मिलाएँ, ताकि पीरियड के हर दिन के लिए सही पैड हो। पहली बार के लिए एक अच्छा मिक्स है 6 L, 9 XL और 6 XL+।",
    links: { "Build my box": "मेरा बॉक्स बनाएँ" },
  },
  "pad:gift": {
    text: "अगर आपको उनका फ़्लो नहीं पता, तो **XL+** चुनें। यह सबसे ज़्यादा सुरक्षा देता है, इसलिए हर किसी के लिए ठीक है। या **Mix Your Box** चुनें, ताकि उन्हें हर साइज़ मिले।",
    links: { "See Ovy pads": "Ovy पैड देखें" },
  },

  // ---- Cup size finder ----
  "cup:start": {
    text: "चलिए आपका कप साइज़ खोजते हैं। सबसे ज़रूरी है सही फ़िट, इसलिए कुछ छोटे सवाल। क्या आपकी नॉर्मल डिलीवरी (वजाइनल बर्थ) हुई है?",
    options: {
      "cup:large": "हाँ",
      "cup:cervix": "नहीं, या सिर्फ़ सिज़ेरियन (C-section)",
    },
  },
  "cup:cervix": {
    text: "पीरियड के किसी दिन, साफ़ हाथों से, एक उंगली धीरे से अंदर डालें जब तक आपको अपना सर्विक्स (गर्भाशय का मुँह) महसूस न हो (सख्त, नाक की नोक जैसा)। आपकी उंगली कितनी अंदर गई?",
    options: {
      "cup:teen": "पहले पोर तक (नीचा)",
      "cup:flow": "दूसरे पोर तक (औसत)",
      "cup:medium": "तीसरे पोर तक, या नहीं पहुँची (ऊँचा)",
      "To the 2nd knuckle (average)": "दूसरे पोर तक (औसत)",
      "Not sure / prefer not to check": "पक्का नहीं पता / जाँचना नहीं चाहते",
    },
  },
  "cup:flow": {
    text: "और इनमें से कौन सा आप पर सबसे ज़्यादा लागू होता है?",
    options: {
      "cup:teen": "पहली बार, या किशोरी हैं",
      "cup:medium": "औसत फ़्लो",
      "cup:medium-heavy": "भारी फ़्लो",
    },
  },
  "cup:teen": {
    text: "**Teen (XS, 16 ml)** सबसे नरम और सबसे छोटा है, जो पहली बार इस्तेमाल करने वालों, किशोरियों और नीचे सर्विक्स वालों के लिए बना है। आसान शुरुआत के लिए पंच-डाउन फ़ोल्ड आज़माएँ।",
    links: { "See Potent Hygiene cup": "Potent Hygiene कप देखें" },
  },
  "cup:medium": {
    text: "**Medium (25 ml)** रोज़ के लिए हर तरह से ठीक है, 30 की उम्र के बाद की कई महिलाओं और सिज़ेरियन वाली माँओं के लिए भी। इसे 12 घंटे तक पहना जा सकता है।",
    links: { "See Potent Hygiene cup": "Potent Hygiene कप देखें" },
  },
  "cup:medium-heavy": {
    text: "**Medium (25 ml)** से शुरू करें और भारी दिनों में इसे जल्दी-जल्दी खाली करें। अगर आपका सर्विक्स ऊँचा है, तो **Large (35 ml)** में ज़्यादा जगह है। दोबारा पक्का करने के लिए कप पेज पर 4 सवालों का साइज़ क्विज़ है।",
    links: { "Take the size quiz": "साइज़ क्विज़ लें" },
  },
  "cup:large": {
    text: "**Large (35 ml)** आम तौर पर नॉर्मल डिलीवरी के बाद सबसे अच्छा फ़िट होता है, जब आपके डॉक्टर अंदर लगाने वाले प्रोडक्ट फिर से इस्तेमाल करने की इजाज़त दे दें। इसे 12 घंटे तक पहना जा सकता है।",
    links: { "See Potent Hygiene cup": "Potent Hygiene कप देखें" },
  },
};

export const FINDERS_HI: Record<string, { title: string; steps: Record<string, { text: string; options: Record<string, string> }> }> = {
  ovy: {
    title: "पीरियड केयर चुनने में मेरी मदद करें",
    steps: {
      who: {
        text: "यह किसके लिए है?",
        options: {
          me: "मेरे लिए",
          teen: "मेरी बेटी (पहले पीरियड)",
          gift: "किसी के लिए तोहफ़ा",
        },
      },
      flow: {
        text: "ज़्यादातर दिनों में फ़्लो कितना होता है?",
        options: {
          light: "हल्का",
          medium: "मीडियम",
          heavy: "भारी",
          very: "बहुत भारी या लंबी रातें",
          mixed: "बहुत बदलता रहता है",
          unsure: "पक्का नहीं पता",
        },
      },
      type: {
        text: "आप क्या इस्तेमाल करना चाहेंगे?",
        options: {
          pads: "पैड",
          cup: "मेंस्ट्रुअल कप",
          panty: "पीरियड पैंटी",
          suggest: "पक्का नहीं, आप सुझाइए",
        },
      },
      extra: {
        text: "और कुछ ज़रूरी है? जो भी लागू हों, सब चुनें।",
        options: {
          sensitive: "सेंसिटिव स्किन या रैश",
          sports: "खेल, जिम या तैराकी",
          nights: "रात में लीक",
          discharge: "पीरियड के बीच डिस्चार्ज",
          travel: "बहुत सफ़र",
          none: "इनमें से कोई नहीं",
        },
      },
    },
  },
  looway: {
    title: "मेरे सफ़र की हाइजीन प्लान करें",
    steps: {
      trip: {
        text: "यह किस तरह का सफ़र है?",
        options: {
          train: "ट्रेन या बस का सफ़र",
          road: "रोड ट्रिप",
          flight: "फ़्लाइट",
          trek: "ट्रेक, कैंपिंग या तीर्थयात्रा",
          daily: "रोज़ ऑफ़िस या कॉलेज",
        },
      },
      who: {
        text: "कौन सफ़र कर रहा है? जो भी लागू हों, सब चुनें।",
        options: {
          women: "महिलाएँ या लड़कियाँ",
          kids: "छोटे बच्चे",
          seniors: "बुज़ुर्ग माता-पिता",
          pregnant: "कोई गर्भवती",
          men: "पुरुष या लड़के",
        },
      },
      length: {
        text: "सफ़र कितना लंबा है?",
        options: {
          day: "एक दिन",
          few: "2 से 4 दिन",
          week: "एक हफ़्ता या ज़्यादा",
        },
      },
    },
  },
};

// Every English string a finder's result() can return, mapped to Hindi.
// The template sentence uses the literal placeholder "{size}"; the size values
// themselves are listed too, so the {size} value can be translated before it
// is inserted (L, XL and XL+ sizes stay the same in Hindi).
export const FINDER_TEXT_HI: Record<string, string> = {
  // ---- ovy: sizes
  "L (240mm)": "L (240mm)",
  "XL (280mm)": "XL (280mm)",
  "XL+ (320mm)": "XL+ (320mm)",
  "Mix Your Box (L, XL and XL+)": "Mix Your Box (L, XL और XL+)",
  "XL+ or Mix Your Box": "XL+ या Mix Your Box",

  // ---- ovy: teen
  "Soft teen pads and kits made for first periods, with a guide she can keep.": "पहले पीरियड के लिए बने नरम टीन पैड और किट, साथ में एक गाइड जो वह अपने पास रख सकती है।",
  "Thin liners for the discharge that often comes before and between periods.": "पतले लाइनर, उस डिस्चार्ज के लिए जो अक्सर पीरियड से पहले और दो पीरियड के बीच होता है।",
  "A calm first-period kit": "सुकून भरी पहले पीरियड की किट",
  "Here's what I'd suggest for your daughter.": "आपकी बेटी के लिए मेरा सुझाव यह है।",
  "Pop a kit in her school bag before her period starts, so she's ready wherever she is.": "पीरियड शुरू होने से पहले ही एक किट उसके स्कूल बैग में रख दें, ताकि वह जहाँ भी हो, तैयार रहे।",

  // ---- ovy: gift
  "XL+ is the most protective, so it suits anyone. Mix Your Box gives every size.": "XL+ सबसे ज़्यादा सुरक्षा देता है, इसलिए हर किसी के लिए ठीक है। Mix Your Box में हर साइज़ मिलता है।",
  "A thoughtful extra for everyday freshness.": "रोज़ की ताज़गी के लिए एक सोचा-समझा अतिरिक्त तोहफ़ा।",
  "A gift that fits anyone": "ऐसा तोहफ़ा जो हर किसी के काम आए",
  "When you don't know someone's flow, these are the safest picks.": "जब आपको किसी का फ़्लो नहीं पता, तो ये सबसे सुरक्षित विकल्प हैं।",

  // ---- ovy: own use
  "Medical-grade silicone, worn up to 12 hours, and fine for swimming and sport. The size finder picks Teen, Medium or Large.": "मेडिकल-ग्रेड सिलिकॉन, 12 घंटे तक पहना जा सकता है, और तैराकी और खेल के लिए भी ठीक। साइज़ फ़ाइंडर Teen, Medium या Large में से सही साइज़ चुनता है।",
  "Leak-proof disposable period underwear: one panty can replace 2 to 3 pad changes.": "लीक-प्रूफ़ डिस्पोज़ेबल पीरियड अंडरवियर: एक पैंटी 2 से 3 बार पैड बदलने की जगह ले सकती है।",
  "Dermatologically tested, rash-free pads. {size} suits your flow.": "डर्मेटोलॉजिकली टेस्टेड, रैश-फ़्री पैड। आपके फ़्लो के लिए {size} सही है।",
  "For heavy nights, a period panty gives front-to-back cover while you sleep.": "भारी रातों के लिए, पीरियड पैंटी सोते समय आगे से पीछे तक कवर देती है।",
  "A liner is handy backup while you get used to the cup.": "जब तक आपको कप की आदत हो, लाइनर एक काम का बैकअप है।",
  "For light days and discharge between periods.": "हल्के दिनों और दो पीरियड के बीच के डिस्चार्ज के लिए।",
  "Biodegradable seat covers for trains, highways and office toilets.": "ट्रेन, हाईवे और ऑफ़िस के टॉयलेट के लिए बायोडिग्रेडेबल सीट कवर।",
  "Your period care match": "आपके लिए सही पीरियड केयर",
  "Ovy pads and liners are dermatologically tested and rash-free, which suits sensitive skin. Here's what I'd pick for you.": "Ovy पैड और लाइनर डर्मेटोलॉजिकली टेस्टेड और रैश-फ़्री हैं, जो सेंसिटिव स्किन के लिए ठीक हैं। आपके लिए मेरी पसंद ये है।",
  "Here's what I'd pick for you.": "आपके लिए मेरी पसंद ये है।",
  "Subscribe to pads, liners or panties and save on every delivery. You can pause or cancel in two clicks.": "पैड, लाइनर या पैंटी को सब्सक्राइब करें और हर डिलीवरी पर बचत करें। आप दो क्लिक में रोक या कैंसिल कर सकते हैं।",

  // ---- looway
  "For every Western toilet on the way: use, fold and bin. Never flush.": "रास्ते के हर वेस्टर्न टॉयलेट के लिए: इस्तेमाल करें, मोड़ें और डस्टबिन में डालें। कभी फ़्लश न करें।",
  "Pee standing up when the toilet is a squat, filthy or missing. Practise once at home.": "जब टॉयलेट इंडियन (बैठने वाला) हो, गंदा हो या हो ही नहीं, तब खड़े होकर पेशाब करें। एक बार घर पर प्रैक्टिस कर लें।",
  "Leak-proof bags that turn pee or vomit into gel, for traffic jams, motion sickness and kids.": "लीक-प्रूफ़ बैग जो पेशाब या उल्टी को जेल में बदल देते हैं, ट्रैफ़िक जाम, सफ़र में जी मिचलाने (मोशन सिकनेस) और बच्चों के लिए।",
  "Build all of this into one kit, with free intimate wipes in every kit.": "यह सब एक किट में बनाएँ, हर किट के साथ इंटिमेट वाइप्स मुफ़्त।",
  "Pack pads too, as travel and stress can bring a period early.": "पैड भी पैक करें, क्योंकि सफ़र और तनाव से पीरियड जल्दी आ सकता है।",
  "Your everyday hygiene kit": "आपकी रोज़ की हाइजीन किट",
  "Your trip hygiene kit": "आपके सफ़र की हाइजीन किट",
  "Here's what I'd pack for this trip.": "इस सफ़र के लिए मेरी पैकिंग लिस्ट ये है।",
  "For a long trip, carry enough seat covers for every toilet stop and a few spare pee bags, so you never have to ration them.": "लंबे सफ़र के लिए, हर टॉयलेट स्टॉप के हिसाब से काफ़ी सीट कवर और कुछ एक्स्ट्रा पी बैग रखें, ताकि आपको उन्हें बचा-बचाकर इस्तेमाल न करना पड़े।",
  "Keep everything in one pouch you can reach without unpacking the bag.": "सब कुछ एक ऐसे पाउच में रखें जो बैग खोले बिना हाथ आ जाए।",
};
