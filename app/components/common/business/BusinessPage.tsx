"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Hotel,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PartyPopper,
  Plane,
  RefreshCw,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/helper/user/action";

// Potent brand teal (header and footer), with Ovy purple and Looway green accents.
const NAVY = "#075965";
const OVY = "#7E4D77";
const LOOWAY = "#0E5C3A";

const WHATSAPP =
  "https://wa.me/916375881514?text=" +
  encodeURIComponent("Hi! I'd like to discuss a B2B / bulk order.");

const TRUST_STATS = [
  { value: "2 brands", label: "Ovy period care · Looway travel hygiene" },
  { value: "1 working day", label: "Reply time for every B2B enquiry" },
  { value: "GST invoice", label: "With every business order" },
  { value: "Pan-India", label: "Tracked delivery from Jaipur" },
];

const INDUSTRIES = [
  {
    icon: Building2,
    title: "Corporates & coworking",
    need: "Stocked washrooms so no employee has to leave work for period supplies.",
    products: ["Ovy pads", "Daily liners", "Seat covers"],
  },
  {
    icon: Plane,
    title: "Travel, tour & yatra operators",
    need: "A hygiene kit per traveller for road trips, pilgrimages, treks and flights.",
    products: ["Yatra Kits", "Pee funnel", "Pee & puke bags"],
  },
  {
    icon: Hotel,
    title: "Hotels & hospitality",
    need: "Guest amenities that solve real problems for travelling guests.",
    products: ["Seat covers", "Ovy pads", "Pee & puke bags"],
  },
  {
    icon: GraduationCap,
    title: "Schools & colleges",
    need: "Gentle organic pads for first periods and stocked campus washrooms.",
    products: ["Ovy Teen kits", "Ovy pads", "Seat covers"],
  },
  {
    icon: Hospital,
    title: "Hospitals & care homes",
    need: "Sealable bags for nausea and bedside use, and clean seats for patients.",
    products: ["Pee & puke bags", "Seat covers", "Ovy pads"],
  },
  {
    icon: PartyPopper,
    title: "Events & corporate gifting",
    need: "Welcome kits and employee gifts that people actually keep and use.",
    products: ["Yatra Kits", "Ovy pads", "Menstrual cups"],
  },
  {
    icon: HeartHandshake,
    title: "NGOs & CSR programmes",
    need: "Safe, organic period products for menstrual hygiene drives.",
    products: ["Ovy pads", "Ovy Teen kits", "Menstrual cups"],
  },
  {
    icon: Store,
    title: "Retailers & distributors",
    need: "Stock India's scenario-based hygiene brand in your store or travel shop.",
    products: ["Full Ovy range", "Full Looway range"],
  },
];

const SOLUTIONS = [
  {
    icon: RefreshCw,
    title: "Workplace hygiene programme",
    text: "Regular refills of pads, liners and seat covers for your washrooms, on a schedule you choose.",
    image: "/product-images/pads.jpg",
  },
  {
    icon: Layers,
    title: "Custom kits for groups",
    text: "We combine products into one kit per person: a Yatra Kit per pilgrim, a period kit per student.",
    image: "/looway/yatra.jpg",
  },
  {
    icon: Package,
    title: "Bulk institutional supply",
    text: "Any of our products in the quantity you need, for hotels, hospitals, schools and offices.",
    image: "/product-images/seatcovers.jpg",
  },
  {
    icon: HeartHandshake,
    title: "Gifting & CSR drives",
    text: "Employee gifts, event kits and menstrual hygiene drives, packed and delivered for you.",
    image: "/product-images/cup-rbw.jpg",
  },
];

const RANGE = [
  {
    brand: "Ovy",
    tag: "Period & intimate care",
    href: "/ovy",
    items: [
      "Organic sanitary pads (L, XL, XL+)",
      "Teen first-period kits",
      "Daily panty liners",
      "Menstrual cups (Teen, Medium, Large)",
    ],
  },
  {
    brand: "Looway",
    tag: "Travel & toilet hygiene",
    href: "/looway",
    items: [
      "Disposable toilet seat covers",
      "Leak-proof pee & puke bags",
      "Reusable female pee funnel",
      "Yatra Kits and custom group kits",
    ],
  },
];

