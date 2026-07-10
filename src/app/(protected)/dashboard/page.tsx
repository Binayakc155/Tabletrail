import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { roleDashboardPath } from "@/lib/auth-roles";
import { requireAppUser } from "@/lib/clerk-auth";

export const metadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  description: "Protected account dashboard for restaurant platform users.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAppUser();

  redirect(roleDashboardPath(user.role));
}
