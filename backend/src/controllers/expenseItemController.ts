import type { Request, Response } from "express";
import { AppError } from "../errors";
import { expenseItemService } from "../services/expenseItemService";
import type { ExpenseItemBody } from "../types/types";

/**
 * Creates a new expense item in the system.
 * 
 * @description This function creates a new expense item with the data provided in the request body.
 * The service automatically validates that the expense and product exist, calculates the subtotal,
 * creates the expense item, and updates the product stock accordingly.
 * 
 * @param {Request} req - Express request object that must contain expense item data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the expense is not found
 * @throws {AppError} When the product is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const postExpenseItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const dataExpenseItems = req.body as ExpenseItemBody;
        const newExpenseItem = await expenseItemService.postExpenseItem(dataExpenseItems);
        res.status(201).json({
            status: "Operación exitosa",
            message: "Item del gasto creado correctamente.",
            data: newExpenseItem
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
            message: "Error al crear el item del gasto.",
            data: []
        });
        return;
    }
};

/**
 * Deletes an expense item from the system.
 * 
 * @description This function permanently removes an expense item from the database.
 * The service automatically retrieves the item information, deletes it, and reverts
 * the product stock by subtracting the quantity that was previously added.
 * 
 * @param {Request} req - Express request object that must contain expense_item_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the expense item is not found
 * @throws {AppError} When the product is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const deleteExpenseItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const expense_item_id = req.params.expense_item_id as string;
        await expenseItemService.deleteExpenseItem(expense_item_id);
        res.status(200).json({
            status: "Operación exitosa",
            message: "Item del gasto eliminado correctamente.",
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
            message: "Error al eliminar el item del gasto.",
            data: []
        });
        return;
    }
};

export const expenseItemController = {
    postExpenseItem,
    deleteExpenseItem
};