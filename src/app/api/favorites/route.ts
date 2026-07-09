import { NextResponse } from "next/server";

import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { restaurant: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { restaurantId } = await request.json();

  if (!restaurantId || typeof restaurantId !== "string") {
    return NextResponse.json({ message: "restaurantId is required." }, { status: 400 });
  }

  await ensureLocalUser(user);
  const favorite = await prisma.favorite.upsert({
    where: { restaurantId_userId: { restaurantId, userId: user.id } },
    update: {},
    create: { restaurantId, userId: user.id },
  });

  return NextResponse.json({ favorite }, { status: 201 });
}
