import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { requireAppUser } from "@/lib/clerk-auth";

export const metadata: Metadata = {
  title: `Customer dashboard | ${siteConfig.name}`,
  description: "Your TableTrail customer dashboard.",
};

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const user = await requireAppUser();

  if (user.role === "restaurant_owner") {
    redirect("/owner/dashboard");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Customer dashboard</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Welcome back, {user.name ?? "there"}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Discover new places, keep track of favorites, and return to the restaurants you love.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Explore restaurants</CardTitle>
            <CardDescription>Browse restaurants by cuisine, location, rating, and price.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/restaurants">Browse restaurants</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your favorites</CardTitle>
            <CardDescription>See the restaurants you have saved while browsing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/favorites">View favorites</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
