"use client";

import { useState } from "react";
import { ArrowRight, Download, MailPlus, MenuSquare, Sparkles, Users } from "lucide-react";

import { AddRestaurantDialog } from "@/components/owner/add-restaurant-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  {
    label: "Add Menu",
    href: "#restaurants",
    icon: MenuSquare,
    description: "Create or update menu groups for live listings.",
  },
  {
    label: "View Analytics",
    href: "#analytics",
    icon: Sparkles,
    description: "Jump directly to performance charts and signals.",
  },
  {
    label: "Export Data",
    href: "mailto:ops@tabletrail.com?subject=TableTrail%20export%20request",
    icon: Download,
    description: "Request a CSV export of your owner portfolio.",
  },
  {
    label: "Invite Staff",
    href: "mailto:ops@tabletrail.com?subject=Invite%20restaurant%20staff",
    icon: MailPlus,
    description: "Share access with a manager or a support teammate.",
  },
];

export function OwnerQuickActions() {
  const [addRestaurantOpen, setAddRestaurantOpen] = useState(false);

  return (
    <section id="orders" className="grid grid-cols-12 gap-4">
      <Card id="settings" className="col-span-12 overflow-hidden rounded-[16px] border border-slate-200/80 bg-white/90 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.22)]">
        <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-950">Quick actions</CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-500">Fast access to the tools you use most while managing restaurants.</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-[999px] border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
              Operations
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-center">
            <AddRestaurantDialog open={addRestaurantOpen} onOpenChange={setAddRestaurantOpen} onSaved={() => undefined} />
            <p className="text-sm leading-6 text-slate-500">
              Start with the primary action or jump into restaurant management, analytics, exports, and staff invites.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Button asChild key={action.label} variant="outline" className="h-auto justify-start rounded-[16px] border-slate-200 bg-white p-4 text-left shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50">
                  <a href={action.href}>
                    <Icon className="h-5 w-5 text-slate-600" />
                    <span className="grid gap-1">
                      <span className="text-sm font-semibold text-slate-950">{action.label}</span>
                      <span className="text-xs leading-5 text-slate-500">{action.description}</span>
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
                  </a>
                </Button>
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { label: "Menu updates", value: "2 pending" },
              { label: "Team invites", value: "1 draft" },
              { label: "Exports", value: "Ready" },
            ].map((item) => (
              <div key={item.label} className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
