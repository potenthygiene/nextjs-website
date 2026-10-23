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
  GraduationCap,
  HeartHandshake,
  Hospital,
  Hotel,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PartyPopper,
  Plane,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/helper/user/action";

const WHATSAPP =
  "https://wa.me/916375881514?text=" +
  encodeURIComponent("Hi! I'd like to discuss a bulk / business order.");

const SEGMENTS = [
  {
    icon: Building2,
    title: "Offices & coworking",
    need: "Period care and clean seats in every washroom, so nobody has to leave work for supplies.",
    products: ["Ovy pads", "Daily liners", "Seat covers"],
  },
  {
    icon: Plane,
    title: "Travel, tours & yatra groups",
    need: "A hygiene kit for every traveller on long road trips, pilgrimages, treks and flights.",
    products: ["Yatra Kits", "Pee funnel", "Pee & puke bags", "Seat covers"],
  },
  {
    icon: Hotel,
    title: "Hotels, homestays & spas",
    need: "Thoughtful guest amenities that solve real problems on the road.",
    products: ["Seat covers", "Ovy pads", "Pee & puke bags"],
  },
  {
    icon: GraduationCap,
    title: "Schools & colleges",
    need: "Gentle, organic pads for first periods and stocked washrooms for students.",
    products: ["Ovy Teen kits", "Ovy pads", "Seat covers"],
  },
  {
    icon: Hospital,
    title: "Hospitals & care homes",
    need: "Hygienic, sealable bags for nausea and bedside use, and clean seats for patients.",
    products: ["Pee & puke bags", "Seat covers", "Ovy pads"],
  },
  {
    icon: PartyPopper,
    title: "Events, weddings & gifting",
    need: "Useful welcome kits and employee gifts people actually keep and use.",
    products: ["Yatra Kits", "Ovy pads", "Menstrual cups"],
  },
  {
    icon: HeartHandshake,
    title: "NGOs & CSR programmes",
    need: "Safe, organic period products for menstrual hygiene drives and community programmes.",
    products: ["Ovy pads", "Ovy Teen kits", "Menstrual cups"],
  },
  {
    icon: Store,
    title: "Retailers & distributors",
    need: "Stock India's scenario-based hygiene brand for your pharmacy, store or travel shop.",
    products: ["Full Ovy range", "Full Looway range"],
  },
];

const RANGE = [
  {
    brand: "Ovy · period & intimate care",
    href: "/ovy",
    items: [
      { name: "Organic sanitary pads (L, XL, XL+)", image: "/product-images/pads.jpg" },
      { name: "Teen first-period kits", image: "/product-images/teen-pro.jpg" },
      { name: "Daily panty liners", image: "/product-images/liners.jpg" },
      { name: "Menstrual cups", image: "/product-images/cup.jpg" },
    ],
  },
  {
    brand: "Looway · travel & toilet hygiene",
    href: "/looway",
    items: [
      { name: "Disposable toilet seat covers", image: "/product-images/seatcovers.jpg" },
      { name: "Leak-proof pee & puke bags", image: "/product-images/pukebags.jpg" },
      { name: "Reusable female pee funnel", image: "/product-images/funnel.jpg" },
      { name: "Yatra Kits for groups", image: "/looway/yatra.jpg" },
    ],
  },
];

const STEPS = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    text: "Share who it's for, the products and a rough quantity. It takes a minute.",
  },
  {
    icon: MessageCircle,
    title: "Get a recommendation & quote",
    text: "We reply within one working day with the right packs and a quote for your quantity.",
  },
  {
    icon: Package,
    title: "Confirm your order",
    text: "Approve the quote, and we pack your order, including any mixed kits you chose.",
  },
  {
    icon: Truck,
    title: "Delivered across India",
    text: "Dispatched from Jaipur and tracked to your door, anywhere in India.",
  },
];

const REASONS = [
  {
    title: "Tested, gentle products",
    text: "Ovy pads and panties are dermatologically tested and clinically tested as rash-free on 24 volunteers.",
  },
  {
    title: "Two problems, one supplier",
    text: "Period care and travel and toilet hygiene from one Indian brand, one order and one contact.",
  },
  {
    title: "Made for Indian conditions",
    text: "Designed for Indian bodies, squat toilets, long journeys, hot weather and shared washrooms.",
  },
  {
    title: "Mixed kits for your group",
    text: "Combine products into kits, like a Yatra Kit for every pilgrim or a welcome kit for every guest.",
  },
  {
    title: "GST invoices",
    text: "Every business order comes with a proper GST invoice for your accounts.",
  },
  {
    title: "Every order gives back",
    text: "A portion of every Ovy order supports safe period products for girls and women who can't afford them.",
  },
];

