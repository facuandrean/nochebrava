import { sqliteTable, text, real, integer} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { orders } from "./orderScheme";

export const detailOrders = sqliteTable ("detailOrders", {
  //id de tipo UUID
  order_detail_id: text("order_detail_id").primaryKey().notNull(),
  //id de la orden UUID
  order_id: text("order_id").notNull().references(() => orders.order_id),
  //tipo de item (pack, product)
  item_type: text("item_type").notNull(),
  item_id: text("item_id").notNull(),
  //cantidad vendida de items
  quantity: integer("quantity").notNull(),
  //precio unitario de items
  unit_price: real("unit_price").notNull(),
  //precio total de items
  total_price: real("total_price").notNull(),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
})