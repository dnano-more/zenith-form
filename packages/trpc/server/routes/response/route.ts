import { TRPCError } from "@trpc/server";
import { responseService, responseRateLimiter } from "../../services";
import { submitResponseInputSchema, submitResponseOutputSchema } from "@repo/services/response/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Responses"];
const getPath = generatePath("/responses");

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
        const response = await responseService.submitResponse(input, requesterIp);
        return { success: true as const, responseId: response.id };
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "FORM_NOT_FOUND") {
            throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
          }
          if (err.message === "FORM_NOT_PUBLISHED") {
            throw new TRPCError({ code: "FORBIDDEN", message: "This form is not accepting responses" });
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
    }),
});