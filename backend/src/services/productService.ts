import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { products } from "../database/db/productScheme";
import { AppError } from "../errors";
import type { Category, Product, ProductBodyPost, ProductBodyUpdate } from "../types/types";
import { getCurrentDate } from "../utils/date";
import { v4 as uuid } from "uuid";
import { productCategories } from "../database/db/productCategoryScheme";
import { categories } from "../database/db/categoryScheme";

/**
 * Retrieves all products from the database.
 * 
 * @description This function fetches all products stored in the database using Drizzle ORM.
 * Returns an array of all products or an empty array if none exist.
 * 
 * @returns {Promise<Product[]>} Promise that resolves to an array of Product objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getProducts = async (): Promise<(Product & { categories: Category[] })[]> => {
  try {
    const allProducts = await db.select({
      // Campos del producto
      product_id: products.product_id,
      name: products.name,
      description: products.description,
      price: products.price,
      stock: products.stock,
      picture: products.picture,
      active: products.active,
      created_at: products.created_at,
      updated_at: products.updated_at,
      // Campos de la categoría
      category_id: categories.category_id,
      category_name: categories.name,
      category_description: categories.description,
      category_created_at: categories.created_at,
      category_updated_at: categories.updated_at
    }).from(products)
      .leftJoin(productCategories, eq(products.product_id, productCategories.product_id))
      .leftJoin(categories, eq(productCategories.category_id, categories.category_id))
      .all();

    const productsMap = new Map<string, Product & { categories: Category[] }>();

    for (const row of allProducts) {
      const productId = row.product_id;

      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          product_id: row.product_id,
          name: row.name,
          description: row.description,
          price: row.price,
          stock: row.stock,
          picture: row.picture,
          active: row.active,
          created_at: row.created_at,
          updated_at: row.updated_at,
          categories: []
        })
      }

      if (row.category_id) {
        const product = productsMap.get(productId)!;
        product.categories.push({
          category_id: row.category_id,
          name: row.category_name || '',
          description: row.category_description || '',
          created_at: row.category_created_at || '',
          updated_at: row.category_updated_at || ''
        })
      }
    }

    return Array.from(productsMap.values());
  } catch (error) {
    throw new AppError('Ocurrió un error al obtener los productos.', 400, []);
  }
};

/**
 * Retrieves a specific product by its unique identifier.
 * 
 * @description This function searches for a product in the database using its product_id.
 * Returns the product if found, or undefined if no product exists with the given ID.
 * 
 * @param {string} id_product - The unique identifier of the product to retrieve
 * @returns {Promise<Product | undefined>} Promise that resolves to a Product object or undefined
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getProductById = async (id_product: string): Promise<Product | undefined> => {
  try {
    const product: Product | undefined = await db.select().from(products).where(eq(products.product_id, id_product)).get();

    return product;
  } catch (error) {
    throw new AppError('Ocurrió un error al obtener el producto de id: ' + id_product, 400, []);
  }
};

/**
 * Creates a new product in the database.
 * 
 * @description This function creates a new product with the provided data.
 * Automatically generates a new UUID for the product_id and inserts the record into the database.
 * Returns the complete product object with the generated ID.
 * 
 * @param {ProductBodyPost} dataProduct - The product data without the ID (name, description, price, category_id, timestamps)
 * @returns {Promise<Product>} Promise that resolves to the created Product object
 * 
 * @throws {AppError} When a database error occurs during the insertion
 */
const postProduct = async (dataProduct: ProductBodyPost): Promise<Product> => {
  try {
    const date = getCurrentDate();
    const newProduct = {
      product_id: uuid(),
      ...dataProduct,
      created_at: date,
      updated_at: date
    };

    const product: Product = await db.insert(products).values(newProduct).returning().get();
    return product;
  } catch (error) {
    throw new AppError('Ocurrió un error al crear el producto.', 400, []);
  }
};

/**
 * Updates an existing product in the database.
 * 
 * @description This function updates a product's data in the database using its product_id.
 * Only updates the fields provided in the dataProduct parameter.
 * Returns the updated product object with all current data.
 * 
 * @param {string} id_product - The unique identifier of the product to update
 * @param {ProductBodyUpdate} dataProduct - The product data to update (partial product object)
 * @returns {Promise<Product>} Promise that resolves to the updated Product object
 * 
 * @throws {AppError} When a database error occurs during the update
 */
const patchProduct = async (id_product: string, dataProduct: ProductBodyUpdate): Promise<Product> => {
  try {
    const date = getCurrentDate();
    const updatedProduct = await db.update(products)
      .set({ ...dataProduct, updated_at: date })
      .where(eq(products.product_id, id_product))
      .returning()
      .get();
    return updatedProduct;
  } catch (error) {
    throw new AppError('Ocurrió un error al actualizar el producto.', 400, []);
  }
};

/**
 * Deletes a product from the database.
 * 
 * @description This function permanently removes a product from the database using its product_id.
 * No return value is provided as the operation is destructive.
 * 
 * @param {string} id_product - The unique identifier of the product to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 * 
 * @throws {AppError} When a database error occurs during the deletion
 */
const deleteProduct = async (id_product: string): Promise<void> => {
  try {
    await db.delete(products).where(eq(products.product_id, id_product));
    return;
  } catch (error) {
    throw new AppError('Ocurrió un error al eliminar el producto.', 400, []);
  }
};

export const productService = {
  getProducts,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};
