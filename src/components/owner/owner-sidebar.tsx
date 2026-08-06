"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { BarChart3, HelpCircle, LayoutDashboard, LogOut, MenuSquare, MessageSquareText, ShoppingCart, Settings, Store, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "#overview", icon: LayoutDashboard },
  { label: "Restaurants", href: "#restaurants", icon: Store },
  { label: "Menu Management", href: "#restaurants", icon: MenuSquare },
  { label: "Reviews", href: "#reviews", icon: MessageSquareText },
  { label: "Analytics", href: "#analytics", icon: BarChart3 },
  { label: "Orders", href: "#orders", icon: ShoppingCart, meta: "Soon" },
  { label: "Customers", href: "#customers", icon: Users },
  { label: "Settings", href: "#settings", icon: Settings },
  { label: "Help Center", href: "#help", icon: HelpCircle },
];

export function OwnerSidebar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("#overview");

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash || "#overview");

    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const activeSection = useMemo(() => (pathname.startsWith("/owner") ? activeHash : "#overview"), [activeHash, pathname]);

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 rounded-[18px] border border-slate-200 bg-white/92 p-3 text-slate-950 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.28)] backdrop-blur lg:inset-y-4 lg:left-4 lg:right-auto lg:flex lg:w-[18rem] lg:flex-col lg:p-4">
      <div className="hidden lg:block">
        <div className="flex items-center gap-3 rounded-[16px] px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-slate-950 text-white">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">TableTrail Owner</p>
            <p className="truncate text-xs text-slate-500">Restaurant management console</p>
          </div>
        </div>
      </div>

      <nav className="mt-2 grid grid-cols-4 gap-1 lg:mt-5 lg:flex lg:flex-col lg:gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.href || ((item.href === "#overview" || item.href === "#dashboard") && (activeSection === "#overview" || activeSection === "#dashboard"));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex min-h-12 items-center justify-center rounded-[14px] px-2 text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-950 lg:justify-start lg:gap-3 lg:px-3",
                isActive && "bg-orange-50 text-slate-950 ring-1 ring-orange-200"
              )}
              onClick={() => setActiveHash(item.href)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden min-w-0 truncate text-sm font-medium lg:block">{item.label}</span>
              {"meta" in item ? (
                <Badge variant="outline" className="ml-auto hidden border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500 lg:inline-flex">
                  {item.meta}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden pt-6 lg:block">
        <SignOutButton>
          <button
            type="button"
            className="flex min-h-12 w-full items-center gap-3 rounded-[14px] border border-slate-200 px-3 text-sm font-medium text-slate-600 transition duration-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
