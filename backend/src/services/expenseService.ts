import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { expenses } from "../database/db/expenseScheme";
import { AppError } from "../errors";
import type { Expense, ExpenseBody, ExpenseItem } from "../types/types";
import { v4 as uuid } from "uuid";
import { getCurrentDate } from "../utils/date";
import { expenseItems } from "../database/db/expenseItemScheme";
import { paymentMethodService } from "./paymentMethodService";

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

const getExpenseItems = async (expense_id: string): Promise<ExpenseItem[]> => {
    try {
        const items: ExpenseItem[] = await db.select().from(expenseItems).where(eq(expenseItems.expense_id, expense_id)).all();
        return items;
    } catch (error) {
        throw new AppError("Error al obtener los items del gasto.", 400, []);
    }
}

const postExpense = async (expenseBody: ExpenseBody): Promise<Expense> => {
    try {
        const paymentMethod = await paymentMethodService.getPaymentMethodById(expenseBody.payment_method_id);
        if (!paymentMethod) {
            throw new AppError("Método de pago no encontrado", 404, []);
        }

        const date = getCurrentDate();

        const newExpense = {
            expense_id: uuid(),
            created_at: date,
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
    getExpenseItems,
    postExpense,
    deleteExpense
};