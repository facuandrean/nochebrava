import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Packs table.
 * @property {string} pack_id - The pack id.
 * @property {string} name - The pack name.
 * @property {string} description - The pack description.
 * @property {number} price - The pack price.
 * @property {string} picture - The pack picture.
 * @property {boolean} active - The pack active.
 * @property {string} created_at - The pack created at.
 * @property {string} updated_at - The pack updated at.
 */
export const packs = sqliteTable("packs", {
  pack_id: text("pack_id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  picture: text("picture"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});