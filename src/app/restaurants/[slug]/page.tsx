import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Mail, MapPin, Navigation, Phone, Star, Users, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantCard } from "@/features/restaurants/components/restaurant-card";
import { GuestReviewForm } from "@/components/restaurants/guest-review-form";
import { getRestaurantDetails } from "@/features/restaurants/data/restaurants";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantDetails(slug);

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
  const restaurant = await getRestaurantDetails(slug);

  if (!restaurant) {
    notFound();
  }

  const coverImage = restaurant.images[0]?.url ?? restaurant.imageUrl;
  const mapSrc =
    restaurant.latitude && restaurant.longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.longitude - 0.01}%2C${restaurant.latitude - 0.01}%2C${restaurant.longitude + 0.01}%2C${restaurant.latitude + 0.01}&layer=mapnik&marker=${restaurant.latitude}%2C${restaurant.longitude}`
      : null;
  const directionsUrl =
    restaurant.latitude && restaurant.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative min-h-[380px] overflow-hidden rounded-lg">
        <Image src={coverImage} alt={restaurant.name} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
          <Badge className="mb-4 bg-white text-slate-950">{restaurant.cuisine}</Badge>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">{restaurant.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/85">{restaurant.description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Star className="h-5 w-5 fill-current text-amber-400" />
                <div>
                  <p className="font-semibold">{restaurant.rating.toFixed(1)} average</p>
                  <p className="text-sm text-muted-foreground">{restaurant.reviewCount} reviews</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">{restaurant.openingHours}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">{restaurant.address}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Restaurant images uploaded by the owner.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {(restaurant.images.length ? restaurant.images : [{ id: restaurant.id, url: restaurant.imageUrl, alt: restaurant.name }]).map((image) => (
                <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image src={image.url} alt={image.alt ?? restaurant.name} fill className="object-cover" sizes="33vw" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                Menu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {restaurant.menus.map((menu) => (
                <section key={menu.id} className="space-y-4">
                  <h3 className="font-semibold">{menu.title}</h3>
                  {menu.imageUrl ? (
                    <a href={menu.imageUrl} target="_blank" rel="noreferrer" className="block">
                      <div className="relative aspect-[3/4] max-w-md overflow-hidden rounded-lg border border-border">
                        <Image src={menu.imageUrl} alt={`${menu.title} for ${restaurant.name}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 448px" />
                      </div>
                    </a>
                  ) : null}
                  {menu.categories.map((category) => (
                    <div key={category.id}>
                      <h4 className="mb-3 font-semibold">{category.name}</h4>
                      <div className="grid gap-3">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex justify-between gap-4 border-b border-border pb-3">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}
                            </div>
                            <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {menu.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 border-b border-border pb-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}
                      </div>
                      <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </section>
              ))}
              {restaurant.menus.every((menu) => !menu.imageUrl && menu.categories.length === 0 && menu.items.length === 0) ? (
                <p className="text-sm text-muted-foreground">Menu items have not been added yet.</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer reviews</CardTitle>
              <CardDescription>Recent reviews and rating distribution.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[0.7fr_1.3fr]">
              <div className="space-y-3">
                {restaurant.ratingDistribution.map((bucket) => (
                  <div key={bucket.rating} className="flex items-center gap-3 text-sm">
                    <span className="w-10">{bucket.rating} star</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${restaurant.reviewCount ? (bucket.count / restaurant.reviewCount) * 100 : 0}%` }} />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{bucket.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {restaurant.reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium">{review.guestName ?? review.user?.name ?? "Anonymous diner"}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-current text-amber-400" />
                        {review.rating}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
                {restaurant.reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : null}
                <GuestReviewForm restaurantId={restaurant.id} />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {restaurant.phoneNumber}</p>
              {restaurant.contactEmail ? <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {restaurant.contactEmail}</p> : null}
              <Button asChild className="w-full">
                <a href={directionsUrl} target="_blank" rel="noreferrer">
                  <Navigation className="h-4 w-4" />
                  Directions
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent>
              {mapSrc ? (
                <iframe title={`${restaurant.name} map`} src={mapSrc} className="h-72 w-full rounded-lg border border-border" loading="lazy" />
              ) : (
                <p className="text-sm text-muted-foreground">Coordinates are not available for this restaurant.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recommended
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {restaurant.recommended.map((item) => (
                <RestaurantCard key={item.slug} restaurant={item} />
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
