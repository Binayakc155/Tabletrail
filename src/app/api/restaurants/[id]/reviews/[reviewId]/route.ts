import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";
import { refreshRestaurantRating } from "@/lib/reviews";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; reviewId: string }> }) {
  const { id, reviewId } = await params;
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const parsed = reviewSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid review." }, { status: 400 });
  }

  const review = await prisma.review.findFirst({ where: { id: reviewId, restaurantId: id, userId: user.id } });

  if (!review) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const updated = await prisma.review.update({ where: { id: reviewId }, data: parsed.data });
  await refreshRestaurantRating(id);

  return NextResponse.json({ review: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; reviewId: string }> }) {
  const { id, reviewId } = await params;
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const review = await prisma.review.findFirst({ where: { id: reviewId, restaurantId: id, userId: user.id } });

  if (!review) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  await prisma.review.delete({ where: { id: reviewId } });
  await refreshRestaurantRating(id);

  return NextResponse.json({ success: true });
}
