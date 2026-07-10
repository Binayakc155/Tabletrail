import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { AnalyticsCards } from "@/components/owner/analytics-cards";
import { DashboardStats } from "@/components/owner/dashboard-stats";
import { RestaurantList } from "@/components/owner/restaurant-list";
import { ensureLocalUser, requireAppUser } from "@/lib/clerk-auth";
import { listOwnerRestaurants } from "@/lib/restaurant-management";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: `Restaurant owner dashboard | ${siteConfig.name}`,
  description: "Restaurant management dashboard for restaurant owners.",
};

export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  const user = await requireAppUser();

  if (user.role === "admin") {
    redirect("/admin");
  }

  if (user.role !== "restaurant_owner") {
    redirect("/customer/dashboard?error=forbidden");
  }

  await ensureLocalUser(user);
  const restaurants = await listOwnerRestaurants(user.id);
  const restaurantIds = restaurants.map((restaurant) => restaurant.id);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [reviewCount, favoriteCount, ratingAggregate, monthlyGrowth] = await Promise.all([
    prisma.review.count({ where: { restaurantId: { in: restaurantIds } } }),
    prisma.favorite.count({ where: { restaurantId: { in: restaurantIds } } }),
    prisma.review.aggregate({ where: { restaurantId: { in: restaurantIds } }, _avg: { rating: true } }),
    prisma.restaurant.count({ where: { ownerId: user.id, createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const ownerRestaurants = restaurants.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    city: restaurant.city,
    contactEmail: restaurant.contactEmail,
    phoneNumber: restaurant.phoneNumber,
    openingHours: restaurant.openingHours,
    cuisine: restaurant.cuisine,
    priceLevel: restaurant.priceLevel,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    imageUrl: restaurant.imageUrl,
    slug: restaurant.slug,
    status: restaurant.status,
    rating: restaurant.rating,
    reviewCount: restaurant.reviewCount,
    createdAt: restaurant.createdAt.toISOString(),
  }));

  const stats = {
    totalRestaurants: restaurants.length,
    totalReviews: reviewCount,
    totalFavorites: favoriteCount,
    averageRating: ratingAggregate._avg.rating,
    monthlyGrowth,
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 pb-24 lg:pb-0">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-950/5 backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit bg-orange-100 text-orange-700">
              Restaurant owner dashboard
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Welcome back, {user.name ?? "Owner"}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
                Signed in as {user.email ?? "a restaurant owner"} with role <span className="font-semibold text-slate-700">restaurant owner</span>.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-lg shadow-slate-950/15">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Restaurant</p>
            <p className="mt-1 text-lg font-semibold">Owner Dashboard</p>
          </div>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <AnalyticsCards stats={stats} />

      <RestaurantList restaurants={ownerRestaurants} />
    </section>
  );
}
