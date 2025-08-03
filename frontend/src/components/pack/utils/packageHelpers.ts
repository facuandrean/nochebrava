import { handleDate } from "../../../utils/date"
import type { Pack, PackItemRequest, PackRequest, ParsedPack, ProductForSelection } from "../models"

export const parsePackData = (packs: Pack[]): ParsedPack[] => {
  return packs.map((pack) => ({
    ...pack,
    id: pack.pack_id,
    active: pack.active ? "Si" : "No",
    created_at: handleDate(pack.created_at),
    updated_at: handleDate(pack.updated_at)
  }));
};

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

export const parsePackItemsDataForBackend = (selectedProducts: ProductForSelection[], packId: string): PackItemRequest[] => {
  console.log('selectedProduct  ssssssssssssss', selectedProducts);
  return selectedProducts.map((product) => ({
    pack_id: packId,
    product_id: product.product_id,
    quantity: product.quantity
  }));
}