import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { requireAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: `Admin console | ${siteConfig.name}`,
  description: "Protected admin console for managing the platform.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAppUser();

  if (user.role !== "admin") {
    redirect("/dashboard?error=forbidden");
  }

  const [users, restaurants, reviews, favorites] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.restaurant.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }], take: 12, include: { owner: true } }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { restaurant: true, user: true } }),
    prisma.favorite.count(),
  ]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Admin only
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Admin console</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Manage users, moderate restaurants and reviews, and approve or reject new listings.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Users</p><p className="text-2xl font-semibold">{users.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Restaurants</p><p className="text-2xl font-semibold">{restaurants.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Recent reviews</p><p className="text-2xl font-semibold">{reviews.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Favorites</p><p className="text-2xl font-semibold">{favorites}</p></CardContent></Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant approvals</CardTitle>
            <CardDescription>Use the status API to approve or reject listings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{restaurant.name}</p>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine} - {restaurant.owner?.email ?? "No owner"}</p>
                  </div>
                  <Badge variant="outline">{restaurant.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review moderation</CardTitle>
            <CardDescription>Recent customer reviews across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{review.restaurant.name}</p>
                  <Badge variant="outline">{review.rating} stars</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>User management</CardTitle>
          <CardDescription>Latest synced Clerk users stored in Supabase.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {users.map((account) => (
            <div key={account.id} className="rounded-lg border border-border p-4">
              <p className="font-medium">{account.name ?? account.email}</p>
              <p className="text-sm text-muted-foreground">{account.email} - {account.role}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
