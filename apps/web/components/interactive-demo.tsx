"use client";

import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Check,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  ShieldCheck,
  Code2,
  BarChart3,
  Eye,
  Send,
  Lock,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Activity,
  Sliders,
} from "lucide-react";

interface ChoiceOption {
  label: string;
  icon: string;
  desc: string;
}

interface Question {
  id: number;
  type: "choice" | "rating" | "input";
  label: string;
  subtitle: string;
  options?: ChoiceOption[];
  placeholder?: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    type: "choice",
    label: "What brings you to Zenith Form today?",
    subtitle: "Select an option below to test single-question progression.",
    options: [
      {
        label: "Building interactive survey & SaaS forms",
        icon: "🚀",
        desc: "Distraction-free single question flow with high conversion",
      },
      {
        label: "Collecting NPS & customer feedback",
        icon: "📊",
        desc: "Automated real-time distribution charts & aggregate analytics",
      },
      {
        label: "Exploring tRPC + Turborepo monorepo",
        icon: "⚡",
        desc: "End-to-end Zod type-safety across Next.js and Express backend",
      },
    ],
  },
  {
    id: 2,
    type: "rating",
    label: "How would you rate this interface speed & flow?",
    subtitle: "Hover over the stars to test instant UI reactivity.",
  },
  {
    id: 3,
    type: "input",
    label: "Test live schema validation input",
    subtitle: "Zenith Form checks inputs against Zod schema rules before submit.",
    placeholder: "you@example.com",
  },
];

