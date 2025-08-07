import { useEffect, useState } from "react";
import { useApi } from "../../../hooks"
import type { Category, CategoryResponse, ParsedCategory } from "../models";
import { parseCategoryData } from "../utils/categoryHelpers";

/**
 * Obtiene las categorías de la API
 * 
 * @returns {Category[]} - Array de categorías
 * @returns {boolean} - Estado de carga
 * @returns {Error | null} - Error de la API
 */
export const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parsedDataCategories, setParsedDataCategories] = useState<ParsedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useApi<unknown, CategoryResponse>({
    url: "http://localhost:3000/api/v1/categories",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    if (data) {
      const parsedCategories = parseCategoryData(data.data);
      setCategories(data.data);
      setParsedDataCategories(parsedCategories);

      setIsLoading(false);
    }
  }, [data]);

  return { categories, parsedDataCategories, loading: isLoading, error };
}