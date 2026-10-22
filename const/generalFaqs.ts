// General questions for the FAQ page. Product questions live on each
// product page, so nothing here repeats them.

export type FaqLink = { label: string; href: string };
export type GeneralFaq = { id: string; q: string; a: string; links?: FaqLink[] };
export type FaqGroup = { id: string; title: string; faqs: GeneralFaq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "orders-delivery",
    title: "Orders & delivery",
    faqs: [
      {
        id: "where-deliver",
        q: "Where do you deliver?",
        a: "We deliver all over India. Enter your PIN code on any product page to see the expected delivery date for your area.",
      },
      {
        id: "delivery-time",
        q: "How long does delivery take?",
        a: "Orders ship within 24 hours and usually arrive in about 5 to 7 days, faster to metro cities. Every order is tracked end to end.",
      },
      {
        id: "delivery-cost",
        q: "How much does delivery cost?",
        a: "Delivery is free on orders of ₹399 and above. Below that, a small delivery charge shows in your bag before you pay.",
      },
      {
        id: "track-order",
        q: "How do I track my order?",
        a: "Sign in and open Account → Order History. Each order shows its status, and once it ships you can follow it from there.",
        links: [{ label: "Order History", href: "/dashboard/orders" }],
      },
      {
        id: "account-needed",
        q: "Do I need an account to order?",
        a: "You can browse and add products to your bag without one. You sign in or create a free account at checkout, so you can track orders, manage subscriptions and earn rewards.",
        links: [{ label: "Create an account", href: "/signup" }],
      },
      {
        id: "outside-india",
        q: "Do you ship outside India?",
        a: "Not yet. We currently deliver within India only.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & offers",
    faqs: [
      {
        id: "payment-methods",
        q: "Which payment methods can I use?",
        a: "UPI (GPay, PhonePe, Paytm and others), credit and debit cards (Visa, Mastercard, RuPay) and net banking, on a secure, encrypted Razorpay checkout.",
      },
      {
        id: "cod",
        q: "Do you offer cash on delivery?",
        a: "Not at the moment. All orders are paid online at checkout.",
      },
      {
        id: "gst",
        q: "Do your prices include GST?",
        a: "Yes. Every price on the site already includes GST. Nothing is added on top at checkout.",
      },
      {
        id: "coupons",
        q: "How do I use a coupon code?",
        a: "Enter it in your bag or at checkout and tap Apply. Coupons can't be combined with Potent Rewards credits; checkout uses whichever saves you more and tells you which one it applied.",
      },
      {
        id: "payment-failed",
        q: "My payment failed but money left my account. What now?",
        a: "Don't pay again straight away. A failed payment is usually returned to your account by your bank. Write to care@potenthygiene.com with the date, amount and your phone number and we will check it with our payment partner for you.",
      },
    ],
  },
  {
    id: "cancel-returns",
    title: "Cancellations, returns & refunds",
    faqs: [
      {
        id: "cancel",
        q: "Can I cancel my order?",
        a: "Yes, until it ships. Open Account → Order History and cancel it there, or email care@potenthygiene.com with your order number. An order cancelled before it ships is refunded in full to the way you paid, and any credits you used go back to your account.",
        links: [{ label: "Order History", href: "/dashboard/orders" }],
      },
      {
        id: "returns",
        q: "Can I return or exchange a product?",
        a: "No. Our products are personal hygiene products, so for your safety and everyone else's they can't be returned, exchanged, refunded or replaced once delivered. If you are unsure which size or pack is right, use the size finders on the product pages or ask us before you order.",
        links: [{ label: "Refund policy", href: "/refund-policy" }],
      },
      {
        id: "problem-order",
        q: "Something about my order isn't right. Who do I contact?",
        a: "Email care@potenthygiene.com or WhatsApp +91 63758 81514 with your order number and a photo. A real person reads every message, Monday to Saturday, 10 am to 7 pm.",
      },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions & Cycle Sync",
    faqs: [
      {
        id: "how-subscribe",
        q: "How do subscriptions work?",
        a: "Choose Subscribe on a product page and pick monthly or every 2 months. Your order arrives automatically on that schedule at up to 15% off. There is no minimum, no lock-in and no cancellation fee.",
      },
      {
        id: "cycle-sync",
        q: "What is Cycle Sync?",
        a: "A subscription timed to your body instead of the calendar. You enter your last period date, cycle length and period length once, and each box is planned to arrive about 5 days before your next period. Your first payment is taken when you start; each later box is charged about 10 days before it ships.",
      },
      {
        id: "what-subscribe",
        q: "Which products can I subscribe to?",
        a: "Ovy pads, teen kits and daily liners, and Looway toilet seat covers and pee and puke bags. Cycle Sync is available on pads and teen kits. The menstrual cup and the pee funnel are reusable, and the Yatra Kit is a one-time kit, so these are not sold on subscription.",
      },
      {
        id: "pause-cancel",
        q: "How do I pause or cancel a subscription?",
        a: "Open Account → Subscriptions and tap Pause or Cancel. A paused subscription stays paused until you resume it. Anything already charged or shipped still arrives.",
        links: [{ label: "My subscriptions", href: "/dashboard/subscriptions" }],
      },
      {
        id: "change-subscription",
        q: "Can I change the size, quantity or schedule of a subscription?",
        a: "Not on a running subscription. To change anything, cancel it and start a new one with the settings you want. Each subscription covers one product, so to subscribe to two products, set up two subscriptions.",
      },
      {
        id: "irregular",
        q: "Does Cycle Sync work if my cycle is irregular?",
        a: "It works, but the dates may be a few days off. If your cycle varies a lot, a fixed monthly or every-2-months schedule is more reliable.",
      },
      {
        id: "cycle-privacy",
        q: "Is my cycle data private?",
        a: "Yes. Your cycle dates are used only to time your deliveries. They are never sold, shared or used for advertising, and you can view, edit or delete them anytime.",
      },
    ],
  },
  {
    id: "rewards",
    title: "Potent Rewards & referrals",
    faqs: [
      {
        id: "rewards-what",
        q: "What is Potent Rewards?",
        a: "Our free rewards programme across Ovy and Looway. You earn credits in rupees when you join, on delivered orders, for approved reviews of products you bought, for referring friends and on your birthday. Credits apply automatically at checkout.",
        links: [{ label: "Join free", href: "/signup" }],
      },
      {
        id: "rewards-use",
        q: "How do I use my credits?",
        a: "You don't need to do anything. At checkout, credits are applied automatically to part of your product total (not delivery) on one-time orders. Whatever you don't use stays in your account for next time.",
      },
      {
        id: "rewards-expiry",
        q: "Do credits expire?",
        a: "Credits last 6 months and birthday credit lasts 3 months. We remind you before they expire. Your balance and history are under Account → Rewards & Security.",
        links: [{ label: "My rewards", href: "/dashboard/security" }],
      },
      {
        id: "referral",
        q: "How does referring a friend work?",
        a: "Share your code or link from Account → Referral Program. Your friend gets a discount on their first order, and you earn credit once their first order of ₹399 or more is delivered. Your friend must be new to Potent Hygiene.",
        links: [{ label: "Referral Program", href: "/dashboard/referral" }],
      },
    ],
  },
  {
    id: "gifting-packaging",
    title: "Gifting & packaging",
    faqs: [
      {
        id: "gift",
        q: "Can I send an order as a gift?",
        a: "Yes. Tick \"This is a gift\" at checkout to hide the price on the parcel and slip, and add a personal note of up to 200 characters.",
      },
      {
        id: "packaging",
        q: "Do you ship in plain packaging?",
        a: "Ovy orders arrive in Ovy's own packaging, because periods are normal and there is nothing to hide. The menstrual cup is the exception: it ships in a plain, unbranded outer box.",
      },
    ],
  },
  {
    id: "disposal",
    title: "Disposal & sustainability",
    faqs: [
      {
        id: "dispose",
        q: "How should I dispose of pads, liners and seat covers?",
        a: "Roll used pads and liners inward, seal them in their wrapper or the disposal bag that comes with each one, and put them in the bin. Fold seat covers and bin them, and seal pee and puke bags before binning. Please never flush anything; it blocks drains and septic tanks.",
      },
      {
        id: "eco",
        q: "What makes your products kinder to the planet?",
        a: "Every Ovy pad and liner comes with its own biodegradable, compostable disposal bag, and our seat covers are made of paper. The menstrual cup and the pee funnel are reusable for years and replace thousands of disposables.",
      },
      {
        id: "pad-shared",
        q: "What is \"A pad bought is a pad shared\"?",
        a: "With every Ovy order, a portion goes to our NGO partner, Roshni Manav Utthaan Sansthaan in Jaipur, to put safe, organic period products in the hands of girls and women who can't afford them.",
        links: [{ label: "Our story", href: "/about" }],
      },
    ],
  },
  {
    id: "about",
    title: "About Potent Hygiene",
    faqs: [
      {
        id: "ovy-looway",
        q: "What is the difference between Ovy and Looway?",
        a: "Ovy is period and everyday intimate care: pads, teen kits, period panties, menstrual cups and daily liners. Looway is travel and toilet hygiene: the pee funnel, pee and puke bags, toilet seat covers and the Yatra Kit.",
        links: [
          { label: "Shop Ovy", href: "/ovy" },
          { label: "Shop Looway", href: "/looway" },
        ],
      },
      {
        id: "made-in",
        q: "Where are your products made?",
        a: "In India. We are a woman-founded brand from Jaipur, and every product is designed for Indian bodies, Indian toilets and Indian journeys.",
      },
      {
        id: "marketplaces",
        q: "Can I buy your products on Amazon or Myntra?",
        a: "Yes, you can find us on Amazon and Myntra too. Prices and offers there are set by each marketplace and can differ from our website. For an order placed on a marketplace, please use that marketplace's order page for delivery questions.",
        links: [
          {
            label: "Amazon",
            href: "https://www.amazon.in/stores/PotentHygiene/page/18678868-B6F1-4388-A566-62231A1FE8D5",
          },
          { label: "Myntra", href: "https://www.myntra.com/potent-hygiene" },
        ],
      },
      {
        id: "bulk",
        q: "Do you take bulk or corporate orders?",
        a: "Yes. For offices, schools, colleges, hotels, travel and yatra groups, hospitals, events, gifting and CSR programmes, tell us what you need on our business page or email info@potenthygiene.com. We reply within one working day.",
        links: [{ label: "Bulk & corporate orders", href: "/business" }],
      },
      {
        id: "careers",
        q: "Are you hiring?",
        a: "We are always happy to hear from people who care about hygiene and women's health. Email careers@potenthygiene.com with a little about yourself.",
      },
      {
        id: "contact",
        q: "How can I reach you?",
        a: "WhatsApp or call +91 63758 81514, Monday to Saturday, 10 am to 7 pm, or email care@potenthygiene.com. We usually reply within a working day.",
        links: [{ label: "Contact us", href: "/contact" }],
      },
    ],
  },
];
