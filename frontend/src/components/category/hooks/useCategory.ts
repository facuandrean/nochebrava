import { useFetch } from "../../../hooks";
import type { Category } from "../models";

const API_URL = "http://localhost:3000/api/v1/categories";

export const useCategory = () => {
  const { data, loading, error } = useFetch<{
    status: string;
    message: string;
    data: Category[]
  }>(API_URL);

  const categories = data?.data ?? [];

  return {
    categories,
    loading,
    error,
  };
}