import crypto from "crypto";
import path from "path";
import { mkdir, writeFile, unlink } from "fs/promises";

import type { Restaurant } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { RestaurantFormValues } from "@/lib/validators/restaurant";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "restaurants");

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildRestaurantSlug(name: string) {
  const baseSlug = slugify(name) || "restaurant";
  const uniqueSuffix = crypto.randomUUID().slice(0, 8);
  return `${baseSlug}-${uniqueSuffix}`;
}

export async function saveRestaurantImage(file: File, slug: string) {
  await mkdir(uploadDirectory, { recursive: true });

  const extension = path.extname(file.name) || ".png";
  const fileName = `${slug}-${Date.now()}${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const bytes = await file.arrayBuffer();

  await writeFile(filePath, Buffer.from(bytes));

  return `/uploads/restaurants/${fileName}`;
}

export async function replaceRestaurantImage(previousImageUrl: string | null, file: File, slug: string) {
  if (previousImageUrl) {
    const existingImagePath = path.join(process.cwd(), "public", previousImageUrl.replace(/^\//, ""));
    await unlink(existingImagePath).catch(() => undefined);
  }

  return saveRestaurantImage(file, slug);
}

export async function listOwnerRestaurants(ownerId: string) {
  return prisma.restaurant.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getOwnerRestaurant(ownerId: string, restaurantId: string) {
  return prisma.restaurant.findFirst({
    where: { id: restaurantId, ownerId },
  });
}

export async function createOwnerRestaurant(ownerId: string, values: RestaurantFormValues, imageUrl: string) {
  const slug = buildRestaurantSlug(values.name);

  return prisma.restaurant.create({
    data: {
      ownerId,
      slug,
      name: values.name,
      description: values.description,
      address: values.address,
      phoneNumber: values.phoneNumber,
      openingHours: values.openingHours,
      cuisine: values.cuisine,
      latitude: values.latitude,
      longitude: values.longitude,
      imageUrl,
      city: "",
    },
  });
}

export async function updateOwnerRestaurant(restaurant: Restaurant, values: RestaurantFormValues, imageUrl?: string) {
  return prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      name: values.name,
      description: values.description,
      address: values.address,
      phoneNumber: values.phoneNumber,
      openingHours: values.openingHours,
      cuisine: values.cuisine,
      latitude: values.latitude,
      longitude: values.longitude,
      imageUrl: imageUrl ?? restaurant.imageUrl,
      city: restaurant.city,
    },
  });
}

export async function deleteOwnerRestaurant(restaurant: Restaurant) {
  if (restaurant.imageUrl.startsWith("/uploads/restaurants/")) {
    const filePath = path.join(process.cwd(), "public", restaurant.imageUrl.replace(/^\//, ""));
    await unlink(filePath).catch(() => undefined);
  }

  return prisma.restaurant.delete({
    where: { id: restaurant.id },
  });
}
