import { useApi } from "../../../hooks";
import type { ParsedPaymentMethod, PaymentMethodRequest, PaymentMethodResponse } from "../models"

interface UseDeletePaymentMethodProps {
  dataDeletePaymentMethod: ParsedPaymentMethod | null;
}

export const useDeletePaymentMethod = ({ dataDeletePaymentMethod }: UseDeletePaymentMethodProps) => {
  const { trigger, loading, error } = useApi<PaymentMethodRequest, PaymentMethodResponse>({
    id: dataDeletePaymentMethod?.id,
    url: "http://localhost:3000/api/v1/payment-methods",
    method: "DELETE"
  });

  const deletePaymentMethod = async (): Promise<PaymentMethodResponse | undefined> => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.log('Ocurrió un error al eliminar el método de pago', error);
    }
  }

  return { deletePaymentMethod, loading, error };
}