import { useEffect, useState } from "react"
import type { ParsedProduct, Product, ProductResponse } from "../models"
import { parseProductData } from "../utils";
import { useApi } from "../../../hooks";

/**
 * Hook para obtener los productos
 * @returns - Datos de los productos
 * @returns - Datos de los productos parseados
 * @returns - Estado de carga
 * @returns - Error
 */
export const useGetProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [parsedDataProducts, setParsedDataProducts] = useState<ParsedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useApi<unknown, ProductResponse>({
    url: "http://localhost:3000/api/v1/products",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    if (data) {
      const parsedProducts = parseProductData(data.data);
      setProducts(data.data);
      setParsedDataProducts(parsedProducts);

      setIsLoading(false);
    }
  }, [data]);

  return { products, parsedDataProducts, loading: isLoading, error };
}