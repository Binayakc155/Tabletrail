import { NextResponse } from "next/server";

import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { restaurantFormSchema } from "@/lib/validators/restaurant";
import { createOwnerRestaurant } from "@/lib/restaurant-management";
import { listRestaurants } from "@/features/restaurants/data/restaurants";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const result = await listRestaurants(Object.fromEntries(url.searchParams));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const user = await getCurrentAppUser();

  if (!user || !isOwnerOrAdmin(user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = restaurantFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  await ensureLocalUser(user);
  const restaurant = await createOwnerRestaurant(user.id, parsed.data, "/uploads/restaurants/placeholder.png");

  return NextResponse.json({ restaurant }, { status: 201 });
}
