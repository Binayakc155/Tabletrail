import { Heart, Star, Store, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { OwnerStats } from "@/components/owner/types";

const cards = [
  {
    key: "totalRestaurants",
    label: "Total Restaurants",
    icon: Store,
    className: "from-orange-500 to-rose-600",
  },
  {
    key: "totalReviews",
    label: "Total Reviews",
    icon: Star,
    className: "from-amber-500 to-orange-600",
  },
  {
    key: "totalFavorites",
    label: "Total Favorites",
    icon: Heart,
    className: "from-fuchsia-500 to-rose-600",
  },
  {
    key: "averageRating",
    label: "Average Rating",
    icon: TrendingUp,
    className: "from-emerald-500 to-teal-600",
  },
] as const;

export function DashboardStats({ stats }: { stats: OwnerStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const rawValue = stats[card.key];
        const value = card.key === "averageRating" ? (rawValue ? rawValue.toFixed(1) : "N/A") : rawValue;

        return (
          <Card key={card.key} className="group overflow-hidden rounded-2xl border-white/70 bg-white/85 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
                </div>
                <div className={`rounded-2xl bg-gradient-to-br ${card.className} p-3 text-white shadow-lg shadow-slate-950/10`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
