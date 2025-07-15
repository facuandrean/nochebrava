import { object, string, number, custom, pipe } from "valibot";
import { isUUID } from "../utils/uuid";

export const detailOrderPostSchema = object({
  order_id: pipe(
    string(),
    custom((value) => isUUID(value as string), "El id de la orden no es válido")
  ),
  item_type: pipe(
    string(),
    custom((value) => isUUID(value as string), "El tipo de item no es válido")
  ),
  item_id: string(),
  quantity: number(),
  unit_price: number(),
  total_price: number()
});