"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { BarChart3, LayoutDashboard, LogOut, MenuSquare, MessageSquareText, Settings, Store } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/owner", icon: LayoutDashboard },
  { label: "Restaurants", href: "/owner#restaurants", icon: Store },
  { label: "Menu Management", href: "/owner#restaurants", icon: MenuSquare },
  { label: "Reviews", href: "/owner#reviews", icon: MessageSquareText },
  { label: "Analytics", href: "/owner#analytics", icon: BarChart3 },
  { label: "Settings", href: "/owner#settings", icon: Settings },
];

export function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/25 backdrop-blur lg:inset-y-4 lg:left-4 lg:right-auto lg:flex lg:w-64 lg:flex-col lg:p-4">
      <div className="hidden px-3 py-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-950/25">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Restaurant Owner</p>
            <p className="text-xs text-slate-400">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="grid grid-cols-6 gap-1 lg:mt-6 lg:flex lg:flex-col lg:gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/owner" && (pathname === "/owner" || pathname === "/owner/dashboard");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex min-h-12 items-center justify-center rounded-2xl px-2 text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white lg:justify-start lg:gap-3 lg:px-3",
                isActive && "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-950/30"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden truncate text-sm font-medium lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden pt-6 lg:block">
        <SignOutButton>
          <button
            type="button"
            className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-slate-400 transition duration-200 hover:bg-rose-500/15 hover:text-rose-200"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
