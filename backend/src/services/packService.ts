import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { packs } from "../database/db/packScheme";
import { AppError } from "../errors";
import type { Pack, PackBodyPost, PackBodyUpdate } from "../types/types";
import { getCurrentDate } from "../utils/date";
import { v4 as uuid } from "uuid";

const getPacks = async (): Promise<Pack[]> => {
  try {
    const allPacks = await db.select().from(packs).all();
    return allPacks;
  } catch (error) {
    throw new AppError("Error al obtener los packs.", 400, []);
  }
};

const getPackById = async (pack_id: string): Promise<Pack | undefined> => {
  try {
    const pack = await db.select().from(packs).where(eq(packs.pack_id, pack_id)).get();
    return pack;
  } catch (error) {
    throw new AppError("Error al obtener el pack de id " + pack_id, 400, []);
  }
};

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

const updatePack = async (pack_id: string, dataPack: PackBodyUpdate): Promise<Pack> => {
  try {
    const date = getCurrentDate();
    const pack = await db.update(packs)
      .set({ ...dataPack, updated_at: date })
      .where(eq(packs.pack_id, pack_id))
      .returning()
      .get();
    return pack;
  } catch (error) {
    throw new AppError("Error al actualizar el pack.", 400, []);
  }
};

const deletePack = async (pack_id: string): Promise<void> => {
  try {
    await db.delete(packs).where(eq(packs.pack_id, pack_id));
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