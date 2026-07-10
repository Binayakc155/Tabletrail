"use client";

import Image from "next/image";
import { BarChart3, MapPin, MenuSquare, PencilLine, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OwnerRestaurant } from "@/components/owner/types";
import { cn } from "@/lib/utils";

const statusClassName: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  pending: "bg-amber-500/15 text-amber-700 border-amber-200",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-200",
};

export function RestaurantCard({
  restaurant,
  viewMode,
  onEdit,
  onDelete,
  onMenu,
  onAnalytics,
}: {
  restaurant: OwnerRestaurant;
  viewMode: "grid" | "list";
  onEdit: (restaurant: OwnerRestaurant) => void;
  onDelete: (restaurant: OwnerRestaurant) => void;
  onMenu: (restaurant: OwnerRestaurant) => void;
  onAnalytics: (restaurant: OwnerRestaurant) => void;
}) {
  return (
    <Card className={cn("group overflow-hidden rounded-2xl border-white/70 bg-white/90 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/10", viewMode === "list" && "md:flex")}>
      <div className={cn("relative h-56 overflow-hidden", viewMode === "list" && "md:h-auto md:w-72 md:shrink-0")}>
        <Image src={restaurant.imageUrl} alt={restaurant.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 360px" />
        <div className="absolute left-4 top-4">
          <Badge variant="outline" className={cn("border bg-white/90 capitalize backdrop-blur", statusClassName[restaurant.status] ?? "bg-slate-100 text-slate-700")}>
            {restaurant.status}
          </Badge>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-5 p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{restaurant.name}</h3>
              <p className="mt-1 text-sm font-medium text-orange-600">{restaurant.cuisine}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              {restaurant.rating ? restaurant.rating.toFixed(1) : "N/A"}
            </div>
          </div>
          <p className="flex items-start gap-2 text-sm leading-6 text-slate-500">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
            {restaurant.address}
          </p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={() => onEdit(restaurant)}>
            <PencilLine className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => onDelete(restaurant)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={() => onMenu(restaurant)}>
            <MenuSquare className="h-4 w-4" />
            Menu
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={() => onAnalytics(restaurant)}>
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
