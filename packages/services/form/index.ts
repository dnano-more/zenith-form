import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "@repo/database";
import { formsTable, formFieldsTable } from "@repo/database/schema";
import { generateSlug } from "../utils/slugify";
import type { CreateFormInput, UpdateFormInput } from "./model";

class FormService {
  // Ownership check — reusable helper, har jagah repeat nahi karna padega
  private async getOwnedForm(formId: string, userId: string) {
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

  public async createForm(creatorId: string, input: CreateFormInput) {
    const slug = generateSlug(input.title);

    const [form] = await db
      .insert(formsTable)
      .values({
        creatorId,
        title: input.title,
        description: input.description,
        theme: input.theme ?? "default",
        visibility: input.visibility,
        slug,
        status: "draft",
      })
      .returning();

    if (!form) {
      throw new Error("Failed to create form");
    }

    return form;
  }

  public async getMyForms(creatorId: string) {
    return db
      .select()
      .from(formsTable)
      .where(eq(formsTable.creatorId, creatorId))
      .orderBy(desc(formsTable.createdAt));
  }

  public async getFormById(formId: string, userId: string) {
    return this.getOwnedForm(formId, userId);
  }

  public async updateForm(userId: string, input: UpdateFormInput) {
    await this.getOwnedForm(input.formId, userId);

    const [updated] = await db
      .update(formsTable)
      .set({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.theme !== undefined && { theme: input.theme }),
        ...(input.visibility !== undefined && { visibility: input.visibility }),
      })
      .where(eq(formsTable.id, input.formId))
      .returning();

    if (!updated) {
      throw new Error("FORM_NOT_FOUND");
    }

    return updated;
  }

  public async publishForm(formId: string, userId: string) {
    await this.getOwnedForm(formId, userId);

    const [updated] = await db
      .update(formsTable)
      .set({ status: "published", publishedAt: new Date() })
      .where(eq(formsTable.id, formId))
      .returning();

    if (!updated) {
      throw new Error("FORM_NOT_FOUND");
    }

    return updated;
  }

  public async unpublishForm(formId: string, userId: string) {
    await this.getOwnedForm(formId, userId);

    const [updated] = await db
      .update(formsTable)
      .set({ status: "draft" })
      .where(eq(formsTable.id, formId))
      .returning();

    if (!updated) {
      throw new Error("FORM_NOT_FOUND");
    }

    return updated;
  }

  public async deleteForm(formId: string, userId: string) {
    await this.getOwnedForm(formId, userId);

    await db.delete(formsTable).where(eq(formsTable.id, formId));

    return { success: true as const };
  }

  public async getPublicForm(formId: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, formId))
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
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.order));

    return {
      id: form.id,
      title: form.title,
      description: form.description,
      theme: form.theme,
      status: form.status,
      fields,
    };
  }

  public async getExploreForms() {
    return db
      .select()
      .from(formsTable)
      .where(and(eq(formsTable.status, "published"), eq(formsTable.visibility, "public")))
      .orderBy(desc(formsTable.publishedAt));
  }
}

export default FormService;
