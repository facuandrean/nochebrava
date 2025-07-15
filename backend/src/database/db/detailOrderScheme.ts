import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { orders } from "./orderScheme";
import { itemTypes } from "./itemTypeScheme";

export const detailOrders = sqliteTable("detailOrders", {
  order_detail_id: text("order_detail_id").primaryKey().notNull(),
  order_id: text("order_id").notNull().references(() => orders.order_id),
  item_type: text("item_type").notNull().references(() => itemTypes.item_type_id),
  item_id: text("item_id").notNull(), // Referencia polimórfica a productos o packs
  quantity: integer("quantity").notNull(),
  unit_price: real("unit_price").notNull(),
  total_price: real("total_price").notNull(),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
})