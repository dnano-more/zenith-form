import { TRPCError } from "@trpc/server";
import {
  addFieldInputSchema,
  fieldOutputSchema,
  reorderFieldsInputSchema,
  updateFieldInputSchema,
} from "@repo/services/field/model";
import { z } from "../../schema";
import { fieldService } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Fields"];
const getPath = generatePath("/fields");

function handleServiceError(error: unknown): never {
  if (error instanceof Error) {
    if (error.message === "FORM_NOT_FOUND") {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
    }

    if (error.message === "FIELD_NOT_FOUND") {
      throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });
    }

    if (error.message === "FORBIDDEN") {
      throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this form" });
    }
  }

  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
}

const formIdInputSchema = z.object({ formId: z.string().uuid() });
const fieldIdInputSchema = z.object({ fieldId: z.string().uuid() });

export const fieldRouter = router({
  getFieldsByForm: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{formId}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(z.array(fieldOutputSchema))
    .query(async ({ ctx, input }) => {
      try {
        return await fieldService.getFieldsByForm(input.formId, ctx.user.userId);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  addField: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/"), tags: TAGS } })
    .input(addFieldInputSchema)
    .output(fieldOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await fieldService.addField(ctx.user.userId, input);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  updateField: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: getPath("/{fieldId}"), tags: TAGS } })
    .input(updateFieldInputSchema)
    .output(fieldOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await fieldService.updateField(ctx.user.userId, input);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  deleteField: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{fieldId}"), tags: TAGS } })
    .input(fieldIdInputSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await fieldService.deleteField(input.fieldId, ctx.user.userId);
      } catch (error) {
        handleServiceError(error);
      }
    }),

  reorderFields: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/reorder"), tags: TAGS } })
    .input(reorderFieldsInputSchema)
    .output(z.array(fieldOutputSchema))
    .mutation(async ({ ctx, input }) => {
      try {
        return await fieldService.reorderFields(
          ctx.user.userId,
          input.formId,
          input.orderedFieldIds,
        );
      } catch (error) {
        handleServiceError(error);
      }
    }),
});
