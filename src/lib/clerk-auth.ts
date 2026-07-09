import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/lib/auth-roles";
import { getClerkSignUpRole, getClerkUserRole, isUserRole } from "@/lib/auth-roles";

export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

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
  let role = getClerkUserRole(user.publicMetadata);

  if (!isUserRole(user.publicMetadata.role)) {
    const signUpRole = getClerkSignUpRole(user.unsafeMetadata);

    if (signUpRole) {
      const client = await clerkClient();

      await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: signUpRole,
        },
      });

      role = signUpRole;
    }
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

  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    create: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
