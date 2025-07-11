import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { expenses } from "../database/db/expenseScheme";
import { AppError } from "../errors";
import type { Expense, ExpenseBody, ExpenseItem } from "../types/types";
import { v4 as uuid } from "uuid";
import { getCurrentDate } from "../utils/date";
import { expenseItems } from "../database/db/expenseItemScheme";
import { paymentMethodService } from "./paymentMethodService";

/**
 * Retrieves all expenses from the database.
 * 
 * @description This function fetches all expenses stored in the database using Drizzle ORM.
 * Returns an array of all expenses or an empty array if none exist.
 * 
 * @returns {Promise<Expense[]>} Promise that resolves to an array of Expense objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getExpenses = async (): Promise<Expense[]> => {
    try {
        const allExpenses: Expense[] = await db.select().from(expenses).all();
        return allExpenses;
    } catch (error) {
        throw new AppError("Error al obtener los gastos.", 400, []);
    }
}

/**
 * Retrieves a specific expense by its unique identifier.
 * 
 * @description This function searches for an expense in the database using its expense_id.
 * Returns the expense if found, or undefined if no expense exists with the given ID.
 * 
 * @param {string} expense_id - The unique identifier of the expense to retrieve
 * @returns {Promise<Expense | undefined>} Promise that resolves to an Expense object or undefined
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getExpenseById = async (expense_id: string): Promise<Expense | undefined> => {
    try {
        const expense: Expense | undefined = await db.select().from(expenses).where(eq(expenses.expense_id, expense_id)).get();
        return expense;
    } catch (error) {
        throw new AppError("Error al obtener el gasto.", 400, []);
    }
}

/**
 * Retrieves all expense items for a specific expense.
 * 
 * @description This function fetches all expense items that belong to a specific expense
 * using the expense_id as a foreign key reference.
 * Returns an array of expense items or an empty array if none exist.
 * 
 * @param {string} expense_id - The unique identifier of the expense to retrieve items for
 * @returns {Promise<ExpenseItem[]>} Promise that resolves to an array of ExpenseItem objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getExpenseItems = async (expense_id: string): Promise<ExpenseItem[]> => {
    try {
        const items: ExpenseItem[] = await db.select().from(expenseItems).where(eq(expenseItems.expense_id, expense_id)).all();
        return items;
    } catch (error) {
        throw new AppError("Error al obtener los items del gasto.", 400, []);
    }
}

/**
 * Creates a new expense in the database.
 * 
 * @description This function creates a new expense with the provided data.
 * First validates that the payment method exists, then generates a new UUID for the expense_id
 * and assigns the current date as creation timestamp.
 * Returns the complete expense object with the generated ID.
 * 
 * @param {ExpenseBody} expenseBody - The expense data (date, total, location, payment_method_id, notes)
 * @returns {Promise<Expense>} Promise that resolves to the created Expense object
 * 
 * @throws {AppError} When the payment method is not found
 * @throws {AppError} When a database error occurs during the insertion
 */
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

/**
 * Deletes an expense from the database.
 * 
 * @description This function permanently removes an expense from the database using its expense_id.
 * No return value is provided as the operation is destructive.
 * 
 * @param {string} expense_id - The unique identifier of the expense to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 * 
 * @throws {AppError} When a database error occurs during the deletion
 */
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