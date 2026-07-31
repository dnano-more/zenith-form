import { z } from "zod";

export const createFormInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(1000).optional(),
  theme: z.string().max(50).optional(),
  visibility: z.enum(["public", "unlisted"]).default("unlisted"),
});
export type CreateFormInput = z.infer<typeof createFormInputSchema>;

export const updateFormInputSchema = z.object({
  formId: z.string().uuid(),
  title: z.string().min(1).max(150).optional(),
  description: z.string().max(1000).optional(),
  theme: z.string().max(50).optional(),
  visibility: z.enum(["public", "unlisted"]).optional(),
});
export type UpdateFormInput = z.infer<typeof updateFormInputSchema>;

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  theme: z.string().nullable(),
  visibility: z.enum(["public", "unlisted"]),
  status: z.enum(["draft", "published"]),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  publishedAt: z.date().nullable(),
});
export type FormOutput = z.infer<typeof formOutputSchema>;

export const publicFormOutputSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  theme: z.string().nullable(),
  status: z.enum(["draft", "published"]),
  fields: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.string(),
      label: z.string(),
      placeholder: z.string().nullable(),
      helpText: z.string().nullable(),
      required: z.boolean(),
      order: z.number(),
      options: z.array(z.string()).nullable(),
      validation: z.record(z.string(), z.unknown()).nullable(),
    })
  ),
});
export type PublicFormOutput = z.infer<typeof publicFormOutputSchema>;