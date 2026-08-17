import type { RestaurantSummary } from "@/features/restaurants/types";

export const featuredRestaurants: RestaurantSummary[] = [
  {
    name: "Saffron Harbor",
    slug: "saffron-harbor",
    cuisine: "Modern Indian",
    city: "San Francisco",
    neighborhood: "North Beach",
    rating: 4.9,
    reviewCount: 248,
    description: "Seasonal tasting menus with a focus on coastal spices, shared plates, and a polished late-night bar.",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Chef’s counter", "Wine pairing", "Open late"],
  },
  {
    name: "Juniper & Salt",
    slug: "juniper-and-salt",
    cuisine: "New American",
    city: "Chicago",
    neighborhood: "West Loop",
    rating: 4.8,
    reviewCount: 191,
    description: "A neighborhood favorite for wood-fired vegetables, natural wines, and a fast, attentive lunch service.",
    imageUrl:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Weekend brunch", "Private dining", "Local sourcing"],
  },
  {
    name: "La Marée Social",
    slug: "la-maree-social",
    cuisine: "Mediterranean",
    city: "Miami",
    neighborhood: "Wynwood",
    rating: 4.7,
    reviewCount: 163,
    description: "Seafood-forward plates, a glowing lounge, and terrace seating designed for sunset bookings.",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Terrace seating", "Cocktail bar", "Private events"],
  },
  {
    name: "Nori District",
    slug: "nori-district",
    cuisine: "Japanese Fusion",
    city: "Seattle",
    neighborhood: "Capitol Hill",
    rating: 4.8,
    reviewCount: 214,
    description: "An intimate, design-led room for omakase, sake flights, and curated editorial restaurant profiles.",
    imageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Omakase", "Sake flights", "Small plates"],
  },
];
