import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type RestaurantSearchParams = {
  q?: string;
  cuisine?: string;
  rating?: string;
  price?: string;
  openNow?: string;
  sort?: string;
  page?: string;
  lat?: string;
  lng?: string;
  distance?: string;
};

export type PublicRestaurant = Awaited<ReturnType<typeof listRestaurants>>["restaurants"][number];

const pageSize = 8;

function toNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function distanceInMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radius = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getOrderBy(sort?: string): Prisma.RestaurantOrderByWithRelationInput {
  if (sort === "rating") return { rating: "desc" };
  if (sort === "reviews") return { reviewCount: "desc" };
  if (sort === "price_asc") return { priceLevel: "asc" };
  if (sort === "price_desc") return { priceLevel: "desc" };
  if (sort === "name") return { name: "asc" };
  return { updatedAt: "desc" };
}

export async function listRestaurants(params: RestaurantSearchParams = {}) {
  const page = Math.max(toNumber(params.page) ?? 1, 1);
  const minRating = toNumber(params.rating);
  const priceLevel = toNumber(params.price);
  const userLat = toNumber(params.lat);
  const userLng = toNumber(params.lng);
  const maxDistance = toNumber(params.distance);

  const where: Prisma.RestaurantWhereInput = {
    status: "approved",
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { cuisine: { contains: params.q, mode: "insensitive" } },
            { address: { contains: params.q, mode: "insensitive" } },
            { city: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(params.cuisine ? { cuisine: { equals: params.cuisine, mode: "insensitive" } } : {}),
    ...(minRating ? { rating: { gte: minRating } } : {}),
    ...(priceLevel ? { priceLevel } : {}),
    ...(params.openNow === "true" ? { NOT: { openingHours: { contains: "closed", mode: "insensitive" } } } : {}),
  };

  const [rawRestaurants, total, cuisines] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      include: {
        images: { orderBy: [{ isCover: "desc" }, { createdAt: "asc" }] },
      },
      orderBy: getOrderBy(params.sort),
    }),
    prisma.restaurant.count({ where }),
    prisma.restaurant.findMany({
      where: { status: "approved" },
      distinct: ["cuisine"],
      select: { cuisine: true },
      orderBy: { cuisine: "asc" },
    }),
  ]);

  const withDistance = rawRestaurants.map((restaurant) => ({
    ...restaurant,
    imageUrl: restaurant.images[0]?.url ?? restaurant.imageUrl,
    distanceMiles:
      userLat !== undefined && userLng !== undefined && restaurant.latitude !== null && restaurant.longitude !== null
        ? distanceInMiles(userLat, userLng, restaurant.latitude, restaurant.longitude)
        : null,
  }));

  const distanceFiltered =
    maxDistance && userLat !== undefined && userLng !== undefined
      ? withDistance.filter((restaurant) => restaurant.distanceMiles !== null && restaurant.distanceMiles <= maxDistance)
      : withDistance;

  const sortedRestaurants =
    params.sort === "distance"
      ? [...distanceFiltered].sort((a, b) => (a.distanceMiles ?? Number.POSITIVE_INFINITY) - (b.distanceMiles ?? Number.POSITIVE_INFINITY))
      : distanceFiltered;

  const start = (page - 1) * pageSize;
  const restaurants = sortedRestaurants.slice(start, start + pageSize);

  return {
    restaurants,
    cuisines: cuisines.map((item) => item.cuisine),
    total: maxDistance ? sortedRestaurants.length : total,
    page,
    pageSize,
    pageCount: Math.max(Math.ceil((maxDistance ? sortedRestaurants.length : total) / pageSize), 1),
  };
}

export async function getRestaurantDetails(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      images: { orderBy: [{ isCover: "desc" }, { createdAt: "asc" }] },
      menus: {
        include: {
          categories: { orderBy: { sortOrder: "asc" }, include: { items: { orderBy: { sortOrder: "asc" } } } },
          items: { where: { categoryId: null }, orderBy: { sortOrder: "asc" } },
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
      },
      favorites: { select: { id: true } },
    },
  });

  if (!restaurant || restaurant.status !== "approved") {
    return null;
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { viewCount: { increment: 1 } },
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: restaurant.reviews.filter((review) => review.rating === rating).length,
  }));

  const recommended = await prisma.restaurant.findMany({
    where: {
      id: { not: restaurant.id },
      status: "approved",
      OR: [{ cuisine: restaurant.cuisine }, { rating: { gte: 4 } }],
    },
    orderBy: [{ cuisine: "asc" }, { rating: "desc" }, { viewCount: "desc" }],
    take: 4,
  });

  return {
    ...restaurant,
    ratingDistribution,
    recommended,
  };
}
