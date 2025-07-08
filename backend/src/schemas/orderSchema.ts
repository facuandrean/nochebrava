import { object, pipe, string, custom } from "valibot";
import { isUUID } from "../utils/uuid";

export const orderPostSchema = object({
  payment_method_id: pipe(
    string(),
    custom((value) => isUUID(value as string), "Metodo de pago invalido"
  )),
})
