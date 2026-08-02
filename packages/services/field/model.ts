import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "short_text",
  "long_text",
  "email",
  "number",
  "phone",
  "single_select",
  "multi_select",
  "checkbox",
  "rating",
  "date",
]);

export const fieldValidationRulesSchema = z.object({
  htmlType: z.enum(["text", "tel", "email", "url", "password", "number"]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  errorMessage: z.string().optional(),
  allowCountryCode: z.boolean().optional(),
  defaultCountry: z.string().optional(),
});
export type FieldValidationRules = z.infer<typeof fieldValidationRulesSchema>;

export const addFieldInputSchema = z.object({
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string().min(1, "Label is required").max(255),
  placeholder: z.string().max(255).optional(),
  helpText: z.string().max(500).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  validation: fieldValidationRulesSchema.optional(),
});
export type AddFieldInput = z.infer<typeof addFieldInputSchema>;

export const updateFieldInputSchema = z.object({
  fieldId: z.string().uuid(),
  type: fieldTypeSchema.optional(),
  label: z.string().min(1).max(255).optional(),
  placeholder: z.string().max(255).optional(),
  helpText: z.string().max(500).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  validation: fieldValidationRulesSchema.optional(),
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
  validation: fieldValidationRulesSchema.nullable(),
});
export type FieldOutput = z.infer<typeof fieldOutputSchema>;