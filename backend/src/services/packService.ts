import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { packs } from "../database/db/packScheme";
import { AppError } from "../errors";
import type { Pack, PackItem, PackBodyPost, PackBodyUpdate } from "../types/types";
import { getCurrentDate } from "../utils/date";
import { v4 as uuid } from "uuid";
import { packItems } from "../database/db/packItemScheme";
import { products } from "../database/db/productScheme";

/**
 * Obtiene todos los packs del sistema con sus packItems incluidos.
 * 
 * @description Recupera todos los packs almacenados en la base de datos junto con
 * sus packItems correspondientes. Cada pack incluye un array de packItems que lo conforman.
 * 
 * @returns {Promise<(Pack & { pack_items: PackItem[] })[]>} Array con todos los packs y sus packItems
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 * 
 * @example
 * const allPacks = await getPacks();
 * console.log(allPacks); // [{ pack_id: "uuid", name: "Pack Premium", pack_items: [...] }]
 */
const getPacks = async (): Promise<(Pack & { pack_items: PackItem[] })[]> => {
  try {
    // Realizar la consulta con leftJoin para obtener packs y sus packItems
    const results = await db.select({
      // Campos del pack
      pack_id: packs.pack_id,
      name: packs.name,
      description: packs.description,
      price: packs.price,
      active: packs.active,
      picture: packs.picture,
      created_at: packs.created_at,
      updated_at: packs.updated_at,
      // Campos del packItem (pueden ser null si no hay items)
      pack_item_id: packItems.pack_item_id,
      product_id: products.product_id,
      product_name: products.name,
      quantity: packItems.quantity,
      item_created_at: packItems.created_at,
      item_updated_at: packItems.updated_at
    }).from(packs).leftJoin(packItems, eq(packs.pack_id, packItems.pack_id)).leftJoin(products, eq(packItems.product_id, products.product_id)).all();

    // Agrupar los resultados por pack_id
    const packsMap = new Map<string, Pack & { pack_items: (PackItem & { product_name: string })[] }>();

    for (const row of results) {
      const packId = row.pack_id;

      // Si el pack no existe en el mapa, crearlo
      if (!packsMap.has(packId)) {
        packsMap.set(packId, {
          pack_id: row.pack_id,
          name: row.name,
          description: row.description,
          price: row.price,
          active: row.active,
          picture: row.picture,
          created_at: row.created_at,
          updated_at: row.updated_at,
          pack_items: []
        });
      }

      // Si existe un packItem en esta fila, agregarlo al array
      if (row.pack_item_id) {
        const pack = packsMap.get(packId)!;
        pack.pack_items.push({
          pack_item_id: row.pack_item_id,
          pack_id: row.pack_id,
          product_id: row.product_id!,
          product_name: row.product_name!,
          quantity: row.quantity!,
          created_at: row.item_created_at!,
          updated_at: row.item_updated_at!
        });
      }
    }

    // Convertir el Map a array
    return Array.from(packsMap.values());
  } catch (error) {
    throw new AppError("Error al obtener los packs.", 400, []);
  }
};

/**
 * Obtiene un pack específico por su ID.
 * 
 * @description Busca un pack en la base de datos usando su identificador único.
 * Si no se encuentra el pack, retorna undefined.
 * 
 * @param {string} pack_id - ID único del pack a buscar
 * @returns {Promise<Pack | undefined>} El pack encontrado o undefined si no existe
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 * 
 * @example
 * const pack = await getPackById("123e4567-e89b-12d3-a456-426614174000");
 * if (pack) {
 *   console.log(pack.name); // "Pack Premium"
 * }
 */
const getPackById = async (pack_id: string): Promise<Pack | undefined> => {
  try {
    const pack: Pack | undefined = await db.select().from(packs).where(eq(packs.pack_id, pack_id)).get();
    return pack;
  } catch (error) {
    throw new AppError("Error al obtener el pack de id " + pack_id, 400, []);
  }
};

/**
 * Crea un nuevo pack en el sistema.
 * 
 * @description Inserta un nuevo pack en la base de datos con los datos proporcionados.
 * Genera automáticamente un ID único y timestamps de creación/actualización.
 * 
 * @param {PackBodyPost} dataPack - Datos del pack a crear
 * @returns {Promise<Pack>} El pack creado con todos sus campos
 * @throws {AppError} Si ocurre un error al insertar en la base de datos
 * 
 * @example
 * const newPack = await postPack({
 *   name: "Pack Básico",
 *   description: "Pack con productos básicos",
 *   price: 25.99
 * });
 */
const postPack = async (dataPack: PackBodyPost): Promise<Pack> => {
  try {
    const date = getCurrentDate();
    const newPack = {
      pack_id: uuid(),
      ...dataPack,
      created_at: date,
      updated_at: date
    };

    const pack: Pack = await db.insert(packs).values(newPack).returning().get();
    return pack;
  } catch (error) {
    throw new AppError("Error al crear el pack.", 400, []);
  }
};

/**
 * Actualiza un pack existente en el sistema.
 * 
 * @description Modifica los datos de un pack existente usando su ID.
 * Actualiza automáticamente el timestamp de modificación.
 * 
 * @param {string} pack_id - ID del pack a actualizar
 * @param {PackBodyUpdate} dataPack - Datos actualizados del pack
 * @returns {Promise<Pack>} El pack actualizado con todos sus campos
 * @throws {AppError} Si ocurre un error al actualizar en la base de datos
 * 
 * @example
 * const updatedPack = await updatePack("123e4567-e89b-12d3-a456-426614174000", {
 *   name: "Pack Premium Actualizado",
 *   price: 29.99
 * });
 */
const updatePack = async (pack_id: string, dataPack: PackBodyUpdate): Promise<Pack> => {
  try {
    const date = getCurrentDate();
    const updatedPack = await db.update(packs)
      .set({ ...dataPack, updated_at: date })
      .where(eq(packs.pack_id, pack_id))
      .returning()
      .get();
    return updatedPack;
  } catch (error) {
    throw new AppError("Error al actualizar el pack.", 400, []);
  }
};

/**
 * Elimina un pack del sistema.
 * 
 * @description Remueve permanentemente un pack de la base de datos usando su ID.
 * Esta operación es irreversible.
 * 
 * @param {string} pack_id - ID del pack a eliminar
 * @returns {Promise<void>} No retorna datos, solo confirma la eliminación
 * @throws {AppError} Si ocurre un error al eliminar de la base de datos
 * 
 * @example
 * await deletePack("123e4567-e89b-12d3-a456-426614174000");
 * console.log("Pack eliminado correctamente");
 */
const deletePack = async (pack_id: string): Promise<void> => {
  try {
    await db.delete(packs).where(eq(packs.pack_id, pack_id));
    return;
  } catch (error) {
    throw new AppError("Error al eliminar el pack.", 400, []);
  }
};

export const packService = {
  getPacks,
  getPackById,
  postPack,
  updatePack,
  deletePack
};