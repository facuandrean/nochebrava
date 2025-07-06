import type { Request, Response } from "express";
import { AppError } from "../errors";
import { paymentMethodService } from "../services/paymentMethodService";
import type { PaymentMethod, PaymentMethodBodyPost } from "../types/types";

const getAllPaymentMethods = async (_req: Request, res: Response): Promise<void> => {
  try {
    const paymentMethods: PaymentMethod[] = await paymentMethodService.getAllPaymentMethods();

    if (paymentMethods.length === 0) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontraron métodos de pago.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Métodos de pago obtenidos correctamente.",
      data: paymentMethods
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
      message: "Ocurrió un error al procesar la solicitud.",
      data: []
    });
    return;
  }
};

const getPaymentMethodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment_method_id = req.params.payment_method_id as string;

    const paymentMethod: PaymentMethod | undefined = await paymentMethodService.getPaymentMethodById(payment_method_id);

    if (!paymentMethod) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el método de pago.",
        data: []
      });
      return;
    }

    res.status(200).json({
      status: "Operación exitosa.",
      message: "Método de pago obtenido correctamente.",
      data: paymentMethod
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
      message: "Ocurrió un error al procesar la solicitud.",
      data: []
    });
    return;
  }
}

const postPaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataPaymentMethod = req.body as PaymentMethodBodyPost;

    const newPaymentMethod = {
      ...dataPaymentMethod
    };

    const paymentMethod: PaymentMethod = await paymentMethodService.postPaymentMethod(newPaymentMethod);

    res.status(201).json({
      status: "Operación exitosa.",
      message: "Método de pago creado correctamente.",
      data: paymentMethod
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
      message: "Ocurrió un error al procesar la solicitud.",
      data: []
    });
    return;
  }
}

const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment_method_id = req.params.payment_method_id as string;

    const paymentMethod: PaymentMethod | undefined = await paymentMethodService.getPaymentMethodById(payment_method_id);

    if (!paymentMethod) {
      res.status(404).json({
        status: "Operación fallida.",
        message: "No se encontró el método de pago.",
        data: []
      });
      return;
    }

    await paymentMethodService.deletePaymentMethod(payment_method_id);

    res.status(204).json({
      status: "Operación exitosa.",
      message: "Método de pago eliminado correctamente.",
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
      status: "Error interno del servidor.",
      message: "Ocurrió un error al procesar la solicitud.",
      data: []
    });
    return;
  }
}

export const paymentMethodController = {
  getAllPaymentMethods,
  getPaymentMethodById,
  postPaymentMethod,
  deletePaymentMethod
}