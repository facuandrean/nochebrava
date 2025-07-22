import { handleDate } from "../../../utils/date";
import type { Category } from "../models";

export const parseCategoryData = (categories: Category[]): Category[] => {
  return categories.map((category) => ({
    ...category,
    created_at: handleDate(category.created_at),
    updated_at: handleDate(category.updated_at)
  }));
}
