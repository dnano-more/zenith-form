import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formVisibilityEnum = pgEnum("form_visibility", [
  "public",
  "unlisted",
]);

export const formStatusEnum = pgEnum("form_status", ["draft", "published"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  creatorId: uuid("creator_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),

  slug: varchar("slug", { length: 150 }).notNull().unique(),

  theme: varchar("theme", { length: 50 }).default("default"),

  visibility: formVisibilityEnum("visibility").notNull().default("unlisted"),
  status: formStatusEnum("status").notNull().default("draft"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  publishedAt: timestamp("published_at"),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;