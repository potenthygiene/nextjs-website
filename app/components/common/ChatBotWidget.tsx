"use client";

import { type CSSProperties, FormEvent, Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  ClipboardList,
  CornerDownLeft,
  Gift,
  Heart,
  HeartPulse,
  Layers,
  LayoutGrid,
  type LucideIcon,
  MessageCircle,
  MessageCircleHeart,
  Mic,
  Minus,
  Package,
  Plane,
  RefreshCw,
  RotateCcw,
  Send,
  ShoppingBag,
  Sprout,
  Star,
  Stethoscope,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ChatAnswer } from "@/const/chatbot/types";
import type { AgeBand, ProductKey, Sex, SymptomFlow, SymptomOutcome, Who } from "@/const/chatbot/symptomTypes";
import { FLOWS, isFlowResult } from "@/const/chatbot/flows";
import { MENUS, PRODUCT_WORDS, TOPIC_MENU } from "@/const/chatbot/menus";
import { type Finder, FINDERS } from "@/const/chatbot/finders";
import { QUIZZES } from "@/const/chatbot/quizzes";
import { TOOLS } from "@/const/chatbot/tools";
import { applies } from "@/const/chatbot/applies";
import { COMBOS, PRODUCT_META, comboFor, productsFor, type Combo } from "@/const/chatbot/products";
import { bagOffers, differentProductCount } from "@/const/coupons";
import { type ChatContext, getChatContext, logChatQuestion } from "@/helper/chat/action";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { useCartStore } from "@/store/cartStore";
import { getImageUrl } from "@/lib/imageUrl";
import {
  Checklist,
  CouponList,
  fill,
  type LiveOffers,
  type LiveProduct,
  type LiveVariant,
  OffersCard,
  PriceDetails,
  type ProductPick,
  ProductCards,
  ResultCard,
  type Translate,
} from "./chat/ChatCards";

// Potent Saathi: answers only from Potent's approved answers (const/chatbot). No AI.
type Engine = typeof import("@/lib/chat/engine");
// Hindi, loaded only when someone switches the chat to हिंदी (or types in Hindi).
type Hindi = typeof import("@/const/chatbot/hi");
type Lang = "en" | "hi";

type Action =
  | { type: "ask"; q: string }
  | { type: "answer"; id: string }
  | { type: "flow"; node: string }
  | { type: "menu"; id: string }
  | { type: "topics" }
  | { type: "type" }
  | { type: "nav"; href: string; label: string }
  | { type: "human" }
  | { type: "offers" }
  | { type: "price"; slug: string }
  | { type: "symptoms" }
  | { type: "symptom"; id: string }
  | { type: "finder"; id: string }
  | { type: "quizzes" }
  | { type: "account" }
  | { type: "reorder"; orderId: string }
  | { type: "rate"; mood: "up" | "down"; name: string }
  | { type: "issue"; topic: string; name: string }
  | { type: "apply"; code: string }
  | { type: "back" }
  | { type: "opt"; value: string }
  | { type: "skip" };

type ChatLink = { label: string; href: string };
type Choice = { label: string; action: Action };

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: ChatLink[];
  list?: Choice[];
  listTitle?: string;
  /** Pick-several options for the current question. */
  multi?: { id: string; label: string }[];
  chips?: Choice[];
  products?: ProductPick[];
  productsTitle?: string;
  combo?: Combo;
  offers?: boolean;
  price?: string;
  result?: SymptomOutcome;
  checklist?: string[];
  /** Show today's coupons; highlight one. */
  coupons?: { highlight?: string };
  orders?: { id: string; status: string; date: string; total: number | null; items: number }[];
  /** Show the "For you" card. */
  forYou?: boolean;
  feedback?: { q: string; answerId: string; given?: "up" | "down" };
  tone?: "safety";
  /** Written in Hindi, so its cards are shown in Hindi too. */
  hi?: boolean;
};

type Profile = { name?: string; age?: AgeBand; who?: Who; sex?: Sex };

type Step = { at: number; answers: Record<string, string[]> };
// What the chat is in the middle of: collecting details, a check-in, or a finder.
type Task =
  | { kind: "profile"; step: "name" | "who" | "age" | "sex"; flowId: string }
  | { kind: "symptom"; flowId: string; qi: number; answers: Record<string, string[]>; history: Step[] }
  | { kind: "finder"; id: string; si: number; answers: Record<string, string[]>; history: Step[] };

type Reply = Omit<ChatMessage, "id" | "role">;

// Every finder, quiz and planner. The site's own pad and cup quizzes replace
// the chat's older short versions, and the full trip planner replaces the short one.
type AnyFinder = Finder & { short?: string; page?: ChatLink };
const ALL_FINDERS: Record<string, AnyFinder> = { ...FINDERS, ...QUIZZES, ...TOOLS };
const finderFor = (id: string) => (id === "looway" && ALL_FINDERS["trip-planner"] ? "trip-planner" : id);
const FLOW_TO_QUIZ: Record<string, string> = { "pad:start": "pad-size", "cup:start": "cup-size" };
const QUIZ_LIST: AnyFinder[] = [...Object.values(QUIZZES), ...Object.values(TOOLS)];

