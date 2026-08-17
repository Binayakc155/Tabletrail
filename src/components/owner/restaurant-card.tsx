"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, MapPin, MenuSquare, PencilLine, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OwnerRestaurant } from "@/components/owner/types";
import { cn } from "@/lib/utils";

const statusClassName: Record<string, string> = {
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export function RestaurantCard({
  restaurant,
  viewMode,
  onEdit,
  onDelete,
  onMenu,
}: {
  restaurant: OwnerRestaurant;
  viewMode: "grid" | "list";
  onEdit: (restaurant: OwnerRestaurant) => void;
  onDelete: (restaurant: OwnerRestaurant) => void;
  onMenu: (restaurant: OwnerRestaurant) => void;
}) {
  const isOpen = restaurant.status === "approved";

  return (
    <Card className={cn("group overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]", viewMode === "list" && "md:flex")}>
      <div className={cn("relative h-48 overflow-hidden", viewMode === "list" && "md:h-auto md:w-[18rem] md:shrink-0")}>
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/24 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border border-emerald-200 bg-emerald-50 text-emerald-700 backdrop-blur"
          >
            {isOpen ? "Open" : "Closed"}
          </Badge>
          <Badge variant="outline" className={cn("capitalize backdrop-blur", statusClassName[restaurant.status] ?? "border-slate-200 bg-slate-100 text-slate-700")}>
            {restaurant.status}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{restaurant.name}</h3>
              <p className="mt-1 text-sm font-medium text-orange-600">{restaurant.cuisine}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              {restaurant.rating ? restaurant.rating.toFixed(1) : "N/A"}
            </div>
          </div>

          <p className="flex items-start gap-2 text-sm leading-6 text-slate-500">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
            {restaurant.address}
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Reviews</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{restaurant.reviewCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Favorites</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{restaurant.favoritesCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Last updated</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(restaurant.updatedAt))}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 xl:grid-cols-4">
          <Button asChild type="button" variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white font-semibold transition-all duration-200 hover:bg-slate-50">
            <Link href={`/restaurants/${restaurant.slug}`}>
              <Eye className="h-4 w-4" />
              View
            </Link>
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white font-semibold transition-all duration-200 hover:bg-slate-50" onClick={() => onEdit(restaurant)}>
            <PencilLine className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white font-semibold transition-all duration-200 hover:bg-slate-50" onClick={() => onMenu(restaurant)}>
            <MenuSquare className="h-4 w-4" />
            Menu
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-rose-200 text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700" onClick={() => onDelete(restaurant)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
