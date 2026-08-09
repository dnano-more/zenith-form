"use client";

import React, { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { getApiDocsUrl } from "~/lib/utils";
import {
  Code2,
  ShieldCheck,
  Database,
  FileCode2,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Layers,
  Zap,
  Lock,
  Cpu,
} from "lucide-react";

export function ArchitectureShowcase() {
  const [activeTab, setActiveTab] = useState<"monorepo" | "security" | "database" | "api">("monorepo");

  return (
    <div className="max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-border/60 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-5 w-5 text-primary" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">System Architecture & Engineering Specs</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Engineered with enterprise-grade standards for speed, security, and end-to-end type safety.
          </p>
        </div>

        <Badge variant="outline" className="px-3 py-1 text-xs font-semibold text-primary border-primary/30 shrink-0">
          Turborepo Monorepo
        </Badge>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/60 bg-muted/10 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("monorepo")}
          className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
            activeTab === "monorepo"
              ? "border-primary bg-background text-foreground shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
          }`}
        >
          <Layers className="h-4 w-4 text-purple-500" />
          <span>Monorepo Setup</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
            activeTab === "security"
              ? "border-primary bg-background text-foreground shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Security & Privacy</span>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
            activeTab === "database"
              ? "border-primary bg-background text-foreground shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
          }`}
        >
          <Database className="h-4 w-4 text-blue-500" />
          <span>PostgreSQL JSONB</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
            activeTab === "api"
              ? "border-primary bg-background text-foreground shadow-sm"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/30"
          }`}
        >
          <FileCode2 className="h-4 w-4 text-amber-500" />
          <span>Scalar OpenAPI</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 border-t border-zinc-200 dark:border-zinc-800 bg-card">

        {/* TAB 1: MONOREPO SETUP */}
        {activeTab === "monorepo" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-500" />
                <span>Turborepo Workspace Structure</span>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Code is organized into decoupled applications and shared workspace packages to maximize code reusability and enforce strict boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>apps/web</span>
                  <Badge variant="outline" className="text-[10px]">Next.js 16 App Router</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Renders the landing page, creator dashboard, interactive form filler, and client-side tRPC React Query hooks.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>packages/trpc</span>
                  <Badge variant="outline" className="text-[10px]">tRPC v11 Engine</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Defines end-to-end type-safe API procedures (<code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">form.create</code>, <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">form.submitResponse</code>, <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">form.getAnalytics</code>).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>packages/db</span>
                  <Badge variant="outline" className="text-[10px]">Drizzle ORM + Postgres</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contains relational database schemas (<code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">forms</code>, <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">questions</code>, <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">responses</code>) with TypeScript type inference.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>packages/services</span>
                  <Badge variant="outline" className="text-[10px]">Business Logic Layer</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Decoupled domain services for analytics aggregation, salted IP rate limiting, and password hashing.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-l-4 border-purple-500 bg-purple-500/10 text-xs text-muted-foreground flex items-center gap-3 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0" />
              <span>
                <strong className="text-foreground">Engineering Advantage:</strong> Zero code duplication between client & server. Any type change in Zod schema triggers instant TypeScript type-checking across the entire monorepo.
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY & PRIVACY */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Salted SHA-256 IP Salting & Rate-Limiting</span>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prevents form submission spam while keeping user IP addresses completely private and GDPR-compliant.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto">
              <div className="text-muted-foreground text-[10px] pb-2 border-b border-slate-800 mb-2">
                // Rate Limiting Algorithm (packages/services/rate-limiter.ts)
              </div>
              <pre className="leading-relaxed">
{`const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
const saltedHash = crypto
  .createHash("sha256")
  .update(clientIp + process.env.IP_SALT)
  .digest("hex");

// Enforce max 5 submissions / minute without storing raw IP logs
if (rateLimiter.isExceeded(saltedHash)) {
  throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Rate limit exceeded" });
}`}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-1">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-500" /> Zero Raw PII Logs
                </span>
                <p className="text-muted-foreground">
                  Submissions store one-way salted hashes instead of plain IP addresses.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-1">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" /> Sliding Window Protection
                </span>
                <p className="text-muted-foreground">
                  In-memory sliding window protects database from DDoS & submission flooding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POSTGRESQL JSONB */}
        {activeTab === "database" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span>Dynamic Form Fields via PostgreSQL JSONB</span>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Custom form questions and user responses are stored in dynamic JSONB fields, allowing total form flexibility without requiring runtime SQL schema migrations.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 font-mono text-xs text-blue-400 overflow-x-auto">
              <div className="text-muted-foreground text-[10px] pb-2 border-b border-slate-800 mb-2">
                // Drizzle ORM Schema Definition (packages/db/schema.ts)
              </div>
              <pre className="leading-relaxed">
{`export const responses = pgTable("responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  formId: uuid("form_id").references(() => forms.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<Record<string, unknown>>().notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  saltedIpHash: varchar("salted_ip_hash", { length: 64 }).notNull(),
});`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-xs text-muted-foreground">
              <strong>Why this architecture matters:</strong> Users can create any combination of short text, multiple choice, rating scales, and checkboxes. Drizzle ORM infers full TypeScript types for JSONB columns seamlessly.
            </div>
          </div>
        )}

        {/* TAB 4: SCALAR OPENAPI */}
        {activeTab === "api" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-amber-500" />
                <span>Scalar API Reference & OpenAPI 3.0 Specs</span>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Express backend automatically exposes OpenAPI 3.0 specs and renders interactive Scalar API documentation.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/80 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-sm font-bold text-foreground">Interactive Scalar API Docs</div>
                <div className="text-xs text-muted-foreground font-mono">{getApiDocsUrl()}</div>
              </div>

              <Button asChild size="sm" className="gap-2 font-semibold">
                <a href={getApiDocsUrl()} target="_blank" rel="noreferrer">
                  <span>Explore Scalar Docs</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
                <div className="font-semibold text-foreground">OpenAPI JSON Spec</div>
                <p className="text-muted-foreground">Available at <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono text-foreground border border-border/50">/openapi.json</code> for Client SDK generation.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card space-y-1">
                <div className="font-semibold text-foreground">trpc-openapi Adapter</div>
                <p className="text-muted-foreground">Automatically maps tRPC procedures to RESTful endpoints.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
