export const siteConfig = {
  name: "TableTrail",
  description: "Discover and list standout restaurants across every neighborhood.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  navigation: [
    { label: "Explore", href: "#explore" },
    { label: "Features", href: "#features" },
    { label: "Reviews", href: "#reviews" },
    { label: "Pricing", href: "#pricing" },
  ],
  footerLinks: [
    { label: "Restaurants", href: "#explore" },
    { label: "List your venue", href: "#pricing" },
    { label: "Owner / admin access", href: "/login" },
    { label: "Register a restaurant", href: "/register" },
  ],
  highlights: [
    "Curated restaurant listings",
    "Verified reviews and ratings",
    "Neighborhood-first discovery",
  ],
} as const;
