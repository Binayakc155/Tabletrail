import { Eye, MessageSquareText, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { OwnerStats } from "@/components/owner/types";

export function OwnerKpiGrid({ stats }: { stats: OwnerStats }) {
  const items = [
    {
      label: "Average Rating",
      value: stats.averageRating ? stats.averageRating.toFixed(1) : "No ratings yet",
      detail: stats.totalReviews ? `Based on ${stats.totalReviews} reviews` : "Awaiting diner feedback",
      icon: Star,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      label: "Reviews",
      value: new Intl.NumberFormat("en-US").format(stats.totalReviews),
      detail: "Customer feedback received",
      icon: MessageSquareText,
      iconClassName: "bg-orange-50 text-orange-600",
    },
    {
      label: "Restaurant Views",
      value: new Intl.NumberFormat("en-US").format(stats.restaurantViews),
      detail: "Views across your listings",
      icon: Eye,
      iconClassName: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="rounded-xl border border-[#E5E7EB] bg-white shadow-none">
            <CardContent className="flex items-start justify-between gap-4 p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">{item.value}</p>
                <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconClassName}`}><Icon className="h-5 w-5" /></div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
