import Image from "next/image";
import { ChevronRight, MapPin, Star } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { RestaurantSummary } from "@/features/restaurants/types";

function formatPriceLevel(priceLevel: RestaurantSummary["priceLevel"]) {
  return "$".repeat(priceLevel);
}

export function RestaurantCard({ restaurant }: { restaurant: RestaurantSummary }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover transition duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur dark:bg-slate-950/80 dark:text-white">
            {restaurant.cuisine}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-white">
          <div className="flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.city}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
            <Star className="h-4 w-4 fill-current text-amber-300" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription className="mt-1">{restaurant.neighborhood}</CardDescription>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">{formatPriceLevel(restaurant.priceLevel)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{restaurant.description}</p>
        <div className="flex flex-wrap gap-2">
          {restaurant.highlights.map((highlight) => (
            <Badge key={highlight} variant="outline">
              {highlight}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{restaurant.reviewCount} verified reviews</p>
        <Button asChild size="sm" variant="outline">
          <Link href={`/restaurants/${restaurant.slug}`}>
            View profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
