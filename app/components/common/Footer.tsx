"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Facebook,
  HelpCircle,
  Instagram,
  Mail,
  MessageCircle,
  Package,
  Phone,
} from "lucide-react";

type FooterSection = {
  title: string;
  links: { name: string; href: string }[];
};

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "SHOP",
    links: [
      { name: "All products", href: "/shop" },
      { name: "Ovy period care", href: "/ovy" },
      { name: "Looway travel hygiene", href: "/looway" },
      { name: "Teen kits", href: "/product-detail/ovy-teen" },
      { name: "Build a Yatra Kit", href: "/looway-yatra-kit" },
      { name: "Bulk & corporate orders", href: "/business" },
    ],
  },
  {
    title: "LEARN",
    links: [
      { name: "Journal", href: "/blog" },
      { name: "Period Tracker", href: "/period-log" },
      { name: "Find what I need", href: "/quiz" },
      { name: "About us", href: "/about" },
    ],
  },
  {
    title: "HELP",
    links: [
      { name: "FAQs", href: "/faq" },
      { name: "Contact us", href: "/contact" },
      { name: "Shipping policy", href: "/shipping-policy" },
      { name: "Refund policy", href: "/refund-policy" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { name: "Privacy policy", href: "/privacy-policy" },
      { name: "Terms and conditions", href: "/terms-condition" },
    ],
  },
];

