import Image from "next/image";
import { BadgeCheck, ChevronRight, Clock3, MapPin, Star } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { RestaurantSummary } from "@/features/restaurants/types";

function formatPriceLevel(priceLevel: RestaurantSummary["priceLevel"]) {
  return "$".repeat(Math.max(1, Math.min(priceLevel, 4)));
}

export function RestaurantCard({ restaurant }: { restaurant: RestaurantSummary }) {
  return (
    <Card className="group overflow-hidden border-border/80 bg-card shadow-[0_8px_24px_rgba(57,39,20,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(57,39,20,0.13)]">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/95 text-slate-900 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-white">
            {restaurant.cuisine}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-white" /> Open today</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.city}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
            <Star className="h-4 w-4 fill-current text-amber-300" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-1.5 text-xl"><span>{restaurant.name}</span><BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified restaurant" /></CardTitle>
            <CardDescription className="mt-1">{restaurant.address ?? restaurant.neighborhood ?? restaurant.city}</CardDescription>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">{formatPriceLevel(restaurant.priceLevel)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{restaurant.description}</p>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Clock3 className="h-3.5 w-3.5 text-primary" /> {restaurant.openingHours ?? "Hours available on profile"}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {restaurant.reviewCount} reviews{restaurant.distanceMiles ? ` · ${restaurant.distanceMiles.toFixed(1)} mi` : ""}
        </p>
        <Button asChild size="sm" variant="outline" className="rounded-xl">
          <Link href={`/restaurants/${restaurant.slug}`}>
            View restaurant
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
