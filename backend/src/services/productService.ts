import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { products } from "../database/db/productScheme";
import { AppError } from "../errors";
import type { Product, ProductBodyUpdate, ProductWithoutId } from "../types/types";
import { v4 as uuid } from "uuid";

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
const getProducts = async (): Promise<Product[]> => {
  try {
    const allProducts: Product[] = await db.select().from(products).all();
    return allProducts;
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
 * @param {ProductWithoutId} dataProduct - The product data without the ID (name, description, price, category_id, timestamps)
 * @returns {Promise<Product>} Promise that resolves to the created Product object
 * 
 * @throws {AppError} When a database error occurs during the insertion
 */
const postProduct = async (dataProduct: ProductWithoutId): Promise<Product> => {
  try {
    const newProduct = {
      product_id: uuid(),
      ...dataProduct
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
    const updatedProduct = db.update(products).set(dataProduct).where(eq(products.product_id, id_product)).returning().get();
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
