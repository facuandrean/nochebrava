import type { PaymentMethod, PaymentMethodBodyPost } from "../types/types";

const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  return [];
};

const getPaymentMethodById = async (payment_method_id: string): Promise<PaymentMethod | undefined> => {
  return undefined;
}

const postPaymentMethod = async (dataPaymentMethod: PaymentMethodBodyPost): Promise<void> => {
}

const deletePaymentMethod = async (payment_method_id: string): Promise<void> => {

}

export const paymentMethodController = {
  getAllPaymentMethods,
  getPaymentMethodById,
  postPaymentMethod,
  deletePaymentMethod
}