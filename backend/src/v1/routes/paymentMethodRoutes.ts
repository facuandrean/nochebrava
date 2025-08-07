import { Router } from "express";
import { paymentMethodController } from "../../controllers/paymentMethodController";
import { validateBody } from "../../middlewares/validateBody";
import { paymentMethodPostSchema } from "../../schemas/paymentMethodSchema";

const paymentMethodRouter = Router();

paymentMethodRouter.get("/", paymentMethodController.getAllPaymentMethods);
paymentMethodRouter.get("/:payment_method_id", paymentMethodController.getPaymentMethodById);
paymentMethodRouter.post("/", validateBody(false, paymentMethodPostSchema, paymentMethodPostSchema), paymentMethodController.postPaymentMethod);
paymentMethodRouter.patch("/:payment_method_id", validateBody(true, paymentMethodPostSchema, paymentMethodPostSchema), paymentMethodController.patchPaymentMethod);
paymentMethodRouter.delete("/:payment_method_id", paymentMethodController.deletePaymentMethod);

export default paymentMethodRouter;