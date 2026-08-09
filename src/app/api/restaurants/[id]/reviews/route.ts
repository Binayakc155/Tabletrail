import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { refreshRestaurantRating } from "@/lib/reviews";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
  guestName: z.string().trim().max(80).optional(),
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
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid review." }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findFirst({ where: { id, status: "approved" }, select: { id: true } });
  if (!restaurant) return NextResponse.json({ message: "Restaurant not found." }, { status: 404 });

  const review = await prisma.review.create({
    data: { rating: parsed.data.rating, comment: parsed.data.comment, guestName: parsed.data.guestName || "Anonymous diner", status: "approved", restaurantId: id },
  });
  await refreshRestaurantRating(id);

  return NextResponse.json({ review, message: "Thanks for sharing your review!" }, { status: 201 });
}
