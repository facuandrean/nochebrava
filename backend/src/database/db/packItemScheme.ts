import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { packs } from "./packScheme";
import { products } from "./productScheme";
import { sql } from "drizzle-orm";

export const packItems = sqliteTable("packitems", {
  pack_item_id: text("pack_item_id").primaryKey().notNull(),
  pack_id: text("pack_id").references(() => packs.pack_id, { onDelete: "cascade" }).notNull(),
  product_id: text("product_id").references(() => products.product_id).notNull(),
  quantity: integer("quantity").notNull(),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});