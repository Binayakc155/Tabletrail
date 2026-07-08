"use server";

import { revalidatePath } from "next/cache";

import { ensureLocalUser, requireAppUser } from "@/lib/clerk-auth";
import { createOwnerRestaurant, deleteOwnerRestaurant, getOwnerRestaurant, listOwnerRestaurants, replaceRestaurantImage, updateOwnerRestaurant } from "@/lib/restaurant-management";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { restaurantFormSchema, restaurantUpdateSchema } from "@/lib/validators/restaurant";

async function requireOwnerSession() {
  const user = await requireAppUser();

  if (!isOwnerOrAdmin(user.role)) {
    throw new Error("You are not allowed to manage restaurants.");
  }

  await ensureLocalUser(user);

  return user;
}

export async function getRestaurantsForOwner() {
  const user = await requireOwnerSession();
  return listOwnerRestaurants(user.id);
}

export async function getRestaurantForOwner(restaurantId: string) {
  const user = await requireOwnerSession();
  return getOwnerRestaurant(user.id, restaurantId);
}

export async function createRestaurantAction(formData: FormData) {
  const user = await requireOwnerSession();
  const image = formData.get("image");

  const parsed = restaurantFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    phoneNumber: formData.get("phoneNumber"),
    openingHours: formData.get("openingHours"),
    cuisine: formData.get("cuisine"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid restaurant data." };
  }

  if (!(image instanceof File) || image.size === 0) {
    return { success: false, error: "Restaurant image is required." };
  }

  const imageUrl = await replaceRestaurantImage(null, image, parsed.data.name);

  await createOwnerRestaurant(user.id, parsed.data, imageUrl);
  revalidatePath("/owner");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateRestaurantAction(formData: FormData) {
  const user = await requireOwnerSession();
  const restaurantId = String(formData.get("restaurantId") ?? "");
  const restaurant = await getOwnerRestaurant(user.id, restaurantId);

  if (!restaurant) {
    return { success: false, error: "Restaurant not found." };
  }

  const image = formData.get("image");
  const parsed = restaurantUpdateSchema.safeParse({
    restaurantId,
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    phoneNumber: formData.get("phoneNumber"),
    openingHours: formData.get("openingHours"),
    cuisine: formData.get("cuisine"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid restaurant data." };
  }

  let imageUrl: string | undefined;

  if (image instanceof File && image.size > 0) {
    imageUrl = await replaceRestaurantImage(restaurant.imageUrl, image, parsed.data.name);
  }

  await updateOwnerRestaurant(restaurant, parsed.data, imageUrl);
  revalidatePath("/owner");
  revalidatePath("/dashboard");
  revalidatePath(`/restaurants/${restaurant.slug}`);

  return { success: true };
}

export async function deleteRestaurantAction(formData: FormData) {
  const user = await requireOwnerSession();
  const restaurantId = String(formData.get("restaurantId") ?? "");
  const restaurant = await getOwnerRestaurant(user.id, restaurantId);

  if (!restaurant) {
    return { success: false, error: "Restaurant not found." };
  }

  await deleteOwnerRestaurant(restaurant);
  revalidatePath("/owner");
  revalidatePath("/dashboard");

  return { success: true };
}
