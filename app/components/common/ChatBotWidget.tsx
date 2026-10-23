"use client";

import { type CSSProperties, FormEvent, Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  CornerDownLeft,
  HeartPulse,
  Layers,
  LayoutGrid,
  type LucideIcon,
  MessageCircle,
  MessageCircleHeart,
  Mic,
  Package,
  Plane,
  RefreshCw,
  RotateCcw,
  Send,
  ShoppingBag,
  Sprout,
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
import type { ProductKey, SymptomOutcome } from "@/const/chatbot/symptomTypes";
import { FLOWS, isFlowResult } from "@/const/chatbot/flows";
import { MENUS, PRODUCT_WORDS, TOPIC_MENU } from "@/const/chatbot/menus";
import { FINDERS } from "@/const/chatbot/finders";
import { PRODUCT_META, comboFor, productsFor, type Combo } from "@/const/chatbot/products";
import { getChatFirstName, getChatOrders, logChatQuestion } from "@/helper/chat/action";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { useCartStore } from "@/store/cartStore";
import { getImageUrl } from "@/lib/imageUrl";
import {
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
  /** Show today's coupons; highlight one. */
  coupons?: { highlight?: string };
  orders?: { id: string; status: string; date: string; total: number | null; items: number }[];
  feedback?: { q: string; answerId: string; given?: "up" | "down" };
  tone?: "safety";
  /** Written in Hindi, so its cards are shown in Hindi too. */
  hi?: boolean;
};

type Profile = { name?: string; age?: string; who?: string; sex?: string };

// What the chat is in the middle of: collecting details, a check-in, or a finder.
type Task =
  | { kind: "profile"; step: "name" | "who" | "age" | "sex"; flowId: string }
  | { kind: "symptom"; flowId: string; qi: number; answers: Record<string, string[]> }
  | { kind: "finder"; id: string; si: number; answers: Record<string, string[]> };

type Reply = Omit<ChatMessage, "id" | "role">;

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
  { label: "Ovy products", icon: Layers, bg: "#FBF1FB", ink: "#7E4D77", action: { type: "menu", id: "ovy" } },
  { label: "Looway products", icon: Package, bg: "#EEF5EF", ink: "#0E5C3A", action: { type: "menu", id: "looway" } },
  { label: "Orders & delivery", icon: Truck, bg: "#E6F4F6", ink: "#075965", action: { type: "menu", id: "orders" } },
  { label: "Offers & deals", icon: Tag, bg: "#FDF5EA", ink: "#8A4B12", action: { type: "offers" } },
];

const MORE_TOPICS: { label: string; icon: LucideIcon; action: Action }[] = [
  { label: "Find my pad size", icon: Layers, action: { type: "flow", node: "pad:start" } },
  { label: "Find my cup size", icon: CircleDashed, action: { type: "flow", node: "cup:start" } },
  { label: "Plan my trip hygiene", icon: Plane, action: { type: "finder", id: "looway" } },
  { label: "Subscriptions", icon: RefreshCw, action: { type: "menu", id: "subscriptions" } },
  { label: "First periods & teens", icon: Sprout, action: { type: "menu", id: "teens" } },
  { label: "Women's health", icon: HeartPulse, action: { type: "menu", id: "health" } },
  { label: "Account & rewards", icon: UserRound, action: { type: "menu", id: "account" } },
  { label: "Bulk orders", icon: Building2, action: { type: "menu", id: "business" } },
];

const ALL_TOPICS: Choice[] = [...TILES, ...MORE_TOPICS].map((t) => ({ label: t.label, action: t.action }));
const BACK: Choice = { label: "Back to topics", action: { type: "topics" } };
const OWN: Choice = { label: "Ask my own question", action: { type: "type" } };
const HUMAN: Choice = { label: "Talk to a person", action: { type: "human" } };

