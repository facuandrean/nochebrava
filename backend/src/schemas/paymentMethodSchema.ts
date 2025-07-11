import { object, string } from "valibot";

export const paymentMethodPostSchema = object({
  name: string()
});