const STEPS = [
  {
    icon: ClipboardList,
    title: "Share your requirement",
    text: "Organisation, products and a rough quantity. The form takes a minute.",
  },
  {
    icon: FileText,
    title: "Receive a quote",
    text: "Within one working day: recommended packs, pricing for your volume and delivery timeline.",
  },
  {
    icon: BadgeCheck,
    title: "Confirm the order",
    text: "Approve the quote and share your GSTIN for the GST invoice. We pack your order and kits.",
  },
  {
    icon: Truck,
    title: "Delivery & refills",
    text: "Tracked delivery anywhere in India, and repeat refills on your schedule if you need them.",
  },
];

const ADVANTAGES = [
  {
    icon: ShieldCheck,
    title: "Tested, gentle products",
    text: "Ovy pads and panties are dermatologically tested and clinically tested as rash-free on 24 volunteers.",
  },
  {
    icon: FileText,
    title: "GST invoice on every order",
    text: "Proper GST invoices with your GSTIN and billing name for your accounts.",
  },
  {
    icon: Layers,
    title: "One supplier, two categories",
    text: "Period care and travel and toilet hygiene from one Indian brand: one quote, one order, one contact.",
  },
  {
    icon: Package,
    title: "Any quantity, custom kits",
    text: "From a first order for one office to large group and programme supplies, with kits built for you.",
  },
  {
    icon: MapPin,
    title: "Made in India, for India",
    text: "Designed for Indian bodies, squat toilets, long journeys and shared washrooms. Woman-founded, Jaipur.",
  },
  {
    icon: HeartHandshake,
    title: "Impact built in",
    text: "A portion of every Ovy order supports safe period products for girls and women who can't afford them.",
  },
];

const ORG_TYPES = [
  "Corporate / office",
  "Travel, tour or yatra operator",
  "Hotel or hospitality",
  "School or college",
  "Hospital or care home",
  "Event, wedding or gifting",
  "NGO or CSR programme",
  "Retailer or distributor",
  "Other",
];

const INTERESTS = [
  "Ovy pads",
  "Teen kits",
  "Daily liners",
  "Menstrual cups",
  "Toilet seat covers",
  "Pee & puke bags",
  "Pee funnel",
  "Yatra / custom kits",
  "Regular refills",
];

