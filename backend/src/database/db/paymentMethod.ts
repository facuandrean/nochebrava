import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const paymentMethods = sqliteTable("payment_methods", {
  method_id: text("method_id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

