"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { AddRestaurantDialog } from "@/components/owner/add-restaurant-dialog";
import { Input } from "@/components/ui/input";

export function OwnerHeader() {
  const [addRestaurantOpen, setAddRestaurantOpen] = useState(false);

  function searchPortfolio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    window.dispatchEvent(new CustomEvent("owner-portfolio-search", { detail: typeof query === "string" ? query : "" }));
    document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden min-w-0 flex-1 lg:block"><p className="text-sm font-semibold text-slate-900">Owner dashboard</p><p className="mt-0.5 text-xs text-slate-500">Manage your restaurant portfolio</p></div>
        <form className="relative min-w-0 flex-1 md:max-w-sm" onSubmit={searchPortfolio}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" className="h-10 border-slate-200 bg-[#F6F7F9] pl-9 text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-[#E87532]" placeholder="Search restaurants" />
        </form>
        <div className="flex shrink-0 items-center gap-2">
          <AddRestaurantDialog open={addRestaurantOpen} onOpenChange={setAddRestaurantOpen} onSaved={() => undefined} />
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-10 w-10 rounded-xl border border-slate-200 shadow-none",
                userButtonPopoverCard: "rounded-xl border border-slate-200 shadow-lg",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
