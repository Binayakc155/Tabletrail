import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/auth";
import { deleteOwnerRestaurant, getOwnerRestaurant } from "@/lib/restaurant-management";
import { isOwnerOrAdmin } from "@/lib/auth-roles";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !isOwnerOrAdmin(session.user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const restaurant = await getOwnerRestaurant(session.user.id, id);

  if (!restaurant) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  await deleteOwnerRestaurant(restaurant);

  return NextResponse.json({ success: true });
}
