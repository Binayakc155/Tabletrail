import { NextResponse } from "next/server";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;
  const user = await getCurrentAppUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  await prisma.favorite.deleteMany({
    where: { restaurantId, userId: user.id },
  });

  return NextResponse.json({ success: true });
}
