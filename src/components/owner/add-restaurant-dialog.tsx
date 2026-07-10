"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createRestaurantAction } from "@/actions/restaurant-actions";
import { RestaurantForm } from "@/components/restaurants/restaurant-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AddRestaurantDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (message: string) => void;
}) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 shadow-lg shadow-orange-950/20 hover:from-orange-600 hover:to-rose-700">
          <Plus className="h-4 w-4" />
          Add Restaurant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add restaurant</DialogTitle>
          <DialogDescription>Create a new venue listing for your owner portfolio.</DialogDescription>
        </DialogHeader>
        <RestaurantForm
          submitLabel="Save restaurant"
          onSubmit={createRestaurantAction}
          onSuccess={() => {
            onOpenChange(false);
            onSaved("Restaurant created successfully.");
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
