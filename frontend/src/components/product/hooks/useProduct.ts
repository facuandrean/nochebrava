import { useFetch } from "../../../hooks";
import type { Product } from "../models";

const API_URL = "http://localhost:3000/api/v1/products";

export const useProduct = () => {
  const { data, loading, error } = useFetch<{
    status: string;
    message: string;
    data: Product[]
  }>(API_URL);

  const products = data?.data ?? [];

  return {
    products,
    loading,
    error,
  };
}; 