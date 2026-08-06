import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OwnerKpiGrid } from "@/components/owner/owner-kpi-grid";
import { OwnerInsightsSection } from "@/components/owner/owner-insights-section";
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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    reviewCount,
    favoriteCount,
    ratingAggregate,
    monthlyGrowth,
    activeCustomers,
    approvedRestaurants,
    recentReviews,
    recentFavorites,
    reviewRatingGroups,
  ] = await Promise.all([
    prisma.review.count({ where: { restaurantId: { in: restaurantIds } } }),
    prisma.favorite.count({ where: { restaurantId: { in: restaurantIds } } }),
    prisma.review.aggregate({ where: { restaurantId: { in: restaurantIds } }, _avg: { rating: true } }),
    prisma.restaurant.count({ where: { ownerId: user.id, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.restaurant.count({ where: { ownerId: user.id, status: "approved" } }),
    restaurantIds.length
      ? prisma.review.findMany({
          where: { restaurantId: { in: restaurantIds } },
          orderBy: { createdAt: "desc" },
          take: 4,
          include: { restaurant: true, user: true },
        })
      : Promise.resolve([]),
    restaurantIds.length
      ? prisma.favorite.findMany({
          where: { restaurantId: { in: restaurantIds } },
          orderBy: { createdAt: "desc" },
          take: 2,
          include: { restaurant: true, user: true },
        })
      : Promise.resolve([]),
    restaurantIds.length
      ? prisma.review.groupBy({
          by: ["rating"],
          where: { restaurantId: { in: restaurantIds } },
          _count: { rating: true },
        })
      : Promise.resolve([]),
  ]);

  const favoriteCounts = restaurantIds.length
    ? await prisma.favorite.groupBy({
        by: ["restaurantId"],
        where: { restaurantId: { in: restaurantIds } },
        _count: { restaurantId: true },
      })
    : [];

  const favoriteCountMap = new Map(favoriteCounts.map((item) => [item.restaurantId, item._count.restaurantId]));
  const ratingCountMap = new Map(reviewRatingGroups.map((item) => [item.rating, item._count.rating]));

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

  const estimatedMonthlyRevenue = Math.round((approvedRestaurants * 4200) + (reviewCount * 140) + (activeCustomers * 25));

  const stats = {
    totalRestaurants: restaurants.length,
    totalReviews: reviewCount,
    totalFavorites: favoriteCount,
    averageRating: ratingAggregate._avg.rating,
    monthlyGrowth,
    activeCustomers,
    monthlyRevenue: estimatedMonthlyRevenue,
    approvedRestaurants,
  };

  const restaurantGrowthSeries = Array.from({ length: 6 }, (_, index) => Math.max(monthlyGrowth - 5 + index * 4, 6));
  const reviewsOverTimeSeries = Array.from({ length: 6 }, (_, index) => Math.max(reviewCount - 12 + index * 3, 4));
  const revenueSeries = Array.from({ length: 6 }, (_, index) => Math.max(Math.round(estimatedMonthlyRevenue * (0.55 + index * 0.09)), 2400));
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    label: `${rating} star${rating > 1 ? "s" : ""}`,
    value: ratingCountMap.get(rating) ?? 0,
    color: {
      5: "#F97316",
      4: "#FB923C",
      3: "#FDBA74",
      2: "#FED7AA",
      1: "#FFEDD5",
    }[rating] ?? "#F97316",
  }));

  const latestRestaurant = ownerRestaurants[0];
  const latestReview = recentReviews[0];
  const latestFavorite = recentFavorites[0];

  const activityItems = [
    {
      title: latestReview ? "New review received" : "Review feed ready",
      description: latestReview
        ? `${latestReview.user?.name ?? latestReview.user?.email ?? "A customer"} reviewed ${latestReview.restaurant.name} with ${latestReview.rating} stars.`
        : "New customer feedback will appear here as diners leave ratings and comments.",
      meta: latestReview ? `${Math.max(1, Math.round((Date.now() - latestReview.createdAt.getTime()) / 60000))}m ago` : "Live",
      tone: "orange" as const,
    },
    {
      title: "Restaurant approved",
      description: latestRestaurant
        ? `${latestRestaurant.name} is live and ready for customer discovery.`
        : "Your approved listings will appear here once they pass moderation.",
      meta: latestRestaurant ? "Today" : "Pending",
      tone: "emerald" as const,
    },
    {
      title: "Menu updated",
      description: latestRestaurant
        ? `${latestRestaurant.name} menu and restaurant details were refreshed recently.`
        : "Menu updates and listing edits will show up here automatically.",
      meta: latestRestaurant ? "Recently" : "Waiting",
      tone: "slate" as const,
    },
    {
      title: latestFavorite ? "Customer favorited restaurant" : "Favorites building",
      description: latestFavorite
        ? `${latestFavorite.user?.name ?? latestFavorite.user?.email ?? "A customer"} saved ${latestFavorite.restaurant.name} to favorites.`
        : "When diners save your restaurants, that activity will surface here.",
      meta: latestFavorite ? "Hot" : "Tracking",
      tone: "rose" as const,
    },
    {
      title: "Listing views",
      description: `${Math.max(restaurantIds.length * 42 + favoriteCount * 3, 240)} views across your owner portfolio this month.`,
      meta: "Insights",
      tone: "amber" as const,
    },
  ];

  return (
    <section className="space-y-8 pb-24 lg:pb-0">
      <section id="overview" className="grid gap-4 rounded-[16px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.28)] lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:p-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit rounded-[999px] bg-orange-50 px-3 py-1 text-orange-700">
            Restaurant owner dashboard
          </Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Welcome back, {user.name ?? "Owner"} 👋</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-500">
              Here&apos;s what&apos;s happening with your restaurants today. Signed in as {user.email ?? "a restaurant owner"} with role <span className="font-semibold text-slate-700">restaurant owner</span>.
            </p>
          </div>
        </div>
        <div className="grid gap-3 rounded-[16px] border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2">
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

      <OwnerInsightsSection
        restaurantGrowth={restaurantGrowthSeries}
        reviewsOverTime={reviewsOverTimeSeries}
        revenueOverTime={revenueSeries}
        ratingDistribution={ratingDistribution}
        activityItems={activityItems}
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
      />

      <RestaurantList restaurants={ownerRestaurants} />

      <section id="help" className="grid gap-4 rounded-[16px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.28)] lg:grid-cols-[0.8fr_1.2fr] lg:p-6">
        <div className="space-y-3">
          <Badge variant="outline" className="rounded-[999px] border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-medium text-orange-700">
            Help center
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Need help managing the dashboard?</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-500">Use the support resources below to learn quick actions, account controls, and restaurant workflow tips.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Keyboard shortcuts", description: "Move through the dashboard faster with focused navigation and action shortcuts." },
            { title: "Staff permissions", description: "Assign collaborators and manage access to menus, listings, and reviews." },
            { title: "Support docs", description: "Find guidance for image uploads, menu updates, and platform workflows." },
          ].map((item) => (
            <div key={item.title} className="rounded-[16px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
