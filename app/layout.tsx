import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Caveat, Fredoka } from "next/font/google";
import "./globals.css";
import { AppToaster } from "./components/common/AppToaster";
import { CatalogProvider } from "./components/common/CatalogProvider";
import { ChatBotWidget } from "./components/common/ChatBotWidget";
import { WhatsAppWidget } from "./components/common/homepage/WhatsAppWidget";
import Script from "next/script";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  pageMetadata,
} from "@/const/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  weight: "600",
  subsets: ["latin"],
});

// Site-wide defaults. Each public page sets its own title, description and
// canonical address (see const/seo.ts); no canonical is set here, so pages
// without their own never point at the homepage.
const homeSeo = pageMetadata("home");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Potent Hygiene | Organic Period Care & Travel Hygiene, Made in India",
    template: "%s | Potent Hygiene",
  },
  description: homeSeo.description,
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: "care@potenthygiene.com",
      telephone: "+91-63758-81514",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      brand: [
        { "@type": "Brand", name: "Ovy" },
        { "@type": "Brand", name: "Looway" },
      ],
      sameAs: SOCIAL_LINKS,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "care@potenthygiene.com",
          telephone: "+91-63758-81514",
          areaServed: "IN",
          availableLanguage: ["en", "hi"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

const GA_ID = "G-MWCBRB55D3";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${fredoka.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        <CatalogProvider>{children}</CatalogProvider>
        <AppToaster />
        <ChatBotWidget />
        <WhatsAppWidget />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
