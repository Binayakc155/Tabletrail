import type { ReactNode } from "react";

import { OwnerHeader } from "@/components/owner/owner-header";
import { OwnerSidebar } from "@/components/owner/owner-sidebar";

export function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="owner-dashboard min-h-screen bg-[#F6F7F9] text-slate-900">
      <OwnerSidebar />
      <div className="min-h-screen pb-20 lg:pb-0 lg:pl-[16.5rem]">
        <OwnerHeader />
        <main className="mx-auto w-full max-w-[1360px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
