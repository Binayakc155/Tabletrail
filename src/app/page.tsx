import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, ChevronRight, MapPin, Search, Star, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RestaurantGrid } from "@/features/restaurants/components/restaurant-grid";
import type { RestaurantSummary } from "@/features/restaurants/types";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const approvedWhere = { status: "approved" as const };
  const [approvedRestaurants, restaurantCount, rating, reviewCount, cuisineGroups, cityGroups] = await Promise.all([
    prisma.restaurant.findMany({
      where: approvedWhere,
      include: { images: { orderBy: [{ isCover: "desc" }, { createdAt: "asc" }] } },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }, { updatedAt: "desc" }],
      take: 4,
    }),
    prisma.restaurant.count({ where: approvedWhere }),
    prisma.restaurant.aggregate({ where: { ...approvedWhere, reviewCount: { gt: 0 } }, _avg: { rating: true } }),
    prisma.review.count({ where: { status: "approved", restaurant: approvedWhere } }),
    prisma.restaurant.groupBy({
      by: ["cuisine"],
      where: { ...approvedWhere, cuisine: { not: "" } },
      _count: { _all: true },
      orderBy: { _count: { cuisine: "desc" } },
      take: 8,
    }),
    prisma.restaurant.groupBy({
      by: ["city"],
      where: { ...approvedWhere, city: { not: "" } },
      _count: { _all: true },
      orderBy: { _count: { city: "desc" } },
    }),
  ]);

  const featuredRestaurants: RestaurantSummary[] = approvedRestaurants.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    cuisine: restaurant.cuisine,
    city: restaurant.city,
    rating: restaurant.rating,
    reviewCount: restaurant.reviewCount,
    description: restaurant.description,
    imageUrl: restaurant.imageUrl,
    address: restaurant.address,
    openingHours: restaurant.openingHours,
  }));
  const cuisines = cuisineGroups.map((cuisine) => ({ name: cuisine.cuisine, count: cuisine._count._all }));
  const locations = cityGroups.slice(0, 3).map((city) => ({ name: city.city, count: city._count._all }));
  const popularSearches = cuisines.slice(0, 6).map((cuisine) => cuisine.name);
  const stats = [
    { value: restaurantCount.toLocaleString(), label: "Verified restaurants" },
    { value: rating._avg.rating ? `${rating._avg.rating.toFixed(1)}/5` : "-", label: "Average rating" },
    { value: cityGroups.length.toLocaleString(), label: "Cities covered" },
    { value: reviewCount.toLocaleString(), label: "Published reviews" },
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute left-[-10rem] top-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="max-w-4xl space-y-7">
          <Badge variant="secondary" className="w-fit rounded-full border border-primary/10 bg-primary/10 px-3 py-1.5 font-semibold text-primary"><UtensilsCrossed className="mr-1.5 h-3.5 w-3.5" />Made for memorable meals</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-[40px] font-semibold leading-tight tracking-tight text-foreground">Find your next <span className="text-primary">favorite</span> place to eat.</h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Discover restaurants, cafes, and local food spots that turn an ordinary outing into a great story.</p>
          </div>
          <form action="/restaurants" className="rounded-xl border border-border bg-card p-2 shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)] sm:flex sm:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 sm:border-r sm:border-border"><Search className="h-5 w-5 shrink-0 text-primary" /><Input name="q" className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder="Restaurant, food, or dish" /></label>
            <Button type="submit" className="mt-2 h-12 w-full px-6 sm:mt-0 sm:w-auto">Search</Button>
          </form>
          {popularSearches.length ? <div className="flex flex-wrap items-center gap-2 text-sm"><span className="mr-1 text-muted-foreground">Popular:</span>{popularSearches.map((term) => <Link key={term} href={{ pathname: "/restaurants", query: { q: term } }} className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary">{term}</Link>)}</div> : null}
        </div>
      </section>

      <section className="border-y border-border bg-surface-alt"><div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-y divide-border px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">{stats.map((stat) => <div key={stat.label} className="px-4 py-6 text-center sm:px-8"><p className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p><p className="mt-2 text-sm text-muted-foreground">{stat.label}</p></div>)}</div></section>

      <section id="cuisines" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><SectionHeader eyebrow="Explore by food" title="Follow your cravings." copy="Browse the food currently available from local restaurants." action="Browse all food" />{cuisines.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">{cuisines.map((cuisine) => <Link key={cuisine.name} href={{ pathname: "/restaurants", query: { cuisine: cuisine.name } }} className="group rounded-xl border border-border bg-card p-4 text-center shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)] transition hover:-translate-y-1 hover:border-primary/25"><UtensilsCrossed className="mx-auto h-6 w-6 text-primary" /><p className="mt-5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{cuisine.name}</p><p className="mt-1 text-sm text-muted-foreground">{cuisine.count} {cuisine.count === 1 ? "restaurant" : "restaurants"}</p></Link>)}</div> : <EmptyState>Food categories will appear when restaurants are published.</EmptyState>}</section>

      <section id="explore" className="bg-surface-alt py-16 lg:py-24"><div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"><SectionHeader eyebrow="Featured restaurants" title="Places diners keep coming back to." copy="Current restaurant listings, selected from the platform." action="View all restaurants" />{featuredRestaurants.length ? <RestaurantGrid restaurants={featuredRestaurants} /> : <EmptyState>New restaurant recommendations are arriving soon.</EmptyState>}</div></section>

      <section id="locations" className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-24"><div className="space-y-4"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Explore nearby</p><h2 className="text-[28px] font-semibold tracking-tight">Good food is closer than you think.</h2><p className="max-w-md text-base leading-7 text-muted-foreground">Start with a neighborhood, then let great food lead the way.</p><Button asChild><Link href="/restaurants">Explore locations <ArrowRight className="h-4 w-4" /></Link></Button></div>{locations.length ? <div className="grid gap-4 sm:grid-cols-3">{locations.map((place) => <Link href={{ pathname: "/restaurants", query: { q: place.name } }} key={place.name} className="group rounded-xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)] transition hover:-translate-y-1 hover:border-primary/25"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div><p className="mt-8 text-lg font-semibold">{place.name}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{place.count} {place.count === 1 ? "restaurant" : "restaurants"} to explore</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span></Link>)}</div> : <EmptyState>Locations will appear when restaurants are published.</EmptyState>}</section>

      <section id="reviews" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="overflow-hidden rounded-xl border border-border bg-surface-alt px-6 py-8 text-foreground shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)] lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-12 lg:py-12"><div><Badge className="border border-primary/15 bg-primary/10 text-primary hover:bg-primary/10">Diner favorites</Badge><h2 className="mt-5 max-w-md text-[28px] font-semibold tracking-tight">Choose with confidence, then make it yours.</h2><p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">Clear details, authentic feedback, and a collection made for every kind of appetite.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-3 lg:mt-0">{[{ icon: BadgeCheck, title: "Verified places", text: "Restaurants with complete details." }, { icon: Star, title: "Real ratings", text: "Diner feedback at a glance." }, { icon: UtensilsCrossed, title: "For every mood", text: "From quick bites to celebrations." }].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border border-border bg-surface p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-6 text-lg font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div></div></section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action: string }) {
  return <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-xl space-y-3"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p><h2 className="text-[28px] font-semibold tracking-tight">{title}</h2><p className="text-base leading-7 text-muted-foreground">{copy}</p></div><Button asChild variant="outline" className="w-fit"><Link href="/restaurants">{action} <ArrowRight className="h-4 w-4" /></Link></Button></div>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{children}</p>;
}
