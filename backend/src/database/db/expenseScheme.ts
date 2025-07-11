import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { paymentMethods } from "./paymentMethodScheme";
import { sql } from "drizzle-orm";

/**
 * Expenses table schema definition.
 * 
 * @description This table stores all expense records in the system.
 * Each expense represents a purchase of materials or supplies for the business.
 * Expenses are linked to payment methods and can contain multiple expense items.
 * 
 * @type {Object}
 * @property {string} expense_id - Unique identifier for the expense (primary key)
 * @property {string} date - Date when the expense occurred (YYYY-MM-DD format)
 * @property {number} total - Total amount of the expense in currency units
 * @property {string} location - Location where the expense occurred (optional)
 * @property {string} payment_method_id - Reference to the payment method used (foreign key)
 * @property {string} notes - Additional notes or description for the expense (optional)
 * @property {string} created_at - Timestamp when the expense record was created
 */
export const expenses = sqliteTable("expenses", {
    expense_id: text("expense_id").notNull().primaryKey(),
    date: text("date").notNull(),
    total: real("total").notNull(),
    location: text("location"),
    payment_method_id: text("payment_method_id").notNull().references(() => paymentMethods.payment_method_id),
    notes: text("notes"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});