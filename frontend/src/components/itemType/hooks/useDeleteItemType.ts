import { useApi } from "../../../hooks";
import type { ParsedItemType, ItemTypeRequest, ItemTypeResponse } from "../models"

interface UseDeleteItemTypeProps {
  dataDeleteItemType: ParsedItemType | null;
}

export const useDeleteItemType = ({ dataDeleteItemType }: UseDeleteItemTypeProps) => {
  const { trigger, loading, error } = useApi<ItemTypeRequest, ItemTypeResponse>({
    id: dataDeleteItemType?.id,
    url: "http://localhost:3000/api/v1/item-types",
    method: "DELETE"
  });

  const deleteItemType = async (): Promise<ItemTypeResponse | undefined> => {
    try {
      const response = await trigger();
      return response;
    } catch (error) {
      console.log('Ocurrió un error al eliminar el tipo de item', error);
    }
  }

  return { deleteItemType, loading, error };
}