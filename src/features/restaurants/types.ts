export type RestaurantSummary = {
  name: string;
  slug: string;
  cuisine: string;
  city: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  description: string;
  imageUrl: string;
  highlights: string[];
};
