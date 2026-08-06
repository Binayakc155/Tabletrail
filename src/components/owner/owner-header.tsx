"use client";

import { useState } from "react";
import { Bell, Search, Store } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { AddRestaurantDialog } from "@/components/owner/add-restaurant-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OwnerHeader() {
  const [addRestaurantOpen, setAddRestaurantOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative hidden min-w-[18rem] flex-1 md:block xl:min-w-[26rem]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="h-11 rounded-[16px] border-slate-200 bg-slate-50 pl-11 shadow-none placeholder:text-slate-400" placeholder="Search restaurants, reviews, customers, orders..." />
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-[16px] border-slate-200 bg-white shadow-none">
            <Bell className="h-4 w-4 text-slate-600" />
          </Button>
          <Badge variant="outline" className="hidden h-11 items-center rounded-[16px] border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 sm:inline-flex">
            <Store className="mr-2 h-4 w-4 text-orange-500" />
            Restaurant owner
          </Badge>
          <AddRestaurantDialog open={addRestaurantOpen} onOpenChange={setAddRestaurantOpen} onSaved={() => undefined} />
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-11 w-11 rounded-[16px] border border-slate-200 shadow-none",
                userButtonPopoverCard: "rounded-[16px] border border-slate-200 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.28)]",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
