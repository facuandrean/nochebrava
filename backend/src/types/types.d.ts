import type { Input } from 'valibot';
import type { InferModel } from "drizzle-orm";
import type { products } from "../database/db/productScheme";
import type { orders } from "../database/db/orderScheme";
import type { uuidSchema } from '../schemas/uuidSchema';
import type { categories } from '../database/db/categoryScheme';
//imports schemas
import type { productPostSchema, productUpdateSchema } from "../schemas/productSchema";
import type { categoryPostSchema, categoryUpdateSchema } from '../schemas/categorySchema';
import type { productCategories } from '../database/db/productCategoryScheme';
import type { productCategoryPostSchema, productCategoryUpdateSchema } from '../schemas/productCategorySchema';
import type { orderPostSchema, orderUpdateSchema } from '../schemas/orderSchema';
import type { detailOrderPostSchema, detailOrderUpdateSchema } from '../schemas/detailOrderSchema';
import type { detailOrders } from '../database/db/detailOrderScheme';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type UUIDInput = Input<typeof uuidSchema>;

//PRODUCTS
export type Product = InferModel<typeof products>;
export type ProductWithoutId = Omit<Product, "product_id">;
export type ProductBodyPost = Input<typeof productPostSchema>;
export type ProductBodyUpdate = Input<typeof productUpdateSchema>;

//CATEGORIES
export type Category = InferModel<typeof categories>;
export type CategoryWithoutId = Omit<Category, "category_id">;
export type CategoryBodyPost = Input<typeof categoryPostSchema>;
export type CategoryBodyUpdate = Input<typeof categoryUpdateSchema>;

//PRODUCT CATEGORIES
export type ProductCategory = InferModel<typeof productCategories>;
export type ProductCategoryBodyPost = Input<typeof productCategoryPostSchema>;
export type ProductCategoryBodyUpdate = Input<typeof productCategoryUpdateSchema>;

//ORDERS
export type Order = InferModel<typeof orders>;
export type OrderWithoutId = Omit<Order, "order_id">;
export type OrderBodyPost = Input<typeof orderPostSchema>;


//DETAIL ORDERS
export type DetailOrder = InferModel<typeof detailOrders>;
export type DetailOrderWithoutId = Omit<DetailOrder, "detail_order_id">;
export type DetailOrderBodyPost = Input<typeof detailOrderPostSchema>;
