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

// Keep broad high-level categories in Enum
export const fieldTypeEnum = pgEnum("field_type", [
  "short_text",
  "long_text",
  "email",
  "number",
  "phone",
  "single_select",
  "multi_select",
  "checkbox",
  "rating",
  "date",
]);

// Flexible validation rules stored in JSONB
export type FieldValidationRules = {
  htmlType?: "text" | "tel" | "email" | "url" | "password" | "number";
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern (e.g. ^[0-9]{10}$ for phone)
  errorMessage?: string;
  allowCountryCode?: boolean;
  defaultCountry?: string;
};

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

  options: jsonb("options").$type<string[]>(),
  validation: jsonb("validation").$type<FieldValidationRules>(),
});

export type SelectField = typeof formFieldsTable.$inferSelect;
export type InsertField = typeof formFieldsTable.$inferInsert;