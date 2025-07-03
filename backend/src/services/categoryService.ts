import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { categories } from "../database/db/categoryScheme";
import { AppError } from "../errors";
import type { Category, CategoryWithoutId } from "../types/types";
import { v4 as uuid } from "uuid";

const getCategories = async (): Promise<Category[]> => {
  try {
    const allCategories: Category[] = await db.select().from(categories).all();
    return allCategories;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener las categorías.", 500, []);
  }
}

const getCategoryById = async (category_id: string): Promise<Category | undefined> => {
  try {
    const category: Category | undefined = await db.select().from(categories).where(eq(categories.category_id, category_id)).get();
    return category;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener la categoría.", 500, []);
  }
}

const postCategory = async (dataCategory: CategoryWithoutId): Promise<Category> => {
  try {
    const newCategory: Category = {
      category_id: uuid(),
      ...dataCategory
    };
    const category: Category = await db.insert(categories).values(newCategory).returning().get();
    return category;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear la categoría.", 500, []);
  }
};


const patchCategory = () => { };

const deleteCategory = () => { };

export const categoryService = {
  getCategories,
  getCategoryById,
  postCategory,
  patchCategory,
  deleteCategory
}