import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const paymentMethods = sqliteTable("PaymentMethods", {
  payment_method_id: text("payment_method_id").primaryKey().notNull(),
  name: text("name").notNull()
});