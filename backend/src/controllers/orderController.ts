import type { Request, Response } from "express";
import { AppError } from "../errors";
import type { Order, OrderBodyPost } from "../types/types";
import { orderService } from "../services/orderService";

const getOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders: Order[] = await orderService.getOrders();

    if (orders.length === 0) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontraron ordenes.",
        data: []
      });
      return;
    };

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Ordenes obtenidas correctamente.",
      data: orders
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
      message: "Ocurrió un error al obtener las ordenes.",
      data: []
    });
    return;
  }
}

const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = req.params.order_id as string;

    const order: Order | undefined = await orderService.getOrderById(order_id);

    if (!order) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontró la orden.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Orden obtenida correctamente.",
      data: order
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
      message: "Ocurrió un error al obtener la orden.",
      data: []
    });
    return;
  }
}

const postOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataOrder = req.body as OrderBodyPost;

    const order: Order = await orderService.postOrder(dataOrder);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Orden creada correctamente.",
      data: order
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
      message: "Ocurrió un error al crear la orden.",
      data: []
    });
    return;
  }
}

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = req.params.order_id as string;

    const order: Order | undefined = await orderService.getOrderById(order_id);

    if (!order) {
      res.status(404).json({
        status: "Operación fallida",
        message: "No se encontró la orden.",
        data: []
      });
      return;
    }

    await orderService.deleteOrder(order_id);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Orden eliminada correctamente.",
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
      message: "Ocurrió un error al eliminar la orden.",
      data: []
    });
    return;
  }
}

export const ordersController = {
  getOrders,
  getOrderById,
  postOrder,
  deleteOrder
}