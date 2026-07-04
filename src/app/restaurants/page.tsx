import type { Metadata } from "next";

import { RestaurantGrid } from "@/features/restaurants/components/restaurant-grid";
import { featuredRestaurants } from "@/features/restaurants/data/mock-restaurants";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Restaurants | ${siteConfig.name}`,
  description: "Browse curated restaurant profiles with ratings, highlights, and neighborhood context.",
};

export default function RestaurantsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Browse restaurants</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Curated restaurants, sorted by quality and neighborhood fit.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Explore featured venues with verified ratings, price levels, and concise editorial summaries.
        </p>
      </div>

      <RestaurantGrid restaurants={featuredRestaurants} />
    </section>
  );
}
