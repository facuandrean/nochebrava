import type { Request, Response } from "express";
import { expenseService } from "../services/expenseService";
import type { Expense, ExpenseBody } from "../types/types";
import { AppError } from "../errors";

const getExpenses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const expenses: Expense[] = await expenseService.getExpenses();
        if (expenses.length === 0) {
            res.status(404).json({
                status: "Operación fallida",
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

const getExpenseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const expense_id = req.params.expense_id as string;
        const expense: Expense | undefined = await expenseService.getExpenseById(expense_id);
        if (!expense) {
            res.status(404).json({
                status: "Operación fallida",
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

const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const expense_id = req.params.expense_id as string;
        const expense: Expense | undefined = await expenseService.getExpenseById(expense_id);
        if (!expense) {
            res.status(404).json({
                status: "Operación fallida",
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

export const expenseController = { 
    getExpenses, 
    getExpenseById,
    postExpense,
    deleteExpense
};