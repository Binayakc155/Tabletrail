import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RoleAwareSignIn } from "@/components/auth/role-aware-auth";
import { siteConfig } from "@/config/site";
import { roleDashboardPath } from "@/lib/auth-roles";
import { getCurrentAppUser } from "@/lib/clerk-auth";

export const metadata: Metadata = {
  title: `Login | ${siteConfig.name}`,
  description:
    "Sign in to manage restaurant listings, saved places, and admin workflows.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{
    role?: string;
  }>;
}) {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;
  const selectedRole = resolvedSearchParams?.role;

  if (userId) {
    const user = await getCurrentAppUser();

    if (user) {
      redirect(roleDashboardPath(user.role));
    }
  }

  return (
    <AuthPageShell
      badge="Welcome back"
      title="Log in to TableTrail"
      description="Access your account securely."
      highlights={[
        "Resume saved sessions",
        "Restaurant management",
        "Customer dashboard",
      ]}
      formTitle="Sign in"
      formDescription="Sign in with your Clerk account."
    >
      <RoleAwareSignIn initialRole={resolvedSearchParams?.role} />
    </AuthPageShell>
  );
}
