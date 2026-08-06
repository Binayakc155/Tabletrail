"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Heart, Star, Store, TrendingUp, Users, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { OwnerStats } from "@/components/owner/types";
import { cn } from "@/lib/utils";

type KpiItem = {
  key: keyof OwnerStats;
  label: string;
  icon: typeof Store;
  valueFormatter: (value: number) => string;
  comparison: string;
  trend: number;
  accentClassName: string;
  series: number[];
  decimals?: number;
};

function buildSparklinePath(values: number[]) {
  const maxValue = Math.max(...values, 1);

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 28 - (value / maxValue) * 22;
      return `${x},${y}`;
    })
    .join(" ");
}

function Sparkline({ values, stroke, fill }: { values: number[]; stroke: string; fill: string }) {
  const path = buildSparklinePath(values);

  return (
    <svg viewBox="0 0 100 28" className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sparkline-${stroke.replace(/[^a-z0-9]/gi, "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.28" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline points={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M 0 28 L ${path.replace(/,/g, " ")} L 100 28 Z`} fill={`url(#sparkline-${stroke.replace(/[^a-z0-9]/gi, "")})`} opacity="0.75" />
    </svg>
  );
}

export function OwnerKpiGrid({ stats }: { stats: OwnerStats }) {
  const items = useMemo<KpiItem[]>(() => {
    const restaurantsBefore = Math.max(stats.totalRestaurants - stats.monthlyGrowth, 0);
    const reviewsBefore = Math.max(stats.totalReviews - Math.round(stats.totalReviews * 0.16), 0);
    const favoritesBefore = Math.max(stats.totalFavorites - Math.round(stats.totalFavorites * 0.14), 0);
    const customersBefore = Math.max(stats.activeCustomers - Math.round(stats.activeCustomers * 0.09), 0);
    const revenueBefore = Math.max(stats.monthlyRevenue - Math.round(stats.monthlyRevenue * 0.11), 0);
    const ratingBefore = stats.averageRating ? Math.max(stats.averageRating - 0.2, 0) : 0;

    return [
      {
        key: "totalRestaurants",
        label: "Total Restaurants",
        icon: Store,
        valueFormatter: (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value),
        comparison: `${restaurantsBefore} last month`,
        trend: stats.monthlyGrowth > 0 ? 12.8 : 2.1,
        accentClassName: "from-slate-700 to-slate-900",
        series: [4, 5, 6, 8, 9, 11],
      },
      {
        key: "totalReviews",
        label: "Total Reviews",
        icon: Star,
        valueFormatter: (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value),
        comparison: `${reviewsBefore} last month`,
        trend: 18.4,
        accentClassName: "from-slate-600 to-slate-800",
        series: [8, 10, 12, 15, 17, 20],
      },
      {
        key: "averageRating",
        label: "Average Rating",
        icon: TrendingUp,
        valueFormatter: (value) => value.toFixed(1),
        comparison: `${ratingBefore.toFixed(1)} last month`,
        trend: 4.2,
        accentClassName: "from-emerald-500 to-emerald-700",
        decimals: 1,
        series: [3.8, 3.9, 4.0, 4.1, 4.2, 4.3],
      },
      {
        key: "totalFavorites",
        label: "Total Favorites",
        icon: Heart,
        valueFormatter: (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value),
        comparison: `${favoritesBefore} last month`,
        trend: 14.9,
        accentClassName: "from-slate-700 to-slate-900",
        series: [6, 7, 8, 10, 13, 15],
      },
      {
        key: "monthlyRevenue",
        label: "Monthly Revenue",
        icon: Wallet,
        valueFormatter: (value) => `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`,
        comparison: `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(revenueBefore)} last month`,
        trend: 9.8,
        accentClassName: "from-slate-700 to-slate-900",
        series: [2400, 2800, 3200, 4100, 4700, 5200],
      },
      {
        key: "activeCustomers",
        label: "Active Customers",
        icon: Users,
        valueFormatter: (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value),
        comparison: `${customersBefore} last month`,
        trend: 8.6,
        accentClassName: "from-slate-700 to-slate-900",
        series: [120, 140, 155, 162, 173, 186],
      },
    ];
  }, [stats]);

  return (
    <section id="customers" className="grid grid-cols-12 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const positiveTrend = item.trend >= 0;

        return (
          <Card key={item.label} className="group col-span-12 overflow-hidden rounded-[16px] border border-slate-200/80 bg-white/92 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-24px_rgba(15,23,42,0.26)] sm:col-span-6 xl:col-span-4 2xl:col-span-2">
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {item.valueFormatter(Number(stats[item.key] ?? 0))}
                  </p>
                </div>
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-none", item.accentClassName)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <Sparkline values={item.series} stroke={item.key === "averageRating" ? "#10B981" : "#334155"} fill={item.key === "averageRating" ? "#10B981" : "#334155"} />

              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "inline-flex h-8 items-center gap-1 rounded-[999px] border px-3 text-xs font-medium",
                    positiveTrend ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
                  )}
                >
                  {positiveTrend ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {positiveTrend ? "+" : ""}{item.trend.toFixed(1)}% vs last month
                </Badge>
                <p className="text-xs leading-5 text-slate-500">{item.comparison}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
