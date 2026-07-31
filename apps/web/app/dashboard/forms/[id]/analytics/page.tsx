"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileSpreadsheet,
  Loader2,
  Users,
  Star,
  CheckSquare,
  List,
  Type,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function FormAnalyticsPage() {
  const params = useParams();
  const formId = params.id as string;

  // Fetch form details
  const { data: form, isLoading: isFormLoading } = trpc.form.getFormById.useQuery({ formId });

  // Fetch analytics summary
  const { data: analytics, isLoading: isAnalyticsLoading } = trpc.response.getFormAnalytics.useQuery({ formId });

  // Fetch responses list for CSV export & raw table
  const { data: responsesData, isLoading: isResponsesLoading } = trpc.response.getResponses.useQuery({
    formId,
    limit: 100,
    offset: 0,
  });

  const handleExportCSV = () => {
    if (!responsesData || responsesData.responses.length === 0) {
      toast.error("No responses available to export.");
      return;
    }

    const { responses, fields } = responsesData;

    // Headers: Response ID, Submitted At, Field Labels...
    const headers = ["Response ID", "Submitted At", ...fields.map((f) => `"${f.label.replace(/"/g, '""')}"`)];

    const rows = responses.map((r) => {
      const submittedAtStr = new Date(r.submittedAt).toLocaleString();
      const answerCells = fields.map((f) => {
        const val = r.answers[f.id];
        if (val === undefined || val === null) return '""';
        if (Array.isArray(val)) return `"${val.join(", ").replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [r.id, `"${submittedAtStr}"`, ...answerCells].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${form?.slug || "form"}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV export downloaded!");
  };

  if (isFormLoading || isAnalyticsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading analytics dashboard...</p>
      </div>
    );
  }

  if (!form || !analytics) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Analytics not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">The form or analytics data could not be retrieved.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
              <Badge variant="secondary" className="text-[11px] font-semibold">
                Analytics
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Response summary and per-field answer breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs shadow-sm">
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </Button>

          <Link href={`/dashboard/forms/${form.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              Edit Questions
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{analytics.totalResponses}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Recorded responses</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Total Fields
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{analytics.perField.length}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Configured questions</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Form Status
            </CardTitle>
            <Badge variant={form.status === "published" ? "default" : "secondary"} className="capitalize">
              {form.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold capitalize mt-1">{form.visibility}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Visibility mode</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-Field Analytics Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Field-by-Field Breakdown</h2>

        {analytics.perField.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <p className="text-sm text-muted-foreground">No questions configured for this form.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics.perField.map((item, idx) => (
              <Card key={item.fieldId} className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                      {idx + 1}
                    </span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {item.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">{item.label}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  {/* Choice Fields (Single Select / Multi Select / Checkbox) */}
                  {"optionCounts" in item.stats && (
                    <div className="space-y-2.5">
                      {Object.entries(item.stats.optionCounts as Record<string, number>).map(
                        ([opt, count]) => {
                          const percentage =
                            analytics.totalResponses > 0
                              ? Math.round((count / analytics.totalResponses) * 100)
                              : 0;

                          return (
                            <div key={opt} className="space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span>{opt}</span>
                                <span className="text-muted-foreground">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Numeric & Rating Fields */}
                  {"average" in item.stats && (
                    <div className="grid grid-cols-3 gap-2 text-center bg-muted/20 p-3 rounded-xl border">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Average</span>
                        <p className="text-lg font-extrabold text-primary">
                          {(item.stats as { average: number }).average}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Min</span>
                        <p className="text-lg font-bold">{(item.stats as { min: number }).min}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Max</span>
                        <p className="text-lg font-bold">{(item.stats as { max: number }).max}</p>
                      </div>
                    </div>
                  )}

                  {/* Text / Email Fields */}
                  {"answeredCount" in item.stats && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border text-xs">
                      <span className="text-muted-foreground">Answered Submissions:</span>
                      <span className="font-bold text-foreground">
                        {(item.stats as { answeredCount: number }).answeredCount} / {analytics.totalResponses}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
