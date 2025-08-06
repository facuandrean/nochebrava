export interface Category {
  category_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  data: Category[];
  status: string;
  message: string;
}

export interface ParsedCategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRequest {
  name: string;
  description: string | null;
}
