import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Login | ${siteConfig.name}`,
  description: "Sign in to manage restaurant listings, saved places, and admin workflows.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: {
    callbackUrl?: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
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
        "Optional Google sign-in when configured",
      ]}
      formTitle="Sign in"
      formDescription="Use your email and password or connect with Google if that provider is configured in your environment."
    >
      <LoginForm callbackUrl={searchParams?.callbackUrl ?? "/dashboard"} enableGoogleLogin={process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === "true"} />
    </AuthPageShell>
  );
}
