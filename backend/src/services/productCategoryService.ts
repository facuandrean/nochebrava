import { db } from "../database/database";
import { AppError } from "../errors"
import { productCategories } from "../database/db/productCategoryScheme";
import { and, eq } from "drizzle-orm";
import type { Category, Product, UUIDInput } from "../types/types";
import { products } from "../database/db/productScheme";
import { categories } from "../database/db/categoryScheme";

/**
 * Retrieves all products by category from the database.
 * 
 * @description This function fetches all products that belong to a specific category
 * using a JOIN between products and productCategories tables.
 * Returns an array of products or an empty array if no products are found.
 * 
 * @param {string} categoryId - The ID of the category to retrieve products from
 * @returns {Promise<Product[]>} Promise that resolves to an array of Product objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getProductsByCategory = async (categoryId: UUIDInput): Promise<Product[]> => {
  try {
    const allProducts: Product[] = await db.select({
      product_id: products.product_id,
      name: products.name,
      description: products.description,
      price: products.price,
      stock: products.stock,
      picture: products.picture,
      active: products.active,
      created_at: products.created_at,
      updated_at: products.updated_at,
      category_id: productCategories.category_id
    })
      .from(products)
      .leftJoin(productCategories, eq(productCategories.product_id, products.product_id))
      .where(eq(productCategories.category_id, categoryId))
      .all();
    return allProducts;
  } catch (error) {
    throw new AppError('Error al obtener los productos de una categoría', 400, []);
  }
}

/**
 * Retrieves all categories for a specific product.
 * 
 * @description This function fetches all categories associated with a given product_id.
 * Returns an array of categories or an empty array if none exist.
 * 
 * @param {string} productId - The ID of the product to retrieve categories from
 * @returns {Promise<Category[]>} Promise that resolves to an array of Category objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getCategoriesByProduct = async (productId: UUIDInput): Promise<Category[]> => {
  try {
    const allCategories: Category[] = await db.select({
      category_id: categories.category_id,
      name: categories.name,
      description: categories.description,
      created_at: categories.created_at,
      updated_at: categories.updated_at,
      product_id: productCategories.product_id
    })
      .from(categories)
      .leftJoin(productCategories, eq(productCategories.category_id, categories.category_id))
      .where(eq(productCategories.product_id, productId))
      .all();
    return allCategories;
  } catch (error) {
    throw new AppError('Error al obtener las categorías de un producto', 400, []);
  }
}

/**
 * Assigns a category to a product in the database.
 * 
 * @description This function creates a new relationship between a product and a category
 * in the productCategories table. This establishes that a product belongs to a specific category.
 * 
 * @param {string} productId - The ID of the product to assign the category to
 * @param {string} categoryId - The ID of the category to assign to the product
 * @returns {Promise<void>} Promise that resolves when the assignment is complete
 * 
 * @throws {AppError} When a database error occurs during the insertion
 */
const assignCategoryToProduct = async (productId: string, categoryId: string): Promise<void> => {
  try {
    await db.insert(productCategories).values({ product_id: productId, category_id: categoryId });
  } catch (error) {
    throw new AppError('Error al asignar la categoría al producto', 400, []);
  }
}

/**
 * Updates the category assignment of a product in the database.
 * 
 * @description This function updates the relationship between products and categories.
 * It first verifies that the old relationship exists, then checks if the new relationship
 * already exists, and finally updates the relationship by deleting the old one and
 * inserting the new one.
 * 
 * @param {string} productIdOld - The ID of the current product
 * @param {string} categoryIdOld - The ID of the current category
 * @param {string} productIdNew - The ID of the new product
 * @param {string} categoryIdNew - The ID of the new category
 * @returns {Promise<void>} Promise that resolves when the update is complete
 * 
 * @throws {AppError} When the old relationship does not exist
 * @throws {AppError} When the new relationship already exists
 * @throws {AppError} When a database error occurs during the update
 */
const updateProductCategory = async (productIdOld: UUIDInput, categoryIdOld: UUIDInput, productIdNew: UUIDInput, categoryIdNew: UUIDInput): Promise<void> => {
  try {
    const oldRelation = await db.select().from(productCategories).where(and(eq(productCategories.product_id, productIdOld), eq(productCategories.category_id, categoryIdOld))).get();
    if (!oldRelation) {
      throw new AppError('Producto no asignado a ninguna categoría', 404, []);
    }

    const newRelation = await db.select().from(productCategories).where(and(eq(productCategories.product_id, productIdNew), eq(productCategories.category_id, categoryIdNew))).get();
    if (newRelation) {
      throw new AppError('Producto ya asignado a esta categoría', 400, []);
    }

    await db.delete(productCategories).where(and(eq(productCategories.product_id, productIdOld), eq(productCategories.category_id, categoryIdOld)));

    await db.insert(productCategories).values({ product_id: productIdNew, category_id: categoryIdNew });

  } catch (error) {
    throw new AppError('Error al actualizar la categoría del producto', 400, []);
  }
}

/**
 * Unassigns a category from a product in the database.
 * 
 * @description This function removes the relationship between a product and a category
 * from the productCategories table. This removes the category assignment from the product.
 * 
 * @param {string} productId - The ID of the product to unassign the category from
 * @param {string} categoryId - The ID of the category to unassign from the product
 * @returns {Promise<void>} Promise that resolves when the unassignment is complete
 * 
 * @throws {AppError} When a database error occurs during the deletion
 */
const unassignCategoryFromProduct = async (productId: UUIDInput, categoryId: UUIDInput): Promise<void> => {
  try {
    await db.delete(productCategories).where(and(eq(productCategories.product_id, productId), eq(productCategories.category_id, categoryId)));
  } catch (error) {
    throw new AppError('Error al desasignar la categoría del producto', 400, []);
  }
}

export const productCategoryService = {
  getProductsByCategory,
  getCategoriesByProduct,
  assignCategoryToProduct,
  updateProductCategory,
  unassignCategoryFromProduct
}