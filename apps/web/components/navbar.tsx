"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FormInput, Sparkles } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { getApiDocsUrl } from "~/lib/utils";

interface NavbarProps {
  minimal?: boolean;
}

export function Navbar({ minimal = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

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
        className={`mx-auto flex items-center justify-between pointer-events-auto transition-all duration-300 ease-in-out ${
          isScrolled
            ? "max-w-5xl rounded-full mt-3 px-6 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800 shadow-md"
            : "w-full max-w-7xl border-b border-transparent mt-0 py-4 px-4 sm:px-8 bg-transparent shadow-none"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FormInput className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Zenith Form
          </span>
          <Badge variant="secondary" className="ml-1 text-[10px] uppercase font-semibold tracking-wider">
            Beta
          </Badge>
        </Link>

        {/* Navigation Links */}
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
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {!minimal && (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" className="font-medium shadow-sm rounded-xl">
                <Link href="/login">
                  Get Started Free
                </Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
