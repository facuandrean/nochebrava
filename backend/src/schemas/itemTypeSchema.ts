import { minLength, object, pipe, string } from "valibot";

export const itemTypeSchema = object({
    name: pipe(
        string(),
        minLength(3, "El nombre debe tener más de 3 caracteres.")
    )
});