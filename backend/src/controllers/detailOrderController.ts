import type { Request, Response } from "express";
import { AppError } from "../errors";
import type { DetailOrder, DetailOrderBody } from "../types/types";
import { detailOrderService } from "../services/detailOrderService";
import { validateItemExists, validateItemType, validateAndSubtractStock, getItemCompleteInfo } from "../utils/itemHelpers";

const getDetailOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const detailOrders: DetailOrder[] = await detailOrderService.getDetailOrders();

    if (detailOrders.length === 0) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontraron detalles de ordenes.",
        data: []
      });
      return;
    };

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Ordenes obtenidas correctamente.",
      data: detailOrders
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Ocurrió un error al obtener los detalles de ordenes.",
    });
    return;
  }
}

const getDetailOrdersById = async (req: Request, res: Response): Promise<void> => {
  try {
    const detailOrder_id = req.params.order_detail_id as string;
    const detailOrder: DetailOrder | undefined = await detailOrderService.getDetailOrdersById(detailOrder_id);

    if (!detailOrder) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontró el detalle de orden.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Detalle de orden obtenida correctamente.",
      data: detailOrder
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Ocurrió un error al obtener el detalle de orden.",
    });
    return;
  }
}

const postDetailOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataDetailOrder = req.body as DetailOrderBody;

    const isValidItemType = await validateItemType(dataDetailOrder.item_type);
    if (!isValidItemType) {
      res.status(400).json({
        status: "Operación fallida",
        message: "El tipo de item especificado no existe.",
        data: []
      });
      return;
    }

    // Validar que el item existe (producto o pack)
    const isValidItem = await validateItemExists(dataDetailOrder.item_id, dataDetailOrder.item_type);
    if (!isValidItem) {
      res.status(400).json({
        status: "Operación fallida",
        message: "El item especificado no existe para el tipo dado.",
        data: []
      });
      return;
    }

    // Validar y restar stock
    const stockUpdated = await validateAndSubtractStock(
      dataDetailOrder.item_id,
      dataDetailOrder.item_type,
      dataDetailOrder.quantity
    );

    if (!stockUpdated) {
      res.status(400).json({
        status: "Operación fallida",
        message: "No hay suficiente stock disponible para completar la venta.",
        data: []
      });
      return;
    }

    const detailOrder: DetailOrder = await detailOrderService.postDetailOrder(dataDetailOrder);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Detalle de orden creada correctamente.",
      data: detailOrder
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Ocurrió un error al crear el detalle de orden.",
      data: []
    });
    return;
  }
}

const deleteDetailOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const detailOrder_id = req.params.order_detail_id as string;

    const detailOrder: DetailOrder | undefined = await detailOrderService.getDetailOrdersById(detailOrder_id);

    if (!detailOrder) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontró el detalle de orden.",
        data: []
      });
      return;
    }

    await detailOrderService.deleteDetailOrder(detailOrder_id);

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Detalle de orden eliminada correctamente.",
      data: []
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Ocurrió un error al eliminar el detalle de orden.",
      data: []
    });
    return;
  }
}

const getDetailOrderWithItemInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const detailOrder_id = req.params.order_detail_id as string;
    const detailOrder: DetailOrder | undefined = await detailOrderService.getDetailOrdersById(detailOrder_id);

    if (!detailOrder) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontró el detalle de orden.",
        data: []
      });
      return;
    }

    // Obtener información completa del item
    const itemInfo = await getItemCompleteInfo(detailOrder.item_id, detailOrder.item_type);

    const response = {
      ...detailOrder,
      item_details: itemInfo
    };

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Detalle de orden obtenida correctamente.",
      data: response
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Ocurrió un error al obtener el detalle de orden.",
    });
    return;
  }
}

/**
 * Obtiene todos los detalles de una orden específica
 */
const getDetailOrdersByOrderId = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = req.params.order_id as string;
    const detailOrdersList: DetailOrder[] = await detailOrderService.getDetailOrdersByOrderId(order_id);

    if (detailOrdersList.length === 0) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontraron detalles para esta orden.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Detalles de la orden obtenidos correctamente.",
      data: detailOrdersList
    });
    return;

  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        status: "Operación fallida",
        message: error.message,
        data: error.data
      });
      return;
    }

    res.status(500).json({
      status: "Operación fallida",
      message: "Ocurrió un error al obtener los detalles de la orden.",
      data: []
    });
    return;
  }
}

export const detailOrderController = {
  getDetailOrders,
  getDetailOrdersById,
  getDetailOrdersByOrderId,
  getDetailOrderWithItemInfo,
  postDetailOrder,
  deleteDetailOrder
}