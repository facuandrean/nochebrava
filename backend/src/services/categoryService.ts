import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { categories } from "../database/db/categoryScheme";
import { AppError } from "../errors";
import type { Category, CategoryWithoutId, UUIDInput } from "../types/types";
import { v4 as uuid } from "uuid";

/**
 * Retrieves all categories from the database.
 * 
 * @description This function fetches all categories stored in the database using Drizzle ORM.
 * Returns an array of all categories or an empty array if none exist.
 * 
 * @returns {Promise<Category[]>} Promise that resolves to an array of Category objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getCategories = async (): Promise<Category[]> => {
  try {
    const allCategories: Category[] = await db.select().from(categories).all();
    return allCategories;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener las categorías.", 500, []);
  }
}

/**
 * Retrieves a specific category by its unique identifier.
 * 
 * @description This function searches for a category in the database using its category_id.
 * Returns the category if found, or undefined if no category exists with the given ID.
 * 
 * @param {string} category_id - The unique identifier of the category to retrieve
 * @returns {Promise<Category | undefined>} Promise that resolves to a Category object or undefined
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getCategoryById = async (category_id: string | UUIDInput): Promise<Category | undefined> => {
  try {
    const category: Category | undefined = await db.select().from(categories).where(eq(categories.category_id, category_id)).get();
    return category;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener la categoría.", 500, []);
  }
}

/**
 * Creates a new category in the database.
 * 
 * @description This function creates a new category with the provided data.
 * Automatically generates a new UUID for the category_id and inserts the record into the database.
 * Returns the complete category object with the generated ID.
 * 
 * @param {CategoryWithoutId} dataCategory - The category data without the ID (name, description, timestamps)
 * @returns {Promise<Category>} Promise that resolves to the created Category object
 * 
 * @throws {AppError} When a database error occurs during the insertion
 */
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

/**
 * Updates an existing category in the database.
 * 
 * @description This function updates a category's data in the database.
 * Uses the category_id from the provided data to identify which category to update.
 * Returns the updated category object with all current data.
 * 
 * @param {Category} dataCategory - The complete category object with updated data
 * @returns {Promise<Category>} Promise that resolves to the updated Category object
 * 
 * @throws {AppError} When a database error occurs during the update
 */
const patchCategory = async (dataCategory: Category) => {
  try {
    const category: Category = await db.update(categories).set(dataCategory).where(eq(categories.category_id, dataCategory.category_id)).returning().get();
    return category;
  } catch (error) {
    throw new AppError("Ocurrió un error al actualizar la categoría.", 500, []);
  }
};

/**
 * Deletes a category from the database.
 * 
 * @description This function permanently removes a category from the database using its category_id.
 * No return value is provided as the operation is destructive.
 * 
 * @param {string} category_id - The unique identifier of the category to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 * 
 * @throws {AppError} When a database error occurs during the deletion
 */
const deleteCategory = async (category_id: string): Promise<void> => {
  try {
    await db.delete(categories).where(eq(categories.category_id, category_id));
    return;
  } catch (error) {
    throw new AppError("Ocurrió un error al eliminar la categoría.", 500, []);
  }
};

export const categoryService = {
  getCategories,
  getCategoryById,
  postCategory,
  patchCategory,
  deleteCategory
}