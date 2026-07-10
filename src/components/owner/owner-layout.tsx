import type { ReactNode } from "react";

import { OwnerHeader } from "@/components/owner/owner-header";
import { OwnerSidebar } from "@/components/owner/owner-sidebar";

export function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-950">
      <OwnerSidebar />
      <div className="min-h-screen lg:pl-72">
        <OwnerHeader />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
