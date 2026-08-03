import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "@repo/database";
import { formsTable, formFieldsTable, formResponsesTable } from "@repo/database/schema";
import { generateSlug } from "../utils/slugify";
import type { CreateFormInput, UpdateFormInput } from "./model";

export class FormService {
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
    const forms = await db
      .select({
        id: formsTable.id,
        creatorId: formsTable.creatorId,
        title: formsTable.title,
        description: formsTable.description,
        status: formsTable.status,
        theme: formsTable.theme,
        visibility: formsTable.visibility,
        slug: formsTable.slug,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        publishedAt: formsTable.publishedAt,
        responseCount: sql<number>`count(${formResponsesTable.id})::int`,
      })
      .from(formsTable)
      .leftJoin(formResponsesTable, eq(formResponsesTable.formId, formsTable.id))
      .where(eq(formsTable.creatorId, creatorId))
      .groupBy(formsTable.id)
      .orderBy(desc(formsTable.createdAt));

    return forms;
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
      .select({
        id: formsTable.id,
        creatorId: formsTable.creatorId,
        title: formsTable.title,
        description: formsTable.description,
        status: formsTable.status,
        theme: formsTable.theme,
        visibility: formsTable.visibility,
        slug: formsTable.slug,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        publishedAt: formsTable.publishedAt,
        responseCount: sql<number>`count(${formResponsesTable.id})::int`,
      })
      .from(formsTable)
      .leftJoin(formResponsesTable, eq(formResponsesTable.formId, formsTable.id))
      .where(eq(formsTable.status, "published"))
      .groupBy(formsTable.id)
      .orderBy(desc(formsTable.createdAt))
      .limit(20);
  }

  public async seedSampleForms(creatorId: string) {
    // Form 1: Customer Feedback & Support
    const slug1 = generateSlug("Customer Feedback & Support");
    const [form1] = await db
      .insert(formsTable)
      .values({
        creatorId,
        title: "Customer Feedback & Support",
        description: "Pre-built sample form to collect customer satisfaction ratings and feedback.",
        theme: "cyber_neon",
        visibility: "public",
        status: "published",
        slug: slug1,
        publishedAt: new Date(),
      })
      .returning();

    if (form1) {
      const [f1, f2, f3, f4, f5, f6] = await db
        .insert(formFieldsTable)
        .values([
          { formId: form1.id, type: "short_text", label: "Full Name", placeholder: "Jane Doe", required: true, order: 0 },
          { formId: form1.id, type: "email", label: "Email Address", placeholder: "jane@example.com", required: true, order: 1 },
          { formId: form1.id, type: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", required: false, order: 2 },
          { formId: form1.id, type: "rating", label: "Overall Satisfaction Rating", required: true, order: 3 },
          { formId: form1.id, type: "single_select", label: "Would you recommend our product?", options: ["Definitely", "Maybe", "Not likely"], required: true, order: 4 },
          { formId: form1.id, type: "long_text", label: "Detailed Feedback & Suggestions", placeholder: "Share your detailed thoughts...", required: false, order: 5 },
        ])
        .returning();

      if (f1 && f2 && f3 && f4 && f5 && f6) {
        await db.insert(formResponsesTable).values([
          {
            formId: form1.id,
            answers: {
              [f1.id]: "Alex Johnson",
              [f2.id]: "alex@example.com",
              [f3.id]: "+1 555-019-2834",
              [f4.id]: 5,
              [f5.id]: "Definitely",
              [f6.id]: "Amazing user interface and lightning-fast form submissions!",
            },
          },
          {
            formId: form1.id,
            answers: {
              [f1.id]: "Samantha Reed",
              [f2.id]: "samantha.r@techcorp.io",
              [f3.id]: "+1 555-014-9921",
              [f4.id]: 4,
              [f5.id]: "Definitely",
              [f6.id]: "Great product experience, super smooth animations.",
            },
          },
          {
            formId: form1.id,
            answers: {
              [f1.id]: "Michael Chen",
              [f2.id]: "m.chen@designhub.co",
              [f3.id]: "+1 555-017-3342",
              [f4.id]: 5,
              [f5.id]: "Definitely",
              [f6.id]: "The dark mode themes look stunning!",
            },
          },
        ]);
      }
    }

    // Form 2: Product Launch Event Registration
    const slug2 = generateSlug("Product Launch Event Registration");
    const [form2] = await db
      .insert(formsTable)
      .values({
        creatorId,
        title: "Product Launch Event Registration",
        description: "Pre-built registration form for upcoming live launch events.",
        theme: "emerald",
        visibility: "public",
        status: "published",
        slug: slug2,
        publishedAt: new Date(),
      })
      .returning();

    if (form2) {
      const [g1, g2, g3, g4] = await db
        .insert(formFieldsTable)
        .values([
          { formId: form2.id, type: "short_text", label: "Full Name", placeholder: "John Smith", required: true, order: 0 },
          { formId: form2.id, type: "email", label: "Work Email", placeholder: "john@company.com", required: true, order: 1 },
          { formId: form2.id, type: "single_select", label: "Attendance Preference", options: ["In-Person (San Francisco)", "Virtual Livestream"], required: true, order: 2 },
          { formId: form2.id, type: "number", label: "Number of Attendees", placeholder: "1", required: true, order: 3 },
        ])
        .returning();

      if (g1 && g2 && g3 && g4) {
        await db.insert(formResponsesTable).values([
          {
            formId: form2.id,
            answers: {
              [g1.id]: "David Miller",
              [g2.id]: "david@startup.io",
              [g3.id]: "In-Person (San Francisco)",
              [g4.id]: 2,
            },
          },
          {
            formId: form2.id,
            answers: {
              [g1.id]: "Elena Rostova",
              [g2.id]: "elena@globaltech.com",
              [g3.id]: "Virtual Livestream",
              [g4.id]: 1,
            },
          },
        ]);
      }
    }

    return { success: true as const };
  }
}

export default FormService;
