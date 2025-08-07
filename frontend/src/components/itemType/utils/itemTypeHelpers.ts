import type { ParsedItemType, ItemType, ItemTypeRequest } from "../models";

/**
 * Parsea los datos del tipo de item para mostrar en la tabla
 * @param data - Datos de los tipos de item
 * @returns - Datos de los tipos de item parseados
 */
export const parseItemTypeData = (data: ItemType[]): ParsedItemType[] => {
  return data.map((itemType) => ({
    ...itemType,
    id: itemType.item_type_id,
  }));
}

/**
 * Parsea los datos del tipo de item para enviar al backend
 * @param data - Datos del formulario sin procesar
 * @returns - Datos del formulario parseados
 */
export const parseItemTypeDataForBackend = (data: ItemTypeRequest): Partial<ItemTypeRequest> => {
  const itemTypeData: Partial<ItemTypeRequest> = {};

  if (data.name) itemTypeData.name = data.name;

  return itemTypeData;
}