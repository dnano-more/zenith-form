"use client";

import React from "react";
import Link from "next/link";
import { trpc } from "~/trpc/client";
import { Navbar } from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Globe, ArrowRight, ExternalLink, Loader2, Sparkles, FormInput } from "lucide-react";

export default function ExplorePage() {
  const { data: forms, isLoading } = trpc.form.getExploreForms.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3 px-3 py-1 font-semibold">
            Public Form Gallery
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Explore Community Forms</h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Discover interactive forms created and published by our community.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium">Loading explore gallery...</p>
          </div>
        ) : !forms || forms.length === 0 ? (
          <Card className="border-dashed p-12 text-center bg-card max-w-md mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">No public forms available yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Be the first to publish a public form and share it with the world.
            </p>
            <Link href="/login">
              <Button className="gap-2">
                <FormInput className="h-4 w-4" />
                <span>Create a Form</span>
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card
                key={form.id}
                className="flex flex-col justify-between border-border/60 hover:border-primary/40 transition-all shadow-sm"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] bg-muted/40">
                      Public Form
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Published {new Date(form.publishedAt ?? Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-lg font-bold line-clamp-1">{form.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 min-h-[32px] mt-1">
                    {form.description || "Interactive form open for responses"}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-4 border-t">
                  <Link href={`/f/${form.id}`} target="_blank" className="w-full">
                    <Button variant="default" size="sm" className="w-full gap-2 font-medium">
                      <span>Fill Form</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-8 bg-muted/10 text-xs text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} Zenith Form. All rights reserved.</p>
      </footer>
    </div>
  );
}
