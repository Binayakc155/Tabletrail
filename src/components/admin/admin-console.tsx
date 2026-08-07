"use client";

import { useState, useTransition } from "react";
import { Building2, Check, ShieldCheck, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

type Restaurant = { id: string; name: string; cuisine: string; status: "pending" | "approved" | "rejected"; owner: { email: string } | null };

export function AdminConsole({ usersCount, restaurants: initialRestaurants }: { usersCount: number; restaurants: Restaurant[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateRestaurant(id: string, status: Restaurant["status"]) {
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/admin/restaurants/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!response.ok) { setError("Unable to update restaurant status."); return; }
      setRestaurants((current) => current.map((restaurant) => restaurant.id === id ? { ...restaurant, status } : restaurant));
    });
  }

  function deleteRestaurant(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    startTransition(async () => {
      setError(null);
      const response = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
      if (!response.ok) { setError("Unable to delete restaurant."); return; }
      setRestaurants((current) => current.filter((restaurant) => restaurant.id !== id));
    });
  }

  const pendingCount = restaurants.filter((item) => item.status === "pending").length;
  return <section className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl space-y-8"><header className="flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">TableTrail control room</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Restaurant administration</h1><p className="mt-2 max-w-2xl text-slate-400">Approve restaurants, track their public status, or remove listings that should not remain on the platform.</p></div><div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"><ShieldCheck className="mr-2 inline h-4 w-4" /> Restricted access</div></header>
    {error ? <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-rose-100">{error}</p> : null}
    <div className="grid gap-4 sm:grid-cols-3"><Stat icon={Users} label="Platform users" value={usersCount} /><Stat icon={Building2} label="Restaurant listings" value={restaurants.length} /><Stat icon={ShieldCheck} label="Awaiting approval" value={pendingCount} /></div>
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="mb-5"><h2 className="text-lg font-semibold">Restaurant list</h2><p className="text-sm text-slate-400">Each listing shows its current publication status.</p></div><div className="space-y-3">{restaurants.map((restaurant) => <article key={restaurant.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-medium">{restaurant.name}</p><p className="text-sm text-slate-400">{restaurant.cuisine} · {restaurant.owner?.email ?? "No owner"}</p></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">{restaurant.status}</span><Button size="sm" className="bg-emerald-500 text-slate-950 hover:bg-emerald-400" disabled={pending || restaurant.status === "approved"} onClick={() => updateRestaurant(restaurant.id, "approved")}><Check className="h-4 w-4" /> Approve</Button><Button size="sm" variant="outline" className="border-rose-400/40 bg-transparent text-rose-200 hover:bg-rose-400/10" disabled={pending} onClick={() => deleteRestaurant(restaurant.id, restaurant.name)}><Trash2 className="h-4 w-4" /> Delete</Button></div></article>)}{restaurants.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">No restaurant listings found.</p> : null}</div></section></div></section>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) { return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><Icon className="h-5 w-5 text-cyan-400" /><p className="mt-5 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-slate-400">{label}</p></div>; }
