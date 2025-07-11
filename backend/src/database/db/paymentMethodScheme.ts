import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const paymentMethods = sqliteTable("payment_methods", {
  payment_method_id: text("payment_method_id").primaryKey().notNull(),
  name: text("name").notNull()
});