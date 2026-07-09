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
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("upload_preset", uploadPreset);
    formData.set("folder", "restaurants");
    formData.set("public_id", `${slug}-${Date.now()}`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Cloudinary image upload failed.");
    }

    const result = (await response.json()) as { secure_url?: string };

    if (!result.secure_url) {
      throw new Error("Cloudinary did not return an image URL.");
    }

    return result.secure_url;
  }

  await mkdir(uploadDirectory, { recursive: true });

  const extension = path.extname(file.name) || ".png";
  const fileName = `${slug}-${Date.now()}${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const bytes = await file.arrayBuffer();

  await writeFile(filePath, Buffer.from(bytes));

  return `/uploads/restaurants/${fileName}`;
}

export async function replaceRestaurantImage(previousImageUrl: string | null, file: File, slug: string) {
  if (previousImageUrl?.startsWith("/uploads/restaurants/")) {
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
      city: values.city,
      contactEmail: values.contactEmail || null,
      phoneNumber: values.phoneNumber,
      openingHours: values.openingHours,
      cuisine: values.cuisine,
      priceLevel: values.priceLevel,
      latitude: values.latitude,
      longitude: values.longitude,
      imageUrl,
      images: {
        create: {
          url: imageUrl,
          alt: values.name,
          isCover: true,
        },
      },
      menus: {
        create: {
          title: "Main menu",
        },
      },
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
      city: values.city,
      contactEmail: values.contactEmail || null,
      phoneNumber: values.phoneNumber,
      openingHours: values.openingHours,
      cuisine: values.cuisine,
      priceLevel: values.priceLevel,
      latitude: values.latitude,
      longitude: values.longitude,
      imageUrl: imageUrl ?? restaurant.imageUrl,
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
