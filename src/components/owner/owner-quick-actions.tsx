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
      <Card className="rounded-xl border border-[#E5E7EB] bg-white shadow-none">
        <CardHeader className="px-6 pb-0 pt-6"><CardTitle className="text-base font-semibold text-[#111827]">Quick actions</CardTitle></CardHeader>
        <CardContent className="grid gap-3 p-6 sm:grid-cols-3">
          <AddRestaurantDialog open={addRestaurantOpen} onOpenChange={setAddRestaurantOpen} onSaved={() => undefined} />
          <Button asChild variant="outline" className="h-11 justify-start rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-50"><a href="#restaurants"><MenuSquare className="h-4 w-4 text-slate-500" />Manage menu</a></Button>
          <Button asChild variant="outline" className="h-11 justify-start rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-50"><a href="#reviews"><MessageSquareText className="h-4 w-4 text-slate-500" />View reviews</a></Button>
        </CardContent>
      </Card>
    </section>
  );
}
