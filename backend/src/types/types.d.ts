import type { Input } from 'valibot';
import type { InferModel } from "drizzle-orm";
import type { products } from "../database/db/productScheme";
import type { productPostSchema, productUpdateSchema } from "../schemas/productSchema";
import type { uuidSchema } from '../schemas/uuidSchema';
import type { categories } from '../database/db/categoryScheme';
import type { categoryPostSchema, categoryUpdateSchema } from '../schemas/categorySchema';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type UUIDInput = Input<typeof uuidSchema>;

export type Product = InferModel<typeof products>;
export type ProductWithoutId = Omit<Product, "product_id">;
export type ProductBodyPost = Input<typeof productPostSchema>;
export type ProductBodyUpdate = Input<typeof productUpdateSchema>;

export type Category = InferModel<typeof categories>;
export type CategoryWithoutId = Omit<Category, "category_id">;
export type CategoryBodyPost = Input<typeof categoryPostSchema>;
export type CategoryBodyUpdate = Input<typeof categoryUpdateSchema>;