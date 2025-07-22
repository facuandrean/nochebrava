export interface Category {
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}