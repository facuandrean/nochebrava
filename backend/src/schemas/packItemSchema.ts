import { array, custom, number, object, optional, pipe, string, union } from "valibot";
import { isUUID } from "../utils/uuid";

// Schema base para un pack item individual
const packItemObjectSchema = object({
    pack_id: pipe(
        string(),
        custom((input) => isUUID(input as string), 'Formato de ID de pack inválido')
    ),
    product_id: pipe(
        string(),
        custom((input) => isUUID(input as string), 'Formato de ID de producto inválido')
    ),
    quantity: pipe(
        number(),
    )
});

// Schema que acepta tanto un objeto único como un array de pack items
export const packItemPostSchema = union([
    packItemObjectSchema,
    array(packItemObjectSchema)
]);

export const packItemUpdateSchema = object({
    pack_id: optional(
        pipe(
            string(),
            custom((input) => isUUID(input as string), 'Formato de ID de pack inválido')
        )
    ),
    product_id: optional(
        pipe(
            string(),
            custom((input) => isUUID(input as string), 'Formato de ID de producto inválido')
        )
    ),
    quantity: optional(
        pipe(
            number(),
        )
    )
});