const ORG_TYPES = [
  "Office / company",
  "Travel, tour or yatra group",
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
  "Yatra Kits / custom kits",
];

const FAQS = [
  {
    q: "What quantities do you supply?",
    a: "From a first order for one office to supplies for large groups and programmes. Share your rough quantity and we will suggest the right packs and a quote for it.",
  },
  {
    q: "How quickly will you reply?",
    a: "Within one working day, Monday to Saturday. For anything urgent, WhatsApp us on +91 63758 81514.",
  },
  {
    q: "Can you make a kit for our group?",
    a: "Yes. We can put together kits from our range, for example a Yatra Kit for every traveller or a period-care kit for every student. Tell us what you have in mind.",
  },
  {
    q: "Do you provide GST invoices?",
    a: "Yes. Every business order comes with a GST invoice. Share your GSTIN and billing name with your enquiry or when you confirm the order.",
  },
  {
    q: "Do you deliver outside Jaipur?",
    a: "Yes, we deliver across India, and every order is tracked. We confirm the delivery timeline with your quote.",
  },
  {
    q: "Can we order regular refills for our washrooms?",
    a: "Yes. Tell us how often you need refills and we will set up a schedule that suits you.",
  },
  {
    q: "Who do I contact?",
    a: "Email info@potenthygiene.com, WhatsApp +91 63758 81514, or use the form on this page.",
  },
];

