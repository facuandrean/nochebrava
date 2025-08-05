import type { Request, Response } from "express";
import { AppError } from "../errors";
import { paymentMethodService } from "../services/paymentMethodService";
import type { PaymentMethod, PaymentMethodBodyPost } from "../types/types";

/**
 * Retrieves all payment methods available in the system.
 * 
 * @description This function fetches all payment methods from the database through the payment method service.
 * If no payment methods are found, returns a 404 error with an empty array.
 * On success, returns an array with all found payment methods.
 * 
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getAllPaymentMethods = async (_req: Request, res: Response): Promise<void> => {
  try {
    const paymentMethods: PaymentMethod[] = await paymentMethodService.getAllPaymentMethods();

    if (paymentMethods.length === 0) {
      res.status(404).json({
        status: "Operación exitosa.",
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

/**
 * Retrieves a specific payment method by its ID.
 * 
 * @description This function searches for a payment method in the database using its unique ID.
 * If the payment method doesn't exist, returns a 404 error.
 * On success, returns the complete data of the found payment method.
 * 
 * @param {Request} req - Express request object that must contain payment_method_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const getPaymentMethodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment_method_id = req.params.payment_method_id as string;

    const paymentMethod: PaymentMethod | undefined = await paymentMethodService.getPaymentMethodById(payment_method_id);

    if (!paymentMethod) {
      res.status(404).json({
        status: "Operación exitosa.",
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

/**
 * Creates a new payment method in the system.
 * 
 * @description This function creates a new payment method with the data provided in the request body.
 * Returns the created payment method with all its data, including the generated ID.
 * 
 * @param {Request} req - Express request object that must contain payment method data in the body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs (validation, duplicates, etc.)
 * @throws {Error} When an internal server error occurs
 */
const postPaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataPaymentMethod = req.body as PaymentMethodBodyPost;

    const paymentMethod: PaymentMethod = await paymentMethodService.postPaymentMethod(dataPaymentMethod);

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

/**
 * Deletes a payment method from the system by its ID.
 * 
 * @description This function permanently removes a payment method from the database.
 * First verifies that the payment method exists before proceeding with deletion.
 * Once deleted, returns a confirmation of the operation.
 * 
 * @param {Request} req - Express request object that must contain payment_method_id in parameters
 * @param {Response} res - Express response object
 * @returns {Promise<void>} No return value, sends HTTP response directly
 * 
 * @throws {AppError} When a specific application error occurs
 * @throws {Error} When an internal server error occurs
 */
const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment_method_id = req.params.payment_method_id as string;

    const paymentMethod: PaymentMethod | undefined = await paymentMethodService.getPaymentMethodById(payment_method_id);

    if (!paymentMethod) {
      res.status(404).json({
        status: "Operación exitosa.",
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