const AGES = [
  { id: "u13", label: "Under 13" },
  { id: "13-17", label: "13 to 17" },
  { id: "18-29", label: "18 to 29" },
  { id: "30-39", label: "30 to 39" },
  { id: "40-49", label: "40 to 49" },
  { id: "50+", label: "50 or older" },
];
const WHOS = [
  { id: "me", label: "Me" },
  { id: "daughter", label: "My daughter" },
  { id: "someone", label: "Someone else" },
];
const SEXES = [
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

// The same, for Hindi typing (after normalise: no nukta, chandrabindu as anusvara).
const OFFER_HI = /(ऑफर|आफर|कूपन|डिस्काउंट|छूट|डील|सेल|कैशबैक|फ्री डिलीवरी|मुफ्त डिलीवरी|डिलीवरी चार्ज|रिवॉर्ड|क्रेडिट)/;
const CHOOSE_HI = /(कौन सा लूं|कौनसा लूं|कौन सा लें|क्या लूं|क्या खरीदूं|सुझाव दो|सलाह दो|कौन सा प्रोडक्ट|सही प्रोडक्ट|चुनने में मदद)/;
const TRAVEL_HI = /(सफर|यात्रा|ट्रेन|टॉयलेट|ट्रिप|ट्रेक|बस|फ्लाइट)/;
const TRIP_PLAN_HI = /(क्या पैक|पैकिंग|सफर की तैयारी|यात्रा की तैयारी|ट्रिप की तैयारी)/;
const SYMPTOM_HI = /(खून|ब्लीडिंग|दर्द|खुजली|जलन|बदबू|गांठ|थक्के|बुखार|रैश|लेट|स्पॉटिंग|सूजन|मिस)/;
const PRODUCT_WORDS_HI: Record<string, string> = {
  "पैड": "pads", "पैड्स": "pads", "सैनिटरी पैड": "pads", "लाइनर": "liners", "पैंटी लाइनर": "liners",
  "पीरियड पैंटी": "panty", "पैंटी": "panty", "कप": "cup", "मेंस्ट्रुअल कप": "cup", "पीरियड कप": "cup",
  "टीन किट": "teenkit", "फनल": "funnel", "पी फनल": "funnel", "सीट कवर": "seatcovers", "यात्रा किट": "yatra",
};
const WORDS: Record<string, string> = { ...PRODUCT_WORDS, ...PRODUCT_WORDS_HI };
const DEVANAGARI = /[\u0900-\u097f]/;

const NAME_KEY = "potent-chat-name";
const LANG_KEY = "potent-chat-lang";
const hiddenPathPrefixes = ["/admin", "/dashboard", "/login", "/signup", "/reset-password", "/email-verification"];

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/** Name pieces for messages: {n} ", Priya", {N} "Priya, ", {sp} " Priya". */
const nv = (name?: string) => ({ n: name ? `, ${name}` : "", N: name ? `${name}, ` : "", sp: name ? ` ${name}` : "" });

let counter = 0;
const newId = () => `m${Date.now()}-${counter++}`;

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
  onerror: () => void;
  start: () => void;
};

