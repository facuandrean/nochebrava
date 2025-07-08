import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const itemTypes = sqliteTable("itemTypes", {
    item_type_id: text("item_type_id").notNull().primaryKey(),
    name: text("name").notNull()
})
