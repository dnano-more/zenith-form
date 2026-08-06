"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ThemeToggle } from "~/components/theme-toggle";
import {
  FormInput,
  LayoutDashboard,
  Globe,
  Sparkles,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Query authenticated user info
  const { data: user, isLoading, isError, isFetching } = trpc.user.whoAmI.useQuery(undefined, {
    retry: false,
  });

  const utils = trpc.useUtils();

  // Logout mutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      toast.success("Logged out successfully");
      utils.user.whoAmI.reset();
      await utils.invalidate();
      router.replace("/login");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to log out");
    },
  });

  // Redirect unauthenticated user
  React.useEffect(() => {
    if (!isLoading && !isFetching && (isError || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isFetching, isError, user, router]);

  if (isLoading || (isFetching && !user) || isError || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Verifying Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Top Dashboard Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          
          {/* Left Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <FormInput className="h-4 w-4" />
              </div>
              <span>Zenith Form</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Button
                asChild
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 font-medium"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>My Forms</span>
                </Link>
              </Button>

              <Button
                asChild
                variant={pathname === "/explore" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 font-medium"
              >
                <Link href="/explore">
                  <Globe className="h-4 w-4" />
                  <span>Explore Gallery</span>
                </Link>
              </Button>
            </nav>
          </div>

          {/* Right User & Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden md:flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-full border text-xs">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">{user.email}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
