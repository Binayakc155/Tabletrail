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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-3 shadow-[0_10px_30px_rgba(2,6,23,0.2)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative hidden min-w-[18rem] flex-1 md:block xl:min-w-[26rem]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input className="h-11 rounded-[16px] border-white/10 bg-white/[0.06] pl-11 text-slate-100 shadow-none placeholder:text-slate-500" placeholder="Search restaurants, reviews, customers, orders..." />
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-[16px] border-white/10 bg-white/[0.06] shadow-none hover:bg-white/10">
            <Bell className="h-4 w-4 text-slate-300" />
          </Button>
          <Badge variant="outline" className="hidden h-11 items-center rounded-[16px] border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-slate-300 sm:inline-flex">
            <Store className="mr-2 h-4 w-4 text-orange-500" />
            Restaurant owner
          </Badge>
          <AddRestaurantDialog open={addRestaurantOpen} onOpenChange={setAddRestaurantOpen} onSaved={() => undefined} />
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-11 w-11 rounded-[16px] border border-white/15 shadow-none",
                userButtonPopoverCard: "rounded-[16px] border border-white/10 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.45)]",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
