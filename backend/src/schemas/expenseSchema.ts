import { custom, minValue, number, object, pipe, string } from "valibot";
import { isUUID } from "../utils/uuid";

export const expenseBodyScheme = object({
  date: string(),
  total: pipe(
    number(),
    minValue(0, "El total debe ser mayor a 0")  
  ),
  location: string(),
  payment_method_id: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Formato de ID de método de pago inválido')
  ),
  notes: string()
});

