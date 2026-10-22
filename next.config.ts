import type { NextConfig } from "next";

// Old addresses (from the earlier Shopify store, and common guesses) that
// should land on the matching page instead of a 404.
const OLD_ADDRESS_REDIRECTS = [
  { source: "/register", destination: "/signup" },
  { source: "/forgot-password", destination: "/reset-password-email" },
  { source: "/account/login", destination: "/login" },
  { source: "/account/register", destination: "/signup" },
  { source: "/pages/contact", destination: "/contact" },
  { source: "/pages/contact-us", destination: "/contact" },
  { source: "/pages/about", destination: "/about" },
  { source: "/pages/about-us", destination: "/about" },
  { source: "/pages/faq", destination: "/faq" },
  { source: "/pages/faqs", destination: "/faq" },
  { source: "/pages/:path*", destination: "/" },
  { source: "/policies/refund-policy", destination: "/refund-policy" },
  { source: "/policies/shipping-policy", destination: "/shipping-policy" },
  { source: "/policies/privacy-policy", destination: "/privacy-policy" },
  { source: "/policies/terms-of-service", destination: "/terms-condition" },
  { source: "/policies/:path*", destination: "/" },
  { source: "/collections/:path*", destination: "/shop" },
  { source: "/products/:path*", destination: "/shop" },
  { source: "/blogs/:path*", destination: "/blog" },
];

const nextConfig: NextConfig = {
  compress: true,
  async redirects() {
    return OLD_ADDRESS_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "potent-hygiene.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dw0n4qiceose7.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
