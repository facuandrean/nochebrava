import { custom, number, object, pipe, string, minValue } from "valibot";
import { isUUID } from "../utils/uuid";

export const expenseItemsScheme = object({
    expense_id: pipe(
        string(),
        custom((input) => isUUID(input as string), "ID de gasto inválido")
    ),
    product_id: pipe(
        string(),
        custom((input) => isUUID(input as string), "ID de producto inválido")
    ),
    quantity: pipe(
        number(),
        minValue(1, "La cantidad debe ser al menos 1")
    ),
    unit_price: pipe(
        number(),
        minValue(0, "El precio unitario debe ser mayor a 0")
    ),
    subtotal: pipe(
        number(),
        minValue(0, "El subtotal debe ser mayor a 0")
    )
});