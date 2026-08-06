"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  ArrowLeft,
  BarChart3,
  Download,
  Eye,
  Loader2,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Star,
  FileText,
  ListFilter,
  CheckSquare,
  Sparkles,
  Copy,
  ExternalLink,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";

function FormAnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-52 rounded-md" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Top 3 Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/60 p-6 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </Card>
        ))}
      </div>

      {/* Tabs List Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/60 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-48 rounded-md" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsEmptyState({ formId }: { formId: string }) {
  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public form link copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-3xl p-12 text-center bg-card/60 backdrop-blur-sm shadow-sm space-y-6 max-w-2xl mx-auto my-6">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary border border-primary/20 flex items-center justify-center shadow-md">
        <Inbox className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold tracking-tight">No responses submitted yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Share your form link with respondents or test a submission yourself to start viewing live analytics.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md">
        <Button size="default" onClick={copyPublicLink} className="w-full sm:w-auto gap-2 font-medium shadow-sm">
          <Copy className="h-4 w-4" />
          <span>Copy Public Form Link</span>
        </Button>
        <Button asChild size="default" variant="outline" className="w-full sm:w-auto gap-2 font-medium border-primary/20 hover:bg-primary/5">
          <Link href={`/f/${formId}`} target="_blank">
            <ExternalLink className="h-4 w-4" />
            <span>Open Live Form</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

type FormField = {
  id: string;
  type: string;
  label: string;
  options: string[] | null;
  required: boolean;
};

type FormResponseItem = {
  id: string;
  answers: Record<string, unknown>;
  submittedAt: Date | string;
};

export default function FormAnalyticsPage() {
  const params = useParams();
  const formId = params.id as string;

  const [activeTab, setActiveTab] = useState("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const [selectedResponse, setSelectedResponse] = useState<FormResponseItem | null>(null);

  // Fetch form details
  const { data: form, isLoading: isFormLoading } = trpc.form.getFormById.useQuery({ formId });

  // Fetch analytics summary
  const { data: analytics, isLoading: isAnalyticsLoading } = trpc.response.getFormAnalytics.useQuery({ formId });

  // Fetch responses list for raw table & CSV export
  const { data: responsesData, isLoading: isResponsesLoading } = trpc.response.getResponses.useQuery({
    formId,
    limit: 100, // Fetch up to 100 for client-side search & full table pagination
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

  // Filtered responses based on search query
  const filteredResponses = useMemo(() => {
    if (!responsesData?.responses) return [];
    if (!searchQuery.trim()) return responsesData.responses;

    const query = searchQuery.toLowerCase();
    return responsesData.responses.filter((resp) => {
      if (resp.id.toLowerCase().includes(query)) return true;
      // Search inside answers
      return Object.values(resp.answers).some((val) => {
        if (val === null || val === undefined) return false;
        if (Array.isArray(val)) return val.some((item) => String(item).toLowerCase().includes(query));
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [responsesData?.responses, searchQuery]);

  // Paginated list for current table view
  const paginatedResponses = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredResponses.slice(start, start + limit);
  }, [filteredResponses, page, limit]);

  const totalPages = Math.ceil(filteredResponses.length / limit) || 1;

  if (isFormLoading || isAnalyticsLoading || isResponsesLoading) {
    return <FormAnalyticsSkeleton />;
  }

  if (!form || !analytics) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Analytics not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">The form or analytics data could not be retrieved.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const fields = responsesData?.fields ?? [];

  return (
    <div className="space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="h-9 w-9">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
              <Badge variant="secondary" className="text-[11px] font-semibold">
                Analytics & Submissions
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Form analytics, breakdown metrics, and individual response submissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs shadow-sm">
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href={`/dashboard/forms/${form.id}`}>
              Edit Questions
            </Link>
          </Button>
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

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="summary" className="gap-2 text-xs font-medium">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <span>Analytics Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2 text-xs font-medium">
              <ListFilter className="h-3.5 w-3.5 text-primary" />
              <span>Individual Submissions</span>
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] font-bold">
                {analytics.totalResponses}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Analytics Breakdown */}
        <TabsContent value="summary" className="space-y-6">
          {analytics.totalResponses === 0 ? (
            <AnalyticsEmptyState formId={form.id} />
          ) : analytics.perField.length === 0 ? (
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

                    {/* Text / Number / Email / Date Fields */}
                    {"answeredCount" in item.stats && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border text-xs">
                          <span className="text-muted-foreground">Answered Submissions:</span>
                          <span className="font-bold text-foreground">
                            {(item.stats as { answeredCount: number }).answeredCount} / {analytics.totalResponses}
                          </span>
                        </div>

                        {"recentAnswers" in item.stats &&
                          Array.isArray((item.stats as { recentAnswers?: string[] }).recentAnswers) &&
                          ((item.stats as { recentAnswers: string[] }).recentAnswers.length > 0) && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Recent Entries Preview
                              </span>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {(item.stats as { recentAnswers: string[] }).recentAnswers.map((ans, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs font-mono py-1 px-2.5">
                                    {ans}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Individual Submissions */}
        <TabsContent value="submissions" className="space-y-6">
          {analytics.totalResponses === 0 ? (
            <AnalyticsEmptyState formId={form.id} />
          ) : (
            <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold">All Submissions</CardTitle>
                  <CardDescription className="text-xs">
                    Inspect detailed answers for each respondent submission
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by ID or answer..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8 text-xs h-9"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isResponsesLoading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span className="text-xs font-medium">Loading submission records...</span>
                </div>
              ) : filteredResponses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground space-y-2">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-semibold">No submissions found</p>
                  <p className="text-xs">
                    {searchQuery ? "Try refining your search query." : "No responses have been submitted yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="w-12 text-xs font-bold">#</TableHead>
                          <TableHead className="text-xs font-bold">Submission ID</TableHead>
                          <TableHead className="text-xs font-bold">Submitted Date</TableHead>
                          {fields.slice(0, 2).map((field) => (
                            <TableHead key={field.id} className="text-xs font-bold max-w-[180px] truncate">
                              {field.label.replace(/^Your\s+/i, "")}
                            </TableHead>
                          ))}
                          <TableHead className="w-24 text-right text-xs font-bold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedResponses.map((resp, index) => {
                          const rowNum = (page - 1) * limit + index + 1;
                          const submittedDate = new Date(resp.submittedAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          });

                          return (
                            <TableRow
                              key={resp.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setSelectedResponse(resp)}
                            >
                              <TableCell className="text-xs font-semibold text-muted-foreground">
                                {rowNum}
                              </TableCell>
                              <TableCell className="text-xs font-mono font-medium text-foreground">
                                {resp.id.slice(0, 8)}...{resp.id.slice(-4)}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 text-muted-foreground/70" />
                                  {submittedDate}
                                </span>
                              </TableCell>
                              {fields.slice(0, 2).map((field) => {
                                const val = resp.answers[field.id];
                                let displayVal = "-";
                                if (val !== undefined && val !== null && val !== "") {
                                  displayVal = Array.isArray(val) ? val.join(", ") : String(val);
                                }
                                return (
                                  <TableCell key={field.id} className="text-xs max-w-[180px] truncate text-muted-foreground">
                                    {displayVal}
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedResponse(resp)}
                                  className="h-8 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>View</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-2">
                    <div>
                      Showing <span className="font-bold text-foreground">{((page - 1) * limit) + 1}</span> to{" "}
                      <span className="font-bold text-foreground">
                        {Math.min(page * limit, filteredResponses.length)}
                      </span>{" "}
                      of <span className="font-bold text-foreground">{filteredResponses.length}</span> responses
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="h-8 px-2.5 text-xs gap-1"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>Previous</span>
                      </Button>
                      <span className="text-xs font-semibold px-2">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="h-8 px-2.5 text-xs gap-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Submission Detail Inspection Drawer / Sheet */}
      <Sheet open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto space-y-6">
          <SheetHeader className="border-b pb-4 space-y-1.5 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Response Submission
              </SheetTitle>
              <Badge variant="outline" className="text-[10px] font-mono">
                ID: {selectedResponse?.id.slice(0, 8)}
              </Badge>
            </div>
            <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
              {selectedResponse &&
                new Date(selectedResponse.submittedAt).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
            </SheetDescription>
          </SheetHeader>

          {/* Render Answers for Each Question */}
          {selectedResponse && (
            <div className="space-y-4 pt-2">
              {fields.length === 0 ? (
                <p className="text-xs text-muted-foreground">No questions found in this form.</p>
              ) : (
                fields.map((field, idx) => {
                  const rawAnswer = selectedResponse.answers[field.id];
                  const hasAnswer = rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== "";

                  return (
                    <Card key={field.id} className="border-border/60 shadow-none bg-muted/10">
                      <CardHeader className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                            <span>Q{idx + 1}.</span>
                            {field.required && <span className="text-destructive">*</span>}
                          </span>
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                            {field.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <CardTitle className="text-xs font-bold leading-snug mt-1 text-foreground">
                          {field.label}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-3.5 pt-0 text-xs">
                        {!hasAnswer ? (
                          <span className="text-muted-foreground italic text-[11px]">
                            (No response provided)
                          </span>
                        ) : field.type === "rating" ? (
                          <div className="flex items-center gap-1 bg-background p-2.5 rounded-lg border w-fit">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= Number(rawAnswer)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30"
                                  }`}
                              />
                            ))}
                            <span className="ml-2 font-bold text-xs">{String(rawAnswer)} / 5</span>
                          </div>
                        ) : field.type === "multi_select" || Array.isArray(rawAnswer) ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(rawAnswer as string[]).map((opt) => (
                              <Badge key={opt} variant="default" className="text-[11px] font-medium">
                                {opt}
                              </Badge>
                            ))}
                          </div>
                        ) : field.type === "single_select" ? (
                          <Badge variant="secondary" className="text-[11px] font-semibold bg-primary/10 text-primary border-primary/20">
                            {String(rawAnswer)}
                          </Badge>
                        ) : field.type === "checkbox" ? (
                          <Badge
                            variant={rawAnswer ? "default" : "outline"}
                            className="text-[11px] font-medium gap-1"
                          >
                            <CheckSquare className="h-3 w-3" />
                            {rawAnswer ? "Checked (True)" : "Unchecked (False)"}
                          </Badge>
                        ) : (
                          <div className="bg-background p-3 rounded-lg border text-foreground leading-relaxed whitespace-pre-wrap font-sans text-xs">
                            {String(rawAnswer)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
