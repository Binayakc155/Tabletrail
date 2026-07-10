import { Activity, Heart, MessageCircle, Store } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OwnerStats } from "@/components/owner/types";

export function AnalyticsCards({ stats }: { stats: OwnerStats }) {
  const chart = [
    { label: "Restaurants", value: stats.totalRestaurants, icon: Store },
    { label: "Reviews", value: stats.totalReviews, icon: MessageCircle },
    { label: "Favorites", value: stats.totalFavorites, icon: Heart },
    { label: "Growth", value: stats.monthlyGrowth, icon: Activity },
  ];
  const max = Math.max(...chart.map((item) => item.value), 1);

  return (
    <section id="analytics" className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="rounded-2xl border-white/70 bg-white/85">
        <CardHeader>
          <CardTitle>Performance overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {chart.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <Icon className="h-4 w-4 text-orange-600" />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-950">{item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-600" style={{ width: `${Math.max((item.value / max) * 100, item.value ? 8 : 0)}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-white/70 bg-slate-950 text-white">
        <CardHeader>
          <CardTitle className="text-white">Monthly growth</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-semibold tracking-tight">{stats.monthlyGrowth}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">New restaurant listings added in the last 30 days.</p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
            Average rating: <span className="font-semibold text-white">{stats.averageRating ? stats.averageRating.toFixed(1) : "Not enough reviews"}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
