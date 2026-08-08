import Link from "next/link";
import { Navbar } from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { InteractiveDemo } from "~/components/interactive-demo";
import { ArchitectureShowcase } from "~/components/architecture-showcase";
import { api } from "~/trpc/server";
import {
  ArrowRight,
  BarChart3,
  Check,
  FormInput,
  Globe,
  HelpCircle,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
  Code2,
  Lock,
  Cpu,
  ExternalLink,
  CheckCircle2,
  FileCode2,
  Activity,
  Github,
  Terminal,
} from "lucide-react";

export default async function Home() {
  // Fetch live server health status from tRPC Express backend
  let serverStatus = "offline";
  try {
    const health = await api.health.getHealth.query();
    serverStatus = health.status;
  } catch (err) {
    serverStatus = "disconnected";
  }

  const metrics = [
    {
      label: "Type Safety",
      value: "100%",
      desc: "End-to-end Zod + tRPC monorepo contract",
      icon: Code2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Avg Backend Latency",
      value: "< 20ms",
      desc: "Express 5 + Node.js HTTP/tRPC procedure ping",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Privacy Protection",
      value: "SHA-256",
      desc: "Salted IP rate-limiting without PII storage",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Schema Flexibility",
      value: "PostgreSQL JSONB",
      desc: "Zero runtime database schema migration overhead",
      icon: Layers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  const tiers = [
    {
      name: "Starter / Free",
      price: "$0",
      period: "forever",
      description: "Perfect for testing, personal projects, and small feedback collection.",
      highlight: false,
      buttonText: "Start for Free",
      buttonVariant: "outline" as const,
      features: [
        "Up to 3 Active Forms",
        "100 Responses per Form",
        "Standard Field Types (Text, Choice, Rating)",
        "Basic Analytics Summary",
        "Rate Limiting & Salted IP Hashing",
      ],
    },
    {
      name: "Creator Pro",
      price: "$19",
      period: "per month",
      description: "Designed for creators and startups needing higher limits & CSV exports.",
      highlight: true,
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      features: [
        "Unlimited Active Forms",
        "10,000 Responses per Form",
        "All Field Types & Validation Rules",
        "Per-field Aggregate Analytics",
        "CSV & JSON Data Export",
        "Custom Theme Presets",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "per month",
      description: "For teams requiring custom domains, higher quotas, and SLA guarantees.",
      highlight: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      features: [
        "Unlimited Responses & Quotas",
        "Dedicated Database Connection Pool",
        "Custom Branding & Domain CNAME",
        "Webhook & REST API Integration",
        "24/7 Dedicated Support",
        "99.9% Uptime SLA",
      ],
    },
  ];

  const faqs = [
    {
      q: "What makes Zenith Form different from traditional form builders?",
      a: "Zenith Form is engineered for high performance and security. It combines end-to-end Zod + tRPC type-safety, dynamic PostgreSQL JSONB storage with Drizzle ORM, and privacy-first salted IP rate limiting.",
    },
    {
      q: "How does response rate-limiting work?",
      a: "Zenith Form enforces an in-memory sliding window rate limiter (5 submissions per minute per IP per form). Submitter IP addresses are salted and hashed using SHA-256 for privacy without storing raw PII.",
    },
    {
      q: "Can I inspect the OpenAPI 3.0 & Scalar API docs?",
      a: "Yes! Zenith Form automatically generates interactive OpenAPI 3.0 specifications and Scalar API documentation so you can easily integrate form payloads into your own backend workflows.",
    },
    {
      q: "Can I export my form responses?",
      a: "Yes! Response data can be retrieved via our tRPC API or exported in CSV/JSON format under the Creator Pro plan.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-background font-sans antialiased text-foreground selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20 bg-zinc-50 dark:bg-background">
          
          {/* Floating Subtle Radial Gradient Glow Behind Hero Heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-gradient-to-r from-purple-200/50 via-indigo-200/50 to-pink-200/50 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-float-slow" />

          <div className="container max-w-6xl mx-auto px-4 text-center relative z-10">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-8 shadow-sm animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Next-Gen Interactive Form Builder — High Conversion & Type-Safe</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] animate-fade-in-up-delay-1">
              Build <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">interactive forms</span> that engage & convert
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed animate-fade-in-up-delay-2">
              Create distraction-free dynamic forms with end-to-end type safety, 
              salted IP privacy protection, and real-time response analytics.
            </p>

            {/* Action CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
              <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-transform hover:scale-105 duration-200">
                <Link href="/login">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-medium border-border/80 gap-2 transition-transform hover:scale-105 duration-200">
                <Link href="/explore">
                  <Globe className="h-4 w-4" />
                  <span>Explore Public Gallery</span>
                </Link>
              </Button>
            </div>

            {/* Backend Health Status Badge with Pulsing Ping Indicator */}
            <div className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 border border-border/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm animate-fade-in-up-delay-3">
              <Server className="h-3.5 w-3.5 text-muted-foreground" />
              <span>tRPC Backend Engine:</span>
              {serverStatus === "healthy" ? (
                <span className="flex items-center gap-2 font-semibold text-emerald-500">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span>Live & Healthy</span>
                </span>
              ) : (
                <span className="font-semibold text-amber-500">Connecting ({serverStatus})</span>
              )}
            </div>

          </div>
        </section>

        {/* 2. TECHNICAL METRICS & ENGINEERING BENCHMARKS GRID */}
        <section className="py-12 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-sm shadow-sm">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((m, idx) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-muted/20 space-y-2 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</span>
                      <div className={`p-2 rounded-xl ${m.bg} ${m.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {m.value}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE DEMO SECTION */}
        <section id="demo" className="py-16 sm:py-20 bg-zinc-100/70 dark:bg-zinc-900/30 border-b border-zinc-200/60 dark:border-zinc-800/60 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-100/40 dark:bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="container max-w-5xl mx-auto px-4 relative z-10">
            <div className="text-center mb-10 space-y-3">
              <Badge variant="outline" className="px-3 py-1 font-semibold text-xs tracking-wider uppercase border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                Interactive Form Engine
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Try Zenith Form in Action</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
                Test distraction-free single-question form filler and inspect real-time tRPC Zod payload contracts.
              </p>
            </div>

            {/* Interactive Form Component */}
            <InteractiveDemo />
          </div>
        </section>

        {/* 4. ARCHITECTURE SHOWCASE SECTION */}
        <section id="architecture" className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-background relative overflow-hidden">
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <Badge variant="outline" className="px-3 py-1 font-semibold text-xs border-purple-500/30 text-purple-600 dark:text-purple-400">
                Enterprise Infrastructure
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Production-Grade Full-Stack Standards
              </h2>
              <p className="text-base text-muted-foreground">
                Zenith Form demonstrates clean separation of concerns, end-to-end type safety, and enterprise security.
              </p>
            </div>

            {/* Interactive Architecture Showcase Component */}
            <ArchitectureShowcase />

          </div>
        </section>

        {/* 5. FEATURE HIGHLIGHTS - BENTO GRID */}
        <section id="features" className="py-20 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/30 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-100/40 dark:bg-purple-900/10 blur-[140px] rounded-full pointer-events-none -z-10" />
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <Badge variant="outline" className="px-3 py-1 font-semibold text-xs border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                Core Capabilities
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Engineered for Performance, Security & Scale
              </h2>
              <p className="text-base text-muted-foreground">
                Built for high availability, zero type-mismatch bugs, and effortless form builder experience.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CARD 1: VISUAL FORM BUILDER (Span 2 cols) */}
              <div className="md:col-span-2 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 group relative overflow-hidden shadow-sm">
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <FormInput className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      Dynamic Builder UI
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Visual Form Builder</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                    Create distraction-free, single-question forms with interactive field creation, real-time preview, drag-and-drop ordering, and validation rules.
                  </p>
                </div>

                {/* Sleek UI Mockup */}
                <div className="rounded-2xl border border-border/80 bg-zinc-50/80 dark:bg-muted/40 p-4 sm:p-5 space-y-3 relative z-10 backdrop-blur-sm shadow-inner">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/60">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Form Field Canvas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] bg-background">Required</Badge>
                      <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-500 border-indigo-500/30">Single Select</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">
                      Question 1: What is your primary engineering stack?
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl border border-indigo-500/80 bg-indigo-500/10 font-medium text-foreground flex items-center justify-between shadow-sm">
                        <span>⚡ Next.js + tRPC</span>
                        <Check className="h-3.5 w-3.5 text-indigo-500 stroke-[3]" />
                      </div>
                      <div className="p-2.5 rounded-xl border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between">
                        <span>🚀 React + REST API</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between">
                        <span>🛡️ Full-Stack Vue</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Background Gradient */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
              </div>

              {/* CARD 2: FULL-STACK TYPE SAFETY (Span 1 col) */}
              <div className="md:col-span-1 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 group relative overflow-hidden shadow-sm">
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      Zod + tRPC
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Full-Stack Type Safety</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Shared schemas across `@repo/trpc` ensure 100% type contract match from client forms to server handlers.
                  </p>
                </div>

                {/* Styled Code Snippet Window */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto shadow-inner relative z-10">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-muted-foreground">
                    <span>schema.ts</span>
                    <span className="text-purple-400">Zod v4</span>
                  </div>
                  <pre>
                    <span className="text-purple-400">const</span> <span className="text-blue-300">fieldSchema</span> = <span className="text-emerald-400">z</span>.object(&#123;{"\n"}
                    {"  "}<span className="text-slate-300">id:</span> <span className="text-emerald-400">z</span>.string().uuid(),{"\n"}
                    {"  "}<span className="text-slate-300">label:</span> <span className="text-emerald-400">z</span>.string().min(<span className="text-amber-400">2</span>),{"\n"}
                    {"  "}<span className="text-slate-300">type:</span> <span className="text-emerald-400">z</span>.enum([<span className="text-amber-300">&quot;choice&quot;</span>, <span className="text-amber-300">&quot;rating&quot;</span>]),{"\n"}
                    &#125;);
                  </pre>
                </div>

                {/* Glow Background Gradient */}
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
              </div>

              {/* CARD 3: REAL-TIME RESPONSE ANALYTICS (Span 1 col) */}
              <div className="md:col-span-1 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 group relative overflow-hidden shadow-sm">
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      Live Metrics
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Real-Time Analytics</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track submission velocity, drop-off rates, and field aggregates with zero latency overhead.
                  </p>
                </div>

                {/* Mini Chart & Progress Metrics */}
                <div className="rounded-2xl border border-border/80 bg-zinc-50/80 dark:bg-muted/30 p-4 space-y-3 relative z-10 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Completion Rate</span>
                    <span className="text-sm font-extrabold text-amber-500 font-mono">94.2%</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Q1: Goal Selection</span>
                        <span className="font-semibold text-foreground">98%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[98%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>Q2: Speed Rating</span>
                        <span className="font-semibold text-foreground">94%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[94%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Background Gradient */}
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              </div>

              {/* CARD 4: PRIVACY-FIRST RATE LIMITING (Span 2 cols) */}
              <div className="md:col-span-2 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 group relative overflow-hidden shadow-sm">
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      GDPR & Spam Protection
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Privacy-First Rate Limiting</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                    In-memory sliding window rate limiter protects forms against DDoS and submission spam using SHA-256 salted IP hashes without ever storing raw PII data.
                  </p>
                </div>

                {/* Security Pipeline Visual */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 text-xs">
                  <div className="p-3.5 rounded-2xl border border-border/80 bg-zinc-50/80 dark:bg-muted/40 space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>5 req / min Limit</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Sliding window algorithm prevents spam attacks.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Salted SHA-256</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Submitter IP is irreversibly hashed before storage.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-border/80 bg-zinc-50/80 dark:bg-muted/40 space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                      <span>0% PII Storage</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Full compliance with privacy standards and GDPR.</p>
                  </div>
                </div>

                {/* Glow Background Gradient */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
              </div>

            </div>

          </div>
        </section>

        {/* 6. PRICING SECTION */}
        <section id="pricing" className="py-20 bg-zinc-50 dark:bg-background">
          <div className="container max-w-6xl mx-auto px-4">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3 px-3 py-1 font-semibold">
                Transparent Pricing Tiers
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Simple plans for every form creator
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that fits your form creation needs. Scale up anytime as your response volume grows.
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
              {tiers.map((tier, idx) => (
                <Card
                  key={idx}
                  className={`flex flex-col justify-between relative transition-all duration-300 ${
                    tier.highlight
                      ? "border-indigo-500/80 shadow-2xl ring-2 ring-indigo-500/30 bg-white dark:bg-zinc-950 scale-[1.03] z-10"
                      : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white font-semibold px-3 py-1 shadow-md gap-1">
                        <Sparkles className="h-3 w-3" /> Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                    <CardDescription className="min-h-[40px] text-xs mt-1">
                      {tier.description}
                    </CardDescription>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                      <span className="text-xs text-muted-foreground font-medium">/{tier.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3">
                      What's Included:
                    </div>
                    <ul className="space-y-3 text-sm">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <div className="rounded-full bg-emerald-500/10 p-0.5 text-emerald-500 shrink-0 mt-0.5">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                          <span className="text-muted-foreground leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button
                      asChild
                      variant={tier.buttonVariant}
                      className={`w-full font-semibold ${
                        tier.highlight ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" : ""
                      }`}
                    >
                      <Link href="/login">
                        {tier.buttonText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto border-t border-zinc-200/80 dark:border-zinc-800 pt-16">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h3 className="text-2xl font-bold">Have questions? We've got answers.</h3>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq, fIdx) => (
                  <AccordionItem
                    key={fIdx}
                    value={`item-${fIdx}`}
                    className="border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl px-5 py-1 bg-white dark:bg-zinc-950 transition-all duration-200 shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

          </div>
        </section>

        {/* 7. BOTTOM SaaS CTA BANNER */}
        <section className="py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/30">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-2xl shadow-indigo-500/5 dark:shadow-none rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
              <Badge variant="secondary" className="px-3.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Production-Ready SaaS
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to experience Zenith Form in action?
              </h2>
              <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Start creating distraction-free dynamic forms, analyze real-time responses, or inspect our OpenAPI 3.0 specs.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="bg-indigo-600/90 hover:bg-indigo-600 dark:bg-indigo-500/90 dark:hover:bg-indigo-500 text-white font-medium text-sm px-6 py-3 rounded-xl backdrop-blur-md border-t border-white/30 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/60 dark:bg-zinc-800/40 backdrop-blur-md text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/60 hover:bg-white/90 dark:hover:bg-zinc-800/80 font-medium text-sm px-6 py-3 rounded-xl transition-all duration-200 inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FileCode2 className="h-4 w-4 text-amber-500" />
                  <span>View API Docs</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Modern Professional Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-card-foreground">
        <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            
            {/* Column 1: Brand & Portfolio Statement */}
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <FormInput className="h-4 w-4" />
                </div>
                <span>Zenith Form</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Distraction-free, high-converting form builder engineered for modern creators and developers.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  tRPC Backend Engine Active
                </span>
              </div>
            </div>

            {/* Column 2: Product Quick Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
                <li>
                  <Link href="/#architecture" className="hover:text-foreground transition-colors">
                    System Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="hover:text-foreground transition-colors">
                    Public Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-foreground transition-colors">
                    Pricing Tiers
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Creator Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Developer & API Docs */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Developer & API
              </h4>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-medium">
                <li>
                  <a
                    href="http://localhost:8000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <span>Scalar API Reference</span>
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="http://localhost:8000/openapi.json"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    OpenAPI 3.0 Spec
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dnano-more/zenith-form"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub Repository</span>
                  </a>
                </li>
                <li>
                  <span className="text-muted-foreground/70">
                    tRPC Protected Procedures
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Monorepo Tech Stack */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Next.js 16",
                  "tRPC v11",
                  "Zod Validation",
                  "Drizzle ORM",
                  "PostgreSQL",
                  "Express API",
                  "Turborepo",
                  "Tailwind CSS",
                ].map((tech, tIdx) => (
                  <Badge
                    key={tIdx}
                    variant="outline"
                    className="text-[10px] font-normal py-0.5 px-2 bg-muted/30 hover:border-zinc-500 transition-colors cursor-default"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Copyright Divider */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Zenith Form. All rights reserved.</p>
            <p className="text-[11px] text-muted-foreground/80">
              Engineered for high performance & type-safe form delivery.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
