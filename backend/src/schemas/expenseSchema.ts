import { custom, minValue, number, object, pipe, string, minLength, maxLength, trim } from "valibot";
import { isUUID } from "../utils/uuid";
import { isValidDate } from "../utils/date";

export const expenseBodyScheme = object({
  date: pipe(
    string(),
    minLength(10, "Fecha inválida"),
    maxLength(10, "Fecha inválida"),
    custom((input) => isValidDate(input as string), "Fecha inválida")
  ),
  total: pipe(
    number(),
    minValue(0, "El total debe ser mayor a 0")  
  ),
  location: pipe(
    string(),
    minLength(1, "La ubicación no puede estar vacía"),
    maxLength(255, "La ubicación es demasiado larga"),
    trim()
  ),
  payment_method_id: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Formato de ID de método de pago inválido')
  ),
  notes: pipe(
    string(),
    maxLength(1000, "Las notas son demasiado largas"),
    trim()
  )
});

