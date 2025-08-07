import { useApi } from "../../../hooks"
import type { ItemTypeRequest, ItemTypeResponse } from "../models"
import { parseItemTypeDataForBackend } from "../utils";

/**
 * Hook para crear un tipo de item
 * @returns - Función para crear un tipo de item
 * @returns - Estado de carga
 * @returns - Error
 */
export const usePostItemType = () => {
  const { trigger, loading, error } = useApi<ItemTypeRequest, ItemTypeResponse>({
    url: "http://localhost:3000/api/v1/item-types",
    method: "POST"
  });

  /**
   * Crea un nuevo tipo de item. Parsea los datos del formulario para enviarlos a la API.
   * @param formData - Datos del formulario sin procesar
   * @returns Promise con la respuesta de la API o undefined si hay un error
   */
  const postItemType = async (formData: ItemTypeRequest) => {
    try {
      const parsedItemTypeData = parseItemTypeDataForBackend(formData);
      const response = await trigger(parsedItemTypeData as ItemTypeRequest);
      return response;
    } catch (error) {
      console.log('Ocurrió un error al crear el tipo de item', error);
    }
  }

  return { postItemType, loading, error }
}