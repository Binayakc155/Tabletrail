import { Prisma } from "@prisma/client";

import { featuredRestaurants } from "@/features/restaurants/data/mock-restaurants";
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

function matchesMockRestaurant(restaurant: (typeof featuredRestaurants)[number], params: RestaurantSearchParams) {
  const query = params.q?.trim().toLowerCase();
  const cuisine = params.cuisine?.trim().toLowerCase();
  const minRating = toNumber(params.rating);
  const priceLevel = toNumber(params.price);

  if (query) {
    const haystack = [restaurant.name, restaurant.cuisine, restaurant.city, restaurant.address, restaurant.neighborhood, restaurant.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(query)) return false;
  }

  if (cuisine && restaurant.cuisine.toLowerCase() !== cuisine) return false;
  if (minRating !== undefined && restaurant.rating < minRating) return false;
  if (priceLevel !== undefined && restaurant.priceLevel !== priceLevel) return false;
  if (params.openNow === "true" && restaurant.openingHours?.toLowerCase().includes("closed")) return false;

  return true;
}

function sortMockRestaurants(restaurants: typeof featuredRestaurants, sort?: string) {
  const sorted = [...restaurants];

  if (sort === "rating") return sorted.sort((a, b) => b.rating - a.rating);
  if (sort === "reviews") return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  if (sort === "price_asc") return sorted.sort((a, b) => a.priceLevel - b.priceLevel);
  if (sort === "price_desc") return sorted.sort((a, b) => b.priceLevel - a.priceLevel);
  if (sort === "name") return sorted.sort((a, b) => a.name.localeCompare(b.name));

  return sorted;
}

function buildMockRestaurantList(params: RestaurantSearchParams) {
  const page = Math.max(toNumber(params.page) ?? 1, 1);
  const pageSize = 8;
  const filteredRestaurants = sortMockRestaurants(featuredRestaurants.filter((restaurant) => matchesMockRestaurant(restaurant, params)), params.sort);
  const cuisines = [...new Set(filteredRestaurants.map((restaurant) => restaurant.cuisine))].sort((a, b) => a.localeCompare(b));
  const start = (page - 1) * pageSize;

  return {
    restaurants: filteredRestaurants.slice(start, start + pageSize).map((restaurant) => ({
      ...restaurant,
      distanceMiles: null,
    })),
    cuisines,
    total: filteredRestaurants.length,
    page,
    pageSize,
    pageCount: Math.max(Math.ceil(filteredRestaurants.length / pageSize), 1),
  };
}

function buildMockRestaurantDetails(slug: string) {
  const restaurant = featuredRestaurants.find((item) => item.slug === slug);

  if (!restaurant) return null;

  return {
    id: restaurant.slug,
    slug: restaurant.slug,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address ?? `${restaurant.neighborhood ?? restaurant.city}, ${restaurant.city}`,
    city: restaurant.city,
    contactEmail: null,
    phoneNumber: "(555) 000-0000",
    openingHours: restaurant.openingHours ?? "Open daily",
    cuisine: restaurant.cuisine,
    priceLevel: restaurant.priceLevel,
    rating: restaurant.rating,
    reviewCount: restaurant.reviewCount,
    imageUrl: restaurant.imageUrl,
    latitude: null,
    longitude: null,
    status: "approved" as const,
    isFeatured: true,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: null,
    images: [{ id: `${restaurant.slug}-image`, url: restaurant.imageUrl, alt: restaurant.name }],
    menus: [
      {
        id: `${restaurant.slug}-menu`,
        title: "Signature dishes",
        imageUrl: null,
        categories: [],
        items: [],
      },
    ],
    reviews: [],
    favorites: [],
    ratingDistribution: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: rating === 5 ? restaurant.reviewCount : 0,
    })),
    recommended: featuredRestaurants.filter((item) => item.slug !== slug).slice(0, 4),
  };
}

function shouldUseMockRestaurantData() {
  return process.env.USE_MOCK_RESTAURANTS === "true";
}

export async function listRestaurants(params: RestaurantSearchParams = {}) {
  if (shouldUseMockRestaurantData()) {
    return buildMockRestaurantList(params);
  }

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

  try {
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
      imageUrl: restaurant.imageUrl,
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
  } catch (error) {
    console.warn("Falling back to featured restaurants because the database is unavailable.", error);
    return buildMockRestaurantList(params);
  }
}

export async function getRestaurantDetails(slug: string) {
  if (shouldUseMockRestaurantData()) {
    return buildMockRestaurantDetails(slug);
  }

  try {
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
      return buildMockRestaurantDetails(slug);
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
  } catch (error) {
    console.warn("Falling back to featured restaurants because the database is unavailable.", error);
    return buildMockRestaurantDetails(slug);
  }
}
