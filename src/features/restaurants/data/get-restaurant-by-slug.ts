import { featuredRestaurants } from "@/features/restaurants/data/mock-restaurants";

export function getRestaurantBySlug(slug: string) {
  return featuredRestaurants.find((restaurant) => restaurant.slug === slug);
}
