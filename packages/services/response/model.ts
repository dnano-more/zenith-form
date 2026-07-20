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