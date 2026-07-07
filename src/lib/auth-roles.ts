export const userRoles = ["customer", "restaurant_owner", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export const publicSignUpRoles = ["customer", "restaurant_owner"] as const;

export type PublicSignUpRole = (typeof publicSignUpRoles)[number];

export function isOwnerOrAdmin(role?: string | null) {
  return role === "restaurant_owner" || role === "admin";
}
