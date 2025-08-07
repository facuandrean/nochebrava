import type { ParsedPaymentMethod, PaymentMethod, PaymentMethodRequest } from "../models";

/**
 * Parsea los datos del método de pago para mostrar en la tabla
 * @param data - Datos de los métodos de pago
 * @returns - Datos de los métodos de pago parseados
 */
export const parsePaymentMethodData = (data: PaymentMethod[]): ParsedPaymentMethod[] => {
  return data.map((paymentMethod) => ({
    ...paymentMethod,
    id: paymentMethod.payment_method_id,
  }));
}

/**
 * Parsea los datos del método de pago para enviar al backend
 * @param data - Datos del formulario sin procesar
 * @returns - Datos del formulario parseados
 */
export const parsePaymentMethodDataForBackend = (data: PaymentMethodRequest): Partial<PaymentMethodRequest> => {
  const paymentMethodData: Partial<PaymentMethodRequest> = {};

  if (data.name) paymentMethodData.name = data.name;

  return paymentMethodData;
}