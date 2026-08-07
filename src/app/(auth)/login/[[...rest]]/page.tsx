import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RoleAwareSignIn } from "@/components/auth/role-aware-auth";
import { siteConfig } from "@/config/site";
import { roleDashboardPath } from "@/lib/auth-roles";
import { getCurrentAppUser } from "@/lib/clerk-auth";

export const metadata: Metadata = {
  title: `Staff sign in | ${siteConfig.name}`,
  description: "Sign in to manage restaurant listings or access administration.",
};

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    const user = await getCurrentAppUser();

    if (user) {
      redirect(roleDashboardPath(user.role));
    }
  }

  return (
    <AuthPageShell
      badge="Welcome back"
      title="Staff sign in"
      description="For restaurant owners and administrators."
      highlights={[
        "Restaurant management",
        "Admin dashboard",
        "Secure access",
      ]}
      formTitle="Sign in"
      formDescription="Customer accounts are not required to browse TableTrail."
    >
      <RoleAwareSignIn />
    </AuthPageShell>
  );
}
