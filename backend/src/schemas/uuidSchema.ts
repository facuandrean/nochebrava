import { custom, object, pipe, string } from "valibot";
import { isUUID } from "../utils/uuid";

export const uuidSchema = object({
  uuid: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Invalid UUID format')
  ),
})