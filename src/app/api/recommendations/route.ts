import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const restaurantId = url.searchParams.get("restaurantId") ?? undefined;
  const cuisine = url.searchParams.get("cuisine") ?? undefined;

  const restaurants = await prisma.restaurant.findMany({
    where: {
      status: "approved",
      ...(restaurantId ? { id: { not: restaurantId } } : {}),
      ...(cuisine ? { OR: [{ cuisine }, { rating: { gte: 4 } }] } : {}),
    },
    orderBy: [{ rating: "desc" }, { viewCount: "desc" }, { reviewCount: "desc" }],
    take: 8,
  });

  return NextResponse.json({ restaurants });
}
