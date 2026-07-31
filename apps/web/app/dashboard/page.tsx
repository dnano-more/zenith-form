"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
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
  Plus,
  Edit3,
  BarChart3,
  ExternalLink,
  Trash2,
  Globe,
  Lock,
  Sparkles,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const utils = trpc.useUtils();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Query user's forms
  const { data: forms, isLoading } = trpc.form.getMyForms.useQuery();

  // Create form mutation
  const createFormMutation = trpc.form.createForm.useMutation({
    onSuccess: (newForm) => {
      toast.success("Form created successfully!");
      setIsCreateOpen(false);
      setTitle("");
      setDescription("");
      utils.form.getMyForms.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create form");
    },
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
      visibility: "public",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, manage fields, and monitor real-time submissions for your forms
          </p>
        </div>

        {/* Create Form Modal Trigger */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="default" className="gap-2 font-medium shadow-sm">
              <Plus className="h-4 w-4" />
              <span>Create New Form</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleCreateForm}>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>
                  Set a title and optional description for your new interactive form.
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
      </div>

      {/* Forms Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
          <p className="text-sm font-medium">Loading your forms...</p>
        </div>
      ) : !forms || forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center bg-card">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">No forms created yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            Get started by creating your first interactive Typeform-style form in seconds.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Your First Form</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col justify-between border-border/60 hover:border-primary/40 transition-all shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge
                    variant={form.status === "published" ? "default" : "secondary"}
                    className="capitalize text-[11px]"
                  >
                    {form.status}
                  </Badge>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {form.visibility === "public" ? (
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    <span className="capitalize">{form.visibility}</span>
                  </div>
                </div>

                <CardTitle className="text-lg font-bold line-clamp-1">{form.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2 min-h-[32px] mt-1">
                  {form.description || "No description provided"}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-2 text-xs text-muted-foreground border-t border-b bg-muted/20 flex justify-between items-center">
                <span>Created {new Date(form.createdAt ?? Date.now()).toLocaleDateString()}</span>
                <span className="font-mono text-[11px] bg-background px-2 py-0.5 rounded border">
                  /{form.slug}
                </span>
              </CardContent>

              <CardFooter className="pt-4 flex flex-wrap gap-2 justify-between">
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/forms/${form.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Fields</span>
                    </Button>
                  </Link>

                  <Link href={`/dashboard/forms/${form.id}/analytics`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Analytics</span>
                    </Button>
                  </Link>

                  {form.status === "published" && (
                    <Link href={`/f/${form.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        <ExternalLink className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {form.status === "published" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-amber-500 hover:text-amber-600"
                      onClick={() => unpublishMutation.mutate({ formId: form.id })}
                    >
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-emerald-500 hover:text-emerald-600 font-medium"
                      onClick={() => publishMutation.mutate({ formId: form.id })}
                    >
                      Publish
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this form?")) {
                        deleteMutation.mutate({ formId: form.id });
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
