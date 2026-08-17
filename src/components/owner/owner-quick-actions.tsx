"use client";

import { useState } from "react";
import { MenuSquare, MessageSquareText } from "lucide-react";

import { AddRestaurantDialog } from "@/components/owner/add-restaurant-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OwnerQuickActions() {
  const [addRestaurantOpen, setAddRestaurantOpen] = useState(false);

  return (
    <section>
      <Card className="rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <CardHeader className="px-5 pb-0 pt-5 sm:px-6"><CardTitle className="text-lg font-semibold text-[#0F172A]">Quick actions</CardTitle></CardHeader>
        <CardContent className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
          <AddRestaurantDialog open={addRestaurantOpen} onOpenChange={setAddRestaurantOpen} onSaved={() => undefined} />
          <Button asChild variant="outline" className="h-11 justify-start rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-none transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"><a href="#restaurants"><MenuSquare className="h-4 w-4 text-slate-500" />Manage menu</a></Button>
          <Button asChild variant="outline" className="h-11 justify-start rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-none transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"><a href="#reviews"><MessageSquareText className="h-4 w-4 text-slate-500" />View reviews</a></Button>
        </CardContent>
      </Card>
    </section>
  );
}
