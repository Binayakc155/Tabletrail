export type OwnerRestaurant = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  contactEmail: string | null;
  phoneNumber: string;
  openingHours: string;
  cuisine: string;
  priceLevel: number;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string;
  slug: string;
  status: string;
  rating: number;
  reviewCount: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type OwnerStats = {
  totalRestaurants: number;
  totalReviews: number;
  totalFavorites: number;
  averageRating: number | null;
  monthlyGrowth: number;
  activeCustomers: number;
  monthlyRevenue: number;
  approvedRestaurants: number;
};
