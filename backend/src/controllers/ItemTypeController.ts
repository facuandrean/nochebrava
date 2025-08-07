import type { Request, Response } from "express";
import { AppError } from "../errors";
import { itemTypeService } from "../services/itemTypeService";
import type { ItemType, ItemTypeBody } from "../types/types";

/**
 * Retrieves all item types from the database.
 * 
 * @description This function fetches all item types stored in the database through the item type service.
 * If no item types are found, returns a 404 error with an empty array.
 * On success, returns an array with all found item types.
 * 
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getAllItemTypes = async (_req: Request, res: Response): Promise<void> => {
    try {
        const itemTypes: ItemType[] = await itemTypeService.getAllItemTypes();

        res.status(200).json({
            status: "Operación exitosa",
            message: "Tipos de items obtenidos correctamente.",
            data: itemTypes
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: error.data
            });
            return;
        }

        res.status(500).json({
            status: "Error interno del servidor",
            message: "Ocurrió un error al obtener los tipos de items.",
            data: []
        });
        return;
    }
}

/**
 * Retrieves a specific item type by its ID.
 * 
 * @description This function searches for an item type in the database using its unique ID.
 * If the item type doesn't exist, returns a 404 error.
 * On success, returns the complete data of the found item type.
 * 
 * @param {Request} req - Express request object that must contain item_type_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getItemTypeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const item_type_id = req.params.item_type_id as string;

        const itemType: ItemType | undefined = await itemTypeService.getItemTypeById(item_type_id);

        if (!itemType) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "No se encontró el tipo de item.",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: "Operación exitosa",
            message: "Tipo de item obtenido correctamente.",
            data: itemType
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: error.data
            });
            return;
        }

        res.status(500).json({
            status: "Error interno del servidor",
            message: "Ocurrió un error al obtener el tipo de item.",
            data: []
        });
        return;
    }
};

/**
 * Creates a new item type in the system.
 * 
 * @description This function creates a new item type with the data provided in the request body.
 * Automatically generates a new UUID for the item_type_id.
 * Returns the created item type with all its data, including the generated ID.
 * 
 * @param {Request} req - Express request object that must contain item type data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs (validation, duplicates, etc.)
 * @throws {Error} When an internal server error occurs
 */
const postItemType = async (req: Request, res: Response): Promise<void> => {
    try {
        const itemTypeBody = req.body as ItemTypeBody;

        const itemType: ItemType = await itemTypeService.postItemType(itemTypeBody);

        res.status(201).json({
            status: "Operación exitosa",
            message: "Tipo de item creado correctamente.",
            data: itemType
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: error.data
            });
            return;
        }

        res.status(500).json({
            status: "Error interno del servidor",
            message: "Ocurrió un error al obtener el tipo de item.",
            data: []
        });
        return;
    }
}

/**
 * Updates an existing item type by its ID.
 * 
 * @description This function updates the data of an existing item type.
 * First verifies that the item type exists, then updates the provided fields.
 * Returns the updated item type with all current data.
 * 
 * @param {Request} req - Express request object that must contain item_type_id in parameters and data to update in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the item type is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const updateItemType = async (req: Request, res: Response): Promise<void> => {
    try {
        const item_type_id = req.params.item_type_id as string;
        const itemTypeBody = req.body as ItemTypeBody;

        const existingItemType: ItemType | undefined = await itemTypeService.getItemTypeById(item_type_id);
        if (!existingItemType) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "No se encontró el tipo de item.",
                data: []
            });
            return;
        }

        const itemType: ItemType = await itemTypeService.updateItemType(item_type_id, itemTypeBody);

        res.status(200).json({
            status: "Operación exitosa",
            message: "Tipo de item actualizado correctamente.",
            data: itemType
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: error.data
            });
            return;
        }

        res.status(500).json({
            status: "Error interno del servidor",
            message: "Ocurrió un error al actualizar el tipo de item.",
            data: []
        });
        return;
    }
}

/**
 * Deletes an item type from the system by its ID.
 * 
 * @description This function permanently removes an item type from the database.
 * First verifies that the item type exists before proceeding with deletion.
 * Once deleted, returns a confirmation of the operation.
 * 
 * @param {Request} req - Express request object that must contain item_type_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the item type is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const deleteItemType = async (req: Request, res: Response): Promise<void> => {
    try {
        const item_type_id = req.params.item_type_id as string;

        const existingItemType: ItemType | undefined = await itemTypeService.getItemTypeById(item_type_id);
        if (!existingItemType) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "No se encontró el tipo de item.",
                data: []
            });
            return;
        }

        await itemTypeService.deleteItemType(item_type_id);

        res.status(200).json({
            status: "Operación exitosa",
            message: "Tipo de item eliminado correctamente.",
            data: []
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: error.data
            });
            return;
        }

        res.status(500).json({
            status: "Error interno del servidor",
            message: "Ocurrió un error al eliminar el tipo de item.",
            data: []
        });
        return;
    }
}

export const itemTypeController = {
    getAllItemTypes,
    getItemTypeById,
    postItemType,
    updateItemType,
    deleteItemType
};