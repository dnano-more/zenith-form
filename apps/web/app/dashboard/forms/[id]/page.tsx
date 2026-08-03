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
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "~/components/ui/collapsible";
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
  Phone,
  Sparkles,
  Pencil,
  Palette,
  ShieldCheck,
  ChevronDown,
  Settings2,
  Share2,
  Copy,
  Download,
  Code,
  QrCode,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { FORM_THEMES, getFormTheme } from "~/lib/themes";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { QRCodeCanvas } from "qrcode.react";

function FormBuilderSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Main Builder Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Settings Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/60">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Question Fields Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>

          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md bg-muted/40" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const FIELD_TYPES = [
  { value: "short_text", label: "Short Text", icon: Type },
  { value: "long_text", label: "Long Text (Paragraph)", icon: Type },
  { value: "email", label: "Email Address", icon: Mail },
  { value: "phone", label: "Phone Number", icon: Phone },
  { value: "number", label: "Number", icon: Hash },
  { value: "single_select", label: "Single Select (Radio)", icon: List },
  { value: "multi_select", label: "Multi Select (Checkboxes)", icon: List },
  { value: "checkbox", label: "Single Checkbox (Agree/True)", icon: CheckSquare },
  { value: "rating", label: "Rating (1 to 5)", icon: Star },
  { value: "date", label: "Date Picker", icon: Calendar },
] as const;

type FieldTypeEnum = (typeof FIELD_TYPES)[number]["value"];

// Helper conditional flags for clean non-tech UI
const isTextType = (t: FieldTypeEnum) => t === "short_text" || t === "long_text" || t === "email";
const isPhoneType = (t: FieldTypeEnum) => t === "phone";
const isNumberType = (t: FieldTypeEnum) => t === "number";
const isChoiceType = (t: FieldTypeEnum) => t === "single_select" || t === "multi_select";
const showPlaceholder = (t: FieldTypeEnum) => isTextType(t) || isPhoneType(t) || isNumberType(t);
const showAdvancedValidation = (t: FieldTypeEnum) => isTextType(t) || isPhoneType(t) || isNumberType(t);

