import { useApi } from "../../../hooks"
import type { CategoryRequest, CategoryResponse, ParsedCategory } from "../models"

interface UseDeleteCategoriesProps {
  dataDeleteCategory: ParsedCategory | null;
}

export const useDeleteCategories = ({ dataDeleteCategory }: UseDeleteCategoriesProps) => {
  const { trigger, loading, error } = useApi<CategoryRequest, CategoryResponse>({
    id: dataDeleteCategory?.category_id,
    url: "http://localhost:3000/api/v1/categories",
    method: "DELETE"
  });

  const deleteCategory = async (): Promise<CategoryResponse | undefined> => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.log('Error al eliminar la categoría', error);
    }
  }

  return { deleteCategory, loading, error };
}