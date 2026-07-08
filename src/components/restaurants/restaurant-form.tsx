"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { restaurantFormSchema, type RestaurantFormValues } from "@/lib/validators/restaurant";

type RestaurantFormInput = z.input<typeof restaurantFormSchema>;

export function RestaurantForm({
  defaultValues,
  onSubmit,
  submitLabel,
  restaurantId,
}: {
  defaultValues?: Partial<RestaurantFormValues> & { imageUrl?: string };
  onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string } | void>;
  submitLabel: string;
  restaurantId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValues?.imageUrl ?? null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RestaurantFormInput, undefined, RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      address: defaultValues?.address ?? "",
      phoneNumber: defaultValues?.phoneNumber ?? "",
      openingHours: defaultValues?.openingHours ?? "",
      cuisine: defaultValues?.cuisine ?? "",
      latitude: defaultValues?.latitude ?? 0,
      longitude: defaultValues?.longitude ?? 0,
    },
  });

  async function handleSubmit(values: RestaurantFormValues) {
    setServerError(null);

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, String(value));
    });

    if (restaurantId) {
      formData.set("restaurantId", restaurantId);
    }

    const fileInput = document.querySelector<HTMLInputElement>("[data-restaurant-image]");
    const file = fileInput?.files?.[0];

    if (file) {
      formData.set("image", file);
    }

    startTransition(async () => {
      const result = await onSubmit(formData);

      if (result && !result.success) {
        setServerError(result.error ?? "Unable to save restaurant.");
      }
    });
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="name">Restaurant name</Label>
        <Input id="name" placeholder="Table Eight" {...form.register("name")} />
        {form.formState.errors.name ? <p className="text-sm text-destructive">{form.formState.errors.name.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Tell diners what makes this venue special." {...form.register("description")} />
        {form.formState.errors.description ? <p className="text-sm text-destructive">{form.formState.errors.description.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" placeholder="123 Main Street, City" {...form.register("address")} />
        {form.formState.errors.address ? <p className="text-sm text-destructive">{form.formState.errors.address.message}</p> : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input id="phoneNumber" placeholder="(555) 123-4567" {...form.register("phoneNumber")} />
          {form.formState.errors.phoneNumber ? <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cuisine">Cuisine</Label>
          <Input id="cuisine" placeholder="Japanese Fusion" {...form.register("cuisine")} />
          {form.formState.errors.cuisine ? <p className="text-sm text-destructive">{form.formState.errors.cuisine.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="openingHours">Opening hours</Label>
        <Input id="openingHours" placeholder="Mon-Sun: 11:00 AM - 10:00 PM" {...form.register("openingHours")} />
        {form.formState.errors.openingHours ? <p className="text-sm text-destructive">{form.formState.errors.openingHours.message}</p> : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" type="number" step="any" placeholder="37.7749" {...form.register("latitude", { valueAsNumber: true })} />
          {form.formState.errors.latitude ? <p className="text-sm text-destructive">{form.formState.errors.latitude.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" type="number" step="any" placeholder="-122.4194" {...form.register("longitude", { valueAsNumber: true })} />
          {form.formState.errors.longitude ? <p className="text-sm text-destructive">{form.formState.errors.longitude.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image">Restaurant image</Label>
        <Input id="image" data-restaurant-image type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setPreviewUrl(URL.createObjectURL(file));
          }
        }} />
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Upload className="h-3.5 w-3.5" />
          Upload a venue photo to show on the listing card.
        </p>
      </div>

      {previewUrl ? (
        <div className="overflow-hidden rounded-3xl border border-border">
          <img src={previewUrl} alt="Restaurant preview" className="h-60 w-full object-cover" />
        </div>
      ) : null}

      {serverError ? <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</div> : null}

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}
