"use client";

import { Grid3X3, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type RestaurantViewMode = "grid" | "list";
export type RestaurantSort = "newest" | "oldest";

export function RestaurantFilters({
  query,
  status,
  sort,
  viewMode,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onViewModeChange,
}: {
  query: string;
  status: string;
  sort: RestaurantSort;
  viewMode: RestaurantViewMode;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: RestaurantSort) => void;
  onViewModeChange: (value: RestaurantViewMode) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[16px] border border-slate-200/80 bg-white/90 p-3 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.22)] backdrop-blur xl:grid-cols-[1fr_auto_auto_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search by name, cuisine, address..." className="h-11 rounded-[16px] border-slate-200 bg-white pl-11 shadow-none" />
      </div>
      <select value={status} onChange={(event) => onStatusChange(event.target.value)} className="h-11 rounded-[16px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <select value={sort} onChange={(event) => onSortChange(event.target.value as RestaurantSort)} className="h-11 rounded-[16px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
      <div className="grid grid-cols-2 rounded-[16px] border border-slate-200 bg-slate-50 p-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => onViewModeChange("grid")} className={cn("rounded-[14px]", viewMode === "grid" && "bg-white shadow-none ring-1 ring-slate-200")}>
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onViewModeChange("list")} className={cn("rounded-[14px]", viewMode === "list" && "bg-white shadow-none ring-1 ring-slate-200")}>
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
