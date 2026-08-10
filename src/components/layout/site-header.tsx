"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getClerkUserRole, roleDashboardPath } from "@/lib/auth-roles";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const role = getClerkUserRole(user?.publicMetadata);
  const dashboardPath = roleDashboardPath(role);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 shadow-[0_6px_24px_rgba(45,35,24,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
            TT
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-foreground">{siteConfig.name}</span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Eat well, locally</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isSignedIn ? (
            <>
              <Badge variant="outline" className="capitalize">
                {role}
              </Badge>
              <Button asChild variant="outline">
                <Link href={dashboardPath}>Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
            </>
          )}
          <Button asChild className="rounded-xl px-5 shadow-md shadow-primary/20">
            <Link href="/register">List your restaurant</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border/50 bg-background/95 px-4 pb-4 pt-2 shadow-xl shadow-black/5 transition-all duration-200 lg:hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 overflow-hidden opacity-0"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 sm:px-2">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isSignedIn ? (
            <>
              <Link
                href={dashboardPath}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <SignOutButton>
                <button
                  type="button"
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logout
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
            </>
          )}
          <div className="flex gap-3 px-1 pt-2">
            {isSignedIn ? (
              <SignOutButton>
                <Button type="button" variant="outline" className="flex-1">
                  Logout
                </Button>
              </SignOutButton>
            ) : (
              <Button asChild variant="outline" className="flex-1">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
              </Button>
            )}
            <Button asChild className="flex-1">
              <Link href="/register">List your restaurant</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
