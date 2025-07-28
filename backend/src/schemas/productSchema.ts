import { boolean, check, minLength, minValue, number, object, optional, pipe, string } from "valibot";

export const productPostSchema = object({
  name: pipe(
    string(),
    minLength(3, 'El nombre debe tener al menos 3 caracteres.')
  ),
  description: optional(
    pipe(
      string(),
      check((value) => {
        const trimmed = value.trim();
        return trimmed === "" || trimmed.length >= 10;
      }, "La descripción debe tener al menos 10 caracteres o estar vacía.")
    )
  ),
  price: pipe(
    number(),
    minValue(0, 'El precio debe ser mayor a 0.')
  ),
  stock: pipe(
    number(),
    minValue(0, 'El stock debe ser mayor a 0.')
  ),
  picture: optional(string()),
  active: boolean()
});

export const productUpdateSchema = object({
  name: optional(
    pipe(
      string(),
      minLength(3, 'El nombre debe tener al menos 3 caracteres.')
    )
  ),
  description: optional(
    pipe(
      string(),
      check((value) => {
        const trimmed = value.trim();
        return trimmed === "" || trimmed.length >= 10;
      }, "La descripción debe tener al menos 10 caracteres o estar vacía.")
    )
  ),
  price: optional(
    pipe(
      number(),
      minValue(0, 'El precio debe ser mayor a 0.')
    )
  ),
  stock: optional(
    pipe(
      number(),
      minValue(0, 'El stock debe ser mayor a 0.')
    )
  ),
  picture: optional(string()),
  active: optional(boolean())
});