export function InteractiveDemo() {
  const [viewMode, setViewMode] = useState<"demo" | "inspector">("demo");
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionTime, setSubmissionTime] = useState<number>(0);

  const activeQuestion: Question = SAMPLE_QUESTIONS[currentStep] ?? {
    id: 1,
    type: "choice",
    label: "What brings you to Zenith Form today?",
    subtitle: "Select an option below to test single-question progression.",
  };
  const totalQuestions = SAMPLE_QUESTIONS.length;
  const progressPercent = ((currentStep + 1) / totalQuestions) * 100;

  // Validation state for input question
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isInputStepValid = inputText.trim().length > 0 && isValidEmail(inputText);

  // Determine if current step is ready to proceed
  const canProceed = () => {
    if (currentStep === 0) return selectedChoice !== null;
    if (currentStep === 1) return rating > 0;
    if (currentStep === 2) return isInputStepValid;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Simulate tRPC server latency submit
      setIsSubmitting(true);
      const start = performance.now();
      setTimeout(() => {
        const elapsed = Math.round(performance.now() - start + 18);
        setSubmissionTime(elapsed);
        setIsSubmitting(false);
        setIsCompleted(true);
      }, 450);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedChoice(null);
    setRating(0);
    setHoverRating(0);
    setInputText("");
    setIsCompleted(false);
    setIsSubmitting(false);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "demo" || isCompleted) return;

      // Don't intercept when user is typing into text input
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Enter" && canProceed()) {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (currentStep === 0) {
        const keyUpper = e.key.toUpperCase();
        if (keyUpper === "A" || e.key === "1") setSelectedChoice(0);
        else if (keyUpper === "B" || e.key === "2") setSelectedChoice(1);
        else if (keyUpper === "C" || e.key === "3") setSelectedChoice(2);
      } else if (currentStep === 1) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 5) setRating(num);
      }

      if (e.key === "Enter" && canProceed()) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, selectedChoice, rating, inputText, viewMode, isCompleted]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Construct current payload JSON string for inspector mode
  const payloadData = {
    formId: "demo-live-preview-01",
    timestamp: mounted ? new Date().toISOString() : "2026-08-07T12:00:00.000Z",
    answers: {
      goalChoice: selectedChoice !== null ? SAMPLE_QUESTIONS[0]?.options?.[selectedChoice]?.label ?? null : null,
      ratingScore: rating > 0 ? `${rating}/5 Stars` : null,
      submitterEmail: inputText || null,
    },
    clientMeta: {
      rateLimitChecked: true,
      saltedIpHash: "sha256:7f8a...9c2b",
      validationStatus: canProceed() ? "VALID_ZOD_SCHEMA" : "DRAFT",
    },
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return "Needs Work 😐";
      case 2: return "Fair Experience 🙂";
      case 3: return "Good & Clean ⚡";
      case 4: return "Very Impressive 👍";
      case 5: return "World Class & Sleek! 🚀";
      default: return "Select a rating score";
    }
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800 bg-card overflow-hidden relative transition-all duration-300 ring-1 ring-white/10">
      
      {/* Simulated Browser Window Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Window Control Dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
          </div>

          {/* URL Bar Mock */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-background/80 border border-border/60 text-[11px] font-mono text-muted-foreground shadow-inner">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span>https://zenithform.app/demo/preview</span>
          </div>
        </div>

        {/* Tab Switcher: Demo Form vs Real-Time Inspector */}
        <div className="flex items-center bg-background/90 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setViewMode("demo")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "demo"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Form Flow</span>
          </button>

          <button
            onClick={() => setViewMode("inspector")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "inspector"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>tRPC Payload</span>
          </button>
        </div>
      </div>

      {/* Main Body Area */}
      <div className="p-6 sm:p-10 relative">

        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* MODE 1: INTERACTIVE FORM VIEW */}
        {viewMode === "demo" && (
          <div>
            {isCompleted ? (
              /* Completion Screen */
              <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 shadow-inner ring-8 ring-emerald-500/5">
                  <CheckCircle2 className="h-10 w-10 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                    <Sparkles className="h-3.5 w-3.5" /> Response Processed in {submissionTime}ms
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Submission Received Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Your answers were validated with Zod, protected with salted IP rate-limiting, and logged into real-time aggregate analytics.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl border border-border/80 bg-muted/20 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/40">
                    <span className="font-semibold text-foreground">Submitted Response Breakdown</span>
                    <span className="text-[10px] text-emerald-500 font-mono">Status: 200 OK</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Primary Goal:</span>
                    <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
                      {SAMPLE_QUESTIONS[0]?.options?.[selectedChoice ?? 0]?.label ?? "SaaS Form Builder"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">UX Rating:</span>
                    <span className="font-semibold text-amber-500">
                      {"★".repeat(rating)}{"☆".repeat(5 - rating)} ({rating}/5)
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Submitter Email:</span>
                    <span className="font-mono text-foreground">{inputText}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button onClick={handleReset} variant="outline" className="gap-2 font-semibold h-11 px-6 rounded-xl">
                    <RotateCcw className="h-4 w-4" />
                    <span>Try Demo Again</span>
                  </Button>
                  <Button onClick={() => setViewMode("inspector")} className="gap-2 font-semibold h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                    <BarChart3 className="h-4 w-4" />
                    <span>Inspect Backend Payload</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Active Question View */
              <div className="space-y-6">
                
                {/* Progress Bar & Counter Header */}
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-foreground font-bold">Question {currentStep + 1}</span>
                    <span className="text-muted-foreground font-normal">of {totalQuestions}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-muted-foreground">{Math.round(progressPercent)}%</span>
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Question Label & Subtitle */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-snug">
                    {activeQuestion.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeQuestion.subtitle}
                  </p>
                </div>

                {/* QUESTION TYPE 1: SINGLE CHOICE CARDS */}
                {activeQuestion.type === "choice" && activeQuestion.options && (
                  <div className="space-y-3">
                    {activeQuestion.options.map((opt, idx) => {
                      const isSelected = selectedChoice === idx;
                      const letter = String.fromCharCode(65 + idx);

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedChoice(idx)}
                          className={`flex items-center justify-between p-4 rounded-2xl border text-sm transition-all duration-200 cursor-pointer select-none group ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/15 text-foreground shadow-lg ring-2 ring-indigo-500/40 dark:bg-indigo-500/20"
                              : "border-border/80 bg-background/50 hover:border-indigo-500/50 hover:bg-accent/60 hover:shadow-md hover:-translate-y-0.5 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                isSelected
                                  ? "bg-indigo-600 text-white scale-105 shadow-sm"
                                  : "bg-muted text-muted-foreground group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                              }`}
                            >
                              {letter}
                            </span>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <span>{opt.icon}</span>
                                <span>{opt.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{opt.desc}</p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* QUESTION TYPE 2: INTERACTIVE STAR RATING */}
                {activeQuestion.type === "rating" && (
                  <div className="py-6 space-y-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((starIdx) => {
                        const activeStar = hoverRating ? starIdx <= hoverRating : starIdx <= rating;

                        return (
                          <button
                            key={starIdx}
                            type="button"
                            onClick={() => setRating(starIdx)}
                            onMouseEnter={() => setHoverRating(starIdx)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-2 transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star
                              className={`h-10 w-10 transition-colors duration-200 ${
                                activeStar
                                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                  : "text-muted border-muted-foreground/30"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="h-6">
                      <span className="text-sm font-semibold text-primary transition-all">
                        {getRatingLabel(hoverRating || rating)}
                      </span>
                    </div>
                  </div>
                )}

                {/* QUESTION TYPE 3: TEXT / EMAIL INPUT */}
                {activeQuestion.type === "input" && (
                  <div className="py-4 space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={activeQuestion.placeholder}
                        className="w-full h-14 px-4 pr-12 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base font-medium transition-all"
                        autoFocus
                      />
                      {inputText.length > 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {isValidEmail(inputText) ? (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 text-[11px]">
                              <Check className="h-3 w-3" /> Valid Zod Schema
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              Invalid Email Format
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Submitted IP is salted and hashed with SHA-256 for privacy.</span>
                    </p>
                  </div>
                )}

                {/* Bottom Navigation & Hotkey Bar */}
                <div className="flex items-center justify-between pt-6 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrev}
                        className="h-9 px-3 gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Hotkey Hint */}
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <span>Press</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-mono text-[10px]">
                        Enter ↵
                      </kbd>
                    </span>

                    <Button
                      size="sm"
                      onClick={handleNext}
                      disabled={!canProceed() || isSubmitting}
                      className="h-10 px-6 gap-2 font-bold shadow-md rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>{currentStep === totalQuestions - 1 ? "Submit Demo" : "Continue"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* MODE 2: TRPC & REAL-TIME ANALYTICS INSPECTOR */}
        {viewMode === "inspector" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>Real-Time tRPC & Zod Schema Inspector</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  As you interact with the form, input data is converted into type-safe tRPC payload JSON.
                </p>
              </div>

              <Badge variant="outline" className="font-mono text-[11px] text-primary border-primary/30">
                Procedure: form.submitResponse
              </Badge>
            </div>

            {/* Code / JSON Viewer Block */}
            <div className="rounded-2xl border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <pre className="text-[12px] leading-relaxed">
                {JSON.stringify(payloadData, null, 2)}
              </pre>
            </div>

            {/* Architecture Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border/60 bg-muted/30 space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Rate Limiter
                </div>
                <div className="text-sm font-bold text-foreground">5 req / min / IP</div>
                <div className="text-[10px] text-emerald-500 font-medium">Salted SHA-256 Hash</div>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-muted/30 space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Code2 className="h-3.5 w-3.5 text-blue-500" /> Type Safety
                </div>
                <div className="text-sm font-bold text-foreground">100% Zod Validated</div>
                <div className="text-[10px] text-blue-500 font-medium">tRPC Monorepo Contract</div>
              </div>

              <div className="p-3 rounded-xl border border-border/60 bg-muted/30 space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-purple-500" /> Database Storage
                </div>
                <div className="text-sm font-bold text-foreground">PostgreSQL JSONB</div>
                <div className="text-[10px] text-purple-500 font-medium">Drizzle ORM Schema</div>
              </div>
            </div>

            {/* Switch back CTA */}
            <div className="text-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("demo")}
                className="gap-2 text-xs font-semibold rounded-xl"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Return to Form Demo</span>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

