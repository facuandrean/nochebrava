import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { expenses } from "../database/db/expenseScheme";
import { AppError } from "../errors";
import type { Expense, ExpenseBody } from "../types/types";
import { v4 as uuid } from "uuid";
import { getCurrentDate } from "../utils/date";

const getExpenses = async (): Promise<Expense[]> => {
    try {
        const allExpenses: Expense[] = await db.select().from(expenses).all();
        return allExpenses;
    } catch (error) {
        throw new AppError("Error al obtener los gastos.", 400, []);
    }
}

const getExpenseById = async (expense_id: string): Promise<Expense | undefined> => {
    try {
        const expense: Expense | undefined = await db.select().from(expenses).where(eq(expenses.expense_id, expense_id)).get();
        return expense;
    } catch (error) {
        throw new AppError("Error al obtener el gasto.", 400, []);
    }
}

const postExpense = async (expenseBody: ExpenseBody): Promise<Expense> => {
    try {

        const newExpense = {
            expense_id: uuid(),
            created_at: getCurrentDate(),
            ...expenseBody
        };

        const expense = await db.insert(expenses).values(newExpense).returning().get();
        return expense;

    } catch (error) {
        throw new AppError("Error al crear el gasto.", 400, []);
    }
}

const deleteExpense = async (expense_id: string): Promise<void> => {
    try {
        await db.delete(expenses).where(eq(expenses.expense_id, expense_id));
    } catch (error) {
        throw new AppError("Error al eliminar el gasto.", 400, []);
    }
}

export const expenseService = { 
    getExpenses, 
    getExpenseById,
    postExpense,
    deleteExpense
};