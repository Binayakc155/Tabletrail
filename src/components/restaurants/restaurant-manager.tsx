"use client";

import { useState } from "react";
import { Trash2, PencilLine, Plus } from "lucide-react";

import { deleteRestaurantAction, createRestaurantAction, updateRestaurantAction } from "@/actions/restaurant-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantForm } from "@/components/restaurants/restaurant-form";

export function RestaurantManager({ restaurants }: { restaurants: Array<{ id: string; name: string; description: string; address: string; city: string; contactEmail: string | null; phoneNumber: string; openingHours: string; cuisine: string; priceLevel: number; latitude: number | null; longitude: number | null; imageUrl: string; slug: string; status: string; }> }) {
  const [editingRestaurant, setEditingRestaurant] = useState<string | null>(null);
  const activeRestaurant = restaurants.find((restaurant) => restaurant.id === editingRestaurant) ?? null;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add restaurant
          </CardTitle>
          <CardDescription>Create a new venue record for the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <RestaurantForm submitLabel="Save restaurant" onSubmit={createRestaurantAction} />
        </CardContent>
      </Card>

      {activeRestaurant ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PencilLine className="h-5 w-5 text-primary" />
              Edit restaurant
            </CardTitle>
            <CardDescription>{activeRestaurant.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <RestaurantForm
              submitLabel="Update restaurant"
              restaurantId={activeRestaurant.id}
              defaultValues={{
                name: activeRestaurant.name,
                description: activeRestaurant.description,
                address: activeRestaurant.address,
                city: activeRestaurant.city,
                contactEmail: activeRestaurant.contactEmail ?? "",
                phoneNumber: activeRestaurant.phoneNumber,
                openingHours: activeRestaurant.openingHours,
                cuisine: activeRestaurant.cuisine,
                priceLevel: activeRestaurant.priceLevel,
                latitude: activeRestaurant.latitude ?? 0,
                longitude: activeRestaurant.longitude ?? 0,
                imageUrl: activeRestaurant.imageUrl,
              }}
              onSubmit={async (formData) => {
                formData.set("restaurantId", activeRestaurant.id);
                return updateRestaurantAction(formData);
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">{restaurant.name}</p>
                <p className="text-sm text-muted-foreground">{restaurant.cuisine} · {restaurant.address}</p>
                <p className="text-sm text-muted-foreground">{restaurant.openingHours}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{restaurant.status}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" type="button" onClick={() => setEditingRestaurant(restaurant.id)}>
                  <PencilLine className="h-4 w-4" />
                  Edit
                </Button>
                <form
                  action={async (formData) => {
                    await deleteRestaurantAction(formData);
                  }}
                >
                  <input type="hidden" name="restaurantId" value={restaurant.id} />
                  <Button variant="outline" type="submit" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
