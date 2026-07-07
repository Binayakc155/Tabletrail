import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";
import { restaurantFormSchema } from "@/lib/validators/restaurant";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ restaurant });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !isOwnerOrAdmin(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = restaurantFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!restaurant) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      address: parsed.data.address,
      phoneNumber: parsed.data.phoneNumber,
      openingHours: parsed.data.openingHours,
      cuisine: parsed.data.cuisine,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      slug: restaurant.slug,
      imageUrl: restaurant.imageUrl,
      city: restaurant.city,
    },
  });

  return NextResponse.json({ restaurant: updatedRestaurant });
}
