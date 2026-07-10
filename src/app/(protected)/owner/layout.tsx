import type { ReactNode } from "react";

import { OwnerLayout } from "@/components/owner/owner-layout";

export default function OwnerRouteLayout({ children }: { children: ReactNode }) {
  return <OwnerLayout>{children}</OwnerLayout>;
}
