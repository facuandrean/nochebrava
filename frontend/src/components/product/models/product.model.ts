import type { Category } from "../../category";

export interface Product {
  product_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  categories: Category[];
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
  categories: Category[];
}

export interface ProductRequest {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
}

export interface ProductResponse {
  data: Product[];
  status: string;
  message: string;
}

export interface ProductCategoryRequest {
  product_id: string;
  category_ids: string[];
}

export interface ProductCategoryResponse {
  status: string;
  message: string;
  data: []
}