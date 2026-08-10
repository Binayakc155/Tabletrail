export const siteConfig = {
  name: "TableTrail",
  description: "Discover and list standout restaurants across every neighborhood.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  navigation: [
    { label: "Explore", href: "#explore" },
    { label: "Cuisines", href: "#cuisines" },
    { label: "Locations", href: "#locations" },
    { label: "Reviews", href: "#reviews" },
    { label: "About", href: "#about" },
  ],
  footerLinks: [
    { label: "Restaurants", href: "#explore" },
    { label: "Explore cuisines", href: "#cuisines" },
    { label: "Sign in", href: "/login" },
    { label: "Register a restaurant", href: "/register" },
  ],
  highlights: [
    "Curated restaurant listings",
    "Verified reviews and ratings",
    "Neighborhood-first discovery",
  ],
} as const;
