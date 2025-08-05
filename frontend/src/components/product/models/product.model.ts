export interface Product {
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParsedProduct {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
}

export interface ProductResponse {
  data: Product;
  status: string;
  message: string;
}

export interface ProductListResponse {
  data: Product[];
  status: string;
  message: string;
}