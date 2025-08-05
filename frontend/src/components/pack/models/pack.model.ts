import type { PackItem } from "./packItem.model";

// Lo que se envía al backend (crear/editar)
export interface PackRequest {
  name: string;
  description: string | null;
  price: number;
  active: boolean;
}

// Respuesta del backend para obtener múltiples packs (GET /packs)
export interface PackListResponse {
  data: Pack[];
  status: string;
  message: string;
}

// Respuesta del backend para un pack individual (POST, PUT, etc.)
export interface PackResponse {
  data: Pack;
  status: string;
  message: string;
}

// Modelo que refleja la información de un pack.
export default interface Pack {
  pack_id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Versión procesada para mostrar en el frontend (tablas, etc.)
export interface ParsedPack {
  id: string; // es el id del pack, pero puesto en una variable que sea idéntica a todas las entidades, para trabajar en la tabla.
  pack_id: string;
  name: string;
  description: string | null;
  price: number;
  active: string;
  created_at: string;
  updated_at: string;
  pack_items: PackItem[];
}

