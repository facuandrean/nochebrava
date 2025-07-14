import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { paymentMethods } from "./paymentMethod";

export const orders = sqliteTable("orders", {
  order_id: text("order_id").primaryKey().notNull(),
  date: text("date").notNull().default(sql`CURRENT_TIMESTAMP`),
  total: real("total").notNull(),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  payment_method_id: text("payment_method_id").notNull().references(() => paymentMethods.method_id)
})