import { handleDate } from "../../../utils/date";
import type { Product, ParsedProduct, ProductRequest } from "../models";

/**
 * Parsea los datos del producto para mostrar en la tabla
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

/**
 * Valida si el producto tiene stock disponible
 */
export const hasStock = (product: Product): boolean => {
  return product.stock > 0;
};

/**
 * Filtra productos activos
 */
export const getActiveProducts = (products: Product[]): Product[] => {
  return products.filter(product => product.active);
}; 