const inputClass =
  "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/20 focus:outline-none";

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

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (item: string) =>
    setInterests((list) =>
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.organisation.trim() || !form.email.trim() || !form.orgType) {
      toast.error("Please fill in your name, organisation, email and type of organisation.");
      return;
    }
    const phone = form.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (phone && phone.length !== 10) {
      toast.error("Please enter a 10-digit mobile number.");
      return;
    }

    const message = [
      "B2B ENQUIRY",
      `Organisation: ${form.organisation.trim()}`,
      `Type: ${form.orgType}`,
      form.city.trim() && `City: ${form.city.trim()}`,
      form.gstin.trim() && `GSTIN: ${form.gstin.trim().toUpperCase()}`,
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
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F4F6]">
          <Check className="h-7 w-7 text-[#016271]" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900">Thank you, we have your enquiry</h3>
        <p className="mt-2 max-w-sm text-sm text-gray-600">
          Our team will reply within one working day. For anything urgent, WhatsApp us on +91
          63758 81514.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      noValidate
    >
      <h3 className="text-xl font-bold text-gray-900">Get a quote</h3>
      <p className="mt-1 text-sm text-gray-500">We reply within one working day.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-name" className="mb-1 block text-sm font-medium text-gray-700">
            Your name *
          </label>
          <input id="b2b-name" autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-org" className="mb-1 block text-sm font-medium text-gray-700">
            Organisation *
          </label>
          <input id="b2b-org" autoComplete="organization" value={form.organisation} onChange={set("organisation")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-email" className="mb-1 block text-sm font-medium text-gray-700">
            Work email *
          </label>
          <input id="b2b-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="b2b-phone" className="mb-1 block text-sm font-medium text-gray-700">
            Mobile number
          </label>
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
          <label htmlFor="b2b-type" className="mb-1 block text-sm font-medium text-gray-700">
            Type of organisation *
          </label>
          <select id="b2b-type" value={form.orgType} onChange={set("orgType")} className={inputClass}>
            <option value="">Choose one</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="b2b-city" className="mb-1 block text-sm font-medium text-gray-700">
            City
          </label>
          <input id="b2b-city" autoComplete="address-level2" value={form.city} onChange={set("city")} className={inputClass} />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-gray-700">What are you interested in?</legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => {
            const on = interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={on}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  on
                    ? "border-[#016271] bg-[#016271] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#016271]/50"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="b2b-gstin" className="mb-1 block text-sm font-medium text-gray-700">
            GSTIN (optional, for your GST invoice)
          </label>
          <input
            id="b2b-gstin"
            maxLength={15}
            autoCapitalize="characters"
            placeholder="15-character GST number"
            value={form.gstin}
            onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "") }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="b2b-qty" className="mb-1 block text-sm font-medium text-gray-700">
            Approximate quantity or number of people
          </label>
          <input
            id="b2b-qty"
            placeholder="For example: 200 employees, 50 pilgrims, monthly refills"
            value={form.quantity}
            onChange={set("quantity")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="b2b-msg" className="mb-1 block text-sm font-medium text-gray-700">
            Anything else we should know?
          </label>
          <textarea
            id="b2b-msg"
            rows={3}
            value={form.message}
            onChange={set("message")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 focus:border-[#016271] focus:ring-2 focus:ring-[#016271]/20 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#016271] px-8 text-base font-semibold text-white transition-colors hover:bg-[#075965] disabled:opacity-60"
      >
        {sending ? "Sending…" : "Request a quote"} {!sending && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        We use your details only to reply to this enquiry.
      </p>
    </form>
  );
}

export default function BusinessPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="w-full bg-white">
      {/* HERO */}
      <section className="bg-[#E6F4F6]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#016271] uppercase">
              Potent for Business
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-tight font-bold text-gray-900 sm:text-5xl">
              Hygiene your people will actually thank you for.
            </h1>
            <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
              Organic period care and travel hygiene for offices, travel groups, hotels, schools,
              hospitals, events and CSR programmes. One Indian brand, one order, delivered
              anywhere in India.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#016271] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#075965] sm:text-base"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#016271]/40 bg-white px-7 text-sm font-semibold text-[#016271] transition-colors hover:bg-[#016271]/5 sm:text-base"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp our team
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700">
              {["Reply within one working day", "GST invoice with every order", "Mixed kits for groups", "Tracked delivery across India"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-[#016271]" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {["/product-images/pads.jpg", "/product-images/seatcovers.jpg", "/product-images/teen-pro.jpg", "/product-images/pukebags.jpg"].map(
              (src, i) => (
                <div
                  key={src}
                  className={`relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ${i % 2 ? "mt-6" : ""}`}
                >
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 280px, 45vw" className="object-cover" priority={i < 2} />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Who we work with</h2>
        <p className="mt-2 max-w-2xl text-gray-600">
          Every organisation has a different hygiene problem. Here is how we help each one.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map(({ icon: Icon, title, need, products }) => (
            <div key={title} className="flex flex-col rounded-2xl border border-gray-200 p-5 transition-shadow hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F4F6]">
                <Icon className="h-5 w-5 text-[#016271]" />
              </div>
              <h3 className="mt-4 font-bold text-gray-900">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-gray-600">{need}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {products.map((p) => (
                  <span key={p} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RANGE */}
      <section className="bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">What you can order</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Order any of our products in bulk, or mix them into kits for your group.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {RANGE.map((group) => (
              <div key={group.brand} className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-gray-900">{group.brand}</h3>
                  <Link href={group.href} className="text-sm font-semibold text-[#016271] hover:underline">
                    See the range →
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <div key={item.name} className="overflow-hidden rounded-2xl border border-gray-100">
                      <div className="relative aspect-[4/3] bg-gray-50">
                        <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
                      </div>
                      <p className="p-3 text-sm font-medium text-gray-800">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">How it works</h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-gray-200 p-5">
              <span className="text-xs font-bold text-[#016271]">Step {i + 1}</span>
              <Icon className="mt-3 h-6 w-6 text-[#016271]" />
              <h3 className="mt-3 font-bold text-gray-900">{title}</h3>
              <p className="mt-1.5 text-sm text-gray-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHY POTENT */}
      <section className="bg-[#075965] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">Why organisations choose Potent</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-2xl bg-white/10 p-5">
                <h3 className="flex items-center gap-2 font-bold">
                  <Check className="h-4 w-4 shrink-0" /> {r.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/80">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE FORM */}
      <section id="quote" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Let's talk about your order</h2>
            <p className="mt-3 text-gray-600">
              Tell us a little about your organisation and what you need. A person from our team
              will reply with product suggestions and a quote within one working day.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="mailto:info@potenthygiene.com" className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 hover:border-[#016271]/40">
                <Mail className="h-5 w-5 text-[#016271]" />
                <span>
                  <span className="block font-semibold text-gray-900">Email</span>
                  info@potenthygiene.com
                </span>
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 hover:border-[#016271]/40">
                <MessageCircle className="h-5 w-5 text-[#016271]" />
                <span>
                  <span className="block font-semibold text-gray-900">WhatsApp</span>
                  +91 63758 81514 · Mon to Sat, 10 am to 7 pm
                </span>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
                <MapPin className="h-5 w-5 text-[#016271]" />
                <span>
                  <span className="block font-semibold text-gray-900">Made in India</span>
                  A woman-founded brand from Jaipur
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Questions from businesses</h2>
        <div className="mt-6 rounded-2xl border border-gray-200 px-4 sm:px-6">
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b border-gray-100 last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-semibold text-gray-900"
              >
                {f.q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-[#016271] transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="pb-5 text-sm leading-relaxed text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
