import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Owner tools | ${siteConfig.name}`,
  description: "Protected tools for restaurant owners.",
};

export default async function OwnerPage() {
  const session = await getServerSession(authOptions);

  if (!isOwnerOrAdmin(session?.user?.role)) {
    redirect("/dashboard?error=forbidden");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Restaurant owner access
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Owner tools</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Restaurant owners can manage venue details, availability, and future listing workflows from here.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Available to owners and admins</CardTitle>
          <CardDescription>Use this surface for venue management workflows.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Signed in as {session?.user?.email ?? "a role-authorized user"}.
        </CardContent>
      </Card>
    </section>
  );
}
