import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@repo/database";
import { formsTable, formFieldsTable, formResponsesTable } from "@repo/database/schema";
import { validateAnswers } from "./validator";
import type { SubmitResponseInput } from "./model";

// Server-restart pe change ho jayega — demo scope ke liye theek hai.
// Production mein isko env variable se fixed rakhte.
const IP_SALT = randomBytes(16).toString("hex");

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + IP_SALT).digest("hex");
}

class ResponseService {
  public async submitResponse(input: SubmitResponseInput, requesterIp: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, input.formId))
      .limit(1);

    if (!form) {
      throw new Error("FORM_NOT_FOUND");
    }

    if (form.status !== "published") {
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
}

export default ResponseService;