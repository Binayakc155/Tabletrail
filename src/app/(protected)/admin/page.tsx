import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminConsole } from "@/components/admin/admin-console";
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
    redirect("/customer/dashboard?error=forbidden");
  }

  const [usersCount, restaurants] = await Promise.all([
    prisma.user.count(),
    prisma.restaurant.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }], take: 20, include: { owner: { select: { email: true } } } }),
  ]);

  return <AdminConsole usersCount={usersCount} restaurants={restaurants} />;
}
