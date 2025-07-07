import { object, optional, string, pipe, custom } from "valibot";
import { isUUID } from '../utils/uuid';

/**
 * This schema is used to validate the product categories data when creating a new product category.
 * @property {string} product_id - The ID of the product.
 * @property {string} category_id - The ID of the category.
 */
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

/**
 * This schema is used to validate the product categories data when updating a product category.
 * @property {string} product_id - The ID of the product.
 * @property {string} category_id - The ID of the category.
 */
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