import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Admin console | ${siteConfig.name}`,
  description: "Protected admin console for managing the platform.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/dashboard?error=forbidden");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          Admin only
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Admin console</h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          This area is reserved for platform operators who can moderate accounts and listings.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Restricted access</CardTitle>
          <CardDescription>Only users with the admin role can reach this page.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Signed in as {session?.user?.email ?? "an admin user"}.
        </CardContent>
      </Card>
    </section>
  );
}
