// Modelo que refleja exactamente lo que viene del backend
export interface PackItem {
  pack_item_id: string;
  pack_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface PackItemListResponse {
  data: PackItem[];
  status: string;
  message: string;
}

// Versión procesada para mostrar en el frontend
export interface ParsedPackItem {
  id: string;
  pack_item_id: string;
  pack_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

// Lo que se envía al backend (crear/editar pack items)
export interface PackItemRequest {
  pack_id: string;
  product_id: string;
  quantity: number;
} 