// Phones get their own grouping: every desktop link is here, plus orders,
// tracking and rewards, in sections that open with one tap.
const MOBILE_SECTIONS: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { name: "All products", href: "/shop" },
      { name: "Ovy period care", href: "/ovy" },
      { name: "Looway travel hygiene", href: "/looway" },
      { name: "Teen kits", href: "/product-detail/ovy-teen" },
      { name: "Build a Yatra Kit", href: "/looway-yatra-kit" },
    ],
  },
  {
    title: "Learn",
    links: [
      { name: "Journal", href: "/blog" },
      { name: "Period Tracker", href: "/period-log" },
      { name: "Find what I need", href: "/quiz" },
      { name: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Help and orders",
    links: [
      { name: "My orders", href: "/dashboard/orders" },
      { name: "Track an order", href: "/faq#track-order" },
      { name: "Contact us", href: "/contact" },
      { name: "Shipping policy", href: "/shipping-policy" },
      { name: "Refund policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Company and business",
    links: [
      { name: "About us", href: "/about" },
      { name: "Bulk & corporate orders", href: "/business" },
      { name: "Rewards and referral", href: "/dashboard/referral" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy policy", href: "/privacy-policy" },
      { name: "Terms and conditions", href: "/terms-condition" },
    ],
  },
];

// The four pages people look for most, always visible on phones.
const QUICK_LINKS = [
  { name: "My orders", href: "/dashboard/orders", icon: Package },
  { name: "Contact us", href: "/contact", icon: MessageCircle },
  { name: "Bulk & corporate", href: "/business", icon: Building2 },
  { name: "FAQs", href: "/faq", icon: HelpCircle },
];

const CONTACTS = [
  {
    label: "Email",
    value: "care@potenthygiene.com",
    href: "mailto:care@potenthygiene.com",
    icon: Mail,
  },
  {
    label: "Call",
    value: "+91 63758 81514",
    href: "tel:+916375881514",
    icon: Phone,
  },
  {
    label: "WhatsApp",
    value: "Chat with us on WhatsApp",
    href: "https://wa.me/916375881514",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Bulk & corporate orders",
    value: "info@potenthygiene.com",
    href: "mailto:info@potenthygiene.com",
    icon: Building2,
  },
  {
    label: "Work with us",
    value: "careers@potenthygiene.com",
    href: "mailto:careers@potenthygiene.com",
    icon: BriefcaseBusiness,
  },
];

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/potenthygiene/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/potenthygiene",
    icon: Facebook,
  },
];

const MARKETPLACES = [
  {
    name: "Amazon",
    href: "https://www.amazon.in/stores/PotentHygiene/page/18678868-B6F1-4388-A566-62231A1FE8D5",
  },
  { name: "Myntra", href: "https://www.myntra.com/potent-hygiene" },
];

const PAYMENT_METHODS = [
  "UPI",
  "Visa",
  "Mastercard",
  "RuPay",
  "Net banking",
  "Razorpay",
];

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <footer className="w-full bg-[#075965] text-white">
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-40 sm:px-8 sm:pt-16 md:pb-12 lg:px-16">
        {/* TOP MAIN GRID */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-6 lg:grid-cols-12 lg:gap-10">
          {/* BRAND & CONTACT COLUMN */}
          <div className="space-y-4 md:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-white.png"
                alt="Potent Hygiene"
                width={160}
                height={55}
                className="h-9 w-auto object-contain sm:h-11"
              />
            </Link>

            <p className="max-w-sm text-xs leading-relaxed font-normal text-white/80 sm:text-sm">
              India&apos;s first scenario-based hygiene brand. Made in Jaipur,
              built for Indian bodies, Indian toilets and Indian journeys.
            </p>

            {/* Contact lines (desktop; phones get the contact card below) */}
            <div className="hidden space-y-1.5 pt-2 text-xs text-white/85 sm:text-sm md:block">
              <a
                href="mailto:care@potenthygiene.com"
                className="block transition-colors hover:text-white"
              >
                care@potenthygiene.com
              </a>

              <a
                href="tel:+916375881514"
                className="block transition-colors hover:text-white"
              >
                +91 63758 81514
              </a>

              <a
                href="https://wa.me/916375881514"
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:text-white"
              >
                WhatsApp us
              </a>
            </div>

            <div className="hidden space-y-1.5 pt-1 text-xs text-white/70 sm:text-sm md:block">
              <p>
                <Link
                  href="/business"
                  className="text-white/85 underline-offset-2 transition-colors hover:text-white hover:underline"
                >
                  Business &amp; bulk orders
                </Link>
                :{" "}
                <a
                  href="mailto:info@potenthygiene.com"
                  className="text-white/85 transition-colors hover:text-white"
                >
                  info@potenthygiene.com
                </a>
              </p>
              <p>
                Work with us:{" "}
                <a
                  href="mailto:careers@potenthygiene.com"
                  className="text-white/85 transition-colors hover:text-white"
                >
                  careers@potenthygiene.com
                </a>
              </p>
            </div>

            <div className="hidden flex-wrap items-center gap-2 pt-2 text-xs text-white/80 sm:text-sm md:flex">
              <span>Also on</span>
              {MARKETPLACES.map((store) => (
                <a
                  key={store.name}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Shop Potent Hygiene on ${store.name}`}
                  className="rounded-full border border-white/25 px-3 py-1 font-medium text-white transition-colors hover:bg-white hover:text-[#075965]"
                >
                  {store.name}
                </a>
              ))}
            </div>
          </div>

          {/* DESKTOP COLUMNS (Hidden on Mobile) */}
          <div className="hidden grid-cols-4 gap-6 md:col-span-4 md:grid lg:col-span-8 lg:gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xs font-bold tracking-wider text-white uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2.5 text-xs text-white/80 sm:text-sm">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* PHONES (< md): quick links, grouped sections, contact, marketplaces, social */}
          <div className="block space-y-8 md:hidden">
            {/* Quick links */}
            <nav aria-label="Quick links" className="grid grid-cols-2 gap-2.5">
              {QUICK_LINKS.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className="flex min-h-14 items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-3 text-sm font-semibold text-white transition-colors active:bg-white/20"
                >
                  <Icon className="h-5 w-5 shrink-0 text-white/85" aria-hidden />
                  <span className="leading-tight">{name}</span>
                </Link>
              ))}
            </nav>

            {/* Grouped sections, one tap to open */}
            <div className="border-t border-white/15">
              {MOBILE_SECTIONS.map((section) => {
                const isOpen = !!openSections[section.title];
                const panelId = `footer-${section.title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
                return (
                  <div key={section.title} className="border-b border-white/15">
                    <h3>
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 py-3 text-left text-[15px] font-semibold text-white"
                      >
                        <span>{section.title}</span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-white/80 transition-transform duration-300 motion-reduce:transition-none ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </button>
                    </h3>

                    {isOpen && (
                      <ul id={panelId} className="animate-fadeIn pb-3">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="flex min-h-11 items-center justify-between gap-3 py-2 pl-1 text-[15px] text-white/85 transition-colors active:text-white"
                            >
                              <span>{link.name}</span>
                              <ChevronRight
                                className="h-4 w-4 shrink-0 text-white/40"
                                aria-hidden
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact card */}
            <section
              aria-labelledby="footer-contact-title"
              className="rounded-2xl bg-white/10 p-4"
            >
              <h3
                id="footer-contact-title"
                className="text-[15px] font-semibold text-white"
              >
                Talk to us
              </h3>
              <ul className="mt-2 divide-y divide-white/10">
                {CONTACTS.map(({ label, value, href, icon: Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex min-h-14 items-center gap-3 py-2.5 text-white transition-colors active:text-white/80"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold tracking-wider text-white/60 uppercase">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-medium">
                          {value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            {/* Also on */}
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-white/60 uppercase">
                Also on
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {MARKETPLACES.map((store) => (
                  <a
                    key={store.name}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Shop Potent Hygiene on ${store.name}`}
                    className="flex min-h-11 items-center rounded-full border border-white/30 px-5 text-sm font-semibold text-white transition-colors active:bg-white active:text-[#075965]"
                  >
                    {store.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-white/60 uppercase">
                Follow us
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {SOCIALS.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors active:bg-white/20"
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 sm:mt-14 sm:gap-6 md:flex-row md:items-center">
          {/* Copyright */}
          <p className="text-xs text-white/70">
            © 2026 Potent Hygiene. All rights reserved.
          </p>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 shadow-2xs backdrop-blur-xs sm:text-xs"
              >
                {method}
              </span>
            ))}
          </div>

          {/* Social Links (desktop; phones show them above) */}
          <div className="hidden items-center gap-5 text-xs text-white/80 md:flex">
            <a
              href="https://www.instagram.com/potenthygiene/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/potenthygiene"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
