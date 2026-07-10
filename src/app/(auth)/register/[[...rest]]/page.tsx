import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RoleAwareSignUp } from "@/components/auth/role-aware-auth";
import { siteConfig } from "@/config/site";
import { getCurrentAppUser } from "@/lib/clerk-auth";
import { roleDashboardPath } from "@/lib/auth-roles";

export const metadata: Metadata = {
  title: `Create account | ${siteConfig.name}`,
  description:
    "Create a secure restaurant platform account.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{
    role?: string;
  }>;
}) {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;

  if (userId) {
    const user = await getCurrentAppUser();

    redirect(roleDashboardPath(user?.role));
  }

  return (
    <AuthPageShell
      badge="Start here"
      title="Create your TableTrail account"
      description="Choose your role and create your account."
      highlights={[
        "Customer account",
        "Restaurant owner account",
        "Secure authentication with Clerk",
      ]}
      formTitle="Create account"
      formDescription="Select your role before signing up."
    >
      <RoleAwareSignUp initialRole={resolvedSearchParams?.role} />
    </AuthPageShell>
  );
}
