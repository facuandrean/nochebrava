import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { products } from "../database/db/productScheme";
import { AppError } from "../errors";
import type { Product } from "../types/type";


const getProducts = async (): Promise<Product[]> => {
  try {
    const allProducts: Product[] = await db.select().from(products).all();
    return allProducts;
  } catch (error) {
    throw new AppError('Ocurrió un error al obtener los productos.', 400, []);
  }
};

const getProductById = async (id_product: string): Promise<Product | undefined> => {
  try {
    const product: Product | undefined = await db.select().from(products).where(eq(products.product_id, id_product)).get();

    return product;
  } catch (error) {
    throw new AppError('Ocurrió un error al obtener el producto de id: ' + id_product, 400, []);
  }
};

const postProduct = async () => {

};

const patchProduct = async () => {

};

const deleteProduct = async () => {

};

export const productService = {
  getProducts,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};
