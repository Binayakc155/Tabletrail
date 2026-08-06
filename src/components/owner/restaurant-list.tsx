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
import { MenuManagementDialog } from "@/components/owner/menu-management-dialog";
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
  const [menuRestaurant, setMenuRestaurant] = useState<OwnerRestaurant | null>(null);
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
      <div className="flex flex-col gap-4 rounded-[16px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.28)] sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Restaurant management</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Restaurant portfolio</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">Manage live listings, menu updates, cover images, and review performance from a single workspace.</p>
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
              onMenu={setMenuRestaurant}
              onAnalytics={(item) => {
                showToast("success", `Analytics selected for ${item.name}.`);
                document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[16px] border border-dashed border-slate-300 bg-white/85 p-10 text-center shadow-[0_12px_32px_-24px_rgba(15,23,42,0.2)]">
          <div className="mx-auto mb-5 flex w-fit items-center justify-center rounded-[20px] border border-slate-200 bg-slate-50 p-4">
            <div className="relative h-16 w-24">
              <div className="absolute inset-x-0 bottom-0 h-10 rounded-[16px] border border-slate-200 bg-white shadow-sm" />
              <div className="absolute left-3 top-0 h-8 w-8 rounded-[12px] bg-slate-900" />
              <div className="absolute right-1 top-2 h-6 w-6 rounded-full border border-orange-200 bg-orange-100" />
              <Store className="absolute bottom-2 left-1/2 h-7 w-7 -translate-x-1/2 text-slate-600" />
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-950">You haven&apos;t added any restaurants yet.</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Create your first restaurant to start receiving reviews, favorites, and customer engagement data.</p>
          <div className="mt-6 flex justify-center">
            <Button className="rounded-[16px] bg-orange-500 px-5 text-white hover:bg-orange-600" onClick={() => setAddOpen(true)}>
              <Store className="h-4 w-4" />
              Add Restaurant
            </Button>
          </div>
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

      <MenuManagementDialog
        restaurant={menuRestaurant}
        open={Boolean(menuRestaurant)}
        onOpenChange={(open) => !open && setMenuRestaurant(null)}
        onChanged={() => router.refresh()}
      />

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
        <div className={cn("fixed right-4 top-20 z-50 rounded-[16px] border px-4 py-3 text-sm font-medium shadow-[0_16px_40px_-26px_rgba(15,23,42,0.35)] backdrop-blur", toast.type === "success" ? "border-emerald-200 bg-emerald-50/95 text-emerald-700" : "border-rose-200 bg-rose-50/95 text-rose-700")}>
          {toast.message}
        </div>
      ) : null}
    </section>
  );
}
