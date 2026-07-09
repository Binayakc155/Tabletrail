"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { BriefcaseBusiness, Utensils } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { type SelfServiceUserRole, isSelfServiceUserRole, roleDashboardPath, roleLabel } from "@/lib/auth-roles";
import { cn } from "@/lib/utils";

const selfServiceRoles = [
  {
    value: "customer",
    icon: Utensils,
    description: "Find restaurants, save favorites, and write reviews.",
  },
  {
    value: "restaurant_owner",
    icon: BriefcaseBusiness,
    description: "Manage restaurant listings, menus, and owner tools.",
  },
] satisfies {
  value: SelfServiceUserRole;
  icon: typeof Utensils;
  description: string;
}[];

function getSelfServiceRole(role: string | undefined): SelfServiceUserRole {
  return role === "restaurant_owner" ? "restaurant_owner" : "customer";
}

function RoleSelector({
  selectedRole,
  onSelectRole,
}: {
  selectedRole: SelfServiceUserRole;
  onSelectRole: (role: SelfServiceUserRole) => void;
}) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2">
      {selfServiceRoles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.value;

        return (
          <Button
            key={role.value}
            type="button"
            variant="outline"
            className={cn(
              "h-auto items-start justify-start rounded-2xl px-4 py-4 text-left whitespace-normal",
              isSelected && "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            )}
            aria-pressed={isSelected}
            onClick={() => onSelectRole(role.value)}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <span className="grid gap-1">
              <span className="text-sm font-semibold">{roleLabel(role.value)}</span>
              <span className="text-xs leading-5 text-muted-foreground">{role.description}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export function RoleAwareSignIn({
  initialRole,
}: {
  initialRole?: string;
}) {
  const [selectedRole, setSelectedRole] = useState<SelfServiceUserRole>(() => getSelfServiceRole(initialRole));
  const signUpUrl = useMemo(() => `/register?role=${selectedRole}`, [selectedRole]);
  const redirectUrl = useMemo(() => roleDashboardPath(selectedRole), [selectedRole]);

  return (
    <>
      <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />
      <SignIn signUpUrl={signUpUrl} fallbackRedirectUrl={redirectUrl} forceRedirectUrl={redirectUrl} />
    </>
  );
}

export function RoleAwareSignUp({ initialRole }: { initialRole?: string }) {
  const [selectedRole, setSelectedRole] = useState<SelfServiceUserRole>(() => getSelfServiceRole(initialRole));

  return (
    <>
      <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />
      <SignUp
        signInUrl={`/login?role=${selectedRole}`}
        fallbackRedirectUrl={roleDashboardPath(selectedRole)}
        forceRedirectUrl={roleDashboardPath(selectedRole)}
        unsafeMetadata={{ role: isSelfServiceUserRole(selectedRole) ? selectedRole : "customer" }}
      />
    </>
  );
}
