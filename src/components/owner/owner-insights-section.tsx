"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MessageSquareText, RefreshCw, Store, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SeriesPoint = {
  label: string;
  value: number;
};

function buildLinePath(values: number[]) {
  const maxValue = Math.max(...values, 1);

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 42 - (value / maxValue) * 30;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[]) {
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 100;
    const y = 42 - (value / maxValue) * 30;
    return { x, y };
  });

  return `M 0 42 L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L 100 42 Z`;
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(value);
}

function ChartShell({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[16px] border border-slate-200/80 bg-white/92 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-24px_rgba(15,23,42,0.24)]">
      <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-950">{title}</CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-500">{subtitle}</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-[999px] border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">{children}</CardContent>
    </Card>
  );
}

function ActivityRow({
  title,
  description,
  meta,
  actor,
  initials,
  status,
  time,
  tone,
}: {
  title: string;
  description: string;
  meta: string;
  actor?: string;
  initials?: string;
  status?: string;
  time?: string;
  tone: "emerald" | "orange" | "slate" | "amber" | "rose";
}) {
  const toneClasses = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  } as const;

  return (
    <div className="flex gap-3 rounded-[16px] border border-slate-100 bg-slate-50/70 p-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border ${toneClasses[tone]}`}>
        <span className="text-xs font-semibold">{initials}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{actor}</p>
            <p className="text-sm font-semibold text-slate-950">{title}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge variant="outline" className="rounded-[999px] border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
              {status}
            </Badge>
            <span className="text-[11px] text-slate-500">{time}</span>
          </div>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{meta}</p>
      </div>
    </div>
  );
}

