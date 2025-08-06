import { handleDate } from "../../../utils/date";
import type { Category, CategoryRequest, ParsedCategory } from "../models";

/**
 * Parsean los datos de las categorías para mostrarlos en la tabla.
 * @param categories - Datos de las categorías.
 * @returns - Datos de las categorías parseados.
 */
export const parseCategoryData = (categories: Category[]): ParsedCategory[] => {
  return categories.map((category) => ({
    ...category,
    id: category.category_id,
    created_at: handleDate(category.created_at),
    updated_at: handleDate(category.updated_at)
  }));
}

/**
 * Parsean los datos del formulario de creación de categoría para enviarlos a la API.
 * @param formData - Datos del formulario de creación de categoría.
 * @returns - Datos del formulario de creación de categoría parseados.
 */
export const parseCategoryDataForBackend = (formData: CategoryRequest): Partial<CategoryRequest> => {
  const categoryData: Partial<CategoryRequest> = {};
  if (formData.name) categoryData.name = formData.name;
  if (formData.description && formData.description.trim().length >= 3) {
    categoryData.description = formData.description.trim();
  } else {
    categoryData.description = "";
  }
  return categoryData;
}