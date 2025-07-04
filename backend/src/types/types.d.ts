import type { Input } from 'valibot';
import type { InferModel } from "drizzle-orm";
import type { products } from "../database/db/productScheme";
import type { productPostSchema, productUpdateSchema } from "../schemas/productSchema";
import type { uuidSchema } from '../schemas/uuidSchema';
import type { categories } from '../database/db/categoryScheme';
import type { categoryPostSchema, categoryUpdateSchema } from '../schemas/categorySchema';
import type { productCategories } from '../database/db/productCategoryScheme';
import type { productCategoryPostSchema, productCategoryUpdateSchema } from '../schemas/productCategorySchema';
import type { packs } from '../database/db/packScheme';
import type { packPostSchema, packUpdateSchema } from '../schemas/packSchema';
import type { paymentMethods } from '../database/db/paymentMethodScheme';
import type { paymentMethodPostSchema } from '../schemas/paymentMethodSchema';

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

export type ProductCategory = InferModel<typeof productCategories>;
export type ProductCategoryBodyPost = Input<typeof productCategoryPostSchema>;
export type ProductCategoryBodyUpdate = Input<typeof productCategoryUpdateSchema>;

export type Pack = InferModel<typeof packs>;
export type PackWithoutId = Omit<Pack, "pack_id">;
export type PackBodyPost = Input<typeof packPostSchema>;
export type PackBodyUpdate = Input<typeof packUpdateSchema>;

export type PaymentMethod = InferModel<typeof paymentMethods>;
export type PaymentMethodBodyPost = Input<typeof paymentMethodPostSchema>;