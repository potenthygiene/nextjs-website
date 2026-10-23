"use client";

import { type CSSProperties, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  CircleDashed,
  HeartPulse,
  Layers,
  type LucideIcon,
  MessageCircle,
  MessageCircleHeart,
  PackageSearch,
  Plane,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ChatAnswer } from "@/const/chatbot/types";
import { FLOWS, isFlowResult } from "@/const/chatbot/flows";
import { getChatFirstName, logChatQuestion } from "@/helper/chat/action";

// The Potent chat answers only from approved answers (const/chatbot). No AI.
type Engine = typeof import("@/lib/chat/engine");

type Action =
  | { type: "ask"; q: string }
  | { type: "answer"; id: string }
  | { type: "flow"; node: string }
  | { type: "nav"; href: string; label: string }
  | { type: "human" };

type ChatLink = { label: string; href: string };

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: ChatLink[];
  chips?: { label: string; action: Action }[];
  chipsTitle?: string;
  tone?: "safety";
};

const WHATSAPP = "916375881514";
const HUMAN_LINKS = (question?: string): ChatLink[] => [
  {
    label: "WhatsApp us",
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(question ? `Hi Potent, ${question}` : "Hi Potent, I have a question.")}`,
  },
  { label: "Email care@", href: "mailto:care@potenthygiene.com" },
];

const START_CHIPS: { label: string; action: Action }[] = [
  { label: "Find my pad size", action: { type: "flow", node: "pad:start" } },
  { label: "Find my cup size", action: { type: "flow", node: "cup:start" } },
  { label: "Track my order", action: { type: "ask", q: "how do I track my order" } },
  { label: "Delivery & shipping", action: { type: "ask", q: "how long does delivery take" } },
  { label: "Subscriptions", action: { type: "ask", q: "how do subscriptions work" } },
  { label: "Period questions", action: { type: "ask", q: "is my period normal" } },
  { label: "Travel hygiene", action: { type: "ask", q: "public toilet hygiene while travelling" } },
  { label: "Bulk & business orders", action: { type: "ask", q: "bulk order for my company" } },
  { label: "Talk to a person", action: { type: "human" } },
];

// Topic tiles on the welcome screen.
const TILES: { label: string; icon: LucideIcon; bg: string; ink: string; action: Action }[] = [
  { label: "Find my pad size", icon: Layers, bg: "#FBEFF8", ink: "#7E4D77", action: { type: "flow", node: "pad:start" } },
  { label: "Find my cup size", icon: CircleDashed, bg: "#F3ECFB", ink: "#6B4E9B", action: { type: "flow", node: "cup:start" } },
  { label: "Period questions", icon: HeartPulse, bg: "#FDEEF1", ink: "#B0405F", action: { type: "ask", q: "is my period normal" } },
  { label: "Travel hygiene", icon: Plane, bg: "#E9F6EE", ink: "#0E5C3A", action: { type: "ask", q: "public toilet hygiene while travelling" } },
  { label: "Track my order", icon: PackageSearch, bg: "#E6F4F6", ink: "#075965", action: { type: "ask", q: "how do I track my order" } },
  { label: "Delivery", icon: Truck, bg: "#EEF4FA", ink: "#1F4E79", action: { type: "ask", q: "how long does delivery take" } },
  { label: "Subscriptions", icon: RefreshCw, bg: "#FDF5EA", ink: "#8A4B12", action: { type: "ask", q: "how do subscriptions work" } },
  { label: "Bulk orders", icon: Building2, bg: "#EFF1F3", ink: "#3D4A57", action: { type: "ask", q: "bulk order for my company" } },
];

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

const welcomeText = (name: string | null) =>
  `Hello${name ? ` ${name}` : ""}! I'm Potent Help. Ask me anything about periods, Ovy and Looway products, travel hygiene, orders or delivery, or tap a topic below. I can also take you to any page.`;

const welcome: ChatMessage = { id: "welcome", role: "bot", text: welcomeText(null), chips: START_CHIPS };

// A warm opener now and then, using the customer's name when we know it.
const OPENERS = ["Good question, NAME.", "Sure, NAME.", "Happy to help, NAME.", "Here you go, NAME."];

const NAME_KEY = "potent-chat-name";

const hiddenPathPrefixes = ["/admin", "/dashboard", "/login", "/signup", "/reset-password", "/email-verification"];

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
          const cls = "font-medium text-[#8f4e85] underline underline-offset-2";
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

function goChips(links: ChatLink[] | undefined): { label: string; action: Action }[] {
  const first = links?.find((l) => l.href.startsWith("/"));
  return first ? [{ label: "Yes, take me there", action: { type: "nav", href: first.href, label: first.label } }] : [];
}

function answerMessage(answer: ChatAnswer, engine: Engine, extra: ChatAnswer[] = []): ChatMessage {
  const related = (answer.related || [])
    .map((id) => engine.answerById(id))
    .filter((a): a is ChatAnswer => !!a);
  const more = [...related, ...extra.filter((e) => !related.some((r) => r.id === e.id) && e.id !== answer.id)].slice(0, 3);
  return {
    id: newId(),
    role: "bot",
    text: answer.answer,
    links: answer.links,
    chipsTitle: more.length ? "You might also ask" : undefined,
    chips: [...goChips(answer.links), ...more.map((a) => ({ label: a.question, action: { type: "answer", id: a.id } as Action }))],
  };
}

export function ChatBotWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const replies = useRef(0);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [hasStickyBar, setHasStickyBar] = useState(false);
  const engineRef = useRef<Engine | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHidden = hiddenPathPrefixes.some((prefix) => pathname?.startsWith(prefix));

  // The answer bank loads only when someone opens the chat, then picks up the
  // latest product FAQs, FAQ page and Journal answers from the live site.
  useEffect(() => {
    if (!isOpen || engineRef.current) return;
    import("@/lib/chat/engine").then(async (m) => {
      engineRef.current = m;
      try {
        const res = await fetch("/api/chat-knowledge");
        if (res.ok) m.addLiveAnswers((await res.json()).answers || []);
      } catch {
        // The hand-written answers still work without the live extras.
      }
    });
  }, [isOpen]);

  // Greet signed-in customers by their first name.
  useEffect(() => {
    if (!isOpen || name) return;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(NAME_KEY);
    } catch {}
    if (saved) {
      setName(saved);
      return;
    }
    getChatFirstName()
      .then((n) => n && setName(n))
      .catch(() => {});
  }, [isOpen, name]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [isOpen, messages, typing]);

  // Focus the typing box on desktop only; on phones it would pop the keyboard.
  useEffect(() => {
    if (isOpen && window.innerWidth >= 768) inputRef.current?.focus();
  }, [isOpen]);

  // On phones, keep the sheet above the on-screen keyboard.
  const [sheetStyle, setSheetStyle] = useState<CSSProperties | undefined>(undefined);
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

  const reply = (msg: Omit<ChatMessage, "id" | "role">) =>
    new Promise<void>((resolve) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: newId(), role: "bot", ...msg }]);
        resolve();
      }, 380);
    });

  const rememberName = (n: string) => {
    setName(n);
    try {
      sessionStorage.setItem(NAME_KEY, n);
    } catch {}
  };

  const personal = (text: string) => {
    replies.current += 1;
    if (!name || replies.current % 3 !== 1) return text;
    return `${OPENERS[replies.current % OPENERS.length].replace("NAME", name)} ${text}`;
  };

  const goTo = (href: string) => {
    setTimeout(() => {
      if (href.startsWith("/")) {
        router.push(href);
        if (window.innerWidth < 768) setIsOpen(false);
      } else {
        window.open(href, "_blank", "noopener");
      }
    }, 650);
  };

  const lastBotLinks = () => [...messages].reverse().find((m) => m.role === "bot")?.links;

  const getEngine = async () => engineRef.current || (engineRef.current = await import("@/lib/chat/engine"));

  async function respondTo(question: string) {
    const engine = await getEngine();

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
      return reply({ text, links, tone: "safety" });
    }

    const told = engine.extractName(question);
    if (told) {
      rememberName(told);
      return reply({ text: `Lovely to meet you, ${told}! What can I help you with today?`, chips: START_CHIPS.slice(0, 6) });
    }

    if (engine.isGreeting(question)) {
      return reply({
        text: `Hello${name ? ` ${name}` : ""}! How can I help you today? You can type a question or tap a topic.`,
        chips: START_CHIPS,
      });
    }

    if (engine.isYes(question)) {
      const target = lastBotLinks()?.[0];
      if (target) {
        reply({ text: `Taking you to ${target.label} now.` });
        return goTo(target.href);
      }
      return reply({ text: "Great! What would you like to know?", chips: START_CHIPS.slice(0, 6) });
    }

    const nav = engine.findNavigation(question);
    if (nav) {
      reply({ text: `Taking you to ${nav.label} now.`, links: [{ label: `Open ${nav.label}`, href: nav.href }] });
      return goTo(nav.href);
    }

    const result = engine.findAnswer(question);

    if (engine.isPriceQuestion(question)) {
      const product = result.kind === "answer" ? result.answer.links?.find((l) => l.href.startsWith("/product-detail")) : undefined;
      return reply({
        text: "Prices can change, so the current price is always on the product page, and it includes GST. Delivery is free on orders of ₹399 and above.",
        links: [product ? { label: `See ${product.label.replace(/^see /i, "")}`, href: product.href } : { label: "See all products", href: "/shop" }],
      });
    }

    if (result.kind === "answer") {
      const msg = answerMessage(result.answer, engine, result.alternatives);
      return reply({ ...msg, text: personal(msg.text) });
    }

    if (result.kind === "unsure") {
      return reply({
        text: "I want to get this right. Did you mean one of these?",
        chips: [
          ...result.options.map((a) => ({ label: a.question, action: { type: "answer", id: a.id } as Action })),
          { label: "None of these", action: { type: "human" } },
        ],
      });
    }

    logChatQuestion(question, pathname || "/").catch(() => {});
    return reply({
      text: "I don't have an approved answer for that yet, so I've passed your question to our team. For a quick reply, message us on WhatsApp (Monday to Saturday, 10 am to 7 pm) or email care@potenthygiene.com.",
      links: HUMAN_LINKS(question),
    });
  }

  async function run(action: Action, label: string) {
    if (typing) return;
    setMessages((m) => [...m, { id: newId(), role: "user", text: label }]);

    if (action.type === "ask") return respondTo(action.q);
    if (action.type === "nav") {
      reply({ text: `Taking you to ${action.label} now.` });
      return goTo(action.href);
    }
    if (action.type === "human") {
      return reply({
        text: "Our team is on WhatsApp and phone (+91 63758 81514) Monday to Saturday, 10 am to 7 pm, and on email any time. For bulk orders, write to info@potenthygiene.com.",
        links: HUMAN_LINKS(),
      });
    }
    if (action.type === "answer") {
      const engine = await getEngine();
      const answer = engine.answerById(action.id);
      return answer ? reply(answerMessage(answer, engine)) : respondTo(label);
    }
    const node = FLOWS[action.node];
    if (!node) return;
    if (isFlowResult(node)) {
      return reply({
        text: node.text,
        links: node.links,
        chips: [
          ...goChips(node.links),
          { label: "Start again", action: { type: "flow", node: action.node.startsWith("cup") ? "cup:start" : "pad:start" } },
          { label: "Talk to a person", action: { type: "human" } },
        ],
      });
    }
    return reply({ text: node.text, chips: node.options.map((o) => ({ label: o.label, action: { type: "flow", node: o.next } })) });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = input.trim();
    if (!q || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: newId(), role: "user", text: q }]);
    await respondTo(q);
  }

  const lastId = messages[messages.length - 1]?.id;
  const conversation = messages.filter((m) => m.id !== "welcome");
  const close = () => setIsOpen(false);
  const restart = () => {
    setMessages([welcome]);
    replies.current = 0;
  };

  const chipButton = (chip: { label: string; action: Action }, primary = false) => (
    <button
      key={chip.label}
      type="button"
      onClick={() => run(chip.action, chip.label)}
      disabled={typing}
      className={
        primary
          ? "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7E4D77] to-[#AF71A7] px-4 text-[14px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(126,77,119,0.6)] transition active:scale-[0.97] disabled:opacity-60"
          : "min-h-10 rounded-full border border-[#ecd9e6] bg-white px-4 py-2 text-left text-[14px] font-medium leading-5 text-[#5e4458] shadow-[0_1px_2px_rgba(63,39,56,0.04)] transition hover:border-[#AF71A7] hover:bg-[#fff6fb] active:scale-[0.97] disabled:opacity-60"
      }
    >
      {chip.label}
      {primary && <ArrowUpRight className="h-4 w-4" aria-hidden />}
    </button>
  );

  const linkPill = (l: ChatLink) => {
    const cls =
      "inline-flex min-h-9 items-center gap-1 rounded-full bg-[#f6e9f2] px-3.5 text-[13px] font-semibold text-[#7E4D77] transition hover:bg-[#efd8e8] active:scale-[0.97]";
    return l.href.startsWith("/") ? (
      <Link key={l.href + l.label} href={l.href} onClick={() => window.innerWidth < 768 && close()} className={cls}>
        {l.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    ) : (
      <a key={l.href + l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>
        {l.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
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
            aria-label="Potent help chat"
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
                    <Sparkles className="h-5 w-5" aria-hidden />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#9A5C93] bg-[#5FE39A]" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[17px] font-semibold leading-tight">Potent Help</h2>
                    <p className="truncate text-[12.5px] text-white/85">Instant answers · team on WhatsApp</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {conversation.length > 0 && (
                    <button type="button" onClick={restart} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15" aria-label="Start a new chat">
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-5" aria-live="polite">
              {/* Welcome */}
              <div className="chat-in">
                <p className="text-[24px] font-semibold leading-tight tracking-[-0.01em] text-[#2b1c27]">
                  {timeGreeting()}
                  {name ? `, ${name}` : ""} <span aria-hidden>👋</span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6d5767]">
                  I&apos;m Potent Help. Ask me anything about periods, Ovy and Looway, travel hygiene or your order. I can take you to any page too.
                </p>

                {conversation.length === 0 && (
                  <>
                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                      {TILES.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => run(t.action, t.label)}
                            className="group flex min-h-[84px] flex-col items-start justify-between rounded-2xl border border-[#f0e0ea] bg-white p-3.5 text-left shadow-[0_2px_10px_-4px_rgba(63,39,56,0.10)] transition active:scale-[0.97] md:hover:-translate-y-0.5 md:hover:shadow-[0_10px_24px_-12px_rgba(126,77,119,0.4)]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: t.bg, color: t.ink }}>
                              <Icon className="h-[18px] w-[18px]" aria-hidden />
                            </span>
                            <span className="mt-2.5 text-[14px] font-semibold leading-tight text-[#2b1c27]">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <a
                      href={HUMAN_LINKS()[0].href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex min-h-14 items-center gap-3 rounded-2xl bg-[#EAF8EF] px-4 text-[#145c34] transition active:scale-[0.98]"
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
                {conversation.map((message) => (
                  <div key={message.id} className={`chat-in flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`flex max-w-[88%] items-end gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      {message.role === "bot" && (
                        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] to-[#C98BBE] text-white" aria-hidden>
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <div
                        className={`whitespace-pre-line rounded-[22px] px-4 py-3 text-[15px] leading-[1.6] ${
                          message.role === "user"
                            ? "rounded-br-md bg-gradient-to-br from-[#7E4D77] to-[#AF71A7] text-white shadow-[0_6px_16px_-8px_rgba(126,77,119,0.7)]"
                            : message.tone === "safety"
                              ? "rounded-bl-md border border-[#f3c1c9] bg-[#fff1f3] text-[#4a2430]"
                              : "rounded-bl-md bg-white text-[#3a2b36] shadow-[0_2px_12px_-4px_rgba(63,39,56,0.14)]"
                        }`}
                      >
                        <Rich text={message.text} onNavigate={() => window.innerWidth < 768 && close()} />
                        {message.links?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.links.map(linkPill)}</div> : null}
                      </div>
                    </div>

                    {message.chips?.length && message.id === lastId ? (
                      <div className="mt-3 w-full pl-9">
                        {message.chips.some((c) => c.action.type === "nav") && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {message.chips.filter((c) => c.action.type === "nav").map((c) => chipButton(c, true))}
                          </div>
                        )}
                        {message.chipsTitle && (
                          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#a3899b]">{message.chipsTitle}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {message.chips.filter((c) => c.action.type !== "nav").map((c) => chipButton(c))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}

                {typing && (
                  <div className="chat-in flex items-end gap-2" aria-label="Typing">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] to-[#C98BBE] text-white" aria-hidden>
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex gap-1.5 rounded-[22px] rounded-bl-md bg-white px-4 py-3.5 shadow-[0_2px_12px_-4px_rgba(63,39,56,0.14)]">
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
                  placeholder={name ? `Ask me anything, ${name}…` : "Ask me anything…"}
                  maxLength={300}
                  enterKeyHint="send"
                  autoComplete="off"
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
          onClick={() => setIsOpen((current) => !current)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7E4D77] via-[#9A5C93] to-[#C98BBE] text-white shadow-[0_14px_34px_-8px_rgba(126,77,119,0.65)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AF71A7] focus-visible:ring-offset-2 active:scale-95"
          aria-label={isOpen ? "Close Potent help" : "Open Potent help"}
        >
          {!isOpen && <span className="absolute inset-0 animate-ping rounded-full bg-[#C98BBE]/40 [animation-duration:2.6s]" aria-hidden />}
          {isOpen ? <X className="relative h-6 w-6" aria-hidden /> : <MessageCircle className="relative h-[26px] w-[26px]" aria-hidden />}
        </button>
      </div>
    </>
  );
}
