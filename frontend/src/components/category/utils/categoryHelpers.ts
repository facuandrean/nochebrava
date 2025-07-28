import { handleDate } from "../../../utils/date";
import type { Category, CategoryRequest, ParsedCategory } from "../models";

export const parseCategoryData = (categories: Category[]): ParsedCategory[] => {
  return categories.map((category) => ({
    ...category,
    id: category.category_id,
    created_at: handleDate(category.created_at),
    updated_at: handleDate(category.updated_at)
  }));
}


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