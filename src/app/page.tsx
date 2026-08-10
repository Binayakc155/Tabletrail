import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronRight, MapPin, Search, Star, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RestaurantGrid } from "@/features/restaurants/components/restaurant-grid";
import type { RestaurantSummary } from "@/features/restaurants/types";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const cuisines = [
  { name: "Nepali", image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=600&q=85" },
  { name: "Italian", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=85" },
  { name: "Chinese", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=85" },
  { name: "Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=85" },
  { name: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=85" },
  { name: "Café", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=85" },
  { name: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=85" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=85" },
];

const popularSearches = ["Pizza", "Burger", "Café", "Nepali Food", "Chinese", "Indian"];

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
  const heroImage = featuredRestaurants[0]?.imageUrl ?? "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90";

  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 md:pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-20">
        <div className="absolute left-[-10rem] top-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="space-y-7">
          <Badge variant="secondary" className="w-fit rounded-full border border-primary/10 bg-primary/10 px-3 py-1.5 font-semibold text-primary">
            <UtensilsCrossed className="mr-1.5 h-3.5 w-3.5" />
            Made for memorable meals
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
              Find your next <span className="text-primary">favorite</span> place to eat.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Discover restaurants, cafés, and local food spots that turn an ordinary outing into a great story.
            </p>
          </div>

          <form action="/restaurants" className="rounded-[22px] border border-border/80 bg-card p-2 shadow-[0_18px_45px_rgba(65,44,24,0.11)] sm:flex sm:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 sm:border-r sm:border-border">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <Input name="q" className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder="Restaurant, cuisine, or dish" />
            </label>
            <label className="flex items-center gap-3 border-t border-border px-3 py-3 sm:w-44 sm:border-l-0 sm:border-t-0">
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <select name="city" aria-label="Location" defaultValue="" className="w-full bg-transparent text-sm text-muted-foreground outline-none">
                <option value="">Any location</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
              </select>
            </label>
            <Button type="submit" className="mt-1 h-12 w-full rounded-[16px] px-6 sm:mt-0 sm:w-auto">Search</Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 text-muted-foreground">Popular:</span>
            {popularSearches.map((term) => (
              <Link key={term} href={{ pathname: "/restaurants", query: { q: term } }} className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary">
                {term}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -right-8 top-10 -z-10 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[32px] shadow-[0_24px_60px_rgba(54,37,20,0.22)]">
            <Image src={heroImage} alt="Warm restaurant dining experience" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur sm:-left-8 sm:p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-500"><Star className="h-5 w-5 fill-current" /></div>
            <div>
              <p className="text-lg font-semibold leading-none text-slate-900">4.8 <span className="text-sm font-medium text-slate-500">/ 5</span></p>
              <p className="mt-1 text-xs text-slate-500">Loved by 50K+ diners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-[#fffaf3]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-y divide-border/70 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
          {[{ value: "1.2K+", label: "Verified restaurants" }, { value: "4.8/5", label: "Average rating" }, { value: "10+", label: "Cities covered" }, { value: "50K+", label: "Food lovers" }].map((stat) => (
            <div key={stat.label} className="px-4 py-6 text-center sm:px-7 sm:py-7"><p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{stat.value}</p><p className="mt-1.5 text-xs font-medium text-muted-foreground sm:text-sm">{stat.label}</p></div>
          ))}
        </div>
      </section>

      <section id="cuisines" className="mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Explore by cuisine</p><h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Follow your cravings.</h2><p className="leading-7 text-muted-foreground">From the comfort of a café to the spice of a late-night feast, find exactly what you are in the mood for.</p></div>
          <Button asChild variant="outline" className="w-fit rounded-xl"><Link href="/restaurants">Browse all cuisines <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {cuisines.map((cuisine) => <Link key={cuisine.name} href={{ pathname: "/restaurants", query: { cuisine: cuisine.name } }} className="group text-center"><div className="relative mx-auto aspect-square max-w-32 overflow-hidden rounded-2xl border border-border/70 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"><Image src={cuisine.image} alt={`${cuisine.name} cuisine`} fill className="object-cover transition duration-500 group-hover:scale-110" sizes="(max-width: 640px) 45vw, 12vw" /></div><p className="mt-3 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{cuisine.name}</p></Link>)}
        </div>
      </section>

      <section id="explore" className="bg-[#fffaf3] py-18 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-xl space-y-3"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Featured restaurants</p><h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Places diners keep coming back to.</h2><p className="leading-7 text-muted-foreground">Handpicked local favorites, from relaxed lunches to special-occasion tables.</p></div><Button asChild variant="outline" className="w-fit rounded-xl"><Link href="/restaurants">View all restaurants <ArrowRight className="h-4 w-4" /></Link></Button></div>
          {featuredRestaurants.length ? <RestaurantGrid restaurants={featuredRestaurants} /> : <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">New restaurant recommendations are arriving soon.</p>}
        </div>
      </section>

      <section id="locations" className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-18 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-24">
        <div className="space-y-4"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Explore nearby</p><h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Good food is closer than you think.</h2><p className="max-w-md leading-7 text-muted-foreground">Start with a neighborhood, then let great food lead the way.</p><Button asChild className="rounded-xl"><Link href="/restaurants">Explore locations <ArrowRight className="h-4 w-4" /></Link></Button></div>
        <div className="grid gap-4 sm:grid-cols-3">{[{ city: "Kathmandu", copy: "Heritage, street food & chef tables" }, { city: "Lalitpur", copy: "Creative kitchens & cafés" }, { city: "Bhaktapur", copy: "Local flavor, slow afternoons" }].map((place) => <Link href={{ pathname: "/restaurants", query: { q: place.city } }} key={place.city} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div><p className="mt-8 text-lg font-semibold">{place.city}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{place.copy}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span></Link>)}</div>
      </section>

      <section id="reviews" className="mx-auto w-full max-w-7xl px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
        <div className="overflow-hidden rounded-[28px] bg-slate-900 px-6 py-10 text-white sm:px-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-14 lg:py-14"><div><Badge className="border border-white/15 bg-white/10 text-white hover:bg-white/10">Diner favorites</Badge><h2 className="mt-5 max-w-md text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Choose with confidence, then make it yours.</h2><p className="mt-4 max-w-md leading-7 text-slate-300">Clear details, authentic feedback, and a collection made for every kind of appetite.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-0">{[{ icon: BadgeCheck, title: "Verified places", text: "Restaurants with complete details." }, { icon: Star, title: "Real ratings", text: "Diner feedback at a glance." }, { icon: UtensilsCrossed, title: "For every mood", text: "From quick bites to celebrations." }].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon className="h-5 w-5 text-orange-300" /><p className="mt-7 font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></div>)}</div></div>
      </section>
    </div>
  );
}
