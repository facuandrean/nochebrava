import { eq } from "drizzle-orm";
import { db } from "../database/database";
import { paymentMethods } from "../database/db/paymentMethodScheme";
import { AppError } from "../errors";
import type { PaymentMethod, PaymentMethodBodyPost } from "../types/types";
import { getCurrentDate } from "../utils/date";
import { v4 as uuid } from "uuid";

/**
 * Retrieves all payment methods from the database.
 * 
 * @description This function fetches all payment methods stored in the database using Drizzle ORM.
 * Returns an array of all payment methods or an empty array if none exist.
 * 
 * @returns {Promise<PaymentMethod[]>} Promise that resolves to an array of PaymentMethod objects
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const allPaymentMethods: PaymentMethod[] = await db.select().from(paymentMethods);
    return allPaymentMethods;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener los métodos de pago.", 400, []);
  }
};

/**
 * Retrieves a specific payment method by its unique identifier.
 * 
 * @description This function searches for a payment method in the database using its payment_method_id.
 * Returns the payment method if found, or undefined if no payment method exists with the given ID.
 * 
 * @param {string} payment_method_id - The unique identifier of the payment method to retrieve
 * @returns {Promise<PaymentMethod | undefined>} Promise that resolves to a PaymentMethod object or undefined
 * 
 * @throws {AppError} When a database error occurs during the query
 */
const getPaymentMethodById = async (payment_method_id: string): Promise<PaymentMethod | undefined> => {
  try {
    const paymentMethod: PaymentMethod | undefined = await db.select().from(paymentMethods).where(eq(paymentMethods.payment_method_id, payment_method_id)).get();
    return paymentMethod;
  } catch (error) {
    throw new AppError("Ocurrió un error al obtener el método de pago.", 400, []);
  }
}

/**
 * Creates a new payment method in the database.
 * 
 * @description This function creates a new payment method with the provided data.
 * Automatically generates a new UUID for the payment_method_id and inserts the record into the database.
 * Returns the complete payment method object with the generated ID.
 * 
 * @param {PaymentMethodBodyPost} dataPaymentMethod - The payment method data without the ID (name, description, etc.)
 * @returns {Promise<PaymentMethod>} Promise that resolves to the created PaymentMethod object
 * 
 * @throws {AppError} When a database error occurs during the insertion
 */
const postPaymentMethod = async (dataPaymentMethod: PaymentMethodBodyPost): Promise<PaymentMethod> => {
  try {
    const date = getCurrentDate();
    const newPaymentMethod = {
      payment_method_id: uuid(),
      ...dataPaymentMethod,
      created_at: date,
      updated_at: date
    };

    const paymentMethod: PaymentMethod = await db.insert(paymentMethods).values(newPaymentMethod).returning().get();
    return paymentMethod;
  } catch (error) {
    throw new AppError("Ocurrió un error al crear el método de pago.", 400, []);
  }
}

/**
 * Deletes a payment method from the database.
 * 
 * @description This function permanently removes a payment method from the database using its payment_method_id.
 * No return value is provided as the operation is destructive.
 * 
 * @param {string} payment_method_id - The unique identifier of the payment method to delete
 * @returns {Promise<void>} Promise that resolves when the deletion is complete
 * 
 * @throws {AppError} When a database error occurs during the deletion
 */
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