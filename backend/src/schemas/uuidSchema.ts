import { custom, object, pipe, string } from "valibot";
import { isUUID } from "../utils/uuid";

/**
 * This schema is used to validate the UUID format.
 * @property {string} uuid - The UUID to validate.
 */
export const uuidSchema = object({
  uuid: pipe(
    string(),
    custom((input) => isUUID(input as string), 'Invalid UUID format')
  ),
})