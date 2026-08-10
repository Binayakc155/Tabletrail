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
    <aside className="fixed inset-x-3 bottom-3 z-40 rounded-[18px] border border-white/10 bg-slate-950/80 p-3 text-slate-100 shadow-[0_20px_50px_-24px_rgba(2,6,23,0.8)] backdrop-blur-xl lg:inset-y-4 lg:left-4 lg:right-auto lg:flex lg:w-[18rem] lg:flex-col lg:p-4">
      <div className="hidden lg:block">
        <div className="flex items-center gap-3 rounded-[16px] px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">TableTrail Owner</p>
            <p className="truncate text-xs text-slate-400">Restaurant management console</p>
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
                "group relative flex min-h-12 items-center justify-center rounded-[14px] px-2 text-slate-400 transition duration-200 hover:bg-white/[0.07] hover:text-white lg:justify-start lg:gap-3 lg:px-3",
                isActive && "bg-gradient-to-r from-orange-500/20 to-orange-400/5 text-white ring-1 ring-orange-400/25"
              )}
              onClick={() => setActiveHash(item.href)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden min-w-0 truncate text-sm font-medium lg:block">{item.label}</span>
              {"meta" in item ? (
                <Badge variant="outline" className="ml-auto hidden border-white/10 bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400 lg:inline-flex">
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
            className="flex min-h-12 w-full items-center gap-3 rounded-[14px] border border-white/10 px-3 text-sm font-medium text-slate-400 transition duration-200 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
