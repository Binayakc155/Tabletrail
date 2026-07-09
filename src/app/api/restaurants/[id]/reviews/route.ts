import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";
import { refreshRestaurantRating } from "@/lib/reviews";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5).max(2000),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = await prisma.review.findMany({
    where: { restaurantId: id },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid review." }, { status: 400 });
  }

  await ensureLocalUser(user);
  const review = await prisma.review.upsert({
    where: { restaurantId_userId: { restaurantId: id, userId: user.id } },
    update: parsed.data,
    create: {
      ...parsed.data,
      restaurantId: id,
      userId: user.id,
    },
  });
  await refreshRestaurantRating(id);

  return NextResponse.json({ review }, { status: 201 });
}
