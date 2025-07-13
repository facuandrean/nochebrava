import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { expenseItems } from "../database/db/expenseItemScheme";
import { AppError } from "../errors";
import type { ExpenseItem, ExpenseItemBody } from "../types/types";
import { expenseService } from "./expenseService";
import { productService } from "./productService";
import { v4 as uuid } from "uuid";

/**
 * Creates a new expense item in the database.
 * 
 * @description This function creates a new expense item with the provided data.
 * First validates that both the expense and product exist, then calculates the subtotal
 * automatically and creates the expense item. Finally updates the product stock
 * by adding the purchased quantity to the current stock.
 * 
 * @param {ExpenseItemBody} expenseItemBody - The expense item data (expense_id, product_id, quantity, unit_price)
 * @returns {Promise<ExpenseItem>} Promise that resolves to the created ExpenseItem object
 * 
 * @throws {AppError} When the expense is not found
 * @throws {AppError} When the product is not found
 * @throws {AppError} When a database error occurs during the insertion
 */
const postExpenseItem = async (dataExpenseItem: ExpenseItemBody): Promise<ExpenseItem> => {
    try {
        // Verify expense exists
        const expense = await expenseService.getExpenseById(dataExpenseItem.expense_id);
        if (!expense) {
            throw new AppError("Gasto no encontrado", 404, []);
        }

        // Verify product exists
        const product = await productService.getProductById(dataExpenseItem.product_id);
        if (!product) {
            throw new AppError("Producto no encontrado", 404, []);
        }

        const newExpenseItem = {
            expense_item_id: uuid(),
            ...dataExpenseItem,
            subtotal: dataExpenseItem.quantity * dataExpenseItem.unit_price
        };

        const expenseItem: ExpenseItem = await db.insert(expenseItems).values(newExpenseItem).returning().get();

        // Update product stock
        const newStock = product.stock + dataExpenseItem.quantity;
        await productService.patchProduct(dataExpenseItem.product_id, { stock: newStock });

        return expenseItem;
    } catch (error) {
        throw new AppError("Error al crear el item del gasto", 400, []);
    }
};

/**
 * Deletes an expense item from the database.
 * 
 * @description This function permanently removes an expense item from the database.
 * First verifies that the expense item exists, then removes it and updates the product stock.
 * 
 * @param {string} expense_item_id - The unique identifier of the expense item to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 * 
 * @throws {AppError} When the expense item is not found
 * @throws {AppError} When the product is not found
 * @throws {AppError} When a database error occurs during the deletion
 */
const deleteExpenseItem = async (expense_item_id: string): Promise<void> => {
    try {
        // Get the expense item to know the product and quantity
        const expenseItem = await db.select().from(expenseItems).where(eq(expenseItems.expense_item_id, expense_item_id)).get();
        if (!expenseItem) {
            throw new AppError("Item del gasto no encontrado", 404, []);
        }

        // Verify product exists
        const product = await productService.getProductById(expenseItem.product_id);
        if (!product) {
            throw new AppError("Producto no encontrado", 404, []);
        }

        // Delete the expense item
        await db.delete(expenseItems).where(eq(expenseItems.expense_item_id, expense_item_id));

        // Update product stock (subtract the quantity that was added)
        const newStock = product.stock - expenseItem.quantity;
        await productService.patchProduct(expenseItem.product_id, { stock: newStock });

        return;
    } catch (error) {
        throw new AppError("Error al eliminar el item del gasto", 400, []);
    }
};

export const expenseItemService = {
    postExpenseItem,
    deleteExpenseItem
};
