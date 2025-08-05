import type { Request, Response } from "express";
import { expenseService } from "../services/expenseService";
import type { Expense, ExpenseBody, ExpenseItem } from "../types/types";
import { AppError } from "../errors";

/**
 * Retrieves all expenses from the database.
 * 
 * @description This function fetches all expenses stored in the database through the expense service.
 * If no expenses are found, returns a 404 error with an empty array.
 * On success, returns an array with all found expenses.
 * 
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getExpenses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const expenses: Expense[] = await expenseService.getExpenses();
        if (expenses.length === 0) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "No se encontraron gastos.",
                data: []
            });
            return;
        }
        res.status(200).json({
            status: "Operación exitosa",
            message: "Gastos obtenidos correctamente.",
            data: expenses
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: []
            });
            return;
        }
        res.status(500).json({
            status: "Error interno del servidor",
            message: "Error al obtener los gastos.",
            data: []
        });
        return;
    }
}

/**
 * Retrieves a specific expense by its ID.
 * 
 * @description This function searches for an expense in the database using its unique ID.
 * If the expense doesn't exist, returns a 404 error.
 * On success, returns the complete data of the found expense.
 * 
 * @param {Request} req - Express request object that must contain expense_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getExpenseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const expense_id = req.params.expense_id as string;
        const expense: Expense | undefined = await expenseService.getExpenseById(expense_id);
        if (!expense) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "Gasto no encontrado.",
                data: []
            });
            return;
        }
        res.status(200).json({
            status: "Operación exitosa",
            message: "Gasto obtenido correctamente.",
            data: expense
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: []
            });
            return;
        }
        res.status(500).json({
            status: "Error interno del servidor",
            message: "Error al obtener el gasto.",
            data: []
        });
        return;
    }
}

/**
 * Retrieves all expense items for a specific expense.
 * 
 * @description This function fetches all expense items that belong to a specific expense.
 * First validates that the expense exists, then retrieves all associated items.
 * Returns both the expense data and its items in a structured response.
 * If no items are found, returns a 404 error with an empty array.
 * 
 * @param {Request} req - Express request object that must contain expense_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the expense is not found
 * @throws {AppError} When no items are found for the expense
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getExpenseItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const expense_id = req.params.expense_id as string;

        const existsExpense = await expenseService.getExpenseById(expense_id);
        if (!existsExpense) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "Gasto no encontrado.",
                data: []
            });
            return;
        }

        const items: ExpenseItem[] = await expenseService.getExpenseItems(expense_id);
        if (items.length === 0) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "No se encontraron items en el gasto.",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: "Operación exitosa",
            message: "Items del gasto obtenidos correctamente.",
            data: {
                expense: existsExpense,
                items
            }
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
            message: "Error al obtener los items del gasto.",
            data: []
        });
        return;
    }

}

/**
 * Creates a new expense in the database.
 * 
 * @description This function creates a new expense with the data provided in the request body.
 * Automatically assigns creation date and generates a unique ID.
 * Returns the created expense with all its data, including the generated ID.
 * 
 * @param {Request} req - Express request object that must contain expense data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs (validation, duplicates, etc.)
 * @throws {Error} When an internal server error occurs
 */
const postExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const expenseBody = req.body as ExpenseBody;

        const expense: Expense = await expenseService.postExpense(expenseBody);

        res.status(201).json({
            status: "Operación exitosa",
            message: "Gasto creado correctamente.",
            data: expense
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: []
            });
            return;
        }
        res.status(500).json({
            status: "Error interno del servidor",
            message: "Error al crear el gasto.",
            data: []
        });
        return;
    }
}

/**
 * Deletes an expense from the database.
 * 
 * @description This function permanently removes an expense from the database.
 * First verifies that the expense exists before proceeding with deletion.
 * Once deleted, returns a confirmation of the operation.
 * 
 * @param {Request} req - Express request object that must contain expense_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When the expense is not found
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const expense_id = req.params.expense_id as string;
        const expense: Expense | undefined = await expenseService.getExpenseById(expense_id);
        if (!expense) {
            res.status(404).json({
                status: "Operación exitosa.",
                message: "Gasto no encontrado.",
                data: []
            });
            return;
        }

        await expenseService.deleteExpense(expense_id);

        res.status(200).json({
            status: "Operación exitosa",
            message: "Gasto eliminado correctamente.",
            data: []
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                status: "Operación fallida",
                message: error.message,
                data: []
            });
            return;
        }
        res.status(500).json({
            status: "Error interno del servidor",
            message: "Error al eliminar el gasto.",
            data: []
        });
        return;
    }
}

/**
 * Expense controller that handles all CRUD operations for expenses.
 * 
 * @description This object exports all expense controller functions,
 * providing a complete interface for managing expenses in the system.
 * Includes read (GET), create (POST), and delete (DELETE) operations,
 * as well as a specialized endpoint to retrieve expense items.
 * 
 * @type {Object}
 * @property {Function} getExpenses - Retrieves all expenses
 * @property {Function} getExpenseById - Retrieves a specific expense by ID
 * @property {Function} getExpenseItems - Retrieves all items for a specific expense
 * @property {Function} postExpense - Creates a new expense
 * @property {Function} deleteExpense - Deletes an expense
 */
export const expenseController = {
    getExpenses,
    getExpenseById,
    getExpenseItems,
    postExpense,
    deleteExpense
};