import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { paymentMethods } from "./paymentMethodScheme";
import { sql } from "drizzle-orm";

export const expenses = sqliteTable("expenses", {
    expense_id: text("expense_id").notNull().primaryKey(),
    date: text("date").notNull(),
    total: real("total").notNull(),
    location: text("location"),
    payment_method_id: text("payment_method_id").notNull().references(() => paymentMethods.payment_method_id),
    notes: text("notes"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});