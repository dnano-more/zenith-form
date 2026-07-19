import { eq, asc, max } from "drizzle-orm";
import { db } from "@repo/database";
import { formFieldsTable, formsTable } from "@repo/database/schema";
import type { AddFieldInput, UpdateFieldInput } from "./model";

class FieldService {
  // Reusable ownership check — form fetch karke verify karta hai
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

  public async getFieldsByForm(formId: string, userId: string) {
    await this.assertFormOwnership(formId, userId);

    return db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.order));
  }

  public async addField(userId: string, input: AddFieldInput) {
    await this.assertFormOwnership(input.formId, userId);

    // current max order nikaalo, naya field uske baad aayega
    const [result] = await db
      .select({ maxOrder: max(formFieldsTable.order) })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, input.formId));

    const nextOrder = (result?.maxOrder ?? -1) + 1;

    const [field] = await db
      .insert(formFieldsTable)
      .values({
        formId: input.formId,
        type: input.type,
        label: input.label,
        placeholder: input.placeholder,
        helpText: input.helpText,
        required: input.required,
        order: nextOrder,
        options: input.options,
        validation: input.validation,
      })
      .returning();

    if (!field) {
      throw new Error("Failed to create field");
    }

    return field;
  }

  public async updateField(userId: string, input: UpdateFieldInput) {
    const [existingField] = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, input.fieldId))
      .limit(1);

    if (!existingField) {
      throw new Error("FIELD_NOT_FOUND");
    }

    // field ke through uske parent form ka ownership check
    await this.assertFormOwnership(existingField.formId, userId);

    const [updated] = await db
      .update(formFieldsTable)
      .set({
        ...(input.label !== undefined && { label: input.label }),
        ...(input.placeholder !== undefined && { placeholder: input.placeholder }),
        ...(input.helpText !== undefined && { helpText: input.helpText }),
        ...(input.required !== undefined && { required: input.required }),
        ...(input.options !== undefined && { options: input.options }),
        ...(input.validation !== undefined && { validation: input.validation }),
      })
      .where(eq(formFieldsTable.id, input.fieldId))
      .returning();

    if (!updated) {
      throw new Error("FIELD_NOT_FOUND");
    }

    return updated;
  }

  public async deleteField(fieldId: string, userId: string) {
    const [existingField] = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, fieldId))
      .limit(1);

    if (!existingField) {
      throw new Error("FIELD_NOT_FOUND");
    }

    await this.assertFormOwnership(existingField.formId, userId);

    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, fieldId));

    return { success: true as const };
  }

  public async reorderFields(userId: string, formId: string, orderedFieldIds: string[]) {
    await this.assertFormOwnership(formId, userId);

    // har field ka naya order sequentially update karo
    await Promise.all(
      orderedFieldIds.map((fieldId, index) =>
        db
          .update(formFieldsTable)
          .set({ order: index })
          .where(eq(formFieldsTable.id, fieldId)),
      ),
    );

    return this.getFieldsByForm(formId, userId);
  }
}

export default FieldService;