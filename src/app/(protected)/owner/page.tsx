import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantManager } from "@/components/restaurants/restaurant-manager";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { ensureLocalUser, requireAppUser } from "@/lib/clerk-auth";
import { listOwnerRestaurants } from "@/lib/restaurant-management";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Owner tools | ${siteConfig.name}`,
  description: "Restaurant management dashboard for owners.",
};

export default async function OwnerPage() {
  const user = await requireAppUser();

  if (!isOwnerOrAdmin(user.role)) {
    redirect("/dashboard?error=forbidden");
  }

  await ensureLocalUser(user);
  const restaurants = await listOwnerRestaurants(user.id);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Restaurant management
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Manage your restaurants</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          Add, edit, or delete venue listings, images, and details like hours, phone number, and coordinates.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Your access</CardTitle>
            <CardDescription>
              Signed in as {user.email ?? "a role-authorized user"} with role {user.role}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Add Restaurant</p>
            <p>Edit Restaurant</p>
            <p>Delete Restaurant</p>
            <p>Upload Restaurant Image</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restaurant entries</CardTitle>
            <CardDescription>All venues owned by this account.</CardDescription>
          </CardHeader>
          <CardContent>
            <RestaurantManager restaurants={restaurants} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