const FAQS = [
  {
    q: "Is there a minimum order quantity?",
    a: "No fixed minimum. Share your rough quantity, even for a first order, and we will quote the right packs and pricing for that volume.",
  },
  {
    q: "Do you provide GST invoices?",
    a: "Yes. Every business order comes with a GST invoice. Share your GSTIN and billing name in the form or when you confirm the order.",
  },
  {
    q: "How quickly will we get a quote?",
    a: "Within one working day, Monday to Saturday. For anything urgent, WhatsApp us on +91 63758 81514.",
  },
  {
    q: "Can you build custom kits for our group?",
    a: "Yes. We put together kits from our range, for example a Yatra Kit per traveller, a welcome kit per guest or a period-care kit per student.",
  },
  {
    q: "Can we set up regular washroom refills?",
    a: "Yes. Tell us how often you need refills and we set up a repeat schedule for your locations.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes. Orders are dispatched from Jaipur and tracked to your door anywhere in India. We confirm the delivery timeline with your quote.",
  },
];

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-base text-ink placeholder:text-slate-400 focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/20 focus:outline-none";
const labelClass = "mb-1 block text-xs font-semibold tracking-wide text-ink-muted uppercase";

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-xs font-bold tracking-[0.18em] uppercase ${light ? "text-[#7FD3DA]" : "text-teal"}`}
    >
      {children}
    </p>
  );
}

function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    orgType: "",
    city: "",
    gstin: "",
    quantity: "",
    message: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (item: string) =>
    setInterests((list) => (list.includes(item) ? list.filter((i) => i !== item) : [...list, item]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.organisation.trim() || !form.email.trim() || !form.orgType) {
      toast.error("Please fill in your name, organisation, work email and organisation type.");
      return;
    }
    const phone = form.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (phone && phone.length !== 10) {
      toast.error("Please enter a 10-digit mobile number.");
      return;
    }
    if (form.gstin && form.gstin.length !== 15) {
      toast.error("A GSTIN has 15 characters. Please check it, or leave it empty for now.");
      return;
    }

    const message = [
      "B2B ENQUIRY",
      `Organisation: ${form.organisation.trim()}`,
      `Type: ${form.orgType}`,
      form.city.trim() && `City: ${form.city.trim()}`,
      form.gstin && `GSTIN: ${form.gstin}`,
      interests.length > 0 && `Interested in: ${interests.join(", ")}`,
      form.quantity.trim() && `Approx. quantity: ${form.quantity.trim()}`,
      form.message.trim() && `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setSending(true);
      const res = await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: phone || undefined,
        message,
      });
      if (!res?.success) {
        toast.error(res?.message || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please email info@potenthygiene.com.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4F6]">
          <Check className="h-7 w-7 text-teal" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-ink">B2B enquiry received</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          Thank you. Our team will send your quote within one working day. For anything urgent,
          WhatsApp us on +91 63758 81514.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-ink sm:text-xl">Request a B2B quote</h3>
          <p className="mt-0.5 text-sm text-ink-muted">Reply within one working day</p>
        </div>
        <span className="hidden rounded-full bg-[#E6F4F6] px-3 py-1 text-xs font-semibold text-teal sm:inline">
          GST invoice available
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-name" className={labelClass}>Contact name *</label>
          <input id="b2b-name" autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-org" className={labelClass}>Organisation *</label>
          <input id="b2b-org" autoComplete="organization" value={form.organisation} onChange={set("organisation")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-email" className={labelClass}>Work email *</label>
          <input id="b2b-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-phone" className={labelClass}>Mobile number</label>
          <input
            id="b2b-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={14}
            placeholder="10-digit number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+\s]/g, "") }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="b2b-type" className={labelClass}>Organisation type *</label>
          <select id="b2b-type" value={form.orgType} onChange={set("orgType")} className={inputClass}>
            <option value="">Choose one</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="b2b-city" className={labelClass}>City</label>
          <input id="b2b-city" autoComplete="address-level2" value={form.city} onChange={set("city")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-gstin" className={labelClass}>GSTIN (optional)</label>
          <input
            id="b2b-gstin"
            maxLength={15}
            autoCapitalize="characters"
            placeholder="15-character GST number"
            value={form.gstin}
            onChange={(e) =>
              setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 15) }))
            }
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="b2b-qty" className={labelClass}>Approx. quantity</label>
          <input
            id="b2b-qty"
            placeholder="e.g. 200 employees, 50 pilgrims"
            value={form.quantity}
            onChange={set("quantity")}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={labelClass}>Products of interest</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {INTERESTS.map((item) => {
            const on = interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={on}
                className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  on ? "border-[#016271] bg-[#016271] text-white" : "border-slate-300 bg-white text-ink-muted hover:border-[#016271]"
                }`}
              >
                {on && <Check className="mr-1 inline h-3.5 w-3.5" />}
                {item}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="b2b-msg" className={labelClass}>Requirement details</label>
        <textarea
          id="b2b-msg"
          rows={3}
          placeholder="Locations, delivery date, kit contents, refill frequency…"
          value={form.message}
          onChange={set("message")}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-ink placeholder:text-slate-400 focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/20 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-8 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: NAVY }}
      >
        {sending ? "Sending…" : "Get my B2B quote"} {!sending && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="mt-3 text-center text-xs text-ink-muted">
        Your details are used only to reply to this enquiry.
      </p>
    </form>
  );
}

export default function BusinessPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="w-full bg-white text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #075965 0%, #016271 55%, #1A8D91 100%)" }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-bold tracking-[0.16em] uppercase">
              <Building2 className="h-3.5 w-3.5" /> B2B · Potent for Business
            </span>
            <h1 className="mt-5 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
              B2B hygiene supply for businesses and institutions
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
              Bulk period care and travel hygiene for corporates, travel operators, hotels,
              schools, hospitals, events and CSR programmes. Volume pricing, custom kits,
              GST invoices and tracked delivery across India.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-bold sm:text-base"
                style={{ color: NAVY }}
              >
                Request a B2B quote <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-7 text-sm font-semibold text-white hover:bg-white/10 sm:text-base"
              >
                <MessageCircle className="h-4 w-4" /> Talk to our B2B team
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold tracking-[0.16em] text-[#7FD3DA] uppercase">What B2B buyers get</p>
              <ul className="mt-4 space-y-3">
                {[
                  "Volume pricing for your quantity",
                  "GST invoice with every order",
                  "Custom kits built for your group",
                  "Repeat washroom refills on a schedule",
                  "Pan-India tracked delivery from Jaipur",
                  "Quote within one working day",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm sm:text-base">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A8D91]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-[#CFE9EC] bg-[#E6F4F6]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-[#CFE9EC] lg:grid-cols-4">
          {TRUST_STATS.map((s) => (
            <div key={s.value} className="bg-[#E6F4F6] px-4 py-6 text-center sm:px-6">
              <p className="text-lg font-extrabold sm:text-2xl" style={{ color: NAVY }}>{s.value}</p>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionLabel>Industries we serve</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">B2B solutions for every kind of organisation</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map(({ icon: Icon, title, need, products }) => (
            <div key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#016271]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: NAVY }}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-ink-muted">{need}</p>
              <p className="mt-4 text-xs font-semibold tracking-wide text-ink-muted uppercase">Recommended</p>
              <p className="mt-1 text-sm font-medium text-teal">{products.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionLabel>B2B services</SectionLabel>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">How we supply your organisation</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map(({ icon: Icon, title, text, image }) => (
              <div key={title} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <Icon className="h-5 w-5 text-teal" />
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RANGE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionLabel>Product range for B2B</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Two brands, one supplier</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {RANGE.map((g) => (
            <div
              key={g.brand}
              className="rounded-xl border border-slate-200 border-t-4 p-6"
              style={{ borderTopColor: g.brand === "Ovy" ? OVY : LOOWAY, backgroundColor: g.brand === "Ovy" ? "#FBF1FB" : "#F4F1E8" }}
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: g.brand === "Ovy" ? OVY : LOOWAY }}>{g.brand}</h3>
                  <p className="text-sm text-ink-muted">{g.tag}</p>
                </div>
                <Link href={g.href} className="text-sm font-semibold text-teal hover:underline">
                  View range →
                </Link>
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionLabel light>B2B ordering process</SectionLabel>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">From enquiry to delivery in four steps</h2>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative border-l-2 border-[#1A8D91] pl-5">
                <span className="text-sm font-extrabold text-[#7FD3DA]">0{i + 1}</span>
                <Icon className="mt-2 h-6 w-6 text-white" />
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-white/75">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionLabel>Why businesses choose Potent</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">A dependable B2B hygiene partner</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F4F6]">
                <Icon className="h-5 w-5 text-teal" />
              </div>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section id="quote" className="scroll-mt-28 bg-[#E6F4F6]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <SectionLabel>B2B enquiry</SectionLabel>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Get a quote for your organisation</h2>
            <p className="mt-3 text-ink-muted">
              Tell us what you need. Our B2B team replies with recommended products, volume
              pricing and a delivery timeline within one working day.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="mailto:info@potenthygiene.com" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#016271]">
                <Mail className="h-5 w-5 text-teal" />
                <span>
                  <span className="block font-semibold">B2B email</span>
                  info@potenthygiene.com
                </span>
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#016271]">
                <MessageCircle className="h-5 w-5 text-teal" />
                <span>
                  <span className="block font-semibold">WhatsApp</span>
                  +91 63758 81514 · Mon to Sat, 10 am to 7 pm
                </span>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <MapPin className="h-5 w-5 text-teal" />
                <span>
                  <span className="block font-semibold">Potent Hygiene, Jaipur</span>
                  Woman-founded · Made in India
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <SectionLabel>B2B FAQs</SectionLabel>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Questions from B2B buyers</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {FAQS.map((f, i) => (
            <div key={f.q} className="px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-semibold"
              >
                {f.q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-teal transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="pb-5 text-sm leading-relaxed text-ink-muted">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl p-6 text-center text-white sm:flex-row sm:justify-between sm:text-left" style={{ backgroundColor: NAVY }}>
          <p className="font-semibold">Ready to stock your organisation?</p>
          <a href="#quote" className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-bold" style={{ color: NAVY }}>
            Request a B2B quote <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
