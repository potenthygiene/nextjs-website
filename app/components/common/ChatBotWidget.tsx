"use client";

import { type CSSProperties, FormEvent, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
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
  Package,
  Plane,
  RefreshCw,
  RotateCcw,
  Send,
  ShoppingBag,
  Sprout,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ChatAnswer } from "@/const/chatbot/types";
import { FLOWS, isFlowResult } from "@/const/chatbot/flows";
import { MENUS, PRODUCT_WORDS, TOPIC_MENU } from "@/const/chatbot/menus";
import { getChatFirstName, logChatQuestion } from "@/helper/chat/action";

// Potent Saathi: answers only from Potent's approved answers (const/chatbot). No AI.
type Engine = typeof import("@/lib/chat/engine");

type Action =
  | { type: "ask"; q: string }
  | { type: "answer"; id: string }
  | { type: "flow"; node: string }
  | { type: "menu"; id: string }
  | { type: "topics" }
  | { type: "type" }
  | { type: "nav"; href: string; label: string }
  | { type: "human" };

type ChatLink = { label: string; href: string };
type Choice = { label: string; action: Action };

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  /** Buttons that open a page or app. */
  links?: ChatLink[];
  /** A tap-able list of questions or options. */
  list?: Choice[];
  listTitle?: string;
  /** Small follow-up chips. */
  chips?: Choice[];
  tone?: "safety";
};

