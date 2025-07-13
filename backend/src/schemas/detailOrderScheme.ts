import { object, pipe, string, custom, number, minValue } from "valibot";
import { isUUID } from "../utils/uuid";

export const detailOrderPostSchema = object({
  item_id: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Invalid item ID format')
  ),
  item_type: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Invalid item TYPE format')
  ),
  quantity: pipe(
    number(),
    minValue(1, 'Quantity must be greater than 0')
  ),
})
