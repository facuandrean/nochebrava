import type { Input } from 'valibot';
import type { InferModel } from "drizzle-orm";
import type { products } from "../database/db/productScheme";
import type { productPostSchema, productUpdateSchema } from "../schemas/productSchema";
import type { uuidSchema } from '../schemas/uuidSchema';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type UUIDInput = Input<typeof uuidSchema>;

export type Product = InferModel<typeof products>;
export type ProductWithoutId = Omit<Product, "product_id">;
export type ProductBodyPost = Input<typeof productPostSchema>;
export type ProductBodyUpdate = Input<typeof productUpdateSchema>;