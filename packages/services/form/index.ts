import { eq, and, desc } from "drizzle-orm";
import { db } from "@repo/database";
import { formsTable } from "@repo/database/schema";
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
    // yahan getOwnedForm use kiya — sirf apna form dekh sake
    return this.getOwnedForm(formId, userId);
  }

  public async updateForm(userId: string, input: UpdateFormInput) {
    await this.getOwnedForm(input.formId, userId); // ownership verify pehle

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
}

export default FormService;
