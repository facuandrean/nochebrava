import { boolean, minLength, minValue, number, object, optional, pipe, string } from "valibot";

export const packPostSchema = object({
  name: pipe(
    string(),
    minLength(3, "El nombre del pack debe tener al menos 3 caracteres"),
  ),
  description: pipe(
    string(),
    minLength(3, "La descripción del pack debe tener al menos 3 caracteres"),
  ),
  price: pipe(
    number(),
    minValue(0, "El precio del pack debe ser mayor a 0"),
  ),
  picture: optional(
    string()
  ),
  active: boolean()
});


export const packUpdateSchema = object({
  name: optional(
    pipe(
      string(),
      minLength(3, "El nombre del pack debe tener al menos 3 caracteres"),
    )
  ),
  description: optional(
    pipe(
      string(),
      minLength(3, "La descripción del pack debe tener al menos 3 caracteres"),
    )
  ),
  price: optional(
    pipe(
      number(),
      minValue(0, "El precio del pack debe ser mayor a 0"),
    )
  ),
  picture: optional(
    string()
  ),
  active: optional(boolean())
});