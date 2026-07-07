"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicSignUpRoles } from "@/lib/auth-roles";
import { signUpSchema, type SignUpValues } from "@/lib/validators/auth";

export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setServerError(null);
    setIsSubmittingRequest(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setServerError(payload.message ?? "Unable to create your account.");
        return;
      }

      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (signInResponse?.url) {
        router.push(signInResponse.url);
        router.refresh();
      }
    } finally {
      setIsSubmittingRequest(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" autoComplete="name" placeholder="Ari Chen" {...form.register("name")} />
        {form.formState.errors.name ? <p className="text-sm text-destructive">{form.formState.errors.name.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-email">Email</Label>
        <Input id="register-email" type="email" autoComplete="email" placeholder="name@company.com" {...form.register("email")} />
        {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="register-password">Password</Label>
        <Input id="register-password" type="password" autoComplete="new-password" placeholder="Create a password" {...form.register("password")} />
        {form.formState.errors.password ? <p className="text-sm text-destructive">{form.formState.errors.password.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Account type</Label>
        <select
          id="role"
          className="h-11 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          {...form.register("role")}
        >
          {publicSignUpRoles.map((role) => (
            <option key={role} value={role}>
              {role === "customer" ? "Customer" : "Restaurant Owner"}
            </option>
          ))}
        </select>
        {form.formState.errors.role ? <p className="text-sm text-destructive">{form.formState.errors.role.message}</p> : null}
      </div>

      {serverError ? <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</div> : null}

      <Button className="w-full" type="submit" disabled={isSubmittingRequest}>
        {isSubmittingRequest ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
