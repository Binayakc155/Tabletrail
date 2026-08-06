import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RoleAwareSignUp } from "@/components/auth/role-aware-auth";
import { siteConfig } from "@/config/site";
import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { isSelfServiceUserRole, roleDashboardPath } from "@/lib/auth-roles";

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
  const selectedRole = isSelfServiceUserRole(resolvedSearchParams?.role) ? resolvedSearchParams.role : null;

  if (userId) {
    const user = await getCurrentAppUser();

    if (user) {
      const role = selectedRole === "restaurant_owner" ? "restaurant_owner" : user.role;

      await ensureLocalUser({
        ...user,
        role,
      });

      redirect(roleDashboardPath(role));
    }
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
