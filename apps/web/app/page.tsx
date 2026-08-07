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
      q: "Is Zenith Form built for full-stack engineering portfolios?",
      a: "Yes! Zenith Form is engineered to demonstrate senior full-stack standards: Turborepo monorepo architecture, end-to-end Zod + tRPC type-safety, PostgreSQL JSONB with Drizzle ORM, and salted IP privacy protection.",
    },
    {
      q: "How does response rate-limiting work?",
      a: "Zenith Form enforces an in-memory sliding window rate limiter (5 submissions per minute per IP per form). Submitter IP addresses are salted and hashed using SHA-256 for privacy without storing raw PII.",
    },
    {
      q: "Can I inspect the OpenAPI 3.0 & Scalar API docs?",
      a: "Yes! Our Express backend automatically generates OpenAPI 3.0 documentation and serves interactive Scalar API reference at http://localhost:8000/docs.",
    },
    {
      q: "Can I export my form responses?",
      a: "Yes! Response data can be retrieved via our tRPC API or exported in CSV/JSON format under the Creator Pro plan.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20">
          
          {/* Floating Subtle Radial Gradient Glow Behind Hero Heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-float-slow" />

          <div className="container max-w-6xl mx-auto px-4 text-center relative z-10">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-8 shadow-sm animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Next-Gen Interactive Form Builder — Full-Stack Monorepo</span>
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
        <section className="py-12 border-y border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((m, idx) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-white/10 dark:border-white/10 border-border/80 bg-muted/20 space-y-2 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
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
        <section id="demo" className="py-16 sm:py-20 bg-muted/20">
          <div className="container max-w-5xl mx-auto px-4">
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
        <section id="architecture" className="py-20 border-t border-border/40 bg-background">
          <div className="container max-w-6xl mx-auto px-4">
            
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

        {/* 5. FEATURE HIGHLIGHTS */}
        <section id="features" className="py-16 border-y border-border/40 bg-muted/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Engineered for Performance, Security & Scale</h3>
              <p className="text-sm text-muted-foreground mt-2">Built for high availability, zero type-mismatch bugs, and seamless developer velocity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">End-to-End Type Safety</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Shared `@repo/trpc` and `@repo/db` packages protect data contracts from client forms to server handlers without runtime type errors.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-2">
                    <Lock className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">GDPR-Compliant Protection</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Salted SHA-256 IP rate limiting protects against form submission spam while keeping user PII 100% private.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 bg-card">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-2">
                    <FileCode2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Interactive OpenAPI 3.0 Specs</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Auto-generated Scalar API reference documentation allows effortless REST integration and client SDK generation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* 6. PRICING SECTION */}
        <section id="pricing" className="py-20">
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
                      ? "border-indigo-500/80 shadow-2xl ring-2 ring-indigo-500/30 bg-card scale-[1.03] z-10"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
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
            <div className="max-w-3xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-16">
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
                    className="border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl px-5 py-1 bg-card transition-all duration-200 shadow-sm"
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
        <section className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent p-8 sm:p-14 shadow-xl text-center space-y-6 relative overflow-hidden">
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
                <Button asChild size="lg" className="h-12 px-8 font-semibold shadow-lg gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                  <Link href="/login">
                    <span>Launch Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="h-12 px-8 font-medium gap-2 border-zinc-300 dark:border-zinc-700 rounded-xl">
                  <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
                    <FileCode2 className="h-4 w-4 text-amber-500" />
                    <span>View API Docs</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Modern Professional Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-card text-card-foreground">
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
                A full-stack Typeform-style form builder SaaS built with Turborepo, tRPC, Zod, and Drizzle ORM.
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
                  <Link href="/#features" className="hover:text-foreground transition-colors">
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
                    className="text-[10px] font-normal py-0.5 px-2 bg-muted/30"
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
              Designed & Engineered for Technical Excellence & Portfolio Review.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
