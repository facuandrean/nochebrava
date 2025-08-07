export interface ItemType {
  item_type_id: string;
  name: string;
}

export interface ParsedItemType {
  id: string;
  item_type_id: string;
  name: string;
}

export interface ItemTypeRequest {
  name: string;
}

export interface ItemTypeResponse {
  data: ItemType[];
  status: string;
  message: string;
}