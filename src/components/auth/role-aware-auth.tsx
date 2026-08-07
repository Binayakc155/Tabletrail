"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
export function RoleAwareSignIn() {
  return <SignIn signUpUrl="/register" fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" />;
}

export function RoleAwareSignUp() {
  return <SignUp signInUrl="/login" fallbackRedirectUrl="/owner/dashboard" forceRedirectUrl="/owner/dashboard" unsafeMetadata={{ role: "restaurant_owner" }} />;
}
