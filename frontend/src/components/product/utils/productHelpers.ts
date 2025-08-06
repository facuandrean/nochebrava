import { handleDate } from "../../../utils/date";
import type { Product, ParsedProduct, ProductRequest } from "../models";

/**
 * Parsea los datos del producto para mostrar en la tabla
 * @param products - Datos de los productos
 * @returns - Datos de los productos parseados
 */
export const parseProductData = (products: Product[]): ParsedProduct[] => {
  return products.map((product) => ({
    ...product,
    id: product.product_id,
    active: product.active ? "Si" : "No",
    created_at: handleDate(product.created_at),
    updated_at: handleDate(product.updated_at)
  }));
};

/**
 * Parsea los datos del producto para enviar al backend
 * @param formData - Datos del formulario sin procesar
 * @returns - Datos del formulario parseados
 */
export const parseProductDataForBackend = (formData: ProductRequest): Partial<ProductRequest> => {
  const productData: Partial<ProductRequest> = {};

  if (formData.name) productData.name = formData.name;
  if (formData.description && formData.description.trim().length >= 10) {
    productData.description = formData.description.trim();
  } else {
    productData.description = "";
  }
  if (formData.price) {
    productData.price = Number(formData.price)
  } else {
    productData.price = 0;
  }
  productData.stock = Number(formData.stock);
  productData.active = formData.active;

  return productData;
}