import { object, string } from "valibot";

/**
 * Schema to validate the payment method post request.
 * @property {string} name - The payment method name.
 */
export const paymentMethodPostSchema = object({
  name: string()
});