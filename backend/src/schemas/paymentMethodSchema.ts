import { minLength, object, pipe, string } from "valibot";

export const paymentMethodPostSchema = object({
  name: pipe(string(), minLength(3, "El nombre debe tener al menos 3 caracteres"))
});