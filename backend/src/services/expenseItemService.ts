import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { expenseItems } from "../database/db/expenseItemScheme";
import { AppError } from "../errors";
import type { ExpenseItem, ExpenseItemBody } from "../types/types";
import { v4 as uuid } from "uuid";
import { expenseService } from "./expenseService";
import { productService } from "./productService";

const postExpenseItem = async (expenseItemBody: ExpenseItemBody): Promise<ExpenseItem> => {
    try {
        const expense = await expenseService.getExpenseById(expenseItemBody.expense_id);
        if (!expense) {
            throw new AppError("Gasto no encontrado", 404, []);
        }

        const product = await productService.getProductById(expenseItemBody.product_id);
        if (!product) {
            throw new AppError("Producto no encontrado", 404, []);
        }

        const subtotal = expenseItemBody.quantity * expenseItemBody.unit_price;

        const newExpenseItem = {
            expense_item_id: uuid(),
            expense_id: expenseItemBody.expense_id,
            product_id: expenseItemBody.product_id,
            quantity: expenseItemBody.quantity,
            unit_price: expenseItemBody.unit_price,
            subtotal: subtotal
        };

        const expenseItem = await db.insert(expenseItems)
            .values(newExpenseItem)
            .returning()
            .get();

        const newStock = product.stock + expenseItemBody.quantity;
        await productService.patchProduct(product.product_id, { stock: newStock });

        return expenseItem;

    } catch (error) {
        throw new AppError("Error al crear el item del gasto", 400, []);
    }
};

const deleteExpenseItem = async (expense_item_id: string): Promise<void> => {
    try {
        const expenseItem = await db.select()
            .from(expenseItems)
            .where(eq(expenseItems.expense_item_id, expense_item_id))
            .get();

        if (!expenseItem) {
            throw new AppError("Item del gasto no encontrado", 404, []);
        }

        const product = await productService.getProductById(expenseItem.product_id);
        if (!product) {
            throw new AppError("Producto no encontrado", 404, []);
        }

        await db.delete(expenseItems)
            .where(eq(expenseItems.expense_item_id, expense_item_id));

        const newStock = product.stock - expenseItem.quantity;
        await productService.patchProduct(product.product_id, { stock: newStock });

    } catch (error) {
        throw new AppError("Error al eliminar el item del gasto", 400, []);
    }
};

export const expenseItemService = {
    postExpenseItem,
    deleteExpenseItem
};