function ChartPointLegend({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className={"rounded-[14px] border px-3 py-2 transition " + (active ? "border-slate-300 bg-white" : "border-slate-200 bg-slate-50/60")}> 
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InteractiveLineChart({
  title,
  subtitle,
  badge,
  points,
  tone,
  formatValue,
}: {
  title: string;
  subtitle: string;
  badge: string;
  points: SeriesPoint[];
  tone: "slate" | "emerald";
  formatValue: (value: number) => string;
}) {
  const [activeIndex, setActiveIndex] = useState(points.length - 1);
  const values = useMemo(() => points.map((point) => point.value), [points]);
  const path = useMemo(() => buildLinePath(values), [values]);
  const areaPath = useMemo(() => buildAreaPath(values), [values]);
  const activePoint = points[activeIndex] ?? points[points.length - 1];

  return (
    <ChartShell title={title} subtitle={subtitle} badge={badge}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-100 bg-slate-50/60 p-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Selected</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{activePoint?.label ?? "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Value</p>
            <p className={tone === "emerald" ? "mt-1 text-sm font-semibold text-emerald-600" : "mt-1 text-sm font-semibold text-slate-950"}>{activePoint ? formatValue(activePoint.value) : "—"}</p>
          </div>
        </div>

        <div className="relative h-44 rounded-[16px] border border-slate-100 bg-slate-50/70 p-3">
          <svg viewBox="0 0 100 42" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={`${title.replace(/\s+/g, "-").toLowerCase()}-gradient`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={tone === "emerald" ? "#10B981" : "#334155"} stopOpacity="0.22" />
                <stop offset="100%" stopColor={tone === "emerald" ? "#10B981" : "#334155"} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((row) => (
              <line key={row} x1="0" y1={10 * row + 4} x2="100" y2={10 * row + 4} stroke="rgba(148,163,184,0.14)" strokeWidth="0.5" />
            ))}
            <path d={areaPath} fill={`url(#${title.replace(/\s+/g, "-").toLowerCase()}-gradient)`} />
            <polyline points={path} fill="none" stroke={tone === "emerald" ? "#10B981" : "#334155"} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="absolute inset-0 grid grid-cols-6 gap-0">
            {points.map((point, index) => (
              <button
                key={point.label}
                type="button"
                className="group relative"
                aria-label={`${point.label}: ${formatValue(point.value)}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <span className={"absolute bottom-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white transition " + (index === activeIndex ? "bg-white ring-4 ring-slate-300" : "bg-slate-400/50 opacity-0 group-hover:opacity-100") } />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {points.slice(-3).map((point, index) => (
            <ChartPointLegend key={point.label} label={point.label} value={formatValue(point.value)} active={index === 2} />
          ))}
        </div>
      </div>
    </ChartShell>
  );
}

function InteractiveBarChart({
  title,
  subtitle,
  badge,
  points,
  formatValue,
}: {
  title: string;
  subtitle: string;
  badge: string;
  points: SeriesPoint[];
  formatValue: (value: number) => string;
}) {
  const [activeIndex, setActiveIndex] = useState(points.length - 1);
  const activePoint = points[activeIndex] ?? points[points.length - 1];
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <ChartShell title={title} subtitle={subtitle} badge={badge}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-100 bg-slate-50/60 p-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Selected month</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{activePoint?.label ?? "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Revenue</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{activePoint ? formatValue(activePoint.value) : "—"}</p>
          </div>
        </div>

        <div className="flex h-44 items-end gap-2 rounded-[16px] border border-slate-100 bg-slate-50/70 p-3">
          {points.map((point, index) => {
            const height = Math.max((point.value / maxValue) * 100, 16);

            return (
              <button
                key={point.label}
                type="button"
                className="group flex flex-1 flex-col items-center gap-2 focus:outline-none"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                aria-label={`${point.label}: ${formatValue(point.value)}`}
              >
                <div className="flex h-28 w-full items-end justify-center">
                  <div
                    className={"w-full rounded-t-[12px] transition duration-300 " + (index === activeIndex ? "bg-slate-900" : "bg-slate-400/70 group-hover:bg-slate-600")}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-500">{point.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </ChartShell>
  );
}

function InteractiveDonutChart({
  title,
  subtitle,
  badge,
  distribution,
  averageRating,
}: {
  title: string;
  subtitle: string;
  badge: string;
  distribution: Array<{ label: string; value: number; color: string }>;
  averageRating: number | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = Math.max(distribution.reduce((sum, item) => sum + item.value, 0), 1);
  const activeSlice = distribution[activeIndex] ?? distribution[0];
  const gradient = distribution
    .map((item, index) => {
      const before = distribution.slice(0, index).reduce((sum, current) => sum + current.value, 0);
      const start = (before / total) * 100;
      const end = ((before + item.value) / total) * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <ChartShell title={title} subtitle={subtitle} badge={badge}>
      <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full border border-white bg-white">
            <div className="text-center">
              <p className="text-2xl font-semibold tracking-tight text-slate-950">{averageRating ? averageRating.toFixed(1) : "—"}</p>
              <p className="text-xs text-slate-500">avg rating</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {distribution.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={"flex w-full items-center justify-between rounded-[14px] border px-3 py-2 text-left transition " + (index === activeIndex ? "border-slate-300 bg-white" : "border-slate-100 bg-slate-50/60 hover:bg-slate-50")}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="text-sm font-semibold text-slate-950">{item.value}</span>
            </button>
          ))}
          <div className="rounded-[14px] border border-slate-100 bg-slate-50/70 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">Selected segment</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{activeSlice?.label ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">{activeSlice ? `${Math.round((activeSlice.value / total) * 100)}% of all reviews` : "No review data yet"}</p>
          </div>
        </div>
      </div>
    </ChartShell>
  );
}

export function OwnerInsightsSection({
  restaurantGrowth,
  reviewsOverTime,
  revenueOverTime,
  ratingDistribution,
  activityItems,
  averageRating,
  totalReviews,
}: {
  restaurantGrowth: number[];
  reviewsOverTime: number[];
  revenueOverTime: number[];
  ratingDistribution: Array<{ label: string; value: number; color: string }>;
  activityItems: Array<{
    title: string;
    description: string;
    meta: string;
    tone: "emerald" | "orange" | "slate" | "amber" | "rose";
  }>;
  averageRating: number | null;
  totalReviews: number;
}) {
  const growthPoints = useMemo<SeriesPoint[]>(() => restaurantGrowth.map((value, index) => ({ label: `M${index + 1}`, value })), [restaurantGrowth]);
  const reviewPoints = useMemo<SeriesPoint[]>(() => reviewsOverTime.map((value, index) => ({ label: `W${index + 1}`, value })), [reviewsOverTime]);
  const revenuePoints = useMemo<SeriesPoint[]>(() => revenueOverTime.map((value, index) => ({ label: `W${index + 1}`, value })), [revenueOverTime]);

  return (
    <section id="analytics" className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <InteractiveLineChart
              title="Restaurant Growth"
              subtitle="Monthly growth across your active portfolio"
              badge="Line chart"
              points={growthPoints}
              tone="slate"
              formatValue={(value) => `${value}`}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <InteractiveLineChart
              title="Reviews Over Time"
              subtitle="Review momentum from your customer base"
              badge="Area chart"
              points={reviewPoints}
              tone="emerald"
              formatValue={(value) => `${value}`}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <InteractiveBarChart
              title="Monthly Revenue"
              subtitle="Projected restaurant revenue performance"
              badge="Bar chart"
              points={revenuePoints}
              formatValue={(value) => formatCompactCurrency(value)}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <InteractiveDonutChart
              title="Rating Distribution"
              subtitle="Review quality across your listings"
              badge="Donut chart"
              distribution={ratingDistribution}
              averageRating={averageRating}
            />
          </div>
        </div>
      </div>

      <div id="reviews" className="col-span-12 xl:col-span-4">
        <Card className="h-full overflow-hidden rounded-[16px] border border-slate-200/80 bg-white/92 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.26)]">
          <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold text-slate-950">Recent activity</CardTitle>
                <CardDescription className="mt-1 text-sm text-slate-500">A live view of restaurant operations and customer engagement.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-[999px] border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                Live feed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-5">
            {activityItems.map((item) => (
              <ActivityRow key={item.title} {...item} />
            ))}
            <div className="rounded-[16px] border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-slate-600">
                  <RefreshCw className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-950">System sync</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Your restaurant data is kept current with Clerk, Prisma, and live refresh events.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
