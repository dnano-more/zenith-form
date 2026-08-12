"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FormInput, Sparkles, Menu, X } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { getApiDocsUrl } from "~/lib/utils";

interface NavbarProps {
  minimal?: boolean;
}

export function Navbar({ minimal = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 transition-all duration-300 pointer-events-none">
      <div
        className={`mx-auto flex items-center justify-between pointer-events-auto transition-all duration-300 ease-in-out relative ${
          isScrolled
            ? "max-w-5xl rounded-2xl md:rounded-full mt-3 px-4 sm:px-6 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800 shadow-md"
            : "w-full max-w-7xl border-b border-transparent mt-0 py-4 px-4 sm:px-8 bg-transparent shadow-none"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-xl tracking-tight hover:opacity-90 transition-opacity shrink-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <FormInput className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="whitespace-nowrap bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Zenith Form
          </span>
          <Badge variant="secondary" className="hidden xs:inline-flex ml-0.5 sm:ml-1 text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5">
            Beta
          </Badge>
        </Link>

        {/* Desktop Navigation Links */}
        {!minimal && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
            <a href="/#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a
              href={getApiDocsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>API Docs</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </a>
          </nav>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <ThemeToggle />
          {!minimal && (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex font-medium shadow-sm rounded-xl text-xs sm:text-sm px-3 sm:px-4">
                <Link href="/login">
                  Get Started
                </Link>
              </Button>
              {/* Mobile Hamburger Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-xl border border-border/60"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {!minimal && mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xl flex flex-col gap-3 md:hidden pointer-events-auto animate-fade-in-up z-50">
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-muted font-medium text-sm transition-colors text-foreground flex items-center justify-between"
            >
              <span>Features</span>
            </a>
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-muted font-medium text-sm transition-colors text-foreground flex items-center justify-between"
            >
              <span>Explore Public Gallery</span>
            </Link>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-muted font-medium text-sm transition-colors text-foreground flex items-center justify-between"
            >
              <span>Pricing Tiers</span>
            </a>
            <a
              href={getApiDocsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-muted font-medium text-sm transition-colors text-foreground flex items-center justify-between"
            >
              <span>Scalar API Docs</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </a>
            <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full justify-center rounded-xl">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}

