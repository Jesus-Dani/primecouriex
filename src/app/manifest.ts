import type { MetadataRoute } from "next";

// Installable-only PWA (client request): manifest + icons + standalone
// display for a home-screen/app-like feel. Deliberately no offline caching
// of pages — pricing and booking-status pages are force-dynamic by design
// (see README's Supabase/pricing architecture notes) because they must
// always reflect the live database, so a caching service worker would
// risk showing a customer a stale price or an out-of-date booking status.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prime Couriex Express Ltd",
    short_name: "Prime Couriex",
    description:
      "Process serving, registry liaison, corporate courier, and same-day document delivery across the Federal Capital Territory, Abuja.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#12234c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
