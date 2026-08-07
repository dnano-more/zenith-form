"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { FormInput, CheckCircle2, ArrowRight, ArrowLeft, Star, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getFormTheme } from "~/lib/themes";

type FieldValidationRules = {
  htmlType?: "text" | "tel" | "email" | "url" | "password" | "number";
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  errorMessage?: string;
  allowCountryCode?: boolean;
  defaultCountry?: string;
};

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch public form details & fields
  const { data: form, isLoading, isError } = trpc.form.getPublicForm.useQuery({ formId });

  // Submit response mutation
  const submitMutation = trpc.response.submitResponse.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Response submitted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit response. Please check your answers.");
    },
  });

  const fields = form?.fields ?? [];
  const currentField = fields[currentStep];
  const themeConfig = getFormTheme(form?.theme);
  const fieldValidation = (currentField?.validation ?? {}) as FieldValidationRules;

  const handleAnswerChange = (fieldId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (!currentField) return;

    // Validate if current field is required
    const currentVal = answers[currentField.id];
    const isMissing =
      currentVal === undefined ||
      currentVal === null ||
      (typeof currentVal === "string" && currentVal.trim() === "") ||
      (Array.isArray(currentVal) && currentVal.length === 0);

    if (currentField.required && isMissing) {
      toast.error(`"${currentField.label}" is a required field`);
      return;
    }

    // Client-side regex & length validation if configured
    if (fieldValidation.pattern && typeof currentVal === "string" && currentVal.trim() !== "") {
      try {
        const reg = new RegExp(fieldValidation.pattern);
        if (!reg.test(currentVal.trim())) {
          toast.error(fieldValidation.errorMessage || `Invalid format for "${currentField.label}"`);
          return;
        }
      } catch {
        // ignore invalid regex syntax
      }
    }

    if (currentStep < fields.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Final check for all required fields & regex rules
    for (const f of fields) {
      const val = answers[f.id];
      const fVal = (f.validation ?? {}) as FieldValidationRules;
      const isMissing =
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "") ||
        (Array.isArray(val) && val.length === 0);

      if (f.required && isMissing) {
        toast.error(`Please answer required question: "${f.label}"`);
        return;
      }

      if (fVal.pattern && typeof val === "string" && val.trim() !== "") {
        try {
          const reg = new RegExp(fVal.pattern);
          if (!reg.test(val.trim())) {
            toast.error(fVal.errorMessage || `Invalid format for question: "${f.label}"`);
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    submitMutation.mutate({
      formId,
      answers,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Loading Form...</p>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <FormInput className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Form Unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          This form does not exist, or is currently in draft mode and not accepting public responses.
        </p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${themeConfig.bgClass}`}>
        <div className={`max-w-md w-full rounded-2xl p-8 shadow-2xl space-y-4 ${themeConfig.cardClass}`}>
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-extrabold">
            {form.status === "draft" ? "Draft Test Complete!" : "Thank You!"}
          </h2>
          <p className={`text-sm leading-relaxed ${themeConfig.subtextClass}`}>
            {form.status === "draft"
              ? "Your test answers were validated in draft preview mode (dry-run)."
              : "Your response has been recorded securely. We appreciate your feedback."}
          </p>
          <div className={`pt-4 border-t border-border/40 text-xs flex items-center justify-center gap-1.5 ${themeConfig.subtextClass}`}>
            <span>Powered by</span>
            <span className="font-bold">Zenith Form</span>
          </div>
        </div>
      </div>
    );
  }

  if (fields.length === 0 || !currentField) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${themeConfig.bgClass}`}>
        <Card className={`max-w-md text-center p-8 ${themeConfig.cardClass}`}>
          <CardTitle>Empty Form</CardTitle>
          <CardDescription className={`mt-2 ${themeConfig.subtextClass}`}>This form has no questions configured yet.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans antialiased transition-colors duration-500 ${themeConfig.bgClass}`}>
      {/* Creator Draft Mode Banner */}
      {form.status === "draft" && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>Creator Draft Preview Mode &mdash; Testing form before publishing. Answers will not be saved to analytics.</span>
        </div>
      )}
      {/* Top Header & Progress */}
      <header className={`px-6 py-4 ${themeConfig.headerClass}`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${themeConfig.primaryButtonClass}`}>
              <FormInput className="h-3.5 w-3.5" />
            </div>
            <span className={themeConfig.textClass}>{form.title}</span>
          </div>

          <div className={`text-xs font-medium ${themeConfig.subtextClass}`}>
            Question <span className={`font-bold ${themeConfig.accentTextClass}`}>{currentStep + 1}</span> of {fields.length}
          </div>
        </div>
      </header>

      {/* Main Single Question Step View */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className={`h-1.5 w-full rounded-full overflow-hidden mb-8 ${themeConfig.progressBg}`}>
            <div
              className={`h-full transition-all duration-300 rounded-full ${themeConfig.progressFill}`}
              style={{ width: `${((currentStep + 1) / fields.length) * 100}%` }}
            />
          </div>

          <Card className={`p-6 sm:p-10 space-y-6 relative overflow-hidden ${themeConfig.cardClass}`}>
            {submitMutation.isPending && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 space-y-3 animate-in fade-in duration-200">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-semibold">Submitting Response...</p>
              </div>
            )}
            <div className="relative z-10 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${themeConfig.badgeBg}`}>
                  {currentStep + 1}
                </span>
                {currentField.required && (
                  <span className="text-xs font-semibold text-rose-500">* Required</span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentField.label}</h2>
              {currentField.helpText && (
                <p className={`text-sm mt-2 ${themeConfig.subtextClass}`}>{currentField.helpText}</p>
              )}
            </div>

            {/* Input Element by Type */}
            <div className="py-4">
              {currentField.type === "short_text" && (
                <Input
                  type={fieldValidation.htmlType || "text"}
                  placeholder={currentField.placeholder || "Type your answer..."}
                  className={`h-12 text-base ${themeConfig.inputClass}`}
                  value={(answers[currentField.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(currentField.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                />
              )}

              {currentField.type === "long_text" && (
                <Textarea
                  placeholder={currentField.placeholder || "Type your detailed answer..."}
                  className={`text-base min-h-[120px] ${themeConfig.inputClass}`}
                  value={(answers[currentField.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(currentField.id, e.target.value)}
                  autoFocus
                />
              )}

              {currentField.type === "email" && (
                <Input
                  type={fieldValidation.htmlType || "email"}
                  placeholder={currentField.placeholder || "name@example.com"}
                  className={`h-12 text-base ${themeConfig.inputClass}`}
                  value={(answers[currentField.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(currentField.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                />
              )}

              {currentField.type === "phone" && (
                <Input
                  type={fieldValidation.htmlType || "tel"}
                  placeholder={currentField.placeholder || "+1 (555) 000-0000"}
                  className={`h-12 text-base ${themeConfig.inputClass}`}
                  value={(answers[currentField.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(currentField.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                />
              )}

              {currentField.type === "number" && (
                <Input
                  type={fieldValidation.htmlType || "number"}
                  placeholder={currentField.placeholder || "Enter a number..."}
                  className={`h-12 text-base ${themeConfig.inputClass}`}
                  value={(answers[currentField.id] as number) ?? ""}
                  onChange={(e) => handleAnswerChange(currentField.id, e.target.value === "" ? "" : Number(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                />
              )}

              {currentField.type === "date" && (
                <Input
                  type="date"
                  className={`h-12 text-base ${themeConfig.inputClass}`}
                  value={(answers[currentField.id] as string) || ""}
                  onChange={(e) => handleAnswerChange(currentField.id, e.target.value)}
                  autoFocus
                />
              )}

              {currentField.type === "checkbox" && (
                <div className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer border transition-all ${themeConfig.optionClass}`}>
                  <Checkbox
                    id={currentField.id}
                    checked={(answers[currentField.id] as boolean) || false}
                    onCheckedChange={(checked) => handleAnswerChange(currentField.id, !!checked)}
                  />
                  <Label htmlFor={currentField.id} className="text-base cursor-pointer">
                    {currentField.placeholder || "Yes / Agree"}
                  </Label>
                </div>
              )}

              {currentField.type === "rating" && (
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleAnswerChange(currentField.id, star)}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        (answers[currentField.id] as number) >= star
                          ? "border-amber-400 bg-amber-400/20 text-amber-400 scale-110 shadow-lg shadow-amber-400/20"
                          : `${themeConfig.optionClass}`
                      }`}
                    >
                      <Star className="h-7 w-7 fill-current" />
                    </button>
                  ))}
                </div>
              )}

              {currentField.type === "single_select" && (
                <div className="space-y-3">
                  {(currentField.options ?? []).map((opt, idx) => {
                    const isSelected = answers[currentField.id] === opt;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleAnswerChange(currentField.id, opt)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? themeConfig.optionSelectedClass
                            : themeConfig.optionClass
                        }`}
                      >
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${themeConfig.badgeBg}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-base">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentField.type === "multi_select" && (
                <div className="space-y-3">
                  {(currentField.options ?? []).map((opt, idx) => {
                    const currentArray = (answers[currentField.id] as string[]) || [];
                    const isSelected = currentArray.includes(opt);

                    const toggleOption = () => {
                      const updated = isSelected
                        ? currentArray.filter((o) => o !== opt)
                        : [...currentArray, opt];
                      handleAnswerChange(currentField.id, updated);
                    };

                    return (
                      <div
                        key={idx}
                        onClick={toggleOption}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? themeConfig.optionSelectedClass
                            : themeConfig.optionClass
                        }`}
                      >
                        <Checkbox checked={isSelected} onCheckedChange={toggleOption} />
                        <span className="text-base">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Stepper Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {currentStep < fields.length - 1 ? (
                <Button size="sm" onClick={handleNext} className={`gap-1.5 ${themeConfig.primaryButtonClass}`}>
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span>Submit Form</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-4 text-center text-xs border-t border-border/40 ${themeConfig.subtextClass}`}>
        <span>Powered by Zenith Form — Interactive Form Builder</span>
      </footer>
    </div>
  );
}
