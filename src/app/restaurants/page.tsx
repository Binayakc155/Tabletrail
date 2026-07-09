import type { Metadata } from "next";
import Link from "next/link";

import { RestaurantGrid } from "@/features/restaurants/components/restaurant-grid";
import { listRestaurants, type RestaurantSearchParams } from "@/features/restaurants/data/restaurants";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: `Restaurants | ${siteConfig.name}`,
  description: "Browse curated restaurant profiles with ratings, highlights, and neighborhood context.",
};

export const dynamic = "force-dynamic";

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams?: Promise<RestaurantSearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const { restaurants, cuisines, page, pageCount, total } = await listRestaurants(params);

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

      <form className="mb-8 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))]">
        <Input name="q" placeholder="Search by name, cuisine, or address" defaultValue={params.q ?? ""} />
        <select name="cuisine" defaultValue={params.cuisine ?? ""} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select name="rating" defaultValue={params.rating ?? ""} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
        <select name="price" defaultValue={params.price ?? ""} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">Any price</option>
          {[1, 2, 3, 4].map((price) => (
            <option key={price} value={price}>{"$".repeat(price)}</option>
          ))}
        </select>
        <select name="sort" defaultValue={params.sort ?? "latest"} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="latest">Newest</option>
          <option value="rating">Top rated</option>
          <option value="reviews">Most reviewed</option>
          <option value="price_asc">Price low</option>
          <option value="price_desc">Price high</option>
          <option value="distance">Nearest</option>
          <option value="name">Name</option>
        </select>
        <Button type="submit">Search</Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground md:col-span-2">
          <input type="checkbox" name="openNow" value="true" defaultChecked={params.openNow === "true"} />
          Open now
        </label>
        <Input name="lat" placeholder="Latitude" defaultValue={params.lat ?? ""} />
        <Input name="lng" placeholder="Longitude" defaultValue={params.lng ?? ""} />
        <Input name="distance" placeholder="Miles" defaultValue={params.distance ?? ""} />
      </form>

      <div className="mb-4 text-sm text-muted-foreground">{total} restaurants found</div>
      <RestaurantGrid restaurants={restaurants} />
      <div className="mt-8 flex items-center justify-between">
        <Button asChild variant="outline" disabled={page <= 1}>
          <Link href={{ pathname: "/restaurants", query: { ...params, page: Math.max(page - 1, 1) } }}>Previous</Link>
        </Button>
        <p className="text-sm text-muted-foreground">Page {page} of {pageCount}</p>
        <Button asChild variant="outline" disabled={page >= pageCount}>
          <Link href={{ pathname: "/restaurants", query: { ...params, page: Math.min(page + 1, pageCount) } }}>Next</Link>
        </Button>
      </div>
    </section>
  );
}
