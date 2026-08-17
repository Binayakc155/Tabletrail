"use client";

import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { Check, MapPin, MoreHorizontal, ShieldCheck, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  status: "pending" | "approved" | "rejected";
  owner: { email: string } | null;
};

type RestaurantDetails = Restaurant & {
  description: string;
  address: string;
  city: string;
  contactEmail: string | null;
  phoneNumber: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  menus: Menu[];
};

type MenuItem = { id: string; name: string; description: string | null; price: number | string };
type Menu = { id: string; title: string; imageUrl: string | null; items: MenuItem[]; categories: { id: string; name: string; items: MenuItem[] }[] };

export function AdminConsole({ restaurants: initialRestaurants }: { restaurants: Restaurant[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [pending, startTransition] = useTransition();

  function updateRestaurant(id: string, status: Restaurant["status"]) {
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/admin/restaurants/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        setError("Unable to update restaurant status.");
        return;
      }
      setRestaurants((current) => current.map((restaurant) => restaurant.id === id ? { ...restaurant, status } : restaurant));
    });
  }

  function deleteRestaurant(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Unable to delete restaurant.");
        return;
      }
      setRestaurants((current) => current.filter((restaurant) => restaurant.id !== id));
    });
  }

  async function viewRestaurant(restaurant: Restaurant) {
    setError(null);
    setIsDetailsOpen(true);
    setIsLoadingDetails(true);
    setSelectedRestaurant(null);
    const [restaurantResponse, menusResponse] = await Promise.all([
      fetch(`/api/restaurants/${restaurant.id}`),
      fetch(`/api/restaurants/${restaurant.id}/menus`),
    ]);
    if (!restaurantResponse.ok || !menusResponse.ok) {
      setError("Unable to load restaurant details.");
      setIsDetailsOpen(false);
      setIsLoadingDetails(false);
      return;
    }
    const [{ restaurant: details }, { menus }] = await Promise.all([restaurantResponse.json(), menusResponse.json()]);
    setSelectedRestaurant({ ...details, menus, owner: restaurant.owner });
    setIsLoadingDetails(false);
  }

  const approvedCount = restaurants.filter((item) => item.status === "approved").length;
  const pendingCount = restaurants.filter((item) => item.status === "pending").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">TT</span>
            <span>TableTrail <span className="font-medium text-muted-foreground">Admin</span></span>
          </Link>
          <div className="flex items-center gap-4">
          
            <SignOutButton>
              <button type="button" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sign out</button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Administration</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[36px]">Restaurants</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Review restaurant listings, approve new submissions, and keep every published profile up to date.</p>
        </div>

        {error ? <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

        <section aria-label="Restaurant statistics" className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total listings" value={restaurants.length} />
          <Stat label="Approved" value={approvedCount} tone="success" />
          <Stat label="Pending approval" value={pendingCount} />
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)]">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-base font-semibold">All restaurants</h2>
              <p className="mt-1 text-sm text-muted-foreground">Approve new listings or manage an existing restaurant.</p>
            </div>
            <span className="text-sm text-muted-foreground">{restaurants.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-surface-alt text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                <tr><th className="px-6 py-3">Restaurant</th><th className="px-6 py-3">Owner/email</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="transition-colors hover:bg-accent/50">
                    <td className="px-6 py-4"><p className="font-medium text-foreground">{restaurant.name}</p><p className="mt-1 text-sm text-muted-foreground">{restaurant.cuisine}</p></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{restaurant.owner?.email ?? "No owner assigned"}</td>
                    <td className="px-6 py-4"><StatusBadge status={restaurant.status} /></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><RestaurantActions restaurant={restaurant} disabled={pending} onView={viewRestaurant} onUpdate={updateRestaurant} onDelete={deleteRestaurant} /></div></td>
                  </tr>
                ))}
                {restaurants.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">No restaurant listings found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-border px-4 py-5 text-sm text-muted-foreground sm:px-6 lg:px-8"><div className="mx-auto w-full max-w-7xl"><p>© {new Date().getFullYear()} TableTrail administration</p></div></footer>

      <RestaurantDetailsDialog restaurant={selectedRestaurant} open={isDetailsOpen} loading={isLoadingDetails} onOpenChange={setIsDetailsOpen} />
    </div>
  );
}

