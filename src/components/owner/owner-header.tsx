"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { Bell, LogOut, Search, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OwnerHeader() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f7f4ef]/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="h-11 rounded-2xl border-slate-200 bg-white/80 pl-11 shadow-sm" placeholder="Search restaurants, reviews, menus..." />
        </div>
        <div className="flex flex-1 items-center justify-between md:flex-none md:justify-end md:gap-3">
          <div className="md:hidden">
            <p className="text-sm font-semibold text-slate-950">Restaurant Owner</p>
            <p className="text-xs text-slate-500">{email ?? "Dashboard"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 bg-white/80">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="hidden items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 sm:flex">
              <Store className="h-4 w-4" />
              Restaurant owner
            </div>
            <SignOutButton>
              <Button type="button" variant="outline" className="rounded-2xl border-slate-200 bg-white/80 text-slate-700 hover:bg-rose-50 hover:text-rose-700">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </header>
  );
}
