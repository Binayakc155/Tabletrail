import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";
import { restaurantFormSchema } from "@/lib/validators/restaurant";
import { createOwnerRestaurant } from "@/lib/restaurant-management";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json({ restaurants });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !isOwnerOrAdmin(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = restaurantFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const restaurant = await createOwnerRestaurant(session.user.id, parsed.data, "/uploads/restaurants/placeholder.png");

  return NextResponse.json({ restaurant }, { status: 201 });
}
