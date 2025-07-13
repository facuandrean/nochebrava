import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  product_id: text("product_id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  stock: real("stock").notNull().default(0),
  picture: text("picture"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
})