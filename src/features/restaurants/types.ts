export type RestaurantSummary = {
  id?: string;
  name: string;
  slug: string;
  cuisine: string;
  city: string;
  neighborhood?: string;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  address?: string;
  openingHours?: string;
  distanceMiles?: number | null;
  highlights?: string[];
};
