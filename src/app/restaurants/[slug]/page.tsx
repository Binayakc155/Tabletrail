import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, Users, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRestaurantBySlug } from "@/features/restaurants/data/get-restaurant-by-slug";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) {
    return {
      title: `Restaurant not found | ${siteConfig.name}`,
    };
  }

  return {
    title: `${restaurant.name} | ${siteConfig.name}`,
    description: restaurant.description,
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit">{restaurant.cuisine}</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{restaurant.name}</h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{restaurant.description}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
              <MapPin className="h-4 w-4" />
              {restaurant.city} · {restaurant.neighborhood}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
              <Star className="h-4 w-4 fill-current text-amber-400" />
              {restaurant.rating.toFixed(1)} rating
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
              <Users className="h-4 w-4" />
              {restaurant.reviewCount} reviews
            </span>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="relative h-72">
            <Image src={restaurant.imageUrl} alt={restaurant.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <CardHeader>
            <CardTitle>Listing snapshot</CardTitle>
            <CardDescription>Optimized for clean discovery and quick scanning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-accent/40 p-4">
                <p className="text-sm text-muted-foreground">Price level</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{"$".repeat(restaurant.priceLevel)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-accent/40 p-4">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{restaurant.cuisine}</p>
              </div>
            </div>
            <Button className="w-full">
              <UtensilsCrossed className="h-4 w-4" />
              Reserve a table
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {restaurant.highlights.map((highlight) => (
          <Card key={highlight}>
            <CardHeader>
              <CardTitle className="text-base">{highlight}</CardTitle>
              <CardDescription>Highlighted because it helps diners decide faster.</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
