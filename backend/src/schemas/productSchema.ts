import { boolean, minLength, minValue, number, object, optional, pipe, string } from "valibot";

/**
 * Schema to validate the product post request.
 * @property {string} name - The product name.
 * @property {string} description - The product description.
 * @property {number} price - The product price.
 * @property {number} stock - The product stock.
 * @property {string} picture - The product picture.
 * @property {boolean} active - The product active.
 */
export const productPostSchema = object({
  name: pipe(
    string(),
    minLength(3, 'El nombre debe tener al menos 3 caracteres.')
  ),
  description: optional(
    pipe(
      string(),
      minLength(10, 'La descripción debe tener al menos 10 caracteres.')
    )
  ),
  price: pipe(
    number(),
    minValue(0, 'El precio debe ser mayor a 0.')
  ),
  stock: pipe(
    number(),
    minValue(-1, 'El stock debe ser mayor a 0.')
  ),
  picture: optional(string()),
  active: boolean()
});


/**
 * Schema to validate the product update request.
 * @property {string} name - The product name.
 * @property {string} description - The product description.
 * @property {number} price - The product price.
 * @property {number} stock - The product stock.
 * @property {string} picture - The product picture.
 * @property {boolean} active - The product active.
 */
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
      minLength(10, 'La descripción debe tener al menos 10 caracteres.')
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
      minValue(-1, 'El stock debe ser mayor a 0.')
    )
  ),
  picture: optional(string()),
  active: optional(boolean())
});