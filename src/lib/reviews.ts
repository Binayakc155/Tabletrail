import { prisma } from "@/lib/prisma";

export async function refreshRestaurantRating(restaurantId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { restaurantId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      rating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating,
    },
  });
}
