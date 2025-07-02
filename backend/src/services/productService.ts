import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { products } from "../database/db/productScheme";
import { AppError } from "../errors";
import type { Product, ProductBodyUpdate, ProductWithoutId } from "../types/types";
import { v4 as uuid } from "uuid";


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

const patchProduct = async (id_product: string, dataProduct: ProductBodyUpdate): Promise<Product> => {
  try {
    const updatedProduct = db.update(products).set(dataProduct).where(eq(products.product_id, id_product)).returning().get();
    return updatedProduct;
  } catch (error) {
    throw new AppError('Ocurrió un error al actualizar el producto.', 400, []);
  }
};

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
