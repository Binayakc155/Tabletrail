import type { Metadata } from "next";

import { RestaurantGrid } from "@/features/restaurants/components/restaurant-grid";
import { requireAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Favorites | ${siteConfig.name}`,
  description: "Restaurants saved by the signed-in customer.",
};

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await requireAppUser();
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { restaurant: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Favorites</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Saved restaurants</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">Restaurants you saved while browsing.</p>
      </div>
      <RestaurantGrid restaurants={favorites.map((favorite) => favorite.restaurant)} />
    </section>
  );
}
