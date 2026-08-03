"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Plus,
  Edit3,
  BarChart3,
  ExternalLink,
  Trash2,
  Globe,
  Lock,
  Loader2,
  FileText,
  Palette,
  MoreVertical,
  Search,
  Copy,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { FORM_THEMES, getFormTheme } from "~/lib/themes";

export default function DashboardPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("default");

  // Dashboard Toolbar Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Query current user info & forms
  const { data: me } = trpc.user.whoAmI.useQuery();
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery();

  const isDemoUser = me?.email === "demo@zenithform.com";

  // Create form mutation
  const createFormMutation = trpc.form.createForm.useMutation({
    onSuccess: () => {
      toast.success("Form created successfully!");
      setIsCreateOpen(false);
      setTitle("");
      setDescription("");
      setSelectedTheme("default");
      utils.form.getMyForms.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create form");
    },
  });

  // Seed sample forms mutation
  const seedMutation = trpc.form.seedSampleForms.useMutation({
    onSuccess: () => {
      toast.success("Sample forms & dummy responses loaded successfully!");
      utils.form.getMyForms.invalidate();
    },
    onError: (err) => toast.error(err.message || "Failed to seed sample forms"),
  });

  // Publish form mutation
  const publishMutation = trpc.form.publishForm.useMutation({
    onSuccess: () => {
      toast.success("Form published!");
      utils.form.getMyForms.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  // Unpublish form mutation
  const unpublishMutation = trpc.form.unpublishForm.useMutation({
    onSuccess: () => {
      toast.info("Form status set to draft");
      utils.form.getMyForms.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  // Delete form mutation
  const deleteMutation = trpc.form.deleteForm.useMutation({
    onSuccess: () => {
      toast.success("Form deleted");
      utils.form.getMyForms.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }
    createFormMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      theme: selectedTheme,
      visibility: "public",
    });
  };

  const handleCopyPublicLink = (e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(url);
    toast.success("Public form link copied to clipboard!");
  };

  // Filtered forms list
  const filteredForms = (forms ?? []).filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" ? true : f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Create Form Modal Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateForm}>
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
              <DialogDescription>
                Set a title, description, and visual theme for your interactive form.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Form Title *</label>
                <Input
                  placeholder="e.g. Customer Satisfaction Survey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Description (Optional)</label>
                <Textarea
                  placeholder="Brief description explaining the purpose of this form..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Visual Theme *</label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visual theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(FORM_THEMES).map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <Palette className="h-3.5 w-3.5 text-primary" />
                          <span>{t.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createFormMutation.isPending}>
                {createFormMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create Form
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, manage fields, customize themes, and monitor real-time submissions for your forms
          </p>
        </div>

        {/* Top-Right Create Button (Only shown when user has existing forms) */}
        {forms && forms.length > 0 && (
          <Button size="default" onClick={() => setIsCreateOpen(true)} className="gap-2 font-medium shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Create New Form</span>
          </Button>
        )}
      </div>

      {/* Dashboard Toolbar: Search & Filter */}
      {forms && forms.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-2xl border">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter forms by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-medium text-muted-foreground">Status:</span>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-[140px] h-9 text-xs bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Forms Grid or Clean Fresh Start Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
          <p className="text-sm font-medium">Loading your forms...</p>
        </div>
      ) : !forms || forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-3xl p-12 text-center bg-card/60 backdrop-blur-sm shadow-xl space-y-6 max-w-2xl mx-auto my-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary border border-primary/20 flex items-center justify-center shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold tracking-tight">No forms created yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Build your first custom form from scratch with interactive fields and custom visual themes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md">
            <Button
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto gap-2 font-semibold shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Form</span>
            </Button>

            {/* Load Sample Data Button rendered ONLY for demo account users */}
            {isDemoUser && (
              <Button
                size="lg"
                variant="outline"
                disabled={seedMutation.isPending}
                onClick={() => seedMutation.mutate()}
                className="w-full sm:w-auto gap-2 font-medium border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-foreground"
              >
                {seedMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                )}
                <span>Load Sample Data</span>
              </Button>
            )}
          </div>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="py-12 text-center border rounded-2xl bg-card">
          <p className="text-sm font-medium text-muted-foreground">No forms match your search/filter criteria.</p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="text-xs mt-1">
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => {
            const responseCount = form.responseCount ?? 0;
            return (
              <Card
                key={form.id}
                className="group flex flex-col justify-between border-border/60 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => router.push(`/dashboard/forms/${form.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Status & Response Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge
                        variant={form.status === "published" ? "default" : "secondary"}
                        className="capitalize text-[11px]"
                      >
                        {form.status}
                      </Badge>

                      {/* Response Counter Badge */}
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1 font-semibold">
                        <MessageSquare className="h-3 w-3" />
                        <span>{responseCount} {responseCount === 1 ? "response" : "responses"}</span>
                      </Badge>
                    </div>

                    {/* Top Right More Options Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs">
                        {form.status === "published" ? (
                          <>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/f/${form.id}`, "_blank");
                              }}
                              className="gap-2 cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-primary" />
                              <span>View Public Form</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={(e) => handleCopyPublicLink(e, form.id)}
                              className="gap-2 cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Public Link</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                unpublishMutation.mutate({ formId: form.id });
                              }}
                              className="gap-2 text-amber-500 cursor-pointer"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              <span>Unpublish Form</span>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              publishMutation.mutate({ formId: form.id });
                            }}
                            className="gap-2 text-emerald-500 font-semibold cursor-pointer"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            <span>Publish Form</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this form?")) {
                              deleteMutation.mutate({ formId: form.id });
                            }
                          }}
                          className="gap-2 text-destructive focus:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Form</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                    {form.title}
                  </CardTitle>

                  <CardDescription className="text-xs line-clamp-2 min-h-[32px] mt-1">
                    {form.description || "No description provided"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-2.5 text-xs text-muted-foreground border-t border-b bg-muted/20 flex justify-between items-center">
                  <span className="text-[11px]">
                    Created {new Date(form.createdAt ?? Date.now()).toLocaleDateString()}
                  </span>

                  {/* Click to Copy Public Link Slug Badge */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyPublicLink(e, form.id)}
                    className="font-mono text-[11px] bg-background hover:bg-accent px-2 py-0.5 rounded border transition-colors flex items-center gap-1 group/slug"
                    title="Click to copy public link"
                  >
                    <span>/{form.slug}</span>
                    <Copy className="h-3 w-3 text-muted-foreground group-hover/slug:text-primary transition-colors" />
                  </button>
                </CardContent>

                {/* Primary Card Bottom Actions: Edit Form & Analytics */}
                <CardFooter className="pt-3 pb-3 flex items-center justify-between gap-2">
                  <Link href={`/dashboard/forms/${form.id}`} onClick={(e) => e.stopPropagation()} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5 font-medium">
                      <Edit3 className="h-3.5 w-3.5 text-primary" />
                      <span>Edit Form</span>
                    </Button>
                  </Link>

                  <Link href={`/dashboard/forms/${form.id}/analytics`} onClick={(e) => e.stopPropagation()} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full h-8 text-xs gap-1.5 font-medium">
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Analytics</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
