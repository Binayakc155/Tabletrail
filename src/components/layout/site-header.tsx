"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && Boolean(session);

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
            TT
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-foreground">{siteConfig.name}</span>
            <span className="text-xs text-muted-foreground">Restaurant listings platform</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Badge variant="outline" className="capitalize">
                {session?.user?.role ?? "customer"}
              </Badge>
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button type="button" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}
          <Button asChild>
            <Link href="#pricing">List your restaurant</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
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
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Logout
              </button>
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
              <Link
                href="/register"
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                Create account
              </Link>
            </>
          )}
          <div className="flex gap-3 px-1 pt-2">
            {isAuthenticated ? (
              <Button type="button" variant="outline" className="flex-1" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </Button>
            ) : (
              <Button asChild variant="outline" className="flex-1">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
            <Button asChild className="flex-1">
              <Link href="#pricing">List your restaurant</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
