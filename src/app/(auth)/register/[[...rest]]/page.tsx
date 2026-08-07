import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RoleAwareSignUp } from "@/components/auth/role-aware-auth";
import { siteConfig } from "@/config/site";
import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { roleDashboardPath } from "@/lib/auth-roles";

export const metadata: Metadata = {
  title: `Create account | ${siteConfig.name}`,
  description:
    "Create a secure restaurant platform account.",
};

export default async function RegisterPage() {
  const { userId } = await auth();

  if (userId) {
    const user = await getCurrentAppUser();

    if (user) {
      await ensureLocalUser(user);
      redirect(roleDashboardPath(user.role));
    }
  }

  return (
    <AuthPageShell
      badge="Start here"
      title="Register your restaurant"
      description="Create an owner account to manage your restaurant listing."
      highlights={[
        "Restaurant owner account",
        "Menu and listing management",
        "Secure authentication with Clerk",
      ]}
      formTitle="Create account"
      formDescription="Customer accounts are not offered."
    >
      <RoleAwareSignUp />
    </AuthPageShell>
  );
}
