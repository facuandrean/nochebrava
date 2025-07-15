import { db } from "../database/database";
import { products } from "../database/db/productScheme";
import { packs } from "../database/db/packScheme";
import { packItems } from "../database/db/packItemScheme";
import { itemTypes } from "../database/db/itemTypeScheme";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const ITEM_TYPES = {
  PRODUCT: "product",
  PACK: "pack"
} as const;

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];

/**
 * Valida que un item_id existe para el tipo especificado
 */
export async function validateItemExists(itemId: string, itemType: ItemType): Promise<boolean> {
  try {
    switch (itemType) {
      case ITEM_TYPES.PRODUCT: {
        const product = await db.select().from(products).where(eq(products.product_id, itemId)).limit(1);
        return product.length > 0;
      }

      case ITEM_TYPES.PACK: {
        const pack = await db.select().from(packs).where(eq(packs.pack_id, itemId)).limit(1);
        return pack.length > 0;
      }

      default:
        return false;
    }
  } catch (error) {
    console.error("Error validando item:", error);
    return false;
  }
}

/**
 * Obtiene la información de un item basado en su tipo e ID
 */
export async function getItemInfo(itemId: string, itemType: ItemType) {
  try {
    switch (itemType) {
      case ITEM_TYPES.PRODUCT: {
        const product = await db.select().from(products).where(eq(products.product_id, itemId)).limit(1);
        return product[0] || null;
      }

      case ITEM_TYPES.PACK: {
        const pack = await db.select().from(packs).where(eq(packs.pack_id, itemId)).limit(1);
        return pack[0] || null;
      }

      default:
        return null;
    }
  } catch (error) {
    console.error("Error obteniendo información del item:", error);
    return null;
  }
}

/**
 * Obtiene todos los tipos de items disponibles
 */
export async function getAvailableItemTypes() {
  try {
    const types = await db.select().from(itemTypes);
    return types;
  } catch (error) {
    console.error("Error obteniendo tipos de items:", error);
    return [];
  }
}

/**
 * Valida que el tipo de item sea válido
 */
export async function validateItemType(itemType: string): Promise<boolean> {
  try {
    const types = await db.select().from(itemTypes).where(eq(itemTypes.item_type_id, itemType)).limit(1);
    return types.length > 0;
  } catch (error) {
    console.error("Error validando tipo de item:", error);
    return false;
  }
}

/**
 * Valida que hay suficiente stock para un producto
 */
export async function validateProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const product = await db.select().from(products).where(eq(products.product_id, productId)).limit(1);
    if (product.length === 0) return false;

    const productData = product[0];
    if (!productData) return false;

    return productData.stock >= quantity;
  } catch (error) {
    console.error("Error validando stock del producto:", error);
    return false;
  }
}

/**
 * Valida que hay suficiente stock para un pack
 */
export async function validatePackStock(packId: string, packQuantity: number): Promise<boolean> {
  try {
    // Obtener todos los productos del pack
    const packProducts = await db.select().from(packItems).where(eq(packItems.pack_id, packId));

    // Verificar stock para cada producto del pack
    for (const packProduct of packProducts) {
      const product = await db.select().from(products).where(eq(products.product_id, packProduct.product_id)).limit(1);
      if (product.length === 0) return false;

      const productData = product[0];
      if (!productData) return false;

      // La cantidad necesaria es: cantidad del pack * cantidad del producto en el pack
      const requiredQuantity = packQuantity * packProduct.quantity;
      if (productData.stock < requiredQuantity) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error validando stock del pack:", error);
    return false;
  }
}

/**
 * Resta stock de un producto
 */
export async function subtractProductStock(productId: string, quantity: number): Promise<void> {
  try {
    await db.update(products)
      .set({ stock: sql`stock - ${quantity}` })
      .where(eq(products.product_id, productId));
  } catch (error) {
    console.error("Error restando stock del producto:", error);
    throw error;
  }
}

/**
 * Resta stock de un pack (resta stock de todos sus productos)
 */
export async function subtractPackStock(packId: string, packQuantity: number): Promise<void> {
  try {
    // Obtener todos los productos del pack
    const packProducts = await db.select().from(packItems).where(eq(packItems.pack_id, packId));

    // Restar stock de cada producto del pack
    for (const packProduct of packProducts) {
      const quantityToSubtract = packQuantity * packProduct.quantity;
      await db.update(products)
        .set({ stock: sql`stock - ${quantityToSubtract}` })
        .where(eq(products.product_id, packProduct.product_id));
    }
  } catch (error) {
    console.error("Error restando stock del pack:", error);
    throw error;
  }
}

/**
 * Valida stock y resta según el tipo de item
 */
export async function validateAndSubtractStock(itemId: string, itemType: string, quantity: number): Promise<boolean> {
  try {
    // Obtener el tipo de item para saber si es producto o pack
    const itemTypeInfo = await db.select().from(itemTypes).where(eq(itemTypes.item_type_id, itemType)).limit(1);
    if (itemTypeInfo.length === 0) return false;

    const typeData = itemTypeInfo[0];
    if (!typeData) return false;

    const typeName = typeData.name;

    if (typeName === ITEM_TYPES.PRODUCT) {
      // Validar stock del producto
      const hasStock = await validateProductStock(itemId, quantity);
      if (!hasStock) return false;

      // Restar stock del producto
      await subtractProductStock(itemId, quantity);
      return true;

    } else if (typeName === ITEM_TYPES.PACK) {
      // Validar stock del pack
      const hasStock = await validatePackStock(itemId, quantity);
      if (!hasStock) return false;

      // Restar stock del pack
      await subtractPackStock(itemId, quantity);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error validando y restando stock:", error);
    return false;
  }
}

/**
 * Obtiene información completa de un item con su tipo
 */
export async function getItemCompleteInfo(itemId: string, itemType: string) {
  try {
    // Obtener información del tipo
    const itemTypeInfo = await db.select().from(itemTypes).where(eq(itemTypes.item_type_id, itemType)).limit(1);
    if (itemTypeInfo.length === 0) return null;

    const typeData = itemTypeInfo[0];
    if (!typeData) return null;

    const typeName = typeData.name;

    // Obtener información del item según su tipo
    let itemInfo = null;

    if (typeName === ITEM_TYPES.PRODUCT) {
      const product = await db.select().from(products).where(eq(products.product_id, itemId)).limit(1);
      itemInfo = product[0] || null;
    } else if (typeName === ITEM_TYPES.PACK) {
      const pack = await db.select().from(packs).where(eq(packs.pack_id, itemId)).limit(1);
      itemInfo = pack[0] || null;
    }

    if (!itemInfo) return null;

    return {
      item_type_id: itemType,
      item_type_name: typeName,
      item_info: itemInfo
    };
  } catch (error) {
    console.error("Error obteniendo información completa del item:", error);
    return null;
  }
}

/**
 * Obtiene todos los productos de un pack
 */
export async function getPackProducts(packId: string) {
  try {
    const packProducts = await db
      .select({
        pack_item_id: packItems.pack_item_id,
        quantity: packItems.quantity,
        product_id: packItems.product_id,
        product_name: products.name,
        product_price: products.price,
        product_stock: products.stock
      })
      .from(packItems)
      .innerJoin(products, eq(packItems.product_id, products.product_id))
      .where(eq(packItems.pack_id, packId));

    return packProducts;
  } catch (error) {
    console.error("Error obteniendo productos del pack:", error);
    return [];
  }
} 