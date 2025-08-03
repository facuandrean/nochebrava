// Modelo que refleja exactamente lo que viene del backend
export default interface Pack {
  pack_id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackResponse {
  data: Pack;
  status: string;
  message: string;
}

// Versión procesada para mostrar en el frontend (tablas, etc.)
export interface ParsedPack {
  id: string;
  pack_id: string;
  name: string;
  description: string | null;
  price: number;
  active: string;
  created_at: string;
  updated_at: string;
}

// Lo que se envía al backend (crear/editar)
export interface PackRequest {
  name: string;
  description: string | null;
  price: number;
  active: boolean;
} 