import { useApi } from "../../../hooks"
import type { ParsedItemType, ItemTypeRequest, ItemTypeResponse } from "../models"
import { parseItemTypeDataForBackend } from "../utils";

interface UsePatchItemTypeProps {
  dataEditItemType: ParsedItemType | null;
}

/**
 * Hook para actualizar un tipo de item
 * @param dataEditItemType - Datos del tipo de item a actualizar
 * @returns - Función para actualizar un tipo de item
 * @returns - Estado de carga
 * @returns - Error
 */
export const usePatchItemType = ({ dataEditItemType }: UsePatchItemTypeProps) => {
  const { trigger, loading, error } = useApi<ItemTypeRequest, ItemTypeResponse>({
    id: dataEditItemType?.id,
    url: "http://localhost:3000/api/v1/item-types",
    method: "PATCH"
  });

  /**
   * Actualiza un tipo de item. Parsea los datos del formulario para enviarlos a la API.
   * @param formData - Datos del formulario sin procesar
   * @returns Promise con la respuesta de la API o undefined si hay un error
   */
  const patchItemType = async (formData: ItemTypeRequest): Promise<ItemTypeResponse | undefined> => {
    try {
      const parsedItemTypeData = parseItemTypeDataForBackend(formData);
      const response = await trigger(parsedItemTypeData as ItemTypeRequest);
      return response;
    } catch (error) {
      console.log('Ocurrió un error al actualizar el tipo de item', error);
    }
  }

  return { patchItemType, loading, error };
}