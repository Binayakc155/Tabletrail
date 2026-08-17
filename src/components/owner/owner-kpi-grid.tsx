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
          <Card key={item.label} className="rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]">
            <CardContent className="flex min-h-36 items-start justify-between gap-4 p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">{item.value}</p>
                <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClassName}`}><Icon className="h-5 w-5" /></div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
