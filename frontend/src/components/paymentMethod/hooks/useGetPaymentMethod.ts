import { useEffect, useState } from "react";
import { useApi } from "../../../hooks"
import type { ParsedPaymentMethod, PaymentMethod, PaymentMethodResponse } from "../models"
import { parsePaymentMethodData } from "../utils";

/**
 * Hook para obtener los métodos de pago
 * @returns - Datos de los métodos de pago
 * @returns - Datos de los métodos de pago parseados
 * @returns - Estado de carga
 * @returns - Error
 */
export const useGetPaymentMethod = () => {
  const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethod[]>([]);
  const [parsedDataPaymentMethod, setParsedDataPaymentMethod] = useState<ParsedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useApi<unknown, PaymentMethodResponse>({
    url: "http://localhost:3000/api/v1/payment-methods",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    if (data) {
      setDataPaymentMethod(data.data);
      const parsedPaymentMethod = parsePaymentMethodData(data.data);
      setParsedDataPaymentMethod(parsedPaymentMethod);

      setIsLoading(false);
    }
  }, [data]);

  return { dataPaymentMethod, parsedDataPaymentMethod, loading: isLoading, error }
}