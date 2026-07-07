import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Create account | ${siteConfig.name}`,
  description: "Create a secure restaurant platform account with a password and role.",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      badge="Start here"
      title="Create your TableTrail account"
      description="Choose a customer or restaurant owner profile, verify your email address, and keep access secure with hashed passwords."
      highlights={[
        "Role-aware sign-up flow",
        "Password hashing with bcrypt",
        "Ready for customer or owner onboarding",
      ]}
      formTitle="Create account"
      formDescription="This scaffold keeps the public sign-up flow separate from the protected dashboard and admin routes."
    >
      <RegisterForm callbackUrl="/dashboard" />
    </AuthPageShell>
  );
}
