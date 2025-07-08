import type { Request, Response } from "express";
import { AppError } from "../errors";
import type { DetailOrder, DetailOrderBodyPost, DetailOrderWithoutId } from "../types/types";
import { detailOrderService } from "../services/detailOrderService";
import { getCurrentDate } from "../utils/date";
// import { meteor } from "globals";

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
    // PREGUNTAR porque maneja estado 500 
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
    const date = getCurrentDate();
    const dataDetailOrder: DetailOrderBodyPost = req.body;

    const newDetailOrder: DetailOrderWithoutId = {
      ...dataDetailOrder,
      created_at: date,
    }

    const detailOrder: DetailOrder = await detailOrderService.postDetailOrder(newDetailOrder);

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

    res.status(201).json({
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

export const detailOrderController = {
  getDetailOrders,
  getDetailOrdersById,
  postDetailOrder,
  deleteDetailOrder
}