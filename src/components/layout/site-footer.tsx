import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer id="about" className="border-t border-border bg-surface-alt">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/20">
                TT
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">{siteConfig.name}</p>
                <p className="text-sm text-muted-foreground">Your table is waiting.</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">{siteConfig.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Discover</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {siteConfig.footerLinks.slice(0, 2).map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">For restaurants</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {siteConfig.footerLinks.slice(2).map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="h-px w-full bg-border/60" />

        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TableTrail. Made for better meals and good company.</p>
          <p>Discover local places worth returning to.</p>
        </div>
      </div>
    </footer>
  );
}
