import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { requireAppUser } from "@/lib/clerk-auth";

export const metadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  description: "Protected account dashboard for restaurant platform users.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAppUser();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Protected area</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Your TableTrail dashboard</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Signed in as {user.email ?? "an authenticated user"}. Your current role is {user.role}.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit capitalize">
          {user.role}
        </Badge>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Secure session and profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Name: {user.name ?? "Not set"}</p>
            <p>Email: {user.email ?? "Not set"}</p>
            <p>Role: {user.role}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump into the authenticated parts of the platform.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link href="/owner/dashboard">Owner tools</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Admin console</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/favorites">Favorites</Link>
            </Button>
            <Button asChild>
              <Link href="/restaurants">Browse restaurants</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access model</CardTitle>
            <CardDescription>Role-based access is enforced in middleware and page guards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Customer: browse, save, and review restaurants.</p>
            <p>Restaurant Owner: manage venue content and listing details.</p>
            <p>Admin: oversee platform moderation and account access.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
