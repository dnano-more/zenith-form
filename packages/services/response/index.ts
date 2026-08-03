import { createHash, randomBytes } from "crypto";
import { eq, asc, desc, count } from "drizzle-orm";
import { db } from "@repo/database";
import { formsTable, formFieldsTable, formResponsesTable } from "@repo/database/schema";
import { validateAnswers } from "./validator";
import type { SubmitResponseInput, GetResponsesInput } from "./model";

// Server-restart pe change ho jayega — demo scope ke liye theek hai.
// Production mein isko env variable se fixed rakhte.
const IP_SALT = randomBytes(16).toString("hex");

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + IP_SALT).digest("hex");
}

class ResponseService {
  private async assertFormOwnership(formId: string, userId: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, formId))
      .limit(1);

    if (!form) {
      throw new Error("FORM_NOT_FOUND");
    }

    if (form.creatorId !== userId) {
      throw new Error("FORBIDDEN");
    }

    return form;
  }

  public async submitResponse(input: SubmitResponseInput, requesterIp: string, currentUserId?: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, input.formId))
      .limit(1);

    if (!form) {
      throw new Error("FORM_NOT_FOUND");
    }

    const isCreator = !!(currentUserId && currentUserId === form.creatorId);

    if (form.status !== "published" && !isCreator) {
      throw new Error("FORM_NOT_PUBLISHED");
    }

    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, input.formId));

    const { valid, errors, cleanedAnswers } = validateAnswers(fields, input.answers);

    if (!valid) {
      const err = new Error("VALIDATION_FAILED");
      (err as Error & { validationErrors?: typeof errors }).validationErrors = errors;
      throw err;
    }

    if (form.status === "draft" && isCreator) {
      return {
        id: "00000000-0000-0000-0000-000000000000",
        formId: input.formId,
        answers: cleanedAnswers,
        submitterIpHash: "",
        submittedAt: new Date(),
      };
    }

    const [response] = await db
      .insert(formResponsesTable)
      .values({
        formId: input.formId,
        answers: cleanedAnswers,
        submitterIpHash: hashIp(requesterIp),
      })
      .returning();

    if (!response) {
      throw new Error("Failed to save response");
    }

    return response;
  }

  public async getResponses(
    userId: string,
    input: GetResponsesInput
  ) {
    await this.assertFormOwnership(input.formId, userId);

    // Form fields fetch karein taaki client ko label and type map karne mein aasani ho
    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, input.formId))
      .orderBy(asc(formFieldsTable.order));

    // Responses count fetch karein (for pagination info)
    const [countResult] = await db
      .select({ total: count() })
      .from(formResponsesTable)
      .where(eq(formResponsesTable.formId, input.formId));

    const total = countResult?.total ?? 0;

    // Paginated responses fetch karein
    const responses = await db
      .select()
      .from(formResponsesTable)
      .where(eq(formResponsesTable.formId, input.formId))
      .orderBy(desc(formResponsesTable.submittedAt))
      .limit(input.limit)
      .offset(input.offset);

    return {
      responses: responses.map((r) => ({
        id: r.id,
        answers: r.answers,
        submittedAt: r.submittedAt ?? new Date(),
      })),
      total,
      fields: fields.map((f) => ({
        id: f.id,
        type: f.type,
        label: f.label,
        options: f.options,
        required: f.required,
      })),
    };
  }

  public async getFormAnalytics(
    userId: string,
    formId: string
  ) {
    await this.assertFormOwnership(formId, userId);

    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.order));

    const responses = await db
      .select()
      .from(formResponsesTable)
      .where(eq(formResponsesTable.formId, formId));

    const totalResponses = responses.length;

    const perField = fields.map((field) => {
      const type = field.type;

      // choice fields (single_select / multi_select)
      if (type === "single_select" || type === "multi_select") {
        const optionCounts: Record<string, number> = {};
        const options = field.options ?? [];
        for (const opt of options) {
          optionCounts[opt] = 0;
        }

        for (const resp of responses) {
          const answer = resp.answers[field.id];
          if (answer !== undefined && answer !== null) {
            if (type === "multi_select" && Array.isArray(answer)) {
              for (const val of answer) {
                if (typeof val === "string") {
                  optionCounts[val] = (optionCounts[val] ?? 0) + 1;
                }
              }
            } else if (typeof answer === "string") {
              optionCounts[answer] = (optionCounts[answer] ?? 0) + 1;
            }
          }
        }

        return {
          fieldId: field.id,
          label: field.label,
          type,
          stats: { optionCounts },
        };
      }

      // boolean checkbox field
      if (type === "checkbox") {
        const optionCounts: Record<string, number> = {
          "true": 0,
          "false": 0,
        };

        for (const resp of responses) {
          const answer = resp.answers[field.id];
          if (answer !== undefined && answer !== null) {
            const strVal = String(answer);
            if (strVal === "true" || strVal === "false") {
              optionCounts[strVal] = (optionCounts[strVal] ?? 0) + 1;
            }
          }
        }

        return {
          fieldId: field.id,
          label: field.label,
          type,
          stats: { optionCounts },
        };
      }

      // rating field (1-5 star metrics)
      if (type === "rating") {
        let sum = 0;
        let valCount = 0;
        let min = Infinity;
        let max = -Infinity;

        for (const resp of responses) {
          const answer = resp.answers[field.id];
          if (answer !== undefined && answer !== null && answer !== "") {
            const num = Number(answer);
            if (!Number.isNaN(num)) {
              sum += num;
              valCount++;
              if (num < min) min = num;
              if (num > max) max = num;
            }
          }
        }

        const hasValues = valCount > 0;
        return {
          fieldId: field.id,
          label: field.label,
          type,
          stats: {
            average: hasValues ? Number((sum / valCount).toFixed(2)) : 0,
            min: hasValues ? min : 0,
            max: hasValues ? max : 0,
          },
        };
      }

      // number, text, email, date fields
      let answeredCount = 0;
      const recentAnswers: string[] = [];
      for (const resp of responses) {
        const answer = resp.answers[field.id];
        if (answer !== undefined && answer !== null && answer !== "") {
          answeredCount++;
          if (recentAnswers.length < 3) {
            recentAnswers.push(String(answer));
          }
        }
      }

      return {
        fieldId: field.id,
        label: field.label,
        type,
        stats: { answeredCount, recentAnswers },
      };
    });

    return {
      totalResponses,
      perField,
    };
  }
}

export default ResponseService;