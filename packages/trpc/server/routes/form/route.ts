import { TRPCError } from "@trpc/server";
import {
  createFormInputSchema,
  formOutputSchema,
  publicFormOutputSchema,
  updateFormInputSchema,
} from "@repo/services/form/model";
import { z } from "../../schema";
import { formService } from "../../services";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

function handleServiceError(error: unknown): never {
  if (error instanceof Error) {
    if (error.message === "FORM_NOT_FOUND") {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
    }
    if (error.message === "FORM_NOT_PUBLISHED") {
      throw new TRPCError({ code: "FORBIDDEN", message: "This form is not published" });
    }
    if (error.message === "FORBIDDEN") {
      throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this form" });
    }
  }

  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
}

const formIdInputSchema = z.object({ formId: z.string().uuid() });

export const formRouter = router({
  createForm: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS } })
    .input(createFormInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => formService.createForm(ctx.user.userId, input)),

  getMyForms: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/mine"), tags: TAGS } })
    .input(z.void())
    .output(z.array(formOutputSchema))
    .query(async ({ ctx }) => formService.getMyForms(ctx.user.userId)),

  getFormById: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{formId}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        return await formService.getFormById(input.formId, ctx.user.userId);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  getPublicForm: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/public/{formId}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(publicFormOutputSchema)
    .query(async ({ input }) => {
      try {
        return await formService.getPublicForm(input.formId);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  getExploreForms: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/explore"), tags: TAGS } })
    .input(z.void())
    .output(z.array(formOutputSchema))
    .query(async () => formService.getExploreForms()),

  updateForm: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/{formId}"), tags: TAGS } })
    .input(updateFormInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await formService.updateForm(ctx.user.userId, input);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  publishForm: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/publish"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await formService.publishForm(input.formId, ctx.user.userId);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  unpublishForm: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/unpublish"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await formService.unpublishForm(input.formId, ctx.user.userId);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  deleteForm: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{formId}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await formService.deleteForm(input.formId, ctx.user.userId);
      } catch (error) {
        handleServiceError(error);
      }
    }),
});
