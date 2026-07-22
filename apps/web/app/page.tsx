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
import { api } from "~/trpc/server";
import {
  ArrowRight,
  BarChart3,
  Check,
  FormInput,
  HelpCircle,
  Layers,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
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
      q: "Is there any credit card required to start?",
      a: "No! You can sign up with Google OAuth or Guest access instantly without entering payment details.",
    },
    {
      q: "How does response rate-limiting work?",
      a: "Zenith Form enforces an in-memory rate limiter (5 submissions per minute per IP per form). IP addresses are salted and hashed using SHA-256 for privacy.",
    },
    {
      q: "Can I export my form responses?",
      a: "Yes! Response data can be retrieved via our tRPC API or exported in CSV/JSON format under the Creator Pro plan.",
    },
    {
      q: "Is this a real production SaaS?",
      a: "Zenith Form is a high-quality portfolio SaaS project demonstrating full-stack engineering skills, Turborepo monorepo architecture, and tRPC integration.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
          
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="container max-w-6xl mx-auto px-4 text-center">
            
            {/* Top Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full-Stack Typeform Alternative — Monorepo Architecture</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Build <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">interactive forms</span> that engage & convert
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
              Create high-converting, Typeform-style dynamic forms with strict type-safety, 
              salted IP privacy protection, and real-time response analytics.
            </p>

            {/* Action CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-md gap-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/#pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-medium">
                  View Pricing & Plans
                </Button>
              </Link>
            </div>

            {/* Backend Health Badge */}
            <div className="mt-10 inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border px-3.5 py-1.5 rounded-full">
              <Server className="h-3.5 w-3.5 text-muted-foreground" />
              <span>tRPC Backend Engine:</span>
              {serverStatus === "healthy" ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live & Healthy
                </span>
              ) : (
                <span className="font-semibold text-amber-500">Connecting ({serverStatus})</span>
              )}
            </div>

          </div>
        </section>

        {/* 2. INTERACTIVE DEMO / PREVIEW MOCKUP SECTION */}
        <section className="py-12 border-y border-border/40 bg-muted/20">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-sm uppercase tracking-widest font-semibold text-primary">Experience the UX</h2>
              <p className="text-2xl font-bold mt-1">One question at a time. Clean & responsive.</p>
            </div>

            {/* Mock Typeform-style Card */}
            <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                <span className="font-medium text-primary">Question 2 of 4</span>
                <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2 rounded-full" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                How would you rate your product experience today?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Select one option below to continue.</p>

              <div className="space-y-3">
                {["😍 Exceptional — Loved every feature", "👍 Good — Met my expectations", "😐 Average — Could be improved"].map(
                  (option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        idx === 0
                          ? "border-primary bg-primary/5 font-medium"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8 flex justify-between items-center pt-4 border-t text-xs text-muted-foreground">
                <span>Press <strong>Enter ↵</strong> to submit</span>
                <Button size="sm" className="h-9 px-4">Next →</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CORE FEATURES SECTION */}
        <section id="features" className="py-20">
          <div className="container max-w-6xl mx-auto px-4">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-3 px-3 py-1">Technical Architecture</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Engineered for depth, speed & data integrity
              </h2>
              <p className="mt-4 text-muted-foreground">
                Zenith Form is built with modern full-stack practices, ensuring robust API validation and real-time response aggregation.
              </p>
            </div>

            {/* Grid of 4 Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">End-to-End Type Safety</CardTitle>
                  <CardDescription>
                    Powered by tRPC & Zod across the Turborepo monorepo. Every input contract is strictly validated between Next.js and Express.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Dynamic JSONB Schema</CardTitle>
                  <CardDescription>
                    Custom form fields and answers are stored using PostgreSQL JSONB with Drizzle ORM, allowing flexible schema building without runtime migrations.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Privacy-First Salted Hashing</CardTitle>
                  <CardDescription>
                    Submitter IP addresses are salted and hashed before storage for spam prevention and rate-limiting without storing raw personal IP logs.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Automated Field Analytics</CardTitle>
                  <CardDescription>
                    Calculates option distributions for multiple choice, ratings average, and response counts per field out-of-the-box.
                  </CardDescription>
                </CardHeader>
              </Card>

            </div>

          </div>
        </section>

        {/* 4. PRICING SECTION */}
        <section id="pricing" className="py-20 border-t border-border/40 bg-muted/10">
          <div className="container max-w-6xl mx-auto px-4">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3 px-3 py-1 font-semibold">
                Transparent Pricing
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
                  className={`flex flex-col justify-between relative transition-all duration-200 ${
                    tier.highlight
                      ? "border-primary shadow-xl ring-1 ring-primary/30 bg-card scale-105 z-10"
                      : "border-border/60 hover:border-border shadow-sm"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 shadow-sm gap-1">
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
                    <ul className="space-y-2.5 text-sm">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Link href="/login" className="w-full">
                      <Button variant={tier.buttonVariant} className="w-full font-semibold">
                        {tier.buttonText}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto border-t pt-16">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h3 className="text-2xl font-bold">Have questions? We've got answers.</h3>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq, fIdx) => (
                  <AccordionItem key={fIdx} value={`item-${fIdx}`} className="border rounded-xl px-4 py-1 bg-card">
                    <AccordionTrigger className="text-left font-medium text-base hover:no-underline">
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

      </main>

      {/* Modern Professional Footer */}
      <footer className="border-t border-border/40 bg-card text-card-foreground">
        <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            
            {/* Column 1: Brand & Portfolio Statement */}
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
                    Core Features
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

          {/* Bottom Copyright & Disclaimer */}
          <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Zenith Form. Portfolio Project for Full-Stack Developer Job Interviews.</p>
            <p className="text-[11px] text-muted-foreground/80">
              Designed & Engineered with Depth Over Feature Count.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
