import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { expenses } from "./expenseScheme";
import { products } from "./productScheme";

export const expenseItems = sqliteTable("expenseItems", {
    expense_item_id: text("expense_item_id").notNull().primaryKey(),
    expense_id: text("expense_id").notNull().references(() => expenses.expense_id),
    product_id: text("product_id").notNull().references(() => products.product_id),
    quantity: integer("quantity").notNull(),
    unit_price: real("unit_price").notNull(),
    subtotal: real("subtotal").notNull()
})  