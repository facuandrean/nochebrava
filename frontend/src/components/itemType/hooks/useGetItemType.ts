import { useEffect, useState } from "react";
import { useApi } from "../../../hooks"
import type { ParsedItemType, ItemType, ItemTypeResponse } from "../models"
import { parseItemTypeData } from "../utils";

/**
 * Hook para obtener los tipos de item
 * @returns - Datos de los tipos de item
 * @returns - Datos de los tipos de item parseados
 * @returns - Estado de carga
 * @returns - Error
 */
export const useGetItemType = () => {
  const [dataItemType, setDataItemType] = useState<ItemType[]>([]);
  const [parsedDataItemType, setParsedDataItemType] = useState<ParsedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error } = useApi<unknown, ItemTypeResponse>({
    url: "http://localhost:3000/api/v1/item-types",
    method: "GET",
    autoFetch: true
  });

  useEffect(() => {
    if (data) {
      setDataItemType(data.data);
      const parsedItemType = parseItemTypeData(data.data);
      setParsedDataItemType(parsedItemType);

      setIsLoading(false);
    }
  }, [data]);

  return { dataItemType, parsedDataItemType, loading: isLoading, error }
}