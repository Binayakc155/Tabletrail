import { NextResponse } from "next/server";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentAppUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { restaurants: true, reviews: true, favorites: true } },
    },
  });

  return NextResponse.json({ users });
}
