import type { Pack, PackBodyPost, PackBodyUpdate } from "../types/types";

const getPacks = async (): Promise<Pack[]> => {
  return [];
};

const getPackById = async (pack_id: string): Promise<Pack | undefined> => {
  return;
};

const postPack = async (dataPack: PackBodyPost): Promise<Pack> => {
  return dataPack;
};

const updatePack = async (pack_id: string, dataPack: PackBodyUpdate): Promise<Pack> => {
  return dataPack;
};

const deletePack = async (pack_id: string): Promise<void> => {
  return;
};

export const packService = {
  getPacks,
  getPackById,
  postPack,
  updatePack,
  deletePack
};