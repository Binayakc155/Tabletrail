import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { OwnerKpiGrid } from "@/components/owner/owner-kpi-grid";
import { OwnerQuickActions } from "@/components/owner/owner-quick-actions";
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
  const now = new Date();

  if (user.role === "admin") {
    redirect("/admin");
  }

  if (user.role !== "restaurant_owner") {
    redirect("/customer/dashboard?error=forbidden");
  }

  await ensureLocalUser(user);
  const restaurants = await listOwnerRestaurants(user.id);
  const restaurantIds = restaurants.map((restaurant) => restaurant.id);
  const [
    reviewCount,
    favoriteCount,
    ratingAggregate,
    approvedRestaurants,
    recentReviews,
    viewAggregate,
  ] = await Promise.all([
    prisma.review.count({ where: { restaurantId: { in: restaurantIds } } }),
    prisma.favorite.count({ where: { restaurantId: { in: restaurantIds } } }),
    prisma.review.aggregate({ where: { restaurantId: { in: restaurantIds } }, _avg: { rating: true } }),
    prisma.restaurant.count({ where: { ownerId: user.id, status: "approved" } }),
    restaurantIds.length
      ? prisma.review.findMany({
          where: { restaurantId: { in: restaurantIds } },
          orderBy: { createdAt: "desc" },
          take: 4,
          include: { restaurant: true, user: true },
        })
      : Promise.resolve([]),
    prisma.restaurant.aggregate({ where: { id: { in: restaurantIds } }, _sum: { viewCount: true } }),
  ]);

  const favoriteCounts = restaurantIds.length
    ? await prisma.favorite.groupBy({
        by: ["restaurantId"],
        where: { restaurantId: { in: restaurantIds } },
        _count: { restaurantId: true },
      })
    : [];

  const favoriteCountMap = new Map(favoriteCounts.map((item) => [item.restaurantId, item._count.restaurantId]));

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
    favoritesCount: favoriteCountMap.get(restaurant.id) ?? 0,
    createdAt: restaurant.createdAt.toISOString(),
    updatedAt: restaurant.updatedAt.toISOString(),
  }));

  const stats = {
    totalRestaurants: restaurants.length,
    totalReviews: reviewCount,
    totalFavorites: favoriteCount,
    averageRating: ratingAggregate._avg.rating,
    monthlyGrowth: 0,
    activeCustomers: 0,
    monthlyRevenue: 0,
    approvedRestaurants,
    restaurantViews: viewAggregate._sum.viewCount ?? 0,
  };

  return (
    <section className="space-y-6 pb-8 lg:pb-0">
      <section id="overview" className="grid gap-5 rounded-xl border border-[#E5E7EB] bg-white p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit rounded-[999px] bg-orange-50 px-3 py-1 text-orange-700">
            Restaurant owner dashboard
          </Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Welcome back, {user.name ?? "Owner"} 👋</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-500">
              Here&apos;s a quick overview of your restaurant portfolio and customer activity.
            </p>
          </div>
        </div>
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-[#F9FAFB] p-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Today</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(now)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Summary</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{stats.approvedRestaurants} live • {stats.totalReviews} reviews • {stats.totalFavorites} favorites</p>
          </div>
        </div>
      </section>

      <OwnerKpiGrid stats={stats} />

      <OwnerQuickActions />

      <section id="reviews" className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-none">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Customer feedback</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Recent reviews</h2>
          </div>
          <Badge variant="outline" className="rounded-full">{reviewCount} total</Badge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {recentReviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-slate-200 bg-[#F9FAFB] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{review.guestName ?? review.user?.name ?? "Anonymous diner"}</p>
                <span className="text-sm font-semibold text-amber-600">{review.rating}/5</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{review.restaurant.name}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
            </article>
          ))}
          {recentReviews.length === 0 ? <p className="text-sm text-slate-500">No customer reviews yet.</p> : null}
        </div>
      </section>

      <RestaurantList restaurants={ownerRestaurants} />

    </section>
  );
}
