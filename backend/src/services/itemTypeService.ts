import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { itemTypes } from "../database/db/itemTypeScheme";
import { AppError } from "../errors";
import type { ItemType, ItemTypeBody } from "../types/types";
import { v4 as uuid } from "uuid";

/**
 * Retrieves all item types from the database.
 * 
 * @description This function fetches all item types stored in the database using Drizzle ORM.
 * Returns an array of all item types or an empty array if none exist.
 * 
 * @returns {Promise<ItemType[]>} Promise that resolves to an array of ItemType objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getAllItemTypes = async (): Promise<ItemType[]> => {
    try {
        const allItemTypes = await db.select().from(itemTypes);

        return allItemTypes;
    } catch (error) {
        throw new AppError("Error al obtener los tipos de items.", 400, []);
    }
}

/**
 * Retrieves a specific item type by its unique identifier.
 * 
 * @description This function searches for an item type in the database using its item_type_id.
 * Returns the item type if found, or undefined if no item type exists with the given ID.
 * 
 * @param {string} item_type_id - The unique identifier of the item type to retrieve
 * @returns {Promise<ItemType | undefined>} Promise that resolves to an ItemType object or undefined
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getItemTypeById = async (item_type_id: string): Promise<ItemType | undefined> => {
    try {
        const itemType = await db.select().from(itemTypes).where(eq(itemTypes.item_type_id, item_type_id)).get();

        return itemType;
    } catch (error) {
        throw new AppError("Error al obtener el tipo de item.", 400, []);
    }
}

/**
 * Creates a new item type in the database.
 * 
 * @description This function creates a new item type with the provided data.
 * Automatically generates a new UUID for the item_type_id.
 * Returns the complete item type object with the generated ID.
 * 
 * @param {ItemTypeBody} itemTypeBody - The item type data (name)
 * @returns {Promise<ItemType>} Promise that resolves to the created ItemType object
 * 
 * @throws {AppError} When a database error occurs during the insertion
 */
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

/**
 * Updates an existing item type in the database.
 * 
 * @description This function updates an item type's data in the database using its item_type_id.
 * Only updates the fields provided in the itemTypeBody parameter.
 * Returns the updated item type object with all current data.
 * 
 * @param {string} item_type_id - The unique identifier of the item type to update
 * @param {ItemTypeBody} itemTypeBody - The item type data to update (name)
 * @returns {Promise<ItemType>} Promise that resolves to the updated ItemType object
 * 
 * @throws {AppError} When a database error occurs during the update
 */
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

/**
 * Deletes an item type from the database.
 * 
 * @description This function permanently removes an item type from the database using its item_type_id.
 * No return value is provided as the operation is destructive.
 * 
 * @param {string} item_type_id - The unique identifier of the item type to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 * 
 * @throws {AppError} When a database error occurs during the deletion
 */
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