const WHATSAPP = "916375881514";
const whatsappLink = (question?: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(question ? `Hi Potent, ${question}` : "Hi Potent, I have a question.")}`;
const HUMAN_LINKS = (question?: string): ChatLink[] => [
  { label: "WhatsApp us", href: whatsappLink(question) },
  { label: "Email care@", href: "mailto:care@potenthygiene.com" },
];

// Topic tiles on the welcome screen.
const TILES: { label: string; icon: LucideIcon; bg: string; ink: string; action: Action }[] = [
  { label: "Find my pad size", icon: Layers, bg: "#FBEFF8", ink: "#7E4D77", action: { type: "flow", node: "pad:start" } },
  { label: "Find my cup size", icon: CircleDashed, bg: "#F3ECFB", ink: "#6B4E9B", action: { type: "flow", node: "cup:start" } },
  { label: "Period questions", icon: HeartPulse, bg: "#FDEEF1", ink: "#B0405F", action: { type: "menu", id: "periods" } },
  { label: "Travel hygiene", icon: Plane, bg: "#E9F6EE", ink: "#0E5C3A", action: { type: "menu", id: "travel" } },
  { label: "Ovy products", icon: ShoppingBag, bg: "#FBF1FB", ink: "#7E4D77", action: { type: "menu", id: "ovy" } },
  { label: "Looway products", icon: Package, bg: "#EEF5EF", ink: "#0E5C3A", action: { type: "menu", id: "looway" } },
  { label: "Orders & delivery", icon: Truck, bg: "#E6F4F6", ink: "#075965", action: { type: "menu", id: "orders" } },
  { label: "Subscriptions", icon: RefreshCw, bg: "#FDF5EA", ink: "#8A4B12", action: { type: "menu", id: "subscriptions" } },
];

const MORE_TOPICS: { label: string; icon: LucideIcon; action: Action }[] = [
  { label: "First periods & teens", icon: Sprout, action: { type: "menu", id: "teens" } },
  { label: "Women's health", icon: HeartPulse, action: { type: "menu", id: "health" } },
  { label: "Account & rewards", icon: UserRound, action: { type: "menu", id: "account" } },
  { label: "Bulk orders", icon: Building2, action: { type: "menu", id: "business" } },
];

const ALL_TOPICS: Choice[] = [...TILES, ...MORE_TOPICS].map((t) => ({ label: t.label, action: t.action }));

const BACK: Choice = { label: "Back to topics", action: { type: "topics" } };
const OWN: Choice = { label: "Ask my own question", action: { type: "type" } };
const HUMAN: Choice = { label: "Talk to a person", action: { type: "human" } };

const NAME_KEY = "potent-chat-name";
const hiddenPathPrefixes = ["/admin", "/dashboard", "/login", "/signup", "/reset-password", "/email-verification"];

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

let counter = 0;
const newId = () => `m${Date.now()}-${counter++}`;

function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
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
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] to-[#C98BBE]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image src="/brand/potent-white.png" alt="" width={44} height={26} style={{ width: size * 0.74, height: "auto" }} />
    </span>
  );
}

export function ChatBotWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStickyBar, setHasStickyBar] = useState(false);
  const [sheetStyle, setSheetStyle] = useState<CSSProperties | undefined>(undefined);
  const engineRef = useRef<Engine | null>(null);
  const enginePromise = useRef<Promise<Engine> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHidden = hiddenPathPrefixes.some((prefix) => pathname?.startsWith(prefix));

  // Load the answers, plus live product FAQs, FAQ page and Journal answers.
  const loadEngine = () => {
    if (!enginePromise.current) {
      enginePromise.current = import("@/lib/chat/engine").then(async (m) => {
        engineRef.current = m;
        try {
          const res = await fetch("/api/chat-knowledge");
          if (res.ok) m.addLiveAnswers((await res.json()).answers || []);
        } catch {
          // The hand-written answers still work without the live extras.
        }
        m.warmUp();
        return m;
      });
    }
    return enginePromise.current;
  };

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
      if (saved) return setName(saved);
    } catch {}
    getChatFirstName()
      .then((n) => n && setName(n))
      .catch(() => {});
  }, [isOpen, name]);

  // Keep the newest reply in view: short replies scroll to the bottom, long
  // ones scroll to their first line so nothing has to be scrolled back up.
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

  // Focus the typing box on desktop only; on phones it would pop the keyboard.
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

  // Close with the Escape key.
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

  if (isHidden) return null;

  const isPhone = () => typeof window !== "undefined" && window.innerWidth < 768;
  const close = () => setIsOpen(false);
  const open = () => {
    loadEngine();
    setIsOpen(true);
  };

  const reply = (msg: Omit<ChatMessage, "id" | "role">, delay = 320) =>
    new Promise<void>((resolve) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: newId(), role: "bot", ...msg }]);
        resolve();
      }, delay);
    });

  const say = (text: string) => setMessages((m) => [...m, { id: newId(), role: "user", text }]);

  const rememberName = (n: string) => {
    setName(n);
    try {
      sessionStorage.setItem(NAME_KEY, n);
    } catch {}
  };

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

  const lastBot = () => [...messages].reverse().find((m) => m.role === "bot");

  const menuMessage = (id: string): Omit<ChatMessage, "id" | "role"> | null => {
    const menu = MENUS[id];
    const engine = engineRef.current;
    if (!menu || !engine) return null;
    const questions = menu.questions
      .map((q) => engine.answerById(q))
      .filter((a): a is ChatAnswer => !!a)
      .map((a) => ({ label: a.question, action: { type: "answer", id: a.id } as Action }));
    const intro = name && menu.intro.startsWith("Here") ? menu.intro.replace(/\. /, `, ${name}. `) : menu.intro;
    return {
      text: intro,
      list: [...(menu.flow ? [{ label: menu.flow.label, action: { type: "flow", node: menu.flow.node } as Action }] : []), ...questions],
      links: menu.page ? [menu.page] : undefined,
      chips: [OWN, BACK],
    };
  };

  const answerMessage = (answer: ChatAnswer, extra: ChatAnswer[] = []): Omit<ChatMessage, "id" | "role"> => {
    const engine = engineRef.current!;
    const related = (answer.related || []).map((id) => engine.answerById(id)).filter((a): a is ChatAnswer => !!a);
    const more = [...related, ...extra.filter((e) => e.id !== answer.id && !related.some((r) => r.id === e.id))].slice(0, 3);
    const menuId = TOPIC_MENU[answer.topic];
    const menu = menuId ? MENUS[menuId] : undefined;
    return {
      text: answer.answer,
      links: answer.links?.slice(0, 2),
      listTitle: more.length ? "Related questions" : undefined,
      list: more.map((a) => ({ label: a.question, action: { type: "answer", id: a.id } as Action })),
      chips: [...(menu ? [{ label: `More on ${menu.title.toLowerCase()}`, action: { type: "menu", id: menu.id } as Action }] : []), BACK],
    };
  };

  const topicsMessage = (text: string): Omit<ChatMessage, "id" | "role"> => ({ text, list: ALL_TOPICS, chips: [OWN, HUMAN] });

  async function respondTo(question: string) {
    const engine = engineRef.current || (await loadEngine());

    const safety = engine.safetyCheck(question);
    if (safety) {
      const text =
        safety.kind === "crisis"
          ? "I'm really sorry you're feeling this way. You deserve support right now. Please call **Tele MANAS on 14416** (free, 24 hours, in Indian languages), or **112** if you are in danger. If you can, tell someone you trust who is near you."
          : safety.kind === "abuse"
            ? "I'm so sorry this happened. It is not your fault. If you are in danger, call **112**. You can call the **Women Helpline on 181**, and if you are under 18, **Childline on 1098**. Both are free and confidential."
            : "This sounds like it needs a doctor now. Please call **112** or go to the nearest emergency department straight away.";
      const links =
        safety.kind === "crisis"
          ? [{ label: "Call 14416", href: "tel:14416" }, { label: "Call 112", href: "tel:112" }]
          : safety.kind === "abuse"
            ? [{ label: "Call 181", href: "tel:181" }, { label: "Call 112", href: "tel:112" }]
            : [{ label: "Call 112", href: "tel:112" }];
      return reply({ text, links, tone: "safety" }, 200);
    }

    const told = engine.extractName(question);
    if (told) {
      rememberName(told);
      return reply(topicsMessage(`Lovely to meet you, ${told}! What would you like help with?`));
    }

    if (engine.isGreeting(question)) {
      return reply(topicsMessage(`Hello${name ? ` ${name}` : ""}! What would you like help with today?`));
    }

    if (engine.isYes(question)) {
      const target = lastBot()?.links?.find((l) => !l.href.startsWith("tel:"));
      if (target) {
        reply({ text: `Opening ${target.label} for you.` });
        return goTo(target.href);
      }
    }

    if (engine.isAck(question) || engine.isYes(question)) {
      return reply({ text: `Glad I could help${name ? `, ${name}` : ""}! Anything else you'd like to know?`, chips: [OWN, BACK] });
    }

    if (engine.isNo(question)) {
      return reply({ text: "No problem. I'm right here whenever you need me.", chips: [BACK, HUMAN] });
    }

    // A product name on its own opens that product's questions.
    const bare = engine.normalise(question);
    if (PRODUCT_WORDS[bare]) {
      const msg = menuMessage(PRODUCT_WORDS[bare]);
      if (msg) return reply(msg);
    }

    const nav = engine.findNavigation(question);
    if (nav) {
      reply({ text: `Opening ${nav.label} for you.`, links: [{ label: `Open ${nav.label}`, href: nav.href }] });
      return goTo(nav.href);
    }

    const result = engine.findAnswer(question);

    if (engine.isPriceQuestion(question)) {
      // Point to the product they named, else to the matched answer's product.
      const named = Object.keys(PRODUCT_WORDS)
        .sort((x, y) => y.length - x.length)
        .find((w) => ` ${bare} `.includes(` ${w} `));
      const namedPage = named ? MENUS[PRODUCT_WORDS[named]]?.page : undefined;
      const product =
        (namedPage && { label: namedPage.label, href: namedPage.href }) ||
        (result.kind === "answer" ? result.answer.links?.find((l) => l.href.startsWith("/product-detail")) : undefined);
      return reply({
        text: "Prices can change, so the current price is always on the product page, and it includes GST. Delivery is free on orders of ₹399 and above.",
        links: [product ? { label: "See the price", href: product.href } : { label: "See all products", href: "/shop" }],
        chips: [BACK],
      });
    }

    if (result.kind === "answer") return reply(answerMessage(result.answer, result.alternatives));

    if (result.kind === "unsure") {
      return reply({
        text: "I want to get this right. Did you mean one of these?",
        list: result.options.map((a) => ({ label: a.question, action: { type: "answer", id: a.id } as Action })),
        chips: [{ label: "None of these", action: { type: "human" } }, BACK],
      });
    }

    logChatQuestion(question, pathname || "/").catch(() => {});
    return reply({
      text: `Sorry${name ? ` ${name}` : ""}, I don't have an answer for that yet, so I've passed your question to our team. For a quick reply, message us on WhatsApp (Monday to Saturday, 10 am to 7 pm) or email care@potenthygiene.com.`,
      links: HUMAN_LINKS(question),
      chips: [OWN, BACK],
    });
  }

  async function run(action: Action, label: string) {
    if (typing) return;
    if (action.type === "type") {
      inputRef.current?.focus();
      return;
    }
    say(label);

    if (action.type === "ask") return respondTo(action.q);
    if (action.type === "topics") return reply(topicsMessage("What would you like help with?"));
    if (action.type === "nav") {
      reply({ text: `Opening ${action.label} for you.` });
      return goTo(action.href);
    }
    if (action.type === "human") {
      return reply({
        text: "Our team is on WhatsApp and phone (+91 63758 81514) Monday to Saturday, 10 am to 7 pm, and on email any time. For bulk orders, write to info@potenthygiene.com.",
        links: HUMAN_LINKS(),
        chips: [BACK],
      });
    }

    if (action.type === "flow") {
      const node = FLOWS[action.node];
      if (!node) return;
      if (isFlowResult(node)) {
        const restart = action.node.startsWith("cup") ? "cup:start" : "pad:start";
        return reply({ text: node.text, links: node.links, chips: [{ label: "Start again", action: { type: "flow", node: restart } }, BACK] });
      }
      return reply({ text: node.text, list: node.options.map((o) => ({ label: o.label, action: { type: "flow", node: o.next } as Action })), chips: [BACK] });
    }

    const engine = engineRef.current || (await loadEngine());
    if (action.type === "menu") {
      const msg = menuMessage(action.id);
      return msg ? reply(msg) : respondTo(label);
    }
    const answer = engine.answerById(action.id);
    return answer ? reply(answerMessage(answer)) : respondTo(label);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = input.trim();
    if (!q || typing) return;
    setInput("");
    say(q);
    await respondTo(q);
  }

  const restartChat = () => setMessages([]);
  const lastId = messages[messages.length - 1]?.id;

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
      <Link key={l.href + l.label} href={l.href} onClick={() => isPhone() && close()} className={cls}>{inner}</Link>
    ) : (
      <a key={l.href + l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</a>
    );
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Dim the page behind the chat on phones; tap it to close. */}
          <div className="fixed inset-0 z-[100000] bg-[#2a1a26]/35 backdrop-blur-[2px] md:hidden" onClick={close} aria-hidden />

          <section
            role="dialog"
            aria-label="Potent Saathi chat"
            style={sheetStyle}
            className="chat-sheet fixed inset-x-0 bottom-0 z-[100001] flex h-[92dvh] flex-col overflow-hidden rounded-t-[28px] bg-[#FFFAFD] shadow-[0_-20px_60px_rgba(42,26,38,0.28)] md:inset-x-auto md:bottom-24 md:right-6 md:h-[min(680px,calc(100dvh-120px))] md:w-[400px] md:rounded-[28px] md:shadow-[0_30px_80px_-20px_rgba(42,26,38,0.45)]"
          >
            {/* Header */}
            <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#6E3F68] via-[#9A5C93] to-[#C98BBE] px-5 pb-4 pt-2.5 text-white">
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
                    <p className="truncate text-[12.5px] text-white/85">Your Ovy &amp; Looway companion</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
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

            {/* Conversation */}
            <div ref={scrollRef} className="relative flex-1 overflow-y-auto overscroll-contain px-4 pb-5 pt-5" aria-live="polite">
              {/* Welcome */}
              <div className="chat-in">
                <p className="text-[24px] font-semibold leading-tight tracking-[-0.01em] text-[#2b1c27]">
                  {timeGreeting()}
                  {name ? `, ${name}` : ""} <span aria-hidden>👋</span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6d5767]">
                  I&apos;m Saathi, your Potent companion. Tap a topic or type any question about periods, Ovy, Looway, travel hygiene or your order.
                </p>

                {messages.length === 0 && (
                  <>
                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                      {TILES.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => run(t.action, t.label)}
                            className="flex min-h-[84px] flex-col items-start justify-between rounded-2xl border border-[#f0e0ea] bg-white p-3.5 text-left shadow-[0_2px_10px_-4px_rgba(63,39,56,0.10)] transition active:scale-[0.97] md:hover:-translate-y-0.5 md:hover:shadow-[0_10px_24px_-12px_rgba(126,77,119,0.4)]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: t.bg, color: t.ink }}>
                              <Icon className="h-[18px] w-[18px]" aria-hidden />
                            </span>
                            <span className="mt-2.5 text-[14px] font-semibold leading-tight text-[#2b1c27]">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {MORE_TOPICS.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => run(t.action, t.label)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#ecd9e6] bg-white px-3.5 text-[13.5px] font-medium text-[#5e4458] transition active:scale-[0.97] md:hover:border-[#AF71A7]"
                          >
                            <Icon className="h-4 w-4 text-[#9A5C93]" aria-hidden />
                            {t.label}
                          </button>
                        );
                      })}
                    </div>

                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex min-h-14 items-center gap-3 rounded-2xl bg-[#EAF8EF] px-4 text-[#145c34] transition active:scale-[0.98]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                        <MessageCircleHeart className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold">Talk to a person on WhatsApp</span>
                        <span className="block text-[12.5px] text-[#2f7a50]">Monday to Saturday, 10 am to 7 pm</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                    </a>
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="mt-5 space-y-4">
                {messages.map((message) => {
                  const isLast = message.id === lastId;
                  return (
                    <div
                      key={message.id}
                      ref={isLast ? lastRef : undefined}
                      data-role={message.role}
                      className={`chat-in flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      {message.role === "user" ? (
                        <div className="max-w-[85%] rounded-[22px] rounded-br-md bg-gradient-to-br from-[#7E4D77] to-[#AF71A7] px-4 py-2.5 text-[15px] leading-[1.55] text-white shadow-[0_6px_16px_-8px_rgba(126,77,119,0.7)]">
                          {message.text}
                        </div>
                      ) : (
                        <div className="flex w-full items-start gap-2">
                          <span className="mt-0.5"><Avatar /></span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`whitespace-pre-line rounded-[22px] rounded-tl-md px-4 py-3 text-[15px] leading-[1.6] ${
                                message.tone === "safety"
                                  ? "border border-[#f3c1c9] bg-[#fff1f3] text-[#4a2430]"
                                  : "bg-white text-[#3a2b36] shadow-[0_2px_12px_-4px_rgba(63,39,56,0.14)]"
                              }`}
                            >
                              <Rich text={message.text} onNavigate={() => isPhone() && close()} />
                            </div>

                            {message.links?.length ? (
                              <div className="mt-2.5 flex flex-wrap gap-2">{message.links.map((l, i) => linkButton(l, i === 0))}</div>
                            ) : null}

                            {/* Options stay tappable on the latest message only */}
                            {isLast && message.list?.length ? (
                              <div className="mt-3 overflow-hidden rounded-2xl border border-[#f0e0ea] bg-white">
                                {message.listTitle && (
                                  <p className="border-b border-[#f6ebf2] px-4 pb-2 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]">
                                    {message.listTitle}
                                  </p>
                                )}
                                {message.list.map((c) => (
                                  <button
                                    key={c.label}
                                    type="button"
                                    onClick={() => run(c.action, c.label)}
                                    disabled={typing}
                                    className="flex min-h-12 w-full items-center gap-3 border-b border-[#f6ebf2] px-4 py-2.5 text-left text-[14.5px] font-medium leading-snug text-[#3a2b36] transition last:border-b-0 active:bg-[#fbf1f7] disabled:opacity-60 md:hover:bg-[#fff6fb]"
                                  >
                                    <span className="min-w-0 flex-1">{c.label}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-[#C98BBE]" aria-hidden />
                                  </button>
                                ))}
                              </div>
                            ) : null}

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
                      )}
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

            {/* Typing box */}
            <form onSubmit={handleSubmit} className="shrink-0 border-t border-[#f3e4ee] bg-white/95 px-3 pt-3 backdrop-blur" style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}>
              <div className="flex items-center gap-2 rounded-full border border-[#ecd9e6] bg-[#FFFAFD] p-1.5 pl-4 transition focus-within:border-[#AF71A7] focus-within:ring-4 focus-within:ring-[#AF71A7]/12">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={name ? `Ask me anything, ${name}…` : "Type your question…"}
                  maxLength={300}
                  enterKeyHint="send"
                  autoComplete="off"
                  aria-label="Type your question"
                  className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-[#2b1c27] outline-none placeholder:text-[#b29aab]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] to-[#AF71A7] text-white shadow-[0_6px_14px_-6px_rgba(126,77,119,0.7)] transition active:scale-95 disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-[18px] w-[18px]" aria-hidden />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-[#ab95a5]">Answers from Potent&apos;s own guides · not medical advice</p>
            </form>
          </section>
        </>
      )}

      {/* Launcher */}
      <div
        className={`chatbot-floating-widget fixed right-4 z-50 transition-all duration-300 sm:right-6 md:bottom-6 ${
          hasStickyBar ? "bottom-[138px]" : "bottom-20"
        } ${isOpen ? "max-md:hidden" : ""}`}
      >
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
