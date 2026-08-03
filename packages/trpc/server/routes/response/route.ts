import { TRPCError } from "@trpc/server";
import { responseService, responseRateLimiter } from "../../services";
import {
  submitResponseInputSchema,
  submitResponseOutputSchema,
  getResponsesInputSchema,
  getResponsesOutputSchema,
  getFormAnalyticsInputSchema,
  getFormAnalyticsOutputSchema,
} from "@repo/services/response/model";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Responses"];
const getPath = generatePath("/responses");

function handleServiceError(err: unknown): never {
  if (err instanceof Error) {
    if (err.message === "FORM_NOT_FOUND") {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
    }
    if (err.message === "FORM_NOT_PUBLISHED") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This form is not accepting responses",
      });
    }
    if (err.message === "FORBIDDEN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not own this form",
      });
    }
    if (err.message === "VALIDATION_FAILED") {
      const validationErrors = (err as Error & { validationErrors?: unknown }).validationErrors;
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Some answers are invalid",
        cause: validationErrors,
      });
    }
  }
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
}

export const responseRouter = router({
  submitResponse: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/submit"), tags: TAGS } })
    .input(submitResponseInputSchema)
    .output(submitResponseOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const requesterIp = ctx.req.ip ?? "unknown";

      const rateLimitResult = responseRateLimiter.checkAndIncrement(input.formId, requesterIp);
      if (!rateLimitResult.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many submissions. Please try again shortly.",
        });
      }

      try {
        const response = await responseService.submitResponse(input, requesterIp, ctx.user?.userId);
        return { success: true as const, responseId: response.id };
      } catch (err) {
        handleServiceError(err);
      }
    }),

  getResponses: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{formId}"), tags: TAGS } })
    .input(getResponsesInputSchema)
    .output(getResponsesOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        return await responseService.getResponses(ctx.user.userId, input);
      } catch (err) {
        handleServiceError(err);
      }
    }),

  getFormAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{formId}/analytics"), tags: TAGS } })
    .input(getFormAnalyticsInputSchema)
    .output(getFormAnalyticsOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        return await responseService.getFormAnalytics(ctx.user.userId, input.formId);
      } catch (err) {
        handleServiceError(err);
      }
    }),
});