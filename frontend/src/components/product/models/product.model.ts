export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParsedProduct {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: string;
  created_at: string;
  updated_at: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}