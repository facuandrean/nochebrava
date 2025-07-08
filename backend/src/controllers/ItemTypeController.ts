import type { Request, Response } from "express";
import { AppError } from "../errors";
import { itemTypeService } from "../services/itemTypeService";
import type { ItemType, ItemTypeBody } from "../types/types";

const getAllItemTypes = async (_req: Request, res: Response): Promise<void> => {
    try {
        const itemTypes: ItemType[] = await itemTypeService.getAllItemTypes();

        if (itemTypes.length === 0) {
            res.status(404).json({
                status: "Operación fallida",
                message: "No se encontró ningún tipo de item.",
                data: []
            });
            return;
        }

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

const getItemTypeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const item_type_id = req.params.item_type_id as string;

        const itemType: ItemType | undefined = await itemTypeService.getItemTypeById(item_type_id);

        if (!itemType) {
            res.status(404).json({
                status: "Operación fallida",
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

const updateItemType = async (req: Request, res: Response): Promise<void> => {
    try {
        const item_type_id = req.params.item_type_id as string;
        const itemTypeBody = req.body as ItemTypeBody;

        const existingItemType: ItemType | undefined = await itemTypeService.getItemTypeById(item_type_id);
        if (!existingItemType) {
            res.status(404).json({
                status: "Operación fallida",
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

const deleteItemType = async (req: Request, res: Response): Promise<void> => {
    try {
        const item_type_id = req.params.item_type_id as string;

        const existingItemType: ItemType | undefined = await itemTypeService.getItemTypeById(item_type_id);
        if (!existingItemType) {
            res.status(404).json({
                status: "Operación fallida",
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