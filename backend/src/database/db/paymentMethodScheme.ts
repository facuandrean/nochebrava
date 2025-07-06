import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Payment methods table.
 * @property {string} payment_method_id - The payment method id.
 * @property {string} name - The payment method name.
 */
export const paymentMethods = sqliteTable("payment_methods", {
  payment_method_id: text("payment_method_id").primaryKey().notNull(),
  name: text("name").notNull()
});