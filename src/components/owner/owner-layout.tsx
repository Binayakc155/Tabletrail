import type { ReactNode } from "react";

import { OwnerHeader } from "@/components/owner/owner-header";
import { OwnerSidebar } from "@/components/owner/owner-sidebar";

export function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="owner-dashboard relative min-h-screen overflow-hidden bg-[#080d1d] text-slate-950 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_55%_38%_at_18%_-8%,rgba(59,130,246,0.24),transparent_72%),radial-gradient(ellipse_42%_35%_at_90%_12%,rgba(139,92,246,0.16),transparent_74%),radial-gradient(ellipse_36%_28%_at_54%_100%,rgba(249,115,22,0.10),transparent_72%),linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] before:bg-[size:auto,auto,auto,44px_44px,44px_44px]">
      <OwnerSidebar />
      <div className="relative min-h-screen lg:pl-[20rem]">
        <OwnerHeader />
        <main className="mx-auto w-full max-w-[1640px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
