import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { itemTypes } from "../database/db/itemTypeScheme";
import { AppError } from "../errors";
import type { ItemType, ItemTypeBody } from "../types/types";
import { v4 as uuid } from "uuid";

const getAllItemTypes = async (): Promise<ItemType[]> => {
    try {
        const allItemTypes = await db.select().from(itemTypes);

        return allItemTypes;
    } catch (error) {
        throw new AppError("Error al obtener los tipos de items.", 400, []);
    }
}

const getItemTypeById = async (item_type_id: string): Promise<ItemType | undefined> => {
    try {
        const itemType = await db.select().from(itemTypes).where(eq(itemTypes.item_type_id, item_type_id)).get();

        return itemType;
    } catch (error) {
        throw new AppError("Error al obtener el tipo de item.", 400, []);
    }
}

const postItemType = async (itemTypeBody: ItemTypeBody): Promise<ItemType> => {
    try {
        const newItemType = {
            item_type_id: uuid(),
            name: itemTypeBody.name
        }
        const itemType = await db.insert(itemTypes).values(newItemType).returning().get();
        return itemType;
    } catch (error) {
        throw new AppError("Error al crear el tipo de item.", 400, []);
    }
}

const updateItemType = async (item_type_id: string, itemTypeBody: ItemTypeBody): Promise<ItemType> => {
    try {
        const updatedItemType = {
            name: itemTypeBody.name
        }
        const itemType = await db.update(itemTypes).set(updatedItemType).where(eq(itemTypes.item_type_id, item_type_id)).returning().get();
        return itemType;
    } catch (error) {
        throw new AppError("Error al actualizar el tipo de item.", 400, []);
    }
};

const deleteItemType = async (item_type_id: string): Promise<void> => {
    try {
        await db.delete(itemTypes).where(eq(itemTypes.item_type_id, item_type_id));
    } catch (error) {
        throw new AppError("Error al eliminar el tipo de item.", 400, []);
    }
}

export const itemTypeService = {
    getAllItemTypes,
    getItemTypeById,
    postItemType,
    updateItemType,
    deleteItemType
}