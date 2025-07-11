import type { Request, Response } from "express";
import { AppError } from "../errors";
import { expenseItemService } from "../services/expenseItemService";
import type { ExpenseItem } from "../types/types";

const postExpenseItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const dataExpenseItems = req.body as ExpenseItem;
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

const deleteExpenseItem = async () => { };

export const expenseItemController = {
    postExpenseItem,
    deleteExpenseItem
};