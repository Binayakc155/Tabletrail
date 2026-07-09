import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RoleAwareSignIn } from "@/components/auth/role-aware-auth";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Login | ${siteConfig.name}`,
  description: "Sign in to manage restaurant listings, saved places, and admin workflows.",
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

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      badge="Welcome back"
      title="Log in to TableTrail"
      description="Access your restaurant dashboard, saved reviews, and role-based tools from a single secure account."
      highlights={[
        "Resume saved sessions instantly",
        "Manage your restaurant or customer profile",
        "Use the providers configured in Clerk",
      ]}
      formTitle="Sign in"
      formDescription="Choose how you want to continue, then sign in with your Clerk account."
    >
      <RoleAwareSignIn initialRole={resolvedSearchParams?.role} />
    </AuthPageShell>
  );
}
