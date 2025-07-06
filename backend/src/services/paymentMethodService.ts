import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { paymentMethods } from "../database/db/paymentMethodScheme";
import { AppError } from "../errors";
import type { PaymentMethod, PaymentMethodBodyPost } from "../types/types";
import { v4 as uuid } from "uuid";

const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const allPaymentMethods: PaymentMethod[] = await db.select().from(paymentMethods);
    return allPaymentMethods;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los métodos de pago.", 400, []);
  }
};

const getPaymentMethodById = async (payment_method_id: string): Promise<PaymentMethod | undefined> => {
  try {
    const paymentMethod: PaymentMethod | undefined = await db.select().from(paymentMethods).where(eq(paymentMethods.payment_method_id, payment_method_id)).get();
    return paymentMethod;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el método de pago.", 400, []);
  }
}

const postPaymentMethod = async (dataPaymentMethod: PaymentMethodBodyPost): Promise<PaymentMethod> => {
  try {
    const newPaymentMethod = {
      payment_method_id: uuid(),
      ...dataPaymentMethod
    };

    const paymentMethod: PaymentMethod = await db.insert(paymentMethods).values(newPaymentMethod).returning().get();
    return paymentMethod;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el método de pago.", 400, []);
  }
}

const deletePaymentMethod = async (payment_method_id: string): Promise<void> => {
  try {
    await db.delete(paymentMethods).where(eq(paymentMethods.payment_method_id, payment_method_id));
  } catch (error) {
    throw new AppError("Ocurrió un error al eliminar el método de pago.", 400, []);
  }
}

export const paymentMethodService = {
  getAllPaymentMethods,
  getPaymentMethodById,
  postPaymentMethod,
  deletePaymentMethod
}