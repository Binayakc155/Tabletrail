import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/lib/auth-roles";
import { getClerkSignUpRole, getClerkUserRole, isUserRole, preferHigherRole } from "@/lib/auth-roles";

export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

function isAllowedAdmin(email: string | null) {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 2);

  return adminEmails.includes(email.toLowerCase());
}

export async function getCurrentAppUser(): Promise<AppUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
  const name = user.fullName ?? ([user.firstName, user.lastName].filter(Boolean).join(" ") || null);
  const localUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const clerkRole = getClerkUserRole(user.publicMetadata);
  let role = preferHigherRole(localUser?.role, clerkRole);
  const signUpRole = getClerkSignUpRole(user.unsafeMetadata);

  if (signUpRole && preferHigherRole(role, signUpRole) === signUpRole && signUpRole !== role) {
    const client = await clerkClient();

    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: signUpRole,
      },
    });

    role = signUpRole;
  }

  // Admin access is limited to the first two addresses in ADMIN_EMAILS.
  if (isAllowedAdmin(email)) {
    role = "admin";
  } else if (role === "admin") {
    role = clerkRole === "admin" ? "customer" : clerkRole;
  }

  return {
    id: user.id,
    name,
    email,
    role,
  };
}

export async function requireAppUser() {
  await auth.protect();

  const user = await getCurrentAppUser();

  if (!user) {
    throw new Error("Unable to load authenticated user.");
  }

  return user;
}

export async function ensureLocalUser(user: AppUser) {
  if (!user.email) {
    throw new Error("A verified email address is required.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  });

  const role = preferHigherRole(existingUser?.role, user.role);

  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      email: user.email,
      name: user.name,
      role,
    },
    create: {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
    },
  });
}
