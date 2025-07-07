import type { Request, Response } from "express";
import { AppError } from "../errors";
import { packItemService } from "../services/packItemService";
import type { Pack, PackItem, PackItemBodyPost, PackItemBodyUpdate } from "../types/types";
import { packService } from "../services/packService";

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
