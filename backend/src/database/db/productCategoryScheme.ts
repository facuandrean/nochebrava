import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { products } from "./productScheme";
import { categories } from "./categoryScheme";

export const productCategories = sqliteTable('ProductCategories', {
  product_id: text('product_id').notNull().references(() => products.product_id),
  category_id: text('category_id').notNull().references(() => categories.category_id)
}, (table) => ({
  product_category_pk: primaryKey({ name: 'product_category_pk', columns: [table.product_id, table.category_id] })
}));