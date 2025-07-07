import { custom, number, object, optional, pipe, string } from "valibot";
import { isUUID } from "../utils/uuid";


export const packItemPostSchema = object({
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
