"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Store } from "lucide-react";

import { deleteRestaurantAction, updateRestaurantAction } from "@/actions/restaurant-actions";
import { AddRestaurantDialog } from "@/components/owner/add-restaurant-dialog";
import { RestaurantCard } from "@/components/owner/restaurant-card";
import { RestaurantFilters, type RestaurantSort, type RestaurantViewMode } from "@/components/owner/restaurant-filters";
import type { OwnerRestaurant } from "@/components/owner/types";
import { RestaurantForm } from "@/components/restaurants/restaurant-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function RestaurantList({ restaurants }: { restaurants: OwnerRestaurant[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<RestaurantSort>("newest");
  const [viewMode, setViewMode] = useState<RestaurantViewMode>("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<OwnerRestaurant | null>(null);
  const [deletingRestaurant, setDeletingRestaurant] = useState<OwnerRestaurant | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return restaurants
      .filter((restaurant) => {
        const matchesQuery = [restaurant.name, restaurant.cuisine, restaurant.address, restaurant.city].join(" ").toLowerCase().includes(normalizedQuery);
        const matchesStatus = status === "all" || restaurant.status === status;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sort === "newest" ? -diff : diff;
      });
  }, [query, restaurants, sort, status]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3200);
  }

  function handleDelete() {
    if (!deletingRestaurant) {
      return;
    }

    const formData = new FormData();
    formData.set("restaurantId", deletingRestaurant.id);

    startDeleteTransition(async () => {
      const result = await deleteRestaurantAction(formData);

      if (result && !result.success) {
        showToast("error", result.error ?? "Unable to delete restaurant.");
        return;
      }

      setDeletingRestaurant(null);
      showToast("success", "Restaurant deleted successfully.");
      router.refresh();
    });
  }

  return (
    <section id="restaurants" className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Restaurant management</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Restaurant entries</h2>
          <p className="mt-1 text-sm text-slate-500">Manage listings, images, status, menus, and performance shortcuts.</p>
        </div>
        <AddRestaurantDialog open={addOpen} onOpenChange={setAddOpen} onSaved={(message) => showToast("success", message)} />
      </div>

      <RestaurantFilters
        query={query}
        status={status}
        sort={sort}
        viewMode={viewMode}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onViewModeChange={setViewMode}
      />

      {filteredRestaurants.length ? (
        <div className={cn("grid gap-5", viewMode === "grid" ? "lg:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1")}>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              viewMode={viewMode}
              onEdit={setEditingRestaurant}
              onDelete={setDeletingRestaurant}
              onMenu={(item) => showToast("success", `Menu tools selected for ${item.name}.`)}
              onAnalytics={(item) => {
                showToast("success", `Analytics selected for ${item.name}.`);
                document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Store className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-950">No restaurants found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try adjusting the search or create your first listing from the Add Restaurant button.</p>
        </div>
      )}

      <Dialog open={Boolean(editingRestaurant)} onOpenChange={(open) => !open && setEditingRestaurant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit restaurant</DialogTitle>
            <DialogDescription>{editingRestaurant?.name}</DialogDescription>
          </DialogHeader>
          {editingRestaurant ? (
            <RestaurantForm
              submitLabel="Update restaurant"
              restaurantId={editingRestaurant.id}
              defaultValues={{
                name: editingRestaurant.name,
                description: editingRestaurant.description,
                address: editingRestaurant.address,
                city: editingRestaurant.city,
                contactEmail: editingRestaurant.contactEmail ?? "",
                phoneNumber: editingRestaurant.phoneNumber,
                openingHours: editingRestaurant.openingHours,
                cuisine: editingRestaurant.cuisine,
                priceLevel: editingRestaurant.priceLevel,
                latitude: editingRestaurant.latitude ?? 0,
                longitude: editingRestaurant.longitude ?? 0,
                imageUrl: editingRestaurant.imageUrl,
              }}
              onSubmit={async (formData) => {
                formData.set("restaurantId", editingRestaurant.id);
                return updateRestaurantAction(formData);
              }}
              onSuccess={() => {
                setEditingRestaurant(null);
                showToast("success", "Restaurant updated successfully.");
                router.refresh();
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingRestaurant)} onOpenChange={(open) => !open && setDeletingRestaurant(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete restaurant?</DialogTitle>
            <DialogDescription>This permanently removes {deletingRestaurant?.name ?? "this restaurant"} and its related listing data.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setDeletingRestaurant(null)}>
              Cancel
            </Button>
            <Button type="button" className="rounded-2xl bg-rose-600 hover:bg-rose-700" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast ? (
        <div className={cn("fixed right-4 top-20 z-50 rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur", toast.type === "success" ? "border-emerald-200 bg-emerald-50/95 text-emerald-700" : "border-rose-200 bg-rose-50/95 text-rose-700")}>
          {toast.message}
        </div>
      ) : null}
    </section>
  );
}