const WHATSAPP = "916375881514";
const whatsappLink = (question?: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(question ? `Hi Potent, ${question}` : "Hi Potent, I have a question.")}`;
const HUMAN_LINKS = (question?: string): ChatLink[] => [
  { label: "WhatsApp us", href: whatsappLink(question) },
  { label: "Email care@", href: "mailto:care@potenthygiene.com" },
];

const TILES: { label: string; icon: LucideIcon; bg: string; ink: string; action: Action }[] = [
  { label: "Check my symptoms", icon: Stethoscope, bg: "#FDEEF1", ink: "#B0405F", action: { type: "symptoms" } },
  { label: "Help me choose", icon: ShoppingBag, bg: "#FBEFF8", ink: "#7E4D77", action: { type: "finder", id: "ovy" } },
  { label: "Period questions", icon: HeartPulse, bg: "#F3ECFB", ink: "#6B4E9B", action: { type: "menu", id: "periods" } },
  { label: "Travel hygiene", icon: Plane, bg: "#E9F6EE", ink: "#0E5C3A", action: { type: "menu", id: "travel" } },
  { label: "Quizzes & planners", icon: ClipboardList, bg: "#EEF3FB", ink: "#2F5597", action: { type: "quizzes" } },
  { label: "Offers & deals", icon: Tag, bg: "#FDF5EA", ink: "#8A4B12", action: { type: "offers" } },
  { label: "Ovy products", icon: Layers, bg: "#FBF1FB", ink: "#7E4D77", action: { type: "menu", id: "ovy" } },
  { label: "Looway products", icon: Package, bg: "#EEF5EF", ink: "#0E5C3A", action: { type: "menu", id: "looway" } },
];

const MORE_TOPICS: { label: string; icon: LucideIcon; action: Action }[] = [
  { label: "My orders", icon: Truck, action: { type: "account" } },
  { label: "Orders & delivery", icon: Truck, action: { type: "menu", id: "orders" } },
  { label: "Find my pad size", icon: Layers, action: { type: "flow", node: "pad:start" } },
  { label: "Find my cup size", icon: CircleDashed, action: { type: "flow", node: "cup:start" } },
  { label: "Plan my trip hygiene", icon: Plane, action: { type: "finder", id: "looway" } },
  { label: "Subscriptions", icon: RefreshCw, action: { type: "menu", id: "subscriptions" } },
  { label: "First periods & teens", icon: Sprout, action: { type: "menu", id: "teens" } },
  { label: "Women's health", icon: HeartPulse, action: { type: "menu", id: "health" } },
  { label: "Account & rewards", icon: UserRound, action: { type: "menu", id: "account" } },
  { label: "Bulk orders", icon: Building2, action: { type: "menu", id: "business" } },
];

// The menu bar at the bottom of the chat.
const DOCK: { label: string; icon: LucideIcon; action: Action }[] = [
  { label: "Home", icon: LayoutGrid, action: { type: "topics" } },
  { label: "Check-up", icon: Stethoscope, action: { type: "symptoms" } },
  { label: "Quizzes", icon: ClipboardList, action: { type: "quizzes" } },
  { label: "Offers", icon: Tag, action: { type: "offers" } },
  { label: "My orders", icon: Package, action: { type: "account" } },
];

const ALL_TOPICS: Choice[] = [...TILES, ...MORE_TOPICS].map((t) => ({ label: t.label, action: t.action }));
const BACK: Choice = { label: "Back to topics", action: { type: "topics" } };
const OWN: Choice = { label: "Ask my own question", action: { type: "type" } };
const HUMAN: Choice = { label: "Talk to a person", action: { type: "human" } };
const STEP_BACK: Choice = { label: "Change my last answer", action: { type: "back" } };

const AGES: { id: AgeBand; label: string }[] = [
  { id: "u5", label: "Under 5" },
  { id: "5-12", label: "5 to 12" },
  { id: "13-17", label: "13 to 17" },
  { id: "18-29", label: "18 to 29" },
  { id: "30-39", label: "30 to 39" },
  { id: "40-44", label: "40 to 44" },
  { id: "45-49", label: "45 to 49" },
  { id: "50+", label: "50 or older" },
];
const WHOS: { id: Who; label: string }[] = [
  { id: "me", label: "Me" },
  { id: "daughter", label: "My daughter" },
  { id: "son", label: "My son" },
  { id: "someone", label: "Someone else" },
];
const SEXES: { id: Sex; label: string }[] = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other or prefer not to say" },
];

// Product page → its menu, so the chat opens on what the visitor is viewing.
const PAGE_MENU: Record<string, string> = {
  "ovy-pads": "pads",
  "ovy-liners": "liners",
  "ovy-panty": "panty",
  "ovy-teen": "teenkit",
  "ovy-cup": "cup",
  "looway-pee-funnel": "funnel",
  "looway-pee-puke": "bags",
  "looway-toilet-seat-covers": "seatcovers",
};

const OFFER_WORDS =
  /\b(offer|offers|deal|deals|discount|discounts|coupon|coupons|promo|promotion|sale|cashback|free delivery|free shipping|delivery charge|delivery charges|shipping charge|delivery fee|reward|rewards|credits)\b/;
const CHOOSE_WORDS = /\b(recommend|suggest|which product|best product|what should i buy|what to buy|kya lu|konsa lu|help me choose|right product)\b/;
const TRAVEL_WORDS = /\b(travel|trip|train|toilet|yatra|trek|journey|safar|flight|bus|road)\b/;
const TRIP_PLAN_WORDS = /\b(plan my trip|plan a trip|trip planner|trip hygiene|what to pack|packing list|kya pack karu|kya le jaun)\b/;
const QUIZ_WORDS = /\b(quiz|quizzes|planner|planners|size quiz|find my size|which size)\b/;
const MY_ORDERS_WORDS = /\b(my orders|order history|last order|past orders|previous orders?|my account|recent orders?)\b/;
const REORDER_WORDS = /\b(reorder|re order|buy again|order again|repeat (my )?order|same order again|restock)\b/;
const REVIEW_WORDS = /\b(write a review|leave a review|post a review|give (a )?review|review my|rate my)\b/;

// The same, for Hindi typing (after normalise: no nukta, chandrabindu as anusvara).
const OFFER_HI = /(ऑफर|आफर|कूपन|डिस्काउंट|छूट|डील|सेल|कैशबैक|फ्री डिलीवरी|मुफ्त डिलीवरी|डिलीवरी चार्ज|रिवॉर्ड|क्रेडिट)/;
const CHOOSE_HI = /(कौन सा लूं|कौनसा लूं|कौन सा लें|क्या लूं|क्या खरीदूं|सुझाव दो|सलाह दो|कौन सा प्रोडक्ट|सही प्रोडक्ट|चुनने में मदद)/;
const TRAVEL_HI = /(सफर|यात्रा|ट्रेन|टॉयलेट|ट्रिप|ट्रेक|बस|फ्लाइट)/;
const TRIP_PLAN_HI = /(क्या पैक|पैकिंग|सफर की तैयारी|यात्रा की तैयारी|ट्रिप की तैयारी)/;
const QUIZ_HI = /(क्विज|साइज कैसे चुनें|कौन सा साइज)/;
const MY_ORDERS_HI = /(मेरे ऑर्डर|पिछला ऑर्डर|ऑर्डर हिस्ट्री)/;
const REORDER_HI = /(फिर से ऑर्डर|दोबारा ऑर्डर|दोबारा मंगवाना|फिर से मंगवाना)/;
const SYMPTOM_HI = /(खून|ब्लीडिंग|दर्द|खुजली|जलन|बदबू|गांठ|थक्के|बुखार|रैश|लेट|स्पॉटिंग|सूजन|मिस)/;
const PRODUCT_WORDS_HI: Record<string, string> = {
  "पैड": "pads", "पैड्स": "pads", "सैनिटरी पैड": "pads", "लाइनर": "liners", "पैंटी लाइनर": "liners",
  "पीरियड पैंटी": "panty", "पैंटी": "panty", "कप": "cup", "मेंस्ट्रुअल कप": "cup", "पीरियड कप": "cup",
  "टीन किट": "teenkit", "फनल": "funnel", "पी फनल": "funnel", "सीट कवर": "seatcovers", "यात्रा किट": "yatra",
};
const WORDS: Record<string, string> = { ...PRODUCT_WORDS, ...PRODUCT_WORDS_HI };
const DEVANAGARI = /[ऀ-ॿ]/;

const NAME_KEY = "potent-chat-name";
const LANG_KEY = "potent-chat-lang";
const SAVE_KEY = "potent-saathi-chat";
const RECENT_KEY = "potent-recent-products";
const NUDGE_KEY = "potent-chat-nudged";
// The chat stays off sign-in pages and the admin; it is on everywhere else, dashboard included.
const hiddenPathPrefixes = ["/admin", "/login", "/signup", "/reset-password", "/email-verification"];
const PERIOD_PRODUCTS = ["ovy-pads", "ovy-liners", "ovy-panty", "ovy-teen"];
const IN_TRANSIT = ["pending", "paid", "processing", "shipped"];

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/** Name pieces for messages: {n} ", Priya", {N} "Priya, ", {sp} " Priya". */
const nv = (name?: string) => ({ n: name ? `, ${name}` : "", N: name ? `${name}, ` : "", sp: name ? ` ${name}` : "" });

let counter = 0;
const newId = () => `m${Date.now()}-${counter++}`;

const readJSON = <T,>(store: "local" | "session", key: string, fallback: T): T => {
  try {
    const raw = (store === "local" ? localStorage : sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (store: "local" | "session", key: string, value: unknown) => {
  try {
    (store === "local" ? localStorage : sessionStorage).setItem(key, JSON.stringify(value));
  } catch {}
};

function Rich({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const cls = "font-semibold text-[#7E4D77] underline decoration-[#C98BBE] underline-offset-2";
          return href.startsWith("/") ? (
            <Link key={i} href={href} onClick={onNavigate} className={cls}>{label}</Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noreferrer" className={cls}>{label}</a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function Avatar({ size = 28 }: { size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] to-[#C98BBE]" style={{ width: size, height: size }} aria-hidden>
      <Image src="/brand/potent-white.png" alt="" width={44} height={26} style={{ width: size * 0.74, height: "auto" }} />
    </span>
  );
}

type SpeechCtor = new () => {
  lang: string;
  interimResults: boolean;
  onresult: (e: { results: { 0: { transcript: string } }[] }) => void;
  onend: () => void;
  onerror: (e: { error?: string }) => void;
  start: () => void;
};

const speechCtor = (): SpeechCtor | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
};

type ForYouRow = { key: string; icon: LucideIcon; title: string; text?: string; actions: Choice[]; links?: ChatLink[] };

export function ChatBotWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({});
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [hasStickyBar, setHasStickyBar] = useState(false);
  const [sheetStyle, setSheetStyle] = useState<CSSProperties | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [listening, setListening] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [unread, setUnread] = useState(0);
  const [nudge, setNudge] = useState<string | null>(null);
  const [farFromEnd, setFarFromEnd] = useState(false);
  const [ctx, setCtx] = useState<ChatContext | null | undefined>(undefined);
  const [recent, setRecent] = useState<string[]>([]);
  const ctxAt = useRef(0);
  const engineRef = useRef<Engine | null>(null);
  const enginePromise = useRef<Promise<Engine> | null>(null);
  const liveRef = useRef<{ products: Record<string, LiveProduct>; offers: LiveOffers | null }>({ products: {}, offers: null });
  const taskRef = useRef<Task | null>(null);
  // Details for this chat only: kept on this device for this visit, never sent or saved on our side.
  const draftRef = useRef<Profile>({});
  const askedNameRef = useRef(false);
  const restored = useRef(false);
  const openedOnce = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [lang, setLangState] = useState<Lang>("en");
  const [langBusy, setLangBusy] = useState(false);
  const langRef = useRef<Lang>("en");
  const hiRef = useRef<Hindi | null>(null);
  const hiPromise = useRef<Promise<Hindi> | null>(null);
  const restoredLang = useRef(false);
  const name = profile.name;
  const bagItems = useCartStore((st) => st.items);

  const isHidden = hiddenPathPrefixes.some((prefix) => pathname?.startsWith(prefix));
  const pageSlug = pathname?.startsWith("/product-detail/") ? pathname.split("/")[2] : null;
  const pageMenu = pageSlug ? PAGE_MENU[pageSlug] : pathname === "/ovy" ? "ovy" : pathname === "/looway" ? "looway" : pathname === "/looway-yatra-kit" ? "yatra" : null;

  // ---------- Loading ----------

  // The live product facts and offers. Retried on the next open if it failed.
  const loadLive = async (m: Engine) => {
    try {
      const res = await fetch("/api/chat-knowledge");
      if (!res.ok) return;
      const data = await res.json();
      m.addLiveAnswers(data.answers || []);
      liveRef.current = {
        products: Object.fromEntries((data.products || []).map((p: LiveProduct) => [p.slug, p])),
        offers: data.offers || null,
      };
    } catch {
      // The hand-written answers still work without the live extras.
    }
  };

  // Load the answers, check-ins, live product facts and offers.
  const loadEngine = () => {
    if (!enginePromise.current) {
      enginePromise.current = import("@/lib/chat/engine").then(async (m) => {
        engineRef.current = m;
        await loadLive(m);
        m.warmUp();
        setReady(true);
        return m;
      });
    }
    return enginePromise.current;
  };

  const loadHindi = () => {
    if (!hiPromise.current) {
      hiPromise.current = Promise.all([import("@/const/chatbot/hi"), loadEngine()])
        .then(([h, engine]) => {
          engine.addHindi(h.ANSWERS_HI, h.TRIGGERS_HI);
          hiRef.current = h;
          return h;
        })
        .catch((e) => {
          hiPromise.current = null;
          throw e;
        });
    }
    return hiPromise.current;
  };

  const setLang = (l: Lang) => {
    langRef.current = l;
    setLangState(l);
    writeJSON("local", LANG_KEY, l);
  };

  // The signed-in customer's orders, reviews, wishlist and offers, refreshed every few minutes.
  const loadContext = (force = false) => {
    // Signed-out visitors are checked again on every open, so signing in shows up straight away.
    if (!force && ctx !== null && Date.now() - ctxAt.current < 5 * 60_000) return;
    ctxAt.current = Date.now();
    getChatContext()
      .then((c) => {
        setCtx(c);
        if (c?.firstName) setProfile((p) => (p.name ? p : { ...p, name: c.firstName! }));
      })
      .catch(() => setCtx(null));
  };

  // Bring back this visit's chat after a reload.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = readJSON<{ messages?: ChatMessage[]; profile?: Profile; task?: Task | null; draft?: Profile; asked?: boolean } | null>("session", SAVE_KEY, null);
    if (saved?.messages?.length) {
      setMessages(saved.messages);
      taskRef.current = saved.task || null;
      draftRef.current = saved.draft || {};
      askedNameRef.current = !!saved.asked;
    }
    if (saved?.profile) setProfile(saved.profile);
    setRecent(readJSON<string[]>("local", RECENT_KEY, []));
    if (readJSON<string>("local", LANG_KEY, "en") === "hi") {
      loadHindi().then(() => setLang("hi")).catch(() => {});
      restoredLang.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep this visit's chat, so a reload or a new page doesn't lose it.
  useEffect(() => {
    if (!restored.current) return;
    writeJSON("session", SAVE_KEY, {
      messages: messages.slice(-60),
      profile,
      task: taskRef.current,
      draft: draftRef.current,
      asked: askedNameRef.current,
    });
  }, [messages, profile]);

  useEffect(() => {
    if (!isOpen || restoredLang.current) return;
    restoredLang.current = true;
    if (readJSON<string>("local", LANG_KEY, "en") !== "hi") return;
    setLangBusy(true);
    loadHindi()
      .then(() => setLang("hi"))
      .catch(() => {})
      .finally(() => setLangBusy(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Get ready quietly once the page is idle, so the chat answers instantly.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const t = setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(() => loadEngine(), { timeout: 4000 }) : loadEngine()), 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On open: greet by name, load the customer's orders, and retry live data if it failed.
  useEffect(() => {
    if (!isOpen) return;
    setUnread(0);
    setNudge(null);
    loadContext();
    if (!name) {
      const saved = readJSON<string>("session", NAME_KEY, "");
      if (saved) setProfile((p) => ({ ...p, name: saved }));
    }
    const m = engineRef.current;
    if (m && !Object.keys(liveRef.current.products).length) loadLive(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Remember the products someone looks at, to suggest them later.
  useEffect(() => {
    if (!pageSlug || !PAGE_MENU[pageSlug]) return;
    setRecent((prev) => {
      const next = [pageSlug, ...prev.filter((s) => s !== pageSlug)].slice(0, 5);
      writeJSON("local", RECENT_KEY, next);
      return next;
    });
  }, [pageSlug]);

  // A gentle hello on product pages, once a visit, if the chat hasn't been opened.
  useEffect(() => {
    if (!pageMenu || isOpen || openedOnce.current) return;
    if (readJSON<boolean>("session", NUDGE_KEY, false)) return;
    const t = setTimeout(() => {
      if (openedOnce.current) return;
      const title = H()?.MENUS_HI[pageMenu]?.title || MENUS[pageMenu]?.title;
      if (!title) return;
      setNudge(t2("Questions about {title}? I can help you choose.", { title }));
      writeJSON("session", NUDGE_KEY, true);
    }, 25_000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageMenu, isOpen]);

  // Short replies scroll to the bottom; long ones to their first line.
  useLayoutEffect(() => {
    const box = scrollRef.current;
    const last = lastRef.current;
    if (!isOpen || !box) return;
    if (!messages.length && !typing) {
      box.scrollTo({ top: 0 });
      return;
    }
    if (!typing && last && last.dataset.role === "bot" && last.offsetHeight > box.clientHeight * 0.65) {
      box.scrollTo({ top: last.offsetTop - 12, behavior: "smooth" });
    } else {
      box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    }
  }, [isOpen, messages, typing]);

  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) inputRef.current?.focus();
  }, [isOpen]);

  // On phones, keep the sheet above the on-screen keyboard.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!isOpen || !vv) return;
    const fit = () => {
      if (window.innerWidth >= 768) return setSheetStyle(undefined);
      const keyboard = window.innerHeight - vv.height > 120;
      setSheetStyle(keyboard ? { height: vv.height - 8, bottom: "auto", top: vv.offsetTop + 8 } : undefined);
    };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => {
      vv.removeEventListener("resize", fit);
      vv.removeEventListener("scroll", fit);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.classList.toggle("chatbot-open", isOpen);
    window.dispatchEvent(new CustomEvent("chatbot-toggle", { detail: { isOpen } }));
    return () => document.body.classList.remove("chatbot-open");
  }, [isOpen]);

  // Escape minimises the chat and gives focus back to the chat button.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      setTimeout(() => launcherRef.current?.focus(), 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    const checkSticky = () => setHasStickyBar(!!document.querySelector(".pdp-sticky-active"));
    checkSticky();
    const observer = new MutationObserver(checkSticky);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
    window.addEventListener("scroll", checkSticky, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkSticky);
    };
  }, [pathname]);

  // Questions that match what is being typed.
  const suggestions = useMemo(() => {
    const t = input.trim();
    if (!ready || !engineRef.current || t.length < 3) return [];
    return engineRef.current.suggest(t, 3);
  }, [input, ready]);

  // Hindi when chosen and loaded; English is always the fallback.
  const isHi = () => langRef.current === "hi" && !!hiRef.current;
  const H = () => (isHi() ? hiRef.current : null);
  const tOf = (hi?: boolean): Translate => (str, v) => fill((hi && hiRef.current?.STRINGS_HI[str]) || str, v);
  const t: Translate = (str, v) => tOf(isHi())(str, v);
  const t2 = t;

  if (isHidden) return null;

  const canSpeak = !!speechCtor();
  const isPhone = () => window.innerWidth < 768;
  const minimise = () => {
    setIsOpen(false);
    setConfirmEnd(false);
    setTimeout(() => launcherRef.current?.focus(), 0);
  };
  const open = () => {
    openedOnce.current = true;
    loadEngine();
    setIsOpen(true);
  };

  const aq = (a: ChatAnswer) => H()?.ANSWERS_HI[a.id]?.question || a.question;
  const aa = (a: ChatAnswer) => H()?.ANSWERS_HI[a.id]?.answer || a.answer;
  const menuTitle = (id: string) => H()?.MENUS_HI[id]?.title || MENUS[id]?.title;
  const humanLinks = (q?: string) => HUMAN_LINKS(q).map((l) => ({ ...l, label: t(l.label) }));
  const finderHi = (id: string) => H()?.ALL_FINDERS_HI[id];
  const ft = (str: string) => H()?.ALL_FINDER_TEXT_HI[str] || str;
  const quizName = (f: AnyFinder) => finderHi(f.id)?.short || f.short || f.title;

  const reply = (msg: Reply, delay = 320) => {
    const hi = isHi();
    const tc = (c: Choice) => ({ ...c, label: t(c.label) });
    const shown: Reply = hi
      ? {
          ...msg,
          chips: msg.chips?.map(tc),
          list: msg.list?.map(tc),
          links: msg.links?.map((l) => ({ ...l, label: t(l.label) })),
          multi: msg.multi?.map((o) => ({ ...o, label: t(o.label) })),
          listTitle: msg.listTitle && t(msg.listTitle),
          productsTitle: msg.productsTitle && t(msg.productsTitle),
        }
      : msg;
    return new Promise<void>((resolve) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: newId(), role: "bot", ...shown, hi }]);
        if (!document.querySelector(".chat-sheet")) setUnread((n) => n + 1);
        resolve();
      }, delay);
    });
  };

  const say = (text: string) => setMessages((m) => [...m, { id: newId(), role: "user", text }]);

  const goTo = (href: string) => {
    setTimeout(() => {
      if (href.startsWith("/")) {
        router.push(href);
        if (isPhone()) minimise();
      } else {
        window.open(href, "_blank", "noopener");
      }
    }, 550);
  };

  const rememberName = (n: string) => {
    draftRef.current.name = n;
    setProfile((p) => ({ ...p, name: n }));
    writeJSON("session", NAME_KEY, n);
  };

  const lastBot = () => [...messages].reverse().find((m) => m.role === "bot");
  const live = () => liveRef.current;
  const bestSaving = () =>
    Math.max(0, ...Object.values(live().products).map((p) => Math.max(p.subscription?.monthly || 0, p.subscription?.everyTwoMonths || 0, p.cycleSync || 0)));
  const keyForSlug = (slug: string) => (Object.keys(PRODUCT_META) as ProductKey[]).find((k) => PRODUCT_META[k].href === `/product-detail/${slug}`);
  const flowById = (id: string) => engineRef.current!.SYMPTOM_FLOWS.find((f) => f.id === id)!;
  const bagSubtotal = () => bagItems.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 1), 0);
  const productById = (id?: string | null) => (id ? Object.values(live().products).find((p) => p.id === id) : undefined);
  const prof = () => draftRef.current as { age?: AgeBand; who?: Who; sex?: Sex };

  // ---------- "For you": orders, repeat buys, reviews, the bag and saved items ----------

  const forYouRows = (): ForYouRow[] => {
    const rows: ForYouRow[] = [];
    const c = ctx;
    const latest = c?.orders[0];
    const reviewAmount = live().offers?.rewards?.review;
    if (latest && IN_TRANSIT.includes(latest.status)) {
      rows.push({
        key: "transit",
        icon: Truck,
        title: t("Your order from {date} is {status}", { date: latest.date, status: t(latest.status) }),
        text: t("{n} items · dispatched within 24 to 48 hours of ordering", { n: latest.items }),
        actions: [],
        links: [{ label: t("Track my order"), href: `/dashboard/orders/${latest.id}` }],
      });
    }
    const delivered = c?.orders.find((o) => o.status === "delivered" || o.status === "completed");
    if (delivered && delivered.lines.length) {
      const first = delivered.lines[0].name;
      rows.push({
        key: "rate",
        icon: Heart,
        title: t("How was your {name}?", { name: first }),
        text: t("Delivered order from {date}", { date: delivered.date }),
        actions: [
          { label: t("Loved it"), action: { type: "rate", mood: "up", name: first } },
          { label: t("Not happy"), action: { type: "rate", mood: "down", name: first } },
          { label: t("Buy again"), action: { type: "reorder", orderId: delivered.id } },
        ],
      });
    }
    const period = c?.orders.find((o) => o.lines.some((l) => l.slug && PERIOD_PRODUCTS.includes(l.slug)));
    if (period && period.daysAgo >= 24 && !c?.activeSubscriptions && period.id !== delivered?.id) {
      rows.push({
        key: "restock",
        icon: RefreshCw,
        title: t("Time to restock your period care?"),
        text: t("Your last order was {n} days ago. Subscribe and it arrives before your period.", { n: period.daysAgo }),
        actions: [
          { label: t("Buy again"), action: { type: "reorder", orderId: period.id } },
          { label: t("How do subscriptions work?"), action: { type: "answer", id: "ord-sub-how" } },
        ],
      });
    }
    const review = c?.toReview[0];
    if (review) {
      rows.push({
        key: "review",
        icon: Star,
        title: t("Review your {name}", { name: review.name }),
        text: reviewAmount ? t("Earn ₹{n} credit for an approved review.", { n: reviewAmount }) : t("Help others choose, and earn Rewards credit."),
        actions: [],
        links: [{ label: t("Write a review"), href: "/dashboard/reviews" }],
      });
    }
    if (bagItems.length) {
      const sub = bagSubtotal();
      const { best, next } = bagOffers(sub, differentProductCount(bagItems), { firstOrder: c?.firstOrder, referred: c?.referred });
      rows.push({
        key: "bag",
        icon: ShoppingBag,
        title: t("{n} items waiting in your bag", { n: bagItems.length }),
        text: best
          ? t("{code} saves you ₹{s} on this bag.", { code: best.coupon.code, s: Math.round(best.saving) })
          : next
            ? t("Add ₹{n} more to save ₹{s} with {code}.", { n: next.needed, s: next.saving, code: next.coupon.code })
            : undefined,
        actions: best ? [{ label: t("Apply {code}", { code: best.coupon.code }), action: { type: "apply", code: best.coupon.code } }] : [],
        links: [{ label: t("Go to my bag"), href: "/cart" }],
      });
    }
    if (c && c.firstOrder) {
      const code = c.referred ? "SAATHI20" : "FIRSTCARE15";
      rows.push({
        key: "first",
        icon: Gift,
        title: c.referred ? t("Your friend's gift: 20% off your first order") : t("Your welcome gift: 15% off your first order"),
        text: t("Use {code} on orders of ₹399 and above.", { code }),
        actions: [{ label: t("Help me choose"), action: { type: "finder", id: "ovy" } }],
      });
    }
    if (c?.wishlist.length) {
      rows.push({
        key: "saved",
        icon: Heart,
        title: t("You saved {name}", { name: c.wishlist[0].name }),
        text: c.wishlist.length > 1 ? t("and {n} more in your wishlist", { n: c.wishlist.length - 1 }) : undefined,
        actions: [],
        links: [{ label: t("Open my wishlist"), href: "/wishlist" }],
      });
    }
    const looked = recent.find((s) => s !== pageSlug && keyForSlug(s));
    if (looked && !rows.some((r) => r.key === "bag")) {
      const key = keyForSlug(looked)!;
      rows.push({
        key: "recent",
        icon: ShoppingBag,
        title: t("Still thinking about {name}?", { name: PRODUCT_META[key].name }),
        actions: [{ label: t("What does it cost?"), action: { type: "price", slug: looked } }],
      });
    }
    // Goes well with the last thing they bought.
    const lastKey = c?.orders[0]?.lines.map((l) => (l.slug ? keyForSlug(l.slug) : undefined)).find(Boolean);
    const combo = lastKey ? COMBOS.find((cb) => cb.items.length > 1 && cb.items.includes(lastKey)) : undefined;
    const partner = combo?.items.find((k) => k !== lastKey);
    if (combo && partner && PRODUCT_META[partner].href.startsWith("/product-detail/")) {
      rows.push({
        key: "pair",
        icon: Layers,
        title: t("Goes well with your last order: {name}", { name: PRODUCT_META[partner].name }),
        text: t(combo.why),
        actions: [{ label: t("What does it cost?"), action: { type: "price", slug: PRODUCT_META[partner].href.split("/")[2] } }],
      });
    }
    // Signed in with nothing else to show: their last order, one tap from buying again.
    if (c && latest && !rows.some((r) => ["transit", "rate", "restock"].includes(r.key))) {
      rows.push({
        key: "last",
        icon: Package,
        title: t("Your last order: {date}", { date: latest.date }),
        text: t("{n} items · {status}", { n: latest.items, status: t(latest.status) }),
        actions: latest.lines.length ? [{ label: t("Buy again"), action: { type: "reorder", orderId: latest.id } }] : [],
        links: [{ label: t("View order"), href: `/dashboard/orders/${latest.id}` }],
      });
    }
    if (c === null) {
      rows.push({
        key: "signin",
        icon: UserRound,
        title: t("Sign in to see your orders and offers made for you"),
        text: t("New here? Sign up and get 15% off your first order with FIRSTCARE15."),
        actions: [],
        links: [{ label: t("Sign in"), href: "/login" }],
      });
    }
    const first = ["transit", "rate", "last", "restock"];
    return [...rows.filter((r) => first.includes(r.key)), ...rows.filter((r) => !first.includes(r.key))].slice(0, 4);
  };

  // ---------- Message builders ----------

  const menuMessage = (id: string): Reply | null => {
    const menu = MENUS[id];
    const engine = engineRef.current;
    if (!menu || !engine) return null;
    const lead: Choice[] = [];
    if (["periods", "health", "teens"].includes(id)) lead.push({ label: "Check my symptoms", action: { type: "symptoms" } });
    if (["ovy", "pads", "liners", "panty", "teenkit", "cup"].includes(id)) lead.push({ label: "Help me choose the right product", action: { type: "finder", id: "ovy" } });
    if (["looway", "travel", "yatra", "funnel", "bags", "seatcovers"].includes(id)) lead.push({ label: "Plan my trip hygiene", action: { type: "finder", id: "looway" } });
    const mh = H()?.MENUS_HI[id];
    if (menu.flow) lead.push({ label: mh?.flowLabel || menu.flow.label, action: { type: "flow", node: menu.flow.node } });
    const questions = menu.questions
      .map((q) => engine.answerById(q))
      .filter((a): a is ChatAnswer => !!a)
      .map((a) => ({ label: aq(a), action: { type: "answer", id: a.id } as Action }));
    const intro = mh?.intro || (name && menu.intro.startsWith("Here") ? menu.intro.replace(/\. /, `, ${name}. `) : menu.intro);
    const slug = menu.page?.href.startsWith("/product-detail/") ? menu.page.href.split("/")[2] : null;
    return {
      text: intro,
      list: [...lead, ...questions, ...(slug ? [{ label: "What does it cost?", action: { type: "price", slug } as Action }] : [])],
      links: menu.page ? [{ ...menu.page, label: mh?.pageLabel || menu.page.label }] : undefined,
      chips: [OWN, BACK],
    };
  };

  const answerMessage = (answer: ChatAnswer, q: string, extra: ChatAnswer[] = []): Reply => {
    const engine = engineRef.current!;
    const related = (answer.related || []).map((id) => engine.answerById(id)).filter((a): a is ChatAnswer => !!a);
    const more = [...related, ...extra.filter((e) => e.id !== answer.id && !related.some((r) => r.id === e.id))].slice(0, 3);
    const menuId = TOPIC_MENU[answer.topic];
    const menu = menuId ? MENUS[menuId] : undefined;
    const picks = productsFor(answer);
    const shownLinks = (answer.links || []).filter((l) => !picks.some((k) => PRODUCT_META[k].href === l.href)).slice(0, 2);
    return {
      text: aa(answer),
      links: shownLinks,
      products: picks.map((product) => ({ product })),
      productsTitle: picks.length ? "Products that can help" : undefined,
      combo: comboFor(picks),
      listTitle: more.length ? "Related questions" : undefined,
      list: more.map((a) => ({ label: aq(a), action: { type: "answer", id: a.id } as Action })),
      chips: [
        ...(menu ? [{ label: t("More on {topic}", { topic: isHi() ? menuTitle(menu.id) : menu.title.toLowerCase() }), action: { type: "menu", id: menu.id } as Action }] : []),
        BACK,
      ],
      // Coupon questions show today's coupons.
      coupons: answer.id.startsWith("ord-coupon") ? {} : undefined,
      feedback: { q, answerId: answer.id },
    };
  };

  const topicsMessage = (text: string): Reply => ({ text, list: ALL_TOPICS, chips: [OWN, HUMAN] });

  const quizzesMessage = (): Reply => ({
    text: t("Quizzes and planners: a few quick taps, then my picks for you. Each one matches the quiz on our site."),
    list: QUIZ_LIST.map((f) => ({ label: quizName(f), action: { type: "finder", id: f.id } as Action })),
    chips: [{ label: "Check my symptoms", action: { type: "symptoms" } }, BACK],
  });

  const offersMessage = (): Reply => {
    const sub = bagSubtotal();
    const different = differentProductCount(bagItems);
    const { best, next } = bagOffers(sub, different, { firstOrder: ctx ? ctx.firstOrder : true, referred: ctx?.referred });
    const nudgeText = !bagItems.length
      ? ""
      : best
        ? t("\n\nFor the ₹{sub} in your bag, **{code}** saves you ₹{s} right now.", { sub: Math.round(sub), code: best.coupon.code, s: Math.round(best.saving) })
        : "";
    const nextText = bagItems.length && next ? t("\n\nAdd ₹{n} more to save ₹{s} with **{code}**.", { n: next.needed, s: next.saving, code: next.coupon.code }) : "";
    const freeFrom = live().offers?.freeDeliveryFrom || 399;
    const freeText = sub > 0 && sub < freeFrom ? t("\n\nAdd ₹{n} more for free delivery.", { n: Math.ceil(freeFrom - sub) }) : "";
    return {
      text: t("Here's how to save at Potent{n}.", nv(name)) + nudgeText + freeText + nextText,
      coupons: { highlight: best?.coupon.code },
      offers: true,
      chips: [
        { label: "How do subscriptions work?", action: { type: "answer", id: "ord-sub-how" } },
        { label: "Help me choose", action: { type: "finder", id: "ovy" } },
        BACK,
      ],
    };
  };

  const priceMessage = (slug: string): Reply => {
    const info = live().products[slug];
    const key = keyForSlug(slug);
    const nameOf = key ? PRODUCT_META[key].name : t("this product");
    const o = live().offers;
    const subs = info?.subscription ? Math.max(info.subscription.monthly, info.subscription.everyTwoMonths) : 0;
    return {
      text: info?.variants.length
        ? t("Today's prices for **{name}**, GST included.", { name: nameOf }) +
          (subs ? t(" Subscribe and save up to {s}%.", { s: subs }) : "") +
          (o ? t(" Delivery is free from ₹{f}; below that it's ₹{fee}.", { f: o.freeDeliveryFrom, fee: o.deliveryFee }) : "")
        : t("The latest price for {name} is on its page, GST included.", { name: nameOf }),
      price: info?.variants.length ? slug : undefined,
      products: key ? [{ product: key }] : undefined,
      combo: key ? comboFor([key]) : undefined,
      chips: [{ label: "See all offers", action: { type: "offers" } }, BACK],
    };
  };

  const priceChooser = (): Reply => ({
    text: t("Which product would you like the price for?"),
    list: (Object.keys(PRODUCT_META) as ProductKey[])
      .filter((k) => PRODUCT_META[k].href.startsWith("/product-detail/"))
      .map((k) => ({ label: PRODUCT_META[k].name, action: { type: "price", slug: PRODUCT_META[k].href.split("/")[2] } as Action })),
    chips: [{ label: "See all offers", action: { type: "offers" } }, BACK],
  });

  const comboLine = () => {
    const different = new Set(useCartStore.getState().items.map((i) => i.productId)).size;
    const items = useCartStore.getState().items;
    const sub = items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
    const { best, next } = bagOffers(sub, different, { firstOrder: ctx ? ctx.firstOrder : false, referred: ctx?.referred });
    const freeFrom = live().offers?.freeDeliveryFrom || 399;
    return (
      (sub > 0 && sub < freeFrom ? t(" Add ₹{n} more for free delivery.", { n: Math.ceil(freeFrom - sub) }) : "") +
      (best ? t(" **{code}** saves you ₹{s} on this bag.", { code: best.coupon.code, s: Math.round(best.saving) }) : "") +
      (next ? t(" Add ₹{n} more to save ₹{s} with {code}.", { n: next.needed, s: next.saving, code: next.coupon.code }) : "")
    );
  };

  const addFromChat = async (slug: string, v: LiveVariant) => {
    const info = live().products[slug];
    if (!info || typing) return;
    const title = `${info.name || "Potent product"}${v.name ? ` (${v.name})` : ""}`;
    say(t("Add {title} to my bag", { title }));
    const ok = await addToCartAction({
      productId: info.id,
      productVariantId: v.id,
      sku: v.sku,
      slug: info.dbSlug,
      title,
      variantName: v.name,
      price: v.price,
      image: getImageUrl(v.image || info.image || "/placeholder.jpg"),
      quantity: 1,
    } as Parameters<typeof addToCartAction>[0]);
    return reply({
      text: ok === false ? t("I couldn't add that just now. Please try from the product page.") : t("Added **{title}** to your bag.", { title }) + comboLine(),
      links: [{ label: "Go to my bag", href: "/cart" }],
      chips: [{ label: "See all offers", action: { type: "offers" } }, { label: "Help me choose", action: { type: "finder", id: "ovy" } }, BACK],
    });
  };

  // Buy a past order again: every item still on sale goes into the bag.
  const reorder = async (orderId: string) => {
    const o = ctx?.orders.find((x) => x.id === orderId);
    if (!o) return reply({ text: t("Sign in and I'll find your last order."), links: [{ label: "Sign in", href: "/login" }], chips: [BACK] });
    let added = 0;
    const skipped: { name: string; slug: string | null }[] = [];
    for (const l of o.lines) {
      const info = productById(l.productId);
      const v = info?.variants.find((x) => x.id === l.variantId);
      if (!info || info.isMixBox || !v || !v.inStock) {
        skipped.push({ name: l.name, slug: info?.slug || null });
        continue;
      }
      const ok = await addToCartAction({
        productId: info.id,
        productVariantId: v.id,
        sku: v.sku,
        slug: info.dbSlug,
        title: `${info.name}${v.name ? ` (${v.name})` : ""}`,
        variantName: v.name,
        price: v.price,
        image: getImageUrl(v.image || info.image || "/placeholder.jpg"),
        quantity: Math.min(4, l.quantity || 1),
      } as Parameters<typeof addToCartAction>[0]);
      if (ok !== false) added++;
    }
    return reply({
      text:
        (added ? t("Done. I've added {n} items from your order of {date} to your bag, at today's prices.", { n: added, date: o.date }) : t("I couldn't add those items automatically.")) +
        (skipped.length ? t(" Open {names} on its page to pick your box or size again.", { names: skipped.map((s) => s.name).join(", ") }) : "") +
        (added ? comboLine() : ""),
      links: [
        ...(added ? [{ label: "Go to my bag", href: "/cart" }] : []),
        ...skipped.filter((s) => s.slug).slice(0, 2).map((s) => ({ label: t("Open {name}", { name: s.name }), href: `/product-detail/${s.slug}` })),
      ],
      chips: [{ label: "How do subscriptions work?", action: { type: "answer", id: "ord-sub-how" } }, BACK],
    });
  };

  // Signed-in customers see their latest orders when they ask about one.
  const ORDER_ANSWERS = ["ord-track-order", "ord-delivery-delayed", "ord-marked-delivered", "ord-cancel-order", "ord-unpaid-order"];
  const withOrders = async (msg: Reply, answerId: string): Promise<Reply> => {
    if (!ORDER_ANSWERS.includes(answerId)) return msg;
    const c = ctx === undefined ? await getChatContext().catch(() => null) : ctx;
    if (ctx === undefined) setCtx(c);
    if (!c) return { ...msg, text: msg.text + t("\n\nSign in and I'll show your latest orders here."), links: [{ label: "Sign in", href: "/login" }, ...(msg.links || [])] };
    if (!c.orders.length) return { ...msg, text: msg.text + t("\n\nI don't see any orders on your account yet.") };
    return { ...msg, orders: c.orders };
  };

  // "My orders": the latest orders and everything waiting for the customer.
  const accountMessage = async (): Promise<Reply> => {
    const c = ctx === undefined ? await getChatContext().catch(() => null) : ctx;
    if (ctx === undefined) setCtx(c);
    if (!c) {
      return {
        text: t("Sign in and I'll show your orders, help you buy again and find offers made for you."),
        forYou: true,
        chips: [{ label: "Orders & delivery", action: { type: "menu", id: "orders" } }, BACK],
      };
    }
    return {
      text: c.orders.length ? t("Here's your account at a glance{n}.", nv(name)) : t("No orders yet{n}. Here's what's waiting for you.", nv(name)),
      orders: c.orders.length ? c.orders : undefined,
      forYou: true,
      chips: [
        ...(c.orders[0] ? [{ label: "Buy my last order again", action: { type: "reorder", orderId: c.orders[0].id } as Action }] : []),
        { label: "Orders & delivery", action: { type: "menu", id: "orders" } },
        BACK,
      ],
    };
  };

  // ---------- Symptom check-ins ----------

  const symptomMenu = (): Reply => ({
    text: t("What's bothering you{n}? I'll ask a few quick questions, then explain what it's commonly linked to, what helps and when to see a doctor.", nv(name)),
    list: engineRef.current!.SYMPTOM_FLOWS.map((f) => ({ label: H()?.SYMPTOMS_HI[f.id]?.short || f.short, action: { type: "symptom", id: f.id } as Action })),
    chips: [{ label: "Quizzes & planners", action: { type: "quizzes" } }, OWN, BACK],
  });

  /** The next detail to ask for, or null when we have what this check-in needs. */
  const nextProfileQuestion = (flowId: string): Reply | null => {
    const flow = flowById(flowId);
    const p = draftRef.current;
    if (!p.name && !askedNameRef.current) {
      askedNameRef.current = true;
      taskRef.current = { kind: "profile", step: "name", flowId };
      return {
        text: t("Before I guide you, a few quick details so my answer fits you. **They stay on this device for this chat only and are never saved or shared.**\n\nWhat should I call you? Type your first name, or skip."),
        chips: [{ label: "Skip", action: { type: "skip" } }],
      };
    }
    if (flow.needs.who && !p.who) {
      taskRef.current = { kind: "profile", step: "who", flowId };
      const whos = WHOS.filter((o) => !flow.whoOptions || flow.whoOptions.includes(o.id));
      return { text: t("Who is this for?"), list: whos.map((o) => ({ label: o.label, action: { type: "opt", value: o.id } as Action })) };
    }
    const ages = AGES.filter((o) => !flow.ageOptions || flow.ageOptions.some((a) => a === o.id || (a === "u13" && ["u5", "5-12"].includes(o.id)) || (a === "40-49" && ["40-44", "45-49"].includes(o.id))));
    if (!p.age) {
      taskRef.current = { kind: "profile", step: "age", flowId };
      const text =
        p.who === "daughter" ? t("How old is she?") : p.who === "son" ? t("How old is he?") : p.who === "someone" ? t("How old are they?") : t("How old are you{n}?", nv(p.name));
      return { text, list: ages.map((o) => ({ label: o.label, action: { type: "opt", value: o.id } as Action })) };
    }
    if (flow.needs.sex && !p.sex && (!p.who || p.who === "me" || p.who === "someone")) {
      taskRef.current = { kind: "profile", step: "sex", flowId };
      return {
        text: p.who === "someone" ? t("Are they female or male?") : t("Are you female or male?"),
        list: SEXES.map((o) => ({ label: o.label, action: { type: "opt", value: o.id } as Action })),
      };
    }
    return null;
  };

  /** The next question that fits this person and their answers so far. */
  const visibleQuestion = (flow: SymptomFlow, from: number, answers: Record<string, string[]>) => {
    for (let i = from; i < flow.questions.length; i++) {
      const q = flow.questions[i];
      if (!applies(q.showIf, prof(), answers)) continue;
      const options = q.options.filter((o) => applies(o.showIf, prof(), answers));
      if (options.length) return { i, q, options };
    }
    return null;
  };

  const askSymptomQuestion = (flowId: string, from: number, answers: Record<string, string[]>, history: Step[] = []) => {
    const flow = flowById(flowId);
    const found = visibleQuestion(flow, from, answers);
    if (!found) return finishSymptom(flowId, answers);
    const { i, q, options } = found;
    const fh = H()?.SYMPTOMS_HI[flowId];
    const qh = fh?.questions[q.id];
    const label = (o: { id: string; label: string }) => qh?.options[o.id] || o.label;
    taskRef.current = { kind: "symptom", flowId, qi: i, answers, history };
    setMultiSel([]);
    const intro = !history.length ? t("Thanks{n}. Let's look at {title}.\n\n", { ...nv(draftRef.current.name), title: fh?.title || flow.title.toLowerCase() }) : "";
    const stop: Choice = { label: "Stop the check-in", action: { type: "topics" } };
    const chips = history.length ? [STEP_BACK, stop] : [stop];
    const text = `${intro}${qh?.text || q.text}`;
    return reply(
      q.multi
        ? { text, multi: options.map((o) => ({ id: o.id, label: label(o) })), chips }
        : { text, list: options.map((o) => ({ label: label(o), action: { type: "opt", value: o.id } as Action })), chips },
    );
  };

  const continueProfileOrStart = (flowId: string) => {
    const next = nextProfileQuestion(flowId);
    if (next) return reply(next);
    const flow = flowById(flowId);
    // This check-in doesn't fit the person: say so kindly and offer the right ones.
    if (!applies(flow.showIf, prof())) {
      taskRef.current = null;
      const fh = H()?.SYMPTOMS_HI[flowId] as { notFor?: string } | undefined;
      const fits = engineRef.current!.SYMPTOM_FLOWS.filter((f) => f.id !== flowId && applies(f.showIf, prof()));
      return reply({
        text: fh?.notFor || flow.notFor || t("This check-in isn't the right fit for the details you gave. Here are ones that are."),
        list: fits.slice(0, 6).map((f) => ({ label: H()?.SYMPTOMS_HI[f.id]?.short || f.short, action: { type: "symptom", id: f.id } as Action })),
        chips: [OWN, BACK, HUMAN],
      });
    }
    return askSymptomQuestion(flowId, 0, {});
  };

  const startSymptom = (flowId: string) => {
    draftRef.current = { ...profile, ...draftRef.current, name: draftRef.current.name || profile.name };
    return continueProfileOrStart(flowId);
  };

  const finishSymptom = (flowId: string, answers: Record<string, string[]>) => {
    const engine = engineRef.current!;
    const picked = engine.pickOutcome(flowById(flowId), answers, prof());
    const oh = H()?.SYMPTOMS_HI[flowId]?.outcomes[picked.id];
    const outcome: SymptomOutcome = oh
      ? {
          ...picked,
          title: oh.title,
          summary: oh.summary,
          oftenLinkedTo: oh.oftenLinkedTo,
          whatHelps: oh.whatHelps,
          seeDoctor: oh.seeDoctor,
          readMore: picked.readMore?.map((l, i) => ({ ...l, label: oh.readMore?.[i] || l.label })),
        }
      : picked;
    taskRef.current = null;
    setProfile((p) => ({ ...p, ...draftRef.current }));
    const urgent = outcome.urgency === "emergency";
    return reply(
      {
        text: t("Here's what I can tell you{n}:", nv(draftRef.current.name)),
        result: outcome,
        products: urgent ? undefined : (outcome.products || []).slice(0, 2).map((product) => ({ product })),
        productsTitle: !urgent && outcome.products?.length ? "Products that may make it easier" : undefined,
        links: [...(outcome.readMore || []).slice(0, 1), ...(outcome.urgency === "selfcare" ? [] : [humanLinks()[0]])],
        chips: [{ label: "Check another symptom", action: { type: "symptoms" } }, BACK, HUMAN],
      },
      450,
    );
  };

  // ---------- Finders, quizzes and planners ----------

  const askFinderStep = (rawId: string, si: number, answers: Record<string, string[]>, history: Step[] = []) => {
    const id = finderFor(rawId);
    const finder = ALL_FINDERS[id];
    if (!finder) return reply(topicsMessage(t("What would you like help with?")));
    let i = si;
    const optionsAt = (n: number) => finder.steps[n].options.filter((o) => !finder.hideOption?.(finder.steps[n].id, o.id, answers));
    while (i < finder.steps.length && (finder.skip?.(finder.steps[i].id, answers) || !optionsAt(i).length)) i++;
    if (i >= finder.steps.length) return finishFinder(id, answers);
    const step = finder.steps[i];
    const sh = finderHi(id)?.steps[step.id];
    const label = (o: { id: string; label: string }) => sh?.options[o.id] || o.label;
    taskRef.current = { kind: "finder", id, si: i, answers, history };
    setMultiSel([]);
    const intro = !history.length ? t("Let's find your best match{n}. ", nv(name)) : "";
    const text = `${intro}${sh?.text || step.text}`;
    const chips = history.length ? [STEP_BACK, BACK] : [BACK];
    const options = optionsAt(i);
    return reply(
      step.multi
        ? { text, multi: options.map((o) => ({ id: o.id, label: label(o) })), chips }
        : { text, list: options.map((o) => ({ label: label(o), action: { type: "opt", value: o.id } as Action })), chips },
    );
  };

  const finishFinder = (id: string, answers: Record<string, string[]>) => {
    const finder = ALL_FINDERS[id];
    const res = finder.result(answers);
    taskRef.current = null;
    const o = live().offers;
    const keys = res.picks.map((p) => p.product);
    // Results in Hindi: whole sentences, with the size filled in after.
    const why = (p: ProductPick) => {
      if (!p.why || !H()) return p.why;
      if (H()!.ALL_FINDER_TEXT_HI[p.why]) return ft(p.why);
      return p.size ? ft(p.why.replace(p.size, "{size}")).replace("{size}", ft(p.size)) : p.why;
    };
    const picks = res.picks.map((p) => ({ ...p, why: why(p), size: p.size && ft(p.size) }));
    const page = (finder as AnyFinder).page;
    return reply(
      {
        text:
          `**${ft(res.title)}**\n${ft(res.intro)}${res.tip ? `\n\n${ft(res.tip)}` : ""}` +
          (o && picks.length ? t("\n\nDelivery is free from ₹{f}; below that it's ₹{fee}.", { f: o.freeDeliveryFrom, fee: o.deliveryFee }) : ""),
        products: picks,
        checklist: res.checklist?.map(ft),
        combo: keys.length === 1 ? comboFor(keys) : undefined,
        links: [...(res.links || []).map((l) => ({ ...l, label: ft(l.label) })), ...(page && !(res.links || []).some((l) => l.href === page.href) ? [{ ...page, label: ft(page.label) }] : [])].slice(0, 2),
        chips: [{ label: "Start again", action: { type: "finder", id } }, { label: "See all offers", action: { type: "offers" } }, { label: "Quizzes & planners", action: { type: "quizzes" } }, BACK],
      },
      450,
    );
  };

  /** One step back in a check-in or finder. */
  const stepBack = () => {
    const task = taskRef.current;
    if (!task || task.kind === "profile" || !task.history.length) return reply(topicsMessage(t("What would you like help with?")));
    const prev = task.history[task.history.length - 1];
    const history = task.history.slice(0, -1);
    return task.kind === "symptom" ? askSymptomQuestion(task.flowId, prev.at, prev.answers, history) : askFinderStep(task.id, prev.at, prev.answers, history);
  };

  // ---------- Feedback on a delivered order ----------

  const rateMessage = (mood: "up" | "down", product: string): Reply => {
    const r = live().offers?.rewards;
    if (mood === "up") {
      return {
        text:
          t("That makes my day{n}! A short review helps other women choose, and earns you Rewards credit.", nv(name)) +
          (r ? t(" Up to ₹{n} for an approved review.", { n: r.review }) : "") +
          t("\n\nLove it enough to share? Your friend gets 20% off with **SAATHI20**, and you get 15% off with **SHARECARE15** once their first order is delivered."),
        links: [
          { label: "Write a review", href: "/dashboard/reviews" },
          { label: "Get my referral link", href: "/dashboard/referral" },
        ],
        chips: [{ label: "Buy again", action: { type: "account" } }, BACK],
      };
    }
    return {
      text: t("I'm sorry {name} didn't feel right. What went wrong? I'll pass it to the team and help you fix it.", { name: product }),
      list: [
        { label: "Size or fit", action: { type: "issue", topic: "size", name: product } },
        { label: "Leaks", action: { type: "issue", topic: "leaks", name: product } },
        { label: "Comfort or rash", action: { type: "issue", topic: "comfort", name: product } },
        { label: "Delivery or packing", action: { type: "issue", topic: "delivery", name: product } },
        { label: "Something else", action: { type: "issue", topic: "other", name: product } },
      ],
      chips: [BACK],
    };
  };

  const issueMessage = async (topic: string, product: string): Promise<Reply> => {
    logChatQuestion(`FEEDBACK on ${product}: ${topic}`, pathname || "/").catch(() => {});
    const engine = engineRef.current || (await loadEngine());
    const find = (q: string) => {
      const r = engine.findAnswer(q);
      return r.kind === "answer" ? r.answer : undefined;
    };
    const help: Record<string, { text: string; choices: Choice[] }> = {
      size: {
        text: t("Thanks for telling me. The right size fixes most problems. These quizzes match what our site recommends."),
        choices: [
          { label: "Find my pad size", action: { type: "finder", id: "pad-size" } },
          { label: "Find my cup size", action: { type: "finder", id: "cup-size" } },
        ],
      },
      leaks: { text: t("Thanks for telling me. Leaks usually come down to size or position. Here's what helps."), choices: [] },
      comfort: { text: t("Thanks for telling me. Here's what usually helps with comfort and rashes."), choices: [] },
      delivery: { text: t("Thanks for telling me. I've passed it to the team."), choices: [] },
      other: { text: t("Thanks for telling me. I've passed it to the team, and a person can help you directly."), choices: [] },
    };
    const extra =
      topic === "leaks" ? find("pad leaking at night") : topic === "comfort" ? find("rash from pads") : topic === "delivery" ? find("order delivered late") : undefined;
    const h = help[topic] || help.other;
    return {
      text: h.text,
      list: [...h.choices, ...(extra ? [{ label: aq(extra), action: { type: "answer", id: extra.id } as Action }] : [])],
      links: humanLinks(`feedback about ${product}`),
      chips: [BACK],
    };
  };

  // ---------- Answering typed text ----------

  async function respondTo(question: string) {
    const engine = engineRef.current || (await loadEngine());
    // Typing in Hindi switches the chat to Hindi.
    if (DEVANAGARI.test(question) && langRef.current !== "hi") {
      try {
        await loadHindi();
        setLang("hi");
      } catch {}
    }

    const safety = engine.safetyCheck(question);
    if (safety) {
      taskRef.current = null;
      const text = t(
        safety.kind === "crisis"
          ? "I'm really sorry you're feeling this way. You deserve support right now. Please call **Tele MANAS on 14416** (free, 24 hours, in Indian languages), or **112** if you are in danger. If you can, tell someone you trust who is near you."
          : safety.kind === "abuse"
            ? "I'm so sorry this happened. It is not your fault. If you are in danger, call **112**. You can call the **Women Helpline on 181**, and if you are under 18, **Childline on 1098**. Both are free and confidential."
            : "This sounds like it needs a doctor now. Please call **112** or go to the nearest emergency department straight away.",
      );
      const call = (n: string) => ({ label: t("Call {n}", { n }), href: `tel:${n}` });
      const links = safety.kind === "crisis" ? [call("14416"), call("112")] : safety.kind === "abuse" ? [call("181"), call("112")] : [call("112")];
      return reply({ text, links, tone: "safety" }, 200);
    }

    // Typing a first name during the details step.
    const task = taskRef.current;
    if (task?.kind === "profile" && task.step === "name") {
      const first = question.trim().split(/\s+/)[0].replace(/[^A-Za-zऀ-ॿ]/g, "").slice(0, 20);
      if (first.length >= 2) rememberName(first[0].toUpperCase() + first.slice(1).toLowerCase());
      return continueProfileOrStart(task.flowId);
    }
    // Any other typing ends a check-in or finder and is answered normally.
    taskRef.current = null;

    const told = engine.extractName(question);
    if (told) {
      rememberName(told);
      return reply(topicsMessage(t("Lovely to meet you, {name}! What would you like help with?", { name: told })));
    }

    if (engine.isGreeting(question)) return reply(topicsMessage(t("Hello{sp}! What would you like help with today?", nv(name))));

    if (engine.isYes(question)) {
      const target = lastBot()?.links?.find((l) => !l.href.startsWith("tel:"));
      if (target) {
        reply({ text: t("Opening {label} for you.", { label: target.label }) });
        return goTo(target.href);
      }
    }
    if (engine.isAck(question) || engine.isYes(question)) {
      return reply({ text: t("Glad I could help{n}! Anything else you'd like to know?", nv(name)), chips: [OWN, BACK] });
    }
    if (engine.isNo(question)) return reply({ text: t("No problem. I'm right here whenever you need me."), chips: [BACK, HUMAN] });

    const bare = engine.normalise(question);

    // Prices: today's prices for the product named, or ask which one.
    if (engine.isPriceQuestion(question)) {
      const named = Object.keys(WORDS)
        .sort((x, y) => y.length - x.length)
        .find((w) => ` ${bare} `.includes(` ${w} `));
      const page = named ? MENUS[WORDS[named]]?.page?.href : undefined;
      const slug = page?.startsWith("/product-detail/") ? page.split("/")[2] : null;
      return reply(slug ? priceMessage(slug) : priceChooser());
    }

    if (REORDER_WORDS.test(bare) || REORDER_HI.test(bare)) {
      const c = ctx === undefined ? await getChatContext().catch(() => null) : ctx;
      if (ctx === undefined) setCtx(c);
      return c?.orders[0] ? reorder(c.orders[0].id) : reply(await accountMessage());
    }
    if (MY_ORDERS_WORDS.test(bare) || MY_ORDERS_HI.test(bare)) return reply(await accountMessage());
    if (REVIEW_WORDS.test(bare)) return reply(rateMessage("up", ctx?.toReview[0]?.name || t("your order")));
    if (OFFER_WORDS.test(bare) || OFFER_HI.test(bare)) return reply(offersMessage());
    if (QUIZ_WORDS.test(bare) || QUIZ_HI.test(bare)) return reply(quizzesMessage());

    if (TRIP_PLAN_WORDS.test(bare) || TRIP_PLAN_HI.test(bare)) return askFinderStep("looway", 0, {});
    if (CHOOSE_WORDS.test(bare) || CHOOSE_HI.test(bare)) return askFinderStep(TRAVEL_WORDS.test(bare) || TRAVEL_HI.test(bare) ? "looway" : "ovy", 0, {});

    // Describing a symptom: offer the guided check-in first.
    // Product questions ("which pad for heavy flow") get answers, unless they
    // also describe a real symptom.
    const mentionsProduct = Object.keys(WORDS).some((w) => ` ${bare} `.includes(` ${w} `));
    const strongSymptom =
      /\b(bleed|bleeding|blood|pain|dard|itch|itching|burn|burning|smell|lump|clot|clots|fever|rash|late|missed|spotting|sore|swelling)\b/.test(bare) || SYMPTOM_HI.test(bare);
    const flow = !mentionsProduct || strongSymptom ? engine.findSymptomFlow(question) : null;
    if (flow) {
      const quick = engine.findAnswer(question);
      return reply({
        text: t("I'm sorry you're dealing with this{n}. I can guide you much better with a few quick questions about {title}. It takes under a minute.", {
          ...nv(name),
          title: H()?.SYMPTOMS_HI[flow.id]?.title || flow.title.toLowerCase(),
        }),
        list: [
          { label: "Yes, check my symptoms", action: { type: "symptom", id: flow.id } },
          ...(quick.kind === "answer" ? [{ label: "Just give me a quick answer", action: { type: "answer", id: quick.answer.id } as Action }] : []),
        ],
        chips: [BACK],
      });
    }

    if (WORDS[bare]) {
      const msg = menuMessage(WORDS[bare]);
      if (msg) return reply(msg);
    }

    const nav = engine.findNavigation(question);
    if (nav) {
      const label = isHi() ? nav.label.replace(/^(the|your) /, "") : nav.label;
      reply({ text: t("Opening {label} for you.", { label }), links: [{ label: t("Open {label}", { label }), href: nav.href }] });
      return goTo(nav.href);
    }

    const result = engine.findAnswer(question);
    if (result.kind === "answer") return reply(await withOrders(answerMessage(result.answer, question, result.alternatives), result.answer.id));
    if (result.kind === "unsure") {
      return reply({
        text: t("I want to get this right. Did you mean one of these?"),
        list: result.options.map((a) => ({ label: aq(a), action: { type: "answer", id: a.id } as Action })),
        chips: [{ label: "None of these", action: { type: "human" } }, BACK],
      });
    }

    logChatQuestion(question, pathname || "/").catch(() => {});
    return reply({
      text: t(
        "Sorry{sp}, I don't have an answer for that yet, so I've passed your question to our team. For a quick reply, message us on WhatsApp (Monday to Saturday, 10 am to 7 pm) or email care@potenthygiene.com.",
        nv(name),
      ),
      links: humanLinks(question),
      chips: [OWN, BACK],
    });
  }

  // ---------- Taps ----------

  async function run(action: Action, label: string) {
    if (typing) return;
    if (action.type === "type") return inputRef.current?.focus();
    say(label);
    const engine = engineRef.current || (await loadEngine());
    const task = taskRef.current;

    if (action.type === "back") return stepBack();

    if (action.type === "opt" || action.type === "skip") {
      if (task?.kind === "profile") {
        if (action.type === "opt") {
          if (task.step === "who") draftRef.current.who = action.value as Who;
          if (task.step === "age") draftRef.current.age = action.value as AgeBand;
          if (task.step === "sex") draftRef.current.sex = action.value as Sex;
        }
        return continueProfileOrStart(task.flowId);
      }
      if (task?.kind === "symptom" && action.type === "opt") {
        const flow = flowById(task.flowId);
        const answers = { ...task.answers, [flow.questions[task.qi].id]: [action.value] };
        return askSymptomQuestion(task.flowId, task.qi + 1, answers, [...task.history, { at: task.qi, answers: task.answers }]);
      }
      if (task?.kind === "finder" && action.type === "opt") {
        const step = ALL_FINDERS[task.id].steps[task.si];
        return askFinderStep(task.id, task.si + 1, { ...task.answers, [step.id]: [action.value] }, [...task.history, { at: task.si, answers: task.answers }]);
      }
      return reply(topicsMessage(t("What would you like help with?")));
    }

    taskRef.current = null;
    if (action.type === "ask") return respondTo(action.q);
    if (action.type === "topics") return reply(topicsMessage(t("What would you like help with?")));
    if (action.type === "offers") return reply(offersMessage());
    if (action.type === "quizzes") return reply(quizzesMessage());
    if (action.type === "account") return reply(await accountMessage());
    if (action.type === "reorder") return reorder(action.orderId);
    if (action.type === "rate") return reply(rateMessage(action.mood, action.name));
    if (action.type === "issue") return reply(await issueMessage(action.topic, action.name));
    if (action.type === "apply") {
      if (!bagItems.length) {
        return reply({
          text: t("Your bag is empty right now. Add what you need, then use **{code}** in your bag.", { code: action.code }),
          links: [{ label: "Shop all products", href: "/shop" }],
          chips: [{ label: "Help me choose", action: { type: "finder", id: "ovy" } }, BACK],
        });
      }
      reply({ text: t("Opening your bag with **{code}** applied.", { code: action.code }) });
      // Already on the bag page: apply it there; otherwise open the bag with it.
      if (pathname === "/cart") {
        window.dispatchEvent(new CustomEvent("potent-apply-coupon", { detail: { code: action.code } }));
        if (isPhone()) setTimeout(minimise, 550);
        return;
      }
      return goTo(`/cart?coupon=${encodeURIComponent(action.code)}`);
    }
    if (action.type === "price") return reply(priceMessage(action.slug));
    if (action.type === "symptoms") return reply(symptomMenu());
    if (action.type === "symptom") return startSymptom(action.id);
    if (action.type === "finder") return askFinderStep(action.id, 0, {});
    if (action.type === "nav") {
      reply({ text: t("Opening {label} for you.", { label: action.label }) });
      return goTo(action.href);
    }
    if (action.type === "human") {
      return reply({
        text: t("Our team is on WhatsApp and phone (+91 63758 81514) Monday to Saturday, 10 am to 7 pm, and on email any time. For bulk orders, write to info@potenthygiene.com."),
        links: humanLinks(),
        chips: [BACK],
      });
    }
    if (action.type === "flow") {
      // The site's own pad and cup quizzes replace the older short flows.
      const quiz = FLOW_TO_QUIZ[action.node];
      if (quiz && ALL_FINDERS[quiz]) return askFinderStep(quiz, 0, {});
      const node = FLOWS[action.node];
      if (!node) return;
      const fh = H()?.FLOWS_HI[action.node];
      if (isFlowResult(node)) {
        const cup = action.node.startsWith("cup");
        const product: ProductKey = cup ? "ovy-cup" : "ovy-pads";
        return reply({
          text: fh?.text || node.text,
          products: [{ product }],
          combo: comboFor([product]),
          chips: [{ label: "Start again", action: { type: "flow", node: cup ? "cup:start" : "pad:start" } }, { label: "What does it cost?", action: { type: "price", slug: product } }, BACK],
        });
      }
      return reply({
        text: fh?.text || node.text,
        list: node.options.map((o) => ({ label: fh?.options?.[o.label] || fh?.options?.[o.next] || o.label, action: { type: "flow", node: o.next } as Action })),
        chips: [BACK],
      });
    }
    if (action.type === "menu") {
      const msg = menuMessage(action.id);
      return msg ? reply(msg) : respondTo(label);
    }
    const answer = engine.answerById(action.id);
    return answer ? reply(await withOrders(answerMessage(answer, label), answer.id)) : respondTo(label);
  }

  // Pick-several questions: tick options, then Done.
  async function submitMulti() {
    const task = taskRef.current;
    if (!multiSel.length || !task || task.kind === "profile") return;
    const labels = (lastBot()?.multi || []).filter((o) => multiSel.includes(o.id)).map((o) => o.label);
    say(labels.join(", "));
    if (task.kind === "symptom") {
      const flow = flowById(task.flowId);
      const answers = { ...task.answers, [flow.questions[task.qi].id]: multiSel };
      return askSymptomQuestion(task.flowId, task.qi + 1, answers, [...task.history, { at: task.qi, answers: task.answers }]);
    }
    const step = ALL_FINDERS[task.id].steps[task.si];
    return askFinderStep(task.id, task.si + 1, { ...task.answers, [step.id]: multiSel }, [...task.history, { at: task.si, answers: task.answers }]);
  }

  const toggleMulti = (id: string) =>
    setMultiSel((cur) => {
      const noneIds = ["none", "no", "none-of-these", "nothing"];
      if (noneIds.includes(id)) return cur.includes(id) ? [] : [id];
      const base = cur.filter((x) => !noneIds.includes(x));
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    });

  const giveFeedback = (msg: ChatMessage, up: boolean) => {
    if (msg.feedback?.given) return;
    setMessages((all) => all.map((m) => (m.id === msg.id && m.feedback ? { ...m, feedback: { ...m.feedback, given: up ? "up" : "down" } } : m)));
    if (!up && msg.feedback) {
      logChatQuestion(`NOT HELPFUL: "${msg.feedback.q}" got answer ${msg.feedback.answerId}`, pathname || "/").catch(() => {});
      reply({
        text: t("Thanks for telling me. I've passed this to the team so we can improve it. Would you like to talk to a person?"),
        links: humanLinks(msg.feedback.q),
        chips: [OWN, BACK],
      });
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = input.trim();
    if (!q || typing) return;
    setInput("");
    say(q);
    await respondTo(q);
  }

  const startVoice = () => {
    const Ctor = speechCtor();
    if (!Ctor || listening) return;
    const rec = new Ctor();
    rec.lang = langRef.current === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      if (text) {
        say(text);
        respondTo(text);
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setListening(false);
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        reply({ text: t("I can't use the microphone. Please allow microphone access for this site, or type your question instead.") });
      } else if (e?.error !== "aborted") {
        reply({ text: t("I couldn't catch that. Please try again, or type your question.") });
      }
    };
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  // EN | हिंदी in the header. New replies follow the choice; earlier ones stay as they were.
  const switchLang = async () => {
    if (langBusy || typing) return;
    const next: Lang = langRef.current === "hi" ? "en" : "hi";
    if (next === "hi") {
      setLangBusy(true);
      try {
        await loadHindi();
      } catch {
        setLangBusy(false);
        return;
      }
      setLangBusy(false);
    }
    setLang(next);
    if (messages.length) {
      taskRef.current = null;
      reply(topicsMessage(next === "hi" ? t("From now on I'll reply in Hindi. What would you like help with?") : "From now on I'll reply in English. What would you like help with?"), 200);
    }
  };

  const restartChat = () => {
    setMessages([]);
    setConfirmEnd(false);
    taskRef.current = null;
    askedNameRef.current = false;
    draftRef.current = {};
    try {
      sessionStorage.removeItem(SAVE_KEY);
    } catch {}
  };
  // End the chat: clear it and close.
  const endChat = () => {
    restartChat();
    minimise();
  };

  const onChatScroll = () => {
    const box = scrollRef.current;
    if (box) setFarFromEnd(box.scrollHeight - box.scrollTop - box.clientHeight > 320);
  };

  const lastId = messages[messages.length - 1]?.id;
  const onNav = () => {
    if (isPhone()) minimise();
  };
  const RichNav = ({ text }: { text: string }) => <Rich text={text} onNavigate={onNav} />;
  const pageMenuTitle = pageMenu ? menuTitle(pageMenu) : null;
  const rows = forYouRows();
  const lastBotText = lastBot()?.text?.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  const linkButton = (l: ChatLink, primary: boolean, i: number) => {
    const cls = primary
      ? "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] px-4 text-[14px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(126,77,119,0.6)] transition active:scale-[0.97]"
      : "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#e3c9db] bg-white px-4 text-[14px] font-semibold text-[#7E4D77] transition md:hover:bg-[#fff6fb] active:scale-[0.97]";
    const inner = (
      <>
        {l.label} <ArrowUpRight className="h-4 w-4" aria-hidden />
      </>
    );
    return l.href.startsWith("/") ? (
      <Link key={`${l.href}-${i}`} href={l.href} onClick={onNav} className={cls}>{inner}</Link>
    ) : (
      <a key={`${l.href}-${i}`} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</a>
    );
  };

  const forYouCard = (tm: Translate) =>
    rows.length ? (
      <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white shadow-[0_2px_12px_-6px_rgba(63,39,56,0.18)]">
        <p className="border-b border-[#f6ebf2] px-4 pb-2 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]">{tm("For you")}</p>
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.key} className="flex gap-3 border-b border-[#f6ebf2] px-4 py-3 last:border-b-0">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FBEFF8] text-[#7E4D77]">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold leading-snug text-[#2b1c27]">{r.title}</p>
                {r.text && <p className="mt-0.5 text-[12.5px] leading-snug text-[#6d5767]">{r.text}</p>}
                {(r.actions.length > 0 || r.links?.length) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.actions.map((a, i) => (
                      <button
                        key={`${r.key}-a${i}`}
                        type="button"
                        onClick={() => {
                          if (!isOpen) open();
                          run(a.action, a.label);
                        }}
                        disabled={typing}
                        className="inline-flex min-h-8 items-center rounded-full bg-[#f6e9f2] px-3 text-[12.5px] font-semibold text-[#7E4D77] active:scale-[0.97] disabled:opacity-60"
                      >
                        {a.label}
                      </button>
                    ))}
                    {r.links?.map((l, i) => (
                      <Link
                        key={`${r.key}-l${i}`}
                        href={l.href}
                        onClick={onNav}
                        className="inline-flex min-h-8 items-center gap-1 rounded-full border border-[#e3c9db] px-3 text-[12.5px] font-semibold text-[#7E4D77]"
                      >
                        {l.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : null;

  const rowCls =
    "flex min-h-12 w-full items-center gap-3 border-b border-[#f6ebf2] px-4 py-2.5 text-left text-[14.5px] font-medium leading-snug text-[#3a2b36] transition last:border-b-0 active:bg-[#fbf1f7] disabled:opacity-60 md:hover:bg-[#fff6fb]";
  const boxTitleCls = "border-b border-[#f6ebf2] px-4 pb-2 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]";
  const headerBtn = "flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15";

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100000] bg-[#2a1a26]/35 backdrop-blur-[2px] md:hidden" onClick={minimise} aria-hidden />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="Potent Saathi chat"
            style={sheetStyle}
            className="chat-sheet fixed inset-x-0 bottom-0 z-[100001] flex h-[92dvh] flex-col overflow-hidden rounded-t-[28px] bg-[#FFFAFD] shadow-[0_-20px_60px_rgba(42,26,38,0.28)] md:inset-x-auto md:bottom-24 md:right-6 md:h-[min(720px,calc(100dvh-120px))] md:w-[420px] md:rounded-[28px] md:shadow-[0_30px_80px_-20px_rgba(42,26,38,0.45)]"
          >
            <header className="relative shrink-0 overflow-clip bg-gradient-to-br from-[#6E3F68] via-[#9A5C93] to-[#C98BBE] px-4 pb-3.5 pt-2.5 text-white">
              <span className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#1A8D91]/35 blur-2xl" aria-hidden />
              <span className="pointer-events-none absolute -bottom-20 left-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" aria-hidden />
              <button type="button" onClick={minimise} className="relative mx-auto mb-2 block h-1.5 w-10 rounded-full bg-white/40 md:hidden" aria-label="Minimise chat" />
              <div className="relative flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur">
                    <Image src="/brand/potent-white.png" alt="Potent" width={44} height={26} className="h-auto w-[34px]" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#9A5C93] bg-[#5FE39A]" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[17px] font-semibold leading-tight">Potent Saathi</h2>
                    <p className="truncate text-[12.5px] text-white/85">{t("Your Ovy & Looway companion")}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={switchLang}
                    disabled={langBusy}
                    lang={lang === "hi" ? "en" : "hi"}
                    className="mr-1 flex h-9 min-w-[60px] items-center justify-center rounded-full bg-white/15 px-2.5 text-[13px] font-semibold ring-1 ring-white/30 transition hover:bg-white/25 disabled:opacity-60"
                    aria-label={lang === "hi" ? "Switch the chat to English" : "चैट हिंदी में करें"}
                  >
                    {langBusy ? "…" : lang === "hi" ? "English" : "हिंदी"}
                  </button>
                  {messages.length > 0 && (
                    <button type="button" onClick={restartChat} className={headerBtn} aria-label="Start a new chat" title="New chat">
                      <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
                    </button>
                  )}
                  <button type="button" onClick={minimise} className={headerBtn} aria-label="Minimise chat" title="Minimise">
                    <ChevronDown className="h-6 w-6 md:hidden" aria-hidden />
                    <Minus className="hidden h-5 w-5 md:block" aria-hidden />
                  </button>
                  <button type="button" onClick={() => (messages.length ? setConfirmEnd(true) : minimise())} className={headerBtn} aria-label="End chat" title="End chat">
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            </header>

            {confirmEnd && (
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#f3e4ee] bg-white px-4 py-2.5 text-[13.5px] text-[#3a2b36]" role="alertdialog" aria-label="End this chat?">
                <span>{t("End this chat? It will be cleared.")}</span>
                <span className="flex shrink-0 gap-1.5">
                  <button type="button" onClick={() => setConfirmEnd(false)} className="min-h-9 rounded-full border border-[#e3c9db] px-3 font-semibold text-[#7E4D77]">
                    {t("Keep chatting")}
                  </button>
                  <button type="button" onClick={endChat} className="min-h-9 rounded-full bg-[#7E4D77] px-3 font-semibold text-white">
                    {t("End chat")}
                  </button>
                </span>
              </div>
            )}

            <div ref={scrollRef} onScroll={onChatScroll} className="relative flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-5" aria-live="polite">
              <div className="chat-in">
                <p className="text-[24px] font-semibold leading-tight tracking-[-0.01em] text-[#2b1c27]">
                  {t(timeGreeting())}
                  {name ? `, ${name}` : ""} <span aria-hidden>👋</span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6d5767]">
                  {t("I'm Saathi, your Potent companion for periods, intimate health, travel hygiene and orders. Tap a topic, or type or speak your question.")}
                </p>

                {messages.length === 0 && (
                  <>
                    {pageMenu && pageMenuTitle && (
                      <button
                        type="button"
                        onClick={() => run({ type: "menu", id: pageMenu }, t("Questions about {title}?", { title: pageMenuTitle }))}
                        className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] px-4 py-3.5 text-left text-white shadow-[0_10px_24px_-12px_rgba(126,77,119,0.7)] transition active:scale-[0.98]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/80">{t("On this page")}</span>
                          <span className="block text-[15px] font-semibold">{t("Questions about {title}?", { title: pageMenuTitle })}</span>
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
                      </button>
                    )}

                    {forYouCard(t)}

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {TILES.map((tile) => {
                        const Icon = tile.icon;
                        return (
                          <button
                            key={tile.label}
                            type="button"
                            onClick={() => run(tile.action, t(tile.label))}
                            className="flex min-h-[84px] flex-col items-start justify-between rounded-2xl border border-[#f0e0ea] bg-white p-3.5 text-left shadow-[0_2px_10px_-4px_rgba(63,39,56,0.10)] transition active:scale-[0.97] md:hover:-translate-y-0.5 md:hover:shadow-[0_10px_24px_-12px_rgba(126,77,119,0.4)]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: tile.bg, color: tile.ink }}>
                              <Icon className="h-[18px] w-[18px]" aria-hidden />
                            </span>
                            <span className="mt-2.5 text-[14px] font-semibold leading-tight text-[#2b1c27]">{t(tile.label)}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {MORE_TOPICS.map((tile) => {
                        const Icon = tile.icon;
                        return (
                          <button
                            key={tile.label}
                            type="button"
                            onClick={() => run(tile.action, t(tile.label))}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#ecd9e6] bg-white px-3.5 text-[13.5px] font-medium text-[#5e4458] transition active:scale-[0.97] md:hover:border-[#AF71A7]"
                          >
                            <Icon className="h-4 w-4 text-[#9A5C93]" aria-hidden />
                            {t(tile.label)}
                          </button>
                        );
                      })}
                    </div>

                    <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-4 flex min-h-14 items-center gap-3 rounded-2xl bg-[#EAF8EF] px-4 text-[#145c34] transition active:scale-[0.98]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                        <MessageCircleHeart className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold">{t("Talk to a person on WhatsApp")}</span>
                        <span className="block text-[12.5px] text-[#2f7a50]">{t("Monday to Saturday, 10 am to 7 pm")}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                    </a>
                  </>
                )}
              </div>

              <div className="mt-5 space-y-4">
                {messages.map((message) => {
                  const isLast = message.id === lastId;
                  if (message.role === "user") {
                    return (
                      <div key={message.id} ref={isLast ? lastRef : undefined} data-role="user" className="chat-in flex justify-end">
                        <div className="max-w-[85%] rounded-[22px] rounded-br-md bg-gradient-to-br from-[#7E4D77] to-[#AF71A7] px-4 py-2.5 text-[15px] leading-[1.55] text-white shadow-[0_6px_16px_-8px_rgba(126,77,119,0.7)]">
                          {message.text}
                        </div>
                      </div>
                    );
                  }
                  const info = message.price ? live().products[message.price] : undefined;
                  const offers = live().offers;
                  const tm = tOf(message.hi);
                  return (
                    <div key={message.id} ref={isLast ? lastRef : undefined} data-role="bot" className="chat-in flex w-full items-start gap-2">
                      <span className="mt-0.5"><Avatar /></span>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`whitespace-pre-line rounded-[22px] rounded-tl-md px-4 py-3 text-[15px] leading-[1.6] ${
                            message.tone === "safety" ? "border border-[#f3c1c9] bg-[#fff1f3] text-[#4a2430]" : "bg-white text-[#3a2b36] shadow-[0_2px_12px_-4px_rgba(63,39,56,0.14)]"
                          }`}
                        >
                          <RichNav text={message.text} />
                        </div>

                        {message.result && <div className="mt-3"><ResultCard outcome={message.result} Rich={RichNav} t={tm} /></div>}
                        {message.checklist?.length ? <Checklist items={message.checklist} Rich={RichNav} t={tm} /> : null}
                        {info && <PriceDetails info={info} onAdd={(v) => addFromChat(message.price!, v)} t={tm} />}
                        {message.coupons && (
                          <CouponList
                            coupons={offers?.coupons || []}
                            highlight={message.coupons.highlight}
                            hindi={message.hi}
                            t={tm}
                            onApply={(code) => run({ type: "apply", code }, tm("Apply {code}", { code }))}
                          />
                        )}
                        {message.orders?.length ? (
                          <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
                            <p className={boxTitleCls}>{tm("Your latest orders")}</p>
                            {message.orders.map((o) => (
                              <Link key={o.id} href={`/dashboard/orders/${o.id}`} onClick={onNav} className="flex items-center gap-3 border-b border-[#f6ebf2] px-4 py-3 last:border-b-0 md:hover:bg-[#fff6fb]">
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[14px] font-semibold text-[#2b1c27]">
                                    {tm(o.items === 1 ? "{date} · 1 item" : "{date} · {n} items", { date: o.date, n: o.items })}
                                    {o.total ? ` · ₹${o.total.toLocaleString("en-IN")}` : ""}
                                  </span>
                                  <span className="block text-[12.5px] text-[#6d5767]">{tm("Order #{id}", { id: o.id.slice(0, 8).toUpperCase() })}</span>
                                </span>
                                <span className="shrink-0 rounded-full bg-[#E6F4F6] px-2.5 py-1 text-[12px] font-semibold capitalize text-[#075965]">{tm(o.status)}</span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                        {message.forYou && isLast && forYouCard(tm)}
                        {message.offers && offers && <OffersCard offers={offers} subscriptionSave={bestSaving()} t={tm} />}

                        {message.products?.length ? (
                          <>
                            {message.productsTitle && <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]">{message.productsTitle}</p>}
                            <ProductCards picks={message.products} live={live().products} onNavigate={onNav} t={tm} />
                          </>
                        ) : null}

                        {message.combo && (
                          <div className="mt-2.5 rounded-2xl border border-dashed border-[#dcc0d4] bg-[#FFF7FB] px-4 py-3 text-[13.5px] leading-snug text-[#5e4458]">
                            <span className="font-semibold text-[#7E4D77]">{tm("Popular combo: {title}. ", { title: tm(message.combo.title) })}</span>
                            {tm(message.combo.why)}
                          </div>
                        )}

                        {message.links?.length ? <div className="mt-2.5 flex flex-wrap gap-2">{message.links.map((l, i) => linkButton(l, i === 0, i))}</div> : null}

                        {isLast && message.multi?.length ? (
                          <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
                            <p className={boxTitleCls}>{tm("Pick all that apply")}</p>
                            {message.multi.map((o) => {
                              const on = multiSel.includes(o.id);
                              return (
                                <button key={o.id} type="button" onClick={() => toggleMulti(o.id)} aria-pressed={on} className={rowCls}>
                                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-[#7E4D77] bg-[#7E4D77] text-white" : "border-[#d9c2d2] bg-white"}`}>
                                    {on && <Check className="h-3.5 w-3.5" aria-hidden />}
                                  </span>
                                  <span className="min-w-0 flex-1">{o.label}</span>
                                </button>
                              );
                            })}
                            <div className="p-3">
                              <button
                                type="button"
                                onClick={submitMulti}
                                disabled={!multiSel.length || typing}
                                className="min-h-11 w-full rounded-full bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] text-[14.5px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
                              >
                                {tm("Done")}
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {isLast && message.list?.length ? (
                          <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
                            {message.listTitle && <p className={boxTitleCls}>{message.listTitle}</p>}
                            {message.list.map((c, i) => (
                              <button key={`${c.label}-${i}`} type="button" onClick={() => run(c.action, c.label)} disabled={typing} className={rowCls}>
                                <span className="min-w-0 flex-1">{c.label}</span>
                                <ChevronRight className="h-4 w-4 shrink-0 text-[#C98BBE]" aria-hidden />
                              </button>
                            ))}
                          </div>
                        ) : null}

                        {message.feedback && (
                          <div className="mt-2 flex items-center gap-1 text-[12px] text-[#a3899b]">
                            {message.feedback.given ? (
                              <span>{message.feedback.given === "up" ? tm("Thanks for the feedback!") : tm("Thanks, noted.")}</span>
                            ) : (
                              <>
                                <span className="mr-1">{tm("Was this helpful?")}</span>
                                <button type="button" onClick={() => giveFeedback(message, true)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f6e9f2]" aria-label="Helpful">
                                  <ThumbsUp className="h-4 w-4" aria-hidden />
                                </button>
                                <button type="button" onClick={() => giveFeedback(message, false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f6e9f2]" aria-label="Not helpful">
                                  <ThumbsDown className="h-4 w-4" aria-hidden />
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {isLast && message.chips?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.chips.map((c, i) => {
                              const Icon = c.action.type === "topics" ? LayoutGrid : c.action.type === "type" ? CornerDownLeft : c.action.type === "back" ? ArrowLeft : null;
                              return (
                                <button
                                  key={`${c.label}-${i}`}
                                  type="button"
                                  onClick={() => run(c.action, c.label)}
                                  disabled={typing}
                                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#f6e9f2] px-3.5 text-[13px] font-semibold text-[#7E4D77] transition active:scale-[0.97] disabled:opacity-60 md:hover:bg-[#efd8e8]"
                                >
                                  {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
                                  {c.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {typing && (
                  <div className="chat-in flex items-start gap-2" aria-label="Saathi is typing">
                    <span className="mt-0.5"><Avatar /></span>
                    <div className="flex gap-1.5 rounded-[22px] rounded-tl-md bg-white px-4 py-3.5 shadow-[0_2px_12px_-4px_rgba(63,39,56,0.14)]">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-[#C98BBE]" style={{ animationDelay: `${i * 140}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {farFromEnd && (
              <button
                type="button"
                onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })}
                className="absolute bottom-[150px] left-1/2 z-10 flex h-9 -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3.5 text-[12.5px] font-semibold text-[#7E4D77] shadow-[0_6px_18px_-6px_rgba(63,39,56,0.35)]"
              >
                <ArrowDown className="h-4 w-4" aria-hidden /> {t("Latest")}
              </button>
            )}

            {/* Menu bar: the main places in the chat, one tap away. */}
            <nav className="no-scrollbar flex shrink-0 gap-1 overflow-x-auto border-t border-[#f3e4ee] bg-white px-2 pt-1.5" aria-label="Chat menu">
              {DOCK.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => run(d.action, t(d.label))}
                    disabled={typing}
                    className="flex min-h-11 min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-semibold text-[#6d5767] transition active:bg-[#fbf1f7] disabled:opacity-60 md:hover:text-[#7E4D77]"
                  >
                    <Icon className="h-[18px] w-[18px] text-[#9A5C93]" aria-hidden />
                    {t(d.label)}
                  </button>
                );
              })}
            </nav>

            <form onSubmit={handleSubmit} className="shrink-0 bg-white/95 px-3 pt-2 backdrop-blur" style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}>
              {suggestions.length > 0 && (
                <div className="no-scrollbar -mx-3 mb-2 flex gap-2 overflow-x-auto px-3">
                  {suggestions.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setInput("");
                        run({ type: "answer", id: a.id }, aq(a));
                      }}
                      className="shrink-0 rounded-full border border-[#ecd9e6] bg-[#FFFAFD] px-3 py-1.5 text-[12.5px] font-medium text-[#5e4458] active:scale-[0.97]"
                    >
                      {aq(a)}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 rounded-full border border-[#ecd9e6] bg-[#FFFAFD] p-1.5 pl-4 transition focus-within:border-[#AF71A7] focus-within:ring-4 focus-within:ring-[#AF71A7]/12">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={listening ? t("Listening…") : name ? t("Ask me anything, {name}…", { name }) : t("Type your question…")}
                  maxLength={300}
                  enterKeyHint="send"
                  autoComplete="off"
                  aria-label="Type your question"
                  className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-[#2b1c27] outline-none placeholder:text-[#b29aab]"
                />
                {canSpeak && !input.trim() ? (
                  <button
                    type="button"
                    onClick={startVoice}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${listening ? "animate-pulse bg-[#B0405F] text-white" : "bg-[#f6e9f2] text-[#7E4D77]"}`}
                    aria-label={listening ? "Listening" : "Speak your question"}
                  >
                    <Mic className="h-[18px] w-[18px]" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] to-[#AF71A7] text-white shadow-[0_6px_14px_-6px_rgba(126,77,119,0.7)] transition active:scale-95 disabled:opacity-40"
                    aria-label="Send"
                  >
                    <Send className="h-[18px] w-[18px]" aria-hidden />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[11px] text-[#ab95a5]">{t("Answers from Potent's own guides · not medical advice")}</p>
            </form>
          </section>
        </>
      )}

      <div className={`chatbot-floating-widget fixed right-4 z-50 transition-all duration-300 sm:right-6 md:bottom-6 ${hasStickyBar ? "bottom-[138px]" : "bottom-20"} ${isOpen ? "max-md:hidden" : ""}`}>
        {/* Minimised with a chat going, or a first hello on a product page. */}
        {!isOpen && (messages.length > 0 || nudge) && (
          <div className="chat-in absolute bottom-0 right-[66px] w-[min(260px,calc(100vw-100px))]">
            <div className="relative rounded-2xl rounded-br-md bg-white p-3 pr-8 text-[13px] leading-snug text-[#3a2b36] shadow-[0_12px_30px_-10px_rgba(63,39,56,0.45)]">
              <button type="button" onClick={open} className="block w-full text-left">
                <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#9A5C93]">
                  {messages.length ? t("Continue your chat") : "Potent Saathi"}
                </span>
                <span className="mt-0.5 line-clamp-2">{messages.length ? lastBotText || t("Tap to carry on where you left off.") : nudge}</span>
              </button>
              <button
                type="button"
                onClick={() => (messages.length ? endChat() : setNudge(null))}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-[#a3899b] hover:bg-[#f6e9f2]"
                aria-label={messages.length ? "End chat" : "Dismiss"}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        )}
        <button
          ref={launcherRef}
          type="button"
          onPointerDown={() => loadEngine()}
          onClick={() => (isOpen ? minimise() : open())}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] via-[#9A5C93] to-[#C98BBE] text-white shadow-[0_14px_34px_-8px_rgba(126,77,119,0.65)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7] focus-visible:ring-offset-2 active:scale-95"
          aria-label={isOpen ? "Minimise Potent Saathi" : "Open Potent Saathi"}
        >
          {isOpen ? <ChevronDown className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-[26px] w-[26px]" aria-hidden />}
          {!isOpen && unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B0405F] px-1 text-[11px] font-bold">{unread}</span>
          )}
        </button>
      </div>
    </>
  );
}
