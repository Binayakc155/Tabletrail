import type { ReactNode } from "react";

import { OwnerHeader } from "@/components/owner/owner-header";
import { OwnerSidebar } from "@/components/owner/owner-sidebar";

export function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.10),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.05),_transparent_26%),linear-gradient(180deg,_#fbfaf8_0%,_#f7f4ef_100%)] text-slate-950">
      <OwnerSidebar />
      <div className="min-h-screen lg:pl-[20rem]">
        <OwnerHeader />
        <main className="mx-auto w-full max-w-[1640px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
