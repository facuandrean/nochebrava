import { useApi } from "../../../hooks"
import type { PaymentMethodRequest, PaymentMethodResponse } from "../models"
import { parsePaymentMethodDataForBackend } from "../utils";

/**
 * Hook para crear un método de pago
 * @returns - Función para crear un método de pago
 * @returns - Estado de carga
 * @returns - Error
 */
export const usePostPaymentMethod = () => {
  const { trigger, loading, error } = useApi<PaymentMethodRequest, PaymentMethodResponse>({
    url: "http://localhost:3000/api/v1/payment-methods",
    method: "POST"
  });

  /**
   * Crea un nuevo método de pago. Parsea los datos del formulario para enviarlos a la API.
   * @param formData - Datos del formulario sin procesar
   * @returns Promise con la respuesta de la API o undefined si hay un error
   */
  const postPaymentMethod = async (formData: PaymentMethodRequest) => {
    try {
      const parsedPaymentMethodData = parsePaymentMethodDataForBackend(formData);
      const response = await trigger(parsedPaymentMethodData as PaymentMethodRequest);
      return response;
    } catch (error) {
      console.log('Ocurrió un error al crear el método de pago', error);
    }
  }

  return { postPaymentMethod, loading, error }
}