import { handleDate } from "../../../utils/date";
import type { Pack, PackItemRequest, PackRequest, ParsedPack, ProductForSelection } from "../models"

/**
 * Transforma los datos de los packs para mostrarlos en la tabla.
 * @param packs - Los packs a transformar. Es del tipo Pack y no PackResponse porque PackResponse tiene un atributo data y este atributo data es del tipo Pack, y éste atributo es el que recibe esta función.
 * @returns Los packs transformados.
 */
export const parsePackData = (packs: Pack[]): ParsedPack[] => {
  const parsedPacks = packs.map((pack) => ({
    id: pack.pack_id,
    pack_id: pack.pack_id,
    name: pack.name,
    description: pack.description,
    price: pack.price,
    active: pack.active ? "Si" : "No",
    created_at: handleDate(pack.created_at),
    updated_at: handleDate(pack.updated_at),
    pack_items: pack.pack_items
  }));

  return parsedPacks;
};

/**
 * Transforma los datos del formulario de creación de pack para enviarlos al backend.
 * @param formData - Los datos del formulario de creación de pack.
 * @returns Los datos del formulario de creación de pack transformados para enviarlos al backend.
 */
export const parsePackDataForBackend = (formData: PackRequest): PackRequest => {
  const packData: PackRequest = {
    name: formData.name || "",
    description: formData.description && formData.description.trim().length >= 10
      ? formData.description.trim()
      : "",
    price: formData.price ? Number(formData.price) : 0,
    active: formData.active
  };

  return packData;
}

/**
 * Transforma los datos de los productos seleccionados para enviarlos al backend.
 * @param selectedProducts - Los productos seleccionados.
 * @param packId - El id del pack.
 * @returns Los datos de los productos seleccionados transformados para enviarlos al backend.
 */
export const parsePackItemsDataForBackend = (selectedProducts: ProductForSelection[], packId: string): PackItemRequest[] => {
  return selectedProducts.map((product) => ({
    pack_id: packId,
    product_id: product.product_id,
    quantity: product.quantity
  }));
}