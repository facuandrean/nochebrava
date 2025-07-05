import type { Request, Response } from "express";
import { AppError } from "../errors";
import { packService } from "../services/packService";
import type { Pack, PackBodyPost, PackBodyUpdate, PackWithoutId } from "../types/types";
import { getCurrentDate } from "../utils/date";

const getPacks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const packs = await packService.getPacks();

    if (packs.length === 0) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontraron packs.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Packs obtenidos correctamente.",
      data: packs
    });
    return;
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Error interno del servidor.",
      message: "Ocurrió un error al obtener todos los packs.",
      data: []
    });
    return;
  }
};

const getPackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_id = req.params.pack_id as string;

    const pack: Pack | undefined = await packService.getPackById(pack_id);

    if (!pack) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el pack.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Pack obtenido correctamente.",
      data: pack
    });
    return;
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Error interno del servidor.",
      message: "Ocurrió un error al obtener el pack.",
      data: []
    });
    return;
  }
};

const postPack = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = getCurrentDate();
    const dataPack = req.body as PackBodyPost;

    const pack: PackWithoutId = {
      ...dataPack,
      created_at: date,
      updated_at: date
    }

    const newPack: Pack = await packService.postPack(pack);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Pack creado correctamente.",
      data: newPack
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }
    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    })
    return;
  }
};

const updatePack = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_id = req.params.pack_id as string;
    const dataPack = req.body as PackBodyUpdate;
    const date = getCurrentDate();

    const existsPack = await packService.getPackById(pack_id);
    if (!existsPack) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el pack.",
        data: []
      });
      return;
    }

    const pack: Pack = {
      ...existsPack,
      ...dataPack,
      updated_at: date
    }

    const updatedPack: Pack = await packService.updatePack(pack_id, pack);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Pack actualizado correctamente.",
      data: updatedPack
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
};

const deletePack = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_id = req.params.pack_id as string;

    const existsPack: Pack | undefined = await packService.getPackById(pack_id);
    if (!existsPack) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el pack.",
        data: []
      });
      return;
    }

    await packService.deletePack(pack_id);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Pack eliminado correctamente.",
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida.",
        message: error.message,
        data: error.data
      });
      return;
    }
    res.status(500).json({
      status: "Operación fallida.",
      message: "Error interno del servidor.",
      data: []
    });
    return;
  }
};

export const packController = {
  getPacks,
  getPackById,
  postPack,
  updatePack,
  deletePack
};