function RestaurantActions({ restaurant, disabled, onView, onUpdate, onDelete }: { restaurant: Restaurant; disabled: boolean; onView: (restaurant: Restaurant) => void; onUpdate: (id: string, status: Restaurant["status"]) => void; onDelete: (id: string, name: string) => void }) {
  const viewButton = <Button size="sm" variant="outline" className="rounded-lg border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent" onClick={() => onView(restaurant)}>Details</Button>;
  if (restaurant.status === "pending") return <>{viewButton}<Button size="sm" disabled={disabled} className="rounded-lg" onClick={() => onUpdate(restaurant.id, "approved")}><Check className="h-4 w-4" />Approve</Button><Button size="sm" variant="outline" disabled={disabled} className="rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onUpdate(restaurant.id, "rejected")}><X className="h-4 w-4" />Reject</Button></>;
  return <>{viewButton}<details className="relative"><summary className="flex h-9 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-card px-3 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">More actions for {restaurant.name}</span></summary><div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-border bg-card p-1 shadow-lg"><button type="button" disabled={disabled} onClick={() => onDelete(restaurant.id, restaurant.name)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"><Trash2 className="h-4 w-4" />Delete</button></div></details></>;
}

function RestaurantDetailsDialog({ restaurant, open, loading, onOpenChange }: { restaurant: RestaurantDetails | null; open: boolean; loading: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-3xl border-border bg-card text-foreground shadow-2xl [&>button]:text-muted-foreground [&>button:hover]:bg-accent [&>button:hover]:text-foreground"><DialogHeader><DialogTitle>{loading ? "Loading restaurant" : restaurant?.name}</DialogTitle><DialogDescription>{loading ? "Retrieving listing details…" : "Restaurant listing details"}</DialogDescription></DialogHeader>{loading ? <div className="py-10 text-sm text-muted-foreground">Loading details…</div> : restaurant ? <div className="space-y-6"><Image src={restaurant.imageUrl} alt={`${restaurant.name} cover`} width={1200} height={525} unoptimized className="aspect-[16/7] w-full rounded-xl border border-border object-cover" /><div className="grid gap-4 border-y border-border py-5 sm:grid-cols-2"><Detail label="Owner email" value={restaurant.owner?.email ?? "No owner assigned"} /><Detail label="Contact email" value={restaurant.contactEmail ?? "Not provided"} /><Detail label="Phone" value={restaurant.phoneNumber} /><Detail label="Hours" value={restaurant.openingHours} /><Detail label="Food" value={restaurant.cuisine} /><Detail label="Rating" value={`${restaurant.rating.toFixed(1)} · ${restaurant.reviewCount} reviews`} /></div><div><p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Address</p><p className="mt-2 flex items-start gap-2 text-sm leading-6"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{restaurant.address}{restaurant.city ? `, ${restaurant.city}` : ""}</p></div><div><p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Description</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{restaurant.description}</p></div><MenuDetails menus={restaurant.menus} /></div> : null}</DialogContent></Dialog>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</p><p className="mt-1.5 break-words text-sm">{value}</p></div>; }

function MenuDetails({ menus }: { menus: Menu[] }) {
  return <section className="border-t border-border pt-5"><p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Menus</p>{menus.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No menu has been added yet.</p> : <div className="mt-4 space-y-5">{menus.map((menu) => <div key={menu.id} className="rounded-xl border border-border bg-surface-alt/40 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-medium">{menu.title}</h3><MenuItems items={menu.items} /></div>{menu.imageUrl ? <a href={menu.imageUrl} target="_blank" rel="noreferrer" className="shrink-0"><Image src={menu.imageUrl} alt={`${menu.title} menu`} width={160} height={192} unoptimized className="h-24 w-20 rounded-lg border border-border object-cover" /></a> : null}</div>{menu.categories.map((category) => <div key={category.id} className="mt-4 border-t border-border pt-4"><p className="text-sm font-medium">{category.name}</p><MenuItems items={category.items} /></div>)}</div>)}</div>}</section>;
}

function MenuItems({ items }: { items: MenuItem[] }) { return items.length ? <ul className="mt-3 space-y-2">{items.map((item) => <li key={item.id} className="flex items-start justify-between gap-4 text-sm"><div><p>{item.name}</p>{item.description ? <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}</div><span className="whitespace-nowrap text-muted-foreground">{Number(item.price).toFixed(2)}</span></li>)}</ul> : null; }

function StatusBadge({ status }: { status: Restaurant["status"] }) {
  const styles = status === "approved" ? "border-emerald-600/20 bg-emerald-50 text-emerald-700" : status === "pending" ? "border-primary/20 bg-primary/10 text-primary" : "border-destructive/20 bg-destructive/10 text-destructive";
  const label = status === "pending" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>{label}</span>;
}

function Stat({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "success" }) {
  const accent = tone === "success" ? "text-emerald-700" : "text-foreground";
  return <div className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)]"><p className="text-sm font-medium text-muted-foreground">{label}</p><p className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p></div>;
}
