import { handleDate } from "../../../utils/date";
import type { Product, ParsedProduct } from "../models";

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