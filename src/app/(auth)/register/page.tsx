import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Create account | ${siteConfig.name}`,
  description: "Create a secure restaurant platform account with a password and role.",
};

export default async function RegisterPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      badge="Start here"
      title="Create your TableTrail account"
      description="Create a secure Clerk account for your TableTrail dashboard, saved restaurants, and management tools."
      highlights={[
        "Hosted Clerk sign-up flow",
        "Secure sessions without local password storage",
        "Ready for customer or owner onboarding",
      ]}
      formTitle="Create account"
      formDescription="New accounts start as customers. Set publicMetadata.role in Clerk to restaurant_owner or admin when needed."
    >
      <SignUp signInUrl="/login" fallbackRedirectUrl="/dashboard" />
    </AuthPageShell>
  );
}
