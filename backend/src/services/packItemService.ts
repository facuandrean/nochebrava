import { eq, and } from "drizzle-orm";
import { db } from "../database/database";
import { packItems } from "../database/db/packItemScheme";
import { AppError } from "../errors";
import type { PackItem, PackItemBodyPost, PackItemBodyUpdate } from "../types/types";
import { getCurrentDate } from "../utils/date";
import { v4 as uuid } from "uuid";

/**
 * Obtiene todos los items de packs del sistema.
 * 
 * @description Recupera todos los items de packs almacenados en la base de datos.
 * Los pack items representan los productos individuales que componen cada pack.
 * 
 * @returns {Promise<PackItem[]>} Array con todos los pack items encontrados
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPackItems = async (): Promise<PackItem[]> => {
  try {
    const allPackItems = await db.select().from(packItems).all();
    return allPackItems;
  } catch (error) {
    throw new AppError("Error al obtener los items de packs.", 400, []);
  }
};

/**
 * Obtiene un pack item específico por su ID.
 * 
 * @description Busca un pack item en la base de datos usando su identificador único.
 * Si no se encuentra el pack item, retorna undefined.
 * 
 * @param {string} pack_item_id - ID único del pack item a buscar
 * @returns {Promise<PackItem | undefined>} El pack item encontrado o undefined si no existe
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPackItemById = async (pack_item_id: string): Promise<PackItem | undefined> => {
  try {
    const packItem = await db.select().from(packItems).where(eq(packItems.pack_item_id, pack_item_id)).get();
    return packItem;
  } catch (error) {
    throw new AppError("Error al obtener el item de pack de id " + pack_item_id, 400, []);
  }
};

/**
 * Obtiene todos los items de un pack específico.
 * 
 * @description Busca todos los pack items asociados a un pack específico usando su ID.
 * Retorna un array con todos los items del pack o un array vacío si no hay items.
 * 
 * @param {string} pack_id - ID del pack para buscar sus items
 * @returns {Promise<PackItem[]>} Array con todos los pack items del pack especificado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPackItemsByPackId = async (pack_id: string): Promise<PackItem[]> => {
  try {
    const packItemsList = await db.select().from(packItems).where(eq(packItems.pack_id, pack_id)).all();
    return packItemsList;
  } catch (error) {
    throw new AppError("Error al obtener los items del pack de id " + pack_id, 400, []);
  }
};

/**
 * Obtiene un pack item específico por pack y producto.
 * 
 * @description Busca un pack item específico usando la combinación de pack_id y product_id.
 * Útil para verificar si un producto ya existe en un pack antes de agregarlo.
 * 
 * @param {string} pack_id - ID del pack
 * @param {string} product_id - ID del producto
 * @returns {Promise<PackItem | undefined>} El pack item encontrado o undefined si no existe
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getPackItemByPackAndProduct = async (pack_id: string, product_id: string): Promise<PackItem | undefined> => {
  try {
    const packItem = await db.select().from(packItems).where(and(eq(packItems.pack_id, pack_id), eq(packItems.product_id, product_id))).get();
    return packItem;
  } catch (error) {
    throw new AppError("Error al obtener el item de pack.", 400, []);
  }
};

/**
 * Crea un nuevo pack item en el sistema.
 * 
 * @description Inserta un nuevo pack item en la base de datos con los datos proporcionados.
 * Genera automáticamente un ID único y timestamps de creación/actualización.
 * 
 * @param {PackItemBodyPost} dataPackItem - Datos del pack item a crear
 * @returns {Promise<PackItem>} El pack item creado con todos sus campos
 * @throws {AppError} Si ocurre un error al insertar en la base de datos
 */
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

/**
 * Actualiza un pack item existente en el sistema.
 * 
 * @description Modifica los datos de un pack item existente usando su ID.
 * Actualiza automáticamente el timestamp de modificación.
 * 
 * @param {string} pack_item_id - ID del pack item a actualizar
 * @param {PackItemBodyUpdate} dataPackItem - Datos actualizados del pack item
 * @returns {Promise<PackItem>} El pack item actualizado con todos sus campos
 * @throws {AppError} Si ocurre un error al actualizar en la base de datos
 */
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

/**
 * Elimina un pack item del sistema.
 * 
 * @description Remueve permanentemente un pack item de la base de datos usando su ID.
 * Esta operación es irreversible.
 * 
 * @param {string} pack_item_id - ID del pack item a eliminar
 * @returns {Promise<void>} No retorna datos, solo confirma la eliminación
 * @throws {AppError} Si ocurre un error al eliminar de la base de datos
 */
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
