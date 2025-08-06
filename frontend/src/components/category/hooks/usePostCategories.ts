import { useApi } from "../../../hooks"
import type { CategoryRequest, CategoryResponse } from "../models"
import { parseCategoryDataForBackend } from "../utils/categoryHelpers";

export const usePostCategories = () => {
  const { trigger, loading, error } = useApi<CategoryRequest, CategoryResponse>({
    url: "http://localhost:3000/api/v1/categories",
    method: "POST"
  });

  /**
   * Crea una nueva categoría. Parsea los datos del formulario para enviarlos a la API.
   * @param formData - Datos del formulario sin procesar
   * @returns Promise con la respuesta de la API o undefined si hay un error
   */
  const postCategory = async (formData: CategoryRequest): Promise<CategoryResponse | undefined> => {
    try {
      const parsedCategoryData = parseCategoryDataForBackend(formData);
      const response = await trigger(parsedCategoryData as CategoryRequest);
      return response;
    } catch (error) {
      console.log('Error al crear la categoría', error);
    }
  }

  return { postCategory, loading, error };
}