const speechCtor = (): SpeechCtor | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
};

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
  const engineRef = useRef<Engine | null>(null);
  const enginePromise = useRef<Promise<Engine> | null>(null);
  const liveRef = useRef<{ products: Record<string, LiveProduct>; offers: LiveOffers | null }>({ products: {}, offers: null });
  const taskRef = useRef<Task | null>(null);
  // Details for this chat only: kept in memory on this device, never sent or saved.
  const draftRef = useRef<Profile>({});
  const askedNameRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Load the answers, check-ins, live product facts and offers.
  const loadEngine = () => {
    if (!enginePromise.current) {
      enginePromise.current = import("@/lib/chat/engine").then(async (m) => {
        engineRef.current = m;
        try {
          const res = await fetch("/api/chat-knowledge");
          if (res.ok) {
            const data = await res.json();
            m.addLiveAnswers(data.answers || []);
            liveRef.current = {
              products: Object.fromEntries((data.products || []).map((p: LiveProduct) => [p.slug, p])),
              offers: data.offers || null,
            };
          }
        } catch {
          // The hand-written answers still work without the live extras.
        }
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
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  useEffect(() => {
    if (!isOpen || restoredLang.current) return;
    restoredLang.current = true;
    try {
      if (localStorage.getItem(LANG_KEY) !== "hi") return;
    } catch {
      return;
    }
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
  }, []);

  // Greet signed-in customers by their first name.
  useEffect(() => {
    if (!isOpen || name) return;
    try {
      const saved = sessionStorage.getItem(NAME_KEY);
      if (saved) return setProfile((p) => ({ ...p, name: saved }));
    } catch {}
    getChatFirstName()
      .then((n) => n && setProfile((p) => (p.name ? p : { ...p, name: n })))
      .catch(() => {});
  }, [isOpen, name]);

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

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
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

  if (isHidden) return null;

  const canSpeak = !!speechCtor();
  const isPhone = () => window.innerWidth < 768;
  const close = () => setIsOpen(false);
  const open = () => {
    loadEngine();
    setIsOpen(true);
  };

  // Hindi when chosen and loaded; English is always the fallback.
  const isHi = () => langRef.current === "hi" && !!hiRef.current;
  const H = () => (isHi() ? hiRef.current : null);
  const tOf = (hi?: boolean): Translate => (str, v) => fill((hi && hiRef.current?.STRINGS_HI[str]) || str, v);
  const t: Translate = (str, v) => tOf(isHi())(str, v);
  const aq = (a: ChatAnswer) => H()?.ANSWERS_HI[a.id]?.question || a.question;
  const aa = (a: ChatAnswer) => H()?.ANSWERS_HI[a.id]?.answer || a.answer;
  const menuTitle = (id: string) => H()?.MENUS_HI[id]?.title || MENUS[id]?.title;
  const humanLinks = (q?: string) => HUMAN_LINKS(q).map((l) => ({ ...l, label: t(l.label) }));

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
        resolve();
      }, delay);
    });
  };

  const say = (text: string) => setMessages((m) => [...m, { id: newId(), role: "user", text }]);

  const goTo = (href: string) => {
    setTimeout(() => {
      if (href.startsWith("/")) {
        router.push(href);
        if (isPhone()) close();
      } else {
        window.open(href, "_blank", "noopener");
      }
    }, 550);
  };

  const rememberName = (n: string) => {
    draftRef.current.name = n;
    setProfile((p) => ({ ...p, name: n }));
    try {
      sessionStorage.setItem(NAME_KEY, n);
    } catch {}
  };

  const lastBot = () => [...messages].reverse().find((m) => m.role === "bot");
  const live = () => liveRef.current;
  const bestSaving = () =>
    Math.max(0, ...Object.values(live().products).map((p) => Math.max(p.subscription?.monthly || 0, p.subscription?.everyTwoMonths || 0, p.cycleSync || 0)));
  const keyForSlug = (slug: string) => (Object.keys(PRODUCT_META) as ProductKey[]).find((k) => PRODUCT_META[k].href === `/product-detail/${slug}`);
  const flowById = (id: string) => engineRef.current!.SYMPTOM_FLOWS.find((f) => f.id === id)!;

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

  const offersMessage = (): Reply => {
    const different = new Set(bagItems.map((i) => i.productId)).size;
    const coupons = live().offers?.coupons || [];
    const combo = [...coupons].filter((c) => c.minDifferentProducts).sort((a, b) => b.minDifferentProducts - a.minDifferentProducts);
    const unlocked = combo.find((c) => different >= c.minDifferentProducts);
    const next = [...combo].reverse().find((c) => different < c.minDifferentProducts);
    const nudge = !bagItems.length
      ? ""
      : unlocked
        ? t("\n\nYour bag has {d} different products, so **{code}** works for you right now.", { d: different, code: unlocked.code })
        : next
          ? t(
              next.minDifferentProducts - different > 1
                ? "\n\nAdd {k} more different products to your bag to unlock **{code}**."
                : "\n\nAdd {k} more different product to your bag to unlock **{code}**.",
              { k: next.minDifferentProducts - different, code: next.code },
            )
          : "";
    return {
      text: t("Here's how to save at Potent{n}.", nv(name)) + nudge,
      coupons: { highlight: unlocked?.code },
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
    const different = new Set([...useCartStore.getState().items.map((i) => i.productId)]).size;
    const coupons = live().offers?.coupons || [];
    const combo = coupons.filter((c) => c.minDifferentProducts && different >= c.minDifferentProducts).sort((a, b) => b.minDifferentProducts - a.minDifferentProducts)[0];
    const o = live().offers;
    return reply({
      text:
        ok === false
          ? t("I couldn't add that just now. Please try from the product page.")
          : t("Added **{title}** to your bag.", { title }) +
            (combo ? t(" You now have {d} different products, so use **{code}** at checkout.", { d: different, code: combo.code }) : "") +
            (o ? t(" Delivery is free from ₹{f}.", { f: o.freeDeliveryFrom }) : ""),
      links: [{ label: "Go to my bag", href: "/cart" }],
      chips: [{ label: "See all offers", action: { type: "offers" } }, { label: "Help me choose", action: { type: "finder", id: "ovy" } }, BACK],
    });
  };

  // Signed-in customers see their latest orders when they ask about one.
  const ORDER_ANSWERS = ["ord-track-order", "ord-delivery-delayed", "ord-marked-delivered", "ord-cancel-order", "ord-unpaid-order"];
  const withOrders = async (msg: Reply, answerId: string): Promise<Reply> => {
    if (!ORDER_ANSWERS.includes(answerId)) return msg;
    const orders = await getChatOrders().catch(() => null);
    if (!orders) return { ...msg, text: msg.text + t("\n\nSign in and I'll show your latest orders here."), links: [{ label: "Sign in", href: "/login" }, ...(msg.links || [])] };
    if (!orders.length) return { ...msg, text: msg.text + t("\n\nI don't see any orders on your account yet.") };
    return { ...msg, orders };
  };

  // ---------- Symptom check-ins ----------

  const symptomMenu = (): Reply => ({
    text: t("What's bothering you{n}? I'll ask a few quick questions, then explain what it's commonly linked to, what helps and when to see a doctor.", nv(name)),
    list: engineRef.current!.SYMPTOM_FLOWS.map((f) => ({ label: H()?.SYMPTOMS_HI[f.id]?.short || f.short, action: { type: "symptom", id: f.id } as Action })),
    chips: [OWN, BACK],
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
      return { text: t("Who is this for?"), list: WHOS.map((o) => ({ label: o.label, action: { type: "opt", value: o.id } as Action })) };
    }
    if (!p.age) {
      taskRef.current = { kind: "profile", step: "age", flowId };
      const text = p.who === "daughter" ? t("How old is she?") : p.who === "someone" ? t("How old are they?") : t("How old are you{n}?", nv(p.name));
      return { text, list: AGES.map((o) => ({ label: o.label, action: { type: "opt", value: o.id } as Action })) };
    }
    if (flow.needs.sex && !p.sex) {
      taskRef.current = { kind: "profile", step: "sex", flowId };
      return {
        text: p.who && p.who !== "me" ? t("Are they female or male?") : t("Are you female or male?"),
        list: SEXES.map((o) => ({ label: o.label, action: { type: "opt", value: o.id } as Action })),
      };
    }
    return null;
  };

  const askSymptomQuestion = (flowId: string, qi: number, answers: Record<string, string[]>) => {
    const flow = flowById(flowId);
    const q = flow.questions[qi];
    const fh = H()?.SYMPTOMS_HI[flowId];
    const qh = fh?.questions[q.id];
    const label = (o: { id: string; label: string }) => qh?.options[o.id] || o.label;
    taskRef.current = { kind: "symptom", flowId, qi, answers };
    setMultiSel([]);
    const intro = qi === 0 ? t("Thanks{n}. Let's look at {title}.\n\n", { ...nv(draftRef.current.name), title: fh?.title || flow.title.toLowerCase() }) : "";
    const stop: Choice = { label: "Stop the check-in", action: { type: "topics" } };
    const text = `${intro}${qh?.text || q.text}`;
    return reply(
      q.multi
        ? { text, multi: q.options.map((o) => ({ id: o.id, label: label(o) })), chips: [stop] }
        : { text, list: q.options.map((o) => ({ label: label(o), action: { type: "opt", value: o.id } as Action })), chips: [stop] },
    );
  };

  const continueProfileOrStart = (flowId: string) => {
    const next = nextProfileQuestion(flowId);
    return next ? reply(next) : askSymptomQuestion(flowId, 0, {});
  };

  const startSymptom = (flowId: string) => {
    draftRef.current = { ...profile, ...draftRef.current, name: draftRef.current.name || profile.name };
    return continueProfileOrStart(flowId);
  };

  const finishSymptom = (flowId: string, answers: Record<string, string[]>) => {
    const engine = engineRef.current!;
    const picked = engine.pickOutcome(flowById(flowId), answers, draftRef.current);
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

  // ---------- Finders ----------

  const askFinderStep = (id: string, si: number, answers: Record<string, string[]>) => {
    const finder = FINDERS[id];
    let i = si;
    while (i < finder.steps.length && finder.skip?.(finder.steps[i].id, answers)) i++;
    if (i >= finder.steps.length) return finishFinder(id, answers);
    const step = finder.steps[i];
    const sh = H()?.FINDERS_HI[id]?.steps[step.id];
    const label = (o: { id: string; label: string }) => sh?.options[o.id] || o.label;
    taskRef.current = { kind: "finder", id, si: i, answers };
    setMultiSel([]);
    const intro = si === 0 ? t("Let's find your best match{n}. ", nv(name)) : "";
    const text = `${intro}${sh?.text || step.text}`;
    return reply(
      step.multi
        ? { text, multi: step.options.map((o) => ({ id: o.id, label: label(o) })), chips: [BACK] }
        : { text, list: step.options.map((o) => ({ label: label(o), action: { type: "opt", value: o.id } as Action })), chips: [BACK] },
    );
  };

  const finishFinder = (id: string, answers: Record<string, string[]>) => {
    const res = FINDERS[id].result(answers);
    taskRef.current = null;
    const o = live().offers;
    const keys = res.picks.map((p) => p.product);
    // Finder results in Hindi: whole sentences, with the size filled in after.
    const ft = (str: string) => H()?.FINDER_TEXT_HI[str] || str;
    const why = (p: ProductPick) => {
      if (!p.why || !H()) return p.why;
      if (H()!.FINDER_TEXT_HI[p.why]) return ft(p.why);
      return p.size ? ft(p.why.replace(p.size, "{size}")).replace("{size}", ft(p.size)) : p.why;
    };
    const picks = res.picks.map((p) => ({ ...p, why: why(p), size: p.size && ft(p.size) }));
    return reply(
      {
        text:
          `**${ft(res.title)}**\n${ft(res.intro)}${res.tip ? `\n\n${ft(res.tip)}` : ""}` +
          (o ? t("\n\nDelivery is free from ₹{f}; below that it's ₹{fee}.", { f: o.freeDeliveryFrom, fee: o.deliveryFee }) : ""),
        products: picks,
        combo: keys.length === 1 ? comboFor(keys) : undefined,
        chips: [{ label: "Start again", action: { type: "finder", id } }, { label: "See all offers", action: { type: "offers" } }, BACK],
      },
      450,
    );
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
      const first = question.trim().split(/\s+/)[0].replace(/[^A-Za-z\u0900-\u097f]/g, "").slice(0, 20);
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

    if (OFFER_WORDS.test(bare) || OFFER_HI.test(bare)) return reply(offersMessage());

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

    if (action.type === "opt" || action.type === "skip") {
      if (task?.kind === "profile") {
        if (action.type === "opt") {
          if (task.step === "who") draftRef.current.who = action.value;
          if (task.step === "age") draftRef.current.age = action.value;
          if (task.step === "sex") draftRef.current.sex = action.value;
        }
        return continueProfileOrStart(task.flowId);
      }
      if (task?.kind === "symptom" && action.type === "opt") {
        const flow = flowById(task.flowId);
        const answers = { ...task.answers, [flow.questions[task.qi].id]: [action.value] };
        return task.qi + 1 < flow.questions.length ? askSymptomQuestion(task.flowId, task.qi + 1, answers) : finishSymptom(task.flowId, answers);
      }
      if (task?.kind === "finder" && action.type === "opt") {
        const step = FINDERS[task.id].steps[task.si];
        return askFinderStep(task.id, task.si + 1, { ...task.answers, [step.id]: [action.value] });
      }
      return reply(topicsMessage(t("What would you like help with?")));
    }

    taskRef.current = null;
    if (action.type === "ask") return respondTo(action.q);
    if (action.type === "topics") return reply(topicsMessage(t("What would you like help with?")));
    if (action.type === "offers") return reply(offersMessage());
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
      return task.qi + 1 < flow.questions.length ? askSymptomQuestion(task.flowId, task.qi + 1, answers) : finishSymptom(task.flowId, answers);
    }
    const step = FINDERS[task.id].steps[task.si];
    return askFinderStep(task.id, task.si + 1, { ...task.answers, [step.id]: multiSel });
  }

  const toggleMulti = (id: string) =>
    setMultiSel((cur) => {
      const noneIds = ["none", "no", "none-of-these", "nothing"];
      if (noneIds.includes(id)) return cur.includes(id) ? [] : [id];
      const base = cur.filter((x) => !noneIds.includes(x));
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    });

  const giveFeedback = (msg: ChatMessage, up: boolean) => {
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
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
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
    taskRef.current = null;
    askedNameRef.current = false;
    draftRef.current = {};
  };
  const lastId = messages[messages.length - 1]?.id;
  const onNav = () => {
    if (isPhone()) close();
  };
  const RichNav = ({ text }: { text: string }) => <Rich text={text} onNavigate={onNav} />;
  const pageMenuTitle = pageMenu ? menuTitle(pageMenu) : null;

  const linkButton = (l: ChatLink, primary: boolean) => {
    const cls = primary
      ? "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] px-4 text-[14px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(126,77,119,0.6)] transition active:scale-[0.97]"
      : "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#e3c9db] bg-white px-4 text-[14px] font-semibold text-[#7E4D77] transition md:hover:bg-[#fff6fb] active:scale-[0.97]";
    const inner = (
      <>
        {l.label} <ArrowUpRight className="h-4 w-4" aria-hidden />
      </>
    );
    return l.href.startsWith("/") ? (
      <Link key={l.href + l.label} href={l.href} onClick={onNav} className={cls}>{inner}</Link>
    ) : (
      <a key={l.href + l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</a>
    );
  };

  const rowCls =
    "flex min-h-12 w-full items-center gap-3 border-b border-[#f6ebf2] px-4 py-2.5 text-left text-[14.5px] font-medium leading-snug text-[#3a2b36] transition last:border-b-0 active:bg-[#fbf1f7] disabled:opacity-60 md:hover:bg-[#fff6fb]";
  const boxTitleCls = "border-b border-[#f6ebf2] px-4 pb-2 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]";

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100000] bg-[#2a1a26]/35 backdrop-blur-[2px] md:hidden" onClick={close} aria-hidden />

          <section
            role="dialog"
            aria-label="Potent Saathi chat"
            style={sheetStyle}
            className="chat-sheet fixed inset-x-0 bottom-0 z-[100001] flex h-[92dvh] flex-col overflow-hidden rounded-t-[28px] bg-[#FFFAFD] shadow-[0_-20px_60px_rgba(42,26,38,0.28)] md:inset-x-auto md:bottom-24 md:right-6 md:h-[min(700px,calc(100dvh-120px))] md:w-[410px] md:rounded-[28px] md:shadow-[0_30px_80px_-20px_rgba(42,26,38,0.45)]"
          >
            <header className="relative shrink-0 overflow-clip bg-gradient-to-br from-[#6E3F68] via-[#9A5C93] to-[#C98BBE] px-5 pb-4 pt-2.5 text-white">
              <span className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#1A8D91]/35 blur-2xl" aria-hidden />
              <span className="pointer-events-none absolute -bottom-20 left-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" aria-hidden />
              <div className="relative mx-auto mb-2 h-1.5 w-10 rounded-full bg-white/40 md:hidden" aria-hidden />
              <div className="relative flex items-center justify-between gap-3">
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
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={switchLang}
                    disabled={langBusy}
                    lang={lang === "hi" ? "en" : "hi"}
                    className="flex h-9 min-w-[64px] items-center justify-center rounded-full bg-white/15 px-3 text-[13px] font-semibold ring-1 ring-white/30 transition hover:bg-white/25 disabled:opacity-60"
                    aria-label={lang === "hi" ? "Switch the chat to English" : "चैट हिंदी में करें"}
                  >
                    {langBusy ? "…" : lang === "hi" ? "English" : "हिंदी"}
                  </button>
                  {messages.length > 0 && (
                    <button type="button" onClick={restartChat} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15" aria-label="Start a new chat">
                      <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
                    </button>
                  )}
                  <button type="button" onClick={close} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15" aria-label="Close chat">
                    <ChevronDown className="h-6 w-6 md:hidden" aria-hidden />
                    <X className="hidden h-5 w-5 md:block" aria-hidden />
                  </button>
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="relative flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-5" aria-live="polite">
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
                        {info && <PriceDetails info={info} onAdd={(v) => addFromChat(message.price!, v)} t={tm} />}
                        {message.coupons && <CouponList coupons={offers?.coupons || []} highlight={message.coupons.highlight} hindi={message.hi} t={tm} />}
                        {message.orders?.length ? (
                          <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
                            <p className="border-b border-[#f6ebf2] px-4 pb-2 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]">{tm("Your latest orders")}</p>
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

                        {message.links?.length ? <div className="mt-2.5 flex flex-wrap gap-2">{message.links.map((l, i) => linkButton(l, i === 0))}</div> : null}

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
                            {message.list.map((c) => (
                              <button key={c.label} type="button" onClick={() => run(c.action, c.label)} disabled={typing} className={rowCls}>
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
                            {message.chips.map((c) => {
                              const Icon = c.action.type === "topics" ? LayoutGrid : c.action.type === "type" ? CornerDownLeft : null;
                              return (
                                <button
                                  key={c.label}
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

            <form onSubmit={handleSubmit} className="shrink-0 border-t border-[#f3e4ee] bg-white/95 px-3 pt-2.5 backdrop-blur" style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}>
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
        <button
          type="button"
          onPointerDown={() => loadEngine()}
          onClick={() => (isOpen ? close() : open())}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] via-[#9A5C93] to-[#C98BBE] text-white shadow-[0_14px_34px_-8px_rgba(126,77,119,0.65)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7] focus-visible:ring-offset-2 active:scale-95"
          aria-label={isOpen ? "Close Potent Saathi" : "Open Potent Saathi"}
        >
          {isOpen ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-[26px] w-[26px]" aria-hidden />}
        </button>
      </div>
    </>
  );
}
