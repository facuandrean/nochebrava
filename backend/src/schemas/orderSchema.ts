import { object, pipe, string, custom, number, minValue } from "valibot";
import { isUUID } from "../utils/uuid";

export const orderPostSchema = object({
  payment_method_id: pipe(
    string(),
    custom((input) => isUUID(input as string), "Metodo de pago inválido"),
  ),
  total: pipe(
    number(),
    minValue(0, "El total debe ser mayor a 0")
  )
})
