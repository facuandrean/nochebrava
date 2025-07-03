import { minLength, object, optional, pipe, string } from "valibot";

export const categoryPostSchema = object({
  name: pipe(
    string(),
    minLength(3, "El nombre de la categoría debe tener al menos 3 caracteres.")
  ),
  description: optional(
    pipe(
      string(),
      minLength(5, "La descripción de la categoría debe tener al menos 3 caracteres.")
    )
  )
});

export const categoryUpdateSchema = object({
  name: optional(
    pipe(
      string(),
      minLength(3, "El nombre de la categoría debe tener al menos 3 caracteres.")
    )
  ),
  description: optional(
    pipe(
      string(),
      minLength(5, "La descripción de la categoría debe tener al menos 3 caracteres.")
    )
  )
})