import { useApi } from "../../../hooks"
import type { CategoryRequest, CategoryResponse, ParsedCategory } from "../models";
import { parseCategoryDataForBackend } from "../utils/categoryHelpers";

interface UsePatchCategoriesProps {
  dataEditCategory: ParsedCategory | null;
}

export const usePatchCategories = ({ dataEditCategory }: UsePatchCategoriesProps) => {
  const { trigger, loading, error } = useApi<CategoryRequest, CategoryResponse>({
    id: dataEditCategory?.category_id,
    url: "http://localhost:3000/api/v1/categories",
    method: "PATCH"
  });

  const patchCategory = async (formData: CategoryRequest): Promise<CategoryResponse | undefined> => {
    try {
      const parsedCategoryData = parseCategoryDataForBackend(formData);
      const response = await trigger(parsedCategoryData as CategoryRequest);
      return response;
    } catch (error) {
      console.log('Error al actualizar la categoría', error);
    }
  }

  return { patchCategory, loading, error };
}