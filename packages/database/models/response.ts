import { pgTable, uuid, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const formResponsesTable = pgTable("form_responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),

  // { [fieldId]: answerValue }
  answers: jsonb("answers").$type<Record<string, unknown>>().notNull(),

  // for basic spam/rate-limit tracking, not for identifying users
  submitterIpHash: varchar("submitter_ip_hash", { length: 64 }),

  submittedAt: timestamp("submitted_at").defaultNow(),
});

export type SelectResponse = typeof formResponsesTable.$inferSelect;
export type InsertResponse = typeof formResponsesTable.$inferInsert;