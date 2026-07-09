import { z } from "zod";

export const restaurantFormSchema = z.object({
  name: z.string().min(2, "Restaurant name is required.").max(120, "Restaurant name is too long."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(2000, "Description is too long."),
  address: z.string().min(5, "Address is required.").max(200, "Address is too long."),
  city: z.string().min(2, "City is required.").max(80, "City is too long."),
  contactEmail: z.union([z.email("Enter a valid contact email."), z.literal("")]).optional(),
  phoneNumber: z.string().min(7, "Phone number is required.").max(30, "Phone number is too long."),
  openingHours: z.string().min(5, "Opening hours are required.").max(120, "Opening hours are too long."),
  cuisine: z.string().min(2, "Cuisine is required.").max(80, "Cuisine is too long."),
  priceLevel: z.coerce.number().int().min(1, "Price range must be between 1 and 4.").max(4, "Price range must be between 1 and 4."),
  latitude: z.coerce.number().min(-90, "Latitude must be between -90 and 90.").max(90, "Latitude must be between -90 and 90."),
  longitude: z.coerce.number().min(-180, "Longitude must be between -180 and 180.").max(180, "Longitude must be between -180 and 180."),
});

export const restaurantUpdateSchema = restaurantFormSchema.extend({
  restaurantId: z.string().min(1, "Restaurant id is required."),
});

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;
export type RestaurantUpdateValues = z.infer<typeof restaurantUpdateSchema>;
