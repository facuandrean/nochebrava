import type { Request, Response } from "express";
import { AppError } from "../errors";
import { packService } from "../services/packService";
import type { Pack, PackBodyPost, PackBodyUpdate } from "../types/types";

/**
 * Obtiene todos los packs del sistema.
 * 
 * @description Endpoint que recupera todos los packs disponibles en el sistema.
 * Retorna un array con todos los packs o un array vacío si no hay packs.
 * Los packs representan agrupaciones de productos que se venden juntos.
 * 
 * @param {Request} _req - Objeto de solicitud Express (no utilizado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 * 
 * @example
 * GET /api/v1/packs
 * 
 * Respuesta exitosa (200):
 * {
 *   "status": "Operación exitosa.",
 *   "message": "Packs obtenidos correctamente.",
 *   "data": [{ pack_id: "uuid", name: "Pack Premium", ... }]
 * }
 * 
 * Respuesta sin datos (404):
 * {
 *   "status": "Operación fallida.",
 *   "message": "No se encontraron packs.",
 *   "data": []
 * }
 */
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

/**
 * Obtiene un pack específico por su ID.
 * 
 * @description Endpoint que busca un pack específico usando su identificador único.
 * Retorna el pack completo si existe, o un error 404 si no se encuentra.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_id en params
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 * 
 * @example
 * GET /api/v1/packs/123e4567-e89b-12d3-a456-426614174000
 * 
 * Respuesta exitosa (200):
 * {
 *   "status": "Operación exitosa.",
 *   "message": "Pack obtenido correctamente.",
 *   "data": { pack_id: "uuid", name: "Pack Premium", ... }
 * }
 * 
 * Respuesta no encontrado (404):
 * {
 *   "status": "Operación fallida.",
 *   "message": "No se encontró el pack.",
 *   "data": []
 * }
 */
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

/**
 * Crea un nuevo pack en el sistema.
 * 
 * @description Endpoint que crea un nuevo pack con los datos proporcionados.
 * Valida los datos de entrada y retorna el pack creado con todos sus campos.
 * 
 * @param {Request} req - Objeto de solicitud Express con datos del pack en body
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 * 
 * @example
 * POST /api/v1/packs
 * Body: {
 *   "name": "Pack Básico",
 *   "description": "Pack con productos básicos",
 *   "price": 25.99
 * }
 * 
 * Respuesta exitosa (201):
 * {
 *   "status": "Operación exitosa.",
 *   "message": "Pack creado correctamente.",
 *   "data": { pack_id: "uuid", name: "Pack Básico", ... }
 * }
 */
const postPack = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataPack = req.body as PackBodyPost;

    const newPack: Pack = await packService.postPack(dataPack);

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

/**
 * Actualiza un pack existente en el sistema.
 * 
 * @description Endpoint que modifica los datos de un pack existente usando su ID.
 * Valida que el pack existe antes de actualizarlo y retorna el pack actualizado.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_id en params y datos en body
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 * 
 * @example
 * PATCH /api/v1/packs/123e4567-e89b-12d3-a456-426614174000
 * Body: {
 *   "name": "Pack Premium Actualizado",
 *   "price": 29.99
 * }
 * 
 * Respuesta exitosa (200):
 * {
 *   "status": "Operación exitosa.",
 *   "message": "Pack actualizado correctamente.",
 *   "data": { pack_id: "uuid", name: "Pack Premium Actualizado", ... }
 * }
 * 
 * Respuesta no encontrado (404):
 * {
 *   "status": "Operación fallida.",
 *   "message": "No se encontró el pack.",
 *   "data": []
 * }
 */
const updatePack = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_id = req.params.pack_id as string;
    const dataPack = req.body as PackBodyUpdate;

    const existsPack = await packService.getPackById(pack_id);
    if (!existsPack) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el pack.",
        data: []
      });
      return;
    }

    const updatedPack: Pack = await packService.updatePack(pack_id, dataPack);

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

/**
 * Elimina un pack del sistema.
 * 
 * @description Endpoint que elimina permanentemente un pack usando su ID.
 * Valida que el pack existe antes de eliminarlo. Esta operación es irreversible.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_id en params
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 * 
 * @example
 * DELETE /api/v1/packs/123e4567-e89b-12d3-a456-426614174000
 * 
 * Respuesta exitosa (200):
 * {
 *   "status": "Operación exitosa.",
 *   "message": "Pack eliminado correctamente.",
 *   "data": []
 * }
 * 
 * Respuesta no encontrado (404):
 * {
 *   "status": "Operación fallida.",
 *   "message": "No se encontró el pack.",
 *   "data": []
 * }
 */
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