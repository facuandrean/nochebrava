import type { Request, Response } from "express";
import { AppError } from "../errors";
import { packItemService } from "../services/packItemService";
import type { Pack, PackItem, PackItemBodyPost, PackItemBodyUpdate } from "../types/types";
import { packService } from "../services/packService";

/**
 * Obtiene todos los pack items del sistema.
 * 
 * @description Endpoint que recupera todos los pack items disponibles en el sistema.
 * Retorna un array con todos los pack items o un array vacío si no hay items.
 * Los pack items representan los productos individuales que componen cada pack.
 * 
 * @param {Request} _req - Objeto de solicitud Express (no utilizado)
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 */
const getPackItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const packItems = await packItemService.getPackItems();

    if (packItems.length === 0) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontraron items de packs.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Items de packs obtenidos correctamente.",
      data: packItems
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
      message: "Ocurrió un error al obtener todos los items de packs.",
      data: []
    });
    return;
  }
};

/**
 * Obtiene un pack item específico por su ID.
 * 
 * @description Endpoint que busca un pack item específico usando su identificador único.
 * Retorna el pack item completo si existe, o un error 404 si no se encuentra.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_item_id en params
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 */
const getPackItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_item_id = req.params.pack_item_id as string;

    const packItem: PackItem | undefined = await packItemService.getPackItemById(pack_item_id);

    if (!packItem) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el item de pack.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Item de pack obtenido correctamente.",
      data: packItem
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
      message: "Ocurrió un error al obtener el item de pack.",
      data: []
    });
    return;
  }
};

/**
 * Obtiene todos los items de un pack específico.
 * 
 * @description Endpoint que busca todos los pack items asociados a un pack específico.
 * Valida que el pack existe antes de buscar sus items.
 * Retorna un array con todos los items del pack o un error 404 si no hay items.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_id en params
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 */
const getPackItemsByPackId = async (req: Request, res: Response): Promise<void> => {
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

    const packItems = await packItemService.getPackItemsByPackId(pack_id);

    if (packItems.length === 0) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontraron items para este pack.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Items del pack obtenidos correctamente.",
      data: packItems
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
      message: "Ocurrió un error al obtener los items del pack.",
      data: []
    });
    return;
  }
};

/**
 * Crea un nuevo pack item o actualiza la cantidad si ya existe.
 * 
 * @description Endpoint que crea un nuevo pack item o actualiza la cantidad si el producto ya existe en el pack.
 * Si viene desde una ruta compuesta, usa el pack_id de la URL.
 * Verifica si ya existe un item con el mismo producto en el pack antes de crear o actualizar.
 * 
 * @param {Request} req - Objeto de solicitud Express con datos del pack item en body y opcionalmente pack_id en params
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 */
const postPackItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataPackItem = req.body as PackItemBodyPost;

    // Si viene desde una ruta compuesta, usar el pack_id de la URL
    if (req.params.pack_id) {
      dataPackItem.pack_id = req.params.pack_id;
    }

    // Verificar si ya existe un item con el mismo producto en este pack
    const existingItem = await packItemService.getPackItemByPackAndProduct(
      dataPackItem.pack_id,
      dataPackItem.product_id
    );

    let result: PackItem;

    if (existingItem) {
      // Actualizar cantidad del item existente
      const newQuantity = existingItem.quantity + dataPackItem.quantity;

      result = await packItemService.updatePackItem(existingItem.pack_item_id, {
        quantity: newQuantity
      });

      res.status(200).json({
        status: "Operación exitosa.",
        message: "Cantidad del item de pack actualizada correctamente.",
        data: result
      });
    } else {
      // Crear nuevo item
      result = await packItemService.postPackItem(dataPackItem);

      res.status(201).json({
        status: "Operación exitosa.",
        message: "Item de pack creado correctamente.",
        data: result
      });
    }
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
 * Actualiza un pack item existente en el sistema.
 * 
 * @description Endpoint que modifica los datos de un pack item existente usando su ID.
 * Valida que el pack item existe antes de actualizarlo y retorna el pack item actualizado.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_item_id en params y datos en body
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 */
const putPackItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_item_id = req.params.pack_item_id as string;
    const dataPackItem = req.body as PackItemBodyUpdate;

    const existsPackItem = await packItemService.getPackItemById(pack_item_id);
    if (!existsPackItem) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el item de pack.",
        data: []
      });
      return;
    }

    const updatedPackItem: PackItem = await packItemService.updatePackItem(pack_item_id, dataPackItem);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Item de pack actualizado correctamente.",
      data: updatedPackItem
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
 * Elimina un pack item del sistema.
 * 
 * @description Endpoint que elimina permanentemente un pack item usando su ID.
 * Valida que el pack item existe antes de eliminarlo. Esta operación es irreversible.
 * 
 * @param {Request} req - Objeto de solicitud Express con pack_item_id en params
 * @param {Response} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, envía respuesta HTTP
 */
const deletePackItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const pack_item_id = req.params.pack_item_id as string;

    const existsPackItem: PackItem | undefined = await packItemService.getPackItemById(pack_item_id);
    if (!existsPackItem) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el item de pack.",
        data: []
      });
      return;
    }

    await packItemService.deletePackItem(pack_item_id);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Item de pack eliminado correctamente.",
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

export const packItemController = {
  getPackItems,
  getPackItemById,
  getPackItemsByPackId,
  postPackItem,
  putPackItem,
  deletePackItem
};
