export const userRoles = ["customer", "restaurant_owner", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

export function getClerkUserRole(metadata: Record<string, unknown> | null | undefined): UserRole {
  const role = metadata?.role;
  return isUserRole(role) ? role : "customer";
}

export function isOwnerOrAdmin(role?: string | null) {
  return role === "restaurant_owner" || role === "admin";
}
