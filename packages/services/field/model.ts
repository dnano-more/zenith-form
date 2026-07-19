import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "short_text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "checkbox",
  "rating",
  "date",
]);

export const addFieldInputSchema = z.object({
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string().min(1, "Label is required").max(255),
  placeholder: z.string().max(255).optional(),
  helpText: z.string().max(500).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // select/multi-select/checkbox ke liye
  validation: z.record(z.string(), z.unknown()).optional(),
});
export type AddFieldInput = z.infer<typeof addFieldInputSchema>;

export const updateFieldInputSchema = z.object({
  fieldId: z.string().uuid(),
  label: z.string().min(1).max(255).optional(),
  placeholder: z.string().max(255).optional(),
  helpText: z.string().max(500).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  validation: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateFieldInput = z.infer<typeof updateFieldInputSchema>;

export const reorderFieldsInputSchema = z.object({
  formId: z.string().uuid(),
  orderedFieldIds: z.array(z.string().uuid()).min(1),
});
export type ReorderFieldsInput = z.infer<typeof reorderFieldsInputSchema>;

export const fieldOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string(),
  placeholder: z.string().nullable(),
  helpText: z.string().nullable(),
  required: z.boolean(),
  order: z.number(),
  options: z.array(z.string()).nullable(),
  validation: z.record(z.string(), z.unknown()).nullable(),
});
export type FieldOutput = z.infer<typeof fieldOutputSchema>;