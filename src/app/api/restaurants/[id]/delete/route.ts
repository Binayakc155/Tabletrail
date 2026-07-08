import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { deleteOwnerRestaurant, getOwnerRestaurant } from "@/lib/restaurant-management";
import { isOwnerOrAdmin } from "@/lib/auth-roles";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentAppUser();

  if (!user || !isOwnerOrAdmin(user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  await ensureLocalUser(user);
  const restaurant = await getOwnerRestaurant(user.id, id);

  if (!restaurant) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  await deleteOwnerRestaurant(restaurant);

  return NextResponse.json({ success: true });
}
