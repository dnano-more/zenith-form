import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type", [
  "short_text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "checkbox",
  "rating",
  "date",
]);

export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),

  type: fieldTypeEnum("type").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  placeholder: varchar("placeholder", { length: 255 }),
  helpText: varchar("help_text", { length: 500 }),

  required: boolean("required").notNull().default(false),
  order: integer("order").notNull().default(0),

  // for single_select / multi_select -> array of options
  // for number/text -> { min, max, minLength, maxLength, pattern }
  options: jsonb("options").$type<string[]>(),
  validation: jsonb("validation").$type<Record<string, unknown>>(),
});

export type SelectField = typeof formFieldsTable.$inferSelect;
export type InsertField = typeof formFieldsTable.$inferInsert;