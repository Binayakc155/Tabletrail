import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ShieldCheck, Sparkles, Star, TimerReset, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantGrid } from "@/features/restaurants/components/restaurant-grid";
import type { RestaurantSummary } from "@/features/restaurants/types";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const approvedRestaurants = await prisma.restaurant.findMany({
    where: { status: "approved" },
    include: { images: { orderBy: [{ isCover: "desc" }, { createdAt: "asc" }] } },
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }, { updatedAt: "desc" }],
    take: 4,
  });
  const featuredRestaurants: RestaurantSummary[] = approvedRestaurants.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    cuisine: restaurant.cuisine,
    city: restaurant.city,
    rating: restaurant.rating,
    reviewCount: restaurant.reviewCount,
    priceLevel: restaurant.priceLevel,
    description: restaurant.description,
    imageUrl: restaurant.images[0]?.url ?? restaurant.imageUrl,
    address: restaurant.address,
    openingHours: restaurant.openingHours,
  }));
  const platformStats = [
    { label: "Verified restaurants", value: "1.2k+" },
    { label: "Average rating", value: "4.8/5" },
    { label: "Cities covered", value: "32" },
  ];

  const featureCards = [
    {
      icon: ShieldCheck,
      title: "Trusted listings",
      description: "Keep restaurant data structured, current, and easy to review with Prisma-backed records.",
    },
    {
      icon: Sparkles,
      title: "Curated discovery",
      description: "Highlight the places diners actually want to find with editorial cards and clean filters.",
    },
    {
      icon: TimerReset,
      title: "Fast browsing",
      description: "Built for responsive navigation, fluid sections, and quick scanning on every device.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
            <UtensilsCrossed className="mr-2 h-3.5 w-3.5" />
            Restaurant Listing Platform
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Discover the best places to eat with a platform built for clarity.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              TableTrail combines editorial curation, responsive discovery, and a Prisma-powered content model so diners can scan, compare,
              and book without friction.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#explore">
                Explore restaurants
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/restaurants">Browse all listings</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {platformStats.map((stat) => (
              <Card key={stat.label} className="bg-background/75">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_35%)]" />
          <CardHeader className="relative space-y-3">
            <Badge variant="outline" className="w-fit border-white/15 bg-white/10 text-white">
              Featured preview
            </Badge>
            <CardTitle className="text-2xl text-white">Curated for the way people actually choose restaurants.</CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6 text-white/75">
              A small data model, a clean UI system, and reusable components keep the platform easy to extend as the catalog grows.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {featuredRestaurants.slice(0, 3).map((restaurant) => (
              <div key={restaurant.slug} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-medium text-white">{restaurant.name}</p>
                  <p className="text-sm text-white/70">{restaurant.cuisine} · {restaurant.neighborhood}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/85">
                  <Star className="h-3.5 w-3.5 fill-current text-amber-300" />
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
            ))}
            {featuredRestaurants.length === 0 ? <p className="text-sm text-white/70">Approved restaurants will appear here soon.</p> : null}
          </CardContent>
        </Card>
      </section>

      <section id="features" className="mt-20 space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Why it works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Built with clean architecture and reusable primitives.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="pt-2">{feature.title}</CardTitle>
                  <CardDescription className="leading-7">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="explore" className="mt-20 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Explore</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Featured restaurants worth highlighting first.</h2>
          </div>
          <Button asChild variant="outline" className="sm:w-auto">
            <Link href="/restaurants">
              View directory
              <Building2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {featuredRestaurants.length ? <RestaurantGrid restaurants={featuredRestaurants} /> : <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No approved restaurants are available yet.</p>}
      </section>

      <section id="reviews" className="mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <Badge variant="outline" className="w-fit border-white/20 bg-white/10 text-white">
              Social proof
            </Badge>
            <CardTitle className="text-2xl text-white">Designed for trust, not clutter.</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Listings are structured for quick comparisons, while Clerk and Prisma give you a path to verified accounts and saved places.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Verified listings</p>
              <p className="mt-1 text-2xl font-semibold text-white">100%</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Average rating</p>
              <p className="mt-1 text-2xl font-semibold text-white">4.8/5</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Workflow ready
            </CardTitle>
            <CardDescription>
              The folder structure is split between app routes, shared UI, feature data, and server utilities so future growth stays manageable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {siteConfig.highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-accent/35 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="pricing" className="mt-20">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/30">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Launch</p>
            <CardTitle className="text-3xl">Ready to add authentication, listings, and restaurant workflows.</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Set the Supabase PostgreSQL connection string, configure Clerk, and push the Prisma schema when you are ready to move from scaffold to production data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/login">
                Configure Clerk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Create account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
