import type { MetadataRoute } from "next";

// Web app manifest: the name and Potent "P" icon a phone shows when the site
// is added to the home screen. The icons are app/icon.png (512) and
// app/apple-icon.png (180), served by Next at the paths below.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Potent Hygiene",
    short_name: "Potent",
    description:
      "Ovy period care and Looway travel hygiene, made in India.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#075965",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
