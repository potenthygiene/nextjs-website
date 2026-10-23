// Hindi for the site quizzes in const/chatbot/quizzes.ts. QUIZZES_HI holds the
// titles, menu labels and questions; QUIZ_TEXT_HI maps every exact English
// string a quiz result can return (and each quiz's page link label) to Hindi.

export const QUIZZES_HI: Record<string, { title: string; short: string; steps: Record<string, { text: string; options: Record<string, string> }> }> = {
  "find-what-i-need": {
    title: "मुझे क्या चाहिए, यह ढूँढें",
    short: "मुझे क्या चाहिए क्विज़",
    steps: {
      flow: {
        text: "आपका फ़्लो कैसा रहता है?",
        options: {
          light: "हल्का फ़्लो",
          medium: "मीडियम फ़्लो",
          heavy: "भारी फ़्लो",
          unsure: "पक्का नहीं पता",
        },
      },
      cramps: {
        text: "क्या आपको क्रैम्प्स या तकलीफ़ होती है?",
        options: {
          none: "कोई तकलीफ़ नहीं",
          mild: "हल्की तकलीफ़",
          severe: "बहुत तेज़ क्रैम्प्स",
          varies: "बदलता रहता है",
        },
      },
      material: {
        text: "पीरियड प्रोडक्ट्स के लिए आपको कौन सा मटीरियल पसंद है?",
        options: {
          cotton: "कॉटन",
          synthetic: "सिंथेटिक ब्लेंड",
          silicone: "मेडिकल-ग्रेड सिलिकॉन",
          unsure: "पक्का नहीं पता",
        },
      },
      allergy: {
        text: "क्या आपको किसी मटीरियल से एलर्जी या सेंसिटिविटी है?",
        options: {
          none: "कोई एलर्जी नहीं",
          sensitive: "सेंसिटिव स्किन",
          allergic: "एलर्जिक रिएक्शन होते हैं",
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
      flow: {
        text: "आपका फ़्लो आमतौर पर कैसा रहता है?",
        options: {
          "regular-flow": "हल्के से नॉर्मल फ़्लो: काम, स्कूल और सफ़र के लिए रोज़ के पैड",
          "heavy-flow": "भारी फ़्लो और रातें: भारी दिनों और नींद के लिए ज़्यादा कवर",
          "reusable-cup": "दोबारा इस्तेमाल होने वाला कप पसंद है: खेल, तैराकी और लंबे दिनों के लिए 12 घंटे की आज़ादी",
        },
      },
    },
  },

  "pad-size": {
    title: "पैड साइज़ क्विज़",
    short: "पैड साइज़ क्विज़",
    steps: {
      flow: {
        text: "आमतौर पर आपका पीरियड फ़्लो कितना भारी होता है?",
        options: {
          light: "हल्का फ़्लो: हल्के दिन, स्पॉटिंग, पीरियड के आख़िरी दिन",
          medium: "मीडियम या नॉर्मल फ़्लो: ज़्यादातर दिनों में एक जैसा फ़्लो",
          heavy: "भारी फ़्लो: शुरुआती दिनों में पैड जल्दी भर जाते हैं",
          variable: "बहुत बदलता है: पहले 2 दिन भारी, फिर हल्का या मीडियम",
        },
      },
      leaks: {
        text: "क्या रात में या भाग-दौड़ के दौरान लीक होता है?",
        options: {
          rarely: "कभी-कभार या कभी नहीं",
          sometimes: "कभी-कभी रात में",
          often: "अक्सर, या ज़्यादा ख़तरा रहता है",
        },
      },
      duration: {
        text: "आपका पीरियड कितने दिन चलता है?",
        options: {
          "3-4": "3 से 4 दिन",
          "5-7": "5 से 7 दिन",
          "7+": "7 दिन से ज़्यादा",
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
          under18: "18 से कम (टीन)",
          "18to30": "18 से 30",
          above30: "30 से ज़्यादा",
        },
      },
      birth: {
        text: "क्या आपकी नॉर्मल (वजाइनल) डिलीवरी हुई है?",
        options: {
          none: "नहीं, या सी-सेक्शन डिलीवरी हुई है",
          vaginal: "हाँ, नॉर्मल (वजाइनल) डिलीवरी हुई है",
        },
      },
      flow: {
        text: "आपका पीरियड फ़्लो कितना भारी है?",
        options: {
          light: "हल्के से नॉर्मल फ़्लो",
          heavy: "भारी फ़्लो (मैं पैड अक्सर बदलती हूँ)",
        },
      },
      cervix: {
        text: "आपकी सर्विक्स कितनी ऊँचाई पर है? पीरियड वाले दिन, साफ़ हाथों से एक उँगली अंदर डालें, जब तक सर्विक्स महसूस न हो (सख़्त, नाक की नोक जैसी)।",
        options: {
          medium: "औसत या ऊँची (दूसरी गाँठ या उससे आगे)",
          low: "नीची (पहली गाँठ तक)",
          unsure: "पक्का नहीं पता, या पहली बार इस्तेमाल कर रही हूँ",
        },
      },
    },
  },

  "teen-kit": {
    title: "टीन किट क्विज़",
    short: "टीन किट क्विज़",
    steps: {
      q1: {
        text: "क्या यह पहले पीरियड के लिए है, या किसी एक्टिव टीन के लिए?",
        options: {
          first: "पहला पीरियड या पहली बार इस्तेमाल",
          regular: "हर महीने की पीरियड केयर",
          active: "खिलाड़ी या टूर्नामेंट के लिए सफ़र करती है",
        },
      },
      q2: {
        text: "रोज़ वह कितनी एक्टिव रहती है?",
        options: {
          school: "स्कूल के दिन और हल्की पढ़ाई वाली दिनचर्या",
          sports: "खेल, डांस और बाहर की एक्टिविटी",
        },
      },
      q3: {
        text: "उसे कैसी किट पसंद आएगी?",
        options: {
          basic: "ज़रूरी पैड का एक पैक",
          gift: "ख़ास चीज़ों के साथ पूरा माइलस्टोन गिफ़्ट बॉक्स",
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
  // ---- page link labels (each quiz's `page.label`)
  "Open the full quiz": "पूरा क्विज़ खोलें",
  "See it on the Ovy page": "Ovy पेज पर देखें",
  "Open the pads page": "पैड का पेज खोलें",
  "Open the cup size finder": "कप साइज़ फ़ाइंडर खोलें",
  "See Ovy Teen kits": "Ovy Teen किट देखें",
  "Build it on the Yatra Kit page": "Yatra Kit पेज पर बनाएँ",

  // ---- shared sizes
  "L (240mm)": "L (240mm)",
  "XL (280mm)": "XL (280mm)",
  "XL+ (320mm)": "XL+ (320mm)",
  "Mix Your Box (L, XL and XL+)": "Mix Your Box (L, XL और XL+)",
  "Mix Your Box": "Mix Your Box",
  "L or XL": "L या XL",

  // ---- find what I need (/quiz)
  "You prefer medical-grade silicone, so the reusable Ovy cup fits. Take the cup size quiz to pick Teen, Medium or Large.":
    "आपको मेडिकल-ग्रेड सिलिकॉन पसंद है, इसलिए दोबारा इस्तेमाल होने वाला Ovy कप सही रहेगा। Teen, Medium या Large चुनने के लिए कप साइज़ क्विज़ लें।",
  "Made for light flow, spotting and the last days of a period.": "हल्के फ़्लो, स्पॉटिंग और पीरियड के आख़िरी दिनों के लिए बना।",
  "Thin liners for the lightest days and discharge between periods.": "सबसे हल्के दिनों और दो पीरियड के बीच के डिस्चार्ज के लिए पतले लाइनर।",
  "Your everyday pad for medium flow and full school or office days.": "मीडियम फ़्लो और स्कूल या ऑफ़िस के पूरे दिन के लिए आपका रोज़ का पैड।",
  "Our longest pad, with a wider back for heavy days and nights.": "हमारा सबसे लंबा पैड, भारी दिनों और रातों के लिए पीछे से ज़्यादा चौड़ा।",
  "Leak-proof period panties for your heaviest nights.": "आपकी सबसे भारी रातों के लिए लीक-प्रूफ़ पीरियड पैंटी।",
  "Not sure of your flow? Mix Your Box gives you L, XL and XL+ in one box, so you can find out.":
    "अपने फ़्लो के बारे में पक्का नहीं पता? Mix Your Box में एक ही बॉक्स में L, XL और XL+ मिलते हैं, ताकि आप ख़ुद समझ सकें।",
  "If a period product has given you a rash, itching or swelling before, stop using it, and see a doctor if it doesn't settle.":
    "अगर पहले किसी पीरियड प्रोडक्ट से रैश, खुजली या सूजन हुई है, तो उसे इस्तेमाल करना बंद करें, और ठीक न हो तो डॉक्टर को दिखाएँ।",
  "If cramps keep you from school, work or sleep, or get worse over time, please see a doctor. Painful periods are common, but they are not something you just have to live with.":
    "अगर क्रैम्प्स की वजह से आप स्कूल, काम या नींद से चूक जाती हैं, या समय के साथ दर्द बढ़ता जा रहा है, तो कृपया डॉक्टर को दिखाएँ। दर्द भरे पीरियड आम हैं, पर इन्हें चुपचाप सहते रहना ज़रूरी नहीं।",
  "Your period care picks": "आपके लिए पीरियड केयर",
  "Ovy pads and liners are dermatologically tested, rash-free and non-irritant, which suits sensitive skin. Here's what fits your answers.":
    "Ovy पैड और लाइनर डर्मेटोलॉजिकली टेस्टेड, रैश-फ़्री और नॉन-इरिटेंट हैं, जो सेंसिटिव स्किन के लिए ठीक हैं। आपके जवाबों के हिसाब से ये सही हैं।",
  "Here's what fits your answers.": "आपके जवाबों के हिसाब से ये सही हैं।",
  "Take the cup size quiz": "कप साइज़ क्विज़ लें",

  // ---- Ovy find my fit (/ovy)
  "Ultra-thin daily liners to stay fresh between periods.": "दो पीरियड के बीच ताज़गी के लिए अल्ट्रा-थिन डेली लाइनर।",
  "See Ovy liners": "Ovy लाइनर देखें",
  "Two pad sizes, 4 liners and disposal bags for her first period.": "उसके पहले पीरियड के लिए दो साइज़ के पैड, 4 लाइनर और डिस्पोज़ल बैग।",
  "320mm XL+ with extra-wide back coverage for heavy days and nights.": "भारी दिनों और रातों के लिए 320mm XL+, पीछे से ज़्यादा चौड़े कवर के साथ।",
  "A medical-grade silicone cup that lasts for years. Take the cup size quiz to pick your size.":
    "मेडिकल-ग्रेड सिलिकॉन का कप जो सालों चलता है। अपना साइज़ चुनने के लिए कप साइज़ क्विज़ लें।",
  "Rash-free pads sized to your actual flow: L for lighter days, XL for regular days.": "आपके असली फ़्लो के हिसाब से रैश-फ़्री पैड: हल्के दिनों के लिए L, नॉर्मल दिनों के लिए XL।",
  "See Ovy pads": "Ovy पैड देखें",
  "Your perfect match": "आपके लिए एकदम सही",
  "Here's the pack that fits.": "यह पैक आपके लिए सही है।",
  "Orders are dispatched within 24 to 48 hours.": "ऑर्डर 24 से 48 घंटे में डिस्पैच हो जाते हैं।",

  // ---- pad size quiz (pads page)
  "Recommended for your cycle": "आपकी साइकिल के लिए सुझाव",
  "Your flow varies across your cycle. Mix Your Box gives you L for light days, XL for regular days and XL+ for heavy flow and nights, in a single box.":
    "आपका फ़्लो पूरी साइकिल में बदलता रहता है। Mix Your Box में एक ही बॉक्स में हल्के दिनों के लिए L, नॉर्मल दिनों के लिए XL और भारी फ़्लो और रातों के लिए XL+ मिलता है।",
  "Best match for heavy flow": "भारी फ़्लो के लिए सबसे सही",
  "Our longest pad (320mm) with dual leak guards, for heavy flow days and peace of mind overnight.":
    "डुअल लीक गार्ड वाला हमारा सबसे लंबा पैड (320mm), भारी फ़्लो वाले दिनों और रात भर बेफ़िक्री के लिए।",
  "Best match for light flow": "हल्के फ़्लो के लिए सबसे सही",
  "A compact 240mm pad for light flow, spotting and comfortable everyday wear on your lighter days.":
    "हल्के फ़्लो, स्पॉटिंग और हल्के दिनों में आराम से रोज़ पहनने के लिए 240mm का छोटा पैड।",
  "Most popular choice": "सबसे पसंदीदा विकल्प",
  "A versatile 280mm pad for regular to heavy flow, with up to 8 hours of rash-free comfort.":
    "नॉर्मल से भारी फ़्लो के लिए 280mm का पैड, 8 घंटे तक रैश-फ़्री आराम के साथ।",
  "A period that often lasts more than 7 days is worth mentioning to a doctor.": "अगर पीरियड अक्सर 7 दिन से ज़्यादा चलता है, तो डॉक्टर को ज़रूर बताएँ।",
  "If you soak through an XL+ in under 2 hours, please see a doctor.": "अगर XL+ पैड 2 घंटे से कम में भर जाता है, तो कृपया डॉक्टर को दिखाएँ।",
  "Here's the pad size that fits your answers.": "आपके जवाबों के हिसाब से यह पैड साइज़ सही है।",

  // ---- cup size quiz (cup page)
  "Teen (XS), 16 ml": "Teen (XS), 16 ml",
  "Medium, 25 ml": "Medium, 25 ml",
  "Large, 35 ml": "Large, 35 ml",
  "Based on your answers, the Teen (XS) cup (16 ml) gives the best seal, comfort and leak protection. It's made for teens and first-timers under 18.":
    "आपके जवाबों के हिसाब से Teen (XS) कप (16 ml) सबसे अच्छी सील, आराम और लीक से सुरक्षा देगा। यह 18 से कम उम्र की टीन और पहली बार इस्तेमाल करने वालों के लिए बना है।",
  "Based on your answers, the Medium cup (25 ml) gives the best seal, comfort and leak protection. It's the everyday all-rounder for anyone without a vaginal birth, C-section mums included.":
    "आपके जवाबों के हिसाब से Medium कप (25 ml) सबसे अच्छी सील, आराम और लीक से सुरक्षा देगा। जिनकी नॉर्मल (वजाइनल) डिलीवरी नहीं हुई है, उनके लिए यह रोज़ का ऑल-राउंडर है, सी-सेक्शन वाली माँएँ भी शामिल।",
  "Based on your answers, the Large cup (35 ml) gives the best seal, comfort and leak protection. It's made for after a vaginal birth or a very heavy flow.":
    "आपके जवाबों के हिसाब से Large कप (35 ml) सबसे अच्छी सील, आराम और लीक से सुरक्षा देगा। यह नॉर्मल (वजाइनल) डिलीवरी के बाद या बहुत भारी फ़्लो के लिए बना है।",
  "If your baby is recent, wait until your doctor clears you to use internal products again.":
    "अगर डिलीवरी हाल ही में हुई है, तो अंदर लगाने वाले प्रोडक्ट दोबारा इस्तेमाल करने से पहले डॉक्टर की हाँ का इंतज़ार करें।",
  "Try the punch-down fold at home on a lighter day for an easy first go.": "पहली बार आसानी के लिए, किसी हल्के दिन घर पर पंच-डाउन फ़ोल्ड आज़माएँ।",
  "Not sure of your cervix height? The 20-second cervix check on the cup page shows you how.":
    "सर्विक्स की ऊँचाई पक्का नहीं पता? कप पेज पर 20 सेकंड का सर्विक्स चेक आपको तरीक़ा बताता है।",
  "Your cup size": "आपका कप साइज़",
  "Here's the size that fits your answers.": "आपके जवाबों के हिसाब से यह साइज़ सही है।",

  // ---- teen kit quiz (Ovy Teen page)
  "Starter Pack": "Starter Pack",
  "Pro-Active Pack": "Pro-Active Pack",
  "First Period Box (coming soon)": "First Period Box (जल्द आ रहा है)",
  "The first-period kit: 25 essentials for unpredictable early cycles, with soft pads that won't show under a school uniform.":
    "पहले पीरियड की किट: शुरुआती अनिश्चित साइकिल के लिए 25 ज़रूरी चीज़ें, ऐसे नरम पैड के साथ जो स्कूल यूनिफ़ॉर्म के नीचे नहीं दिखते।",
  "The sports and travel kit: three pad sizes for practice, matches, tournaments and heavy days, so her period never benches her.":
    "खेल और सफ़र की किट: प्रैक्टिस, मैच, टूर्नामेंट और भारी दिनों के लिए तीन साइज़ के पैड, ताकि पीरियड उसे कभी रोक न पाए।",
  "The 50-piece milestone gift box is coming soon. Until it's here, the Starter Pack covers her first cycle.":
    "50 चीज़ों वाला माइलस्टोन गिफ़्ट बॉक्स जल्द आ रहा है। तब तक Starter Pack उसकी पहली साइकिल के लिए काफ़ी है।",
  "10 Large (L) pads, 240mm": "10 Large (L) पैड, 240mm",
  "11 Extra Large (XL) pads, 280mm": "11 Extra Large (XL) पैड, 280mm",
  "4 soft panty liners": "4 नरम पैंटी लाइनर",
  "25 biodegradable disposal bags": "25 बायोडिग्रेडेबल डिस्पोज़ल बैग",
  "7 Large (L) pads, 240mm": "7 Large (L) पैड, 240mm",
  "7 Extra Large (XL) pads, 280mm": "7 Extra Large (XL) पैड, 280mm",
  "7 Extra Large+ (XL+) pads, 320mm": "7 Extra Large+ (XL+) पैड, 320mm",
  "14 Large (L) pads, 240mm": "14 Large (L) पैड, 240mm",
  "14 Extra Large (XL) pads, 280mm": "14 Extra Large (XL) पैड, 280mm",
  "14 Extra Large+ (XL+) pads, 320mm": "14 Extra Large+ (XL+) पैड, 320mm",
  "8 soft panty liners": "8 नरम पैंटी लाइनर",
  "50 biodegradable disposal bags": "50 बायोडिग्रेडेबल डिस्पोज़ल बैग",
  "1 period panty, seat covers, wipes and a guidebook": "1 पीरियड पैंटी, सीट कवर, वाइप्स और एक गाइडबुक",
  "We recommend": "हमारा सुझाव",
  "Here's the kit that fits her.": "यह किट उसके लिए सही है।",
  "Pop a kit in her school bag before her period starts, so she's ready wherever she is.":
    "पीरियड शुरू होने से पहले ही एक किट उसके स्कूल बैग में रख दें, ताकि वह जहाँ भी हो, तैयार रहे।",

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
