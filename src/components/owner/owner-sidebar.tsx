"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, MenuSquare, MessageSquareText, Store } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "#overview", icon: LayoutDashboard },
  { label: "My Restaurants", href: "#restaurants", icon: Store },
  { label: "Menu Management", href: "#restaurants", icon: MenuSquare },
  { label: "Reviews", href: "#reviews", icon: MessageSquareText },
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
    <aside className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-[15.5rem] lg:flex-col lg:rounded-none lg:border-y-0 lg:border-l-0 lg:p-4">
      <div className="hidden lg:block">
        <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-5 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E87532] text-white">
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">TableTrail</p>
            <p className="truncate text-xs text-slate-500">Owner workspace</p>
          </div>
        </div>
      </div>

      <nav className="grid grid-cols-4 gap-1 lg:mt-5 lg:flex lg:flex-col lg:gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.href || ((item.href === "#overview" || item.href === "#dashboard") && (activeSection === "#overview" || activeSection === "#dashboard"));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex min-h-10 items-center justify-center rounded-lg px-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 lg:justify-start lg:gap-3 lg:px-3",
                isActive && "bg-orange-50 text-[#C85E20]"
              )}
              onClick={() => setActiveHash(item.href)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden min-w-0 truncate text-sm font-medium lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-slate-100 pt-4 lg:block">
        <SignOutButton>
          <button
            type="button"
            className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
