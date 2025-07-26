import { handleDate } from "../../../utils/date";
import type { Category, ParsedCategory } from "../models";

export const parseCategoryData = (categories: Category[]): ParsedCategory[] => {
  return categories.map((category) => ({
    ...category,
    id: category.category_id,
    created_at: handleDate(category.created_at),
    updated_at: handleDate(category.updated_at)
  }));
}
