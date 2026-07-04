import { RestaurantCard } from "@/features/restaurants/components/restaurant-card";
import type { RestaurantSummary } from "@/features/restaurants/types";

export function RestaurantGrid({ restaurants }: { restaurants: RestaurantSummary[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.slug} restaurant={restaurant} />
      ))}
    </div>
  );
}
