import { z } from "zod";

export const submitResponseInputSchema = z.object({
  formId: z.string().uuid(),
  answers: z.record(z.string(), z.unknown()),
});
export type SubmitResponseInput = z.infer<typeof submitResponseInputSchema>;

export const submitResponseOutputSchema = z.object({
  success: z.literal(true),
  responseId: z.string().uuid(),
});

export const getResponsesInputSchema = z.object({
  formId: z.string().uuid(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});
export type GetResponsesInput = z.infer<typeof getResponsesInputSchema>;

export const getResponsesOutputSchema = z.object({
  responses: z.array(
    z.object({
      id: z.string().uuid(),
      answers: z.record(z.string(), z.unknown()),
      submittedAt: z.date(),
    })
  ),
  total: z.number(),
  fields: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.string(),
      label: z.string(),
      options: z.array(z.string()).nullable(),
      required: z.boolean(),
    })
  ),
});
export type GetResponsesOutput = z.infer<typeof getResponsesOutputSchema>;

export const getFormAnalyticsInputSchema = z.object({
  formId: z.string().uuid(),
});
export type GetFormAnalyticsInput = z.infer<typeof getFormAnalyticsInputSchema>;

export const getFormAnalyticsOutputSchema = z.object({
  totalResponses: z.number(),
  perField: z.array(
    z.object({
      fieldId: z.string().uuid(),
      label: z.string(),
      type: z.string(),
      stats: z.union([
        z.object({
          optionCounts: z.record(z.string(), z.number()),
        }),
        z.object({
          average: z.number(),
          min: z.number(),
          max: z.number(),
        }),
        z.object({
          answeredCount: z.number(),
          recentAnswers: z.array(z.string()).optional(),
        }),
      ]),
    })
  ),
});
export type GetFormAnalyticsOutput = z.infer<typeof getFormAnalyticsOutputSchema>;