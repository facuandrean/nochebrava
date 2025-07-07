import { eq, and } from "drizzle-orm";
import { db } from "../database/database";
import { packItems } from "../database/db/packItemScheme";
import { AppError } from "../errors";
import type { PackItem, PackItemBodyPost, PackItemBodyUpdate } from "../types/types";
import { getCurrentDate } from "../utils/date";
import { v4 as uuid } from "uuid";

const getPackItems = async (): Promise<PackItem[]> => {
  try {
    const allPackItems = await db.select().from(packItems).all();
    return allPackItems;
  } catch (error) {
    throw new AppError("Error al obtener los items de packs.", 400, []);
  }
};

const getPackItemById = async (pack_item_id: string): Promise<PackItem | undefined> => {
  try {
    const packItem = await db.select().from(packItems).where(eq(packItems.pack_item_id, pack_item_id)).get();
    return packItem;
  } catch (error) {
    throw new AppError("Error al obtener el item de pack de id " + pack_item_id, 400, []);
  }
};

const getPackItemsByPackId = async (pack_id: string): Promise<PackItem[]> => {
  try {
    const packItemsList = await db.select().from(packItems).where(eq(packItems.pack_id, pack_id)).all();
    return packItemsList;
  } catch (error) {
    throw new AppError("Error al obtener los items del pack de id " + pack_id, 400, []);
  }
};

const getPackItemByPackAndProduct = async (pack_id: string, product_id: string): Promise<PackItem | undefined> => {
  try {
    const packItem = await db.select().from(packItems).where(and(eq(packItems.pack_id, pack_id), eq(packItems.product_id, product_id))).get();
    return packItem;
  } catch (error) {
    throw new AppError("Error al obtener el item de pack.", 400, []);
  }
};

const postPackItem = async (dataPackItem: PackItemBodyPost): Promise<PackItem> => {
  try {
    const date = getCurrentDate();
    const newPackItem = {
      pack_item_id: uuid(),
      ...dataPackItem,
      created_at: date,
      updated_at: date
    }

    const packItem: PackItem = await db.insert(packItems).values(newPackItem).returning().get();
    return packItem;
  } catch (error) {
    throw new AppError("Error al crear el item de pack.", 400, []);
  }
};

const updatePackItem = async (pack_item_id: string, dataPackItem: PackItemBodyUpdate): Promise<PackItem> => {
  try {
    const date = getCurrentDate();
    const packItem = await db.update(packItems)
      .set({ ...dataPackItem, updated_at: date })
      .where(eq(packItems.pack_item_id, pack_item_id))
      .returning()
      .get();
    return packItem;
  } catch (error) {
    throw new AppError("Error al actualizar el item de pack.", 400, []);
  }
};

const deletePackItem = async (pack_item_id: string): Promise<void> => {
  try {
    await db.delete(packItems).where(eq(packItems.pack_item_id, pack_item_id));
  } catch (error) {
    throw new AppError("Error al eliminar el item de pack.", 400, []);
  }
};

export const packItemService = {
  getPackItems,
  getPackItemById,
  getPackItemsByPackId,
  getPackItemByPackAndProduct,
  postPackItem,
  updatePackItem,
  deletePackItem
};