export default function FormBuilderPage() {
  const params = useParams();
  const formId = params.id as string;
  const router = useRouter();
  const utils = trpc.useUtils();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddAdvancedOpen, setIsAddAdvancedOpen] = useState(false);
  const [fieldType, setFieldType] = useState<FieldTypeEnum>("short_text");
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [helpText, setHelpText] = useState("");
  const [required, setRequired] = useState(false);
  const [optionsText, setOptionsText] = useState("");

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/f/${formId}` : `/f/${formId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public form link copied to clipboard!");
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("form-qr-canvas") as HTMLCanvasElement;
    if (!canvas) {
      toast.error("QR Code image not available");
      return;
    }
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${form?.slug || "form"}-qr-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR Code downloaded!");
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${publicUrl}" width="100%" height="600px" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("IFrame embed code copied to clipboard!");
  };

  // Validation Rules State for Add Field
  const [pattern, setPattern] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("");
  const [htmlType, setHtmlType] = useState<"text" | "tel" | "email" | "url" | "password" | "number" | "">("");

  // Edit Field State
  const [editingField, setEditingField] = useState<NonNullable<typeof fields>[number] | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditAdvancedOpen, setIsEditAdvancedOpen] = useState(false);
  const [editFieldType, setEditFieldType] = useState<FieldTypeEnum>("short_text");
  const [editLabel, setEditLabel] = useState("");
  const [editPlaceholder, setEditPlaceholder] = useState("");
  const [editHelpText, setEditHelpText] = useState("");
  const [editRequired, setEditRequired] = useState(false);
  const [editOptionsText, setEditOptionsText] = useState("");

  // Edit Field Validation Rules State
  const [editPattern, setEditPattern] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [editMinLength, setEditMinLength] = useState("");
  const [editMaxLength, setEditMaxLength] = useState("");
  const [editMinVal, setEditMinVal] = useState("");
  const [editMaxVal, setEditMaxVal] = useState("");
  const [editHtmlType, setEditHtmlType] = useState<"text" | "tel" | "email" | "url" | "password" | "number" | "">("");

  // Queries
  const { data: form, isLoading: isFormLoading } = trpc.form.getFormById.useQuery({ formId });
  const { data: fields, isLoading: isFieldsLoading } = trpc.field.getFieldsByForm.useQuery({ formId });

  // Update Form Theme Mutation
  const updateFormMutation = trpc.form.updateForm.useMutation({
    onSuccess: () => {
      toast.success("Form visual theme updated!");
      utils.form.getFormById.invalidate({ formId });
    },
    onError: (err) => toast.error(err.message || "Failed to update theme"),
  });

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

  // Update Field Mutation
  const updateFieldMutation = trpc.field.updateField.useMutation({
    onSuccess: () => {
      toast.success("Field updated successfully!");
      setIsEditOpen(false);
      setEditingField(null);
      utils.field.getFieldsByForm.invalidate({ formId });
    },
    onError: (err) => toast.error(err.message || "Failed to update field"),
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
    setPattern("");
    setErrorMessage("");
    setMinLength("");
    setMaxLength("");
    setMinVal("");
    setMaxVal("");
    setHtmlType("");
    setIsAddAdvancedOpen(false);
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      toast.error("Field label is required");
      return;
    }

    const options = isChoiceType(fieldType)
      ? optionsText
          .split("\n")
          .map((o) => o.trim())
          .filter(Boolean)
      : undefined;

    if (isChoiceType(fieldType) && (!options || options.length === 0)) {
      toast.error("Choice fields must have at least one option");
      return;
    }

    const validation = showAdvancedValidation(fieldType)
      ? {
          pattern: (isTextType(fieldType) || isPhoneType(fieldType)) && pattern.trim() ? pattern.trim() : undefined,
          errorMessage: errorMessage.trim() || undefined,
          minLength: (isTextType(fieldType) || isPhoneType(fieldType)) && minLength ? Number(minLength) : undefined,
          maxLength: (isTextType(fieldType) || isPhoneType(fieldType)) && maxLength ? Number(maxLength) : undefined,
          min: isNumberType(fieldType) && minVal ? Number(minVal) : undefined,
          max: isNumberType(fieldType) && maxVal ? Number(maxVal) : undefined,
          htmlType: htmlType ? (htmlType as "text" | "tel" | "email" | "url" | "password" | "number") : undefined,
        }
      : undefined;

    addFieldMutation.mutate({
      formId,
      type: fieldType,
      label: label.trim(),
      placeholder: showPlaceholder(fieldType) ? (placeholder.trim() || undefined) : undefined,
      helpText: helpText.trim() || undefined,
      required,
      options,
      validation: validation && Object.keys(validation).some((k) => validation[k as keyof typeof validation] !== undefined)
        ? validation
        : undefined,
    });
  };

  const openEditDialog = (f: NonNullable<typeof fields>[number]) => {
    setEditingField(f);
    const fType = f.type as FieldTypeEnum;
    setEditFieldType(fType);
    setEditLabel(f.label);
    setEditPlaceholder(f.placeholder || "");
    setEditHelpText(f.helpText || "");
    setEditRequired(f.required);
    setEditOptionsText(f.options ? f.options.join("\n") : "");

    const v = f.validation || {};
    setEditPattern(v.pattern || "");
    setEditErrorMessage(v.errorMessage || "");
    setEditMinLength(v.minLength !== undefined ? String(v.minLength) : "");
    setEditMaxLength(v.maxLength !== undefined ? String(v.maxLength) : "");
    setEditMinVal(v.min !== undefined ? String(v.min) : "");
    setEditMaxVal(v.max !== undefined ? String(v.max) : "");
    setEditHtmlType((v.htmlType as "text" | "tel" | "email" | "url" | "password" | "number") || "");

    // Expand accordion if field already has validation rules configured
    const hasExistingAdvanced = !!(v.pattern || v.errorMessage || v.minLength || v.maxLength || v.min || v.max || v.htmlType);
    setIsEditAdvancedOpen(hasExistingAdvanced);

    setIsEditOpen(true);
  };

  const handleUpdateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;
    if (!editLabel.trim()) {
      toast.error("Field label is required");
      return;
    }

    const options = isChoiceType(editFieldType)
      ? editOptionsText
          .split("\n")
          .map((o) => o.trim())
          .filter(Boolean)
      : undefined;

    if (isChoiceType(editFieldType) && (!options || options.length === 0)) {
      toast.error("Choice fields must have at least one option");
      return;
    }

    const validation = showAdvancedValidation(editFieldType)
      ? {
          pattern: (isTextType(editFieldType) || isPhoneType(editFieldType)) && editPattern.trim() ? editPattern.trim() : undefined,
          errorMessage: editErrorMessage.trim() || undefined,
          minLength: (isTextType(editFieldType) || isPhoneType(editFieldType)) && editMinLength ? Number(editMinLength) : undefined,
          maxLength: (isTextType(editFieldType) || isPhoneType(editFieldType)) && editMaxLength ? Number(editMaxLength) : undefined,
          min: isNumberType(editFieldType) && editMinVal ? Number(editMinVal) : undefined,
          max: isNumberType(editFieldType) && editMaxVal ? Number(editMaxVal) : undefined,
          htmlType: editHtmlType ? (editHtmlType as "text" | "tel" | "email" | "url" | "password" | "number") : undefined,
        }
      : undefined;

    updateFieldMutation.mutate({
      fieldId: editingField.id,
      type: editFieldType,
      label: editLabel.trim(),
      placeholder: showPlaceholder(editFieldType) ? (editPlaceholder.trim() || undefined) : undefined,
      helpText: editHelpText.trim() || undefined,
      required: editRequired,
      options,
      validation: validation && Object.keys(validation).some((k) => validation[k as keyof typeof validation] !== undefined)
        ? validation
        : undefined,
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

  if (isFormLoading || isFieldsLoading) {
    return <FormBuilderSkeleton />;
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
              <Button
                size="sm"
                className="text-xs gap-1.5 shadow-sm font-semibold"
                onClick={() => setIsShareOpen(true)}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Form</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="text-xs text-amber-500 hover:text-amber-600 border border-amber-500/20"
                onClick={() => unpublishMutation.mutate({ formId: form.id })}
                disabled={unpublishMutation.isPending}
              >
                {unpublishMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1 text-amber-500" />}
                <span>Unpublish</span>
              </Button>
            </>
          ) : (
            <>
              <Link href={`/f/${form.id}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </Button>
              </Link>

              <Button
                size="sm"
                className="text-xs gap-1.5 shadow-sm"
                onClick={() => publishMutation.mutate({ formId: form.id })}
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Globe className="h-3.5 w-3.5" />
                )}
                <span>Publish Form</span>
              </Button>
            </>
          )}

          <Link href={`/dashboard/forms/${form.id}/analytics`}>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <span>View Analytics</span>
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
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={handleAddField}>
                  <DialogHeader>
                    <DialogTitle>Add Form Field</DialogTitle>
                    <DialogDescription>
                      Configure a new question field for your form.
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
                        placeholder="e.g. What is your full phone number?"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        required
                      />
                    </div>

                    {/* Placeholder (Hidden for checkbox, rating, date, select) */}
                    {showPlaceholder(fieldType) && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Placeholder (Optional)</label>
                        <Input
                          placeholder={fieldType === "phone" ? "+1 (555) 000-0000" : "e.g. Type your response here..."}
                          value={placeholder}
                          onChange={(e) => setPlaceholder(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Help Text */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Help Text (Optional)</label>
                      <Input
                        placeholder="e.g. Additional instructions for respondents."
                        value={helpText}
                        onChange={(e) => setHelpText(e.target.value)}
                      />
                    </div>

                    {/* Options Manager (ONLY for single_select & multi_select) */}
                    {isChoiceType(fieldType) && (
                      <div className="space-y-2 border-t pt-3">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                          Options List (One option per line) *
                        </label>
                        <Textarea
                          placeholder={`Option 1\nOption 2\nOption 3`}
                          value={optionsText}
                          onChange={(e) => setOptionsText(e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {/* Preset Length Rules for Phone */}
                    {isPhoneType(fieldType) && (
                      <div className="border rounded-xl p-3 bg-muted/10 space-y-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Preset Phone Length Rules</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">Min Digits</label>
                            <Input
                              type="number"
                              placeholder="10"
                              className="h-8 text-xs"
                              value={minLength}
                              onChange={(e) => setMinLength(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">Max Digits</label>
                            <Input
                              type="number"
                              placeholder="15"
                              className="h-8 text-xs"
                              value={maxLength}
                              onChange={(e) => setMaxLength(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Collapsible Advanced Validation & Limits (CLOSED by default) */}
                    {showAdvancedValidation(fieldType) && (
                      <Collapsible open={isAddAdvancedOpen} onOpenChange={setIsAddAdvancedOpen} className="border rounded-xl p-3 bg-muted/20 space-y-3">
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <Settings2 className="h-4 w-4 text-primary" />
                              <span>⚙️ Advanced Validation & Limits (Optional)</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isAddAdvancedOpen ? "rotate-180" : ""}`} />
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-3 pt-2 border-t border-border/40">
                          {(isTextType(fieldType) || isPhoneType(fieldType)) && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-medium text-muted-foreground">Validation Format / Rule</label>
                                  <Input
                                    placeholder="e.g. ^[0-9]{10}$"
                                    className="h-8 text-xs font-mono"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-medium text-muted-foreground">Error Message for Invalid Input</label>
                                  <Input
                                    placeholder="e.g. Please enter a valid number"
                                    className="h-8 text-xs"
                                    value={errorMessage}
                                    onChange={(e) => setErrorMessage(e.target.value)}
                                  />
                                </div>

                                {!isPhoneType(fieldType) && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[11px] font-medium text-muted-foreground">Min Length</label>
                                      <Input
                                        type="number"
                                        placeholder="e.g. 5"
                                        className="h-8 text-xs"
                                        value={minLength}
                                        onChange={(e) => setMinLength(e.target.value)}
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[11px] font-medium text-muted-foreground">Max Length</label>
                                      <Input
                                        type="number"
                                        placeholder="e.g. 100"
                                        className="h-8 text-xs"
                                        value={maxLength}
                                        onChange={(e) => setMaxLength(e.target.value)}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {isNumberType(fieldType) && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-muted-foreground">Min Value</label>
                                <Input
                                  type="number"
                                  placeholder="e.g. 0"
                                  className="h-8 text-xs"
                                  value={minVal}
                                  onChange={(e) => setMinVal(e.target.value)}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-muted-foreground">Max Value</label>
                                <Input
                                  type="number"
                                  placeholder="e.g. 100"
                                  className="h-8 text-xs"
                                  value={maxVal}
                                  onChange={(e) => setMaxVal(e.target.value)}
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">HTML Input Type Override</label>
                            <Select value={htmlType} onValueChange={(v) => setHtmlType(v as typeof htmlType)}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Default for category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">text (Standard Text)</SelectItem>
                                <SelectItem value="tel">tel (Telephone Input)</SelectItem>
                                <SelectItem value="email">email (Email Address)</SelectItem>
                                <SelectItem value="url">url (Web URL)</SelectItem>
                                <SelectItem value="number">number (Numeric Only)</SelectItem>
                                <SelectItem value="password">password (Hidden Mask)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                    {/* Required Switch */}
                    <div className="flex items-center justify-between pt-2 border-t">
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

            {/* Edit Field Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <form onSubmit={handleUpdateField}>
                  <DialogHeader>
                    <DialogTitle>Edit Form Field</DialogTitle>
                    <DialogDescription>
                      Modify field attributes dynamically.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Field Type Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Field Type *</label>
                      <Select value={editFieldType} onValueChange={(val) => setEditFieldType(val as FieldTypeEnum)}>
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
                        placeholder="e.g. What is your full phone number?"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        required
                      />
                    </div>

                    {/* Placeholder (Hidden for checkbox, rating, date, select) */}
                    {showPlaceholder(editFieldType) && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Placeholder (Optional)</label>
                        <Input
                          placeholder={editFieldType === "phone" ? "+1 (555) 000-0000" : "e.g. Type your response here..."}
                          value={editPlaceholder}
                          onChange={(e) => setEditPlaceholder(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Help Text */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Help Text (Optional)</label>
                      <Input
                        placeholder="e.g. Additional instructions for respondents."
                        value={editHelpText}
                        onChange={(e) => setEditHelpText(e.target.value)}
                      />
                    </div>

                    {/* Options Manager (ONLY for single_select & multi_select) */}
                    {isChoiceType(editFieldType) && (
                      <div className="space-y-2 border-t pt-3">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                          Options List (One option per line) *
                        </label>
                        <Textarea
                          placeholder={`Option 1\nOption 2\nOption 3`}
                          value={editOptionsText}
                          onChange={(e) => setEditOptionsText(e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {/* Preset Length Rules for Phone */}
                    {isPhoneType(editFieldType) && (
                      <div className="border rounded-xl p-3 bg-muted/10 space-y-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Preset Phone Length Rules</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">Min Digits</label>
                            <Input
                              type="number"
                              placeholder="10"
                              className="h-8 text-xs"
                              value={editMinLength}
                              onChange={(e) => setEditMinLength(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">Max Digits</label>
                            <Input
                              type="number"
                              placeholder="15"
                              className="h-8 text-xs"
                              value={editMaxLength}
                              onChange={(e) => setEditMaxLength(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Collapsible Advanced Validation & Limits (CLOSED by default) */}
                    {showAdvancedValidation(editFieldType) && (
                      <Collapsible open={isEditAdvancedOpen} onOpenChange={setIsEditAdvancedOpen} className="border rounded-xl p-3 bg-muted/20 space-y-3">
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center justify-between w-full text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <Settings2 className="h-4 w-4 text-primary" />
                              <span>⚙️ Advanced Validation & Limits (Optional)</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isEditAdvancedOpen ? "rotate-180" : ""}`} />
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-3 pt-2 border-t border-border/40">
                          {(isTextType(editFieldType) || isPhoneType(editFieldType)) && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-medium text-muted-foreground">Validation Format / Rule</label>
                                  <Input
                                    placeholder="e.g. ^[0-9]{10}$"
                                    className="h-8 text-xs font-mono"
                                    value={editPattern}
                                    onChange={(e) => setEditPattern(e.target.value)}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-medium text-muted-foreground">Error Message for Invalid Input</label>
                                  <Input
                                    placeholder="e.g. Please enter a valid number"
                                    className="h-8 text-xs"
                                    value={editErrorMessage}
                                    onChange={(e) => setEditErrorMessage(e.target.value)}
                                  />
                                </div>

                                {!isPhoneType(editFieldType) && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[11px] font-medium text-muted-foreground">Min Length</label>
                                      <Input
                                        type="number"
                                        placeholder="e.g. 5"
                                        className="h-8 text-xs"
                                        value={editMinLength}
                                        onChange={(e) => setEditMinLength(e.target.value)}
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[11px] font-medium text-muted-foreground">Max Length</label>
                                      <Input
                                        type="number"
                                        placeholder="e.g. 100"
                                        className="h-8 text-xs"
                                        value={editMaxLength}
                                        onChange={(e) => setEditMaxLength(e.target.value)}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {isNumberType(editFieldType) && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-muted-foreground">Min Value</label>
                                <Input
                                  type="number"
                                  placeholder="e.g. 0"
                                  className="h-8 text-xs"
                                  value={editMinVal}
                                  onChange={(e) => setEditMinVal(e.target.value)}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-muted-foreground">Max Value</label>
                                <Input
                                  type="number"
                                  placeholder="e.g. 100"
                                  className="h-8 text-xs"
                                  value={editMaxVal}
                                  onChange={(e) => setEditMaxVal(e.target.value)}
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-muted-foreground">HTML Input Type Override</label>
                            <Select value={editHtmlType} onValueChange={(v) => setEditHtmlType(v as typeof editHtmlType)}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Default for category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">text (Standard Text)</SelectItem>
                                <SelectItem value="tel">tel (Telephone Input)</SelectItem>
                                <SelectItem value="email">email (Email Address)</SelectItem>
                                <SelectItem value="url">url (Web URL)</SelectItem>
                                <SelectItem value="number">number (Numeric Only)</SelectItem>
                                <SelectItem value="password">password (Hidden Mask)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}

                    {/* Required Switch */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Mandatory / Required Field</label>
                      <Switch checked={editRequired} onCheckedChange={setEditRequired} />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateFieldMutation.isPending}>
                      {updateFieldMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Save Changes
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
                          {f.validation?.pattern && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono bg-primary/10 text-primary border-primary/20">
                              Validation Rule
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          Type: {f.type.replace("_", " ")} {f.validation?.htmlType ? `(${f.validation.htmlType})` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => openEditDialog(f)}
                        title="Edit Field"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      {/* Move Up */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={idx === 0 || reorderMutation.isPending}
                        onClick={() => handleMoveField(idx, "up")}
                        title="Move Up"
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
                        title="Move Down"
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
                        title="Delete Field"
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

        {/* Right Column: Form Settings & Visual Theme Selector */}
        <div className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                <span>Form Visual Theme</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Select visual styling for your public form preview & responses.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-1 gap-2.5">
                {Object.values(FORM_THEMES).map((t) => {
                  const isSelected = (form.theme || "default") === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateFormMutation.mutate({ formId: form.id, theme: t.id })}
                      className={`group relative text-left p-3 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary shadow-md"
                          : "border-border/60 hover:border-primary/50 hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Mini Visual Swatch Box */}
                        <div className={`h-10 w-14 rounded-lg bg-gradient-to-br ${t.swatchBg} p-1 border shadow-inner flex flex-col justify-between overflow-hidden shrink-0`}>
                          <div className={`h-2.5 w-full rounded ${t.swatchCard} flex items-center justify-end px-0.5`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${t.swatchAccent}`} />
                          </div>
                          <div className="h-1 w-2/3 rounded bg-white/40" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                              {t.name}
                            </span>
                            {isSelected && (
                              <Badge variant="default" className="text-[9px] px-1.5 py-0 bg-primary text-primary-foreground font-bold">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {t.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
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
                <span className="text-muted-foreground uppercase font-semibold text-[10px]">Current Theme</span>
                <p className="font-medium mt-0.5 capitalize">{getFormTheme(form.theme).name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Share Form Modal Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-lg space-y-4 bg-card/95 backdrop-blur-md border-border/80 shadow-2xl">
          <DialogHeader className="space-y-1.5 border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight">Share Form</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Distribute your published form via direct link, QR code, or embedded iframe.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="link" className="w-full pt-1">
            <TabsList className="grid grid-cols-3 w-full bg-muted/60 p-1">
              <TabsTrigger value="link" className="text-xs font-medium gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Direct Link</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="text-xs font-medium gap-1.5">
                <QrCode className="h-3.5 w-3.5" />
                <span>QR Code</span>
              </TabsTrigger>
              <TabsTrigger value="embed" className="text-xs font-medium gap-1.5">
                <Code className="h-3.5 w-3.5" />
                <span>Embed Code</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Direct Link */}
            <TabsContent value="link" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Public Form URL
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={publicUrl}
                    className="font-mono text-xs bg-muted/30 h-10"
                  />
                  <Button size="default" onClick={handleCopyLink} className="gap-1.5 shrink-0 font-medium text-xs shadow-sm">
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border/60 text-xs">
                <span className="text-muted-foreground font-medium">Test live form respondent view</span>
                <Link href={`/f/${form.id}`} target="_blank">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                    <span>Open Live Form</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Tab 2: Auto-Generated QR Code */}
            <TabsContent value="qr" className="space-y-4 pt-4 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-2xl border shadow-lg flex items-center justify-center">
                <QRCodeCanvas
                  id="form-qr-canvas"
                  value={publicUrl}
                  size={180}
                  level="H"
                  marginSize={2}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>

              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Scan with any smartphone camera to instantly open and submit this form.
              </p>

              <Button onClick={handleDownloadQR} variant="outline" size="sm" className="gap-2 text-xs font-medium border-primary/20 hover:bg-primary/5">
                <Download className="h-3.5 w-3.5 text-primary" />
                <span>Download QR Code (.png)</span>
              </Button>
            </TabsContent>

            {/* Tab 3: IFrame Embed Code */}
            <TabsContent value="embed" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Pre-Formatted IFrame Embed HTML
                </label>
                <Textarea
                  readOnly
                  rows={4}
                  value={`<iframe src="${publicUrl}" width="100%" height="600px" frameborder="0"></iframe>`}
                  className="font-mono text-xs bg-muted/30 resize-none p-3 leading-relaxed"
                />
              </div>

              <Button size="default" onClick={handleCopyEmbed} className="w-full gap-2 text-xs font-medium shadow-sm">
                <Code className="h-3.5 w-3.5" />
                <span>Copy Embed Code</span>
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsShareOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
