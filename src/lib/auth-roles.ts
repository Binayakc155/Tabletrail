export const userRoles = ["customer", "restaurant_owner", "admin"] as const;
export const selfServiceUserRoles = ["customer", "restaurant_owner"] as const;

export type UserRole = (typeof userRoles)[number];
export type SelfServiceUserRole = (typeof selfServiceUserRoles)[number];

const rolePriority: Record<UserRole, number> = {
  customer: 0,
  restaurant_owner: 1,
  admin: 2,
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

export function isSelfServiceUserRole(value: unknown): value is SelfServiceUserRole {
  return typeof value === "string" && selfServiceUserRoles.includes(value as SelfServiceUserRole);
}

export function getClerkUserRole(publicMetadata: Record<string, unknown> | null | undefined): UserRole {
  const role = publicMetadata?.role;
  return isUserRole(role) ? role : "customer";
}

export function getClerkSignUpRole(unsafeMetadata: Record<string, unknown> | null | undefined) {
  const role = unsafeMetadata?.role;
  return isSelfServiceUserRole(role) ? role : null;
}

export function isOwnerOrAdmin(role?: string | null) {
  return role === "restaurant_owner" || role === "admin";
}

export function roleLabel(role?: string | null) {
  if (role === "restaurant_owner") return "Restaurant Owner";
  if (role === "admin") return "Admin";
  return "Customer";
}

export function roleDashboardPath(role?: string | null) {
  if (role === "restaurant_owner") return "/owner/dashboard";
  if (role === "admin") return "/admin";
  return "/customer/dashboard";
}

export function preferHigherRole(...roles: Array<UserRole | null | undefined>): UserRole {
  let resolvedRole: UserRole = "customer";

  for (const role of roles) {
    if (!role) continue;

    if (rolePriority[role] > rolePriority[resolvedRole]) {
      resolvedRole = role;
    }
  }

  return resolvedRole;
}
