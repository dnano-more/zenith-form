"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
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
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Globe,
  Lock,
  ExternalLink,
  Loader2,
  Type,
  List,
  CheckSquare,
  Star,
  Calendar,
  Hash,
  Mail,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const FIELD_TYPES = [
  { value: "short_text", label: "Short Text", icon: Type },
  { value: "long_text", label: "Long Text (Paragraph)", icon: Type },
  { value: "email", label: "Email Address", icon: Mail },
  { value: "number", label: "Number", icon: Hash },
  { value: "single_select", label: "Single Select (Radio)", icon: List },
  { value: "multi_select", label: "Multi Select (Checkboxes)", icon: List },
  { value: "checkbox", label: "Single Checkbox (Agree/True)", icon: CheckSquare },
  { value: "rating", label: "Rating (1 to 5)", icon: Star },
  { value: "date", label: "Date Picker", icon: Calendar },
] as const;

type FieldTypeEnum = (typeof FIELD_TYPES)[number]["value"];

export default function FormBuilderPage() {
  const params = useParams();
  const formId = params.id as string;
  const router = useRouter();
  const utils = trpc.useUtils();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [fieldType, setFieldType] = useState<FieldTypeEnum>("short_text");
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [helpText, setHelpText] = useState("");
  const [required, setRequired] = useState(false);
  const [optionsText, setOptionsText] = useState("");

  // Queries
  const { data: form, isLoading: isFormLoading } = trpc.form.getFormById.useQuery({ formId });
  const { data: fields, isLoading: isFieldsLoading } = trpc.field.getFieldsByForm.useQuery({ formId });

  // Add Field Mutation
  const addFieldMutation = trpc.field.addField.useMutation({
    onSuccess: () => {
      toast.success("Field added successfully!");
      setIsAddOpen(false);
      resetForm();
      utils.field.getFieldsByForm.invalidate({ formId });
    },
    onError: (err) => toast.error(err.message || "Failed to add field"),
  });

  // Delete Field Mutation
  const deleteFieldMutation = trpc.field.deleteField.useMutation({
    onSuccess: () => {
      toast.success("Field deleted");
      utils.field.getFieldsByForm.invalidate({ formId });
    },
    onError: (err) => toast.error(err.message),
  });

  // Reorder Fields Mutation
  const reorderMutation = trpc.field.reorderFields.useMutation({
    onSuccess: () => {
      toast.success("Field order updated");
      utils.field.getFieldsByForm.invalidate({ formId });
    },
    onError: (err) => toast.error(err.message),
  });

  // Publish / Unpublish Mutations
  const publishMutation = trpc.form.publishForm.useMutation({
    onSuccess: () => {
      toast.success("Form published!");
      utils.form.getFormById.invalidate({ formId });
    },
  });

  const unpublishMutation = trpc.form.unpublishForm.useMutation({
    onSuccess: () => {
      toast.info("Form status set to draft");
      utils.form.getFormById.invalidate({ formId });
    },
  });

  const resetForm = () => {
    setFieldType("short_text");
    setLabel("");
    setPlaceholder("");
    setHelpText("");
    setRequired(false);
    setOptionsText("");
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      toast.error("Field label is required");
      return;
    }

    const options =
      fieldType === "single_select" || fieldType === "multi_select"
        ? optionsText
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;

    if (
      (fieldType === "single_select" || fieldType === "multi_select") &&
      (!options || options.length === 0)
    ) {
      toast.error("Choice fields must have at least one option");
      return;
    }

    addFieldMutation.mutate({
      formId,
      type: fieldType,
      label: label.trim(),
      placeholder: placeholder.trim() || undefined,
      helpText: helpText.trim() || undefined,
      required,
      options,
    });
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    if (!fields) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const newOrderedIds = [...fields.map((f) => f.id)];
    const temp = newOrderedIds[index];
    newOrderedIds[index] = newOrderedIds[targetIndex]!;
    newOrderedIds[targetIndex] = temp!;

    reorderMutation.mutate({
      formId,
      orderedFieldIds: newOrderedIds,
    });
  };

  if (isFormLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium">Loading form builder...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Form not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">The requested form does not exist or you do not have permission.</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
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
              <Badge variant={form.status === "published" ? "default" : "secondary"} className="capitalize text-[11px]">
                {form.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{form.description || "No description set"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {form.status === "published" ? (
            <>
              <Link href={`/f/${form.id}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Preview Public Form</span>
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs text-amber-500 hover:text-amber-600"
                onClick={() => unpublishMutation.mutate({ formId: form.id })}
              >
                Unpublish
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="text-xs gap-1.5 shadow-sm"
              onClick={() => publishMutation.mutate({ formId: form.id })}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Publish Form</span>
            </Button>
          )}

          <Link href={`/dashboard/forms/${form.id}/analytics`}>
            <Button variant="outline" size="sm" className="text-xs">
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Form Fields ({fields?.length ?? 0})</h2>

            {/* Add Field Modal Trigger */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Field</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleAddField}>
                  <DialogHeader>
                    <DialogTitle>Add Form Field</DialogTitle>
                    <DialogDescription>
                      Configure a new field to add to your interactive form.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Field Type Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Field Type *</label>
                      <Select value={fieldType} onValueChange={(val) => setFieldType(val as FieldTypeEnum)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              <div className="flex items-center gap-2">
                                <t.icon className="h-4 w-4 text-primary" />
                                <span>{t.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Field Label */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Label (Question Text) *</label>
                      <Input
                        placeholder="e.g. What is your full name?"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        required
                      />
                    </div>

                    {/* Placeholder */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Placeholder (Optional)</label>
                      <Input
                        placeholder="e.g. Type your response here..."
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                      />
                    </div>

                    {/* Help Text */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Help Text (Optional)</label>
                      <Input
                        placeholder="e.g. We will never share your details."
                        value={helpText}
                        onChange={(e) => setHelpText(e.target.value)}
                      />
                    </div>

                    {/* Options list for choice fields */}
                    {(fieldType === "single_select" || fieldType === "multi_select") && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                          Options (One option per line) *
                        </label>
                        <Textarea
                          placeholder={`Option 1\nOption 2\nOption 3`}
                          value={optionsText}
                          onChange={(e) => setOptionsText(e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {/* Required Switch */}
                    <div className="flex items-center justify-between pt-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Mandatory / Required Field</label>
                      <Switch checked={required} onCheckedChange={setRequired} />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addFieldMutation.isPending}>
                      {addFieldMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Add Field
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Fields Render List */}
          {isFieldsLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
              <span className="text-xs font-medium">Loading fields...</span>
            </div>
          ) : !fields || fields.length === 0 ? (
            <Card className="border-dashed p-8 text-center bg-card">
              <p className="text-sm font-medium text-muted-foreground">No fields added to this form yet.</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Click "Add New Field" to start building your questions.</p>
              <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Add First Question</span>
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {fields.map((f, idx) => (
                <Card key={f.id} className="border-border/60 shadow-sm transition-all hover:border-primary/30">
                  <CardHeader className="py-4 px-5 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                        {idx + 1}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{f.label}</h4>
                          {f.required && <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Required</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          Type: {f.type.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === 0 || reorderMutation.isPending}
                        onClick={() => handleMoveField(idx, "up")}
                      >
                        <MoveUp className="h-3.5 w-3.5" />
                      </Button>

                      {/* Move Down */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === fields.length - 1 || reorderMutation.isPending}
                        onClick={() => handleMoveField(idx, "down")}
                      >
                        <MoveDown className="h-3.5 w-3.5" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Delete this field?")) {
                            deleteFieldMutation.mutate({ fieldId: f.id });
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Show options preview if choice field */}
                  {f.options && f.options.length > 0 && (
                    <CardContent className="pt-0 pb-3 px-5 text-xs">
                      <div className="flex flex-wrap gap-1.5">
                        {f.options.map((opt, oIdx) => (
                          <Badge key={oIdx} variant="outline" className="text-[10px] bg-muted/30">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Form Settings Summary */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Form Info</CardTitle>
              <CardDescription className="text-xs">Summary configuration</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground uppercase font-semibold text-[10px]">Slug</span>
                <p className="font-mono mt-0.5">/{form.slug}</p>
              </div>

              <div>
                <span className="text-muted-foreground uppercase font-semibold text-[10px]">Status</span>
                <p className="font-medium mt-0.5 capitalize">{form.status}</p>
              </div>

              <div>
                <span className="text-muted-foreground uppercase font-semibold text-[10px]">Visibility</span>
                <p className="font-medium mt-0.5 capitalize">{form.visibility}</p>
              </div>

              <div>
                <span className="text-muted-foreground uppercase font-semibold text-[10px]">Theme</span>
                <p className="font-medium mt-0.5 capitalize">{form.theme}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
