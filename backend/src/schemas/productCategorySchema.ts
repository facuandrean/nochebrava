import { object, optional, string, pipe, custom } from "valibot";
import { isUUID } from '../utils/uuid';

export const productCategoryPostSchema = object({
  product_id: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Formato de ID de producto inválido')
  ),
  category_id: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Formato de ID de categoría inválido')
  )
});

export const productCategoryUpdateSchema = object({
  product_id: optional(
    pipe(
      string(),
      custom((input) => isUUID(input as string), 'Formato de ID de producto inválido')
    )
  ),
  category_id: optional(
    pipe(
      string(),
      custom((input) => isUUID(input as string), 'Formato de ID de categoría inválido')
    )
  )
})