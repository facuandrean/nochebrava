import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Products table.
 * @property {string} product_id - The product id.
 * @property {string} name - The product name.
 * @property {string} description - The product description.
 * @property {number} price - The product price.
 * @property {number} stock - The product stock.
 * @property {string} picture - The product picture.
 * @property {boolean} active - The product active.
 * @property {string} created_at - The product created at.
 * @property {string} updated_at - The product updated at.
 */
export const products = sqliteTable("products", {
  product_id: text("product_id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  picture: text("picture"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
})