"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, MoreHorizontal, ShieldCheck, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  status: "pending" | "approved" | "rejected";
  owner: { email: string } | null;
};

export function AdminConsole({ restaurants: initialRestaurants }: { restaurants: Restaurant[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [error, setError] = useState<string | null>(null);
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

  const approvedCount = restaurants.filter((item) => item.status === "approved").length;
  const pendingCount = restaurants.filter((item) => item.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F8FAFC]">
      <header className="border-b border-[#252C3D] bg-[#080B16]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8753F] text-xs font-bold text-white">TT</span>
            <span>TableTrail <span className="font-medium text-[#94A3B8]">Admin</span></span>
          </Link>
          <span className="inline-flex items-center gap-2 text-sm text-[#94A3B8]"><ShieldCheck className="h-4 w-4" /> Admin workspace</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[32px]">Restaurants</h1>
          <p className="text-sm leading-6 text-[#94A3B8]">Review restaurant listings and manage their publication status.</p>
        </div>

        {error ? <p role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

        <section aria-label="Restaurant statistics" className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total listings" value={restaurants.length} />
          <Stat label="Approved" value={approvedCount} tone="success" />
          <Stat label="Pending approval" value={pendingCount} />
        </section>

        <section className="mt-6 overflow-hidden rounded-[14px] border border-[#252C3D] bg-[#101522] shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
          <div className="flex items-center justify-between border-b border-[#252C3D] px-6 py-5">
            <div>
              <h2 className="text-base font-semibold">All restaurants</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">Approve new listings or manage an existing restaurant.</p>
            </div>
            <span className="text-sm text-[#94A3B8]">{restaurants.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-[#080B16]/40 text-xs font-medium uppercase tracking-[0.08em] text-[#94A3B8]">
                <tr><th className="px-6 py-3">Restaurant</th><th className="px-6 py-3">Owner/email</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-[#252C3D]">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4"><p className="font-medium text-[#F8FAFC]">{restaurant.name}</p><p className="mt-1 text-sm text-[#94A3B8]">{restaurant.cuisine}</p></td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">{restaurant.owner?.email ?? "No owner assigned"}</td>
                    <td className="px-6 py-4"><StatusBadge status={restaurant.status} /></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><RestaurantActions restaurant={restaurant} disabled={pending} onUpdate={updateRestaurant} onDelete={deleteRestaurant} /></div></td>
                  </tr>
                ))}
                {restaurants.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-[#94A3B8]">No restaurant listings found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#252C3D] px-4 py-5 text-sm text-[#94A3B8] sm:px-6 lg:px-8"><div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} TableTrail</p><nav className="flex gap-5"><Link href="/admin" className="hover:text-[#F8FAFC]">Restaurants</Link><Link href="/" className="hover:text-[#F8FAFC]">View site</Link></nav></div></footer>
    </div>
  );
}

function RestaurantActions({ restaurant, disabled, onUpdate, onDelete }: { restaurant: Restaurant; disabled: boolean; onUpdate: (id: string, status: Restaurant["status"]) => void; onDelete: (id: string, name: string) => void }) {
  if (restaurant.status === "pending") return <><Button size="sm" disabled={disabled} className="rounded-xl bg-[#E8753F] text-white hover:bg-[#d96835]" onClick={() => onUpdate(restaurant.id, "approved")}><Check className="h-4 w-4" />Approve</Button><Button size="sm" variant="outline" disabled={disabled} className="rounded-xl border-red-400/35 bg-transparent text-red-300 hover:bg-red-400/10 hover:text-red-200" onClick={() => onUpdate(restaurant.id, "rejected")}><X className="h-4 w-4" />Reject</Button></>;
  return <details className="relative"><summary className="flex h-9 cursor-pointer list-none items-center justify-center rounded-xl border border-[#252C3D] px-3 text-[#94A3B8] transition-colors hover:bg-white/[0.04] hover:text-[#F8FAFC]"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">More actions for {restaurant.name}</span></summary><div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-[#252C3D] bg-[#101522] p-1 shadow-xl"><button type="button" disabled={disabled} onClick={() => onDelete(restaurant.id, restaurant.name)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-4 w-4" />Delete</button></div></details>;
}

function StatusBadge({ status }: { status: Restaurant["status"] }) {
  const styles = status === "approved" ? "border-[#35B77A]/30 bg-[#35B77A]/10 text-[#71D7A5]" : status === "pending" ? "border-[#252C3D] bg-white/[0.04] text-[#CBD5E1]" : "border-red-400/30 bg-red-400/10 text-red-300";
  const label = status === "pending" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>{label}</span>;
}

function Stat({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "success" }) {
  const accent = tone === "success" ? "text-[#35B77A]" : "text-[#F8FAFC]";
  return <div className="rounded-[14px] border border-[#252C3D] bg-[#101522] p-5 shadow-[0_4px_14px_rgba(0,0,0,0.1)]"><p className="text-sm font-medium text-[#94A3B8]">{label}</p><p className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p></div>;
}
