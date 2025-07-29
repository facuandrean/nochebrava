import type { Input } from 'valibot';
import type { InferModel } from "drizzle-orm";
import type { products } from "../database/db/productScheme";
import type { orders } from "../database/db/orderScheme";
import type { uuidSchema } from '../schemas/uuidSchema';
import type { categories } from '../database/db/categoryScheme';
import type { productPostSchema, productUpdateSchema } from "../schemas/productSchema";
import type { categoryPostSchema, categoryUpdateSchema } from '../schemas/categorySchema';
import type { productCategories } from '../database/db/productCategoryScheme';
import type { productCategoryPostSchema, productCategoryUpdateSchema, productCategoriesBatchPostSchema, productCategoriesBatchPutSchema } from '../schemas/productCategorySchema';
import type { orderPostSchema } from '../schemas/orderSchema';
import type { detailOrderPostSchema, detailOrderUpdateSchema } from '../schemas/detailOrderSchema';
import type { detailOrders } from '../database/db/detailOrderScheme';
import type { packs } from '../database/db/packScheme';
import type { packPostSchema, packUpdateSchema } from '../schemas/packSchema';
import type { paymentMethods } from '../database/db/paymentMethodScheme';
import type { paymentMethodPostSchema } from '../schemas/paymentMethodSchema';
import type { packItems } from '../database/db/packItemScheme';
import type { packItemPostSchema, packItemUpdateSchema } from '../schemas/packItemSchema';
import type { itemTypes } from '../database/db/itemTypeScheme';
import type { itemTypeSchema } from '../schemas/itemTypeSchema';
import type { expenses } from '../database/db/expenseScheme';
import type { expenseBodyScheme } from '../schemas/expenseSchema';
import type { expenseItems } from '../database/db/expenseItemScheme';
import type { expenseItemsScheme } from '../schemas/expenseItemSchema';

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
export type ProductCategoriesBatchBodyPost = Input<typeof productCategoriesBatchPostSchema>;
export type ProductCategoriesBatchBodyPut = Input<typeof productCategoriesBatchPutSchema>;

export type Order = InferModel<typeof orders>;
export type OrderWithoutId = Omit<Order, "order_id">;
export type OrderBodyPost = Input<typeof orderPostSchema>;

export type DetailOrder = InferModel<typeof detailOrders>;
export type DetailOrderWithoutId = Omit<DetailOrder, "detail_order_id">;
export type DetailOrderBody = Input<typeof detailOrderPostSchema>;

export type Pack = InferModel<typeof packs>;
export type PackWithoutId = Omit<Pack, "pack_id">;
export type PackBodyPost = Input<typeof packPostSchema>;
export type PackBodyUpdate = Input<typeof packUpdateSchema>;

export type PackItem = InferModel<typeof packItems>;
export type PackItemWithoutId = Omit<PackItem, "pack_item_id">;
export type PackItemBodyPost = Input<typeof packItemPostSchema>;
export type PackItemBodyUpdate = Input<typeof packItemUpdateSchema>;

export type PaymentMethod = InferModel<typeof paymentMethods>;
export type PaymentMethodBodyPost = Input<typeof paymentMethodPostSchema>;

export type ItemType = InferModel<typeof itemTypes>;
export type ItemTypeBody = Input<typeof itemTypeSchema>;

export type Expense = InferModel<typeof expenses>;
export type ExpenseBody = Input<typeof expenseBodyScheme>;

export type ExpenseItem = InferModel<typeof expenseItems>;
export type ExpenseItemBody = Input<typeof expenseItemsScheme>;
