import type { Request, Response } from "express";

const getAllPaymentMethods = async (_req: Request, res: Response): Promise<void> => {

};

const getPaymentMethodById = async (req: Request, res: Response): Promise<void> => {

}

const postPaymentMethod = async (req: Request, res: Response): Promise<void> => {

}

const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {

}

export const paymentMethodController = {
  getAllPaymentMethods,
  getPaymentMethodById,
  postPaymentMethod,
  deletePaymentMethod
}