import type { NextConfig } from "next";

// Old addresses (from the earlier Shopify store, and common guesses) that
// should land on the matching page instead of a 404.
const OLD_ADDRESS_REDIRECTS = [
  // The old separate admin sign-in never worked; admins sign in normally.
  { source: "/admin/login", destination: "/login" },
  { source: "/admin/verify-otp", destination: "/login" },
  { source: "/register", destination: "/signup" },
  { source: "/b2b", destination: "/business" },
  { source: "/bulk-orders", destination: "/business" },
  { source: "/corporate", destination: "/business" },
  { source: "/wholesale", destination: "/business" },
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
  // Old Shopify product links only: no dot in the path, so the site's own
  // pictures in public/products (e.g. /products/pads.jpg) are never redirected.
  { source: "/products/:handle([^.]+)", destination: "/shop" },
  { source: "/blogs/:path*", destination: "/blog" },
  // Duplicate product addresses: one canonical page per product.
  { source: "/menstrual-cup", destination: "/product-detail/ovy-cup" },
  { source: "/looway-toilet-seat-covers", destination: "/product-detail/looway-toilet-seat-covers" },
  // Old brand-prefixed product links (/ovy/product-detail/x). The product page
  // resolves older names and answers 404 for unknown products.
  { source: "/:brand/product-detail/:product", destination: "/product-detail/:product" },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return OLD_ADDRESS_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [
      {
        // Standard browser protections for every page.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
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
