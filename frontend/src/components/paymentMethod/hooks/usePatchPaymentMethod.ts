import { useApi } from "../../../hooks"
import type { ParsedPaymentMethod, PaymentMethodRequest, PaymentMethodResponse } from "../models"
import { parsePaymentMethodDataForBackend } from "../utils";

interface UsePatchPaymentMethodProps {
  dataEditPaymentMethod: ParsedPaymentMethod | null;
}

/**
 * Hook para actualizar un método de pago
 * @param dataEditPaymentMethod - Datos del método de pago a actualizar
 * @returns - Función para actualizar un método de pago
 * @returns - Estado de carga
 * @returns - Error
 */
export const usePatchPaymentMethod = ({ dataEditPaymentMethod }: UsePatchPaymentMethodProps) => {
  const { trigger, loading, error } = useApi<PaymentMethodRequest, PaymentMethodResponse>({
    id: dataEditPaymentMethod?.id,
    url: "http://localhost:3000/api/v1/payment-methods",
    method: "PATCH"
  });

  /**
   * Actualiza un método de pago. Parsea los datos del formulario para enviarlos a la API.
   * @param formData - Datos del formulario sin procesar
   * @returns Promise con la respuesta de la API o undefined si hay un error
   */
  const patchPaymentMethod = async (formData: PaymentMethodRequest): Promise<PaymentMethodResponse | undefined> => {
    try {
      const parsedPaymentMethodData = parsePaymentMethodDataForBackend(formData);
      const response = await trigger(parsedPaymentMethodData as PaymentMethodRequest);
      return response;
    } catch (error) {
      console.log('Ocurrió un error al actualizar el método de pago', error);
    }
  }

  return { patchPaymentMethod, loading, error };
}